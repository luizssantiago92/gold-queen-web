# Security policy

## Supported versions

Security fixes go to the default branch. The package version in `package.json` is `1.0.0`. The release tag is `v1.0.0`.

| Version | Supported |
| --- | --- |
| 1.0.x on `main` (the `v1.0.0` tag and later commits that keep version `1.0.0`) | Yes |
| Anything older than `v1.0.0` | No |

## Reporting a vulnerability

Please report a vulnerability in this repository in private. Do not open a public GitHub issue, and do not include a live session token in the report.

Use GitHub private vulnerability reporting:

[https://github.com/luizssantiago92/gold-queen-web/security/advisories/new](https://github.com/luizssantiago92/gold-queen-web/security/advisories/new)

That opens a draft security advisory for the repository owner. Include the affected version or commit, the page or file, and a short reproduction if you have one. Please allow time for a fix before any public write-up.

If that page says private reporting is turned off, email [luizssantiago92@gmail.com](mailto:luizssantiago92@gmail.com) with the same details. Use the email only in that case.

This policy covers `gold-queen-web`. Passwords, the JWT signing secret, Pluggy, Gemini, and the database live in [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api/blob/main/SECURITY.md).

## Controls in this codebase

These are the controls this repository actually ships. The decision records are in [docs/adr/](docs/adr/README.md). Deployment detail is in [docs/guide/Deployment.md](docs/guide/Deployment.md).

- **Session.** After login the access token is stored in `localStorage` under `gold-queen.token` and sent as `Authorization: Bearer`. A `401` clears it and fires `gold-queen:unauthorized`. Logout clears it as well. There is no httpOnly cookie. Any script this origin runs can read the token. The production `script-src 'self'` policy is what keeps other scripts off the page.
- **Response headers.** [`vercel.json`](vercel.json) applies them on the Vercel deployment. `npm run dev` does not. The policy is `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; style-src-attr 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self' https://gold-queen-api.onrender.com https://fonts.googleapis.com https://fonts.gstatic.com; upgrade-insecure-requests`. Also `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy` with camera, microphone, geolocation, and payment disabled. `script-src` has no `'unsafe-inline'` and no `'unsafe-eval'`. `style-src-attr 'unsafe-inline'` exists so React `style` props (bank colors, the home slideshow, charts) can render. Hashed files under `/assets/` also match `/(.*)` and add `Cache-Control: public, max-age=31536000, immutable`. This file does not set `Strict-Transport-Security`; Vercel adds HSTS on HTTPS.
- **Public config.** The only `VITE_` setting in the bundle is `VITE_API_BASE_URL` (default `http://127.0.0.1:8000`, production `https://gold-queen-api.onrender.com`). It is inlined at build time. Do not put Pluggy or Gemini keys in this repo.
- **Demo.** The login form prefills `queen@goldqueen.dev` / `QueenDemo123!` on purpose; the same pair is in the README. Registration is closed (`registration_disabled`). Connect, sync, and unlink return `403` / `demo_read_only`. `errorMessage` in `src/lib/api.ts` maps `registration_disabled`, `demo_read_only`, and `connection_limit_reached` to the active locale catalog. Any other API `detail` stays off the screen.
- **Pipeline.** GitHub Actions on Node 22 runs oxlint, `npm run build`, `npm run test:coverage`, and `npm audit --audit-level=high`. The CI token is `contents: read` and checkout does not persist credentials. CodeQL analyzes JavaScript/TypeScript and GitHub Actions; the analyze job also has `actions: read` and `security-events: write`. Dependabot opens a weekly grouped minor-and-patch pull request for npm and another for GitHub Actions. `src/test/securityHeaders.test.ts` asserts the header values in `vercel.json`. Retornatus gates on pull requests use `contents: read` and `pull-requests: write`. That workflow does not push, merge, or deploy.
