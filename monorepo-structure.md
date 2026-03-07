# Monorepo Structure

## Goal
Organize frontend and backend in one repository for simple MVP delivery.

## Proposed Structure
```text
bill-app/
  apps/
    web/                 # React mobile-first frontend
    api/                 # Node + Express backend
  packages/
    shared-types/        # Optional shared DTO/types
    eslint-config/       # Optional shared lint config
  docs/
    product-requirement.md
    user-stories and acceptance-criteria.md
    information-architecture.md
    system-architecture.md
    database-schema.md
    api-contracts.md
    scoring-engine-spec.md
    engineering-scope-definition.md
    development-phase.md
    envirnoment-and-devops.md
    testing-strategy.md
  .env.example
  package.json
  README.md
```

## App Responsibilities
- `apps/web`: UI screens, state handling, API client, mobile UX rules
- `apps/api`: REST routes, auth, business logic, DB access

## Shared Contracts
- Keep request/response schemas in `shared-types` (optional but recommended)
- Version APIs carefully to avoid frontend/backend mismatch

## Scripts (Example)
- `dev:web`
- `dev:api`
- `dev` (runs both)
- `test`
- `lint`

## Branching
- Main branch protected
- Feature branches per module (auth, customers, bills, payments)
- PR-based integration