from fastapi import FastAPI, BackgroundTasks, HTTPException, UploadFile, File, Header, Request
from fastapi.responses import FileResponse, Response, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional, Literal
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
import requests
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
from .equipment_checkout import router as equipment_checkout_router, confirm_stripe_equipment_payment
from .cleaning_bookings import (
    router as cleaning_router, cleaning_blocks_installation, day_lock_key,
    confirm_stripe_cleaning_payment, expire_cleaning_stripe_hold,
)

app = FastAPI(title="SplitsPro Lead API")
app.include_router(equipment_checkout_router)
app.include_router(cleaning_router)

# Log configuration presence only (never credentials) for payment diagnostics.
logging.warning(
    "Cleaning payment config: stripe_key=%s webhook_secret=%s booking_enabled=%s",
    bool((os.environ.get("STRIPE_SECRET_KEY") or "").strip()),
    bool((os.environ.get("STRIPE_WEBHOOK_SECRET") or "").strip()),
    (os.environ.get("SPLITSPRO_CLEANING_BOOKING_ENABLED") or "").strip().lower() in {"1", "true", "yes"},
)

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
    product_key: str = ""
    size: str = ""

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


@app.head("/")
def health_head():
    return Response(status_code=200)


# Fallback review feed used by the React service/reviews sections. These are the
# same customer reviews already displayed on the website, exposed through the
# live API so those sections do not disappear when they request /api/reviews.
@app.get("/api/reviews")
def reviews():
    return [
        {
            "id": "sia",
            "name": "Sia",
            "rating": 5,
            "service": "Split System Installation",
            "category": "general",
            "featured": True,
            "text": "We had the most fantastic experience with Splits Pro. They were professional from the initial quote through to installation, explained every option clearly, and completed the job to an exceptionally high standard. The workmanship was clean, efficient and we couldn't be happier. Highly recommended.",
        },
        {
            "id": "gill-mcphee",
            "name": "Gill McPhee",
            "rating": 5,
            "service": "Rinnai Installation",
            "category": "general",
            "featured": False,
            "text": "Excellent installers. They work very well as a team. Heatwave arrives tomorrow, 34 degrees, and we have cooling! So happy.",
        },
        {
            "id": "mat-134",
            "name": "Mat 134",
            "rating": 5,
            "service": "Air Conditioning Installation",
            "category": "general",
            "featured": False,
            "text": "Best in the business, amazing work.",
        },
    ]



BOOKING_TIMEZONE = ZoneInfo(os.environ.get("BOOKING_TIMEZONE", "Australia/Sydney"))
BOOKING_SLOT_CAPACITY = max(1, int(os.environ.get("BOOKING_SLOT_CAPACITY", "1")))
BOOKING_LOOKAHEAD_DAYS = max(2, min(30, int(os.environ.get("BOOKING_LOOKAHEAD_DAYS", "14"))))
BOOKING_WORKDAYS = {
    int(value)
    for value in (os.environ.get("BOOKING_WORKDAYS", "0,1,2,3,4,5,6").split(","))
    if value.strip().isdigit() and 0 <= int(value) <= 6
}
BOOKING_BLOCKS_FILE = Path(__file__).parent / "booking_blocks.json"
BOOKING_DEPOSIT_DEALS = {
    ("rinnai-local", "2.5kW"): {"total_cents": 160000, "deposit_cents": 16000, "payment_link_id": "plink_1UPIlCPpUx7EUhdNQ4AetSsa", "payment_link_url": "https://buy.stripe.com/3cI14p8QO4K25xyaiBcs803"},
    ("rinnai-local", "3.5kW"): {"total_cents": 170000, "deposit_cents": 17000, "payment_link_id": "plink_1UPIlOPpUx7EUhdN9CsZQwKN", "payment_link_url": "https://buy.stripe.com/eVq28t7MK0tM1hi9excs804"},
    ("rinnai-local", "5.0kW"): {"total_cents": 230000, "deposit_cents": 23000, "payment_link_id": "plink_1UPIlRPpUx7EUhdN0tCJuJbo", "payment_link_url": "https://buy.stripe.com/aFa5kF0ki7We3pq76pcs805"},
    ("rinnai-local", "7.0kW"): {"total_cents": 260000, "deposit_cents": 26000, "payment_link_id": "plink_1UPIlTPpUx7EUhdNdk1Mt5D9", "payment_link_url": "https://buy.stripe.com/14A4gBc30foGbVW8atcs806"},
    ("daikin-lite-local", "2.5kW"): {"total_cents": 185000, "deposit_cents": 18500, "payment_link_id": "plink_1UPIlVPpUx7EUhdNJd81sywM", "payment_link_url": "https://buy.stripe.com/00wcN7ffca4m9NOcqJcs807"},
    ("daikin-lite-local", "3.5kW"): {"total_cents": 210000, "deposit_cents": 21000, "payment_link_id": "plink_1UPIlYPpUx7EUhdNBH2nrrUD", "payment_link_url": "https://buy.stripe.com/3cI00l7MKb8qe441M5cs808"},
    ("daikin-lite-local", "5.0kW"): {"total_cents": 250000, "deposit_cents": 25000, "payment_link_id": "plink_1UPIlaPpUx7EUhdNJzdhtgt9", "payment_link_url": "https://buy.stripe.com/5kQfZj0kigsK4tu1M5cs809"},
    ("daikin-lite-local", "7.0kW"): {"total_cents": 300000, "deposit_cents": 30000, "payment_link_id": "plink_1UPIlcPpUx7EUhdNVgG5Wxgd", "payment_link_url": "https://buy.stripe.com/aFaaEZeb8dgye444Yhcs80a"},
}

# Legacy fixed link is only relevant to old in-flight checkout sessions.
BOOKING_PAYMENT_LINK_URL = (os.environ.get("BOOKING_PAYMENT_LINK_URL") or "").strip()
BOOKING_HOLD_SECONDS = max(600, min(7200, int(os.environ.get("BOOKING_HOLD_SECONDS", "3600"))))
STRIPE_WEBHOOK_SECRET = (os.environ.get("STRIPE_WEBHOOK_SECRET") or "").strip()



# Sandbox-only PayPal integration preflight. These routes never create a live charge
# or confirm a booking. Secrets are read from Render environment, never returned.
@app.get("/api/paypal/sandbox/status")
def paypal_sandbox_status():
    client_id = bool((os.environ.get("PAYPAL_SANDBOX_CLIENT_ID") or "").strip())
    secret = bool((os.environ.get("PAYPAL_SANDBOX_CLIENT_SECRET") or "").strip())
    return {
        "environment": "sandbox",
        "client_id_configured": client_id,
        "secret_configured": secret,
        "ready_for_testing": client_id and secret,
        "live_payments_enabled": False,
    }


def _paypal_sandbox_token():
    client_id = (os.environ.get("PAYPAL_SANDBOX_CLIENT_ID") or "").strip()
    secret = (os.environ.get("PAYPAL_SANDBOX_CLIENT_SECRET") or "").strip()
    if not client_id or not secret:
        raise HTTPException(status_code=503, detail="PayPal Sandbox credentials are not configured")
    try:
        response = requests.post(
            "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            auth=(client_id, secret),
            data={"grant_type": "client_credentials"},
            headers={"Accept": "application/json"},
            timeout=12,
        )
        response.raise_for_status()
        token = response.json().get("access_token")
        if not token:
            raise ValueError("No PayPal access token returned")
        return token
    except (requests.RequestException, ValueError) as exc:
        logging.warning("PayPal Sandbox authentication failed: %s", type(exc).__name__)
        raise HTTPException(status_code=502, detail="PayPal Sandbox authentication failed") from exc


@app.get("/api/paypal/sandbox/connection-test")
def paypal_sandbox_connection_test():
    # Authenticates to PayPal's sandbox API without charging, creating an
    # order, consuming checkout inventory, or accessing Live credentials.
    _paypal_sandbox_token()
    return {"connected": True, "environment": "sandbox", "live_payments_enabled": False}




@app.get("/api/paypal/sandbox/test", response_class=HTMLResponse)
def paypal_sandbox_test_page():
    # Public page, but all transactional API calls require the private admin key.
    return HTMLResponse("""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SplitsPro PayPal Sandbox Checkout Test</title>
<style>
body{font-family:system-ui,Arial,sans-serif;background:#f5f4f1;color:#101b2b;margin:0;padding:35px 16px}
main{max-width:600px;margin:auto;background:white;padding:28px;border-radius:16px;box-shadow:0 12px 36px #0001}
h1{font-size:27px;margin:0 0 10px}p{line-height:1.55}
label{display:block;font-weight:650;margin:20px 0 7px}input{width:100%;padding:12px;border:1px solid #aeb5bd;border-radius:7px;box-sizing:border-box}
button,a.action{display:inline-block;background:#0c2039;color:white;padding:12px 18px;border:0;border-radius:6px;font-weight:700;margin:14px 7px 0 0;text-decoration:none;cursor:pointer}
button:disabled{opacity:.45;cursor:default}#result{white-space:pre-wrap;margin:16px 0;line-height:1.5}
small{color:#566373}a.action{background:#ba9150}
</style></head><body><main>
<h1>SplitsPro PayPal Sandbox Test</h1>
<p>Test: Rinnai 5kW supplied and installed, <strong>AUD $1,900</strong>. This uses fake Sandbox funds only. No installation date is booked.</p>
<label for="key">SplitsPro admin API key</label>
<input type="password" id="key" autocomplete="off" placeholder="Enter privately here, not in chat">
<small>Used for this page only. Never saved to the browser or sent anywhere except your SplitsPro backend.</small>
<div><button id="create">1. Create $1,900 test order</button></div>
<div id="result" role="status"></div>
<div id="approve"></div>
<div><button id="capture" disabled>3. Verify and capture approved test payment</button></div>
<small>Step 2: Open the PayPal approval link, sign in with your PERSONAL Sandbox buyer and approve the payment. Then return here and click step 3. Pay Later isn't guaranteed to appear in Sandbox.</small>
<script>
let orderId="";
const result=document.getElementById("result");
const output=(s)=>{result.textContent=s};
async function request(path,body){
const key=document.getElementById("key").value;
if(!key)throw new Error("Enter your SplitsPro admin API key.");
const response=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Key":key},body:body?JSON.stringify(body):undefined});
const data=await response.json();
if(!response.ok)throw new Error(typeof data.detail==="string"?data.detail:"Request failed ("+response.status+")");
return data;
}
document.getElementById("create").onclick=async()=>{
output("Creating Sandbox order...");
document.getElementById("approve").replaceChildren();
document.getElementById("capture").disabled=true;
try{
const d=await request("/api/paypal/sandbox/create-order",{deal:"rinnai-5.0"});
orderId=d.order_id;
output("Sandbox order created: "+orderId+"\\nStatus: "+d.status);
if(!d.approval_url)throw new Error("PayPal did not return an approval link.");
const a=document.createElement("a");a.href=d.approval_url;a.target="_blank";a.rel="noopener noreferrer";a.className="action";a.textContent="2. Approve with Sandbox buyer";
document.getElementById("approve").append(a);
document.getElementById("capture").disabled=false;
}catch(e){output("Error: "+e.message);}
};
document.getElementById("capture").onclick=async()=>{
if(!orderId)return;
output("Checking Sandbox capture...");
try{
const d=await request("/api/paypal/sandbox/capture-order/"+encodeURIComponent(orderId));
output("PayPal status: "+d.status+"\\nCapture completed: "+d.capture_completed+"\\nThis did NOT book an installation or charge real money.");
}catch(e){output("Error: "+e.message);}
};
</script></main></body></html>""")


# Test-only order flow. Requires the existing SplitsPro admin API key; never
# touches production bookings, live PayPal credentials or Stripe payments.
PAYPAL_SANDBOX_DEALS = {
    "rinnai-2.5": ("Rinnai 2.5kW supplied and installed", "1450.00"),
    "rinnai-3.5": ("Rinnai 3.5kW supplied and installed", "1550.00"),
    "rinnai-5.0": ("Rinnai 5kW supplied and installed", "1900.00"),
    "rinnai-7.0": ("Rinnai 7kW supplied and installed", "2300.00"),
    "daikin-cora-7.0": ("Daikin Cora 7kW supplied and installed", "2600.00"),
}


class PaypalSandboxOrderRequest(BaseModel):
    deal: str = "rinnai-5.0"


def _paypal_admin_required(key: str):
    if not valid_admin_key(key):
        raise HTTPException(status_code=403, detail="Not authorised")


@app.post("/api/paypal/sandbox/create-order")
def paypal_sandbox_create_order(payload: PaypalSandboxOrderRequest, x_admin_key: str = Header(default="")):
    _paypal_admin_required(x_admin_key)
    if payload.deal not in PAYPAL_SANDBOX_DEALS:
        raise HTTPException(status_code=400, detail="Unknown test deal")
    name, amount = PAYPAL_SANDBOX_DEALS[payload.deal]
    token = _paypal_sandbox_token()
    try:
        response = requests.post(
            "https://api-m.sandbox.paypal.com/v2/checkout/orders",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "PayPal-Request-Id": uuid.uuid4().hex,
            },
            json={
                "intent": "CAPTURE",
                "purchase_units": [{
                    "reference_id": payload.deal,
                    "description": name,
                    "amount": {"currency_code": "AUD", "value": amount},
                }],
                "payment_source": {
                    "paypal": {
                        "experience_context": {
                            "return_url": "https://splitspro.com.au/payment-options?paypal_test=returned",
                            "cancel_url": "https://splitspro.com.au/payment-options?paypal_test=cancelled",
                            "user_action": "PAY_NOW",
                        }
                    }
                },
            },
            timeout=20,
        )
        response.raise_for_status()
        result = response.json()
    except (requests.RequestException, ValueError) as exc:
        logging.warning("Sandbox order create error: %s", type(exc).__name__)
        raise HTTPException(status_code=502, detail="Could not create PayPal Sandbox order") from exc
    return {
        "environment": "sandbox",
        "order_id": result.get("id"),
        "status": result.get("status"),
        "deal": payload.deal,
        "amount": amount,
        "currency": "AUD",
        "approval_url": next((link.get("href") for link in result.get("links", []) if link.get("rel") in ("payer-action", "approve")), None),
        "booking_confirmed": False,
    }


@app.post("/api/paypal/sandbox/capture-order/{order_id}")
def paypal_sandbox_capture_order(order_id: str, x_admin_key: str = Header(default="")):
    _paypal_admin_required(x_admin_key)
    if not re.fullmatch(r"[A-Z0-9]{10,30}", order_id):
        raise HTTPException(status_code=400, detail="Invalid order ID")
    token = _paypal_sandbox_token()
    try:
        response = requests.post(
            f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}/capture",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "PayPal-Request-Id": "splitspro-test-" + order_id,
            },
            timeout=20,
        )
        response.raise_for_status()
        result = response.json()
    except (requests.RequestException, ValueError) as exc:
        logging.warning("Sandbox order capture error: %s", type(exc).__name__)
        raise HTTPException(status_code=502, detail="Could not capture PayPal Sandbox order") from exc
    completed = [
        capture
        for unit in result.get("purchase_units", [])
        for capture in (unit.get("payments") or {}).get("captures", [])
        if capture.get("status") == "COMPLETED"
    ]
    return {
        "environment": "sandbox",
        "order_id": result.get("id"),
        "status": result.get("status"),
        "capture_completed": bool(completed),
        "booking_confirmed": False,
        "note": "Test payment only; no installation booking created",
    }


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
            if used >= BOOKING_SLOT_CAPACITY or cleaning_blocks_installation(client, *key):
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


def _booking_deal(payload: BookingCreate):
    # Whitelist total and deposit prices on the server; ignore client amounts.
    key = (payload.product_key, payload.size)
    if key in BOOKING_DEPOSIT_DEALS:
        return key, BOOKING_DEPOSIT_DEALS[key]

    # Support previous frontend bundle during rollout without taking $300.
    message = payload.message or ""
    product_key = "daikin-lite-local" if "Daikin Cora" in message else "rinnai-local" if "Rinnai Split System" in message else ""
    match = re.search(r"\b(2\.5|3\.5|5(?:\.0)?|7(?:\.0)?)\s*kW\b", message, flags=re.I)
    size = f"{float(match.group(1)):.1f}kW" if match else ""
    legacy_key = (product_key, size)
    if legacy_key not in BOOKING_DEPOSIT_DEALS:
        raise HTTPException(status_code=400, detail="Please select a valid air conditioner to calculate your 10% deposit.")
    return legacy_key, BOOKING_DEPOSIT_DEALS[legacy_key]


def _booking_checkout_url(reference: str, deal: dict) -> str:
    url = deal["payment_link_url"]
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}{urlencode({'client_reference_id': reference})}"


@app.post("/api/booking-checkout")
def create_booking_checkout(payload: BookingCreate):
    _validate_booking_request(payload)
    client = _booking_redis()
    (product_key, size), deal = _booking_deal(payload)
    reference = uuid.uuid4().hex
    checkout_url = _booking_checkout_url(reference, deal)
    lead = payload.model_dump()
    lead["product_key"] = product_key
    lead["size"] = size
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
        "total_cents": deal["total_cents"],
        "deposit_cents": deal["deposit_cents"],
        "payment_link_id": deal["payment_link_id"],
    }

    try:
        with client.lock(
            day_lock_key(payload.booking_date),
            timeout=10,
            blocking_timeout=5,
        ):
            if (_slot_count(client, payload.booking_date, payload.booking_window) >= BOOKING_SLOT_CAPACITY
                or cleaning_blocks_installation(client, payload.booking_date, payload.booking_window)):
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
        "deposit_amount": deal["deposit_cents"] / 100,
        "total_amount": deal["total_cents"] / 100,
        "balance_amount": (deal["total_cents"] - deal["deposit_cents"]) / 100,
        "currency": "AUD",
        "reference": reference,
        "checkout_url": checkout_url,
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


def _complete_paid_booking(reference: str, session_id: str, background_tasks: BackgroundTasks, session_amount_cents: int = 0):
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
            "deposit_amount": session_amount_cents / 100,
            "currency": "AUD",
        }
        client.set(_paid_key(reference), json.dumps(result), ex=60 * 60 * 24 * 90)
        if session_id:
            client.set(_session_key(session_id), json.dumps(result), ex=60 * 60 * 24 * 90)
        return result

    hold = json.loads(hold_raw)
    booking_date = hold["booking_date"]
    booking_window = hold["booking_window"]
    lead = hold["lead"]
    deposit_cents = int(hold.get("deposit_cents", 30000))
    total_cents = int(hold.get("total_cents", 0))

    with client.lock(day_lock_key(booking_date), timeout=30, blocking_timeout=10):
        confirmed = int(client.get(_slot_key(booking_date, booking_window)) or 0)
        if confirmed >= BOOKING_SLOT_CAPACITY or cleaning_blocks_installation(client, booking_date, booking_window):
            status = "needs_reschedule"
        else:
            client.incr(_slot_key(booking_date, booking_window))
            client.expire(_slot_key(booking_date, booking_window), 60 * 60 * 24 * 35)
            status = "confirmed"
        client.delete(_hold_key(reference))

    lead["deposit_paid"] = True
    lead["deposit_amount"] = deposit_cents / 100
    if total_cents:
        lead["total_amount"] = total_cents / 100
        lead["balance_amount"] = (total_cents - deposit_cents) / 100
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
        "deposit_amount": deposit_cents / 100,
        "total_amount": total_cents / 100 if total_cents else None,
        "balance_amount": (total_cents - deposit_cents) / 100 if total_cents else None,
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
    # Full-prepaid cleaning uses this verified Stripe webhook too. Never treat
    # a cleaning payment as an installation deposit.
    if (session.get("metadata") or {}).get("checkout_type") == "cleaning":
        if event_type in {"checkout.session.completed", "checkout.session.async_payment_succeeded"}:
            if event_type != "checkout.session.completed" or session.get("payment_status") == "paid":
                confirm_stripe_cleaning_payment(session, background_tasks)
        elif event_type in {"checkout.session.expired", "checkout.session.async_payment_failed"}:
            expire_cleaning_stripe_hold(session)
        return Response(status_code=200)

    # Deal payments include their installation appointment. Confirm the date
    # only after Stripe has independently verified the actual amount received.
    if (session.get("metadata") or {}).get("checkout_type") == "installed_deal":
        if event_type in {"checkout.session.completed", "checkout.session.async_payment_succeeded"} and session.get("payment_status") == "paid":
            _confirm_installed_deal_payment(session, background_tasks)
        elif event_type in {"checkout.session.expired", "checkout.session.async_payment_failed"}:
            _expire_installed_deal_checkout(session)
        return Response(status_code=200)

    # Equipment retail checkouts use the same trusted Stripe webhook but
    # must NEVER be mistaken for an installation deposit or reserve a date.
    if (session.get("metadata") or {}).get("checkout_type") == "equipment_retail":
        if event_type in {"checkout.session.completed", "checkout.session.async_payment_succeeded"}:
            confirm_stripe_equipment_payment(session)
        return Response(status_code=200)

    reference = session.get("client_reference_id") or ""
    session_id = session.get("id") or ""

    if not reference:
        return Response(status_code=200)

    if event_type in {"checkout.session.completed", "checkout.session.async_payment_succeeded"}:
        if event_type == "checkout.session.completed" and session.get("payment_status") != "paid":
            return Response(status_code=200)

        client = _booking_redis()
        hold_raw = client.get(_hold_key(reference))
        if hold_raw:
            hold = json.loads(hold_raw)
            expected_cents = int(hold.get("deposit_cents", 30000))
            expected_link_id = hold.get("payment_link_id")
            if (
                session.get("amount_total") != expected_cents
                or (session.get("currency") or "").lower() != "aud"
                or (expected_link_id and session.get("payment_link") != expected_link_id)
            ):
                logging.error("Rejected booking payment with mismatched amount/link: %s", session_id)
                return Response(status_code=200)
        else:
            # Check even late payments whose slot holds have expired.
            known = next(
                (deal for deal in BOOKING_DEPOSIT_DEALS.values()
                 if deal["payment_link_id"] == session.get("payment_link")), None
            )
            if known and (
                session.get("amount_total") != known["deposit_cents"]
                or (session.get("currency") or "").lower() != "aud"
            ):
                logging.error("Rejected late booking with mismatched amount: %s", session_id)
                return Response(status_code=200)
        _complete_paid_booking(reference, session_id, background_tasks, int(session.get("amount_total") or 0))
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
            "message": "A 10% booking deposit is required to secure installation bookings.",
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


# Unified Rinnai/Daikin local-deals checkout. The customer selects a live
# installation window FIRST. The website never supplies a monetary amount.
# A temporary hold expires without payment; only a verified paid session
# permanently books an installation date.
from .equipment_checkout import INSTALLED_CENTS as DEAL_INSTALLED_CENTS, LABELS as DEAL_LABELS

DEAL_STRIPE_CONFIGURATION = "pmc_1UNgZ0PpUx7EUhdNwdVqO3md"
DEAL_HOLD_SECONDS = 32 * 60


class InstalledDealCheckoutRequest(BookingCreate):
    payment_choice: Literal["deposit", "full"] = "deposit"


@app.post("/api/installed-deal-checkout")
def installed_deal_checkout(payload: InstalledDealCheckoutRequest):
    _validate_booking_request(payload)
    model_id = f"{payload.product_key}:{payload.size}"
    if model_id not in DEAL_INSTALLED_CENTS:
        raise HTTPException(status_code=422, detail="That air conditioner is not available for this offer")
    key = (os.environ.get("STRIPE_SECRET_KEY") or "").strip()
    if not key or not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=503, detail="Secure booking checkout is temporarily unavailable")
    total_cents = DEAL_INSTALLED_CENTS[model_id]
    # Keep the residential installation booking amount within 10% of its total.
    payable_cents = total_cents // 10 if payload.payment_choice == "deposit" else total_cents
    connection = _booking_redis()
    reference = uuid.uuid4().hex
    lead = payload.model_dump()
    lead.update({
        "service": "Split System Installation",
        "product_key": payload.product_key,
        "size": payload.size,
        "preferred_date": payload.booking_date,
        "payment_choice": payload.payment_choice,
        "total_amount": total_cents / 100,
        "id": uuid.uuid4().hex,
        "created_at": now_iso(),
    })
    lead["lead_source"] = derive_lead_source(lead)
    hold = {
        "reference": reference, "booking_date": payload.booking_date,
        "booking_window": payload.booking_window,
        "lead": lead, "created_at": now_iso(),
        "model_id": model_id, "total_cents": total_cents,
        "deposit_cents": payable_cents,
        "payment_choice": payload.payment_choice,
        "checkout_type": "installed_deal",
    }
    try:
        with connection.lock(day_lock_key(payload.booking_date), timeout=30, blocking_timeout=10):
            if (_slot_count(connection, payload.booking_date, payload.booking_window) >= BOOKING_SLOT_CAPACITY
                or cleaning_blocks_installation(connection, payload.booking_date, payload.booking_window)):
                raise HTTPException(status_code=409, detail="That installation slot has just been taken. Choose another time.")
            connection.set(_hold_key(reference), json.dumps(hold), ex=DEAL_HOLD_SECONDS)
    except HTTPException:
        raise
    except Exception as exc:
        logging.exception("Could not reserve deal checkout slot")
        raise HTTPException(status_code=503, detail="Live availability is temporarily unavailable") from exc

    return_params = urlencode({
        "product": payload.product_key, "size": payload.size,
        "date": payload.booking_date, "window": payload.booking_window,
        "booking_ref": reference,
    })
    return_base = "https://splitspro.com.au/deal-payment?" + return_params
    body = {
        "mode": "payment",
        "payment_method_configuration": DEAL_STRIPE_CONFIGURATION,
        "expires_at": str(int(time.time()) + 31 * 60),
        "client_reference_id": reference,
        "customer_email": payload.email,
        "success_url": return_base + "&deal_payment=returned&session_id={CHECKOUT_SESSION_ID}",
        "cancel_url": return_base + "&deal_payment=cancelled",
        "metadata[checkout_type]": "installed_deal",
        "metadata[booking_ref]": reference,
        "metadata[model_id]": model_id,
        "metadata[payment_choice]": payload.payment_choice,
        "metadata[booking_date]": payload.booking_date,
        "metadata[booking_window]": payload.booking_window,
        "line_items[0][price_data][currency]": "aud",
        "line_items[0][price_data][unit_amount]": str(payable_cents),
        "line_items[0][price_data][product_data][name]":
            (f"SplitsPro {DEAL_LABELS[model_id]} - "
             + ("10% installation booking payment" if payload.payment_choice == "deposit"
                else "complete supplied and installed package")),
        "line_items[0][quantity]": "1",
    }
    try:
        response = requests.post(
            "https://api.stripe.com/v1/checkout/sessions",
            headers={"Authorization": "Bearer " + key, "Idempotency-Key": "installed-deal-" + reference},
            data=body, timeout=25,
        )
        response.raise_for_status()
        checkout = response.json()
        if not checkout.get("id") or not (checkout.get("url") or "").startswith("https://"):
            raise ValueError("missing Stripe checkout session")
        hold["stripe_session_id"] = checkout["id"]
        connection.set(_hold_key(reference), json.dumps(hold), ex=DEAL_HOLD_SECONDS)
    except (requests.RequestException, ValueError, redis.RedisError) as exc:
        connection.delete(_hold_key(reference))
        logging.exception("Installed deal Stripe checkout unavailable")
        raise HTTPException(status_code=502, detail="Could not open secure checkout. Nothing was charged.") from exc

    return {
        "checkout_url": checkout["url"], "booking_ref": reference,
        "total_amount": total_cents / 100,
        "amount_due_now": payable_cents / 100,
        "balance_amount": (total_cents - payable_cents) / 100,
        "payment_choice": payload.payment_choice, "currency": "AUD",
    }


def _confirm_installed_deal_payment(session, background_tasks):
    ref = (session.get("metadata") or {}).get("booking_ref") or ""
    if not re.fullmatch(r"[0-9a-f]{32}", ref):
        return
    connection = _booking_redis()
    raw = connection.get(_hold_key(ref))
    if not raw:
        # If checkout completes after hold expiry, do NOT reserve the date
        # or pretend an installation is booked; staff must reconcile with Stripe.
        logging.warning("Paid installation session has no active hold: %s", ref)
        return
    hold = json.loads(raw)
    if (
        hold.get("checkout_type") != "installed_deal"
        or session.get("id") != hold.get("stripe_session_id")
        or session.get("client_reference_id") != ref
        or session.get("amount_total") != hold.get("deposit_cents")
        or (session.get("currency") or "").lower() != "aud"
    ):
        logging.error("Rejected mismatched installed deal payment: %s", ref)
        return
    _complete_paid_booking(ref, session.get("id"), background_tasks, int(session["amount_total"]))


def _expire_installed_deal_checkout(session):
    ref = (session.get("metadata") or {}).get("booking_ref") or ""
    if not re.fullmatch(r"[0-9a-f]{32}", ref):
        return
    connection = _booking_redis()
    raw = connection.get(_hold_key(ref))
    if raw and json.loads(raw).get("stripe_session_id") == session.get("id"):
        connection.delete(_hold_key(ref))


@app.get("/api/installed-deal-payment-status")
def installed_deal_payment_status(
    background_tasks: BackgroundTasks, booking_ref: str = "", session_id: str = ""
):
    if not re.fullmatch(r"[0-9a-f]{32}", booking_ref):
        raise HTTPException(status_code=422, detail="Invalid installation booking reference")
    connection = _booking_redis()
    paid_raw = connection.get(_paid_key(booking_ref))
    if paid_raw:
        return json.loads(paid_raw)
    raw = connection.get(_hold_key(booking_ref))
    if raw:
        hold = json.loads(raw)
        if (
            hold.get("checkout_type") == "installed_deal"
            and session_id == hold.get("stripe_session_id")
            and re.fullmatch(r"cs_(?:live|test)_[A-Za-z0-9]+", session_id or "")
        ):
            secret = (os.environ.get("STRIPE_SECRET_KEY") or "").strip()
            if secret:
                try:
                    result = requests.get(
                        "https://api.stripe.com/v1/checkout/sessions/" + session_id,
                        headers={"Authorization": "Bearer " + secret}, timeout=12,
                    )
                    result.raise_for_status()
                    session = result.json()
                    if session.get("payment_status") == "paid":
                        _confirm_installed_deal_payment(session, background_tasks)
                        paid_raw = connection.get(_paid_key(booking_ref))
                        if paid_raw:
                            return json.loads(paid_raw)
                except (requests.RequestException, ValueError):
                    logging.warning("Installed deal confirmation is still processing")
    return {"status": "processing", "booking_ref": booking_ref}
