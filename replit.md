# VectorVest Community

A full-stack community platform with an Express API server and a React/Vite frontend.

## Run & Operate

- `artifacts/api-server: API Server` — managed workflow for the API server
- `artifacts/community: web` — managed workflow for the community frontend
- `artifacts/mockup-sandbox: Component Preview Server` — managed workflow for the mockup sandbox
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provided by Replit)
- Required secrets: `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` — from https://dashboard.clerk.com (only needed for real auth; disabled in dev via `DEV_AUTH_BYPASS`)
- Required secrets: `SESSION_SECRET` — random secret for sessions
- Dev env: `DEV_AUTH_BYPASS=true` — when set alongside `NODE_ENV !== production`, every request is treated as the hardcoded admin user `bjarne` (temporary until VectorVest shares their Clerk setup)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
