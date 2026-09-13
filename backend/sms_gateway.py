import hashlib
import hmac
import json
import logging
import os
import time
from typing import Any, Dict

import requests

SMSGATE_API_BASE = "https://api.sms-gate.app/3rdparty/v1"


def sms_configured() -> bool:
    return bool(
        (os.environ.get("SMSGATE_USERNAME") or "").strip()
        and (os.environ.get("SMSGATE_PASSWORD") or "").strip()
    )


def send_sms(to: str, body: str) -> Dict[str, Any]:
    username = (os.environ.get("SMSGATE_USERNAME") or "").strip()
    password = (os.environ.get("SMSGATE_PASSWORD") or "").strip()
    if not username or not password:
        raise RuntimeError("SMSGATE_USERNAME/SMSGATE_PASSWORD are not configured")

    response = requests.post(
        f"{SMSGATE_API_BASE}/messages",
        auth=(username, password),
        headers={"Content-Type": "application/json"},
        json={
            "textMessage": {"text": body},
            "phoneNumbers": [to],
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def verify_webhook(raw_body: bytes, signature: str, timestamp: str, secret: str, tolerance_seconds: int = 300) -> bool:
    if not signature or not timestamp or not secret:
        return False
    try:
        timestamp_int = int(timestamp)
    except (TypeError, ValueError):
        return False
    if abs(int(time.time()) - timestamp_int) > tolerance_seconds:
        return False

    # SMSGate signs: raw request body text + X-Timestamp
    signed_payload = raw_body + timestamp.encode("utf-8")
    expected = hmac.new(secret.encode("utf-8"), signed_payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected.lower(), signature.strip().lower())


def parse_webhook(raw_body: bytes, signature: str, timestamp: str) -> Dict[str, Any]:
    secret = (os.environ.get("SMSGATE_WEBHOOK_SIGNING_KEY") or "").strip()
    if not secret:
        raise RuntimeError("SMSGATE_WEBHOOK_SIGNING_KEY is not configured")
    if not verify_webhook(raw_body, signature, timestamp, secret):
        raise PermissionError("Invalid or stale SMSGate webhook signature")
    return json.loads(raw_body.decode("utf-8"))


def log_sms_event(event: Dict[str, Any]) -> None:
    event_name = event.get("event") or "unknown"
    payload = event.get("payload") or {}
    if event_name == "sms:received":
        logging.info(
            "Inbound SMS received id=%s message_id=%s sender=%s recipient=%s body=%s",
            event.get("id"),
            payload.get("messageId"),
            payload.get("sender") or payload.get("phoneNumber"),
            payload.get("recipient"),
            payload.get("message"),
        )
    else:
        logging.info(
            "SMSGate event=%s id=%s message_id=%s",
            event_name,
            event.get("id"),
            payload.get("messageId"),
        )
