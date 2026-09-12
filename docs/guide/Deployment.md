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

Vercel typically deploys preview URLs per PR when the GitHub integration is connected.

---

## Post-deploy checklist

1. Open https://gold-queen-web.vercel.app and log in with demo credentials.
2. If the API was hibernating, wait up to ~60s on first load.
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
# then grep the bundle for gold-queen-api.onrender.com
```

Back to [guide index](README.md)
