# Gold Queen Web

[![CI](https://github.com/luizssantiago92/gold-queen-web/actions/workflows/ci.yml/badge.svg)](https://github.com/luizssantiago92/gold-queen-web/actions/workflows/ci.yml)

**Mobile-first personal treasury dashboard with a dark medieval fantasy UI.**

Gold Queen aggregates Open Finance data, visualizes spending, and surfaces AI-guided wealth tips and a guardrailed chat advisor — all in a single phone-shaped experience. The frontend talks to [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api) for auth, dashboard data, Queen's Tips, and chat.

| Live | URL |
| --- | --- |
| Web app | https://gold-queen-web.vercel.app |
| API | https://gold-queen-api.onrender.com |

**Docs:** [Overview](docs/guide/Overview.md) · [Quick start](docs/guide/Quick-start.md) · [Full guide index](docs/guide/README.md)

---

## What it is

Gold Queen Web is a **React SPA** — not a full-stack app. It owns presentation, client state, and locale-aware API calls. Business rules, Pluggy, Gemini, and guardrails live in the API.

The app is optimized for:

- **Portfolio demos** — controlled sandbox data, intentional limits, recruiter-friendly copy
- **Bilingual UX** — English default, Portuguese optional, locale sent to AI endpoints
- **Trust signals** — guarded categories, demo banner with dismiss, no fake actions in the UI

You do not need the backend repo open to understand the frontend — but you need a running API to log in and load data.

---

## Quick start

```bash
git clone https://github.com/luizssantiago92/gold-queen-web.git
cd gold-queen-web
npm install
cp .env.example .env    # VITE_API_BASE_URL=http://127.0.0.1:8000
npm run dev
```

Start [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api) on port **8000** first, or point `.env` at the production API.

**Demo login** (prefilled on the login screen):

| Email | Password |
| --- | --- |
| `queen@goldqueen.dev` | `QueenDemo123!` |

**Go deeper:** [Quick start](docs/guide/Quick-start.md) · [Development](docs/guide/Development.md)

---

## Three pillars

| Pillar | What the user gets | Where it lives |
| --- | --- | --- |
| **Royal treasury** | Balance, income vs expenses, categories, monthly chart, transaction feed | `HomeScreen` + `src/components/home/*` |
| **The Queen (AI)** | Daily wealth tips and conversational advisor grounded in account data | `QueenTipsModal`, `ChatModal`, `/v1/advisor/*`, `/v1/chat/*` |
| **Bilingual UX** | EN default, PT toggle, `Accept-Language` + `locale` on AI calls | `src/i18n/*`, `LanguageToggle`, `lib/api.ts` |

### 1. Royal treasury — one screen, full picture

**Without it:** users jump between bank apps to see balance, spending, and categories.

**With Gold Queen:** a single dashboard card stack — cash flow, per-bank share bars, cumulative month chart, category breakdown, and a tappable transaction feed with detail modal.

| Concern | Mechanism |
| --- | --- |
| Fresh data | TanStack Query with 60s refetch on overview/transactions |
| Money precision | API returns decimals as **strings**; `toNumber()` only at render |
| Bank colors | Deterministic palette from institution name (`lib/palette.ts`) |

**Go deeper:** [Architecture → Dashboard](docs/guide/Architecture.md#home-dashboard)

---

### 2. The Queen — AI with guardrails

**Without guardrails:** a chatbot might invent limits, balances, or product features.

**With Gold Queen:** tips and chat responses can carry `is_guarded`; the UI surfaces a gold shield on validated categories and tips metadata.

| Surface | API | Client hook |
| --- | --- | --- |
| Queen's Tips | `GET /v1/advisor/queen-tips?locale=` | `useQueenTips` (fetch on modal open) |
| Ask the Queen | `POST /v1/chat/query` `{ question, locale }` | `useAskQueen` |
| Rate limits | `429` + `remaining_requests` | `ChatModal` blocks input |

AI routes use a **120s** timeout; the default client timeout is **90s** for Render cold starts.

**Go deeper:** [Architecture → AI integration](docs/guide/Architecture.md#ai-integration)

---

### 3. Bilingual UX — English first, Portuguese when chosen

**Default locale:** `en`. If the user has no saved preference, the browser language `pt*` maps to Portuguese; everything else stays English.

| Layer | Behavior |
| --- | --- |
| UI copy | `src/i18n/en.ts` + `pt.ts` via `useI18n()` |
| Persistence | `localStorage` key `gold-queen.locale` |
| API | `Accept-Language` on every request; explicit `locale` on AI endpoints |
| Formatting | `formatMoney`, `formatDay`, `formatReferenceMonth` respect active locale |

Toggle appears on **Login** and **Profile** (`LanguageToggle`).

**Go deeper:** [Internationalization](docs/guide/Internationalization.md)

---

## How it works

High-level request flow:

```text
Browser (React SPA)
      ↓
TanStack Query hooks (src/lib/queries.ts)
      ↓
Axios client (JWT + Accept-Language)
      ↓
gold-queen-api (FastAPI on Render)
      ↓
Pluggy Sandbox + Gemini (backend only)
```

Navigation is **local state** — no React Router. `App.tsx` gates on auth status, then `tab` (`home` | `profile`).

```text
loading → anonymous → LoginScreen
loading → authenticated → HomeScreen | ProfileScreen
                              ↓
                    BottomNav · QueenTipsModal · ChatModal
```

**Go deeper:** [Architecture](docs/guide/Architecture.md) · [API integration (backend)](https://github.com/luizssantiago92/gold-queen-api/blob/main/docs/frontend-integration.md)

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + Vite 8 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` in CSS) |
| Server state | TanStack Query 5 + Axios |
| Charts | Recharts |
| Icons | Lucide React |
| i18n | Custom context (`en` / `pt`) |

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | Typecheck + production bundle → `dist/` |
| `npm run typecheck` | `tsc -b` only |
| `npm run lint` | oxlint |
| `npm run preview` | Serve `dist/` locally (port 4173) |

CI (`.github/workflows/ci.yml`): lint + build on Node 22 for `main` and pull requests.

---

## Configuration

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of gold-queen-api |

Only `VITE_*` variables are embedded at **build time**. Pluggy and Gemini keys stay on the backend.

Production value on Vercel:

```text
VITE_API_BASE_URL=https://gold-queen-api.onrender.com
```

**Go deeper:** [Deployment](docs/guide/Deployment.md)

---

## Demo mode (intentional limits)

The UI is a **portfolio demo**, not a full Open Finance onboarding flow.

| Feature | Behaviour |
| --- | --- |
| `ConnectBankButton` | Informational modal — does **not** launch Pluggy Connect |
| Demo banner | Rotating product copy; manual dots, dismiss, pause on hover |
| Profile placeholders | Card gallery and investments — static "coming soon" |
| Logout | Profile screen only (not Home header) |

Bank data must already exist on the API. See the API [demo-operations](https://github.com/luizssantiago92/gold-queen-api/blob/main/docs/demo-operations.md) guide.

---

## Project layout

```text
src/
  auth/           JWT session (localStorage, 401 → logout)
  components/
    home/         Dashboard cards, demo banner, transaction feed
    ui/           Card, Modal, Skeleton
  i18n/           Locale detection, catalogs, LanguageToggle
  lib/            API client, queries, formatters, palette
  screens/        Login, Home, Profile
  types/          Response models mirroring OpenAPI
docs/
  guide/          Plain-language documentation (start here)
```

### Design tokens (`src/index.css`)

| Token | Value | Use |
| --- | --- | --- |
| `void` | `#000000` | Page background |
| `surface` | `#111113` | Cards |
| `gold` | `#FFD700` | Primary accent |
| `parchment` | `#F5F0E6` | Body text |

`MobileShell` frames the app as a phone on desktop (~412px) and goes full-bleed on real devices. `SceneBackdrop` rotates medieval wallpapers on the home screen.

---

## Documentation

### Start here

- [Overview](docs/guide/Overview.md) — what the app is, how pieces fit together
- [Quick start](docs/guide/Quick-start.md) — first ten minutes locally
- [Architecture](docs/guide/Architecture.md) — screens, data flow, API hooks
- [Internationalization](docs/guide/Internationalization.md) — locale rules and API headers

### Operate and ship

- [Deployment](docs/guide/Deployment.md) — Vercel, env vars, post-deploy checklist
- [Development](docs/guide/Development.md) — scripts, CI, PR checklist (includes README updates)
- [CHANGELOG](docs/CHANGELOG.md) — notable releases

Full index: [docs/guide/README.md](docs/guide/README.md)

---

## Contributing

Pull requests welcome. For **significant** changes (new screens, API integration, i18n behavior, deploy/config), **update `README.md` and the relevant `docs/guide/` page in the same PR** so the repo stays the source of truth.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full checklist.

---

## Related repositories

| Repo | Role |
| --- | --- |
| [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api) | FastAPI backend, Pluggy, Gemini, guardrails |
| [spec-guardrails](https://github.com/luizssantiago92/spec-guardrails) | SDD governance harness (optional for this repo) |

> **Note:** Root `PRD.md` is a historical product brief in Portuguese. **`README.md` and `docs/guide/` are the authoritative technical reference.**
