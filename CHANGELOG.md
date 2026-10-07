# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- A reporting page (`SECURITY.md`) and decision records under `docs/adr/` for the running client.
- Retornatus governance for pull requests (`retornatus-gates`), with the first Change under `.retornatus/changes/C-0001`.

### Changed

- Connect, Sync, and Remove show a spinner while they are pending. Queen's Tips shows three skeletons and a retry control during the advisor request. Profile plan, bank count, card art, and investments open a short not-in-this-demo sheet. Demo read-only and closed sign-up copy follow the active locale, and raw API error text stays off the screen.
- The home transaction list loads the next page while the header total is larger than the rows on screen. Those pages stay available to the figure detail sheet. A home card that fails to load stays visible with Try again.
- Dashboard figures open a detail sheet. Income, spending, balance, a bank, a category, and a chart day show the matching transactions or the bank breakdown from data already on screen. A bank row shows its last sync time.
- The Queen banner is a speech bubble aimed at her portrait. One short line stays visible; a tap reveals the rest. Pagination dots and auto-advance are gone.
- Sign-in stays on screen while the free server wakes. The health probe starts with the page and the notice does not cover the form. A stored session opens the dashboard with skeletons while the profile loads. A slow sign-in explains itself after 2 seconds, in English and Portuguese.
- Code-split chat, Queen's Tips, transaction detail, and the monthly spending chart so the first JavaScript chunk stays under Vite's 500 kB warning.
- Type-check Vitest files in `npm run build` via `tsconfig.test.json`.
- CI runs `npm run test:coverage` (`@vitest/coverage-v8`) and enforces modest thresholds.
- Drop unused `parseApiDate` and `TranslationKey`, and stop exporting helpers that nothing outside their module imports.

### Fixed

- Portuguese (pt-BR) UI copy: proper diacritics, crase before Rainha, and agreement (`Mestra da Moeda`, `limites propositais`)
- oxlint warnings: component files no longer export hooks or scene constants, and chat no longer resets its greeting inside an effect.

## [1.0.0] - 2026-10-03

### Added

- React dashboard for the Gold Queen API: login, consolidated balance, monthly spending, categories, transaction detail, Queen's Tips, and guardrailed chat.
- Boot-time `GET /health` wake screen for the Render free-tier cold start. A reply under 1.5s skips the screen. Otherwise a progress bar covers the shell until the probe succeeds or 90s pass.
- English and Portuguese UI. English is the default. Portuguese follows the browser language or the language toggle. API calls send `Accept-Language`, and Queen's Tips and chat also send `locale`.
- Read-only demo copy for a closed registration and for `demo_read_only` on connect, sync, and unlink. The login form prefills `queen@goldqueen.dev`.
- Open Graph and Twitter cards, with `public/og-image.webp`.
- Vitest coverage of auth, the API client, the wake gate, security headers, and the main screens. CI runs oxlint, the TypeScript build, Vitest, and `npm audit --audit-level=high`.
- CodeQL for JavaScript/TypeScript and GitHub Actions. Dependabot groups weekly minor and patch updates for npm and for actions. Node 22 is pinned in `.nvmrc` and `package.json` `engines`.
- Content-Security-Policy and related response headers in `vercel.json`. `script-src` is `'self'`.

### Security

- Third-party actions are pinned to commit SHAs. Workflow tokens are `contents: read`, except CodeQL, which also writes security events.
- Pluggy and Gemini secrets are not part of this bundle. The only public setting is `VITE_API_BASE_URL`.

[Unreleased]: https://github.com/luizssantiago92/gold-queen-web/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/luizssantiago92/gold-queen-web/releases/tag/v1.0.0
