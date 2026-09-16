from fastapi import FastAPI, BackgroundTasks, HTTPException, UploadFile, File, Header, Request
from fastapi.responses import FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional
from pathlib import Path
from datetime import datetime, timezone
import json
import os
import re
import uuid

from .lead_integrations import derive_lead_source, notify_quote, sync_quote_to_hubspot, valid_admin_key
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


class SmsCreate(BaseModel):
    to: str
    body: str

    @field_validator("to", "body")
    @classmethod
    def sms_not_blank(cls, value):
        if not value or not value.strip():
            raise ValueError("Field cannot be empty")
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
        "email_provider": "resend" if resend_ready else ("smtp" if smtp_ready else "none"),
        "email_configured": resend_ready or smtp_ready,
        "sms_provider": "infinireach",
        "sms_configured": sms_configured(),
        "sms_webhook_configured": bool((os.environ.get("INFINIREACH_WEBHOOK_SECRET") or "").strip()),
    }


@app.post("/api/quotes")
def create_quote(payload: QuoteCreate, background_tasks: BackgroundTasks):
    lead = payload.model_dump()
    lead["id"] = str(uuid.uuid4())
    lead["created_at"] = now_iso()
    lead["lead_source"] = derive_lead_source(lead)

    background_tasks.add_task(notify_quote, lead)
    background_tasks.add_task(sync_quote_to_hubspot, lead)

    return {
        **lead,
        "accepted": True,
    }


@app.post("/api/sms/send")
def send_sms_endpoint(payload: SmsCreate, x_admin_key: Optional[str] = Header(default=None, alias="X-Admin-Key")):
    if not valid_admin_key(x_admin_key):
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        return send_sms(payload.to, payload.body)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="SMS provider request failed") from exc


@app.post("/api/sms/webhook")
async def sms_webhook(
    request: Request,
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
    return Response(status_code=200)


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
