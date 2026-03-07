# Product Requirement

## Product
Mobile-First Billing Web App for a Chicken Shop Owner

## Objective
Replace the paper bill book with a simple, fast, mobile web app without changing the owner’s existing workflow.

## Primary User
- Single shop owner (single tenant)
- Works mostly on mobile
- Needs quick billing and clear pending balances

## Problem Statement
Paper billing causes:
- Lost/damaged records
- Billing disputes
- Unclear pending balances
- Slow customer history tracking

## Success Criteria (MVP)
- Owner creates a bill in < 30 seconds
- Owner checks pending balances instantly
- Owner can stop using the paper bill book fully
- App is comfortably usable on a mobile browser

## Functional Requirements

### 1) Authentication
- Single owner login
- JWT-based session for protected APIs

### 2) Customer Management
- Add customer
- View customer list
- Open customer profile/ledger
- Select customer while creating bill

### 3) Billing
- Auto-generated bill number
- Editable bill date
- Bird type input/selection
- Inputs: number of birds, weight, rate, advance
- Auto calculations:
  - Amount = Weight × Rate
  - Balance = Total − Advance − Payments
- Save bill and fetch bill details/history

### 4) Ledger
- Customer-wise bill history
- Total billed
- Total paid
- Current/pending balance

### 5) Payments
- Record customer payment
- Recalculate customer balance
- Preserve historical bill values

### 6) Bill Sharing
- Generate bill PDF
- Share/export bill

## UX Requirements
- Mobile-first layout (single column, max-width 480px)
- Large touch inputs and buttons
- Minimal text and clutter
- Sticky bottom actions where useful

## Non-Goals (Out of MVP)
- Inventory management
- Analytics/reports
- Multi-user roles
- Admin dashboard
- Multi-shop support

## Constraints
- Keep architecture simple and maintainable
- No unnecessary abstraction
- Owner-first performance and usability