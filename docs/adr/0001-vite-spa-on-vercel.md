# ADR 0001: Static Vite SPA on Vercel

- Status: Accepted
- Recorded: 2026-10-07 (the app already runs this way)

## Context

Gold Queen Web is the interface for [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api). The API is a separate repository on Render. This repository ships the browser client.

## Decision

The client is a static Vite SPA (React 19, TypeScript, Tailwind CSS v4) deployed on Vercel. The build command is `npm run build` and the output directory is `dist`. There is no server render and no React Router. Home and Profile are local state in `App.tsx`. `VITE_*` values are inlined at build time. The only public setting is `VITE_API_BASE_URL`. Production on Vercel is `https://gold-queen-api.onrender.com`. The live app is https://gold-queen-web.vercel.app.

## Consequences

A change to `VITE_API_BASE_URL` needs a redeploy before the bundle picks it up. This repository does not sign tokens, store balances, or call Pluggy or Gemini. Those stay in the API. Refresh does not restore a route, because there are no routes; a stored token is what brings the visitor back to the dashboard.

## Alternatives

Serving the UI from the API process would tie a frontend release to the Render service. A Next.js server would add a runtime this repository does not run. React Router was not added; the two screens do not need URLs.
