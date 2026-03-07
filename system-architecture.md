# System Architecture

## Architecture Style
Client-server MERN architecture with REST APIs and JWT authentication.

## High-Level Components
- Frontend: React SPA (mobile-first)
- Backend: Node.js + Express
- Database: MongoDB via Mongoose

## Logical Diagram
Client (React) -> HTTPS REST API -> Express Service -> MongoDB

## Backend Layering
- Routes: endpoint definitions
- Controllers: request handling/business orchestration
- Services (optional lightweight): reusable business rules
- Models: Mongoose schemas
- Middleware: auth, validation, error handling

## Core Domains
1. Auth
2. Customers
3. Bills
4. Payments
5. Ledger/Pending

## Key Flows

### Authentication Flow
1. Owner submits credentials.
2. Backend verifies hash (bcrypt).
3. Backend issues JWT.
4. Client sends JWT for protected API calls.

### Bill Creation Flow
1. Select customer.
2. Enter bill inputs.
3. Calculate totals.
4. Persist bill.
5. Recalculate/update customer balance.

### Payment Flow
1. Submit payment.
2. Persist payment record.
3. Recalculate customer balance.
4. Keep historical bills immutable.

## Non-Functional Requirements
- Fast mobile interactions
- Readability and maintainability over premature optimization
- Secure secrets via environment variables
- Stateless API horizontal scalability readiness

## Deployment (Suggested)
- Frontend: Vercel/Netlify
- Backend: Render/Railway
- Database: MongoDB Atlas