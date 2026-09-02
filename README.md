# Gold Queen Web

**Gold Queen** (Rainha Dourada) is a mobile-first personal treasury dashboard with a dark medieval fantasy interface. It connects to [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api) for Open Finance aggregation, AI-categorized spending, Queen's Tips, and a conversational financial advisor.

| Live | URL |
| --- | --- |
| Web app | https://gold-queen-web.vercel.app |
| API | https://gold-queen-api.onrender.com |

## Product positioning

Gold Queen is built for users who want **clarity over their money** without leaving a single, beautiful screen:

- **Unified treasury** — consolidated balance, monthly income vs expenses, per-bank share.
- **Spending intelligence** — category breakdown and cumulative month chart with portfolio-friendly labels (subscriptions, bills, credit card, etc.).
- **Trust signals** — golden shield on AI-validated categories (`is_guarded`).
- **The Queen** — structured wealth tips and a chat advisor grounded in real account data.
- **Portfolio demo** — intentional limits (one sandbox bank, informational connect button) keep the recruiter experience controlled while production code paths remain in the API.

Default language is **Portuguese (Brazil)**; English is available in Profile.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + Vite 8 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` in CSS, no config file) |
| Server state | TanStack Query 5 + Axios |
| Charts | Recharts |
| Icons | Lucide React |
| i18n | Custom context (`pt` / `en`) |

## Quick start

```bash
npm install
cp .env.example .env      # VITE_API_BASE_URL=http://127.0.0.1:8000
npm run dev
```

Start [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api) first on port 8000.

**Demo login** (prefilled on the login screen):

- `queen@goldqueen.dev` / `QueenDemo123!`
- `squire@goldqueen.dev` / `SquireDemo123!`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | Typecheck + production bundle → `dist/` |
| `npm run typecheck` | `tsc -b` only |
| `npm run lint` | oxlint |
| `npm run preview` | Serve `dist/` locally |

CI (`.github/workflows/ci.yml`): lint + build on Node 22.

## Configuration

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of gold-queen-api |

Only `VITE_*` variables are embedded in the bundle. Pluggy and Gemini keys stay on the backend.

## Architecture

```
src/
  auth/           JWT session (localStorage, 401 → logout)
  components/
    home/         Dashboard cards, demo banner, transaction feed
    ui/           Card, Modal, Skeleton
  i18n/           Portuguese (default) and English catalogs
  lib/            API client, queries, formatters, palette
  screens/        Login, Home, Profile
  types/          Response models mirroring OpenAPI
```

See [docs/architecture.md](docs/architecture.md) for navigation, data flow, and UI shell details.

### Design tokens (`src/index.css`)

| Token | Value | Use |
| --- | --- | --- |
| `void` | `#000000` | Page background |
| `surface` | `#111113` | Cards |
| `gold` | `#FFD700` | Primary accent |
| `parchment` | `#F5F0E6` | Body text |

### Mobile shell

`MobileShell` frames the app as a phone on desktop (412px) and goes full-bleed on real devices. `SceneBackdrop` rotates five medieval wallpapers every 5 seconds on the home screen.

### Data flow

TanStack Query hooks in `src/lib/queries.ts` fetch dashboard data. Monetary values arrive as **strings** (API `Decimal`); widen to float only at render time via `toNumber()`.

### Demo mode

`ConnectBankButton` opens an informational modal — it does **not** launch Pluggy Connect. Bank data must already exist on the API (see API [demo-operations](https://github.com/luizssantiago92/gold-queen-api/blob/main/docs/demo-operations.md)).

## Documentation

| Document | Contents |
| --- | --- |
| [docs/README.md](docs/README.md) | Documentation index |
| [docs/architecture.md](docs/architecture.md) | UI structure, state, API integration |
| [docs/deployment.md](docs/deployment.md) | Vercel deploy and environment |

API contracts: [gold-queen-api/docs/frontend-integration.md](https://github.com/luizsantiago92/gold-queen-api/blob/main/docs/frontend-integration.md)

## Roadmap (UI placeholders)

Profile screen ships static placeholders for card gallery and investments — no API endpoints yet.

> **Note:** Root `PRD.md` is a historical brief in Portuguese. This README and `docs/` are the authoritative technical reference.
