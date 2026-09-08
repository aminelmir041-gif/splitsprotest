"""Backend tests for SplitsPro API — iteration 9.

Covers new lead-gen features:
  - POST /api/quotes now accepts email + photo_url and validates required fields + phone
  - POST /api/upload uploads image files to emergent object storage
  - GET /api/files/{path} serves uploaded content
  - GET /api/reviews returns 7 seeded reviews with category + featured (Sia general/featured)
"""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    return sess


# ---- Health ----
def test_api_root(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    assert "message" in r.json()


# ---- Reviews (SEED_VERSION=3: 7 reviews, category+featured) ----
def test_reviews_returns_7_with_categories_and_featured(s):
    r = s.get(f"{API}/reviews")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 7, f"Expected 7 seeded reviews, got {len(data)}"

    # Validate shape
    for rv in data:
        assert rv.get("name")
        assert rv.get("text")
        assert rv.get("rating") == 5
        assert "category" in rv
        assert "featured" in rv

    # Categories present
    cats = {rv["category"] for rv in data}
    for expected in {"split-systems", "ducted", "cleaning", "repairs", "servicing", "general"}:
        assert expected in cats, f"Missing category {expected} in {cats}"

    # Sia should be featured=True + general category
    sia = [rv for rv in data if rv["name"] == "Sia"]
    assert sia, "Sia review missing"
    assert sia[0]["featured"] is True
    assert sia[0]["category"] == "general"

    # Only Sia should be featured
    featured = [rv for rv in data if rv["featured"]]
    assert len(featured) == 1

    # Named reviewers required by the request
    names = {rv["name"] for rv in data}
    for expected in {"Sia", "Mustapha Hamed", "Charles Speights", "Carolyn Hicks"}:
        assert expected in names, f"Missing reviewer {expected}"


# ---- Quote create (valid) ----
def test_create_quote_with_email_and_photo(s):
    payload = {
        "name": "TEST Alice",
        "phone": "0414123456",
        "email": "alice@example.com",
        "suburb": "Bankstown",
        "service": "Split System Installation",
        "message": "Two bedrooms",
        "photo_url": "/api/files/splitspro/uploads/mock.jpg",
    }
    r = s.post(f"{API}/quotes", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    for k in ("name", "phone", "email", "suburb", "service", "message", "photo_url"):
        assert data[k] == payload[k]
    assert isinstance(data.get("id"), str) and len(data["id"]) > 8
    assert "created_at" in data

    # Persistence check
    r2 = s.get(f"{API}/quotes")
    assert r2.status_code == 200
    ids = [q["id"] for q in r2.json()]
    assert data["id"] in ids


def test_create_quote_minimal_no_optional(s):
    payload = {
        "name": "TEST Bob",
        "phone": "02 9876 5432",
        "suburb": "Parramatta",
        "service": "Ducted Air Conditioning",
    }
    r = s.post(f"{API}/quotes", json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == ""
    assert body["photo_url"] == ""
    assert body["message"] == ""


# ---- Quote create (invalid) ----
def test_create_quote_missing_name(s):
    r = s.post(f"{API}/quotes", json={
        "phone": "0414987654", "suburb": "Fairfield", "service": "Cleaning",
    })
    assert r.status_code == 422


def test_create_quote_missing_suburb(s):
    r = s.post(f"{API}/quotes", json={
        "name": "TEST", "phone": "0414987654", "service": "Cleaning",
    })
    assert r.status_code == 422


def test_create_quote_missing_service(s):
    r = s.post(f"{API}/quotes", json={
        "name": "TEST", "phone": "0414987654", "suburb": "Fairfield",
    })
    assert r.status_code == 422


def test_create_quote_short_phone(s):
    r = s.post(f"{API}/quotes", json={
        "name": "TEST", "phone": "123", "suburb": "Liverpool", "service": "Repairs",
    })
    assert r.status_code == 422
    assert "phone" in str(r.json()).lower()


# ---- Upload endpoint ----
# 1x1 PNG (base64-decoded)
PNG_1X1 = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489"
    "0000000d49444154789c6300010000000500010d0a2db40000000049454e44ae426082"
)


def test_upload_rejects_non_image(s):
    files = {"file": ("hello.txt", b"hello world", "text/plain")}
    r = s.post(f"{API}/upload", files=files)
    assert r.status_code == 400
    assert "image" in r.text.lower()


def test_upload_rejects_oversized(s):
    # 11MB payload with an image content-type — must be rejected as too big
    big = b"\x00" * (11 * 1024 * 1024)
    files = {"file": ("big.jpg", big, "image/jpeg")}
    r = s.post(f"{API}/upload", files=files)
    assert r.status_code == 413


UPLOADED_URL = {}


def test_upload_accepts_png_and_serves_it(s):
    files = {"file": ("pixel.png", PNG_1X1, "image/png")}
    r = s.post(f"{API}/upload", files=files)
    assert r.status_code == 200, r.text
    body = r.json()
    assert "path" in body and "url" in body
    assert body["url"].startswith("/api/files/")
    UPLOADED_URL["url"] = body["url"]

    # GET via public URL
    file_url = f"{BASE_URL}{body['url']}"
    g = s.get(file_url)
    assert g.status_code == 200
    ct = g.headers.get("Content-Type", "")
    assert ct.startswith("image/"), f"Unexpected content-type: {ct}"
    assert len(g.content) > 0


def test_upload_returned_url_used_in_quote(s):
    url = UPLOADED_URL.get("url")
    if not url:
        pytest.skip("Upload did not succeed in previous test")
    payload = {
        "name": "TEST Photo Lead",
        "phone": "0414 698 435",
        "email": "photo@example.com",
        "suburb": "Bass Hill",
        "service": "Split System Installation",
        "message": "Please quote for main bedroom",
        "photo_url": url,
    }
    r = s.post(f"{API}/quotes", json=payload)
    assert r.status_code == 200, r.text
    assert r.json()["photo_url"] == url
