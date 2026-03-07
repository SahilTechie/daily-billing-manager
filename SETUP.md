# Full-Stack Chicken Shop Billing App - Setup & Deployment Guide

## Project Structure

```
bill-app/
├── apps/
│   ├── api/                    # Backend: Node.js + Express
│   │   ├── src/
│   │   │   ├── config/        # Database configuration
│   │   │   ├── middleware/    # Auth & validation
│   │   │   ├── models/        # MongoDB schemas
│   │   │   ├── routes/        # API endpoints
│   │   │   ├── utils/         # Helpers & business logic
│   │   │   └── server.js      # Express server
│   │   └── package.json
│   │
│   └── web/                    # Frontend: React + Vite
│       ├── src/
│       │   ├── components/    # Reusable UI components
│       │   ├── context/       # React context (auth state)
│       │   ├── pages/         # Screen/page components
│       │   ├── services/      # API client
│       │   ├── App.jsx        # Main app with routing
│       │   ├── main.jsx       # React entry point
│       │   └── styles.css     # Global mobile-first styling
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
├── package.json               # Monorepo root
├── .env.example              # Environment template
├── README.md
└── [12 documentation files]
```

## Prerequisites

- Node.js 16+ (with npm)
- MongoDB (local or Atlas)
- Git (optional, for version control)

## Local Development Setup

### 1. Clone/Navigate to Project
```bash
cd c:\Users\ASUS\Downloads\Bill
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure:

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# For local MongoDB:
MONGO_URI=mongodb://127.0.0.1:27017/bill_memo
JWT_SECRET=your-super-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
CORS_ORIGIN=http://localhost:5173

VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Local MongoDB (if using local instance)
```bash
# On Windows with MongoDB installed:
mongod
```

Or use MongoDB Atlas:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bill_memo?retryWrites=true&w=majority
```

### 4. Start Development Servers

**Option A: Run both servers together**
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

**Option B: Run separately**
```bash
# Terminal 1: Backend
npm run dev:api

# Terminal 2: Frontend
npm run dev:web
```

### 5. Login
- **Default username:** `owner`
- **Default password:** `owner123`

The default owner is auto-created on first API start.

## Features

### Dashboard
- Today's bills count
- Today's revenue
- Total customers
- Total pending balance

### Customers
- Add new customer
- Search customers by name/mobile
- View customer ledger
- Record payments

### Bills
- Create bill with auto-calculations
- Select customer, bird type, weight, rate
- Auto-calculate total and balance
- List all bills with pending amounts

### Pending
- View all customers with outstanding balance
- Sort by highest/lowest pending
- Collection scoring system

## API Endpoints

### Auth
- `POST /api/auth/login` - Owner login

### Customers
- `POST /api/customers` - Add customer
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer detail

### Bills
- `POST /api/bills` - Create bill
- `GET /api/bills` - List bills
- `GET /api/bills/:id` - Get bill detail

### Payments
- `POST /api/payments` - Record payment

### Dashboard
- `GET /api/dashboard` - Dashboard stats

### Pending
- `GET /api/pending` - Pending customers

All endpoints (except `/auth/login`) require `Authorization: Bearer <token>` header.

## Production Deployment

### Frontend (Vercel / Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy `apps/web/dist/` directory

3. Set environment variable:
```
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Backend (Render / Railway)

1. Create a new Web Service pointing to repo root
2. Build command: `npm install`
3. Start command: `npm start --workspace=apps/api`
4. Set environment variables:
   - `MONGO_URI` (MongoDB Atlas connection)
   - `JWT_SECRET` (production secret)
   - `JWT_EXPIRES_IN`
   - `BCRYPT_SALT_ROUNDS`
   - `CORS_ORIGIN` (frontend URL)

### Database (MongoDB Atlas)

1. Create a free cluster on MongoDB Atlas
2. Create database user and whitelist IPs
3. Copy connection string as `MONGO_URI`

## Testing

### Manual Testing Checklist

- [ ] Login with owner/owner123
- [ ] Add a customer
- [ ] Create a bill for customer
- [ ] Verify bill calculations
- [ ] Add payment to customer
- [ ] Check pending balances update
- [ ] View customer ledger
- [ ] Check dashboard stats

### API Testing

Use Postman or curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"owner","password":"owner123"}'

# Add customer
curl -X POST http://localhost:5000/api/customers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"John","mobile":"9999999999","address":"City"}'
```

## Troubleshooting

### Database Connection Failed
- Verify MongoDB is running (local) or accessible (Atlas)
- Check `MONGO_URI` in `.env`
- Ensure IP is whitelisted (if using Atlas)

### Port Already in Use
```bash
# Kill process on port 5000 (API)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (Web)
lsof -ti:5173 | xargs kill -9
```

### CORS Errors
- Verify `CORS_ORIGIN` matches frontend URL
- Check browser console for specific error

### Build Errors
- Delete `node_modules` and `dist/`
- Run `npm install` and `npm run build` again

## Documentation Files

- `product-requirement.md` - Product goals and scope
- `user-stories and acceptance-criteria.md` - Feature definitions
- `information-architecture.md` - Navigation and content structure
- `system-architecture.md` - Technical design
- `database-schema.md` - MongoDB collections & fields
- `api-contracts.md` - API request/response specs
- `scoring-engine-spec.md` - Collection priority scoring
- `monorepo-structure.md` - Project organization
- `engineering-scope-definition.md` - In/out of scope
- `development-phase.md` - Implementation roadmap
- `envirnoment-and-devops.md` - Deployment setup
- `testing-strategy.md` - QA approach

## Next Steps

1. **Data:** Add test customers and bills via UI
2. **Styling:** Customize colors in `apps/web/src/styles.css`
3. **Features:** Extend with bill PDF, email sharing, etc.
4. **Scale:** Add multi-shop support, user roles, analytics
5. **Polish:** Mobile PWA, offline sync, push notifications

## Support

For issues or questions, refer to the documentation files or check the API logs:

```bash
# View API logs (dev)
npm run dev:api 2>&1 | tee api.log
```

---

**Happy Billing! 🍗📱**
