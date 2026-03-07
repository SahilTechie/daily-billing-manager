# User Stories and Acceptance Criteria

## Epic 1: Authentication

### Story 1.1
As an owner, I want to log in securely so that only I can access shop data.

**Acceptance Criteria**
- Given valid credentials, when I log in, then I receive an authenticated session.
- Given invalid credentials, when I log in, then I see an error and no session is created.
- All protected screens require authentication.

---

## Epic 2: Customer Management

### Story 2.1
As an owner, I want to add a customer so that I can bill them later.

**Acceptance Criteria**
- Customer form supports name, mobile, and address.
- Customer is saved and visible in customer list.
- Duplicate handling shows a clear warning/error as configured.

### Story 2.2
As an owner, I want to view customers so I can quickly select one for billing.

**Acceptance Criteria**
- Customer list loads with search/filter capability.
- Tapping a customer opens customer details/ledger.

---

## Epic 3: Billing

### Story 3.1
As an owner, I want to create a bill quickly so I can serve customers faster.

**Acceptance Criteria**
- Bill has auto-generated bill number.
- Date is editable.
- Required fields: customer, bird type, weight, rate.
- Total is auto-calculated as weight × rate.
- Bill saves successfully and is retrievable.

### Story 3.2
As an owner, I want advance/payment values reflected so balance is accurate.

**Acceptance Criteria**
- Balance updates using: total − advance − payments.
- After save, customer current balance is updated.
- Historical bill values remain unchanged.

---

## Epic 4: Ledger and Pending Balances

### Story 4.1
As an owner, I want customer ledger history so I can review all transactions.

**Acceptance Criteria**
- Ledger shows bill list and payment list in date order.
- Summary displays total billed, total paid, and pending.

### Story 4.2
As an owner, I want a pending balance list so I can follow up with customers.

**Acceptance Criteria**
- Pending list includes customers with outstanding balance > 0.
- List can be sorted by highest pending amount.

---

## Epic 5: Payments

### Story 5.1
As an owner, I want to record payment so pending balance reduces immediately.

**Acceptance Criteria**
- Payment form captures customer, amount, and date.
- Payment is saved and visible in ledger.
- Customer balance is recalculated after save.

---

## Epic 6: Bill Output

### Story 6.1
As an owner, I want to generate/share bill PDF so I can send it to customers.

**Acceptance Criteria**
- PDF generation is available on bill detail.
- PDF contains bill number, customer details, line values, total, and balance.
- Share/export action works on mobile browser supported channels.

---

## Cross-Cutting Acceptance
- Mobile-first UI with large touch targets.
- Typical bill creation can be completed within 30 seconds.
- Performance is acceptable on mid-range mobile devices.