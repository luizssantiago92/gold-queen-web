# Quick start

Get from zero to a logged-in dashboard in about ten minutes.

## 1. Clone and install

Node 22 (see `.nvmrc` and `package.json` `engines`).

```bash
git clone https://github.com/luizssantiago92/gold-queen-web.git
cd gold-queen-web
npm ci
cp .env.example .env
```

Default `.env`:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

To skip a local API, point at production:

```text
VITE_API_BASE_URL=https://gold-queen-api.onrender.com
```

> **CORS:** the production API allows `http://localhost:5173`. It rejects `http://127.0.0.1:5173`. Vite preview on port **4173** is not in the allowlist — use `npm run dev` when testing against Render.

## 2. Start the API (local path)

In [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api), follow its README to run on port **8000**.

If you use the production URL in `.env`, skip this step.

## 3. Run the dev server

```bash
npm run dev
```

Open http://localhost:5173

## 4. Log in

Demo credentials are prefilled:

| Field | Value |
| --- | --- |
| Email | `queen@goldqueen.dev` |
| Password | `QueenDemo123!` |

Click **Sign in**. If the API was asleep, the wake screen can stay up for about a minute before the login form is usable. The form itself also waits through a slow first login.

## 5. Explore the dashboard

You should see:

- Greeting + **Demo** badge (not merged into one long title)
- Balance and per-bank breakdown (if API seed has Pluggy Sandbox data)
- Monthly spending chart and categories
- Transaction list — tap a row for details

## 6. Try language and AI

1. Open **Profile** → switch to **Portuguese**
2. Return to **Home** → open **Learn to manage your wealth** (Queen's Tips)
3. Tap **Advisor** in the bottom nav → ask an in-scope question (e.g. balance)

Responses should match the selected locale.

## What "good" looks like after ten minutes

- Dev server runs without TypeScript errors
- Login succeeds (possibly after one cold-start wait)
- Dashboard shows numeric data, not empty skeletons forever
- Locale toggle changes visible copy
- Queen's Tips and chat return text (not immediate network errors)

## Everyday commands

```bash
npm test              # vitest
npm run test:coverage # vitest + v8 thresholds (CI)
npm run lint          # oxlint
npm run typecheck     # tsc only, including test files
npm run build         # production bundle
npm run preview       # serve dist/ (remember CORS note above)
```

## If something feels stuck

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Network error on login | API down or cold start | Wait and retry; check `VITE_API_BASE_URL` |
| CORS error on preview | Port 4173 not allowed | Use `npm run dev` (5173) |
| Empty dashboard | API has no demo seed | See API demo-operations guide |
| Chat 429 | Daily quota exhausted | Wait or use another demo day |

## Next

- **Full picture** → [Overview](Overview.md)
- **File map and hooks** → [Architecture](Architecture.md)
- **Locale details** → [Internationalization](Internationalization.md)
- **Ship to Vercel** → [Deployment](Deployment.md)

Back to [guide index](README.md)
