from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, Header, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.auth import ensure_user, issue_key
from backend.billing import create_checkout_session, create_billing_portal, plan_from_price
from backend.settings import get_settings
from backend.models import User

import stripe

router = APIRouter(prefix="/billing", tags=["billing"])


class CheckoutBody(BaseModel):
    email: str
    plan: str


@router.post("/checkout")
def checkout(body: CheckoutBody, db: Session = Depends(get_db)):
    user = ensure_user(db, body.email)
    url = create_checkout_session(db, user, body.plan)
    return {"url": url}


class PortalBody(BaseModel):
    email: str


@router.post("/portal")
def portal(body: PortalBody, db: Session = Depends(get_db)):
    user = ensure_user(db, body.email)
    if not user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No Stripe customer")
    url = create_billing_portal(user)
    return {"url": url}


@router.post("/webhook")
async def webhook(request: Request):
    s = get_settings()
    payload = await request.body()
    sig = request.headers.get("stripe-signature")
    try:
        stripe.api_key = s.STRIPE_SECRET_KEY
        event = stripe.Webhook.construct_event(payload=payload, sig_header=sig, secret=s.STRIPE_WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    obj = event["data"]["object"]
    if event["type"] == "checkout.session.completed":
        customer_id = obj.get("customer")
        price_id = obj.get("subscription_details", {}).get("plan", {}).get("id") or obj.get("display_items", [{}])[0].get("plan", {}).get("id")
        await _sync_user_plan(customer_id, price_id)
    elif event["type"] in ("customer.subscription.updated", "customer.subscription.created"):
        sub = obj
        customer_id = sub["customer"]
        # pick first price
        items = sub.get("items", {}).get("data", [])
        price_id = items[0]["price"]["id"] if items else None
        await _sync_user_plan(customer_id, price_id)
    elif event["type"] == "customer.subscription.deleted":
        sub = obj
        await _sync_user_plan(sub["customer"], None)

    return {"ok": True}


async def _sync_user_plan(customer_id: str, price_id: str | None):
    from backend.db import SessionLocal
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if not user:
            return
        plan = plan_from_price(price_id) if price_id else "FREE"
        user.plan = plan
        user.status = "active" if price_id else "canceled"
        db.add(user)
        db.commit()
        # If user has no api key, issue one
        if not user.api_keys:
            issue_key(db, user.email, label="default")
    finally:
        db.close()


