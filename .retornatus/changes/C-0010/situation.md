<!-- retornatus-meta
{
  "change_id": "C-0010",
  "schema_version": 1
}
-->

# Situation

## Demand

PR 28 already changes the monthly spending chart and the login language default. Retornatus rejects it because C-0009 declares no file scope and its claim evidence is narrow npm test runs. Replace that governance record without changing product behavior.

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

- Demand stated: PR 28 already changes the monthly spending chart and the login language default. Retornatus rejects it because C-0009 declares no file scope and its claim evidence is narrow npm test runs. Replace that governance record without changing product behavior.
- Repo: stack manifests: `package.json`
- Repo: tests: js test script
- Repo: ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- Repo: architecture: AGENTS.md; src packages: auth, components, i18n, lib, screens, test, types
- Repo: code path present: `src`
- Repo: Retornatus already initialized
- Situation narrative provided by agent/human
- Proposed WHAT: A new Change lists exactly the fifteen product files in this pull request as Task resources. Proof is npm run lint, npm run build, and npm run test:coverage on a clean tree.
- DONE criterion: Monthly spending renders the chart without a day-button row.
- DONE criterion: Login does not render English or Portuguese buttons.
- DONE criterion: readLocale returns en unless gold-queen.locale is already en or pt.
- DONE criterion: Profile still renders the language control.
- DONE criterion: npm run lint, npm run build, and npm run test:coverage pass.

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

C-0009 is active but its tasks list no resources, so gate scope rejects CHANGELOG, README, the guides, and the month and locale source files. Its first four evidence records run npm test on single files, which is not the required npm run test:coverage argv. Product behavior stays as already committed. Constraints: do not change product behavior. Task resources are exactly the fifteen product files in the pull request, not a wider glob.
