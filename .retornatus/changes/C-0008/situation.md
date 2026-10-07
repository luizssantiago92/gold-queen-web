<!-- retornatus-meta
{
  "change_id": "C-0008",
  "schema_version": 1
}
-->

# Situation

## Demand

The API policy says the web app is a separate repository, and this repository has headers, a session token in local storage, a public demo, and Retornatus, with no root reporting page and no decision-record index.

## Project context

# Project

Retornatus project continuity notes live here.

Agents and humans express intent. Retornatus owns structure.

## Repo signals (inferred)

- stack manifests: `package.json`
- tests: js test script
- ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- architecture: AGENTS.md; src packages: auth, components, graphify-out, i18n, lib, screens, test, types
- code path present: `src`
- Retornatus already initialized

## Known facts

- Demand stated: The API policy says the web app is a separate repository, and this repository has headers, a session token in local storage, a public demo, and Retornatus, with no root reporting page and no decision-record index.
- Repo: stack manifests: `package.json`
- Repo: tests: js test script
- Repo: ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- Repo: architecture: AGENTS.md; src packages: auth, components, graphify-out, i18n, lib, screens, test, types
- Repo: code path present: `src`
- Repo: Retornatus already initialized
- Situation narrative provided by agent/human
- Proposed WHAT: A reporting page and decision records that describe the running client.
- DONE criterion: The vulnerability reporting page and the decision records are documented in docs/adr/README.md.

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

gold-queen-web is a static Vite client on Vercel. vercel.json sets the response headers used in production. The session token is gold-queen.token in localStorage and is sent as a bearer token. The public demo prefills published credentials, and coded client messages follow the active locale. Retornatus required checks are npm run lint, npm run build, and npm run test:coverage. The API SECURITY.md explicitly leaves this repository out. Guides already describe deployment and the session, but there is no reporting page at the repository root and no docs/adr index.
