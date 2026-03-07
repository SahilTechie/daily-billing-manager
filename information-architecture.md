# Information Architecture

## IA Goal
Provide a fast, mobile-first navigation model for one owner to complete billing tasks with minimal taps.

## Primary Navigation
1. Login
2. Dashboard
3. Customers
4. New Bill
5. Pending
6. Profile/Logout

## Screen Map

### Public
- Login

### Authenticated
- Dashboard
  - Quick actions: New Bill, Add Customer, Pending List
  - Snapshot: total pending, recent bills

- Customers
  - Customer List
  - Customer Detail
    - Ledger tab (Bills + Payments)
    - Add Payment action

- Billing
  - New Bill Form
  - Bill Detail
  - PDF/Share

- Pending
  - Pending Customer List
  - Customer Follow-up (open ledger)

## Content Hierarchy

### Customer
- Basic info: name, mobile, address
- Financial info: current balance
- History: bills and payments

### Bill
- Metadata: bill number, date, customer
- Inputs: bird type, number of birds, weight, rate, advance
- Calculated: total amount, balance amount

### Payment
- Customer
- Amount
- Date
- Optional notes (future)

## Navigation Rules
- Single-column, mobile-first layout
- Max-width 480px content area
- Sticky primary action button where applicable
- Back navigation always available

## Search and Filtering
- Customer search by name/mobile
- Pending list sort by highest balance
- Bill history sort by latest date

## Permissions Model
- Single authenticated owner only
- No role-based sections in MVP