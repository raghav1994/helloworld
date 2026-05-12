"""Pulsay FastAPI entrypoint."""
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from auth import hash_password, verify_password
from auth_routes import router as auth_router
from pulsay_routes import router as pulsay_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s — %(message)s")
logger = logging.getLogger("pulsay")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Pulsay API", version="0.1.0")
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"service": "pulsay", "status": "ok"}


@api_router.get("/health")
async def health():
    try:
        await db.command("ping")
        return {"status": "ok", "db": "ok"}
    except Exception as e:
        return {"status": "degraded", "db": str(e)}


app.include_router(api_router)
app.include_router(auth_router)
app.include_router(pulsay_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.reports.create_index([("user_id", 1), ("created_at", -1)])
    await _seed_admin()
    logger.info("Pulsay API ready")


async def _seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "admin@pulsay.app").lower()
    password = os.environ.get("ADMIN_PASSWORD", "Admin@Pulsay2026")
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "name": "Admin",
            "email": email,
            "phone": "0000000000",
            "password_hash": hash_password(password),
            "instagram_username": None,
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user %s", email)
    elif not verify_password(password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": email}, {"$set": {"password_hash": hash_password(password)}}
        )
        logger.info("Updated admin password for %s", email)


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
