# Currency to Currency API (FastAPI)

Foundation currency conversion API with Stripe subscriptions, API keys, and plan-based rate limiting.

## Quick Start (Local Dev)

```bash
# 1) Create venv
python -m venv .venv
# Windows PowerShell
. .venv\Scripts\Activate.ps1
# macOS/Linux
# source .venv/bin/activate

# 2) Install deps
pip install -r requirements.txt

# 3) Configure env
# Create an .env file in backend/ with the keys shown below

# 4) DB migration (SQLite)
# (migrations will be added later)  
# alembic upgrade head

# 5) Run API
uvicorn backend.main:app --reload --port 8000

# 6) Stripe CLI (dev webhooks)
stripe login
stripe listen --forward-to localhost:8000/billing/webhook
# copy whsec_... into .env as STRIPE_WEBHOOK_SECRET
```

## Environment (.env)

- STRIPE_SECRET_KEY — Stripe secret (test/live)
- STRIPE_WEBHOOK_SECRET — webhook signing secret (from CLI or Dashboard)
- STARTER_PRICE_ID — Stripe Price ID for Starter plan
- PRO_PRICE_ID — Stripe Price ID for Pro plan
- SCALE_PRICE_ID — Stripe Price ID for Scale plan
- DATABASE_URL — e.g., sqlite:///./dev.db
- REDIS_URL — e.g., redis://localhost:6379/0
- ADMIN_TOKEN — static admin token for operator routes
- FORECAST_FEATURE_FLAG — enable/disable forecast features (bool)

## cURL Examples

- Create Checkout Session
```bash
curl -X POST http://localhost:8000/billing/checkout \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","plan":"PRO"}'
```

- Admin: Issue API Key
```bash
curl -X POST http://localhost:8000/admin/keys/issue \
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","label":"default"}'
```

- Call /convert with API key
```bash
curl "http://localhost:8000/convert?from=USD&to=EUR&amount=100" \
  -H "X-API-Key: YOUR_API_KEY"
```

- Webhook (dev via Stripe CLI)
```bash
stripe listen --forward-to localhost:8000/billing/webhook
# complete a test checkout; webhook will sync plan and create a key if needed
```

## Notes

- Replace mock FX rates in `services.py` with a real provider (cache in Redis).
- Forecast is a stub; plug Prophet/scikit-learn later.
- Swap SQLite to Postgres by changing `DATABASE_URL` and running migrations.
