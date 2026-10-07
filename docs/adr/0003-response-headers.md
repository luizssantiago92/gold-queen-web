# ADR 0003: Response headers on the Vercel deployment

- Status: Accepted
- Recorded: 2026-10-07 (the deployment already runs this way)

## Context

The session token is readable by any script on the origin ([ADR 0002](0002-jwt-in-local-storage.md)). The production host is Vercel. The browser also loads Google Fonts and calls the API on Render.

## Decision

[`vercel.json`](../../vercel.json) attaches headers to `/(.*)`:

- `Content-Security-Policy`: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; style-src-attr 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self' https://gold-queen-api.onrender.com https://fonts.googleapis.com https://fonts.gstatic.com; upgrade-insecure-requests`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`

`/assets/(.*)` adds `Cache-Control: public, max-age=31536000, immutable` and does not repeat the policy. Those paths still match `/(.*)`. `src/test/securityHeaders.test.ts` asserts these values. `vercel.json` does not set `Strict-Transport-Security`. Vercel adds HSTS on HTTPS.

## Consequences

These headers apply to the Vercel deployment. `npm run dev` does not send them. `script-src` has no `'unsafe-inline'` and no `'unsafe-eval'`. `style-src-attr 'unsafe-inline'` stays because bank colors, the home slideshow, and charts set element `style` attributes. `connect-src` allows the production API origin. A bundle whose `VITE_API_BASE_URL` points somewhere else is blocked by the browser on Vercel. A different font or image host is blocked the same way.

## Alternatives

`'unsafe-inline'` on `script-src` would let injected markup read `localStorage`. Omitting `style-src-attr` would blank the inline styles React already emits. Putting HSTS only in `vercel.json` would duplicate the header Vercel already sends.
