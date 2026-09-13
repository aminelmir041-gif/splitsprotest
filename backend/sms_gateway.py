import hmac
import json
import logging
import os
from typing import Any, Dict

import requests

MYSMSGATE_API_BASE = "https://mysmsgate.net/api/v1"


def sms_configured() -> bool:
    return bool((os.environ.get("MYSMSGATE_API_KEY") or "").strip())


def send_sms(to: str, body: str) -> Dict[str, Any]:
    api_key = (os.environ.get("MYSMSGATE_API_KEY") or "").strip()
    if not api_key:
        raise RuntimeError("MYSMSGATE_API_KEY is not configured")

    payload: Dict[str, Any] = {"to": to, "message": body}
    device_id = (os.environ.get("MYSMSGATE_DEVICE_ID") or "").strip()
    slot = (os.environ.get("MYSMSGATE_SIM_SLOT") or "").strip()
    if device_id:
        payload["device_id"] = device_id
    if slot:
        try:
            payload["slot"] = int(slot)
        except ValueError:
            logging.warning("Ignoring invalid MYSMSGATE_SIM_SLOT=%s", slot)

    response = requests.post(
        f"{MYSMSGATE_API_BASE}/send",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def parse_webhook(raw_body: bytes, token: str) -> Dict[str, Any]:
    expected = (os.environ.get("MYSMSGATE_WEBHOOK_TOKEN") or "").strip()
    if not expected:
        raise RuntimeError("MYSMSGATE_WEBHOOK_TOKEN is not configured")
    if not token or not hmac.compare_digest(token, expected):
        raise PermissionError("Invalid MySMSGate webhook token")
    return json.loads(raw_body.decode("utf-8"))


def log_sms_event(event: Dict[str, Any]) -> None:
    event_name = event.get("event") or event.get("eventType") or event.get("type") or "unknown"
    sender = event.get("from") or event.get("sender") or event.get("phone_from")
    recipient = event.get("to") or event.get("recipient") or event.get("phone_to")
    message = event.get("message") or event.get("text") or event.get("body")
    message_id = event.get("message_id") or event.get("messageId") or event.get("id")
    status = event.get("status")

    if str(event_name).lower() in {"incoming", "incomingmessage", "sms.received", "received"}:
        logging.info(
            "Inbound MySMSGate SMS id=%s sender=%s recipient=%s body=%s",
            message_id,
            sender,
            recipient,
            message,
        )
    else:
        logging.info(
            "MySMSGate event=%s id=%s status=%s sender=%s recipient=%s",
            event_name,
            message_id,
            status,
            sender,
            recipient,
        )
