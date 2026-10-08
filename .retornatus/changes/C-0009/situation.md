<!-- retornatus-meta
{
  "change_id": "C-0009",
  "schema_version": 1
}
-->

# Situation

## Demand

Remove the day buttons under monthly spending so the month does not grow a button per day, and keep language selection off the sign-in screen. English is always the default. Language is changed only in settings.

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

- Demand stated: Remove the day buttons under monthly spending so the month does not grow a button per day, and keep language selection off the sign-in screen. English is always the default. Language is changed only in settings.
- Repo: stack manifests: `package.json`
- Repo: tests: js test script
- Repo: ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- Repo: architecture: AGENTS.md; src packages: auth, components, i18n, lib, screens, test, types
- Repo: code path present: `src`
- Repo: Retornatus already initialized
- Situation narrative provided by agent/human
- Proposed WHAT: The monthly spending card no longer lists a button for each day. The sign-in screen has no language control. A fresh visit is English. Profile settings still switch between English and Portuguese, and that choice is remembered.
- DONE criterion: Monthly spending renders the chart without a day-button row.
- DONE criterion: Login does not render English or Portuguese buttons.
- DONE criterion: readLocale returns en unless gold-queen.locale is already en or pt.
- DONE criterion: Profile still renders the language control.

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

The monthly spending card renders one button per series point, which grows to a button for every day of the month. The sign-in screen also shows English and Portuguese, and readLocale follows navigator.language. The product default is always English. Language is changed only from Profile settings, and a saved gold-queen.locale value is still honored.
