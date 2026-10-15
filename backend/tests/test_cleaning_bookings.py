import json
from contextlib import nullcontext
from datetime import timedelta, datetime

import fakeredis
import pytest

from fastapi import Response

from backend import cleaning_bookings as cb


@pytest.fixture
def calendar(monkeypatch, tmp_path):
    store = fakeredis.FakeRedis(decode_responses=True)
    monkeypatch.setattr(cb, "client", lambda: store)
    # fakeredis without optional Lua does not implement Redis lock release scripts.
    # Production uses real Redis locks; these tests exercise availability rules.
    monkeypatch.setattr(store, "lock", lambda *args, **kwargs: nullcontext())
    blocks = tmp_path / "booking_blocks.json"
    blocks.write_text('{"blocked": []}')
    monkeypatch.setattr(cb, "BOOKING_BLOCKS_FILE", blocks)
    monkeypatch.setattr(cb, "sync_quote_to_hubspot", lambda lead: None)
    return store, blocks


def future_date():
    return (datetime.now(cb.TZ).date() + timedelta(days=1)).isoformat()


def test_server_calculates_full_upfront_price():
    assert cb.price_cents(1) == 30000
    assert cb.price_cents(2) == 45000
    assert cb.price_cents(3) == 60000
    assert cb.price_cents(7) == 120000
    for q in (0, 8, -1, 1.0, "2"):
        with pytest.raises(ValueError):
            cb.price_cents(q)


def test_ninety_minute_time_starts_and_contiguous_duration(calendar):
    store, _ = calendar
    d = future_date()
    assert cb.parse_time("08:00") == 480
    assert cb.parse_time("09:30") == 570
    with pytest.raises(ValueError):
        cb.parse_time("10:00")
    assert cb._slot_is_free(store, d, "08:00", 7)
    assert not cb._slot_is_free(store, d, "09:30", 7)


def test_installation_blocks_cleaning_same_half_day(calendar):
    store, _ = calendar
    d = future_date()
    store.set(f"splitspro:booking:{d}:morning", 1)
    assert not cb._slot_is_free(store, d, "08:00", 1)
    assert not cb._slot_is_free(store, d, "11:00", 2)
    assert cb._slot_is_free(store, d, "12:30", 1)


def test_pending_installation_checkout_blocks_cleaning(calendar):
    store, _ = calendar
    d = future_date()
    store.set("splitspro:booking-hold:testhold", json.dumps({
        "booking_date": d, "booking_window": "Afternoon"
    }), ex=2000)
    assert cb._slot_is_free(store, d, "08:00", 1)
    assert not cb._slot_is_free(store, d, "12:30", 1)


def test_cleaning_blocks_new_installation(calendar):
    store, _ = calendar
    d = future_date()
    store.set("splitspro:cleaning-hold:test", json.dumps({
        "booking_date": d, "start_time": "11:00", "quantity": 2
    }), ex=2000)
    assert cb.cleaning_blocks_installation(store, d, "Morning")
    assert cb.cleaning_blocks_installation(store, d, "Afternoon")
    assert cb._slot_is_free(store, d, "08:00", 1)
    assert not cb._slot_is_free(store, d, "12:30", 1)
    assert cb._slot_is_free(store, d, "14:00", 1)


def test_existing_cleaning_confirmations_also_block(calendar):
    store, _ = calendar
    d = future_date()
    store.set("splitspro:cleaning-confirmed:booked", json.dumps({
        "booking_date": d, "start_time": "09:30", "quantity": 2
    }), ex=2000)
    assert not cb._slot_is_free(store, d, "11:00", 1)
    assert cb._slot_is_free(store, d, "12:30", 1)


def test_manual_block_closes_both_windows(calendar):
    store, path = calendar
    d = future_date()
    path.write_text(json.dumps({"blocked": [{"date": d, "window": "All"}]}))
    assert not cb._slot_is_free(store, d, "08:00", 1)
    assert not cb._slot_is_free(store, d, "12:30", 1)


def test_payment_confirmation_stores_booking_and_is_idempotent(calendar):
    store, _ = calendar
    d = future_date()
    reference = "a" * 32
    record = {
        "reference": reference, "booking_date": d,
        "start_time": "09:30", "quantity": 2, "total_cents": 45000,
        "lead": {"name": "Test Client", "email": "example@example.com"},
    }
    store.set(cb.hold_key(reference), json.dumps(record), ex=1000)
    first = cb._finalize_paid_cleaning(store, record)
    second = cb._finalize_paid_cleaning(store, record)
    assert first == second
    assert first["status"] == "confirmed"
    assert first["total_amount"] == 450
    assert store.exists(cb.confirmed_key(reference))
    assert not store.exists(cb.hold_key(reference))
    assert not cb._slot_is_free(store, d, "09:30", 1)


def test_expired_payment_hold_confirms_only_if_still_free(calendar):
    store, _ = calendar
    d = future_date()
    reference = "b" * 32
    record = {
        "reference": reference, "booking_date": d, "start_time": "08:00",
        "quantity": 1, "total_cents": 30000, "lead": {},
    }
    result = cb._finalize_paid_cleaning(store, record)
    assert result["status"] == "confirmed"
    assert store.exists(cb.confirmed_key(reference))
    assert store.exists(cb.paid_key(reference))

    other = {**record, "reference": "c" * 32}
    result2 = cb._finalize_paid_cleaning(store, other)
    assert result2["status"] == "needs_reschedule"
    assert not store.exists(cb.confirmed_key(other["reference"]))


@pytest.mark.parametrize("quantity,total,book_due,balance", [
    (1, 30000, 20000, 10000),
    (2, 45000, 20000, 25000),
    (3, 60000, 20000, 40000),
    (7, 120000, 20000, 100000),
])
def test_payment_options_never_change_total_price(quantity, total, book_due, balance):
    assert cb.price_cents(quantity) == total
    assert cb.amount_to_charge_cents(quantity, "booking") == book_due
    assert cb.amount_to_charge_cents(quantity, "full") == total
    assert total - cb.amount_to_charge_cents(quantity, "booking") == balance


def test_old_checkout_clients_still_default_to_full_payment():
    payload = cb.CleaningCheckoutRequest(
        quantity=1, booking_date="2099-10-15", start_time="08:00",
        payment_provider="paypal", name="Test Customer",
        address="23 Market Street, Sydney NSW 2000", phone="0414698435",
        email="person@example.com"
    )
    assert payload.payment_choice == "full"
    assert cb.CleaningCheckoutRequest(
        **{**payload.model_dump(), "payment_choice": "booking"}
    ).payment_choice == "booking"


@pytest.mark.parametrize("choice,charged,balance", [
    ("booking", 200, 250),
    ("full", 450, 0),
])
def test_checkout_creates_precisely_priced_hold_and_preserves_shared_calendar(
    calendar, monkeypatch, choice, charged, balance
):
    store, _ = calendar
    monkeypatch.setattr(cb, "booking_enabled", lambda: True)
    monkeypatch.setenv("PAYPAL_CLIENT_ID", "fake-for-unittest")
    monkeypatch.setenv("PAYPAL_CLIENT_SECRET", "fake-for-unittest")
    def fake_paypal(hold):
        hold["paypal_order_id"] = "PAYPAL-CHECKOUT-ID"
        return "https://www.paypal.com/checkoutnow?token=test"
    monkeypatch.setattr(cb, "_create_paypal_checkout", fake_paypal)
    day = future_date()
    payload = cb.CleaningCheckoutRequest(
        quantity=2, booking_date=day, start_time="08:00",
        payment_provider="paypal", payment_choice=choice,
        name="Test Customer", address="23 Market Street, Sydney NSW 2000",
        phone="0414698435", email="person@example.com"
    )
    response = cb.create_cleaning_checkout(payload)
    assert response["total_amount"] == 450
    assert response["amount_due_now"] == charged
    assert response["balance_amount"] == balance
    assert response["payment_choice"] == choice
    assert response["paid_upfront"] is (choice == "full")
    hold = cb._get_json(store, cb.hold_key(response["checkout_ref"]))
    assert hold["payment_cents"] == charged * 100
    assert hold["balance_cents"] == balance * 100
    assert hold["total_cents"] == 45000
    assert not cb._slot_is_free(store, day, "08:00", 1)
    assert cb.cleaning_blocks_installation(store, day, "Morning")


def test_booking_deposit_webhook_verifies_charged_amount_and_records_balance(calendar):
    store, _ = calendar
    day = future_date()
    reference = "c" * 32
    hold = {
        "reference": reference, "booking_date": day, "start_time": "09:30",
        "quantity": 2, "total_cents": 45000,
        "payment_cents": 20000, "balance_cents": 25000,
        "payment_choice": "booking", "payment_provider": "stripe",
        "stripe_session_id": "cs_test_verified",
        "lead": {"name": "Customer", "email": "example@example.com"},
    }
    store.set(cb.hold_key(reference), json.dumps(hold), ex=1000)
    session = {
        "metadata": {"checkout_type": "cleaning", "cleaning_ref": reference},
        "id": "cs_test_verified", "client_reference_id": reference,
        "amount_total": 45000, "currency": "aud", "payment_status": "paid",
    }
    # The full job total must NOT be accepted as proof of the $200 transaction.
    assert cb.confirm_stripe_cleaning_payment(session)
    assert not store.exists(cb.paid_key(reference))
    session["amount_total"] = 20000
    assert cb.confirm_stripe_cleaning_payment(session)
    paid = cb._get_json(store, cb.paid_key(reference))
    assert paid["status"] == "confirmed"
    assert paid["amount_paid"] == 200
    assert paid["balance_amount"] == 250
    assert paid["paid_upfront"] is False
    assert paid["payment_choice"] == "booking"
    assert store.exists(cb.confirmed_key(reference))
    # Redelivered paid webhooks do not create duplicate bookings.
    assert cb.confirm_stripe_cleaning_payment(session)


def test_stripe_checkout_uses_existing_active_prices_by_payment_choice(monkeypatch):
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_not_real")
    received = []
    class FakeResponse:
        def raise_for_status(self): pass
        def json(self): return {"url":"https://checkout.stripe.com/test","id":"cs_test_checkout"}
    def fake_post(url, headers, data, timeout):
        assert "stripe.com" in url
        received.append(data)
        return FakeResponse()
    monkeypatch.setattr(cb.requests, "post", fake_post)
    for choice in ("booking", "full"):
        hold = {
            "reference": "d" * 32, "quantity": 2, "payment_choice": choice,
            "payment_cents": cb.amount_to_charge_cents(2, choice),
            "total_cents": 45000, "balance_cents": 25000 if choice == "booking" else 0,
            "booking_date": future_date(), "start_time": "08:00",
            "payment_provider": "stripe", "lead": {"email":"test@example.com"}
        }
        assert cb._create_stripe_checkout(hold).startswith("https://")
    deposit, full = received
    assert deposit["line_items[0][price]"] == cb.STRIPE_CLEANING_BOOKING_PRICE
    assert "line_items[1][price]" not in deposit
    assert deposit["metadata[payment_choice]"] == "booking"
    assert full["line_items[0][price]"] == cb.STRIPE_FIRST_CLEAN_PRICE
    assert full["line_items[1][price]"] == cb.STRIPE_ADDITIONAL_CLEAN_PRICE
    assert full["line_items[1][quantity]"] == "1"
    assert "billing_address_collection" not in deposit
    assert "billing_address_collection" not in full
    for item in (deposit, full):
        assert item["payment_method_configuration"] == "pmc_1UNgZ0PpUx7EUhdNwdVqO3md"
        assert "payment_method_types" not in item
        assert "payment_method_collection" not in item
        assert int(item["expires_at"]) > int(cb.time.time())
        assert int(item["expires_at"]) - int(cb.time.time()) <= 32 * 60


def test_live_config_advertises_book_200_default():
    result = cb.cleaning_config(Response())
    assert result["first_system"] == 300
    assert result["each_additional_system"] == 150
    assert result["booking_payment"] == 200
    assert result["default_payment_choice"] == "booking"

def test_stripe_return_verifies_payment_directly_when_webhook_is_delayed(calendar, monkeypatch):
    store, _ = calendar
    ref = "e" * 32
    session_id = "cs_live_a1verified"
    day = future_date()
    order = {
        "reference": ref, "booking_date": day, "start_time": "08:00",
        "quantity": 1, "total_cents": 30000, "payment_cents": 20000,
        "balance_cents": 10000, "payment_choice": "booking",
        "payment_provider": "stripe", "stripe_session_id": session_id,
        "lead": {"name": "Customer", "email": "example@example.com"},
    }
    store.set(cb.hold_key(ref), json.dumps(order), ex=1000)
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_fixture")

    class FakeStripeResponse:
        def raise_for_status(self): pass
        def json(self):
            return {
                "metadata": {"checkout_type": "cleaning", "cleaning_ref": ref},
                "id": session_id, "client_reference_id": ref,
                "amount_total": 20000, "currency": "aud", "payment_status": "paid",
            }

    def fake_get(url, headers, timeout):
        assert url.endswith(session_id)
        assert headers["Authorization"] == "Bearer sk_test_fixture"
        return FakeStripeResponse()

    monkeypatch.setattr(cb.requests, "get", fake_get)
    paid = cb.cleaning_payment_status(Response(), checkout_ref=ref, session_id=session_id)
    assert paid["status"] == "confirmed"
    assert paid["amount_paid"] == 200
    assert paid["balance_amount"] == 100
    assert cb._get_json(store, cb.confirmed_key(ref))


def test_stripe_return_rejects_unverified_or_mismatched_session(calendar, monkeypatch):
    store, _ = calendar
    ref = "f" * 32
    session_id = "cs_live_a1verified"
    order = {
        "reference": ref, "booking_date": future_date(), "start_time": "08:00",
        "quantity": 1, "total_cents": 30000, "payment_cents": 20000,
        "payment_provider": "stripe", "stripe_session_id": session_id,
        "lead": {},
    }
    store.set(cb.hold_key(ref), json.dumps(order), ex=1000)
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_fixture")
    called = []
    class WrongAmount:
        def raise_for_status(self): pass
        def json(self):
            return {
                "metadata": {"checkout_type": "cleaning", "cleaning_ref": ref},
                "id": session_id, "client_reference_id": ref,
                "amount_total": 30000, "currency": "aud", "payment_status": "paid",
            }
    monkeypatch.setattr(cb.requests, "get", lambda *a, **kw: (called.append(1), WrongAmount())[1])
    assert cb.cleaning_payment_status(Response(), checkout_ref=ref, session_id="cs_live_wrong")["status"] == "processing"
    assert not called
    assert cb.cleaning_payment_status(Response(), checkout_ref=ref, session_id=session_id)["status"] == "processing"
    assert len(called) == 1
    assert not store.exists(cb.paid_key(ref))

def test_cancel_unpaid_stripe_checkout_expires_session_and_reopens_slot(calendar, monkeypatch):
    store, _ = calendar
    ref = "9" * 32
    date = future_date()
    hold = {"reference": ref, "booking_date": date, "start_time": "08:00",
            "quantity": 1, "payment_provider": "stripe",
            "stripe_session_id": "cs_live_canceltest"}
    store.set(cb.hold_key(ref), json.dumps(hold), ex=1000)
    assert not cb._slot_is_free(store, date, "08:00", 1)
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_dummy")
    requests_seen = []

    class Expired:
        def raise_for_status(self): pass
        def json(self): return {"status": "expired"}

    def expire(url, headers, timeout):
        requests_seen.append(url)
        return Expired()

    monkeypatch.setattr(cb.requests, "post", expire)
    result = cb.cancel_cleaning_checkout(cb.CancelCleaningCheckout(checkout_ref=ref))
    assert result["status"] == "released"
    assert requests_seen and requests_seen[0].endswith("/cs_live_canceltest/expire")
    assert not store.exists(cb.hold_key(ref))
    assert cb._slot_is_free(store, date, "08:00", 1)


def test_cannot_cancel_already_paid_cleaning(calendar, monkeypatch):
    store, _ = calendar
    ref = "8" * 32
    store.set(cb.paid_key(ref), json.dumps({"status": "confirmed"}))
    def no_request(*args, **kwargs):
        raise AssertionError("Already paid: must not call Stripe")
    monkeypatch.setattr(cb.requests, "post", no_request)
    result = cb.cancel_cleaning_checkout(cb.CancelCleaningCheckout(checkout_ref=ref))
    assert result["status"] == "already_paid"
