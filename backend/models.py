from datetime import datetime, date
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.db import Base


class Plan(str, Enum):
    FREE = "FREE"
    STARTER = "STARTER"
    PRO = "PRO"
    SCALE = "SCALE"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    plan = Column(String, default=Plan.FREE.value, nullable=False)
    status = Column(String, default="inactive", nullable=False)
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    api_keys = relationship("ApiKey", back_populates="user", cascade="all, delete-orphan")


class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    key_hash = Column(String, unique=True, index=True, nullable=False)
    label = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_used_at = Column(DateTime, nullable=True)
    revoked = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="api_keys")


class UsageDaily(Base):
    __tablename__ = "usage_daily"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    date = Column(Date, index=True, nullable=False)
    count = Column(Integer, default=0, nullable=False)
    __table_args__ = (UniqueConstraint('user_id', 'date', name='uq_usage_daily_user_date'),)


class UsageMonthly(Base):
    __tablename__ = "usage_monthly"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    month = Column(String, index=True, nullable=False)  # YYYYMM
    count = Column(Integer, default=0, nullable=False)
    __table_args__ = (UniqueConstraint('user_id', 'month', name='uq_usage_monthly_user_month'),)


