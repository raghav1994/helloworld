"""Pluggable Instagram data provider.

MVP ships a deterministic MockInstagramProvider so the full app works end-to-end
without a real scraping account. Swap with ApifyInstagramProvider later by
setting INSTAGRAM_PROVIDER=apify and APIFY_TOKEN.
"""
from __future__ import annotations
import os
import random
import hashlib
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any


# ---- Public dataclasses -------------------------------------------------- #
def _seed_for(username: str) -> int:
    h = hashlib.sha256(username.lower().encode()).hexdigest()
    return int(h[:12], 16)


# ---- Provider implementations ------------------------------------------- #
class MockInstagramProvider:
    """Deterministic synthetic public-IG data for an MVP demo."""

    BIO_TEMPLATES = [
        "creator | content about life, art & honesty",
        "telling stories with a phone | brand collabs welcome",
        "comedy / lifestyle / good vibes only",
        "tech reviewer • daily reels • long-form on YT",
        "fitness coach helping 10k+ humans get strong",
    ]

    POSITIVE_COMMENTS = [
        "love this so much, you’re so authentic 🤍",
        "this energy is unmatched fr",
        "okay but the editing is INSANE",
        "you literally read my mind today",
        "needed this, thank you 🙏",
        "you make me feel less alone honestly",
        "your humor is everything 😂😂",
        "this is the most underrated channel on IG",
        "queen behaviour 👑",
        "obsessed with how real you are",
        "main character vibes 💫",
        "the way you broke this down — chef’s kiss",
    ]
    NEUTRAL_COMMENTS = [
        "interesting take",
        "where did you film this?",
        "what camera?",
        "first 👋",
        "is this in delhi?",
        "song name pls",
        "link in bio?",
        "🔥",
        "hi from brazil",
        "saw this trend last week too",
    ]
    NEGATIVE_COMMENTS = [
        "feels like an ad ngl",
        "you’ve been pushing this brand a lot lately",
        "this is the third reel about the same thing",
        "mid",
        "used to be better content",
        "another paid promo 🙄",
        "didn’t age well",
        "felt forced honestly",
        "stop yelling at the camera pls",
    ]

    LANGUAGES = ["en", "en", "en", "hi", "es", "pt", "fr", "id"]
    REGIONS = [
        ("India", 0.34),
        ("United States", 0.22),
        ("United Kingdom", 0.09),
        ("Brazil", 0.08),
        ("Indonesia", 0.07),
        ("Germany", 0.05),
        ("UAE", 0.05),
        ("Other", 0.10),
    ]

    async def fetch_profile(self, username: str) -> Dict[str, Any]:
        rng = random.Random(_seed_for(username))
        followers = rng.randint(8_000, 1_400_000)
        following = rng.randint(180, 1200)
        posts_count = rng.randint(120, 1800)
        return {
            "username": username,
            "full_name": username.replace("_", " ").replace(".", " ").title(),
            "bio": rng.choice(self.BIO_TEMPLATES),
            "followers": followers,
            "following": following,
            "posts_count": posts_count,
            "is_private": False,
            "is_verified": rng.random() < 0.18,
            "profile_pic_url": f"https://api.dicebear.com/7.x/shapes/svg?seed={username}",
            "fetched_at": datetime.now(timezone.utc).isoformat(),
        }

    async def fetch_recent_posts(self, username: str, limit: int = 30) -> List[Dict[str, Any]]:
        rng = random.Random(_seed_for(username) + 1)
        posts = []
        now = datetime.now(timezone.utc)
        for i in range(limit):
            post_id = f"{username}_p{i}"
            likes = rng.randint(400, 80_000)
            comments_count = rng.randint(20, 800)
            captions = [
                "behind the scenes of yesterday's shoot",
                "we shipped it. 6 months. let's go 🚀",
                "thread: what nobody tells you about creator burnout",
                "AD | excited to partner with this brand",
                "raw thoughts at 2am — read till the end",
                "controversial opinion incoming…",
                "tiny win today and i'm allowed to celebrate",
                "tutorial: my exact editing workflow",
            ]
            posts.append({
                "post_id": post_id,
                "caption": rng.choice(captions),
                "likes": likes,
                "comments_count": comments_count,
                "media_type": rng.choice(["reel", "image", "carousel", "reel", "reel"]),
                "posted_at": (now - timedelta(days=i * rng.randint(1, 4))).isoformat(),
            })
        return posts

    async def fetch_comments(self, username: str, post_ids: List[str]) -> List[Dict[str, Any]]:
        rng = random.Random(_seed_for(username) + 2)
        comments: List[Dict[str, Any]] = []
        for pid in post_ids:
            n = rng.randint(20, 60)
            for j in range(n):
                bucket = rng.random()
                if bucket < 0.55:
                    text = rng.choice(self.POSITIVE_COMMENTS)
                    sentiment_hint = "positive"
                elif bucket < 0.78:
                    text = rng.choice(self.NEUTRAL_COMMENTS)
                    sentiment_hint = "neutral"
                else:
                    text = rng.choice(self.NEGATIVE_COMMENTS)
                    sentiment_hint = "negative"
                comments.append({
                    "post_id": pid,
                    "text": text,
                    "lang": rng.choice(self.LANGUAGES),
                    "likes": rng.randint(0, 240),
                    "sentiment_hint": sentiment_hint,
                    "user": f"user_{rng.randint(1000, 99999)}",
                })
        return comments


def get_provider():
    name = os.environ.get("INSTAGRAM_PROVIDER", "mock").lower()
    if name == "mock":
        return MockInstagramProvider()
    # Future: apify / brightdata adapters plug in here.
    return MockInstagramProvider()
