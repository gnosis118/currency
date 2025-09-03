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

    # SendGrid Email
    SENDGRID_API_KEY: str = ""
    FROM_EMAIL: str = "alerts@currencytocurrency.app"
    # SendGrid Event Webhook
    SENDGRID_EVENT_SIGNING_KEY: str = ""  # for Signature Verification
    SENDGRID_EVENT_OAUTH_TOKEN: str = ""   # optional, if using OAuth verification

    # Alert Monitoring
    ALERT_CHECK_INTERVAL: int = 300  # 5 minutes
    ALERT_COOLDOWN_HOURS: int = 1    # Minimum time between notifications for same alert

    # Features
    FORECAST_FEATURE_FLAG: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    return Settings()


