# Overview — Gold Queen Web in plain language

This page explains **what the frontend is**, **how users move through it**, and **what depends on the API** — without walking every file. Follow the links at the end of each section for depth.

---

## Definition

**Gold Queen Web** is a **static React SPA** deployed on Vercel. It renders a mobile-first treasury dashboard and talks to **gold-queen-api** for authentication, financial aggregates, and AI features.

It is not:

- a backend or database
- a Pluggy Connect host (demo connect is informational only)
- a source of financial truth (balances and transactions come from the API)

---

## The core user journey

```text
Login (demo credentials prefilled)
      ↓
Home dashboard (balance, spending, categories, transactions)
      ↓
Optional: Queen's Tips modal (wealth guidance)
Optional: Advisor chat (Ask the Queen)
      ↓
Profile (language, banks list, logout)
```

Navigation uses **in-app state** — there is no URL router. Refresh returns to the same deployment; session survives in `localStorage` until logout or `401`.

Full technical flow: [Architecture](Architecture.md)

---

## Three surfaces users care about

| Surface | User goal | Frontend entry |
| --- | --- | --- |
| **Treasury** | See money in one place | `HomeScreen` + dashboard cards |
| **Guidance** | Actionable tips from AI | "Learn to manage your wealth" → `QueenTipsModal` |
| **Advisor** | Ask questions in natural language | Bottom nav **Advisor** → `ChatModal` |

All three respect the active **locale** (`en` | `pt`).

---

## Auth model

| Concern | Behavior |
| --- | --- |
| Token storage | JWT in `localStorage` (`gold-queen.token`) |
| Login | `POST /v1/auth/login` via `AuthProvider` |
| Session restore | Token read on boot; `/v1/auth/me` validates |
| Logout | Clears token; button on **Profile** only |
| Expired / invalid | API `401` → token cleared → login screen |

---

## Data freshness

TanStack Query caches dashboard responses:

| Query | Refetch |
| --- | --- |
| Overview, transactions | Every 60 seconds while mounted |
| Categories, monthly series | On mount / stale policy default |
| Queen's Tips | Once per session when modal opens (`staleTime: Infinity`) |
| Chat | Per message (`useMutation`) |

Render free tier may **cold-start** (~60s). The login screen and API error copy explain this.

---

## Demo vs production intent

The UI is built for **recruiter and visitor demos**:

- One sandbox bank is enough to show the full dashboard
- Connect bank opens an explanation modal, not Pluggy
- A rotating demo banner explains product vision and limits
- Profile shows roadmap placeholders (cards, investments)

Production Open Finance flows remain in the API for future UI work.

---

## What the frontend does not guarantee

- Correct balances if the API seed is missing or stale
- Chat answers outside the guardrailed scope (backend enforces; UI shows errors)
- Offline use (SPA requires network for all data)
- SEO (client-rendered SPA, no SSR)

---

## Where to go next

| I want to… | Read |
| --- | --- |
| Run the app locally | [Quick start](Quick-start.md) |
| Understand files and hooks | [Architecture](Architecture.md) |
| Change languages or API locale | [Internationalization](Internationalization.md) |
| Deploy or fix Vercel | [Deployment](Deployment.md) |
| Open a PR | [Development](Development.md) · [CONTRIBUTING.md](../../CONTRIBUTING.md) |
| Product entry point | [README](../../README.md) |

Back to [guide index](README.md)
