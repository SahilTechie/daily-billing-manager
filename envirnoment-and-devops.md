# Environment and DevOps

## Environments
1. Local
2. Staging
3. Production

## Runtime Stack
- Node.js LTS (API)
- React build runtime (Web)
- MongoDB Atlas

## Environment Variables

### API
- `PORT`
- `NODE_ENV`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `BCRYPT_SALT_ROUNDS`
- `CORS_ORIGIN`

### Web
- `VITE_API_BASE_URL` (or equivalent)

## Secrets Management
- Never commit `.env`
- Store secrets in host platform secret manager
- Rotate `JWT_SECRET` periodically

## CI/CD (Suggested)
- On PR: install, lint, test, build
- On merge to main: deploy staging/production
- Post-deploy smoke checks for login, bill create, pending list

## Hosting
- Web: Vercel/Netlify
- API: Render/Railway
- DB: MongoDB Atlas

## Observability (MVP-Lite)
- Structured API logs
- Centralized error logging
- Basic uptime monitoring

## Backup/Recovery
- Use Atlas automated backups
- Restore playbook documented
- Export critical billing data periodically

## Security Baseline
- HTTPS only
- JWT auth on protected routes
- Input validation and sanitization
- Password hashing with bcrypt