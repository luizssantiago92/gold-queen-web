# ADR 0002: Bearer JWT in localStorage

- Status: Accepted
- Recorded: 2026-10-07 (the client already runs this way)

## Context

The API issues a bearer JWT. This client has to keep that token across reloads and attach it to later requests. The API does not set a session cookie for the browser.

## Decision

`src/lib/api.ts` stores the access token in `localStorage` under `gold-queen.token`. The Axios request interceptor sends `Authorization: Bearer` when a token is present, and `Accept-Language` from the active locale. A response `401` calls `clearToken()` and dispatches `gold-queen:unauthorized`. `AuthProvider` listens for that event, drops the user, and clears the TanStack Query cache. Logout does the same clear without waiting for a `401`. On boot, a stored token is only trusted after `GET /v1/auth/me` succeeds. Login posts to `POST /v1/auth/login` and stores `access_token`.

## Consequences

Any script that runs on this origin can read the token. There is no httpOnly cookie and no server-side revocation list in this repository. The production `script-src 'self'` policy, recorded in [ADR 0003](0003-response-headers.md), is the control that keeps other scripts off the page. A token that expires while the tab is closed fails `/v1/auth/me` and returns the visitor to the login screen.

## Alternatives

An httpOnly cookie would need the API to set it and the browser to send it cross-origin to Render. That is not how this client authenticates. Keeping the token only in memory would drop the session on every refresh.
