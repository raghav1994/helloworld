"""Pulsay business endpoints: connect IG, fetch report, refresh."""
import re
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from auth import get_current_user_dep
from instagram_adapter import get_provider
from ai_analyzer import run_perception_analysis, PROVIDER_OPTIONS

router = APIRouter(prefix="/api/pulsay", tags=["pulsay"])

USERNAME_RE = re.compile(r"^[A-Za-z0-9_.]{1,30}$")


class ConnectRequest(BaseModel):
    username: str = Field(min_length=1, max_length=40)
    provider: str | None = None  # anthropic | openai | gemini


def _normalise_username(raw: str) -> str:
    u = raw.strip().lstrip("@")
    if u.startswith("https://") or u.startswith("http://"):
        u = u.rstrip("/").split("/")[-1]
    if not USERNAME_RE.match(u):
        raise HTTPException(status_code=400, detail="Invalid Instagram username")
    return u.lower()


async def _build_and_store_report(db, user_id: str, username: str, provider: str | None) -> dict:
    ig = get_provider()
    profile = await ig.fetch_profile(username)
    posts = await ig.fetch_recent_posts(username, limit=30)
    post_ids = [p["post_id"] for p in posts]
    comments = await ig.fetch_comments(username, post_ids)

    report = await run_perception_analysis(profile, posts, comments, provider=provider)
    report_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "username": username,
        "created_at": datetime.now(timezone.utc).isoformat(),
        **report,
    }
    await db.reports.insert_one(report_doc)
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"instagram_username": username, "last_report_at": report_doc["created_at"]}},
    )
    return report_doc


@router.post("/connect")
async def connect_instagram(payload: ConnectRequest, user: dict = Depends(get_current_user_dep)):
    from server import db

    if payload.provider and payload.provider not in PROVIDER_OPTIONS:
        raise HTTPException(status_code=400, detail="Unknown LLM provider")

    username = _normalise_username(payload.username)
    report = await _build_and_store_report(db, user["id"], username, payload.provider)
    report.pop("_id", None)
    return report


@router.get("/report")
async def latest_report(user: dict = Depends(get_current_user_dep)):
    from server import db

    if not user.get("instagram_username"):
        raise HTTPException(status_code=404, detail="No Instagram account connected")

    report = await db.reports.find_one(
        {"user_id": user["id"]},
        {"_id": 0},
        sort=[("created_at", -1)],
    )
    if not report:
        raise HTTPException(status_code=404, detail="No report found yet")
    return report


@router.post("/refresh")
async def refresh_report(user: dict = Depends(get_current_user_dep)):
    from server import db

    username = user.get("instagram_username")
    if not username:
        raise HTTPException(status_code=400, detail="No Instagram account connected")
    report = await _build_and_store_report(db, user["id"], username, None)
    report.pop("_id", None)
    return report


@router.get("/providers")
async def providers():
    return {"options": [{"id": k, "model": v} for k, v in PROVIDER_OPTIONS.items()]}
