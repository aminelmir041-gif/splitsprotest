import base64
import logging
import os
import re
import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage
from typing import Optional

import requests
from fastapi import BackgroundTasks, FastAPI
from pydantic import BaseModel, Field, field_validator
from starlette.middleware.cors import CORSMiddleware


HUBSPOT_BASE_URL = "https://api.hubapi.com"
MAX_PHOTO_BYTES = 10 * 1024 * 1024


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def allowed_origins() -> list[str]:
    configured = (os.environ.get("CORS_ORIGINS") or "").strip()
    if configured:
        return [item.strip() for item in configured.split(",") if item.strip()]
    return [
        "https://splitspro.com.au",
        "https://www.splitspro.com.au",
        "https://aminelmir041-gif.github.io",
    ]


class LeadCreate(BaseModel):
    name: str
    phone: str
    service: str
    suburb: str
    email: Optional[str] = ""
    message: Optional[str] = ""
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
    photo_name: Optional[str] = ""
    photo_type: Optional[str] = ""
    photo_data_url: Optional[str] = ""

    @field_validator("name", "phone", "service", "suburb")
    @classmethod
    def not_blank(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Field cannot be empty")
        return value.strip()

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, value: str) -> str:
        if len(re.sub(r"\D", "", value)) < 8:
            raise ValueError("Please enter a valid phone number")
        return value.strip()


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: f"web-{int(datetime.now(timezone.utc).timestamp() * 1000)}")
    lead_source: str = "Direct"
    created_at: str = Field(default_factory=now_iso)


app = FastAPI(title="SplitsPro Lead API")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=allowed_origins(),
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
)


def derive_lead_source(lead: dict) -> str:
    if lead.get("gclid"):
        return "Google Ads"
    if lead.get("fbclid"):
        return "Meta Ads"

    source = (lead.get("utm_source") or "").strip().lower()
    medium = (lead.get("utm_medium") or "").strip().lower()
    referrer = (lead.get("referrer") or "").strip().lower()

    if source in {"facebook", "fb", "instagram", "ig", "meta"}:
        return "Meta Ads" if medium in {"cpc", "paid", "paid_social", "ppc"} else "Meta"
    if source == "google":
        return "Google Ads" if medium in {"cpc", "ppc", "paid", "paid_search", "paidsearch"} else "Google"
    if source:
        return source[:80]
    if "google." in referrer:
        return "Google Organic"
    if "facebook." in referrer or "instagram." in referrer:
        return "Meta Referral"
    if referrer:
        return "Referral"
    return "Direct"


def lead_lines(lead: dict) -> list[str]:
    pairs = [
        ("Name", lead.get("name")),
        ("Phone", lead.get("phone")),
        ("Email", lead.get("email")),
        ("Suburb", lead.get("suburb")),
        ("Service", lead.get("service")),
        ("Message", lead.get("message")),
        ("Lead source", lead.get("lead_source")),
        ("UTM source", lead.get("utm_source")),
        ("UTM medium", lead.get("utm_medium")),
        ("UTM campaign", lead.get("utm_campaign")),
        ("UTM term", lead.get("utm_term")),
        ("UTM content", lead.get("utm_content")),
        ("GCLID", lead.get("gclid")),
        ("FBCLID", lead.get("fbclid")),
        ("Page", lead.get("page_url")),
        ("Landing page", lead.get("landing_page")),
        ("Referrer", lead.get("referrer")),
        ("Photo supplied", "Yes" if lead.get("photo_data_url") else "No"),
        ("Received", lead.get("created_at")),
        ("Lead ID", lead.get("id")),
    ]
    return [f"{label}: {value}" for label, value in pairs if value not in (None, "")]


def decode_photo(lead: dict):
    value = lead.get("photo_data_url") or ""
    if not value or "," not in value:
        return None
    header, encoded = value.split(",", 1)
    match = re.match(r"data:([^;]+);base64$", header)
    if not match:
        return None
    content_type = match.group(1)
    if not content_type.startswith("image/"):
        return None
    data = base64.b64decode(encoded, validate=True)
    if len(data) > MAX_PHOTO_BYTES:
        return None
    filename = re.sub(r"[^A-Za-z0-9._-]", "_", lead.get("photo_name") or "customer-photo.jpg")[:120]
    maintype, subtype = content_type.split("/", 1)
    return data, filename, maintype, subtype


def send_smtp(message: EmailMessage) -> None:
    host = (os.environ.get("SMTP_HOST") or "").strip()
    user = (os.environ.get("SMTP_USER") or "").strip()
    password = os.environ.get("SMTP_PASSWORD") or ""
    if not host or not user or not password:
        logging.warning("SMTP is not configured; lead email was not sent")
        return

    port = int(os.environ.get("SMTP_PORT", "587"))
    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=30) as smtp:
            smtp.login(user, password)
            smtp.send_message(message)
    else:
        with smtplib.SMTP(host, port, timeout=30) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(user, password)
            smtp.send_message(message)


def notify_email(lead: dict) -> None:
    try:
        notify_to = (os.environ.get("QUOTE_NOTIFY_EMAIL") or "info@splitspro.com.au").strip()
        from_address = (os.environ.get("SMTP_FROM") or os.environ.get("SMTP_USER") or notify_to).strip()
        if not notify_to:
            return

        message = EmailMessage()
        message["From"] = from_address
        message["To"] = notify_to
        message["Subject"] = f"New SplitsPro lead — {lead.get('service', 'Enquiry')} — {lead.get('suburb', '')}"
        message.set_content("New website enquiry\n\n" + "\n".join(lead_lines(lead)))

        photo = decode_photo(lead)
        if photo:
            data, filename, maintype, subtype = photo
            message.add_attachment(data, maintype=maintype, subtype=subtype, filename=filename)

        send_smtp(message)

        customer = (lead.get("email") or "").strip()
        confirmations = (os.environ.get("SEND_CUSTOMER_CONFIRMATION", "true").strip().lower() in {"1", "true", "yes", "on"})
        if customer and confirmations and customer.lower() != notify_to.lower():
            confirmation = EmailMessage()
            confirmation["From"] = from_address
            confirmation["To"] = customer
            confirmation["Subject"] = "SplitsPro — we received your request"
            confirmation.set_content(
                f"Hi {lead.get('name', '').strip() or 'there'},\n\n"
                "Thanks for contacting SplitsPro. We have received your request and will be in touch shortly.\n\n"
                f"Service: {lead.get('service', '')}\n"
                f"Suburb: {lead.get('suburb', '')}\n\n"
                "SplitsPro\n"
                "splitspro.com.au"
            )
            send_smtp(confirmation)
    except Exception as exc:
        logging.exception("Email notification failed: %s", exc)


def hubspot_request(method: str, path: str, token: str, *, json=None, params=None):
    response = requests.request(
        method,
        f"{HUBSPOT_BASE_URL}{path}",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=json,
        params=params,
        timeout=30,
    )
    response.raise_for_status()
    if response.status_code == 204 or not response.content:
        return {}
    return response.json()


def find_contact(token: str, property_name: str, value: str):
    if not value:
        return None
    payload = {
        "filterGroups": [{"filters": [{"propertyName": property_name, "operator": "EQ", "value": value}]}],
        "properties": ["firstname", "lastname", "email", "phone", "city", "lifecyclestage"],
        "limit": 1,
    }
    data = hubspot_request("POST", "/crm/v3/objects/contacts/search", token, json=payload)
    results = data.get("results") or []
    return results[0] if results else None


def split_name(full_name: str) -> tuple[str, str]:
    parts = [part for part in (full_name or "").strip().split() if part]
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])


def upsert_contact(token: str, lead: dict) -> str:
    email = (lead.get("email") or "").strip()
    phone = (lead.get("phone") or "").strip()
    existing = find_contact(token, "email", email) if email else None
    if not existing and phone:
        existing = find_contact(token, "phone", phone)

    first_name, last_name = split_name(lead.get("name") or "")
    properties = {
        "firstname": first_name,
        "lastname": last_name,
        "phone": phone,
        "city": (lead.get("suburb") or "").strip(),
        "lifecyclestage": "lead",
    }
    if email:
        properties["email"] = email
    properties = {key: value for key, value in properties.items() if value != ""}

    if existing:
        contact_id = existing["id"]
        hubspot_request("PATCH", f"/crm/v3/objects/contacts/{contact_id}", token, json={"properties": properties})
        return contact_id

    created = hubspot_request("POST", "/crm/v3/objects/contacts", token, json={"properties": properties})
    return created["id"]


def default_pipeline_stage(token: str) -> tuple[str, str]:
    data = hubspot_request("GET", "/crm/v3/pipelines/deals", token)
    pipelines = [item for item in (data.get("results") or []) if not item.get("archived")]
    if not pipelines:
        raise RuntimeError("No active HubSpot deal pipeline found")
    pipeline = sorted(pipelines, key=lambda item: item.get("displayOrder", 999999))[0]
    stages = [item for item in (pipeline.get("stages") or []) if not item.get("archived")]
    if not stages:
        raise RuntimeError("No active HubSpot deal stage found")
    stage = sorted(stages, key=lambda item: item.get("displayOrder", 999999))[0]
    return pipeline["id"], stage["id"]


def association_type_id(token: str) -> int:
    labels = hubspot_request("GET", "/crm/v4/associations/deals/contacts/labels", token)
    options = labels.get("results") or []
    default = next((item for item in options if item.get("category") == "HUBSPOT_DEFINED" and not item.get("label")), None)
    chosen = default or next((item for item in options if item.get("category") == "HUBSPOT_DEFINED"), None)
    if not chosen:
        raise RuntimeError("No HubSpot deal/contact association type found")
    return int(chosen["typeId"])


def sync_hubspot(lead: dict) -> None:
    token = (os.environ.get("HUBSPOT_PRIVATE_APP_TOKEN") or "").strip()
    if not token:
        logging.warning("HubSpot is not configured; lead was not synced")
        return

    try:
        contact_id = upsert_contact(token, lead)
        pipeline, stage = default_pipeline_stage(token)
        owner_id = (os.environ.get("HUBSPOT_OWNER_ID") or "").strip()
        deal_props = {
            "dealname": f"{lead.get('service', 'Website enquiry')} — {lead.get('name', '')} — {lead.get('suburb', '')}"[:255],
            "pipeline": pipeline,
            "dealstage": stage,
            "description": "\n".join(lead_lines(lead)),
        }
        if owner_id:
            deal_props["hubspot_owner_id"] = owner_id

        deal = hubspot_request("POST", "/crm/v3/objects/deals", token, json={"properties": deal_props})
        assoc_id = association_type_id(token)
        hubspot_request(
            "PUT",
            f"/crm/v3/objects/deals/{deal['id']}/associations/contacts/{contact_id}/{assoc_id}",
            token,
        )
        logging.info("HubSpot sync complete for lead %s", lead.get("id"))
    except Exception as exc:
        logging.exception("HubSpot sync failed: %s", exc)


@app.get("/")
async def health():
    return {"ok": True, "service": "splitspro-leads"}


@app.post("/api/quotes")
async def create_quote(payload: LeadCreate, background_tasks: BackgroundTasks):
    raw = payload.model_dump()
    raw["lead_source"] = derive_lead_source(raw)
    lead = Lead(**raw).model_dump()

    # Do not block the customer while email and CRM calls finish.
    background_tasks.add_task(notify_email, lead)
    background_tasks.add_task(sync_hubspot, lead)

    return {
        "ok": True,
        "id": lead["id"],
        "lead_source": lead["lead_source"],
    }


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
