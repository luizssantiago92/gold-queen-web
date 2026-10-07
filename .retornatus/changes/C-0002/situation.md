<!-- retornatus-meta
{
  "change_id": "C-0002",
  "schema_version": 1
}
-->

# Situation

## Demand

Record the UX audit and the numbered polish plan so later PRs can be reviewed one at a time. Do not change the UI in this change.

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

- Demand stated: Record the UX audit and the numbered polish plan so later PRs can be reviewed one at a time. Do not change the UI in this change.
- Repo: stack manifests: `package.json`
- Repo: tests: js test script
- Repo: ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- Repo: architecture: AGENTS.md; src packages: auth, components, i18n, lib, screens, test, types
- Repo: code path present: `src`
- Repo: Retornatus already initialized
- Situation narrative provided by agent/human
- Proposed WHAT: Add a proposal document under docs/ that records the live-app audit, file pointers, and the ordered PR plan. Retornatus adoption stays as merged PR 19; this change does not reinstall it and does not redesign the UI.
- DONE criterion: docs/plans/ux-polish.md exists, is linked from docs/README.md as a proposal rather than the current guide, and names PR 1 as the already-merged Retornatus adoption.
- DONE criterion: No files under src/ change.

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

Retornatus 1.9.1 is already on main via PR 19 (C-0001). Release 1.9.1 has no Node preset; the web repo uses generic required checks (npm run lint, npm run build, npm run test:coverage) and a retornatus-gates workflow adapted from gold-queen-api. This change only records the audit and the next PR sequence. UI code stays untouched.
