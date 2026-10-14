"""Full-payment cleaning bookings with 90-minute intervals and shared installation calendar."""
from datetime import datetime, date, timedelta, timezone
from fastapi import APIRouter, BackgroundTasks, HTTPException, Response
from pydantic import BaseModel, Field, field_validator
from typing import Literal
from urllib.parse import quote
from .lead_integrations import derive_lead_source, sync_quote_to_hubspot, notify_quote
import json
import logging
import os
import re
import uuid
import requests

FIRST_CENTS = 30000
EXTRA_CENTS = 15000
MAX_QUANTITY = 6
STEP = 90
OPEN = 480
CLOSE = 1080
STARTS = tuple(range(OPEN, CLOSE, STEP))
HOLD_SECONDS = 3600
BOOKING_TTL = 60 * 60 * 24 * 120
ORDER_TTL = 60 * 60 * 24 * 90


def price_cents(quantity):
    if type(quantity) is not int or not 1 <= quantity <= MAX_QUANTITY:
        raise ValueError("Select one to six systems")
    return FIRST_CENTS + (quantity - 1) * EXTRA_CENTS


def parse_time(value):
    if not re.fullmatch(r"\d{2}:\d{2}", value or ""):
        raise ValueError("Invalid cleaning appointment time")
    hour, minute = map(int, value.split(":"))
    start = hour * 60 + minute
    if start not in STARTS:
        raise ValueError("Select an available 90-minute start time")
    return start


def clock(minutes):
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def overlaps(a, b):
    return a[0] < b[1] and b[0] < a[1]


def interval_for_installation(window):
    return (480, 750) if window == "Morning" else (750, 1080)


def confirmed_key(day):
    return "splitspro:cleaning-confirmed:" + day


def order_key(ref):
    return "splitspro:cleaning-order:" + ref


def hold_key(ref):
    return "splitspro:cleaning-hold:" + ref


def cleaning_intervals(client, day):
    busy = []
    for value in client.hgetall(confirmed_key(day)).values():
        try:
            data = json.loads(value)
            beginning = parse_time(data["time"])
            busy.append((beginning, beginning + int(data["quantity"]) * STEP))
        except (ValueError, TypeError, KeyError, json.JSONDecodeError):
            logging.warning("Invalid confirmed cleaning reservation")
    for key in client.scan_iter(match="splitspro:cleaning-hold:*", count=100):
        value = client.get(key)
        if not value:
            continue
        try:
            data = json.loads(value)
            if data.get("date") != day:
                continue
            beginning = parse_time(data["time"])
            busy.append((beginning, beginning + int(data["quantity"]) * STEP))
        except (ValueError, TypeError, KeyError, json.JSONDecodeError):
            logging.warning("Invalid pending cleaning hold")
    return busy


def cleaning_conflicts_with_installation(client, day, window):
    interval = interval_for_installation(window)
    return any(overlaps(interval, busy) for busy in cleaning_intervals(client, day))


class CleaningRequest(BaseModel):
    quantity: int = Field(ge=1, le=MAX_QUANTITY)
    booking_date: str
    booking_time: str
    payment_provider: Literal["stripe", "paypal"]
    name: str = Field(min_length=2, max_length=120)
    address: str = Field(min_length=6, max_length=300)
    phone: str = Field(min_length=8, max_length=32)
    email: str = Field(min_length=5, max_length=254)

    @field_validator("booking_date")
    @classmethod
    def check_date(cls, value):
        date.fromisoformat(value)
        return value

    @field_validator("booking_time")
    @classmethod
    def check_time(cls, value):
        parse_time(value)
        return value

    @field_validator("name", "address", "phone", "email")
    @classmethod
    def strip_field(cls, value):
        return value.strip()

    @field_validator("phone")
    @classmethod
    def check_phone(cls, value):
        if len(re.sub(r"\D", "", value)) < 8:
            raise ValueError("Enter a valid phone")
        return value

    @field_validator("email")
    @classmethod
    def check_email(cls, value):
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Enter a valid email")
        return value


class PaypalCaptureRequest(BaseModel):
    checkout_ref: str
    paypal_order_id: str


def install_cleaning_routes(app, booking_redis, legacy_slot_count,
                            manual_blocks, day_lock_key, timezone, workdays, lookahead_days):
    router = APIRouter()

    def store(client, data):
        client.set(order_key(data["ref"]), json.dumps(data), ex=ORDER_TTL)

    def get_order(client, ref):
        if not re.fullmatch(r"[0-9a-f]{32}", ref or ""):
            raise HTTPException(400, "Invalid payment reference")
        value = client.get(order_key(ref))
        if not value:
            raise HTTPException(404, "Payment reference not found")
        return json.loads(value)

    def is_free(client, day, beginning, qty):
        try:
            target_date = date.fromisoformat(day)
        except (ValueError, TypeError):
            return False
        today = datetime.now(timezone).date()
        if not today < target_date <= today + timedelta(days=lookahead_days):
            return False
        if target_date.weekday() not in workdays or beginning + qty * STEP > CLOSE:
            return False
        interval = (beginning, beginning + qty * STEP)
        manual = manual_blocks()
        for window in ("Morning", "Afternoon"):
            if not overlaps(interval, interval_for_installation(window)):
                continue
            if (day, window) in manual or legacy_slot_count(client, day, window) >= 1:
                return False
        return not any(overlaps(interval, reserved) for reserved in cleaning_intervals(client, day))

    @router.get("/api/cleaning-slots")
    def slots(response: Response, quantity: int = 1, limit: int = 60):
        response.headers["Cache-Control"] = "no-store, max-age=0"
        if not 1 <= quantity <= MAX_QUANTITY:
            raise HTTPException(400, "Select 1 to 6 systems")
        try:
            c = booking_redis()
            c.ping()
            today = datetime.now(timezone).date()
            matches = []
            for offset in range(1, lookahead_days + 1):
                day = (today + timedelta(days=offset)).isoformat()
                for beginning in STARTS:
                    if is_free(c, day, beginning, quantity):
                        matches.append({"date": day, "time": clock(beginning),
                                        "duration_minutes": quantity * STEP})
                        if len(matches) >= min(max(limit, 1), 120):
                            return {"slots": matches, "timezone": str(timezone),
                                    "total_cents": price_cents(quantity)}
            return {"slots": matches, "timezone": str(timezone),
                    "total_cents": price_cents(quantity)}
        except HTTPException:
            raise
        except Exception as exc:
            logging.exception("Cleaning availability unavailable")
            raise HTTPException(503, "Live booking calendar is temporarily unavailable") from exc

    @router.get("/api/cleaning-checkout-settings")
    def settings(response: Response):
        response.headers["Cache-Control"] = "no-store"
        return {"first_cents": FIRST_CENTS, "extra_cents": EXTRA_CENTS,
                "max_quantity": MAX_QUANTITY, "minutes_per_system": STEP,
                "stripe_ready": bool((os.environ.get("STRIPE_SECRET_KEY") or "").strip()),
                "paypal_ready": bool((os.environ.get("PAYPAL_CLIENT_ID") or "").strip()
                                     and (os.environ.get("PAYPAL_CLIENT_SECRET") or "").strip())}

    def paypal_token():
        user = (os.environ.get("PAYPAL_CLIENT_ID") or "").strip()
        secret = (os.environ.get("PAYPAL_CLIENT_SECRET") or "").strip()
        if not user or not secret:
            raise HTTPException(503, "PayPal is not connected for full-payment bookings")
        try:
            response = requests.post("https://api-m.paypal.com/v1/oauth2/token",
                         auth=(user, secret), data={"grant_type": "client_credentials"},
                         timeout=20)
            response.raise_for_status()
            token = response.json().get("access_token")
        except requests.RequestException as exc:
            raise HTTPException(502, "PayPal is temporarily unavailable") from exc
        if not token:
            raise HTTPException(502, "PayPal authentication failed")
        return token

    def return_link(order):
        suffix = ("?quantity=" + str(order["quantity"]) + "&date=" + order["date"]
                  + "&time=" + quote(order["time"], safe="")
                  + "&checkout_ref=" + order["ref"])
        return "https://splitspro.com.au/secure-cleaning" + suffix

    def open_stripe(order):
        secret = (os.environ.get("STRIPE_SECRET_KEY") or "").strip()
        if not secret:
            raise HTTPException(503, "Stripe checkout is not configured for cleaning")
        back = return_link(order)
        body = {
            "mode": "payment",
            "client_reference_id": order["ref"],
            "customer_email": order["customer"]["email"],
            "success_url": back + "&cleaning_payment=returned&provider=stripe&session_id={CHECKOUT_SESSION_ID}",
            "cancel_url": back + "&cleaning_payment=cancelled",
            "metadata[checkout_type]": "cleaning_full",
            "metadata[order_id]": order["ref"],
            "line_items[0][price_data][currency]": "aud",
            "line_items[0][price_data][unit_amount]": str(FIRST_CENTS),
            "line_items[0][price_data][product_data][name]": "SplitsPro complete split-system deep clean",
            "line_items[0][quantity]": "1",
        }
        if order["quantity"] > 1:
            body.update({
                "line_items[1][price_data][currency]": "aud",
                "line_items[1][price_data][unit_amount]": str(EXTRA_CENTS),
                "line_items[1][price_data][product_data][name]": "Additional deep clean at same property",
                "line_items[1][quantity]": str(order["quantity"] - 1),
            })
        try:
            response = requests.post("https://api.stripe.com/v1/checkout/sessions",
                        headers={"Authorization": "Bearer " + secret},
                        data=body, timeout=25)
            response.raise_for_status()
            session = response.json()
        except requests.RequestException as exc:
            raise HTTPException(502, "Stripe checkout could not open. No payment was taken.") from exc
        if not session.get("id") or not session.get("url"):
            raise HTTPException(502, "Stripe returned an invalid checkout")
        order["stripe_session_id"] = session["id"]
        return session["url"]

    def open_paypal(order):
        token = paypal_token()
        back = return_link(order)
        body = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "reference_id": order["ref"], "custom_id": order["ref"],
                "description": f'{order["quantity"]} SplitsPro complete aircon clean(s)',
                "amount": {"currency_code": "AUD", "value": f'{order["total_cents"] / 100:.2f}'}
            }],
            "payment_source": {"paypal": {"experience_context": {
                "return_url": back + "&cleaning_payment=returned&provider=paypal",
                "cancel_url": back + "&cleaning_payment=cancelled", "user_action": "PAY_NOW"
            }}}
        }
        try:
            response = requests.post("https://api-m.paypal.com/v2/checkout/orders",
                        headers={"Authorization": "Bearer " + token,
                                 "Content-Type": "application/json",
                                 "PayPal-Request-Id": "spc-" + order["ref"]},
                        json=body, timeout=25)
            response.raise_for_status()
            result = response.json()
        except requests.RequestException as exc:
            raise HTTPException(502, "PayPal checkout could not open. No payment was taken.") from exc
        link = next((l.get("href") for l in result.get("links", [])
                     if l.get("rel") in ("payer-action", "approve")), None)
        if not link or not result.get("id"):
            raise HTTPException(502, "PayPal returned an invalid checkout")
        order["paypal_order_id"] = result["id"]
        return link

    @router.post("/api/cleaning-checkout")
    def checkout(payload: CleaningRequest):
        amount = price_cents(payload.quantity)
        start = parse_time(payload.booking_time)
        c = booking_redis()
        ref = uuid.uuid4().hex
        order = {"ref": ref, "date": payload.booking_date, "time": payload.booking_time,
                 "quantity": payload.quantity, "total_cents": amount,
                 "provider": payload.payment_provider, "status": "creating",
                 "customer": {k: getattr(payload, k) for k in ("name", "address", "phone", "email")}}
        hold = {"date": payload.booking_date, "time": payload.booking_time, "quantity": payload.quantity}
        try:
            with c.lock(day_lock_key(payload.booking_date), timeout=35, blocking_timeout=12):
                if not is_free(c, payload.booking_date, start, payload.quantity):
                    raise HTTPException(409, "That time is already booked. Select another opening.")
                c.set(hold_key(ref), json.dumps(hold), ex=HOLD_SECONDS)
                store(c, order)
        except HTTPException:
            raise
        except Exception as exc:
            logging.exception("Could not hold cleaning booking")
            raise HTTPException(503, "Couldn't reserve that time. No payment started.") from exc
        try:
            url = open_stripe(order) if payload.payment_provider == "stripe" else open_paypal(order)
            order["status"] = "pending_payment"
            store(c, order)
        except Exception:
            c.delete(hold_key(ref))
            raise
        return {"checkout_url": url, "checkout_ref": ref,
                "total_cents": amount, "currency": "AUD",
                "quantity": payload.quantity, "hold_expires_in": HOLD_SECONDS}

    def finish_paid(c, order, payment_id, background_tasks):
        if order["status"] in ("confirmed", "needs_reschedule"):
            return order
        ref = order["ref"]
        if not c.exists(hold_key(ref)):
            order["status"] = "needs_reschedule"
        else:
            c.delete(hold_key(ref))
            if is_free(c, order["date"], parse_time(order["time"]), order["quantity"]):
                c.hset(confirmed_key(order["date"]), ref, json.dumps({
                    "time": order["time"], "quantity": order["quantity"], "ref": ref}))
                c.expire(confirmed_key(order["date"]), BOOKING_TTL)
                order["status"] = "confirmed"
            else:
                order["status"] = "needs_reschedule"
        order["paid_at"] = datetime.now(timezone.utc).isoformat()
        order["payment_reference"] = payment_id
        store(c, order)
        lead = dict(order["customer"])
        lead.update({"service": "Split System Cleaning",
                     "suburb": order["customer"]["address"],
                     "booking_date": order["date"], "booking_time": order["time"],
                     "quantity": order["quantity"], "preferred_date": order["date"],
                     "total_amount": order["total_cents"] / 100,
                     "message": ("FULL payment received for " + str(order["quantity"]) +
                                 " systems. Status: " + order["status"]),
                     "created_at": datetime.now(timezone.utc).isoformat(), "id": ref})
        lead["lead_source"] = derive_lead_source(lead)
        try:
            saved = sync_quote_to_hubspot(lead)
            if saved:
                lead["hubspot_contact_id"] = saved.get("contact_id", "")
            background_tasks.add_task(notify_quote, lead)
        except Exception:
            logging.exception("Cleaning booking CRM notification failed")
        return order

    def confirm_stripe(session, background_tasks):
        if (session.get("metadata") or {}).get("checkout_type") != "cleaning_full":
            return False
        if session.get("payment_status") != "paid":
            return True
        ref = (session.get("metadata") or {}).get("order_id") or ""
        c = booking_redis()
        order = get_order(c, ref)
        if (order["provider"] != "stripe" or order.get("stripe_session_id") != session.get("id")
            or int(session.get("amount_total") or 0) != order["total_cents"]
            or (session.get("currency") or "").lower() != "aud"):
            logging.error("Cleaning webhook payment amount or session mismatched")
            return True
        with c.lock(day_lock_key(order["date"]), timeout=35, blocking_timeout=12):
            order = get_order(c, ref)
            finish_paid(c, order, session["id"], background_tasks)
        return True

    @router.post("/api/cleaning-paypal-capture")
    def capture_paypal(payload: PaypalCaptureRequest, background_tasks: BackgroundTasks):
        c = booking_redis()
        order = get_order(c, payload.checkout_ref)
        if (order["provider"] != "paypal"
            or order.get("paypal_order_id") != payload.paypal_order_id):
            raise HTTPException(400, "PayPal order doesn't match this checkout")
        if order["status"] in ("confirmed", "needs_reschedule"):
            return {"status": order["status"], "checkout_ref": order["ref"]}
        if not c.exists(hold_key(order["ref"])):
            raise HTTPException(409, "Booking hold expired. No PayPal payment was captured.")
        token = paypal_token()
        try:
            response = requests.post("https://api-m.paypal.com/v2/checkout/orders/"
                + quote(payload.paypal_order_id, safe="") + "/capture",
                headers={"Authorization": "Bearer " + token,
                         "Content-Type": "application/json",
                         "PayPal-Request-Id": "spc-capture-" + order["ref"]},
                timeout=25)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as exc:
            raise HTTPException(502, "PayPal could not confirm your payment. Don't pay twice.") from exc
        valid = any(
            item.get("status") == "COMPLETED"
            and item.get("amount", {}).get("currency_code") == "AUD"
            and item.get("amount", {}).get("value") == f'{order["total_cents"]/100:.2f}'
            for unit in data.get("purchase_units", [])
            for item in (unit.get("payments") or {}).get("captures", [])
        )
        if not valid:
            raise HTTPException(409, "PayPal hasn't confirmed full payment")
        with c.lock(day_lock_key(order["date"]), timeout=35, blocking_timeout=12):
            order = get_order(c, order["ref"])
            finish_paid(c, order, payload.paypal_order_id, background_tasks)
        return {"status": order["status"], "checkout_ref": order["ref"]}

    @router.get("/api/cleaning-payment-status")
    def payment_status(checkout_ref: str, response: Response):
        response.headers["Cache-Control"] = "no-store"
        order = get_order(booking_redis(), checkout_ref)
        return {"status": order["status"] if order["status"] in ("confirmed", "needs_reschedule")
                else "processing", "booking_date": order["date"], "booking_time": order["time"],
                "quantity": order["quantity"], "total_cents": order["total_cents"],
                "currency": "AUD"}

    app.include_router(router)
    return confirm_stripe
