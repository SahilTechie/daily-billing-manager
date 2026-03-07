# Engineering Scope Definition

## In Scope (MVP)
1. Single owner authentication
2. Customer CRUD (create + read for MVP)
3. Bill creation with auto calculations
4. Payment entry and balance recalculation
5. Customer ledger view
6. Pending list view
7. Bill PDF generation and share
8. Mobile-first responsive UI
9. Basic production deployment

## Out of Scope (MVP)
- Inventory management
- Advanced analytics/reports
- Multi-user roles/permissions
- Admin panel
- Multi-shop tenancy
- Offline sync (future)

## Technical Scope
- Frontend: React SPA
- Backend: Node/Express REST API
- DB: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Done Criteria
- Core user journeys work end-to-end on mobile browser
- API contracts implemented for auth/customers/bills/payments/pending
- Data consistency for balances verified
- Basic security controls in place (auth, hashing, env secrets)
- Smoke tests pass in staging/production-like environment

## Constraints
- Keep implementation simple and maintainable
- Prioritize reliability and speed over feature breadth