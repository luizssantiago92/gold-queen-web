# ADR 0005: Retornatus governs changes in this repository

- Status: Accepted
- Recorded: 2026-10-07 (the repository already runs this way)

## Context

Behavior changes need a written finish line and proof from the same commands CI runs. The harness in this repo is Retornatus 1.9.1.

## Decision

Each Change lives under `.retornatus/changes/` with a Situation, a Contract, and Evidence. `.retornatus/config.toml` requires three checks: `npm run lint`, `npm run build`, and `npm run test:coverage`. Pull requests run `.github/workflows/retornatus.yml`. The composite action is pinned to `a4b3e88c779afe3933b27b1e3610952d6e41bcb1`. The job token is `contents: read` and `pull-requests: write`. `fail-on` is `not_satisfied`. The workflow does not push, merge, or deploy. The owner merges.

## Consequences

A pull request that changes product code without a satisfied Change fails `retornatus-gates`. Scope is the task resource list plus `.retornatus/**`. `graphify-out/` and rtk stay on the machine and are not committed. Dependabot manifest-only updates are the documented omission exception in that workflow; human and agent pull requests stay on `fail`.

## Alternatives

Skipping the contract for a docs-only note still leaves the three required checks, because they are repository policy rather than a per-change option. A job that skips Retornatus for every bot would also skip the suppressions gate, so this repo does not do that.
