from __future__ import annotations
from datetime import datetime
from typing import Dict, Tuple

from backend.models import Plan
from backend.redis_client import get_redis


PLAN_CFG: Dict[str, Dict] = {
    "FREE":    {"rpm": 10,  "daily": 1000,   "monthly": 10000,    "features": {"convert": True, "history_days": 0,    "forecast": False}},
    "STARTER": {"rpm": 60,  "daily": 5000,   "monthly": 100000,   "features": {"convert": True, "history_days": 30,   "forecast": False}},
    "PRO":     {"rpm": 120, "daily": 50000,  "monthly": 1000000,  "features": {"convert": True, "history_days": 1825, "forecast": True}},
    "SCALE":   {"rpm": 240, "daily": 200000, "monthly": 10000000, "features": {"convert": True, "history_days": 3650, "forecast": True}},
}


def _keys(user_id: int) -> Tuple[str, str, str]:
    now = datetime.utcnow()
    minute_key = f"ratelimit:{user_id}:{now.strftime('%Y%m%d%H%M')}"
    daily_key = f"quota:{user_id}:{now.strftime('%Y%m%d')}"
    monthly_key = f"quotaM:{user_id}:{now.strftime('%Y%m')}"
    return minute_key, daily_key, monthly_key


def check_and_increment(user_id: int, plan: str) -> Tuple[int, int, int]:
    cfg = PLAN_CFG[plan]
    r = get_redis()
    minute_key, daily_key, monthly_key = _keys(user_id)
    minute = int(r.incr(minute_key)) if r else 0
    daily = int(r.incr(daily_key)) if r else 0
    monthly = int(r.incr(monthly_key)) if r else 0
    if r:
        r.expire(minute_key, 70)
        r.expire(daily_key, 60 * 60 * 30)
        r.expire(monthly_key, 60 * 60 * 24 * 40)
    # enforce
    if minute > cfg["rpm"]:
        raise LimitError("rate limit exceeded (per-minute)")
    if daily > cfg["daily"]:
        raise LimitError("rate limit exceeded (daily)")
    if monthly > cfg["monthly"]:
        raise LimitError("rate limit exceeded (monthly)")
    return minute, daily, monthly


class LimitError(Exception):
    pass


