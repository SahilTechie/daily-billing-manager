# API Contracts (MVP)

## Base
- Base URL: `/api`
- Auth: `Authorization: Bearer <jwt>` for protected routes
- Content-Type: `application/json`

## Error Format
```json
{
  "success": false,
  "message": "Human readable error",
  "code": "ERROR_CODE"
}
```

## Auth

### POST /auth/login
Request:
```json
{
  "email": "owner@example.com",
  "password": "******"
}
```
Response 200:
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "u1",
    "email": "owner@example.com",
    "shopName": "My Chicken Shop"
  }
}
```

## Customers

### POST /customers
Request:
```json
{
  "name": "Customer Name",
  "mobile": "9999999999",
  "address": "Area, City"
}
```
Response 201: customer object

### GET /customers
Response 200:
```json
{
  "success": true,
  "data": [
    {
      "id": "c1",
      "name": "Customer Name",
      "mobile": "9999999999",
      "address": "Area, City",
      "currentBalance": 450
    }
  ]
}
```

### GET /customers/:id
Response 200: customer detail + summary

## Bills

### POST /bills
Request:
```json
{
  "customerId": "c1",
  "date": "2026-02-28",
  "birdType": "Broiler",
  "numberOfBirds": 12,
  "weight": 18.5,
  "rate": 180,
  "advancePaid": 500
}
```
Behavior:
- Server calculates `totalAmount` and `balanceAmount`
- Server updates customer `currentBalance`

Response 201:
```json
{
  "success": true,
  "data": {
    "id": "b1",
    "billNumber": "BILL-0001",
    "totalAmount": 3330,
    "balanceAmount": 2830
  }
}
```

### GET /bills
Query params (optional): `customerId`, `from`, `to`, `page`, `limit`

### GET /bills/customer/:customerId
Response 200: list of bills for customer

## Payments

### POST /payments
Request:
```json
{
  "customerId": "c1",
  "amount": 1000,
  "date": "2026-02-28"
}
```
Behavior:
- Create payment record
- Recalculate/update customer balance

Response 201: payment object

## Ledger / Pending

### GET /ledger/:customerId
Response 200:
```json
{
  "success": true,
  "data": {
    "customer": { "id": "c1", "name": "Customer Name" },
    "bills": [],
    "payments": [],
    "summary": {
      "totalBilled": 0,
      "totalPaid": 0,
      "pending": 0
    }
  }
}
```

### GET /pending
Response 200: customers with `currentBalance > 0`, sorted by descending pending amount