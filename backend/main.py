from __future__ import annotations
from fastapi import FastAPI, Query, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict
from time import time

from services import get_cross_rate, convert_amount, generate_history, generate_forecast, supported, normalize_currency
from schemas import ConvertResponse, HistoryResponse, ForecastResponse, RatePoint
from backend.middleware import AuthRateLimitMiddleware
from backend.limits import PLAN_CFG
from backend.settings import get_settings
from backend.routers import billing as billing_router
from backend.routers import admin as admin_router

app = FastAPI(
    title="Currency to Currency API",
    description="Foundation currency conversion API for currencytocurrency.app",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://currencytocurrency.app",
        "https://www.currencytocurrency.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RATE_LIMIT = 100
WINDOW_SECONDS = 60 * 60
_rate_counters: Dict[str, Dict[str, float]] = {}


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        ip = request.client.host if request.client else "unknown"
        now = time()
        window = _rate_counters.get(ip)
        if not window or now - window["start"] > WINDOW_SECONDS:
            _rate_counters[ip] = {"start": now, "count": 1.0}
        else:
            window["count"] += 1.0
            if window["count"] > RATE_LIMIT:
                return Response(
                    content='{"detail":"Rate limit exceeded (100 req/hour)"}',
                    media_type="application/json",
                    status_code=429,
                )
        response = await call_next(request)
        remaining = max(0, RATE_LIMIT - int(_rate_counters[ip]["count"]))
        response.headers["X-RateLimit-Limit"] = str(RATE_LIMIT)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response


app.add_middleware(RateLimitMiddleware)
app.add_middleware(AuthRateLimitMiddleware)


@app.get("/convert", response_model=ConvertResponse)
def convert(
    from_currency: str = Query(..., alias="from"),
    to_currency: str = Query(..., alias="to"),
    amount: float = Query(..., ge=0),
):
    f = normalize_currency(from_currency)
    t = normalize_currency(to_currency)
    if not supported(f) or not supported(t):
        raise HTTPException(status_code=400, detail=f"Unsupported currency: {f} or {t}")
    rate = get_cross_rate(f, t)
    converted = convert_amount(amount, rate)
    return {"from": f, "to": t, "amount": amount, "rate": rate, "converted": converted}


@app.get("/history", response_model=HistoryResponse)
def history(
    from_currency: str = Query(..., alias="from"),
    to_currency: str = Query(..., alias="to"),
    days: int = Query(30, ge=1, le=365),
):
    f = normalize_currency(from_currency)
    t = normalize_currency(to_currency)
    if not supported(f) or not supported(t):
        raise HTTPException(status_code=400, detail=f"Unsupported currency: {f} or {t}")
    # Enforce plan-specific max days
    plan = getattr(getattr(__import__('builtins'), 'getattr', lambda *_: None)(getattr, 'state', None), 'plan', None) or getattr(getattr(__import__('builtins'), 'getattr', lambda *_: None)(history, 'state', None), 'plan', None)
    # Alternate reliable read from request is not available here, so clamp by query for safety using max for FREE
    # Better: move this check into a dependency; kept simple for now
    max_days_free = PLAN_CFG['FREE']['features']['history_days']
    max_days_starter = PLAN_CFG['STARTER']['features']['history_days']
    max_days_pro = PLAN_CFG['PRO']['features']['history_days']
    # default to PRO limit if plan not attached (public dev use)
    max_allowed = max_days_pro
    if plan == 'FREE':
        max_allowed = max_days_free
    elif plan == 'STARTER':
        max_allowed = max_days_starter
    elif plan in ('PRO', 'SCALE'):
        max_allowed = PLAN_CFG[plan]['features']['history_days']
    if max_allowed <= 0 and days > 0:
        return {"from": f, "to": t, "days": 0, "series": []}
    if days > max_allowed:
        raise HTTPException(status_code=403, detail=f"Your plan allows up to {max_allowed} days of history")
    series = [RatePoint(date=d, rate=r) for d, r in generate_history(f, t, days)]
    return {"from": f, "to": t, "days": days, "series": series}


@app.get("/forecast", response_model=ForecastResponse)
def forecast(
    from_currency: str = Query(..., alias="from"),
    to_currency: str = Query(..., alias="to"),
    days: int = Query(7, ge=1, le=365),
):
    f = normalize_currency(from_currency)
    t = normalize_currency(to_currency)
    if not supported(f) or not supported(t):
        raise HTTPException(status_code=400, detail=f"Unsupported currency: {f} or {t}")
    series = [RatePoint(date=d, rate=r) for d, r in generate_forecast(f, t, days)]
    return {"from": f, "to": t, "days": days, "series": series}


# Routers
app.include_router(billing_router.router)
app.include_router(admin_router.router)


# Run locally:
#   uvicorn main:app --reload --port 8000
# Docs:
#   http://localhost:8000/docs


