# Gold Queen Web

Mobile-first dashboard for the **Gold Queen** royal treasury: Open Finance bank
aggregation, AI-categorized spending, and a medieval sovereign who advises on
your gold. Dark fantasy interface rendered inside a simulated phone on desktop
and full-bleed on real devices.

Backend counterpart: [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api).

## Stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no config file) |
| Server state | TanStack Query + Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Open Finance | `react-pluggy-connect` (sandbox) |

## Quick start

```bash
npm install
cp .env.example .env      # point VITE_API_BASE_URL at the running API
npm run dev
```

The app expects `gold-queen-api` on `http://127.0.0.1:8000`. Start it first, or
the login screen will report that the kingdom's gates are closed.

Demo credentials are prefilled on the login screen:

- `queen@goldqueen.dev` / `QueenDemo123!`
- `squire@goldqueen.dev` / `SquireDemo123!`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck and produce `dist/` |
| `npm run typecheck` | `tsc -b` only |
| `npm run lint` | oxlint |
| `npm run preview` | Serve the production build |

## Configuration

Only one variable, because every secret stays server-side:

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of gold-queen-api |

Anything prefixed with `VITE_` is inlined into the bundle and therefore public.
`PLUGGY_CLIENT_SECRET` and `GEMINI_API_KEY` belong to the backend `.env` only.

## Architecture

```
src/
  auth/          AuthProvider + context (JWT in localStorage, 401 -> logout)
  components/
    home/        Balance, month chart, categories and transaction feed cards
    ui/          Card, Modal, Skeleton primitives
  lib/           axios client, TanStack Query hooks, formatters, palette
  screens/       Login, Home, Profile
  types/         Response models mirroring the API's OpenAPI schema
```

### Design tokens

Tailwind v4 removed `tailwind.config.js`; the palette lives in the `@theme`
block of `src/index.css` and every entry becomes a utility (`bg-surface`,
`text-gold`, `border-gold-aged`).

| Token | Value | Use |
| --- | --- | --- |
| `void` | `#0D0D0E` | Page background |
| `surface` | `#161618` | Cards |
| `gold` | `#FFD700` | Primary accent |
| `gold-aged` | `#8B6914` | Borders and gradients |
| `mystic` | `#6B21A8` | Secondary accent |

### Mobile shell

`MobileShell` frames the app as a phone on desktop (`412px` wide, `48px`
radius, `8px` bezel) and drops the frame below the `sm` breakpoint. Heights use
`dvh` so mobile browser chrome never clips the floating bottom bar.

### Data flow

Every screen reads from TanStack Query hooks in `src/lib/queries.ts`. A
successful bank sync invalidates all dashboard keys at once, so the balance,
chart, categories, feed and Queen's Tips refresh together.

Monetary values arrive as strings because the API serialises `Decimal`; they
are only widened to floats at the render boundary via `toNumber`.

### Guardrail badge

Transactions carry `is_guarded` from the API, set when the AI category passed
Pydantic validation against a closed vocabulary. The feed renders a golden
`ShieldCheck` next to those, making the guardrail auditable in the UI.

### Rate limit

The chat allows a fixed number of questions per day. On `429` the API already
answers in the Queen's voice, so the frontend renders `detail` verbatim instead
of hardcoding the copy — the persona stays owned by the backend.

## Roadmap

The Profile screen ships the card gallery and investments panel as static
placeholders; the API has no endpoints for them yet.
