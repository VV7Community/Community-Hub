---
name: Auth bypass gating
description: How to safely implement temporary dev authentication bypasses without opening production paths.
---

When adding a temporary authentication bypass (e.g., while waiting for a production auth provider such as Clerk), gate it with **both** an explicit env flag **and** a non-production environment check. Never rely on a single toggle.

**Why:** A single env flag can leak into a production build or deployment and silently disable auth. Requiring `NODE_ENV !== "production"` (or `import.meta.env.DEV` on the frontend) in addition to the explicit flag makes accidental activation in production much harder.

**How to apply:**
- Backend: check `process.env.NODE_ENV !== "production" && process.env.DEV_AUTH_BYPASS === "true"` in every path that uses the bypass (auth middleware, user provisioning, WebSocket auth).
- Frontend: check `import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH_BYPASS === "true"`, and only define `VITE_DEV_AUTH_BYPASS` in non-production Vite builds.
- When the bypass is off, keep production paths fail-closed. If a transport (such as WebSocket) cannot be verified server-side yet, reject auth rather than trusting client-declared identity.
- Log a loud warning at startup whenever the bypass is active, and document it in `replit.md`.
