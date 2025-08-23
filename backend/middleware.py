from __future__ import annotations
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response
from sqlalchemy.orm import Session

from backend.db import SessionLocal
from backend.models import User, Plan
from backend.settings import get_settings
from backend.limits import PLAN_CFG, check_and_increment, LimitError
from backend.auth import verify_api_key


class AuthRateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Bypass for docs and admin/billing endpoints (auth handled separately)
        if request.url.path.startswith("/docs") or request.url.path.startswith("/openapi") \
           or request.url.path.startswith("/billing") or request.url.path.startswith("/admin"):
            return await call_next(request)

        api_key = request.headers.get("X-API-Key")
        if not api_key:
            return Response(content='{"detail":"Missing X-API-Key"}', media_type="application/json", status_code=401)

        db: Session = SessionLocal()
        try:
            user = verify_api_key(db, api_key)
            if not user:
                return Response(content='{"detail":"Invalid API key"}', media_type="application/json", status_code=401)

            plan = user.plan or Plan.FREE.value
            # Feature gating
            if request.url.path.startswith("/forecast") and not PLAN_CFG[plan]["features"]["forecast"]:
                return Response(content='{"detail":"/forecast requires PRO plan or higher"}', media_type="application/json", status_code=403)
            if request.url.path.startswith("/history"):
                # allowed, but depth enforced in route
                if PLAN_CFG[plan]["features"]["history_days"] <= 0:
                    return Response(content='{"detail":"/history not available on your plan"}', media_type="application/json", status_code=403)

            # Rate limiting
            try:
                check_and_increment(user.id, plan)
            except LimitError as e:
                return Response(content=f'{{"detail":"{str(e)}"}}', media_type="application/json", status_code=429)

            # attach state for downstream
            request.state.user = user
            request.state.plan = plan

            return await call_next(request)
        finally:
            db.close()


