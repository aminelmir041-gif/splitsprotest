from fastapi import FastAPI, BackgroundTasks, HTTPException, UploadFile, File, Header, Request
from fastapi.responses import FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional
from pathlib import Path
from zoneinfo import ZoneInfo
from threading import Lock
from datetime import date, datetime, timedelta, timezone
import json
import logging
import os
import re
import time
import uuid
import hmac
import hashlib
from urllib.parse import urlencode
import redis
from redis.exceptions import WatchError

from .crm_admin import assign_client_owner, client_hubspot_url, get_active_owners
from .lead_integrations import (
    derive_lead_source,
    get_hubspot_clients,
    notify_quote,
    record_outbound_sms_to_hubspot,
    record_sms_event_to_hubspot,
    sync_quote_to_hubspot,
    valid_admin_key,
)
from .sms_gateway import log_sms_event, parse_webhook, send_sms, sms_configured

app = FastAPI(title="SplitsPro Lead API")

origins = [o.strip() for o in (os.environ.get("CORS_ORIGINS") or "https://splitspro.com.au,https://www.splitspro.com.au").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("/tmp/splitspro_uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class QuoteCreate(BaseModel):
    name: str
    phone: str
    service: str
    suburb: str
    email: Optional[str] = ""
    address: Optional[str] = ""
    preferred_date: Optional[str] = ""
    message: Optional[str] = ""
    photo_url: Optional[str] = ""
    page_url: Optional[str] = ""
    landing_page: Optional[str] = ""
    referrer: Optional[str] = ""
    utm_source: Optional[str] = ""
    utm_medium: Optional[str] = ""
    utm_campaign: Optional[str] = ""
    utm_term: Optional[str] = ""
    utm_content: Optional[str] = ""
    gclid: Optional[str] = ""
    fbclid: Optional[str] = ""

    @field_validator("name", "phone", "service", "suburb")
    @classmethod
    def not_blank(cls, value):
        if not value or not value.strip():
            raise ValueError("Field cannot be empty")
        return value.strip()

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, value):
        if len(re.sub(r"\D", "", value)) < 8:
            raise ValueError("Please enter a valid phone number")
        return value.strip()



class BookingCreate(QuoteCreate):
    booking_date: str
    booking_window: str

    @field_validator("booking_date")
    @classmethod
    def valid_booking_date(cls, value):
        try:
            date.fromisoformat(value)
        except Exception as exc:
            raise ValueError("Please choose a valid installation date") from exc
        return value

    @field_validator("booking_window")
    @classmethod
    def valid_booking_window(cls, value):
        if value not in {"Morning", "Afternoon"}:
            raise ValueError("Please choose morning or afternoon")
        return value


class SmsCreate(BaseModel):
    to: str
    body: str
    staff_name: Optional[str] = ""

    @field_validator("to", "body")
    @classmethod
    def sms_not_blank(cls, value):
        if not value or not value.strip():
            raise ValueError("Field cannot be empty")
        return value.strip()


class OwnerAssign(BaseModel):
    owner_id: str

    @field_validator("owner_id")
    @classmethod
    def owner_not_blank(cls, value):
        if not value or not value.strip():
            raise ValueError("Owner is required")
        return value.strip()


@app.get("/")
@app.get("/api")
@app.get("/api/")
def health():
    resend_ready = bool(
        (os.environ.get("RESEND_API_KEY") or "").strip()
        and (os.environ.get("RESEND_FROM") or "").strip()
    )
    smtp_ready = bool(
        (os.environ.get("SMTP_HOST") or "").strip()
        and (os.environ.get("SMTP_USER") or "").strip()
        and (os.environ.get("SMTP_PASSWORD") or "")
    )
    return {
        "service": "SplitsPro Lead API",
        "status": "ok",
        "hubspot_configured": bool((os.environ.get("HUBSPOT_PRIVATE_APP_TOKEN") or "").strip()),
        "client_list_enabled": bool((os.environ.get("HUBSPOT_PRIVATE_APP_TOKEN") or "").strip()),
        "admin_api_configured": bool((os.environ.get("ADMIN_API_KEY") or "").strip()),
        "email_provider": "resend" if resend_ready else ("smtp" if smtp_ready else "none"),
        "email_configured": resend_ready or smtp_ready,
        "sms_provider": "infinireach",
        "sms_configured": sms_configured(),
        "sms_webhook_configured": bool((os.environ.get("INFINIREACH_WEBHOOK_SECRET") or "").strip()),
    }



BOOKING_TIMEZONE = ZoneInfo(os.environ.get("BOOKING_TIMEZONE", "Australia/Sydney"))
BOOKING_SLOT_CAPACITY = max(1, int(os.environ.get("BOOKING_SLOT_CAPACITY", "1")))
BOOKING_LOOKAHEAD_DAYS = max(2, min(30, int(os.environ.get("BOOKING_LOOKAHEAD_DAYS", "14"))))
BOOKING_WORKDAYS = {
    int(value)
    for value in (os.environ.get("BOOKING_WORKDAYS", "0,1,2,3,4,5,6").split(","))
    if value.strip().isdigit() and 0 <= int(value) <= 6
}
BOOKING_BLOCKS_FILE = Path(__file__).parent / "booking_blocks.json"
BOOKING_PAYMENT_LINK_URL = (os.environ.get("BOOKING_PAYMENT_LINK_URL") or "").strip()
BOOKING_HOLD_SECONDS = max(600, min(7200, int(os.environ.get("BOOKING_HOLD_SECONDS", "3600"))))
STRIPE_WEBHOOK_SECRET = (os.environ.get("STRIPE_WEBHOOK_SECRET") or "").strip()


def _booking_redis():
    redis_url = (os.environ.get("REDIS_URL") or "").strip()
    if not redis_url:
        raise RuntimeError("Booking storage is not configured")
    return redis.Redis.from_url(
        redis_url,
        decode_responses=True,
        socket_timeout=8,
        socket_connect_timeout=8,
        retry_on_timeout=True,
        health_check_interval=30,
    )


def _slot_key(booking_date: str, booking_window: str) -> str:
    return f"splitspro:booking:{booking_date}:{booking_window.lower()}"


def _hold_key(reference: str) -> str:
    return f"splitspro:booking-hold:{reference}"


def _paid_key(reference: str) -> str:
    return f"splitspro:booking-paid:{reference}"


def _session_key(session_id: str) -> str:
    return f"splitspro:stripe-session:{session_id}"


def _slot_lock_key(booking_date: str, booking_window: str) -> str:
    return f"splitspro:booking-lock:{booking_date}:{booking_window.lower()}"


def _manual_blocks() -> set[tuple[str, str]]:
    try:
        payload = json.loads(BOOKING_BLOCKS_FILE.read_text())
    except Exception:
        payload = {"blocked": []}
    blocked = set()
    for item in payload.get("blocked", []):
        booking_date = str(item.get("date") or "").strip()
        booking_window = str(item.get("window") or "").strip()
        if not booking_date:
            continue
        if booking_window == "All":
            blocked.add((booking_date, "Morning"))
            blocked.add((booking_date, "Afternoon"))
        elif booking_window in {"Morning", "Afternoon"}:
            blocked.add((booking_date, booking_window))
    return blocked


def _pending_hold_count(client, booking_date: str, booking_window: str) -> int:
    count = 0
    for key in client.scan_iter(match="splitspro:booking-hold:*", count=100):
        try:
            raw = client.get(key)
            if not raw:
                continue
            hold = json.loads(raw)
            if hold.get("booking_date") == booking_date and hold.get("booking_window") == booking_window:
                count += 1
        except Exception:
            continue
    return count


def _slot_count(client, booking_date: str, booking_window: str) -> int:
    try:
        confirmed = int(client.get(_slot_key(booking_date, booking_window)) or 0)
    except (TypeError, ValueError):
        confirmed = 0
    return confirmed + _pending_hold_count(client, booking_date, booking_window)


def _reserve_booking_slot(booking_date: str, booking_window: str) -> bool:
    client = _booking_redis()
    key = _slot_key(booking_date, booking_window)
    while True:
        try:
            with client.pipeline() as pipe:
                pipe.watch(key)
                current = int(pipe.get(key) or 0)
                if current >= BOOKING_SLOT_CAPACITY:
                    pipe.unwatch()
                    return False
                pipe.multi()
                pipe.incr(key)
                pipe.expire(key, 60 * 60 * 24 * 35)
                pipe.execute()
                return True
        except WatchError:
            continue


def _release_booking_slot(booking_date: str, booking_window: str) -> None:
    client = _booking_redis()
    key = _slot_key(booking_date, booking_window)
    try:
        value = int(client.get(key) or 0)
        if value <= 1:
            client.delete(key)
        else:
            client.decr(key)
    except Exception:
        logging.exception("Could not release booking slot %s %s", booking_date, booking_window)


def _available_booking_slots(limit: int = 8):
    client = _booking_redis()
    blocked = _manual_blocks()
    today_local = datetime.now(BOOKING_TIMEZONE).date()
    slots = []

    # Ping once so failures are returned immediately instead of showing false availability.
    client.ping()

    for offset in range(1, BOOKING_LOOKAHEAD_DAYS + 1):
        job_date = today_local + timedelta(days=offset)
        if job_date.weekday() not in BOOKING_WORKDAYS:
            continue

        within_two_days = offset <= 2
        for window in ("Morning", "Afternoon"):
            key = (job_date.isoformat(), window)
            if key in blocked:
                continue
            used = _slot_count(client, *key)
            if used >= BOOKING_SLOT_CAPACITY:
                continue
            slots.append(
                {
                    "date": job_date.isoformat(),
                    "window": window,
                    "remaining": BOOKING_SLOT_CAPACITY - used,
                    "within_two_days": within_two_days,
                }
            )
            if len(slots) >= limit:
                return slots

    return slots


@app.get("/api/booking-slots")
def booking_slots(response: Response, limit: int = 8):
    safe_limit = max(1, min(int(limit), 20))
    response.headers["Cache-Control"] = "no-store, max-age=0"
    response.headers["Pragma"] = "no-cache"

    last_error = None
    for attempt in range(3):
        try:
            slots = _available_booking_slots(safe_limit)
            return {
                "timezone": str(BOOKING_TIMEZONE),
                "capacity_per_slot": BOOKING_SLOT_CAPACITY,
                "slots": slots,
            }
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        except Exception as exc:
            last_error = exc
            if attempt < 2:
                time.sleep(0.35 * (attempt + 1))
                continue

    logging.exception("Could not load booking availability after retries: %s", last_error)
    raise HTTPException(status_code=502, detail="Could not load installation availability") from last_error



def _validate_booking_request(payload: BookingCreate):
    try:
        requested_date = date.fromisoformat(payload.booking_date)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Please choose a valid installation date") from exc

    today_local = datetime.now(BOOKING_TIMEZONE).date()
    if requested_date <= today_local:
        raise HTTPException(status_code=400, detail="Please choose a future installation date")
    if requested_date.weekday() not in BOOKING_WORKDAYS:
        raise HTTPException(status_code=400, detail="That day is not available for installation")
    if (payload.booking_date, payload.booking_window) in _manual_blocks():
        try:
            alternatives = _available_booking_slots(6)
        except Exception:
            alternatives = []
        raise HTTPException(
            status_code=409,
            detail={"message": "That installation time is no longer available.", "slots": alternatives},
        )


def _booking_checkout_url(reference: str) -> str:
    if not BOOKING_PAYMENT_LINK_URL:
        raise HTTPException(status_code=503, detail="Online deposit payments are not configured")
    separator = "&" if "?" in BOOKING_PAYMENT_LINK_URL else "?"
    return f"{BOOKING_PAYMENT_LINK_URL}{separator}{urlencode({'client_reference_id': reference})}"


@app.post("/api/booking-checkout")
def create_booking_checkout(payload: BookingCreate):
    _validate_booking_request(payload)
    client = _booking_redis()
    reference = uuid.uuid4().hex
    lead = payload.model_dump()
    lead["preferred_date"] = payload.booking_date
    lead["id"] = str(uuid.uuid4())
    lead["created_at"] = now_iso()
    lead["lead_source"] = derive_lead_source(lead)

    hold = {
        "reference": reference,
        "booking_date": payload.booking_date,
        "booking_window": payload.booking_window,
        "lead": lead,
        "created_at": now_iso(),
    }

    try:
        with client.lock(
            _slot_lock_key(payload.booking_date, payload.booking_window),
            timeout=10,
            blocking_timeout=5,
        ):
            if _slot_count(client, payload.booking_date, payload.booking_window) >= BOOKING_SLOT_CAPACITY:
                try:
                    alternatives = _available_booking_slots(6)
                except Exception:
                    alternatives = []
                raise HTTPException(
                    status_code=409,
                    detail={"message": "That installation time has just filled up.", "slots": alternatives},
                )
            client.set(_hold_key(reference), json.dumps(hold), ex=BOOKING_HOLD_SECONDS)
    except HTTPException:
        raise
    except Exception as exc:
        logging.exception("Could not create booking hold: %s", exc)
        raise HTTPException(status_code=503, detail="Live booking is temporarily unavailable") from exc

    return {
        "accepted": True,
        "payment_required": True,
        "deposit_amount": 300,
        "currency": "AUD",
        "reference": reference,
        "checkout_url": _booking_checkout_url(reference),
        "hold_expires_in": BOOKING_HOLD_SECONDS,
    }


def _verify_stripe_signature(raw_body: bytes, signature_header: str) -> None:
    if not STRIPE_WEBHOOK_SECRET:
        raise RuntimeError("Stripe webhook secret is not configured")
    parts = {}
    signatures = []
    for item in (signature_header or "").split(","):
        if "=" not in item:
            continue
        key, value = item.split("=", 1)
        if key == "v1":
            signatures.append(value)
        else:
            parts[key] = value
    timestamp = parts.get("t")
    if not timestamp or not signatures:
        raise PermissionError("Missing Stripe signature")
    try:
        ts = int(timestamp)
    except ValueError as exc:
        raise PermissionError("Invalid Stripe signature timestamp") from exc
    if abs(int(time.time()) - ts) > 300:
        raise PermissionError("Expired Stripe signature")
    signed = f"{timestamp}.{raw_body.decode('utf-8')}".encode("utf-8")
    expected = hmac.new(
        STRIPE_WEBHOOK_SECRET.encode("utf-8"),
        signed,
        hashlib.sha256,
    ).hexdigest()
    if not any(hmac.compare_digest(expected, value) for value in signatures):
        raise PermissionError("Invalid Stripe signature")


def _complete_paid_booking(reference: str, session_id: str, background_tasks: BackgroundTasks):
    client = _booking_redis()
    paid_raw = client.get(_paid_key(reference))
    if paid_raw:
        paid = json.loads(paid_raw)
        if session_id:
            client.set(_session_key(session_id), json.dumps(paid), ex=60 * 60 * 24 * 90)
        return paid

    hold_raw = client.get(_hold_key(reference))
    if not hold_raw:
        result = {
            "status": "needs_reschedule",
            "reference": reference,
            "session_id": session_id,
            "message": "Payment received, but the original booking hold expired. SplitsPro will contact you to reschedule.",
        }
        client.set(_paid_key(reference), json.dumps(result), ex=60 * 60 * 24 * 90)
        if session_id:
            client.set(_session_key(session_id), json.dumps(result), ex=60 * 60 * 24 * 90)
        return result

    hold = json.loads(hold_raw)
    booking_date = hold["booking_date"]
    booking_window = hold["booking_window"]
    lead = hold["lead"]

    with client.lock(_slot_lock_key(booking_date, booking_window), timeout=10, blocking_timeout=5):
        confirmed = int(client.get(_slot_key(booking_date, booking_window)) or 0)
        if confirmed >= BOOKING_SLOT_CAPACITY:
            status = "needs_reschedule"
        else:
            client.incr(_slot_key(booking_date, booking_window))
            client.expire(_slot_key(booking_date, booking_window), 60 * 60 * 24 * 35)
            status = "confirmed"
        client.delete(_hold_key(reference))

    lead["deposit_paid"] = True
    lead["deposit_amount"] = 300
    lead["deposit_currency"] = "AUD"
    lead["stripe_session_id"] = session_id
    lead["booking_payment_status"] = status
    if status != "confirmed":
        lead["message"] = (lead.get("message") or "") + " DEPOSIT PAID — selected slot requires rescheduling."

    try:
        crm_result = sync_quote_to_hubspot(lead)
        lead["crm_saved"] = bool(crm_result)
        if crm_result:
            lead["hubspot_contact_id"] = crm_result.get("contact_id", "")
            lead["hubspot_deal_id"] = crm_result.get("deal_id", "")
        background_tasks.add_task(notify_quote, lead)
    except Exception as exc:
        logging.exception("Paid booking CRM/notification step failed: %s", exc)

    result = {
        "status": status,
        "reference": reference,
        "session_id": session_id,
        "booking_date": booking_date,
        "booking_window": booking_window,
        "deposit_amount": 300,
        "currency": "AUD",
    }
    client.set(_paid_key(reference), json.dumps(result), ex=60 * 60 * 24 * 90)
    if session_id:
        client.set(_session_key(session_id), json.dumps(result), ex=60 * 60 * 24 * 90)
    return result


@app.post("/api/stripe/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    raw_body = await request.body()
    signature = request.headers.get("stripe-signature", "")
    try:
        _verify_stripe_signature(raw_body, signature)
        event = json.loads(raw_body.decode("utf-8"))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except PermissionError as exc:
        raise HTTPException(status_code=400, detail="Invalid Stripe signature") from exc
    except (json.JSONDecodeError, UnicodeDecodeError) as exc:
        raise HTTPException(status_code=400, detail="Invalid webhook payload") from exc

    event_type = event.get("type", "")
    session = ((event.get("data") or {}).get("object") or {})
    reference = session.get("client_reference_id") or ""
    session_id = session.get("id") or ""

    if not reference:
        return Response(status_code=200)

    if event_type in {"checkout.session.completed", "checkout.session.async_payment_succeeded"}:
        if event_type == "checkout.session.completed" and session.get("payment_status") != "paid":
            return Response(status_code=200)
        _complete_paid_booking(reference, session_id, background_tasks)
    elif event_type in {"checkout.session.async_payment_failed", "checkout.session.expired"}:
        client = _booking_redis()
        client.delete(_hold_key(reference))

    return Response(status_code=200)


@app.get("/api/booking-payment-status")
def booking_payment_status(session_id: str = ""):
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing checkout session")
    client = _booking_redis()
    raw = client.get(_session_key(session_id))
    if not raw:
        return {"status": "processing"}
    return json.loads(raw)


@app.post("/api/bookings")
def create_booking(payload: BookingCreate, background_tasks: BackgroundTasks):
    raise HTTPException(
        status_code=410,
        detail={
            "message": "A $300 deposit is now required to secure installation bookings.",
            "payment_required": True,
        },
    )


@app.post("/api/quotes")
def create_quote(payload: QuoteCreate, background_tasks: BackgroundTasks):
    lead = payload.model_dump()
    lead["id"] = str(uuid.uuid4())
    lead["created_at"] = now_iso()
    lead["lead_source"] = derive_lead_source(lead)

    crm_result = sync_quote_to_hubspot(lead)
    lead["crm_saved"] = bool(crm_result)
    if crm_result:
        lead["hubspot_contact_id"] = crm_result.get("contact_id", "")
        lead["hubspot_deal_id"] = crm_result.get("deal_id", "")

    background_tasks.add_task(notify_quote, lead)

    return {
        **lead,
        "accepted": True,
    }


def _require_admin(x_admin_key: Optional[str]) -> None:
    if not valid_admin_key(x_admin_key):
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/api/admin/owners")
def owner_list(x_admin_key: Optional[str] = Header(default=None, alias="X-Admin-Key")):
    _require_admin(x_admin_key)
    try:
        return {"owners": get_active_owners()}
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Could not load staff list") from exc


@app.get("/api/admin/clients")
def client_list(
    limit: int = 100,
    x_admin_key: Optional[str] = Header(default=None, alias="X-Admin-Key"),
):
    _require_admin(x_admin_key)
    try:
        clients = get_hubspot_clients(limit=limit)
        owners = {owner["id"]: owner["name"] for owner in get_active_owners()}
        for client in clients:
            client["owner_name"] = owners.get(client.get("owner_id") or "", "Unassigned")
            client["hubspot_url"] = client_hubspot_url(client["id"])
        return {"clients": clients}
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Could not load client list") from exc


@app.post("/api/admin/clients/{contact_id}/owner")
def set_client_owner(
    contact_id: str,
    payload: OwnerAssign,
    x_admin_key: Optional[str] = Header(default=None, alias="X-Admin-Key"),
):
    _require_admin(x_admin_key)
    try:
        assign_client_owner(contact_id, payload.owner_id)
        return {"ok": True, "contact_id": contact_id, "owner_id": payload.owner_id}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Could not assign client") from exc


@app.post("/api/sms/send")
def send_sms_endpoint(
    payload: SmsCreate,
    background_tasks: BackgroundTasks,
    x_admin_key: Optional[str] = Header(default=None, alias="X-Admin-Key"),
):
    _require_admin(x_admin_key)
    try:
        result = send_sms(payload.to, payload.body)
        background_tasks.add_task(
            record_outbound_sms_to_hubspot,
            payload.to,
            payload.body,
            payload.staff_name or "",
        )
        return result
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="SMS provider request failed") from exc


@app.post("/api/sms/webhook")
async def sms_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_webhook_signature: Optional[str] = Header(default=None, alias="X-Webhook-Signature"),
):
    raw_body = await request.body()
    try:
        event = parse_webhook(raw_body, x_webhook_signature or "")
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except PermissionError as exc:
        raise HTTPException(status_code=401, detail="Invalid webhook signature") from exc
    except (json.JSONDecodeError, UnicodeDecodeError) as exc:
        raise HTTPException(status_code=400, detail="Invalid webhook payload") from exc
    log_sms_event(event)
    background_tasks.add_task(record_sms_event_to_hubspot, event)
    return Response(status_code=200)


@app.on_event("startup")
def verify_booking_storage():
    try:
        _booking_redis().ping()
        logging.info("Booking storage connected")
    except Exception as exc:
        logging.exception("Booking storage connection failed: %s", exc)


@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image must be 10MB or smaller.")
    content_type = file.content_type or "application/octet-stream"
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Please upload an image file (JPG, PNG, WEBP).")

    ext = "jpg"
    if file.filename and "." in file.filename:
        ext = re.sub(r"[^a-z0-9]", "", file.filename.rsplit(".", 1)[-1].lower()) or "jpg"
    file_id = f"{uuid.uuid4()}.{ext}"
    target = UPLOAD_DIR / file_id
    target.write_bytes(data)
    return {"path": file_id, "url": f"/api/files/{file_id}"}


@app.get("/api/files/{file_id}")
def get_file(file_id: str):
    safe_name = Path(file_id).name
    target = UPLOAD_DIR / safe_name
    if not target.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(target)
