"""SplitsPro equipment retail checkout.

No live payment can start unless EQUIPMENT_CHECKOUT_ENABLED is explicitly set.
The customer never submits a monetary amount. The server uses an approved
per-model equipment retail price and creates an order in the EXISTING
SplitsPro merchant account. Installation is separate, not charged here.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from typing import Literal
from decimal import Decimal
from urllib.parse import quote
import json
import logging
import os
import uuid
import requests
import redis

router = APIRouter()

INSTALLED_CENTS = {
    "rinnai-local:2.5kW": 160000,
    "rinnai-local:3.5kW": 170000,
    "rinnai-local:5.0kW": 230000,
    "rinnai-local:7.0kW": 260000,
    "daikin-lite-local:2.5kW": 185000,
    "daikin-lite-local:3.5kW": 210000,
    "daikin-lite-local:5.0kW": 250000,
    "daikin-lite-local:7.0kW": 300000,
}
LABELS = {
    "rinnai-local:2.5kW": "Rinnai 2.5kW",
    "rinnai-local:3.5kW": "Rinnai 3.5kW",
    "rinnai-local:5.0kW": "Rinnai 5kW",
    "rinnai-local:7.0kW": "Rinnai 7kW",
    "daikin-lite-local:2.5kW": "Daikin Cora 2.5kW",
    "daikin-lite-local:3.5kW": "Daikin Cora 3.5kW",
    "daikin-lite-local:5.0kW": "Daikin Cora 5kW",
    "daikin-lite-local:7.0kW": "Daikin Cora 7.0kW",
}
# A retail price has only been agreed for one model. The remaining
# prices must be supplied and configured by the business owner.
CONFIRMED_RETAIL_CENTS = {"rinnai-local:2.5kW": 120000}
PAYMENT_METHOD = {"stripe": None, "afterpay": "afterpay_clearpay", "klarna": "klarna",
                  "zip": "zip", "card": "card"}

def enabled(name: str) -> bool:
    return (os.environ.get(name) or "").strip().lower() in ("1", "true", "yes")

def retail_catalog() -> dict:
    catalog = dict(CONFIRMED_RETAIL_CENTS)
    raw = (os.environ.get("EQUIPMENT_RETAIL_PRICES_JSON") or "").strip()
    if raw:
        try:
            extra = json.loads(raw)
            if not isinstance(extra, dict):
                raise ValueError("expected object")
            for model, dollars in extra.items():
                if model not in INSTALLED_CENTS:
                    raise ValueError("unknown model")
                amount = Decimal(str(dollars))
                if not amount.is_finite() or amount <= 0 or amount >= Decimal(INSTALLED_CENTS[model]) / 100:
                    raise ValueError("invalid retail price for model")
                cents = amount * 100
                if cents != cents.to_integral_value():
                    raise ValueError("price may have up to two decimal places")
                catalog[model] = int(cents)
        except Exception as exc:
            logging.error("Invalid EQUIPMENT_RETAIL_PRICES_JSON: %s", type(exc).__name__)
            raise HTTPException(status_code=503, detail="Equipment prices are temporarily unavailable") from exc
    return catalog

def client():
    url = (os.environ.get("REDIS_URL") or "").strip()
    if not url:
        raise HTTPException(status_code=503, detail="Checkout storage is not configured")
    return redis.Redis.from_url(url, decode_responses=True)

def order_key(order_id):
    return "splitspro:equipment-order:" + order_id

def read_order(order_id):
    if not isinstance(order_id, str) or not __import__("re").fullmatch(r"[0-9a-f]{32}", order_id):
        raise HTTPException(status_code=400, detail="Invalid order reference")
    raw = client().get(order_key(order_id))
    if not raw:
        raise HTTPException(status_code=404, detail="Order not found")
    return json.loads(raw)

def save_order(order):
    client().set(order_key(order["id"]), json.dumps(order), ex=60 * 60 * 24 * 90)

def catalog_rows():
    retail = retail_catalog()
    return [
        {"id": key, "name": LABELS[key], "installed_cents": installed,
         "equipment_cents": retail.get(key),
         "installation_cents": installed - retail[key] if key in retail else None}
        for key, installed in INSTALLED_CENTS.items()
    ]

@router.get("/api/equipment-catalog")
def get_catalog():
    return {
        "currency": "AUD",
        "products": catalog_rows(),
        "checkout_enabled": enabled("EQUIPMENT_CHECKOUT_ENABLED"),
        "installed_checkout_enabled": enabled("EQUIPMENT_WITH_INSTALL_CHECKOUT_ENABLED"),
        "stripe_ready": bool((os.environ.get("STRIPE_SECRET_KEY") or "").strip()),
        "paypal_ready": bool((os.environ.get("PAYPAL_CLIENT_ID") or "").strip()
                             and (os.environ.get("PAYPAL_CLIENT_SECRET") or "").strip()),
    }

class PurchaseRequest(BaseModel):
    model_id: str
    provider: Literal["stripe", "card", "afterpay", "klarna", "zip", "paypal"]
    include_installation: bool = True

    @field_validator("model_id")
    @classmethod
    def known_model(cls, v):
        if v not in INSTALLED_CENTS:
            raise ValueError("Unknown SplitsPro equipment model")
        return v

def stripe_checkout(order):
    secret = (os.environ.get("STRIPE_SECRET_KEY") or "").strip()
    if not secret:
        raise HTTPException(status_code=503, detail="Stripe checkout is not connected on the SplitsPro backend yet")
    website = "https://splitspro.com.au/payment-options"
    body = {
        "mode": "payment",
        "success_url": website + "?equipment_payment=returned&order_id=" + order["id"] + "&session_id={CHECKOUT_SESSION_ID}",
        "cancel_url": website + "?equipment_payment=cancelled&order_id=" + order["id"],
        "client_reference_id": order["id"],
        "metadata[checkout_type]": "equipment_retail",
        "metadata[order_id]": order["id"],
        "line_items[0][price_data][currency]": "aud",
        "line_items[0][price_data][unit_amount]": str(order["equipment_cents"]),
        "line_items[0][price_data][product_data][name]": LABELS[order["model_id"]] + " – supply only",
        "line_items[0][quantity]": "1",
        "billing_address_collection": "required",
    }
    # Let the existing Stripe dashboard determine eligible checkout methods (card, BNPL, etc.).
    # Legacy provider-specific API requests remain supported.
    payment_method = PAYMENT_METHOD[order["provider"]]
    if payment_method:
        body["payment_method_types[0]"] = payment_method
    try:
        res = requests.post("https://api.stripe.com/v1/checkout/sessions",
                            headers={"Authorization": "Bearer " + secret},
                            data=body, timeout=20)
        res.raise_for_status()
        checkout = res.json()
    except requests.RequestException as exc:
        logging.warning("Stripe equipment checkout failed (%s)", type(exc).__name__)
        raise HTTPException(status_code=502, detail="Selected Stripe payment option is not currently available") from exc
    if not checkout.get("url") or not checkout.get("id"):
        raise HTTPException(status_code=502, detail="Stripe did not return a secure checkout")
    order["stripe_session_id"] = checkout["id"]
    order["status"] = "pending_payment"
    save_order(order)
    return checkout["url"]

def paypal_token():
    user = (os.environ.get("PAYPAL_CLIENT_ID") or "").strip()
    password = (os.environ.get("PAYPAL_CLIENT_SECRET") or "").strip()
    if not user or not password:
        raise HTTPException(status_code=503, detail="PayPal checkout is not connected on the SplitsPro backend yet")
    try:
        r = requests.post("https://api-m.paypal.com/v1/oauth2/token",
                          auth=(user, password), data={"grant_type": "client_credentials"},
                          timeout=20)
        r.raise_for_status()
        token = r.json().get("access_token")
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail="PayPal payment service is temporarily unavailable") from exc
    if not token:
        raise HTTPException(status_code=502, detail="PayPal authentication failed")
    return token

def paypal_checkout(order):
    token = paypal_token()
    website = "https://splitspro.com.au/payment-options"
    body = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "reference_id": order["id"],
            "custom_id": order["id"],
            "description": LABELS[order["model_id"]] + " – equipment retail purchase only",
            "amount": {"currency_code": "AUD", "value": f'{order["equipment_cents"] / 100:.2f}'}
        }],
        "payment_source": {"paypal": {"experience_context": {
            "return_url": website + "?equipment_payment=returned&provider=paypal&order_id=" + order["id"],
            "cancel_url": website + "?equipment_payment=cancelled&order_id=" + order["id"],
            "user_action": "PAY_NOW"
        }}}
    }
    try:
        r = requests.post("https://api-m.paypal.com/v2/checkout/orders",
                          headers={"Authorization": "Bearer " + token,
                                   "Content-Type": "application/json",
                                   "PayPal-Request-Id": order["id"]},
                          json=body, timeout=20)
        r.raise_for_status()
        result = r.json()
    except requests.RequestException as exc:
        logging.warning("PayPal equipment checkout failed: %s", type(exc).__name__)
        raise HTTPException(status_code=502, detail="PayPal could not open this checkout") from exc
    link = next((x.get("href") for x in result.get("links", [])
                 if x.get("rel") in ("payer-action", "approve")), None)
    if not link or not result.get("id"):
        raise HTTPException(status_code=502, detail="PayPal did not return a checkout link")
    order["paypal_order_id"] = result["id"]
    order["status"] = "pending_payment"
    save_order(order)
    return link

@router.post("/api/equipment-checkout")
def create_equipment_checkout(payload: PurchaseRequest):
    if not enabled("EQUIPMENT_CHECKOUT_ENABLED"):
        raise HTTPException(status_code=503, detail="Equipment finance checkout is not available yet. Please ask SplitsPro to confirm the separate sale.")
    if payload.include_installation and not enabled("EQUIPMENT_WITH_INSTALL_CHECKOUT_ENABLED"):
        raise HTTPException(status_code=503, detail="Checkout with optional SplitsPro installation is awaiting confirmation of the separate contract and payment rules.")
    retail = retail_catalog()
    if payload.model_id not in retail:
        raise HTTPException(status_code=409, detail="The standalone retail price for this model must be confirmed before checkout.")
    order = {
        "id": uuid.uuid4().hex,
        "model_id": payload.model_id,
        "provider": payload.provider,
        "equipment_cents": retail[payload.model_id],
        "installation_cents": INSTALLED_CENTS[payload.model_id] - retail[payload.model_id] if payload.include_installation else 0,
        "include_installation": payload.include_installation,
        "currency": "AUD",
        "status": "creating",
        "installation_booking_confirmed": False,
    }
    save_order(order)
    if payload.provider == "paypal":
        checkout_url = paypal_checkout(order)
    else:
        checkout_url = stripe_checkout(order)
    return {
        "order_id": order["id"], "checkout_url": checkout_url,
        "provider": payload.provider, "currency": "AUD",
        "equipment_cents": order["equipment_cents"],
        "installation_cents": order["installation_cents"],
        "charged_cents": order["equipment_cents"],
        "installation_booking_confirmed": False,
    }

def confirm_stripe_equipment_payment(session: dict) -> bool:
    """Called by the EXISTING Stripe webhook after verified signature."""
    if (session.get("metadata") or {}).get("checkout_type") != "equipment_retail":
        return False
    oid = (session.get("metadata") or {}).get("order_id") or ""
    try:
        order = read_order(oid)
    except HTTPException:
        logging.error("Stripe equipment payment without known order: %s", oid)
        return True
    if (session.get("id") != order.get("stripe_session_id")
        or session.get("amount_total") != order["equipment_cents"]
        or (session.get("currency") or "").lower() != "aud"
        or order["provider"] not in PAYMENT_METHOD):
        logging.error("Stripe equipment payment verification rejected for order %s", oid)
        return True
    if session.get("payment_status") == "paid":
        order["status"] = "paid"
        order["stripe_session_id"] = session["id"]
        save_order(order)
    return True

class CapturePaypalRequest(BaseModel):
    order_id: str
    paypal_order_id: str

@router.post("/api/equipment-paypal-capture")
def capture_paypal_equipment(payload: CapturePaypalRequest):
    order = read_order(payload.order_id)
    if order["provider"] != "paypal" or payload.paypal_order_id != order.get("paypal_order_id"):
        raise HTTPException(status_code=400, detail="PayPal order does not match the equipment purchase")
    if order["status"] == "paid":
        return {"status": "paid", "order_id": order["id"], "installation_booking_confirmed": False}
    token = paypal_token()
    try:
        r = requests.post(
            "https://api-m.paypal.com/v2/checkout/orders/" + quote(payload.paypal_order_id, safe="") + "/capture",
            headers={"Authorization": "Bearer " + token, "Content-Type": "application/json",
                     "PayPal-Request-Id": "eq-" + order["id"]},
            timeout=20,
        )
        r.raise_for_status()
        result = r.json()
    except requests.RequestException as exc:
        logging.warning("Equipment PayPal capture failed: %s", type(exc).__name__)
        raise HTTPException(status_code=502, detail="PayPal could not confirm payment. Please contact SplitsPro.") from exc
    matched = [
        capture for unit in result.get("purchase_units", [])
        for capture in (unit.get("payments") or {}).get("captures", [])
        if capture.get("status") == "COMPLETED"
        and capture.get("amount", {}).get("currency_code") == "AUD"
        and capture.get("amount", {}).get("value") == f'{order["equipment_cents"] / 100:.2f}'
    ]
    if not matched:
        raise HTTPException(status_code=409, detail="PayPal has not confirmed full payment")
    order["status"] = "paid"
    save_order(order)
    return {"status": "paid", "order_id": order["id"], "installation_booking_confirmed": False}

@router.get("/api/equipment-payment-status")
def equipment_payment_status(order_id: str):
    order = read_order(order_id)
    return {
        "status": order["status"],
        "model": LABELS[order["model_id"]],
        "charged_amount": order["equipment_cents"] / 100,
        "currency": "AUD",
        "installation_booking_confirmed": False,
        "message": "Equipment payment is separate from installation; SplitsPro will contact you about collection/delivery."
    }
