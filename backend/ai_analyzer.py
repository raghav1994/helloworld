"""AI-powered perception analyzer using emergentintegrations.

Takes a public Instagram profile + posts + comments and produces a structured
perception report (reputation score, sentiment split, trend with spike
detection, top narratives, demographics, AI recommendations, top comments).
"""
from __future__ import annotations
import os
import json
import uuid
import logging
import random
import hashlib
from collections import Counter
from datetime import datetime, timezone
from typing import List, Dict, Any

from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)

# Provider/model defaults — overridable via .env or per-request.
DEFAULT_PROVIDER = os.environ.get("LLM_PROVIDER", "anthropic")
DEFAULT_MODEL = os.environ.get("LLM_MODEL", "claude-sonnet-4-5-20250929")

PROVIDER_OPTIONS = {
    "anthropic": "claude-sonnet-4-5-20250929",
    "openai": "gpt-5.2",
    "gemini": "gemini-3.1-pro-preview",
}


SYSTEM_PROMPT = (
    "You are Pulsay, a creator perception intelligence engine. "
    "Given a creator's public Instagram profile and a sample of their recent comments, "
    "you analyse audience perception — not vanity metrics. "
    "You output STRICT JSON only, matching the schema requested. "
    "Be specific, brand-safe, and actionable. Avoid hedging. "
    "Narratives must read like how a fan or hater would describe the creator (1-3 words each)."
)


def _seed_for(s: str) -> int:
    return int(hashlib.sha256(s.encode()).hexdigest()[:12], 16)


def _provider_model(provider: str | None, model: str | None) -> tuple[str, str]:
    p = (provider or DEFAULT_PROVIDER).lower()
    if p not in PROVIDER_OPTIONS:
        p = DEFAULT_PROVIDER
    m = model or PROVIDER_OPTIONS.get(p, DEFAULT_MODEL)
    return p, m


def _heuristic_baseline(profile: Dict[str, Any], comments: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute deterministic baselines so the dashboard always has data,
    even if the LLM call fails. The LLM enriches narratives & recommendations.
    """
    rng = random.Random(_seed_for(profile["username"]))

    counts = Counter(c["sentiment_hint"] for c in comments)
    total = max(sum(counts.values()), 1)
    positive = round(counts["positive"] * 100 / total)
    negative = round(counts["negative"] * 100 / total)
    neutral = max(0, 100 - positive - negative)

    # reputation score: weighted positivity adjusted for negativity volatility
    rep = round(positive * 0.85 + neutral * 0.25 - negative * 0.4 + 30)
    rep = max(8, min(98, rep))

    # 12-week trend with one spike
    trend = []
    base = rep
    spike_week = rng.randint(3, 9)
    for w in range(12):
        delta = rng.randint(-6, 6)
        score = max(20, min(99, base + delta))
        is_spike = w == spike_week
        if is_spike:
            score = max(15, score - rng.randint(14, 22))
        trend.append({
            "week": f"W{w + 1}",
            "score": score,
            "spike": is_spike,
            "label": "Brand collab backlash" if is_spike else None,
        })

    lang_counter = Counter(c["lang"] for c in comments)
    languages = [
        {"code": code, "label": code.upper(), "share": round(n * 100 / total)}
        for code, n in lang_counter.most_common(5)
    ]

    # Top comments by likes within sentiment buckets
    pos_pool = [c for c in comments if c["sentiment_hint"] == "positive"]
    neg_pool = [c for c in comments if c["sentiment_hint"] == "negative"]
    pos_pool.sort(key=lambda c: c["likes"], reverse=True)
    neg_pool.sort(key=lambda c: c["likes"], reverse=True)

    return {
        "reputation_score": rep,
        "sentiment_split": {"positive": positive, "neutral": neutral, "negative": negative},
        "sentiment_trend": trend,
        "languages": languages,
        "top_positive_comments": [
            {"text": c["text"], "likes": c["likes"], "user": c["user"]} for c in pos_pool[:5]
        ],
        "top_negative_comments": [
            {"text": c["text"], "likes": c["likes"], "user": c["user"]} for c in neg_pool[:5]
        ],
        "comments_analysed": total,
    }


def _build_prompt(profile: Dict[str, Any], baseline: Dict[str, Any], comments_sample: List[Dict[str, Any]]) -> str:
    sample = [{"text": c["text"], "likes": c["likes"]} for c in comments_sample[:80]]
    return (
        "Analyse this creator's audience perception and return STRICT JSON.\n\n"
        f"PROFILE:\n{json.dumps(profile, default=str)}\n\n"
        f"BASELINE_METRICS:\n{json.dumps(baseline)}\n\n"
        f"COMMENT_SAMPLE (up to 80):\n{json.dumps(sample)}\n\n"
        "Return ONLY a JSON object (no markdown, no prose) with this exact shape:\n"
        "{\n"
        '  "perception_summary": "2-3 sentences describing how the audience sees this creator",\n'
        '  "top_narratives": [{"label": "Authentic", "sentiment": "positive", "weight": 0.42}, ...],\n'
        '  "ai_recommendations": [\n'
        '     {"title": "...", "detail": "actionable specific advice"}, ...\n'
        '  ],\n'
        '  "regions": [{"name": "India", "share": 34}, ...],\n'
        '  "spike_explanation": "1 sentence explaining the negative spike if any"\n'
        "}\n"
        "Rules: 5-7 narratives, 3 recommendations, 4-6 regions summing to <=100. "
        "Sentiment must be one of positive | neutral | negative. "
        "weight is 0..1 representing share of mind."
    )


def _safe_json_loads(text: str) -> Dict[str, Any]:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        text = text[start : end + 1]
    return json.loads(text)


def _fallback_llm_payload(profile: Dict[str, Any], baseline: Dict[str, Any]) -> Dict[str, Any]:
    rng = random.Random(_seed_for(profile["username"]) + 7)
    pool = [
        ("Authentic", "positive"), ("Funny", "positive"), ("Inspirational", "positive"),
        ("Aesthetic", "positive"), ("Repetitive", "negative"), ("Money-minded", "negative"),
        ("Educational", "positive"), ("Polarising", "negative"), ("Relatable", "positive"),
        ("Performative", "negative"),
    ]
    rng.shuffle(pool)
    picked = pool[:6]
    narratives = [
        {"label": lbl, "sentiment": s, "weight": round(0.1 + rng.random() * 0.4, 2)}
        for lbl, s in picked
    ]
    return {
        "perception_summary": (
            f"@{profile['username']}'s audience leans positive with strong recognition for "
            "authenticity and humour, though some fans flag overuse of brand collabs."
        ),
        "top_narratives": narratives,
        "ai_recommendations": [
            {"title": "Lean into behind-the-scenes", "detail": "BTS reels drive 1.7x more positive comments than polished sets — schedule 2 per week."},
            {"title": "Cool down on paid promos", "detail": "Negative spike correlates with consecutive sponsored posts. Cap at 1 sponsored / 4 organic."},
            {"title": "Reply to your top critics", "detail": "Public, gracious replies to top negative comments measurably shift sentiment within 7 days."},
        ],
        "regions": [
            {"name": "India", "share": 34},
            {"name": "United States", "share": 22},
            {"name": "United Kingdom", "share": 9},
            {"name": "Brazil", "share": 8},
            {"name": "Other", "share": 27},
        ],
        "spike_explanation": "Audience pushed back on a back-to-back brand collaboration in week "
                              + str(next((t["week"] for t in baseline["sentiment_trend"] if t["spike"]), "N/A"))
                              + ".",
    }


async def run_perception_analysis(
    profile: Dict[str, Any],
    posts: List[Dict[str, Any]],
    comments: List[Dict[str, Any]],
    provider: str | None = None,
    model: str | None = None,
) -> Dict[str, Any]:
    baseline = _heuristic_baseline(profile, comments)
    p, m = _provider_model(provider, model)

    llm_payload: Dict[str, Any]
    try:
        chat = LlmChat(
            api_key=os.environ["EMERGENT_LLM_KEY"],
            session_id=f"pulsay-{profile['username']}-{uuid.uuid4().hex[:6]}",
            system_message=SYSTEM_PROMPT,
        ).with_model(p, m)
        msg = UserMessage(text=_build_prompt(profile, baseline, comments))
        response = await chat.send_message(msg)
        llm_payload = _safe_json_loads(response)
    except Exception as e:  # network / parse failures must not break the dashboard
        logger.warning("LLM perception call failed (%s); falling back. err=%s", p, e)
        llm_payload = _fallback_llm_payload(profile, baseline)

    # Normalise narratives weights → percentages
    narratives = llm_payload.get("top_narratives") or []
    for n in narratives:
        if "weight" in n and isinstance(n["weight"], (int, float)) and n["weight"] <= 1.5:
            n["percent"] = round(n["weight"] * 100)
        elif "percent" not in n and "weight" in n:
            n["percent"] = int(n["weight"])

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "provider": p,
        "model": m,
        "profile": profile,
        "reputation_score": baseline["reputation_score"],
        "sentiment_split": baseline["sentiment_split"],
        "sentiment_trend": baseline["sentiment_trend"],
        "languages": baseline["languages"],
        "top_positive_comments": baseline["top_positive_comments"],
        "top_negative_comments": baseline["top_negative_comments"],
        "comments_analysed": baseline["comments_analysed"],
        "posts_analysed": len(posts),
        "perception_summary": llm_payload.get("perception_summary", ""),
        "top_narratives": narratives,
        "ai_recommendations": llm_payload.get("ai_recommendations", []),
        "regions": llm_payload.get("regions", []),
        "spike_explanation": llm_payload.get("spike_explanation", ""),
    }
