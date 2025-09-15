# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a professional currency conversion platform built as a React SPA with a FastAPI backend. The frontend provides real-time currency/cryptocurrency conversion, charts, alerts, and educational content, while the backend offers subscription-based API services with rate limiting.

**Key Features:**
- Real-time currency & cryptocurrency conversion (150+ fiat, 100+ crypto)
- Interactive charts, price alerts, and travel money guides
- Blog/CMS system with SEO optimization
- Subscription-based API with Stripe integration
- PWA capabilities

## Development Commands

### Frontend (Vite + React + TypeScript)
```bash
# Development
npm run dev                 # Start dev server (port 3000)
npm run preview             # Preview production build (port 4173)

# Building
npm run build               # Full production build with pre/post processing
npm run build:safe          # Safe build with only essential scripts
npm run build:dev           # Development mode build

# Code Quality
npm run lint                # Fix ESLint issues automatically
npm run lint:check          # Check for lint issues without fixing

# Content Management
npm run cms                 # Start Decap CMS server for blog editing
npm run admin               # Start admin interface
npm run admin:dev           # Run dev server + admin concurrently
npm run stackbit:dev        # Visual page editor

# Content Generation & SEO
npm run generate:gap        # Generate gap analysis articles
npm run generate:sitemap    # Generate XML sitemap
npm run seo:audit           # SEO optimization analysis
npm run schema:add          # Add structured data markup
npm run optimize:images     # Optimize blog images
```

### Backend (FastAPI + Python)
```bash
# Setup (from backend/ directory)
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt

# Development
uvicorn main:app --reload --port 8000     # API server
python start_alert_monitor.py            # Background alert monitoring

# Stripe webhook testing
stripe listen --forward-to localhost:8000/billing/webhook
```

### Single Test Execution
```bash
# Frontend testing
npm run test:lighthouse     # Lighthouse performance audit
npm run test:images         # Blog image validation

# Backend testing
# Individual API endpoints via curl (see backend/README.md)
curl "http://localhost:8000/convert?from=USD&to=EUR&amount=100" -H "X-API-Key: YOUR_KEY"
```

## Architecture Overview

### Frontend Architecture
- **Entry Point:** `src/main.tsx` → `src/App.tsx`
- **Routing:** React Router with lazy-loaded pages for code splitting
- **State Management:** TanStack Query for server state, React hooks for local state
- **UI System:** Radix UI + Tailwind CSS with shadcn/ui components
- **Build System:** Vite with optimized chunk splitting and asset optimization

**Key Directories:**
- `src/pages/` - Route components (Index, Charts, Alerts, Travel, Blog, etc.)
- `src/components/` - Reusable UI components
- `src/components/ui/` - Base UI components (shadcn/ui)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions
- `src/assets/` - Images and static assets
- `src/integrations/supabase/` - Database client integration

**Path Aliases:** `@/` maps to `src/` for cleaner imports

### Backend Architecture (FastAPI)
- **Entry Point:** `backend/main.py`
- **Core Services:** Currency conversion, rate limiting, subscription management
- **Database:** SQLAlchemy with PostgreSQL/SQLite support
- **Authentication:** JWT + API key based auth with plan-based rate limiting
- **External APIs:** Exchange rate providers, Stripe billing, email services

**Key Files:**
- `main.py` - FastAPI app with middleware and route setup
- `services.py` - Core business logic (currency conversion, rate fetching)
- `auth.py` - Authentication and authorization
- `billing.py` - Stripe subscription management
- `models.py` - SQLAlchemy database models
- `routers/` - API route handlers (admin, alerts, billing)

### Content & SEO System
- **Blog System:** Markdown files in `src/content/blog/` with frontmatter
- **CMS:** Decap CMS for visual blog editing (`public/admin/`)
- **SEO Scripts:** Automated sitemap, schema markup, and image optimization
- **Build Pipeline:** Pre-build validation, content generation, post-build optimization

## Privacy, Analytics, and Accessibility

- Consent and analytics are initialized in `src/App.tsx` via Helmet:
  - Cookiebot script (id="Cookiebot") enforces consent. Google Consent Mode defaults all tracking to "denied" until user updates preferences.
  - Google Analytics (gtag) is loaded after consent init. Page metadata is set via Helmet.
- Compliance helpers:
  - `<CookieConsent />` renders the banner and provides a settings hook.
  - `<PrivacyComplianceChecker />` runs in development to surface privacy misconfigurations.
- Accessibility & UX:
  - `<AccessibilityNavigationLink />` provides a skip-to-content link.
  - Global `ErrorBoundary` wraps routes; `MobileEnhancement` and `MobilePerformance` optimize mobile UX.
- Performance:
  - `<CoreWebVitalsMonitor />` tracks Core Web Vitals.

## Build Pipeline & Scripts

- Prebuild verification: `scripts/verify-build.js` checks required directories (`src`, `public`, etc.), files (`index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`), and critical deps (`react`, `react-dom`, `vite`). Warns about missing sitemap/blog index; hard-fails on critical issues.
- Content generation:
  - `scripts/generate_blog_index.mjs` builds `public/blog-index.json`.
  - Postbuild `scripts/copy-sitemap.cjs` ensures sitemap is included in `dist/`.
- Dependency guard: `scripts/ensure-dependencies.js` validates presence of `@vitejs/plugin-react` or `@vitejs/plugin-react-swc`.
- Bundling strategy (vite): `vite.config.ts` defines manual chunks: `vendor`, `router`, `ui-core`, `ui-forms`, `charts`, `query`, `utils`, `seo`. Uses `terser` minification and stable asset naming for cacheability.

## Ports & Local URLs

- Frontend dev: http://localhost:3000 (set in `vite.config.ts`).
- Preview build: http://localhost:4173 (`npm run preview`).
- Backend API: http://localhost:8000 (`uvicorn main:app --reload --port 8000`). Swagger at `/docs`.
- CMS (Decap): run `npm run dev` and `npm run cms`, then open http://localhost:3000/admin/.

## Backend Integration Notes

- CORS (backend/main.py): specific origins plus `*`; credentials enabled; all methods/headers allowed.
- Rate limiting:
  - IP-based `RateLimitMiddleware`: 100 req/hour; responses include `X-RateLimit-*` headers.
  - Plan-aware `AuthRateLimitMiddleware`: e.g., `/history` enforces `PLAN_CFG` day limits per plan.
- Endpoints:
  - Core: `GET /convert`, `GET /history`, `GET /forecast`.
  - Routers mounted: `/billing` (Stripe), `/admin`, `/alerts`.
- Webhooks: For local dev, use `stripe listen --forward-to localhost:8000/billing/webhook` (see `backend/README.md`).

## Environment Setup

**Required Node.js version:** ≥18.19.0 (specified in package.json engines)
**Python version:** ≥3.8 (for FastAPI backend)

**Frontend environment variables:**
- Vite automatically loads from `.env` files
- Supabase configuration in `src/integrations/supabase/`

**Backend environment variables:**
- Copy `backend/.env.example` to `backend/.env`
- Required: Stripe keys, database URL, Redis URL, admin token

The project follows modern web development practices with emphasis on performance, SEO, and user experience. The modular architecture supports independent development of frontend and backend components while maintaining strong integration points for the overall platform.