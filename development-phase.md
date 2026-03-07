# Development Phase Plan

## Phase 0: Project Setup (Day 1-2)
- Repository and folder setup
- Environment configuration
- MongoDB connection and base server
- React app bootstrap and routing shell

## Phase 1: Authentication (Day 3-4)
- Owner login API
- Password hash verification
- JWT issuance/validation middleware
- Login screen integration

## Phase 2: Customer Module (Day 5-6)
- Customer schema/model
- Add customer API + list/detail APIs
- Customer list and add form UI

## Phase 3: Billing Module (Day 7-10)
- Bill schema/model
- Auto bill number strategy
- Bill creation API with server-side calculations
- Bill form UI and detail page

## Phase 4: Payments + Ledger (Day 11-13)
- Payment schema/model + API
- Balance recalculation flow
- Customer ledger aggregation endpoint
- Ledger and pending screens

## Phase 5: PDF + Sharing (Day 14)
- Bill PDF template
- Share/export integration for mobile browser

## Phase 6: Stabilization & Release (Day 15-16)
- Bug fixes and validation
- Performance pass for mobile UX
- Deployment and smoke checks

## Milestone Exit Criteria
- All MVP user stories accepted
- No critical bugs in bill/payment/balance flows
- Owner can operate app without paper records