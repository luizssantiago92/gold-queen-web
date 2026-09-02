# Deployment (Vercel)

## Production URLs

| Service | URL |
| --- | --- |
| Frontend | https://gold-queen-web.vercel.app |
| API | https://gold-queen-api.onrender.com |

## Vercel project settings

1. Import the `gold-queen-web` GitHub repository.
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`

### Environment variables

| Name | Production value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://gold-queen-api.onrender.com` |

Preview deployments inherit the same variable or use a staging API URL if you maintain one.

## CORS

The API must allow the Vercel origin. Production defaults in the API:

- `CORS_ORIGINS` includes the production Vercel URL
- `CORS_ORIGIN_REGEX` matches `https://gold-queen-web-*.vercel.app` preview URLs

See [gold-queen-api/docs/deployment.md](https://github.com/luizsantiago92/gold-queen-api/blob/main/docs/deployment.md).

## Post-deploy checklist

1. Open https://gold-queen-web.vercel.app and log in with demo credentials.
2. If the API was hibernating, wait up to ~60s on first load.
3. Confirm dashboard shows balance and transactions (requires API demo seed — see API demo-operations guide).
4. Switch language in Profile and verify copy + number formatting.

## Local production preview

```bash
npm run build
npm run preview
```

Serves `dist/` on port 4173 by default.
