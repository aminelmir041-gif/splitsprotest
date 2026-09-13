import hashlib
import hmac
import json
import logging
import os
import time
from typing import Any, Dict, Optional

import requests

SIMHOOK_API_BASE = "https://api.simhook.dev/v1"


def sms_configured() -> bool:
    return bool((os.environ.get("SIMHOOK_API_KEY") or "").strip())


def send_sms(to: str, body: str) -> Dict[str, Any]:
    api_key = (os.environ.get("SIMHOOK_API_KEY") or "").strip()
    if not api_key:
        raise RuntimeError("SIMHOOK_API_KEY is not configured")
    response = requests.post(
        f"{SIMHOOK_API_BASE}/messages",
        headers={"X-Api-Key": api_key, "Content-Type": "application/json"},
        json={"to": [to], "body": body},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def _parse_signature(signature: str) -> tuple[Optional[int], list[str]]:
    timestamp: Optional[int] = None
    signatures: list[str] = []
    for part in (signature or "").split(","):
        if "=" not in part:
            continue
        key, value = [x.strip() for x in part.split("=", 1)]
        if key == "t" and value.isdigit():
            timestamp = int(value)
        elif key == "v1" and value:
            signatures.append(value)
    return timestamp, signatures


def verify_webhook(raw_body: bytes, signature: str, secret: str, tolerance_seconds: int = 300) -> bool:
    timestamp, signatures = _parse_signature(signature)
    if not timestamp or not signatures or not secret:
        return False
    if abs(int(time.time()) - timestamp) > tolerance_seconds:
        return False
    signed_payload = f"{timestamp}.".encode("utf-8") + raw_body
    expected = hmac.new(secret.encode("utf-8"), signed_payload, hashlib.sha256).hexdigest()
    return any(hmac.compare_digest(candidate, expected) for candidate in signatures)


def parse_webhook(raw_body: bytes, signature: str) -> Dict[str, Any]:
    secret = (os.environ.get("SIMHOOK_WEBHOOK_SECRET") or "").strip()
    if not secret:
        raise RuntimeError("SIMHOOK_WEBHOOK_SECRET is not configured")
    if not verify_webhook(raw_body, signature, secret):
        raise PermissionError("Invalid or stale Simhook webhook signature")
    return json.loads(raw_body.decode("utf-8"))


def log_sms_event(event: Dict[str, Any]) -> None:
    event_name = event.get("event") or "unknown"
    data = event.get("data") or {}
    if event_name == "message.received":
        logging.info(
            "Inbound SMS received id=%s sender=%s body=%s",
            event.get("id"),
            data.get("sender"),
            data.get("body"),
        )
    else:
        logging.info("Simhook event=%s id=%s", event_name, event.get("id"))
