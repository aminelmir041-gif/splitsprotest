import hashlib
import hmac
import json
import logging
import os
import uuid
from typing import Any, Dict

import requests

INFINIREACH_API_BASE = "https://api.infinireach.io"


def sms_configured() -> bool:
    return bool(
        (os.environ.get("INFINIREACH_API_KEY") or "").strip()
        and (os.environ.get("INFINIREACH_FROM_NUMBER") or "").strip()
    )


def send_sms(to: str, body: str) -> Dict[str, Any]:
    api_key = (os.environ.get("INFINIREACH_API_KEY") or "").strip()
    from_number = (os.environ.get("INFINIREACH_FROM_NUMBER") or "").strip()
    if not api_key or not from_number:
        raise RuntimeError("INFINIREACH_API_KEY/INFINIREACH_FROM_NUMBER are not configured")

    response = requests.post(
        f"{INFINIREACH_API_BASE}/api/v1/messages",
        headers={
            "X-API-Key": api_key,
            "Content-Type": "application/json",
        },
        json={
            "to": to,
            "message": body,
            "from": from_number,
            "channel": "sms",
            "externalId": str(uuid.uuid4()),
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def _hmac_hex(secret: str, payload: bytes) -> str:
    return hmac.new(secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()


def verify_webhook(raw_body: bytes, signature: str, secret: str) -> bool:
    if not signature or not secret:
        return False

    supplied = signature.strip().lower()
    candidates = [_hmac_hex(secret, raw_body)]

    # InfiniReach docs verify HMAC-SHA256 over JSON.stringify(payload).
    # Also try a compact JSON serialization in case the provider normalizes JSON.
    try:
        parsed = json.loads(raw_body.decode("utf-8"))
        compact = json.dumps(parsed, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
        candidates.append(_hmac_hex(secret, compact))
    except Exception:
        pass

    return any(hmac.compare_digest(candidate.lower(), supplied) for candidate in candidates)


def parse_webhook(raw_body: bytes, signature: str) -> Dict[str, Any]:
    secret = (os.environ.get("INFINIREACH_WEBHOOK_SECRET") or "").strip()
    if not secret:
        raise RuntimeError("INFINIREACH_WEBHOOK_SECRET is not configured")
    if not verify_webhook(raw_body, signature, secret):
        raise PermissionError("Invalid InfiniReach webhook signature")
    return json.loads(raw_body.decode("utf-8"))


def log_sms_event(event: Dict[str, Any]) -> None:
    event_name = event.get("event") or "unknown"
    data = event.get("data") or {}
    if event_name in {"message.inbound", "message.received"}:
        logging.info(
            "Inbound SMS received message_id=%s sender=%s recipient=%s body=%s",
            data.get("messageId"),
            data.get("from"),
            data.get("to"),
            data.get("body") or data.get("message"),
        )
    else:
        logging.info(
            "InfiniReach event=%s message_id=%s status=%s",
            event_name,
            data.get("messageId"),
            data.get("status"),
        )
