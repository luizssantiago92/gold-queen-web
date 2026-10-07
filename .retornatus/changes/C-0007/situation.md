<!-- retornatus-meta
{
  "change_id": "C-0007",
  "schema_version": 1
}
-->

# Situation

## Demand

Connect, Sync, and Remove look frozen while they wait, demo errors stay in Portuguese on the English screen, profile placeholders ignore taps, and Queen's Tips shows one spinner until a long timeout.

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

- Demand stated: Connect, Sync, and Remove look frozen while they wait, demo errors stay in Portuguese on the English screen, profile placeholders ignore taps, and Queen's Tips shows one spinner until a long timeout.
- Repo: stack manifests: `package.json`
- Repo: tests: js test script
- Repo: ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- Repo: architecture: AGENTS.md; src packages: auth, components, i18n, lib, screens, test, types
- Repo: code path present: `src`
- Repo: Retornatus already initialized
- Situation narrative provided by agent/human
- Proposed WHAT: Connect, Sync, and Remove show an accessible spinner while the action is pending. Demo read-only and closed sign-up copy follow the active locale, and an uncoded API detail is not shown. Plan, bank count, card art, and investments open a short not-in-this-demo sheet. Queen's Tips shows three scroll skeletons and a retry control while the request is still loading.
- DONE criterion: src/screens/ProfileScreen.test.tsx proves Sync and Remove stay busy with a spinner while the action is pending, and plan, bank count, card art, and investments open a not-in-this-demo sheet.
- DONE criterion: src/lib/api.test.ts proves a coded demo error follows the active locale and an uncoded detail stays off the screen.
- DONE criterion: src/components/QueenTipsModal.test.tsx proves three scroll skeletons and a retry control while tips are still loading.
- DONE criterion: The pending controls and the not-in-this-demo sheet are documented in docs/guide/Architecture.md for profile and Queen tips.

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

Connect disables its button with no spinner. Profile Sync and Remove do the same, and a demo 403 is a fixed Portuguese string in demoAccount.ts even when the UI is English. errorMessage also prints the API detail string, so visitors can see raw backend copy. Profile plan, bank count, card art, and investments are surfaces with no action. Queen's Tips shows one spinner for the whole advisor call, which can last until the 120s timeout. The chart day tap already opens the detail sheet from the previous change, so this Change leaves that control as it is.
