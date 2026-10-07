# UX polish plan

Proposal only. This is not the current architecture guide. Behavior stays as described in [../guide/Architecture.md](../guide/Architecture.md) until a later pull request changes it.

Measured against production on 2026-10-07 (UTC): https://gold-queen-web.vercel.app and https://gold-queen-api.onrender.com. The API was already awake for the browser pass.

## PR 1 — Retornatus (already merged)

[PR 19](https://github.com/luizssantiago92/gold-queen-web/pull/19) adopted Retornatus 1.9.1 as Change C-0001. CI on that pull request was green (`verify`, `retornatus-gates`, CodeQL).

Release 1.9.1 has no Node preset (python, python-platform, fastapi, django, rag, worker). This repo uses the generic init. Required checks match CI: `npm run lint`, `npm run build`, `npm run test:coverage`. `.github/workflows/retornatus.yml` follows gold-queen-api: action pin `a4b3e88c779afe3933b27b1e3610952d6e41bcb1`, `contents: read`, `pull-requests: write`, `persist-credentials: false`. Dependabot omission uses the 1.9.1 warn-mode workaround, adapted to `package.json`, `package-lock.json`, and Actions pin bumps. Native `[governance.omission.bot_exemption]` is not in this release.

Do not reinstall.

## What the product does today

| Surface | File | Behavior |
| --- | --- | --- |
| Wake overlay | `src/components/ApiWakeGate.tsx`, `src/main.tsx`, `src/lib/wakeApi.ts` | `GET /health` before the shell is trusted. Under 1.5s the overlay never paints. After that the shell is `inert` until success or 90s. |
| Auth boot | `src/auth/AuthProvider.tsx`, `src/App.tsx` | A stored token paints a full-screen spinner until `GET /v1/auth/me`. Login is `POST /v1/auth/login`, then `/v1/auth/me`, then the dashboard. |
| Login wait | `src/screens/LoginScreen.tsx`, `src/lib/api.ts` | Submit shows a spinner. The slow-server sentence appears at 6s. Axios timeout is 90s, and login may retry twice. |
| Queen banner | `src/components/home/DemoInfoBanner.tsx`, `src/components/home/HomeHeader.tsx` | Rounded card beside `RoyalCrown`. Five strings auto-advance every 5s (`src/lib/slideshow.ts`). Six-pixel pagination dots. Dismiss writes `localStorage`. Hover or focus pauses the timer. No arrow. |
| Dashboard | `src/screens/HomeScreen.tsx` | Overview, categories, monthly series, and transactions start together. Cards skeleton while loading. |
| Detail | `src/components/home/TransactionFeed.tsx`, `src/components/TransactionDetailModal.tsx` | Only a transaction row opens a sheet. Page size is 20. |
| Static figures | `CashFlowRow.tsx`, `BalanceCard.tsx`, `CategoriesCard.tsx`, `MonthChartCard.tsx` | Not buttons. Chart tooltip is hover. Category and bank bars use a `title` attribute. |
| Profile placeholders | `src/screens/ProfileScreen.tsx` | Plan, bank count, card art, and investments do not open anything. Sync and Remove call the API. |
| Connect | `src/components/ConnectBankButton.tsx` | Disables with no spinner, then opens the demo modal. |
| Queen's Tips | `src/components/QueenTipsModal.tsx` | Spinner until `GET /v1/advisor/queen-tips` (120s budget). |
| Errors that vanish | the four home cards and the feed | `isLoading` false and no `data` returns `null`. No retry. |

`src/components/ui/Card.tsx` already has `showChevron`. Nothing passes it. The architecture guide says cards do not navigate today.

## Findings

1. **Login wait is the API, then a waterfall in front of it.** Warm `GET /health` was 0.12–0.23s, so the wake screen correctly stayed hidden. The first `POST /v1/auth/login` after idle was 12.0s; the next was 2.4s. A browser sign-in on the warm API took about 3s, with no slow-server sentence (that copy waits 6s). `GET /v1/auth/me` was 0.48s and only starts after the token. Dashboard calls are parallel: overview 2.4s, categories / series / transactions about 0.8s each. Skeletons already cover those cards. The full-screen spinner is `App.tsx` when `status === 'loading'`, and the login button spinner is `LoginScreen`. A cold Render boot still covers every screen, including the form, for up to 90s (`ApiWakeGate`).
2. **The Queen banner is a carousel, not her voice.** `DemoInfoBanner` swaps paragraphs and draws pagination dots. The tail toward the portrait is missing. Auto-advance pauses while the control is hovered or focused, so a click-through can look static. Five product paragraphs sit in a 11px line. Nielsen Norman Group treats a series of instructional paragraphs as a push overlay: short, one idea, easy to skip ([instructional overlays](https://www.nngroup.com/articles/mobile-instructional-overlay/), [onboarding vs contextual help](https://www.nngroup.com/articles/onboarding-tutorials/)). Coach marks fit a one-time gesture hint. Ongoing copy from the Queen fits a speech bubble: one sentence, an arrow to her icon, tap for the rest.
3. **Explorable data stops at transactions.** Income, spending, balance, the bank row, and category rows do not open. The live feed says 34 transactions and renders 20 (`useTransactions(1, 20)` in `HomeScreen.tsx`). There is no next page. Category payloads already include `transaction_count` (`src/types/api.ts`) and the UI ignores it. `BalanceCard` always says "Updated just now"; the live connection `last_synced_at` was `2026-08-28`.
4. **Failed loads and demo writes look frozen.** A failed overview removes the card instead of offering retry. Connect disables the button and does not show a spinner. Profile Sync/Remove do the same, and the demo 403 is hardcoded Portuguese in `src/lib/demoAccount.ts` (`DEMO_READ_ONLY_MESSAGE`), including on the English UI. Profile cards and the investments empty state look like surfaces and do nothing. Queen's Tips holds a single spinner for the whole AI call (about 5s in the browser pass). The chart tooltip works on desktop hover; it is not a tap target.

Fintech dashboards that stay calm use three layers — summary, breakdown, record — with one drill-in pattern ([WANDR](https://www.wandr.studio/blog/fintech-dashboard-design), [Kinetico](https://www.kinetico.agency/blog/fintech-dashboards)). Tooltips are for extra explanation, not for the only copy of a figure ([NN/g tooltips](https://www.nngroup.com/articles/tooltip-guidelines/)). A splash should not postpone the first useful screen; skeletons belong on the region that is still loading.

## Later pull requests

Implement one at a time, after review. Each gets its own Change. None of these are in this branch.

### PR 2 — Let the login form stay usable

Highest owner pain. Medium risk because the wake gate currently makes the whole tree `inert`.

- Paint login immediately. Keep probing `/health` in the background. Block submit, with inline status, when the probe has not succeeded. Do not cover the form after 1.5s.
- Replace the full-screen `status === 'loading'` spinner with the shell that is about to appear.
- After `POST /v1/auth/login`, store the token and render the shell. Load `/v1/auth/me` in parallel with the dashboard queries.
- Show the slow-server sentence before 6s. The 12s login is server time; this PR does not make bcrypt or the database faster.

Files: `src/main.tsx`, `src/components/ApiWakeGate.tsx`, `src/lib/wakeApi.ts`, `src/App.tsx`, `src/auth/AuthProvider.tsx`, `src/screens/LoginScreen.tsx`.

### PR 3 — Speech bubble instead of the carousel

Visual, contained.

- One short line in the Queen's voice, with an arrow aimed at the portrait in `HomeHeader`.
- Tap opens the longer copy (popover or the existing sheet). Remove the dots and the auto-advance. Keep dismiss.
- Stop sharing `SLIDE_INTERVAL_MS` with the wallpaper.

Files: `src/components/home/DemoInfoBanner.tsx`, `src/components/home/HomeHeader.tsx`, `src/lib/slideshow.ts`, `src/i18n/en.ts`, `src/i18n/pt.ts`.

### PR 4 — Drill-in for figures already on screen

Same sheet pattern as `TransactionDetailModal`. No new API routes. Use overview, categories, series, and the transactions already fetched. Show a real "updated" time from `last_synced_at` instead of "Updated just now".

Files: `src/components/home/CashFlowRow.tsx`, `BalanceCard.tsx`, `CategoriesCard.tsx`, `MonthChartCard.tsx`, `src/components/ui/Modal.tsx`, `src/components/ui/Card.tsx`.

### PR 5 — Finish the transaction list and failed cards

The header prints `page.total` (34 in production) while the list stops at 20. Add a next page. When a home query errors, keep the card and offer retry instead of returning `null`.

Files: `src/components/home/TransactionFeed.tsx`, `src/screens/HomeScreen.tsx`, `src/lib/queries.ts`, and the cards in PR 4 if those null returns are still there.

### PR 6 — Pending controls and placeholders

- Spinner (or inline progress) on Connect, Sync, and Remove while the mutation is pending.
- Locale-aware demo read-only and signup-closed copy (`src/lib/demoAccount.ts`).
- Profile plan, bank count, card art, and investments open a short "not in this demo" sheet, using the same modal. They should not look clickable and then ignore the click.
- Queen's Tips: three scroll skeletons, and a way to retry before the 120s timeout feels endless.
- Chart: a tap opens the same day detail as PR 4, not only a hover tooltip.

Files: `src/components/ConnectBankButton.tsx`, `src/screens/ProfileScreen.tsx`, `src/lib/demoAccount.ts`, `src/components/QueenTipsModal.tsx`, `src/components/home/MonthChartCard.tsx`.
