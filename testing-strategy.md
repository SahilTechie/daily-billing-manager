# Testing Strategy

## Objective
Ensure billing, payment, and balance flows are correct, fast, and reliable on mobile.

## Test Pyramid
- Unit tests: calculations, validators, utility logic
- Integration tests: API + DB flows (auth, customer, bill, payment)
- E2E tests: top user journeys in mobile viewport

## Priority Test Scenarios

### 1) Authentication
- Valid login returns token
- Invalid login rejected
- Protected routes block unauthenticated access

### 2) Customer Management
- Add customer success/failure
- Customer list retrieval and detail retrieval

### 3) Billing
- Total calculation accuracy (`weight * rate`)
- Balance calculation with advance/payments
- Bill persistence with unique bill number

### 4) Payments
- Payment creation with positive amount only
- Customer balance updates after payment
- Historical bills remain unchanged

### 5) Ledger/Pending
- Ledger summary accuracy (total billed, paid, pending)
- Pending list includes only `balance > 0`
- Sorting by highest pending works

## Non-Functional Testing
- Mobile responsiveness (common device sizes)
- Basic performance checks for list screens
- API error handling and validation responses

## Test Data Strategy
- Seed customers, bills, and payments
- Include edge cases:
  - zero advance
  - full advance
  - partial payments
  - overpayment handling rule

## Exit Criteria
- No critical defects in billing/payment modules
- All core API contracts pass integration tests
- End-to-end happy path passes on mobile viewport