# Database Schema (MongoDB/Mongoose)

## Design Principles
- Single-tenant (one owner)
- Simple document design
- Fast reads for customer ledger and pending balances

## Collections

### users
```json
{
  "_id": "ObjectId",
  "email": "string (unique, indexed)",
  "passwordHash": "string",
  "shopName": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### customers
```json
{
  "_id": "ObjectId",
  "name": "string (indexed)",
  "mobile": "string (indexed)",
  "address": "string",
  "currentBalance": "number (default 0)",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### bills
```json
{
  "_id": "ObjectId",
  "billNumber": "string (unique, indexed)",
  "customerId": "ObjectId (ref customers, indexed)",
  "date": "date (indexed)",
  "birdType": "string",
  "numberOfBirds": "number",
  "weight": "number",
  "rate": "number",
  "totalAmount": "number",
  "advancePaid": "number",
  "balanceAmount": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### payments
```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId (ref customers, indexed)",
  "amount": "number",
  "date": "date (indexed)",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Relationships
- One user (owner) manages many customers
- One customer has many bills
- One customer has many payments

## Derived Calculations
- Bill total: `totalAmount = weight * rate`
- Customer pending: `sum(bills.totalAmount - bills.advancePaid) - sum(payments.amount)`
- `currentBalance` is denormalized for fast reads and updated on bill/payment writes

## Suggested Indexes
- `users.email` unique
- `customers.name`
- `customers.mobile`
- `bills.billNumber` unique
- `bills.customerId + date`
- `payments.customerId + date`

## Data Integrity Rules
- Payment amount must be > 0
- Weight and rate must be >= 0
- Bill/customer references must exist
- Historical bill rows should be immutable after finalization