<!-- retornatus-meta
{
  "change_id": "C-0006",
  "schema_version": 1
}
-->

# Situation

## Demand

The home transaction list stops at the first page while the header shows the full total, and a failed home card disappears.

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

- Demand stated: The home transaction list stops at the first page while the header shows the full total, and a failed home card disappears.
- Repo: stack manifests: `package.json`
- Repo: tests: js test script
- Repo: ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- Repo: architecture: AGENTS.md; src packages: auth, components, i18n, lib, screens, test, types
- Repo: code path present: `src`
- Repo: Retornatus already initialized
- Situation narrative provided by agent/human
- Proposed WHAT: The home transaction list loads the next page while the loaded count is shorter than the total, and those loaded rows stay available to the figure detail sheet. When a home card query fails, the card stays on screen with a Try again control that asks the query to run again.
- DONE criterion: src/components/home/TransactionFeed.test.tsx proves the next page control appears while the scroll is shorter than the total, and a failed card keeps a Try again control that asks the query to run again.
- DONE criterion: The next page and the retry control are documented in docs/guide/Architecture.md.

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

The home feed calls useTransactions(1, 20). The card header prints page.total while only that page is rendered, so a production total of 34 leaves fourteen rows off the screen and off the figure detail sheet. CashFlowRow, BalanceCard, CategoriesCard, MonthChartCard, and TransactionFeed return null when their query has no data, including after an error, so the card vanishes. The agreed finish line is the next page on this feed, with loaded pages passed into the existing detail sheet, plus a Try again control on a card whose query failed. No new route, search, or filters. Connect, Sync, and Remove spinners and demo-account error copy stay out of this Change.
