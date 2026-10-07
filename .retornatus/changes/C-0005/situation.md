<!-- retornatus-meta
{
  "change_id": "C-0005",
  "schema_version": 1
}
-->

# Situation

## Demand

Let people open a detail sheet from the figures already on the home dashboard.

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

- Demand stated: Let people open a detail sheet from the figures already on the home dashboard.
- Repo: stack manifests: `package.json`
- Repo: tests: js test script
- Repo: ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- Repo: architecture: AGENTS.md; src packages: auth, components, i18n, lib, screens, test, types
- Repo: code path present: `src`
- Repo: Retornatus already initialized
- Situation narrative provided by agent/human
- Proposed WHAT: A tap or key press on income, spending, balance, a bank, a category, or a chart day opens a sheet of the matching transactions or the bank breakdown, using transactions already loaded and the existing transaction detail modal. Bank rows show last_synced_at.
- DONE criterion: src/components/home/FigureDetailSheet.test.tsx proves a tap or key press on income, spending, balance, a bank, a category, and a chart day opens a sheet of the matching transactions or the bank breakdown.
- DONE criterion: The drill-in sheet is documented in docs/guide/Architecture.md as a tap on the figures already on the home screen.

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

Income, spending, balance, bank rows, category rows, and chart days are static. Only a transaction row opens TransactionDetailModal. The home screen already loads overview, categories, monthly series, and the first transaction page. BalanceCard always says Updated just now, while connections carry last_synced_at. This change adds one sheet, filters the loaded transactions, reuses the transaction detail modal for a row, and shows the sync time. No new API route and no transaction paging.
