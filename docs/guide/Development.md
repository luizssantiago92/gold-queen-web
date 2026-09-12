# Development

Day-to-day workflow for contributors and agents working on Gold Queen Web.

---

## Prerequisites

| Tool | Version |
| --- | --- |
| Node.js | 22 (matches CI) |
| npm | 10+ |

Optional: local [gold-queen-api](https://github.com/luizssantiago92/gold-queen-api) on port 8000.

---

## Environment

Copy `.env.example` → `.env`:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Never commit `.env`. Only `VITE_*` keys belong here — they are public in the bundle.

---

## Scripts

| Command | When to use |
| --- | --- |
| `npm run dev` | Local development (port 5173) |
| `npm run build` | Pre-PR verification; same as CI |
| `npm run typecheck` | Fast TS check without Vite |
| `npm run lint` | oxlint |
| `npm run preview` | Smoke-test `dist/` locally |

---

## Project conventions

| Topic | Rule |
| --- | --- |
| User-facing text | Add to `en.ts` and `pt.ts`; use `t()` |
| Money from API | Keep as string; `toNumber()` at display |
| New API hook | Add to `lib/queries.ts` + `types/api.ts` |
| Modals | Use `components/ui/Modal` with `closeModal` aria-label via i18n |
| Chevrons on cards | Only when the card navigates somewhere |

---

## Pull request checklist

1. `npm run lint && npm run build` pass
2. Manual smoke: login → dashboard → locale toggle → tips → chat
3. **Documentation** (required for significant changes):
   - Update [README.md](../../README.md) if product behavior, stack, or quick start changed
   - Update the relevant `docs/guide/*.md` page
   - Add an entry to [CHANGELOG.md](../CHANGELOG.md) for user-visible releases
4. PR description lists doc files touched

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for the full policy.

### What counts as "significant"

- New screen, route-equivalent flow, or modal
- API contract or env var changes
- i18n default or locale API behavior
- Deploy/CI changes
- Demo mode or intentional limitation changes

Trivial typo or style-only fixes: docs optional.

---

## CI

Workflow: `.github/workflows/ci.yml`

Triggers: push to `main`, pull requests to `main`.

Failure on lint or build blocks merge when branch protection requires CI.

---

## Debugging tips

| Issue | Check |
| --- | --- |
| Blank after login | Network tab → API base URL; token in localStorage |
| CORS | Dev must use port 5173 against production API |
| Stale locale on AI | Queen's Tips key includes locale; reopen modal |
| 401 loop | API token invalid; clear `gold-queen.token` |

---

## Related docs

- [Architecture](Architecture.md)
- [Internationalization](Internationalization.md)
- [Deployment](Deployment.md)

Back to [guide index](README.md)
