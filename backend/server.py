from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Header, Query
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import logging
import requests
from pathlib import Path
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="SplitsPro API")
api_router = APIRouter(prefix="/api")


def now_iso():
    return datetime.now(timezone.utc).isoformat()


# ---------------- Object storage ----------------
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "splitspro"
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10MB
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"}
storage_key = None


def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    if resp.status_code == 403:
        # storage_key expired — refresh once and retry
        globals()["storage_key"] = None
        key = init_storage()
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data, timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60,
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------------- Models ----------------
class QuoteCreate(BaseModel):
    name: str
    phone: str
    service: str
    suburb: str
    email: Optional[str] = ""
    message: Optional[str] = ""
    photo_url: Optional[str] = ""

    @field_validator("name", "phone", "service", "suburb")
    @classmethod
    def not_blank(cls, v):
        if not v or not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, v):
        digits = re.sub(r"\D", "", v)
        if len(digits) < 8:
            raise ValueError("Please enter a valid phone number")
        return v.strip()


class Quote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    service: str
    suburb: str
    email: str = ""
    message: str = ""
    photo_url: str = ""
    created_at: str = Field(default_factory=now_iso)


class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    suburb: str = ""
    rating: int = 5
    text: str
    service: str = ""
    category: str = "general"
    featured: bool = False
    date: str = ""


# ---------------- Seed data ----------------
SEED_VERSION = 3

SEED_REVIEWS = [
    {"name": "Sia", "rating": 5, "service": "Split System Installation", "category": "general", "featured": True,
     "text": "We had the most fantastic experience with Splits Pro. They were professional from the initial quote through to installation, explained every option clearly, and completed the job to an exceptionally high standard. The workmanship was clean, efficient and we couldn't be happier. Highly recommended."},
    {"name": "Mustapha Hamed", "rating": 5, "service": "Split System Installation", "category": "split-systems",
     "text": "Very professional and reliable. The team completed our split system installation perfectly, left everything spotless and made the whole process easy from start to finish."},
    {"name": "Charles Speights", "rating": 5, "service": "Ducted Air Conditioning", "category": "ducted",
     "text": "Outstanding communication and workmanship. The ducted installation was completed on time, everything was explained clearly and the final result exceeded our expectations."},
    {"name": "Carolyn Hicks", "rating": 5, "service": "Air Conditioner Cleaning", "category": "cleaning",
     "text": "Exceptional service and attention to detail. Our air conditioner is noticeably cleaner, quieter and performs better than ever. Highly recommend Splits Pro."},
    {"name": "Mohammad Sowaid", "rating": 5, "service": "Repairs & Diagnostics", "category": "repairs",
     "text": "From diagnosing the issue to completing the repair, everything was handled professionally. Honest advice, fair pricing and outstanding workmanship."},
    {"name": "John Wick", "rating": 5, "service": "Maintenance", "category": "servicing",
     "text": "Reliable, punctual and knowledgeable. Splits Pro serviced our system thoroughly and explained everything they were doing. Our air conditioner is running like new again."},
    {"name": "Analisa Sanders", "rating": 5, "service": "General", "category": "general",
     "text": "Very happy with the service from start to finish. Friendly team, excellent communication and quality workmanship. We'll definitely use Splits Pro again."},
]

SEEDED = False


async def seed_reviews():
    global SEEDED
    if SEEDED:
        return
    meta = await db.meta.find_one({"key": "reviews_seed"})
    current = meta.get("version") if meta else 0
    if current != SEED_VERSION:
        await db.reviews.delete_many({})
        docs = [Review(**r).model_dump() for r in SEED_REVIEWS]
        await db.reviews.insert_many(docs)
        await db.meta.update_one({"key": "reviews_seed"}, {"$set": {"version": SEED_VERSION}}, upsert=True)
        logging.info("(Re)seeded %d reviews at version %d", len(docs), SEED_VERSION)
    SEEDED = True


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "SplitsPro API"}


@api_router.post("/quotes", response_model=Quote)
async def create_quote(payload: QuoteCreate):
    quote = Quote(**payload.model_dump())
    await db.quotes.insert_one(quote.model_dump())
    logging.info("New quote lead from %s (%s)", quote.name, quote.suburb)
    return quote


@api_router.post("/upload")
async def upload(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image must be 10MB or smaller.")
    content_type = file.content_type or "application/octet-stream"
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Please upload an image file (JPG, PNG, WEBP).")
    ext = file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else "jpg"
    path = f"{APP_NAME}/uploads/{uuid.uuid4()}.{ext}"
    try:
        result = put_object(path, data, content_type)
    except Exception as e:
        logging.error("Upload failed: %s", e)
        raise HTTPException(status_code=502, detail="Upload failed. Please try again.")
    stored_path = result["path"]
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": stored_path,
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": now_iso(),
    })
    return {"path": stored_path, "url": f"/api/files/{stored_path}"}


@api_router.get("/files/{path:path}")
async def download(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(path)
    return Response(content=data, media_type=record.get("content_type", content_type))


@api_router.get("/quotes", response_model=List[Quote])
async def list_quotes():
    docs = await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Quote(**d) for d in docs]


@api_router.get("/reviews", response_model=List[Review])
async def list_reviews():
    await seed_reviews()
    docs = await db.reviews.find({}, {"_id": 0}).to_list(1000)
    return [Review(**d) for d in docs]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    await seed_reviews()
    try:
        init_storage()
        logging.info("Storage initialized")
    except Exception as e:
        logging.error("Storage init failed: %s", e)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
