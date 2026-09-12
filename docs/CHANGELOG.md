# Changelog

All notable changes to **Gold Queen Web** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versions align with git tags when tagged; otherwise use `Unreleased` on `main`.

---

## Unreleased

### Added

- English-first i18n with `readLocale()` (`en` default, browser `pt` detection)
- Reusable `LanguageToggle` on Login and Profile
- `Accept-Language` header on all API requests
- Explicit `locale` on Queen's Tips and chat endpoints
- Project documentation under `docs/guide/` (spec-guardrails-style index)
- `CONTRIBUTING.md` with README update policy for significant PRs

### Changed

- README rewritten to match structured product documentation pattern
- Greeting shows separate **Demo** badge (not "visitor demo" in H1)
- Bottom nav **Advisor** button (replaces search-box style)
- Auth labels: Email, Password, Sign in (PT: E-mail, Senha, Entrar)
- Logout moved to Profile only
- Demo banner: manual dots, dismiss, pause on hover
- Connect bank CTA shown early when no banks linked
- Loading state with translated copy and `aria-busy`
- Removed chevrons from non-navigating cards and inactive "Rate the realm" button
- Modal and transaction feed aria-labels use i18n keys

### Documentation

- Migrated architecture and deployment content into `docs/guide/`
- Added Overview, Quick start, Internationalization, Development guides
