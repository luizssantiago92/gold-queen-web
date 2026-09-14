<p align="center">
  <strong>GOLD QUEEN</strong><br />
  Royal treasury dashboard with Open Finance and an AI advisor
</p>

<p align="center">
  Mobile-first React SPA · English default · Portuguese optional · Deployed on Vercel
</p>

<p align="center">
  <a href="https://gold-queen-web.vercel.app">Live app</a> ·
  <a href="https://gold-queen-api.onrender.com">API</a> ·
  <a href="docs/guide/Overview.md">Docs</a>
</p>

<p align="center">
  <a href="https://github.com/luizssantiago92/gold-queen-web/actions/workflows/ci.yml"><img src="https://github.com/luizssantiago92/gold-queen-web/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
</p>

<p align="center">
  <a href="#meet-gold-queen">The product</a> ·
  <a href="#1-prepare-your-environment">Prepare</a> ·
  <a href="#2-clone-and-run">Run</a> ·
  <a href="#3-verify-everything-works">Verify</a> ·
  <a href="#4-configure-the-api">Configure API</a> ·
  <a href="#pre-flight-checklist">Checklist</a> ·
  <a href="#commands-reference">Commands</a> ·
  <a href="#explore-the-project">Explore</a> ·
  <a href="#documentation">Documentation</a>
</p>

---

## Meet Gold Queen

**Gold Queen** is a personal treasury dashboard with a dark medieval fantasy UI. This repository is the **frontend only**: it renders the experience and talks to [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api) for authentication, Open Finance aggregates, Queen's Tips, and guardrailed chat.

You get a single phone-shaped screen with consolidated balance, monthly spending, category breakdown, transaction feed, wealth tips, and a conversational advisor — without jumping between bank apps.

| Live | URL |
| --- | --- |
| Web app | https://gold-queen-web.vercel.app |
| API | https://gold-queen-api.onrender.com |

> **The challenge this UI solves:** make complex financial data feel approachable in a portfolio demo — with intentional limits (sandbox bank, informational connect flow) while keeping production API paths ready for real Open Finance.

The app does **not** embed Pluggy or Gemini keys. Secrets stay on the backend; only `VITE_API_BASE_URL` is public in the bundle.

### What you can do here

| Area | What you get |
| --- | --- |
| **Royal treasury** | Balance, income vs expenses, per-bank share, monthly chart, categories, transaction feed with detail modal |
| **Queen's Tips** | Daily AI wealth guidance (`GET /v1/advisor/queen-tips`) — fetched when the modal opens |
| **Advisor chat** | Guardrailed Q&A about your treasury (`POST /v1/chat/query`) with daily quota |
| **Bilingual UX** | English default; Portuguese via toggle; `Accept-Language` + `locale` on AI calls |
| **Trust signals** | Gold shield on guarded categories; demo banner with dismiss and manual slides |

**Go deeper:** [Overview](docs/guide/Overview.md) · [Architecture](docs/guide/Architecture.md) · [Internationalization](docs/guide/Internationalization.md)

---

## 1. Prepare your environment

Set this up once before cloning. You need a running API (local or production) to log in and load data.

| Tool | Requirement | Purpose |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | **22.x** (matches CI) | Run Vite, TypeScript, and build scripts |
| npm | Included with Node.js | Install dependencies from the lockfile |
| [Git](https://git-scm.com/) | Installed | Clone, branch, and open pull requests |
| Browser | Current Chrome, Firefox, or Safari | Use the dashboard and modals |
| API | [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api) on `:8000` **or** production URL | Auth and financial data |

Confirm versions:

```bash
node --version   # expect v22.x.x
npm --version
git --version
```

**Use `npm ci` in this repo** — it installs exact versions from [package-lock.json](package-lock.json).

<details>
<summary><strong>Windows, macOS, or Linux — quick notes</strong></summary>

- **Windows:** Use Command Prompt or PowerShell. If `npm` is blocked by execution policy, try `npm.cmd` or Command Prompt instead of PowerShell.
- **macOS / Linux:** Any terminal is fine. If you use **nvm**, install and select Node 22 before `npm ci`.
- **CORS:** The production API allows `localhost:5173` and `localhost:3000` for dev. Prefer `npm run dev` (port 5173) when pointing at Render — Vite preview on port 4173 is not in the API allowlist.

</details>

---

## 2. Clone and run

```bash
git clone https://github.com/luizssantiago92/gold-queen-web.git
cd gold-queen-web
npm ci
cp .env.example .env
npm run dev
```

Run one command at a time. `npm run dev` keeps running — leave that terminal open.

> **Open [http://localhost:5173](http://localhost:5173).** You should see the login screen with demo credentials prefilled.

### Point at production API (no local backend)

Edit `.env`:

```text
VITE_API_BASE_URL=https://gold-queen-api.onrender.com
```

Restart `npm run dev` after changing `.env`.

### Demo login

| Email | Password |
| --- | --- |
| `queen@goldqueen.dev` | `QueenDemo123!` |

The API free tier on Render may **cold-start** (~60s) after idle time. The login screen explains this; retry once if the first request times out.

**Go deeper:** [Quick start](docs/guide/Quick-start.md)

---

## 3. Verify everything works

Stop the dev server with `Ctrl+C`, then from the project root:

```bash
npm run lint
npm run build
```

Both should finish without errors. CI runs the same checks on every pull request to `main`.

### Smoke test (manual)

1. Sign in and land on the home dashboard with balance data.
2. Confirm greeting shows a separate **Demo** badge (not merged into the title).
3. Open **Profile** → switch to **Portuguese** → return to **Home**.
4. Open **Learn to manage your wealth** (Queen's Tips) — content loads in Portuguese.
5. Tap **Advisor** in the bottom nav → ask an in-scope question (e.g. balance).

Empty dashboard after login usually means the API has no demo seed — see [API demo-operations](https://github.com/luizssantiago92/gold-queen-api/blob/main/docs/demo-operations.md).

---

## 4. Configure the API

| Variable | Local | Production (Vercel) |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000` | `https://gold-queen-api.onrender.com` |

Only `VITE_*` variables are inlined at **build time**. Never put Pluggy or Gemini keys in this repo.

| Concern | Detail |
| --- | --- |
| Auth | JWT in `localStorage`; `401` clears session |
| Locale | `Accept-Language` on every request; explicit `locale` on AI endpoints |
| Timeouts | 90s default (Render cold start); 120s for AI routes |

**Go deeper:** [Deployment](docs/guide/Deployment.md) · [API frontend integration](https://github.com/luizssantiago92/gold-queen-api/blob/main/docs/frontend-integration.md)

---

## Pre-flight checklist

Use this before opening a PR or demoing the app:

- [ ] Node 22, npm, and Git respond in the terminal.
- [ ] `npm ci` completed without errors.
- [ ] `.env` points at a reachable API (local or Render).
- [ ] `npm run dev` opens the login screen at localhost:5173.
- [ ] Demo login succeeds (possibly after one cold-start wait).
- [ ] Dashboard shows balance and transactions.
- [ ] Language toggle works on Login and Profile.
- [ ] Queen's Tips and Advisor chat respond in the active locale.
- [ ] `npm run lint` and `npm run build` pass.

Stuck? See [Quick start → troubleshooting](docs/guide/Quick-start.md#if-something-feels-stuck) and [Development](docs/guide/Development.md).

---

## Commands reference

Run from the repository root (where `package.json` lives).

| Command | What it does |
| --- | --- |
| `npm ci` | Install dependencies from the lockfile (preferred over `npm install`) |
| `npm run dev` | Start Vite dev server at http://localhost:5173 |
| `npm run build` | Typecheck with `tsc` and produce production bundle in `dist/` |
| `npm run typecheck` | Run `tsc -b` only (no Vite bundle) |
| `npm run lint` | Run oxlint on the codebase |
| `npm run preview` | Serve `dist/` locally (default port 4173; mind CORS vs production API) |

CI workflow: [.github/workflows/ci.yml](.github/workflows/ci.yml) — lint + build on Node 22.

---

## Explore the project

| Path | What you find |
| --- | --- |
| [`src/screens/`](src/screens/) | Login, Home, and Profile screens |
| [`src/components/home/`](src/components/home/) | Dashboard cards, demo banner, transaction feed |
| [`src/components/`](src/components/) | Modals, bottom nav, `LanguageToggle`, mobile shell |
| [`src/i18n/`](src/i18n/) | Locale detection, EN/PT catalogs, `readLocale()` |
| [`src/lib/api.ts`](src/lib/api.ts) | Axios client, JWT, `Accept-Language`, retries |
| [`src/lib/queries.ts`](src/lib/queries.ts) | TanStack Query hooks for dashboard and AI |
| [`src/auth/`](src/auth/) | JWT session provider and context |
| [`src/types/api.ts`](src/types/api.ts) | Response types aligned with the API |
| [`docs/guide/`](docs/guide/) | Full documentation index |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | PR checklist and README update policy |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Notable releases |

### Stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + Vite 8 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` in CSS) |
| Server state | TanStack Query 5 + Axios |
| Charts | Recharts |
| Icons | Lucide React |

### Demo mode (intentional limits)

| Feature | Behaviour |
| --- | --- |
| `ConnectBankButton` | Informational modal — does **not** launch Pluggy Connect |
| Demo banner | Rotating copy; manual dots, dismiss, pause on hover |
| Profile placeholders | Card gallery and investments — static "coming soon" |
| Logout | Profile screen only |

---

## Documentation

| I want to… | Read |
| --- | --- |
| Understand the product in plain language | [docs/guide/Overview.md](docs/guide/Overview.md) |
| Run locally in ten minutes | [docs/guide/Quick-start.md](docs/guide/Quick-start.md) |
| See screens, hooks, and data flow | [docs/guide/Architecture.md](docs/guide/Architecture.md) |
| Change languages or API locale | [docs/guide/Internationalization.md](docs/guide/Internationalization.md) |
| Deploy or fix Vercel | [docs/guide/Deployment.md](docs/guide/Deployment.md) |
| Open a pull request | [docs/guide/Development.md](docs/guide/Development.md) · [CONTRIBUTING.md](CONTRIBUTING.md) |

Full index: [docs/guide/README.md](docs/guide/README.md)

---

## Contributing

Pull requests are welcome. For **significant** changes (new screens, API integration, i18n, deploy), update **`README.md` and the relevant `docs/guide/` page in the same PR**.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full checklist.

---

## Related repositories

| Repository | Role |
| --- | --- |
| [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api) | FastAPI backend, Pluggy, Gemini, guardrails |
| [spec-guardrails](https://github.com/luizssantiago92/spec-guardrails) | Optional SDD governance harness |

> **Note:** Root `PRD.md` is a historical product brief in Portuguese. **`README.md` and `docs/guide/` are the authoritative technical reference.**

<p align="right"><a href="#meet-gold-queen">↑ Back to top</a></p>
