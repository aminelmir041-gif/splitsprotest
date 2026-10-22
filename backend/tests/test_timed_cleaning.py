import fnmatch
import json

from backend import cleaning_bookings as m
from backend.render_app import app


class FakeRedis:
    def __init__(self):
        self.data = {}

    def get(self, key):
        return self.data.get(key)

    def scan_iter(self, match, count=100):
        return [k for k in self.data if fnmatch.fnmatch(k, match)]


def test_full_payment_server_prices():
    first = m.first_clean_cents()
    assert m.price_cents(1) == first
    assert m.price_cents(2) == first + 15000
    assert m.price_cents(3) == first + 30000
    assert m.price_cents(7) == first + 90000


def test_90_minute_starts_and_duration():
    assert m.format_time(480) == "08:00"
    assert m.format_time(570) == "09:30"
    assert m.parse_time("09:30") == 570
    assert m.parse_time("14:00") == 840
    assert m.overlaps((480, 570), (570, 660)) is False
    assert m.overlaps((480, 750), (660, 840)) is True


def test_installation_and_cleaning_share_availability(monkeypatch):
    day = "2099-10-14"
    monkeypatch.setattr(m, "manual_blocks", lambda: set())
    c = FakeRedis()
    assert m._slot_is_free(c, day, "08:00", 1)
    c.data["splitspro:booking:" + day + ":morning"] = "1"
    assert not m._slot_is_free(c, day, "08:00", 1)
    assert m._slot_is_free(c, day, "12:30", 1)
    c.data.pop("splitspro:booking:" + day + ":morning")
    c.data[m.hold_key("a" * 32)] = json.dumps({
        "booking_date": day, "start_time": "08:00", "quantity": 4
    })
    assert not m._slot_is_free(c, day, "08:00", 1)
    assert not m._slot_is_free(c, day, "12:30", 1)
    assert m._slot_is_free(c, day, "14:00", 1)
    assert m.cleaning_blocks_installation(c, day, "Morning")
    assert m.cleaning_blocks_installation(c, day, "Afternoon")


def test_manual_blackouts_apply_to_cleaning(monkeypatch):
    day = "2099-10-15"
    monkeypatch.setattr(m, "manual_blocks", lambda: {(day, "Morning")})
    c = FakeRedis()
    assert not m._slot_is_free(c, day, "11:00", 1)
    assert m._slot_is_free(c, day, "14:00", 1)


def test_endpoints_registered_with_existing_installation_routes():
    paths = app.openapi()["paths"]
    for route in ("/api/booking-slots", "/api/booking-checkout",
                  "/api/cleaning-slots", "/api/cleaning-checkout",
                  "/api/cleaning-payment-status", "/api/cleaning-paypal-capture"):
        assert route in paths
