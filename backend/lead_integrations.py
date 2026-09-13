import hmac
import logging
import os
import smtplib
from email.message import EmailMessage
from typing import Dict, Optional
from urllib.parse import urljoin

import requests


HUBSPOT_BASE_URL = "https://api.hubapi.com"


def derive_lead_source(lead: Dict) -> str:
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


def _full_photo_url(photo_url: str) -> str:
    if not photo_url:
        return ""
    if photo_url.startswith("http://") or photo_url.startswith("https://"):
        return photo_url
    public_backend = (os.environ.get("PUBLIC_BACKEND_URL") or "").strip()
    if not public_backend:
        return photo_url
    return urljoin(public_backend.rstrip("/") + "/", photo_url.lstrip("/"))


def _lead_lines(lead: Dict) -> list[str]:
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
        ("Photo", _full_photo_url(lead.get("photo_url") or "")),
        ("Received", lead.get("created_at")),
        ("Lead ID", lead.get("id")),
    ]
    return [f"{label}: {value}" for label, value in pairs if value]


def _send_smtp(message: EmailMessage) -> None:
    host = (os.environ.get("SMTP_HOST") or "").strip()
    user = (os.environ.get("SMTP_USER") or "").strip()
    password = os.environ.get("SMTP_PASSWORD") or ""
    if not host or not user or not password:
        logging.info("Lead email notification disabled: SMTP credentials are not configured")
        return

    port = int(os.environ.get("SMTP_PORT", "587"))
    timeout = 30
    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=timeout) as smtp:
            smtp.login(user, password)
            smtp.send_message(message)
    else:
        with smtplib.SMTP(host, port, timeout=timeout) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(user, password)
            smtp.send_message(message)


def notify_quote(lead: Dict) -> None:
    try:
        notify_to = (os.environ.get("QUOTE_NOTIFY_EMAIL") or "info@splitspro.com.au").strip()
        from_address = (os.environ.get("SMTP_FROM") or os.environ.get("SMTP_USER") or notify_to).strip()
        if not notify_to:
            return

        business_message = EmailMessage()
        business_message["From"] = from_address
        business_message["To"] = notify_to
        business_message["Subject"] = f"New SplitsPro lead — {lead.get('service', 'Enquiry')} — {lead.get('suburb', '')}"
        business_message.set_content("New website enquiry\n\n" + "\n".join(_lead_lines(lead)))
        _send_smtp(business_message)

        customer_email = (lead.get("email") or "").strip()
        confirmations_enabled = (os.environ.get("SEND_CUSTOMER_CONFIRMATION", "true").strip().lower() in {"1", "true", "yes", "on"})
        if customer_email and confirmations_enabled and customer_email.lower() != notify_to.lower():
            confirmation = EmailMessage()
            confirmation["From"] = from_address
            confirmation["To"] = customer_email
            confirmation["Subject"] = "SplitsPro — we received your request"
            confirmation.set_content(
                f"Hi {lead.get('name', '').strip() or 'there'},\n\n"
                "Thanks for contacting SplitsPro. We have received your request and will be in touch shortly.\n\n"
                f"Service: {lead.get('service', '')}\n"
                f"Suburb: {lead.get('suburb', '')}\n\n"
                "SplitsPro\n"
                "splitspro.com.au"
            )
            _send_smtp(confirmation)
    except Exception as exc:
        logging.exception("Lead email notification failed: %s", exc)


def _hubspot_request(method: str, path: str, token: str, *, json=None, params=None):
    response = requests.request(
        method,
        f"{HUBSPOT_BASE_URL}{path}",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json=json,
        params=params,
        timeout=30,
    )
    response.raise_for_status()
    if response.status_code == 204 or not response.content:
        return {}
    return response.json()


def _find_contact(token: str, property_name: str, value: str) -> Optional[dict]:
    if not value:
        return None
    payload = {
        "filterGroups": [{"filters": [{"propertyName": property_name, "operator": "EQ", "value": value}]}],
        "properties": ["firstname", "lastname", "email", "phone", "city", "lifecyclestage"],
        "limit": 1,
    }
    data = _hubspot_request("POST", "/crm/v3/objects/contacts/search", token, json=payload)
    results = data.get("results") or []
    return results[0] if results else None


def _split_name(full_name: str) -> tuple[str, str]:
    parts = [part for part in (full_name or "").strip().split() if part]
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])


def _upsert_contact(token: str, lead: Dict) -> str:
    email = (lead.get("email") or "").strip()
    phone = (lead.get("phone") or "").strip()
    existing = _find_contact(token, "email", email) if email else None
    if not existing and phone:
        existing = _find_contact(token, "phone", phone)

    first_name, last_name = _split_name(lead.get("name") or "")
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
        _hubspot_request("PATCH", f"/crm/v3/objects/contacts/{contact_id}", token, json={"properties": properties})
        return contact_id

    created = _hubspot_request("POST", "/crm/v3/objects/contacts", token, json={"properties": properties})
    return created["id"]


def _default_deal_pipeline_and_stage(token: str) -> tuple[str, str]:
    data = _hubspot_request("GET", "/crm/v3/pipelines/deals", token)
    pipelines = [p for p in (data.get("results") or []) if not p.get("archived")]
    if not pipelines:
        raise RuntimeError("No active HubSpot deal pipeline found")
    pipeline = sorted(pipelines, key=lambda p: p.get("displayOrder", 999999))[0]
    stages = [s for s in (pipeline.get("stages") or []) if not s.get("archived")]
    if not stages:
        raise RuntimeError("No active HubSpot deal stage found")
    stage = sorted(stages, key=lambda s: s.get("displayOrder", 999999))[0]
    return pipeline["id"], stage["id"]


def _deal_description(lead: Dict) -> str:
    return "\n".join(_lead_lines(lead))


def _associate_deal_contact(token: str, deal_id: str, contact_id: str) -> None:
    labels = _hubspot_request("GET", "/crm/v4/associations/deals/contacts/labels", token)
    candidates = labels.get("results") or []
    association = next(
        (item for item in candidates if item.get("category") == "HUBSPOT_DEFINED" and not item.get("label")),
        None,
    ) or next((item for item in candidates if item.get("category") == "HUBSPOT_DEFINED"), None)
    if not association:
        raise RuntimeError("No HubSpot deal-to-contact association type found")
    association_type_id = association.get("typeId")
    _hubspot_request(
        "PUT",
        f"/crm/v3/objects/deals/{deal_id}/associations/contacts/{contact_id}/{association_type_id}",
        token,
    )


def sync_quote_to_hubspot(lead: Dict) -> None:
    token = (os.environ.get("HUBSPOT_PRIVATE_APP_TOKEN") or "").strip()
    if not token:
        logging.info("HubSpot lead sync disabled: HUBSPOT_PRIVATE_APP_TOKEN is not configured")
        return

    try:
        contact_id = _upsert_contact(token, lead)
        pipeline_id, stage_id = _default_deal_pipeline_and_stage(token)
        owner_id = (os.environ.get("HUBSPOT_OWNER_ID") or "").strip()
        properties = {
            "dealname": f"{lead.get('service', 'Website enquiry')} — {lead.get('name', '')} — {lead.get('suburb', '')}"[:255],
            "pipeline": pipeline_id,
            "dealstage": stage_id,
            "description": _deal_description(lead),
        }
        if owner_id:
            properties["hubspot_owner_id"] = owner_id

        created = _hubspot_request("POST", "/crm/v3/objects/deals", token, json={"properties": properties})
        _associate_deal_contact(token, created["id"], contact_id)
        logging.info("Synced website lead %s to HubSpot deal %s", lead.get("id"), created.get("id"))
    except Exception as exc:
        logging.exception("HubSpot lead sync failed: %s", exc)


def valid_admin_key(provided_key: Optional[str]) -> bool:
    expected = os.environ.get("ADMIN_API_KEY") or ""
    if not expected or not provided_key:
        return False
    return hmac.compare_digest(expected, provided_key)
