from __future__ import annotations
import os
from typing import Optional

from backend.settings import get_settings


def get_redis():
    settings = get_settings()
    try:
        import redis  # type: ignore
        r = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
        # ping to verify
        r.ping()
        return r
    except Exception:
        # Fallback to fakeredis for local dev
        try:
            import fakeredis  # type: ignore
            return fakeredis.FakeStrictRedis(decode_responses=True)
        except Exception:  # last resort: in-memory shim
            return None


