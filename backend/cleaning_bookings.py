"""SplitsPro cleaning appointments with optional $200 booking part-payment.

One server-side price and calendar source of truth. Cleaning appointments take
90 minutes per unit; installation half-day bookings and cleaning appointments
share the same Redis-backed day lock and block one another.
"""
from datetime import datetime, timedelta, date
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Literal
from zoneinfo import ZoneInfo
import json
import logging
import os
import re
import uuid
import time

import redis
import requests
from fastapi import APIRouter, BackgroundTasks, HTTPException, Response
from pydantic import BaseModel, Field, field_validator

from .lead_integrations import notify_quote, sync_quote_to_hubspot
from .equipment_checkout import paypal_token

router = APIRouter()
TZ = ZoneInfo(os.environ.get("BOOKING_TIMEZONE", "Australia/Sydney"))
BOOKING_BLOCKS_FILE = Path(__file__).parent / "booking_blocks.json"
LOOKAHEAD = max(2, min(30, int(os.environ.get("BOOKING_LOOKAHEAD_DAYS", "14"))))
WORKDAYS = {
    int(n) for n in os.environ.get("BOOKING_WORKDAYS", "0,1,2,3,4,5,6").split(",")
    if n.strip().isdigit() and 0 <= int(n) <= 6
}
# Stripe Checkout sessions cannot expire sooner than 30 minutes. Keep the
# temporary availability hold only slightly longer than the Stripe session.
# An abandoned checkout automatically frees the slot; a cancellation frees it
# immediately through the verified cancellation endpoint below.
HOLD_SECONDS = 32 * 60
STRIPE_SESSION_SECONDS = 31 * 60

FIRST_CLEAN_CENTS = 30000  # standard price and hard promotional cap
EARLY_CLEAN_START = date(2026, 10, 22)
EARLY_CLEAN_START_CENTS = 22000
EARLY_CLEAN_WEEKLY_INCREASE_CENTS = 2000
ADDITIONAL_CLEAN_CENTS = 15000
CLEANING_BOOKING_PAYMENT_CENTS = 20000
# Existing LIVE Stripe prices owned by the connected SplitsPro merchant account.
STRIPE_FIRST_CLEAN_PRICE = "price_1UQOyqPpUx7EUhdNSOh3J3j6"
STRIPE_ADDITIONAL_CLEAN_PRICE = "price_1UQP2JPpUx7EUhdNIUL0YefK"
STRIPE_CLEANING_BOOKING_PRICE = "price_1UQgKvPpUx7EUhdNDtgFNRLv"
MAX_SYSTEMS = 7
SLOT_MINUTES = 90
START_MINUTE = 8 * 60
CLOSING_MINUTE = 18 * 60 + 30
START_TIMES = tuple(range(START_MINUTE, CLOSING_MINUTE, SLOT_MINUTES))
MORNING = (8 * 60, 12 * 60 + 30)
AFTERNOON = (12 * 60 + 30, CLOSING_MINUTE)
BOOKING_TTL = 60 * 60 * 24 * 90


def booking_enabled():
    return (os.environ.get("SPLITSPRO_CLEANING_BOOKING_ENABLED") or "").strip().lower() in {"1", "true", "yes"}


def require_booking_enabled():
    if not booking_enabled():
        raise HTTPException(status_code=503, detail="Timed cleaning bookings are temporarily unavailable")


def scheduled_first_clean_cents(on_day: date) -> int:
    """Early-booking event, from $220 on 22 October; $20 up each Thursday.

    Returns to $300 on 19 November and stays at that cap through Black Friday.
    The price is calculated when the server creates a paid booking hold, not
    from a customer-supplied date or amount.
    """
    if on_day < EARLY_CLEAN_START:
        return FIRST_CLEAN_CENTS
    elapsed_weeks = (on_day - EARLY_CLEAN_START).days // 7
    return min(FIRST_CLEAN_CENTS, EARLY_CLEAN_START_CENTS + EARLY_CLEAN_WEEKLY_INCREASE_CENTS * elapsed_weeks)


def first_clean_cents() -> int:
    return scheduled_first_clean_cents(datetime.now(TZ).date())


def price_cents(quantity: int) -> int:
    if type(quantity) is not int or not 1 <= quantity <= MAX_SYSTEMS:
        raise ValueError("Choose between 1 and 7 split systems")
    return first_clean_cents() + ADDITIONAL_CLEAN_CENTS * (quantity - 1)


def amount_to_charge_cents(quantity: int, payment_choice: str) -> int:
    total = price_cents(quantity)
    if payment_choice == "booking":
        return CLEANING_BOOKING_PAYMENT_CENTS
    if payment_choice == "full":
        return total
    raise ValueError("Unknown payment choice")


def parse_time(value: str) -> int:
    if not isinstance(value, str) or not re.fullmatch(r"(?:0[89]|1[0-7]):(?:00|30)", value):
        raise ValueError("Invalid cleaning time")
    hours, minutes = (int(part) for part in value.split(":"))
    result = 60 * hours + minutes
    if result not in START_TIMES:
        raise ValueError("Choose a published cleaning start time")
    return result


def format_time(minutes: int) -> str:
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def overlaps(a: tuple[int, int], b: tuple[int, int]) -> bool:
    return a[0] < b[1] and b[0] < a[1]


def day_lock_key(job_date: str) -> str:
    return f"splitspro:calendar-day-lock:{job_date}"


def client():
    secret = (os.environ.get("REDIS_URL") or "").strip()
    if not secret:
        raise HTTPException(status_code=503, detail="Live booking storage is not configured")
    return redis.Redis.from_url(
        secret, decode_responses=True, socket_timeout=8, socket_connect_timeout=8,
        retry_on_timeout=True, health_check_interval=30
    )


def hold_key(ref):
    return "splitspro:cleaning-hold:" + ref


def confirmed_key(ref):
    return "splitspro:cleaning-confirmed:" + ref


def paid_key(ref):
    return "splitspro:cleaning-paid:" + ref


def order_key(ref):
    return "splitspro:cleaning-order:" + ref


def _get_json(connection, key):
    raw = connection.get(key)
    return json.loads(raw) if raw else None


def manual_blocks():
    try:
        payload = json.loads(BOOKING_BLOCKS_FILE.read_text())
    except Exception:
        payload = {"blocked": []}
    blocked = set()
    for item in payload.get("blocked", []):
        d = str(item.get("date", ""))
        w = str(item.get("window", ""))
        if w == "All":
            blocked.update({(d, "Morning"), (d, "Afternoon")})
        elif w in {"Morning", "Afternoon"}:
            blocked.add((d, w))
    return blocked


def _legacy_installation_busy(connection, job_date: str, window: str) -> bool:
    """Read existing installation bookings and checkout holds, not a parallel calendar."""
    try:
        if int(connection.get(f"splitspro:booking:{job_date}:{window.lower()}") or 0):
            return True
    except (TypeError, ValueError):
        return True
    for key in connection.scan_iter(match="splitspro:booking-hold:*", count=100):
        try:
            payload = _get_json(connection, key)
            if payload and payload.get("booking_date") == job_date and payload.get("booking_window") == window:
                return True
        except (ValueError, TypeError):
            continue
    return False


def _cleaning_records(connection, job_date: str):
    for prefix in ("splitspro:cleaning-hold:*", "splitspro:cleaning-confirmed:*"):
        for key in connection.scan_iter(match=prefix, count=100):
            try:
                item = _get_json(connection, key)
                if item and item.get("booking_date") == job_date:
                    yield item
            except (TypeError, ValueError, KeyError):
                continue


def cleaning_blocks_installation(connection, job_date: str, window: str) -> bool:
    """Called by legacy installation availability and checkout under the same day lock."""
    interval = MORNING if window == "Morning" else AFTERNOON
    for item in _cleaning_records(connection, job_date):
        try:
            start = parse_time(item["start_time"])
            end = start + SLOT_MINUTES * int(item["quantity"])
            if overlaps(interval, (start, end)):
                return True
        except (ValueError, KeyError, TypeError):
            continue
    return False


def _slot_is_free(connection, job_date: str, start_time: str, quantity: int) -> bool:
    start = parse_time(start_time)
    requested = (start, start + SLOT_MINUTES * quantity)
    if requested[1] > CLOSING_MINUTE:
        return False
    blocked = manual_blocks()
    if (job_date, "Morning") in blocked and overlaps(requested, MORNING):
        return False
    if (job_date, "Afternoon") in blocked and overlaps(requested, AFTERNOON):
        return False
    if overlaps(requested, MORNING) and _legacy_installation_busy(connection, job_date, "Morning"):
        return False
    if overlaps(requested, AFTERNOON) and _legacy_installation_busy(connection, job_date, "Afternoon"):
        return False
    for item in _cleaning_records(connection, job_date):
        try:
            other_start = parse_time(item["start_time"])
            other_end = other_start + SLOT_MINUTES * int(item["quantity"])
            if overlaps(requested, (other_start, other_end)):
                return False
        except (ValueError, TypeError, KeyError):
            continue
    return True


def validate_date(value: str):
    try:
        target = date.fromisoformat(value)
    except (TypeError, ValueError) as exc:
        raise HTTPException(status_code=422, detail="Please choose a valid cleaning date") from exc
    delta = (target - datetime.now(TZ).date()).days
    if delta < 1 or delta > LOOKAHEAD or target.weekday() not in WORKDAYS:
        raise HTTPException(status_code=409, detail="That date is outside the available booking calendar")
    return target


@router.get("/api/cleaning-checkout-config")
def cleaning_config(response: Response):
    response.headers["Cache-Control"] = "no-store"
    return {
        "currency": "AUD", "enabled": booking_enabled(), "first_system": first_clean_cents() / 100,
        "each_additional_system": ADDITIONAL_CLEAN_CENTS / 100,
        "max_systems": MAX_SYSTEMS,
        "booking_payment": CLEANING_BOOKING_PAYMENT_CENTS / 100,
        "default_payment_choice": "booking",
        "regular_first_system": FIRST_CLEAN_CENTS / 100,
        "weekly_price_increase": EARLY_CLEAN_WEEKLY_INCREASE_CENTS / 100,
        "promotion_regular_price_date": "2026-11-19",
        "stripe_ready": bool((os.environ.get("STRIPE_SECRET_KEY") or "").strip()
                             and (os.environ.get("STRIPE_WEBHOOK_SECRET") or "").strip()),
        "paypal_ready": bool((os.environ.get("PAYPAL_CLIENT_ID") or "").strip()
                             and (os.environ.get("PAYPAL_CLIENT_SECRET") or "").strip()),
    }


@router.get("/api/cleaning-slots")
def cleaning_slots(response: Response, quantity: int = 1, limit: int = 70):
    response.headers["Cache-Control"] = "no-store, max-age=0"
    response.headers["Pragma"] = "no-cache"
    require_booking_enabled()
    try:
        price_cents(quantity)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    connection = client()
    try:
        connection.ping()
        out = []
        today = datetime.now(TZ).date()
        for offset in range(1, LOOKAHEAD + 1):
            target = today + timedelta(days=offset)
            if target.weekday() not in WORKDAYS:
                continue
            for start in START_TIMES:
                candidate = format_time(start)
                if _slot_is_free(connection, target.isoformat(), candidate, quantity):
                    out.append({
                        "date": target.isoformat(), "time": candidate,
                        "end_time": format_time(start + SLOT_MINUTES * quantity),
                        "duration_minutes": SLOT_MINUTES * quantity,
                    })
                    if len(out) >= max(1, min(100, limit)):
                        return {"timezone": str(TZ), "quantity": quantity, "slots": out}
        return {"timezone": str(TZ), "quantity": quantity, "slots": out}
    except (redis.RedisError, OSError) as exc:
        logging.exception("Cleaning availability storage failed")
        raise HTTPException(status_code=503, detail="Unable to check live cleaning dates right now") from exc


class CleaningCheckoutRequest(BaseModel):
    quantity: int = Field(ge=1, le=MAX_SYSTEMS)
    booking_date: str
    start_time: str
    payment_provider: Literal["stripe", "paypal"]
    # Legacy in-flight checkout clients still pay full amount by default.
    payment_choice: Literal["booking", "full"] = "full"
    name: str = Field(min_length=2, max_length=120)
    address: str = Field(min_length=6, max_length=300)
    phone: str = Field(min_length=8, max_length=32)
    email: str = Field(max_length=254)
    page_url: str = ""
    referrer: str = ""

    @field_validator("start_time")
    @classmethod
    def correct_time(cls, v):
        try:
            parse_time(v)
        except ValueError as exc:
            raise ValueError(str(exc)) from exc
        return v

    @field_validator("email")
    @classmethod
    def correct_email(cls, v):
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", v.strip()):
            raise ValueError("Enter a valid email address")
        return v.strip().lower()

    @field_validator("phone")
    @classmethod
    def correct_phone(cls, v):
        if len(re.sub(r"\D", "", v)) < 8:
            raise ValueError("Enter a valid phone number")
        return v.strip()


def _return_params(hold, status: str):
    from urllib.parse import urlencode
    query = {
        "count": str(hold["quantity"]), "date": hold["booking_date"],
        "time": hold["start_time"], "checkout_ref": hold["reference"],
        "cleaning_payment": status,
        "choice": hold.get("payment_choice", "full"),
    }
    if status == "returned" and hold["payment_provider"] == "paypal":
        query["provider"] = "paypal"
    return "https://splitspro.com.au/secure-cleaning?" + urlencode(query)


def _create_stripe_checkout(hold):
    secret = (os.environ.get("STRIPE_SECRET_KEY") or "").strip()
    if not secret:
        raise HTTPException(status_code=503, detail="Stripe is not yet enabled for cleaning checkout")
    body = {
        "mode": "payment",
        # Use the account's active Dashboard payment-method configuration.
        # Stripe determines which BNPL methods are eligible for each payment;
        # payment_method_types cannot be forced on this account.
        "payment_method_configuration": "pmc_1UNgZ0PpUx7EUhdNwdVqO3md",
        "expires_at": str(int(time.time()) + STRIPE_SESSION_SECONDS),
        "client_reference_id": hold["reference"],
        "customer_email": hold["lead"]["email"],
        "success_url": _return_params(hold, "returned") + "&session_id={CHECKOUT_SESSION_ID}",
        "cancel_url": _return_params(hold, "cancelled"),
        "metadata[checkout_type]": "cleaning",
        "metadata[cleaning_ref]": hold["reference"],
        # Only server-calculated, fixed-at-hold amounts reach Stripe.
        "line_items[0][quantity]": "1",
        "metadata[quantity]": str(hold["quantity"]),
        "metadata[payment_choice]": hold.get("payment_choice", "full"),
        "metadata[service_total_cents]": str(hold["total_cents"]),
        "metadata[balance_due_cents]": str(hold.get("balance_cents", 0)),
        # Service address already captured by SplitsPro before redirect; no duplicate address form.
    }
    if hold.get("payment_choice") == "booking":
        # The existing $200 Stripe price remains unchanged for part-payment.
        body["line_items[0][price]"] = STRIPE_CLEANING_BOOKING_PRICE
    elif hold["total_cents"] == FIRST_CLEAN_CENTS + ADDITIONAL_CLEAN_CENTS * (hold["quantity"] - 1):
        # Reuse existing Dashboard prices whenever the event is over.
        body["line_items[0][price]"] = STRIPE_FIRST_CLEAN_PRICE
        if hold["quantity"] > 1:
            body["line_items[1][price]"] = STRIPE_ADDITIONAL_CLEAN_PRICE
            body["line_items[1][quantity]"] = str(hold["quantity"] - 1)
    else:
        # Checkout supports inline Price data for a genuine time-limited price.
        # Product and amount come exclusively from our server-side booking hold.
        body["line_items[0][price_data][currency]"] = "aud"
        body["line_items[0][price_data][unit_amount]"] = str(hold["total_cents"])
        body["line_items[0][price_data][product_data][name]"] = (
            f'SplitsPro complete split-system deep cleaning — {hold["quantity"]} unit(s)'
        )
    try:
        res = requests.post(
            "https://api.stripe.com/v1/checkout/sessions",
            headers={"Authorization": "Bearer " + secret,
                     "Idempotency-Key": "cleaning-" + hold["reference"]},
            data=body, timeout=25,
        )
        res.raise_for_status()
        checkout = res.json()
    except (requests.RequestException, ValueError) as exc:
        logging.warning("Cleaning Stripe checkout unavailable: %s", type(exc).__name__)
        raise HTTPException(status_code=502, detail="Unable to open Stripe checkout. No payment was taken.") from exc
    if not checkout.get("url") or not checkout.get("id"):
        raise HTTPException(status_code=502, detail="Stripe did not return a checkout link")
    hold["stripe_session_id"] = checkout["id"]
    return checkout["url"]


def _create_paypal_checkout(hold):
    from urllib.parse import quote
    token = paypal_token()
    body = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "reference_id": hold["reference"],
            "custom_id": hold["reference"],
            "description": (f'SplitsPro $200 cleaning booking payment — {hold["quantity"]} system(s); balance after service'
                            if hold.get("payment_choice") == "booking"
                            else f'SplitsPro complete cleaning — {hold["quantity"]} split system(s)'),
            "amount": {"currency_code": "AUD", "value": f'{hold.get("payment_cents", hold["total_cents"]) / 100:.2f}'},
        }],
        "payment_source": {"paypal": {"experience_context": {
            "return_url": _return_params(hold, "returned"),
            "cancel_url": _return_params(hold, "cancelled"),
            "user_action": "PAY_NOW"
        }}},
    }
    try:
        res = requests.post(
            "https://api-m.paypal.com/v2/checkout/orders",
            headers={"Authorization": "Bearer " + token, "Content-Type": "application/json",
                     "PayPal-Request-Id": "clean-" + hold["reference"]},
            json=body, timeout=25,
        )
        res.raise_for_status()
        order = res.json()
    except (requests.RequestException, ValueError) as exc:
        logging.warning("Cleaning PayPal checkout unavailable: %s", type(exc).__name__)
        raise HTTPException(status_code=502, detail="Unable to open PayPal checkout. No payment was taken.") from exc
    approval = next((link.get("href") for link in order.get("links", [])
                     if link.get("rel") in ("payer-action", "approve")), None)
    if not approval or not order.get("id"):
        raise HTTPException(status_code=502, detail="PayPal did not return a checkout link")
    hold["paypal_order_id"] = order["id"]
    return approval


@router.post("/api/cleaning-checkout")
def create_cleaning_checkout(payload: CleaningCheckoutRequest):
    require_booking_enabled()
    validate_date(payload.booking_date)
    cents = price_cents(payload.quantity)
    payment_cents = amount_to_charge_cents(payload.quantity, payload.payment_choice)
    if parse_time(payload.start_time) + SLOT_MINUTES * payload.quantity > CLOSING_MINUTE:
        raise HTTPException(status_code=422, detail="There is not enough time for that many systems")
    if payload.payment_provider == "stripe" and not (
        (os.environ.get("STRIPE_SECRET_KEY") or "").strip()
        and (os.environ.get("STRIPE_WEBHOOK_SECRET") or "").strip()
    ):
        raise HTTPException(status_code=503, detail="Secure Stripe payment confirmation is not configured yet")
    if payload.payment_provider == "paypal" and not (
        (os.environ.get("PAYPAL_CLIENT_ID") or "").strip()
        and (os.environ.get("PAYPAL_CLIENT_SECRET") or "").strip()
    ):
        raise HTTPException(status_code=503, detail="PayPal payment is not configured yet")
    connection = client()
    reference = uuid.uuid4().hex
    lead = {
        "name": payload.name.strip(), "address": payload.address.strip(),
        "phone": payload.phone.strip(), "email": payload.email.strip(),
        "service": "Complete split system deep cleaning",
        "suburb": payload.address.strip(), "quantity": payload.quantity,
        "booking_date": payload.booking_date, "booking_time": payload.start_time,
        "preferred_date": payload.booking_date,
        "message": (f'{payload.quantity} units; $200 paid to book with ${((cents - payment_cents) / 100):.2f} balance due after cleaning'
                    if payload.payment_choice == "booking"
                    else f'{payload.quantity} units; full amount prepaid; 90 minutes per unit'),
        "page_url": payload.page_url, "referrer": payload.referrer,
    }
    hold = {
        "reference": reference, "booking_date": payload.booking_date,
        "start_time": payload.start_time, "quantity": payload.quantity,
        "duration_minutes": SLOT_MINUTES * payload.quantity,
        "total_cents": cents, "payment_cents": payment_cents,
        "balance_cents": cents - payment_cents,
        "payment_choice": payload.payment_choice, "payment_provider": payload.payment_provider,
        "created_at": datetime.now(TZ).isoformat(), "lead": lead,
    }
    try:
        with connection.lock(day_lock_key(payload.booking_date), timeout=30, blocking_timeout=10):
            if not _slot_is_free(connection, payload.booking_date, payload.start_time, payload.quantity):
                raise HTTPException(status_code=409, detail="That time has just booked out. Choose another opening.")
            connection.set(hold_key(reference), json.dumps(hold), ex=HOLD_SECONDS)
    except HTTPException:
        raise
    except (redis.RedisError, OSError) as exc:
        raise HTTPException(status_code=503, detail="Live booking storage is unavailable") from exc

    try:
        checkout_url = (_create_stripe_checkout(hold) if payload.payment_provider == "stripe"
                        else _create_paypal_checkout(hold))
        connection.set(hold_key(reference), json.dumps(hold), ex=HOLD_SECONDS)
        # Preserve verified payment identity after a temporary slot hold expires.
        # A late successful payment must be recorded and offered rescheduling.
        connection.set(order_key(reference), json.dumps(hold), ex=BOOKING_TTL)
        return {"checkout_url": checkout_url, "checkout_ref": reference, "currency": "AUD",
                "quantity": payload.quantity, "total_amount": cents / 100,
                "payment_choice": payload.payment_choice,
                "amount_due_now": payment_cents / 100,
                "balance_amount": (cents - payment_cents) / 100,
                "paid_upfront": payload.payment_choice == "full"}
    except Exception:
        connection.delete(hold_key(reference))
        raise


def _finalize_paid_cleaning(connection, hold, background_tasks: BackgroundTasks = None):
    ref = hold["reference"]
    if _get_json(connection, paid_key(ref)):
        return _get_json(connection, paid_key(ref))
    d = hold["booking_date"]
    try:
        with connection.lock(day_lock_key(d), timeout=30, blocking_timeout=10):
            previous = _get_json(connection, paid_key(ref))
            if previous:
                return previous
            # Existing hold may have expired. Never silently overbook paid work.
            current_hold = _get_json(connection, hold_key(ref))
            if current_hold:
                connection.delete(hold_key(ref))
            try:
                is_free = _slot_is_free(connection, d, hold["start_time"], int(hold["quantity"]))
            finally:
                if current_hold:
                    connection.set(hold_key(ref), json.dumps(current_hold), ex=HOLD_SECONDS)
            # A paid session may arrive after the brief temporary hold expires.
            # Book it if the time is STILL free; otherwise arrange rescheduling.
            if not is_free:
                status = "needs_reschedule"
            else:
                status = "confirmed"
                connection.set(confirmed_key(ref), json.dumps(hold), ex=BOOKING_TTL)
            connection.delete(hold_key(ref))
            paid_cents = int(hold.get("payment_cents", hold["total_cents"]))
            outstanding_cents = int(hold["total_cents"]) - paid_cents
            choice = hold.get("payment_choice", "full")
            result = {
                "status": status, "checkout_ref": ref, "booking_date": d,
                "start_time": hold["start_time"], "quantity": hold["quantity"],
                "total_amount": hold["total_cents"] / 100,
                "amount_paid": paid_cents / 100,
                "balance_amount": outstanding_cents / 100,
                "payment_choice": choice,
                "paid_upfront": outstanding_cents == 0,
                "message": ("Cleaning booked: $200 paid today; balance due after service"
                            if outstanding_cents and status == "confirmed"
                            else "Cleaning booked and fully paid" if status == "confirmed"
                            else "Payment received, but the time needs rescheduling. SplitsPro will contact you."),
            }
            connection.set(paid_key(ref), json.dumps(result), ex=BOOKING_TTL)
    except (redis.RedisError, OSError) as exc:
        logging.exception("Cleaning payment confirmation failed")
        raise HTTPException(status_code=503, detail="Payment confirmation is being verified") from exc

    lead = dict(hold.get("lead") or {})
    lead.update({"booking_payment_status": status,
                 "payment_status": "paid" if int(hold.get("payment_cents", hold["total_cents"])) >= int(hold["total_cents"]) else "part_paid",
                 "payment_choice": hold.get("payment_choice", "full"),
                 "amount_paid": int(hold.get("payment_cents", hold["total_cents"])) / 100,
                 "balance_amount": (int(hold["total_cents"]) - int(hold.get("payment_cents", hold["total_cents"]))) / 100,
                 "total_amount": hold["total_cents"] / 100})
    try:
        sync_quote_to_hubspot(lead)
    except Exception:
        logging.exception("Paid cleaning booking CRM sync failed")
    if background_tasks:
        background_tasks.add_task(notify_quote, lead)
    return result


def confirm_stripe_cleaning_payment(session: dict, background_tasks: BackgroundTasks = None) -> bool:
    """Accept only Stripe-signed webhook sessions or sessions fetched from Stripe with our secret API key."""
    if (session.get("metadata") or {}).get("checkout_type") != "cleaning":
        return False
    ref = (session.get("metadata") or {}).get("cleaning_ref") or ""
    if not re.fullmatch(r"[0-9a-f]{32}", ref):
        logging.error("Invalid cleaning reference in Stripe webhook")
        return True
    connection = client()
    paid = _get_json(connection, paid_key(ref))
    if paid:
        return True
    hold = _get_json(connection, hold_key(ref)) or _get_json(connection, order_key(ref))
    if not hold:
        logging.error("Paid cleaning Stripe event without a saved order: %s", ref)
        return True
    if (hold.get("payment_provider") != "stripe"
        or session.get("id") != hold.get("stripe_session_id")
        or session.get("client_reference_id") != ref
        or session.get("amount_total") != hold.get("payment_cents", hold["total_cents"])
        or (session.get("currency") or "").lower() != "aud"):
        logging.error("Stripe cleaning amount or identity verification rejected: %s", ref)
        return True
    if session.get("payment_status") == "paid":
        _finalize_paid_cleaning(connection, hold, background_tasks)
    return True


def expire_cleaning_stripe_hold(session: dict):
    if (session.get("metadata") or {}).get("checkout_type") != "cleaning":
        return False
    ref = (session.get("metadata") or {}).get("cleaning_ref") or ""
    if not re.fullmatch(r"[0-9a-f]{32}", ref):
        return True
    connection = client()
    hold = _get_json(connection, hold_key(ref))
    if hold and hold.get("stripe_session_id") == session.get("id"):
        connection.delete(hold_key(ref))
    return True


class CancelCleaningCheckout(BaseModel):
    checkout_ref: str


@router.post("/api/cleaning-checkout-cancel")
def cancel_cleaning_checkout(payload: CancelCleaningCheckout):
    """Release an unpaid time immediately, never an already-paid booking.

    Stripe's hosted checkout must first be expired server-side so a customer
    cannot pay a still-open session after its date has been released.
    """
    ref = payload.checkout_ref
    if not re.fullmatch(r"[0-9a-f]{32}", ref):
        raise HTTPException(status_code=422, detail="Invalid cleaning checkout reference")
    connection = client()
    if _get_json(connection, paid_key(ref)):
        return {"status": "already_paid"}
    hold = _get_json(connection, hold_key(ref))
    if not hold:
        return {"status": "released"}
    if hold.get("payment_provider") == "stripe":
        sid = hold.get("stripe_session_id") or ""
        key = (os.environ.get("STRIPE_SECRET_KEY") or "").strip()
        if not sid or not key:
            raise HTTPException(status_code=503, detail="Could not release Stripe checkout safely. The temporary hold will expire automatically.")
        try:
            response = requests.post(
                "https://api.stripe.com/v1/checkout/sessions/" + sid + "/expire",
                headers={"Authorization": "Bearer " + key,
                         "Idempotency-Key": "cancel-cleaning-" + ref},
                timeout=12,
            )
            if response.status_code == 400:
                # Stripe returns 400 when a session has already completed or
                # expired. Only an EXPIRED session can safely be released.
                check = requests.get(
                    "https://api.stripe.com/v1/checkout/sessions/" + sid,
                    headers={"Authorization": "Bearer " + key}, timeout=12)
                check.raise_for_status()
                session = check.json()
                if session.get("status") != "expired":
                    # Payment may have completed while buyer pressed back;
                    # do not release the time until confirmation is processed.
                    return {"status": "payment_processing"}
            else:
                response.raise_for_status()
                if response.json().get("status") != "expired":
                    return {"status": "payment_processing"}
        except (requests.RequestException, ValueError):
            logging.warning("Unable to expire cancelled cleaning Stripe session: %s", ref)
            raise HTTPException(status_code=503, detail="Could not cancel Stripe checkout yet. The temporary hold will expire automatically.")
    # PayPal buyer has returned through the Cancel URL without authorizing
    # a capture. The order remains safely unconfirmed.
    try:
        with connection.lock(day_lock_key(hold["booking_date"]), timeout=30, blocking_timeout=10):
            if _get_json(connection, paid_key(ref)):
                return {"status": "already_paid"}
            current = _get_json(connection, hold_key(ref))
            if current and current.get("reference") == ref:
                connection.delete(hold_key(ref))
    except (redis.RedisError, OSError):
        raise HTTPException(status_code=503, detail="Unable to release the temporary hold. It will expire automatically.")
    return {"status": "released"}


class CapturePaypalCleaning(BaseModel):
    checkout_ref: str


@router.post("/api/cleaning-paypal-capture")
def capture_cleaning_paypal(payload: CapturePaypalCleaning, background_tasks: BackgroundTasks):
    if not re.fullmatch(r"[0-9a-f]{32}", payload.checkout_ref):
        raise HTTPException(status_code=422, detail="Invalid cleaning payment reference")
    connection = client()
    paid = _get_json(connection, paid_key(payload.checkout_ref))
    if paid:
        return paid
    hold = (_get_json(connection, hold_key(payload.checkout_ref))
            or _get_json(connection, order_key(payload.checkout_ref)))
    if not hold or hold.get("payment_provider") != "paypal" or not hold.get("paypal_order_id"):
        raise HTTPException(status_code=409, detail="PayPal payment could not be matched to a current booking")
    token = paypal_token()
    try:
        res = requests.post(
            "https://api-m.paypal.com/v2/checkout/orders/" + hold["paypal_order_id"] + "/capture",
            headers={"Authorization": "Bearer " + token, "Content-Type": "application/json",
                     "PayPal-Request-Id": "capture-clean-" + payload.checkout_ref},
            timeout=25,
        )
        res.raise_for_status()
        result = res.json()
    except (requests.RequestException, ValueError) as exc:
        logging.warning("Could not verify PayPal cleaning payment: %s", type(exc).__name__)
        raise HTTPException(status_code=502, detail="PayPal confirmation is still processing. Don't pay twice.") from exc

    completed = [
        capture for unit in result.get("purchase_units", [])
        for capture in (unit.get("payments") or {}).get("captures", [])
        if capture.get("status") == "COMPLETED"
        and capture.get("amount", {}).get("currency_code") == "AUD"
        and capture.get("amount", {}).get("value") == f'{hold.get("payment_cents", hold["total_cents"]) / 100:.2f}'
    ]
    if not completed:
        raise HTTPException(status_code=409, detail="PayPal has not confirmed the full amount")
    return _finalize_paid_cleaning(connection, hold, background_tasks)


@router.get("/api/cleaning-payment-status")
def cleaning_payment_status(response: Response, checkout_ref: str = "", session_id: str = ""):
    """Verify a returning Stripe buyer with Stripe itself if the webhook is delayed.

    The browser cannot mark an order paid. A result is finalized only after the
    server fetches an already-created session using its secret Stripe API key,
    verifies the reference/session/amount/currency and sees payment_status=paid.
    """
    response.headers["Cache-Control"] = "no-store"
    if not re.fullmatch(r"[0-9a-f]{32}", checkout_ref):
        raise HTTPException(status_code=422, detail="Invalid payment reference")
    connection = client()
    paid = _get_json(connection, paid_key(checkout_ref))
    if paid:
        return paid
    hold = (_get_json(connection, hold_key(checkout_ref))
            or _get_json(connection, order_key(checkout_ref)))
    secret = (os.environ.get("STRIPE_SECRET_KEY") or "").strip()
    # Only the Stripe-hosted success redirect supplies session_id. Never query
    # an arbitrary session or change a booking based on client-provided status.
    if (secret and hold and hold.get("payment_provider") == "stripe"
        and re.fullmatch(r"cs_(?:live|test)_[A-Za-z0-9]+", session_id or "")
        and session_id == hold.get("stripe_session_id")):
        try:
            result = requests.get(
                "https://api.stripe.com/v1/checkout/sessions/" + session_id,
                headers={"Authorization": "Bearer " + secret},
                timeout=12,
            )
            result.raise_for_status()
            session = result.json()
            if session.get("payment_status") == "paid":
                confirm_stripe_cleaning_payment(session)
                paid = _get_json(connection, paid_key(checkout_ref))
                if paid:
                    return paid
        except (requests.RequestException, ValueError):
            logging.warning("Stripe cleaning payment return check could not complete")
        # Keep this endpoint read-only for unpaid or unverifiable sessions.
    return {"status": "processing", "checkout_ref": checkout_ref}
