# ADR 0004: Public demo client

- Status: Accepted
- Recorded: 2026-10-07 (the client already runs this way)

## Context

The live app is a recruiter and visitor demo. The API seed creates one account, closes registration in production, and refuses connect, sync, and unlink for that account. This client has to show that without pretending the visitor can open a bank.

## Decision

The login form prefills `queen@goldqueen.dev` and `QueenDemo123!`. The same pair is published in the README. Connect bank opens an explanation, not a Pluggy widget. `errorMessage` in `src/lib/api.ts` maps `registration_disabled`, `demo_read_only`, and `connection_limit_reached` through the active locale catalogs (`signupClosedMessage`, `demoReadOnlyMessage`, and the connect-limit copy). Any other API `detail` is not shown; the caller's fallback is. A missing response or a timeout uses the cold-start copy, because the free-tier API often has not answered yet.

## Consequences

Anyone can sign in as the demo user and read the seeded treasury, Queen's Tips, and chat. They cannot connect, sync, or remove a bank from this UI. Copy for those three codes follows English or Portuguese with the locale toggle. An uncoded backend sentence does not appear on screen. The published password is not a secret.

## Alternatives

Hiding the demo password would block the walkthrough this app is for. Rendering `detail` directly would show English API text on the Portuguese screen, including strings the catalogs already replace. Embedding Pluggy keys in the bundle would put a server credential in a public client.
