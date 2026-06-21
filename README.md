# Scan2Owner

Scan2Owner is a privacy-first QR sticker platform for vehicle owners. A scanner can report blocking, headlights, emergencies, flat tyres, accident damage, or a short custom message without seeing the owner's personal details.

## Included

- React, Vite, TailwindCSS responsive frontend
- FastAPI async API with OpenAPI documentation
- MongoDB persistence and indexes
- JWT access/refresh authentication and email verification
- One-time, hashed sticker activation codes
- FCM push and SMTP email adapters
- Public rate limiting and Cloudflare Turnstile support
- Owner analytics, vehicle management, and contact history
- Admin sticker generation, disable, transfer, and audit tools
- Docker Compose deployment

## Quick start with Docker

1. Create the environment file:

   ```bash
   cp .env.example .env
   ```

2. Replace `JWT_SECRET` and `ADMIN_PASSWORD` in `.env`.

3. Start the stack:

   ```bash
   docker compose up --build
   ```

4. Open:

   - Web app: `http://localhost:5173`
   - API docs: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/health`

The bootstrap admin uses `ADMIN_EMAIL` and `ADMIN_PASSWORD`. In development without SMTP, email messages are skipped. To test a normal owner login, configure SMTP or call the verification endpoint with a token generated through the API flow.

## Local development

Start MongoDB, then run the backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Run the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

For host-based backend development, set `MONGO_URL=mongodb://localhost:27017` in `backend/.env` or the shell environment.

## Production configuration

Set all secrets through your deployment platform, never in source control:

- `JWT_SECRET`: cryptographically random, at least 32 characters
- `ADMIN_PASSWORD`: strong initial administrator password
- `SMTP_*`: transactional email provider settings
- `FIREBASE_CREDENTIALS_PATH`: mounted Firebase service account JSON
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile server key
- `FRONTEND_URL`: exact public origin for CORS and email links
- `VITE_API_URL`: public API base URL at frontend build time

Terminate TLS at a reverse proxy or load balancer. Back up the Mongo volume, rotate the bootstrap admin password, and use a managed secret store. For horizontal API scaling, move rate-limit state to Redis and run MongoDB as a replica set for multi-document transaction support.

## Collections

The application creates and uses `users`, `vehicles`, `stickers`, `activation_codes`, `contact_requests`, `notifications`, `scan_events`, and `audit_logs`. Administrator identity is represented by the `role` field on users, avoiding duplicated credentials while preserving role-based access.

## Testing

```bash
cd backend && pytest
cd frontend && npm run lint && npm run build
```

See [API documentation](docs/API.md) for the endpoint map. Live request and response schemas remain authoritative in FastAPI's `/docs` UI.
