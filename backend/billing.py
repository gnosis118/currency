from __future__ import annotations
import stripe
from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session

from backend.settings import get_settings
from backend.models import User, Plan


def _init_stripe():
    settings = get_settings()
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe secret not configured")
    stripe.api_key = settings.STRIPE_SECRET_KEY


def price_for_plan(plan: str) -> Optional[str]:
    s = get_settings()
    if plan == Plan.STARTER.value:
        return s.STARTER_PRICE_ID
    if plan == Plan.PRO.value:
        return s.PRO_PRICE_ID
    if plan == Plan.SCALE.value:
        return s.SCALE_PRICE_ID
    return None


def ensure_customer(user: User) -> User:
    _init_stripe()
    if user.stripe_customer_id:
        return user
    customer = stripe.Customer.create(email=user.email)
    user.stripe_customer_id = customer.id
    return user


def create_checkout_session(db: Session, user: User, plan: str) -> str:
    _init_stripe()
    price_id = price_for_plan(plan)
    if not price_id:
        raise HTTPException(status_code=400, detail="Invalid plan")
    ensure_customer(user)
    db.add(user)
    db.commit()
    s = get_settings()
    session = stripe.checkout.Session.create(
        mode="subscription",
        customer=user.stripe_customer_id,
        line_items=[{"price": price_id, "quantity": 1}],
        success_url="https://currencytocurrency.app/billing/success",
        cancel_url="https://currencytocurrency.app/billing/cancel",
    )
    return session.url


def create_billing_portal(user: User) -> str:
    _init_stripe()
    portal = stripe.billing_portal.Session.create(customer=user.stripe_customer_id)
    return portal.url


def plan_from_price(price_id: str) -> str:
    s = get_settings()
    if price_id == s.STARTER_PRICE_ID:
        return Plan.STARTER.value
    if price_id == s.PRO_PRICE_ID:
        return Plan.PRO.value
    if price_id == s.SCALE_PRICE_ID:
        return Plan.SCALE.value
    return Plan.FREE.value


