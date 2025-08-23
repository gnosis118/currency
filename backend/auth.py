from __future__ import annotations
import hashlib
import secrets
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

from backend.models import ApiKey, User


def generate_api_key() -> str:
    raw = "c2c_live_" + secrets.token_urlsafe(32)
    return raw


def hash_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()


def verify_api_key(db: Session, raw_key: str) -> Optional[User]:
    key_hash = hash_key(raw_key)
    key = db.query(ApiKey).filter(ApiKey.key_hash == key_hash, ApiKey.revoked == False).first()
    if not key:
        return None
    key.last_used_at = key.last_used_at or None  # could set dt here
    db.add(key)
    db.commit()
    return key.user


def ensure_user(db: Session, email: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    user = User(email=email, plan="FREE", status="active")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def issue_key(db: Session, email: str, label: Optional[str] = None) -> str:
    user = ensure_user(db, email)
    raw = generate_api_key()
    hk = hash_key(raw)
    api_key = ApiKey(user_id=user.id, key_hash=hk, label=label or "default")
    db.add(api_key)
    db.commit()
    return raw  # show once


def revoke_key(db: Session, email: str, key_hash_or_raw: str) -> None:
    hk = key_hash_or_raw if len(key_hash_or_raw) == 64 else hash_key(key_hash_or_raw)
    user = ensure_user(db, email)
    key = db.query(ApiKey).filter(ApiKey.user_id == user.id, ApiKey.key_hash == hk).first()
    if not key:
        raise HTTPException(status_code=404, detail="Key not found")
    key.revoked = True
    db.add(key)
    db.commit()


