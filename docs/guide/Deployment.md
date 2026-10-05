# Deployment

Gold Queen Web ships as a **static Vite build** on Vercel.

---

## Production URLs

| Service | URL |
| --- | --- |
| Frontend | https://gold-queen-web.vercel.app |
| API | https://gold-queen-api.onrender.com |

---

## Vercel project settings

1. Import the `gold-queen-web` GitHub repository.
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`

### Environment variables

| Name | Production value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://gold-queen-api.onrender.com` |

Preview deployments should use the same value unless you maintain a staging API.

> Variables are baked in at **build time**. Changing them in Vercel requires a **redeploy**.

---

## Security headers

`vercel.json` attaches these response headers to every path. Vercel still adds HSTS on HTTPS.

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | `default-src 'self'`; scripts from `'self'` only; styles from `'self'` and Google Fonts; `style-src-attr 'unsafe-inline'` for React `style` props; fonts from `fonts.gstatic.com`; images from `'self'` (scenes and the queen mark); `connect-src` includes `https://gold-queen-api.onrender.com`; `frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera, microphone, geolocation, and payment disabled |

Inline styles stay allowed because bank colors, the home slideshow, and charts set element `style` attributes. Scripts do not: there is no `'unsafe-inline'` or `'unsafe-eval'` in `script-src`. That is the control for the JWT in `localStorage`.

---

## CORS

The API must allow the Vercel origin. Production defaults in the API:

- `CORS_ORIGINS` includes the production Vercel URL
- `CORS_ORIGIN_REGEX` matches `https://gold-queen-web-*.vercel.app` preview URLs

See [gold-queen-api/docs/deployment.md](https://github.com/luizssantiago92/gold-queen-api/blob/main/docs/deployment.md).

---

## CI

GitHub Actions (`.github/workflows/ci.yml`) on `main` and PRs:

- `npm ci`
- `npm run lint`
- `npm run build`
- `npm test`
- `npm audit --audit-level=high`

Actions are pinned to a full commit SHA. The CI token is read-only (`permissions: contents: read`) and checkout does not persist credentials. [`.github/workflows/codeql.yml`](../../.github/workflows/codeql.yml) analyzes JavaScript/TypeScript and GitHub Actions. Dependabot opens one weekly pull request per ecosystem for grouped minor and patch updates (npm and GitHub Actions). Node 22 comes from [`.nvmrc`](../../.nvmrc).

Vercel typically deploys preview URLs per PR when the GitHub integration is connected.

---

## Post-deploy checklist

1. Open https://gold-queen-web.vercel.app and log in with demo credentials.
2. If the API was asleep, the wake screen can stay up for about a minute.
3. Confirm dashboard shows balance and transactions (requires API demo seed).
4. Switch language in Profile — verify copy and number formatting.
5. Open Queen's Tips and Advisor chat in both locales.

---

## Local production preview

```bash
VITE_API_BASE_URL=https://gold-queen-api.onrender.com npm run build
npm run preview
```

Serves `dist/` on port **4173** by default. For API calls against Render, prefer `npm run dev` on port **5173** (CORS allowlist).

---

## Verifying the bundled API URL

After deploy, confirm the production JS references the correct host:

```bash
curl -s https://gold-queen-web.vercel.app | grep -o 'src="[^"]*\.js"'
# then grep that entry script for gold-queen-api.onrender.com
```

`index.html` lists the entry script only. Chat, Queen's Tips, transaction detail, and the spending chart are extra chunks fetched when those views open.

Back to [guide index](README.md)
