import json
from contextlib import nullcontext
from datetime import timedelta, datetime

import fakeredis
import pytest

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


def test_expired_payment_hold_never_overbooks(calendar):
    store, _ = calendar
    d = future_date()
    reference = "b" * 32
    record = {
        "reference": reference, "booking_date": d, "start_time": "08:00",
        "quantity": 1, "total_cents": 30000, "lead": {},
    }
    result = cb._finalize_paid_cleaning(store, record)
    assert result["status"] == "needs_reschedule"
    assert not store.exists(cb.confirmed_key(reference))
    assert store.exists(cb.paid_key(reference))
