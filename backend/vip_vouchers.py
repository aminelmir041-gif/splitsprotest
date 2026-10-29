"""Shareable SplitsPro partner vouchers: five server-enforced claims per invite.

Important: Free Render Key Value storage is volatile. This module deliberately
fails closed if a Redis restart loses a partner record; it never automatically
recreates partner records or silently resets a campaign's claim allowance.
For uninterrupted campaigns, use a persistent store.
"""
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import hashlib
import hmac
import logging
import os
import re
import secrets
import uuid

import redis
from fastapi import APIRouter, BackgroundTasks, Header, HTTPException
from pydantic import BaseModel, Field, field_validator

from .lead_integrations import notify_quote, sync_quote_to_hubspot, valid_admin_key

router = APIRouter(prefix="/api/vip", tags=["VIP vouchers"])
SYDNEY = ZoneInfo("Australia/Sydney")
LIMIT = 5
API_ORIGIN = "https://splitspro.com.au/vip-deep-clean/"
ALLOWED_SUBURBS = frozenset({
    "bass hill", "chester hill", "bankstown", "birrong",
    "sefton", "yagoona", "condell park", "greenacre",
})
CLAIMS_TTL = 60 * 60 * 24 * 35
PARTNER_TTL = 60 * 60 * 24 * 15
CODE_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{24,80}$")

# One atomic Redis operation for checking expiry, duplicate mobile, capacity
# and recording an accepted claim; multiple simultaneous customers cannot
# push the same partner above five.
CLAIM_LUA = """
local expiry = redis.call('HGET', KEYS[1], 'expires_epoch')
if not expiry then return -1 end
local now = tonumber(redis.call('TIME')[1])
if now >= tonumber(expiry) then return -2 end
if redis.call('EXISTS', KEYS[3]) == 1 then return 2 end
if redis.call('SISMEMBER', KEYS[2], ARGV[1]) == 1 then return 2 end
if redis.call('SCARD', KEYS[2]) >= tonumber(ARGV[2]) then return 0 end
redis.call('SADD', KEYS[2], ARGV[1])
redis.call('EXPIRE', KEYS[2], tonumber(ARGV[3]))
redis.call('SET', KEYS[3], 'claimed', 'EX', tonumber(ARGV[3]), 'NX')
return 1
"""


def _redis():
    url = (os.environ.get("REDIS_URL") or "").strip()
    if not url:
        raise HTTPException(status_code=503, detail="Voucher claims are temporarily unavailable")
    try:
        conn = redis.Redis.from_url(url, decode_responses=True,
                                    socket_connect_timeout=5, socket_timeout=8)
        conn.ping()
        return conn
    except (redis.RedisError, OSError) as exc:
        logging.warning("VIP voucher Redis unavailable: %s", type(exc).__name__)
        raise HTTPException(status_code=503, detail="Voucher claims are temporarily unavailable") from exc


def _valid_code(code: str) -> str:
    code = (code or "").strip()
    if not CODE_PATTERN.fullmatch(code):
        raise HTTPException(status_code=404, detail="This VIP invitation is not available")
    return code


def _partner_key(code: str) -> str:
    return "splitspro:vip:partner:" + code


def _claims_key(code: str) -> str:
    return "splitspro:vip:claims:" + code


def _phone_key(phone_digest: str) -> str:
    return "splitspro:vip:phone:" + phone_digest


def _normalise_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if digits.startswith("61") and len(digits) == 11:
        digits = "0" + digits[2:]
    if not re.fullmatch(r"0[0-9]{9}", digits):
        raise HTTPException(status_code=422, detail="Enter a valid Australian mobile number")
    if not digits.startswith("04"):
        raise HTTPException(status_code=422, detail="Enter an Australian mobile number")
    return digits


def _phone_digest(phone: str) -> str:
    secret = (os.environ.get("VIP_SIGNING_KEY") or os.environ.get("ADMIN_API_KEY") or "").strip()
    if not secret:
        # No stable hashing key means we cannot safely maintain deduplication.
        raise HTTPException(status_code=503, detail="Voucher configuration incomplete")
    return hmac.new(secret.encode("utf-8"), phone.encode("utf-8"), hashlib.sha256).hexdigest()


def _status(conn, code: str) -> dict:
    data = conn.hgetall(_partner_key(code))
    if not data:
        raise HTTPException(status_code=404, detail="This VIP invitation is no longer active")
    expires_epoch = int(data["expires_epoch"])
    claims = int(conn.scard(_claims_key(code)))
    expires = datetime.fromtimestamp(expires_epoch, SYDNEY).strftime("%-d %b %Y").upper()
    now = int(datetime.now(SYDNEY).timestamp())
    state = "expired" if now >= expires_epoch else "full" if claims >= LIMIT else "active"
    return {
        "status": state,
        "claimed": min(claims, LIMIT),
        "remaining": max(0, LIMIT - claims),
        "limit": LIMIT,
        "use_by": expires,
        "partner": data.get("label", "SplitsPro partner"),
    }


class PartnerIssue(BaseModel):
    label: str = Field(min_length=2, max_length=100)

    @field_validator("label")
    @classmethod
    def clean_label(cls, value: str) -> str:
        return value.strip()


class VipClaim(BaseModel):
    code: str = Field(min_length=24, max_length=80)
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=8, max_length=25)
    suburb: str = Field(min_length=3, max_length=80)

    @field_validator("name", "phone", "suburb")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()


@router.post("/partners")
def create_partner(payload: PartnerIssue, x_admin_key: str | None = Header(default=None, alias="X-Admin-Key")):
    if not valid_admin_key(x_admin_key):
        raise HTTPException(status_code=401, detail="Unauthorized")
    conn = _redis()
    now = datetime.now(SYDNEY)
    deadline = now + timedelta(days=14)
    # High-entropy opaque invitation link, not a guessable business name.
    code = secrets.token_urlsafe(24)
    key = _partner_key(code)
    try:
        result = conn.hset(key, mapping={
            "label": payload.label, "issued_at": now.isoformat(),
            "expires_epoch": str(int(deadline.timestamp())),
        })
        conn.expire(key, PARTNER_TTL)
        if result < 1:
            raise RuntimeError("Partner code collision")
    except (redis.RedisError, OSError, RuntimeError) as exc:
        logging.exception("Failed to issue VIP partner invitation")
        raise HTTPException(status_code=503, detail="Could not issue invitation") from exc
    return {
        "partner": payload.label,
        "url": API_ORIGIN + "?pass=" + code,
        "status": "active",
        "limit": LIMIT,
        "remaining": LIMIT,
        "use_by": deadline.strftime("%-d %b %Y").upper(),
    }


@router.get("/status")
def voucher_status(code: str):
    code = _valid_code(code)
    conn = _redis()
    try:
        return _status(conn, code)
    except (redis.RedisError, OSError) as exc:
        logging.warning("Could not read VIP status: %s", type(exc).__name__)
        raise HTTPException(status_code=503, detail="Voucher status unavailable") from exc


@router.post("/claim")
def voucher_claim(payload: VipClaim, background_tasks: BackgroundTasks):
    code = _valid_code(payload.code)
    suburb = payload.suburb.strip()
    if suburb.casefold() not in ALLOWED_SUBURBS:
        raise HTTPException(status_code=422, detail="This offer is only available in our listed local suburbs")
    mobile = _normalise_phone(payload.phone)
    digest = _phone_digest(mobile)
    conn = _redis()
    try:
        result = int(conn.eval(
            CLAIM_LUA, 3,
            _partner_key(code), _claims_key(code), _phone_key(digest),
            digest, LIMIT, CLAIMS_TTL,
        ))
        if result == -1:
            raise HTTPException(status_code=404, detail="This VIP invitation is no longer available")
        if result == -2:
            raise HTTPException(status_code=410, detail="This VIP invitation has expired")
        if result == 0:
            raise HTTPException(status_code=409, detail="All five VIP places have already been claimed")
        if result == 2:
            raise HTTPException(status_code=409, detail="A VIP claim has already been registered for this mobile number")
        if result != 1:
            raise HTTPException(status_code=503, detail="Could not process this claim")
        # New claim was accepted atomically, so only now send the lead notification.
        lead = {
            "id": str(uuid.uuid4()),
            "name": payload.name.strip(),
            "phone": mobile,
            "email": "",
            "suburb": suburb,
            "service": "VIP Bare-Bones Deep Clean — $100",
            "message": "VIP voucher accepted; partner code: " + code,
            "lead_source": "vip-partner-" + code[:8],
            "page_url": API_ORIGIN + "?pass=" + code,
            "created_at": datetime.now(SYDNEY).isoformat(),
        }
        background_tasks.add_task(notify_quote, lead)
        background_tasks.add_task(sync_quote_to_hubspot, lead)
        state = _status(conn, code)
        return {"accepted": True, "message": "Your VIP claim is received. SplitsPro will contact you to confirm a local appointment.", **state}
    except HTTPException:
        raise
    except (redis.RedisError, OSError) as exc:
        logging.exception("VIP claim store unavailable")
        raise HTTPException(status_code=503, detail="Voucher claims temporarily unavailable") from exc
