<!-- retornatus-meta
{
  "change_id": "C-0004",
  "schema_version": 1
}
-->

# Situation

## Demand

Replace the demo banner carousel with a speech bubble that points at the Gold Queen portrait.

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

- Demand stated: Replace the demo banner carousel with a speech bubble that points at the Gold Queen portrait.
- Repo: stack manifests: `package.json`
- Repo: tests: js test script
- Repo: ci: `ci.yml`, `codeql.yml`, `retornatus.yml`
- Repo: architecture: AGENTS.md; src packages: auth, components, i18n, lib, screens, test, types
- Repo: code path present: `src`
- Repo: Retornatus already initialized
- Situation narrative provided by agent/human
- Proposed WHAT: Show one short line in a speech bubble with an arrow toward the RoyalCrown portrait, reveal the longer remark on tap or keyboard, keep dismiss, and drop pagination dots and auto-advance. Copy stays in English and Portuguese.
- DONE criterion: src/components/home/DemoInfoBanner.test.tsx proves one short line stays on screen, a tap or key press reveals the longer remark, dismiss hides the bubble, and the line does not advance on a timer.
- DONE criterion: The speech bubble is documented in docs/guide/Architecture.md as one line, an arrow toward the portrait, and no auto-advance.

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

DemoInfoBanner is a five-slide carousel beside RoyalCrown in HomeHeader. It auto-advances every 5 seconds via SLIDE_INTERVAL_MS and draws pagination dots. Luiz wants a speech bubble with an arrow aimed at that portrait, one short visible phrase, tap or click to see the rest, no dots, and no aggressive auto-rotation. It must stay accessible (aria, focus, keyboard, prefers-reduced-motion), fit the mobile shell, use both UI languages, and keep the medieval theme and dismiss. Scope is the banner only.
