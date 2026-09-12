# Contributing to Gold Queen Web

Thank you for improving the frontend. This repo favors **small, focused PRs** with documentation that stays in sync with the code.

## Before you open a PR

1. Branch from `main` (or the agreed integration branch).
2. Run locally:
   ```bash
   npm ci
   npm run lint
   npm run build
   ```
3. Test against a running API (local or `VITE_API_BASE_URL=https://gold-queen-api.onrender.com`).

## Documentation policy

**Significant changes must update docs in the same PR.**

| Change type | Update |
| --- | --- |
| New screen, navigation, or major UX flow | `README.md` + [docs/guide/Architecture.md](docs/guide/Architecture.md) |
| i18n / locale behavior | `README.md` + [docs/guide/Internationalization.md](docs/guide/Internationalization.md) |
| API client, hooks, env vars | `README.md` + [docs/guide/Architecture.md](docs/guide/Architecture.md) and/or [Deployment.md](docs/guide/Deployment.md) |
| Deploy / Vercel / CI | [docs/guide/Deployment.md](docs/guide/Deployment.md) + [docs/CHANGELOG.md](docs/CHANGELOG.md) |
| User-visible release | [docs/CHANGELOG.md](docs/CHANGELOG.md) |

**Significant** means: a reviewer cannot understand the new behavior from the diff alone, or the README would be misleading after merge.

Trivial fixes (typo, one-line style) do not require README changes.

## PR description

Include:

- **What** changed (user-visible or architectural)
- **Why** (link issue or brief context)
- **Test plan** — commands run, manual steps (login, locale toggle, tips, chat)
- **Docs** — list updated doc files, or state "docs N/A (trivial)"

## Code conventions

- Match existing patterns in the file you edit (naming, hooks, Tailwind classes).
- User-facing copy goes through `src/i18n/` — add keys to **both** `en.ts` and `pt.ts`.
- Monetary values from the API stay **strings** until `toNumber()` at render.
- Do not add `VITE_` secrets — only public config belongs in the frontend bundle.

## Commit messages

Use clear, imperative subjects. Conventional prefixes are welcome (`feat:`, `fix:`, `docs:`).
