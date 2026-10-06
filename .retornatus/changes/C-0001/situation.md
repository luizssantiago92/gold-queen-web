<!-- retornatus-meta
{
  "change_id": "C-0001",
  "schema_version": 1
}
-->

# Situation

## Demand

Adopt Retornatus 1.9.1 as the governance harness for gold-queen-web, matching gold-queen-api where the stack allows.

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

- Demand stated: Adopt Retornatus 1.9.1 as the governance harness for gold-queen-web, matching gold-queen-api where the stack allows.
- Repo: stack manifests: `package.json`
- Repo: tests: js test script
- Repo: ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- Repo: architecture: AGENTS.md; src packages: auth, components, i18n, lib, screens, test, types
- Repo: code path present: `src`
- Repo: Retornatus already initialized
- Situation narrative provided by agent/human
- Proposed WHAT: Initialize Retornatus, point required checks at the CI lint, build, and coverage commands, add the pinned retornatus-gates workflow, and record this adoption as C-0001.
- DONE criterion: npm run test:coverage passes with the Vitest v8 coverage thresholds in vite.config.ts.
- DONE criterion: npm run build passes, running tsc -b and the Vite production build.
- DONE criterion: Workflow review of .github/workflows/retornatus.yml confirms contents read, pull-requests write, persist-credentials false, and action pin a4b3e88c779afe3933b27b1e3610952d6e41bcb1.
- DONE criterion: The Governance section is documented in "CONTRIBUTING.md" and names the retornatus-gates check.

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

gold-queen-web is a React 19 + Vite 8 + TypeScript app. CI in .github/workflows/ci.yml runs npm run lint (oxlint), npm run build (tsc -b and vite build), and npm run test:coverage. Spec Guardrails was already removed and Retornatus was never installed. Release 1.9.1 has no Node preset (python, python-platform, fastapi, django, rag, worker only), so init uses the generic config and the checks are set by hand to those three CI commands. The native Dependabot exemption [governance.omission.bot_exemption] and --pr-author exist only on unreleased retornatus main, so the workflow copies the gold-queen-api warn-mode workaround adapted to package.json, package-lock.json, and Actions pin bumps. graphify-out/ is gitignored; rtk is not versioned. Cursor and Claude bridges come from retornatus integrate.
