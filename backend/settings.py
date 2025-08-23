from pydantic import BaseSettings, AnyUrl
from functools import lru_cache


class Settings(BaseSettings):
    # Core
    DATABASE_URL: str = "sqlite:///./dev.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    ADMIN_TOKEN: str = "dev_admin_token_change_me"

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STARTER_PRICE_ID: str = ""
    PRO_PRICE_ID: str = ""
    SCALE_PRICE_ID: str = ""

    # Features
    FORECAST_FEATURE_FLAG: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    return Settings()


