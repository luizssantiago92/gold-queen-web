<!-- retornatus-meta
{
  "change_id": "C-0003",
  "schema_version": 1
}
-->

# Situation

## Demand

Make sign-in usable during a Render cold start and stop blocking a stored session behind a full-screen spinner.

## Project context

# Project

Retornatus project continuity notes live here.

Agents and humans express intent. Retornatus owns structure.

## Repo signals (inferred)

- stack manifests: `package.json`
- tests: js test script
- ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- architecture: AGENTS.md; src packages: auth, components, i18n, lib, screens, test, types
- code path present: `src`
- Retornatus already initialized

## Known facts

- Demand stated: Make sign-in usable during a Render cold start and stop blocking a stored session behind a full-screen spinner.
- Repo: stack manifests: `package.json`
- Repo: tests: js test script
- Repo: ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- Repo: architecture: AGENTS.md; src packages: auth, components, i18n, lib, screens, test, types
- Repo: code path present: `src`
- Repo: Retornatus already initialized
- Situation narrative provided by agent/human
- Proposed WHAT: Keep the sign-in form interactive while GET /health warms the API, show a non-blocking wake notice, render the dashboard shell with skeletons while GET /v1/auth/me runs in parallel with dashboard queries, and show the slow-server sentence earlier in English and Portuguese.
- DONE criterion: src/screens/LoginScreen.test.tsx proves the sign-in form stays enabled while the wake probe is still quiet, the slow-server sentence appears after two seconds, and a stored token renders the dashboard shell with skeletons while the profile request is in flight, including the redirect when that token is rejected.
- DONE criterion: The cold-start behavior is documented in docs/guide/Architecture.md as a non-blocking notice on the sign-in form.

## Constraints

- (none)

## Assumptions

- (none)

## Ambiguities

- (none)

## Missing decisions

- (none)

## Contract readiness

- Sufficient: **yes**
- Rationale: Demand, WHAT, and DONE are sufficiently clear; repo/kickoff signals incorporated; no material requirements ambiguity detected

## Agent narrative

PR 2 of the approved UX plan. ApiWakeGate currently sets the tree inert and covers every screen after 1.5s, for up to 90s. App.tsx shows a full-screen spinner while a stored token is confirmed with GET /v1/auth/me, and login() waits for that call before leaving the form. The slow-server sentence waits 6s. This change keeps the form editable, starts the health probe when the gate mounts (the sign-in page on a cold visit), and opens the dashboard shell as soon as a token exists.

## Reopened Situation

AuthProvider is a sensitive path, so the contract now includes a review of the session rejection path.
