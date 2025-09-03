from __future__ import annotations
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import date
import hmac
import hashlib
import base64

from backend.db import get_db
from backend.settings import get_settings
from backend.models import User, ApiKey, UsageDaily, UsageMonthly
from backend.auth import ensure_user, issue_key, revoke_key, hash_key

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(token: str | None):
    s = get_settings()
    if token != s.ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.get("/users")
def list_users(x_admin_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    require_admin(x_admin_token)
    users = db.query(User).all()
    out = []
    today = date.today().strftime("%Y-%m-%d")
    month = date.today().strftime("%Y%m")
    for u in users:
        daily = db.query(UsageDaily).filter(UsageDaily.user_id == u.id, UsageDaily.date == date.today()).first()
        monthly = db.query(UsageMonthly).filter(UsageMonthly.user_id == u.id, UsageMonthly.month == month).first()
        out.append({
            "email": u.email,
            "plan": u.plan,
            "status": u.status,
            "daily": daily.count if daily else 0,
            "monthly": monthly.count if monthly else 0,
        })
    return out


@router.get("/user/{email}")
def user_detail(email: str, x_admin_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    require_admin(x_admin_token)
    u = db.query(User).filter(User.email == email).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    keys = db.query(ApiKey).filter(ApiKey.user_id == u.id).all()
    today = date.today()
    month = today.strftime("%Y%m")
    d = db.query(UsageDaily).filter(UsageDaily.user_id == u.id, UsageDaily.date == today).first()
    m = db.query(UsageMonthly).filter(UsageMonthly.user_id == u.id, UsageMonthly.month == month).first()
    return {
        "email": u.email,
        "plan": u.plan,
        "status": u.status,
        "keys": [{"hash": k.key_hash, "label": k.label, "revoked": k.revoked, "last_used_at": k.last_used_at} for k in keys],
        "daily": d.count if d else 0,
        "monthly": m.count if m else 0,
    }


class IssueKeyBody(BaseModel):
    email: str
    label: str | None = None


@router.post("/keys/issue")
def keys_issue(body: IssueKeyBody, x_admin_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    require_admin(x_admin_token)
    raw = issue_key(db, body.email, body.label)
    return {"api_key": raw}


class RevokeKeyBody(BaseModel):
    email: str
    key: str  # raw or hash


@router.post("/keys/revoke")
def keys_revoke(body: RevokeKeyBody, x_admin_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    require_admin(x_admin_token)
    revoke_key(db, body.email, body.key)
    return {"ok": True}


class RotateKeyBody(BaseModel):
    email: str
    old_key: str  # raw or hash
    label: str | None = None


@router.post("/keys/rotate")
def keys_rotate(body: RotateKeyBody, x_admin_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    require_admin(x_admin_token)
    revoke_key(db, body.email, body.old_key)
    new_key = issue_key(db, body.email, body.label)
    return {"api_key": new_key}


@router.post("/sendgrid/events")
async def sendgrid_events(request: Request):
    """SendGrid Event Webhook receiver with optional signature verification.
    Configure POST https://<api-domain>/admin/sendgrid/events
    """
    settings = get_settings()

    raw_body = await request.body()
    signature = request.headers.get("X-Twilio-Email-Event-Webhook-Signature")
    timestamp = request.headers.get("X-Twilio-Email-Event-Webhook-Timestamp")

    if settings.SENDGRID_EVENT_SIGNING_KEY:
        if not signature or not timestamp:
            return JSONResponse({"detail": "Missing signature headers"}, status_code=400)
        try:
            signed_payload = timestamp.encode() + raw_body
            computed = hmac.new(
                key=base64.b64decode(settings.SENDGRID_EVENT_SIGNING_KEY),
                msg=signed_payload,
                digestmod=hashlib.sha256,
            ).digest()
            expected_sig = base64.b64encode(computed).decode()
            if not hmac.compare_digest(expected_sig, signature):
                return JSONResponse({"detail": "Invalid signature"}, status_code=401)
        except Exception:
            return JSONResponse({"detail": "Signature verification error"}, status_code=400)

    try:
        events = await request.json()
        if not isinstance(events, list):
            return JSONResponse({"detail": "Expected a JSON array of events"}, status_code=400)
    except Exception:
        return JSONResponse({"detail": "Invalid JSON"}, status_code=400)

    counts: dict[str, int] = {}
    for e in events:
        event_type = (e.get("event") or e.get("event_type") or "unknown").lower()
        counts[event_type] = counts.get(event_type, 0) + 1

    return {"received": len(events), "by_type": counts}

