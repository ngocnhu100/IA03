# User Registration App — Local Setup (Windows)

This repo contains a NestJS API and a React (Vite + TS) frontend, plus Dockerized PostgreSQL and pgAdmin.

## Prerequisites

- Node.js 18+ and npm
- Docker Desktop (for PostgreSQL + pgAdmin)

## 1) Start the database (PostgreSQL + pgAdmin)

```powershell
cd d:/AWAD/IA04/user-registration-api
# Start containers
docker-compose up -d

# Check containers
docker ps
```

- PostgreSQL: localhost:5432 (user: `postgres`, password: `password`, db: `user_registration`)
- pgAdmin: http://localhost:5050 (email: `admin@admin.com`, password: `admin`)

In pgAdmin, create a new Server:

- Name: User Registration DB (any)
- Connection
  - Host: `postgres` (docker compose service name)
  - Port: `5432`
  - Username: `postgres`
  - Password: `password`

### (Optional) Create schema and seed sample data via SQL

We included SQL files to create the `users` table and seed a few example users.

PowerShell (Windows) with local Docker Postgres running:

```powershell
# Create schema (users table, unique index)
psql "postgresql://postgres:password@localhost:5432/user_registration" -f \
  ".\user-registration-api\sql\01_create_schema.sql"

# Seed sample users (alice@example.com / Password123!, bob@example.com / Password123!)
psql "postgresql://postgres:password@localhost:5432/user_registration" -f \
  ".\user-registration-api\sql\02_seed_sample_data.sql"
```

On Render (Managed PostgreSQL): open the DB shell and paste the contents of each file, or run `\i` with a path accessible to the shell.

Notes:

- Scripts are idempotent (safe to run multiple times).\
- Passwords are hashed server‑side using `crypt(..., gen_salt('bf'))` (bcrypt‑compatible).

## 2) Run the backend (NestJS)

```powershell
cd d:/AWAD/IA04/user-registration-api
npm install
npm run start:dev
```

Backend runs at: http://localhost:3000

Note: If needed, set DB envs in `.env` (defaults in code match docker-compose):

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=user_registration
```

## 3) Run the frontend (React + Vite)

```powershell
cd d:/AWAD/IA04/user-registration-frontend
# (optional) create .env if not present
# echo VITE_API_URL=http://localhost:3000 > .env
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

The app expects the API base URL from `VITE_API_URL` (defaults to http://localhost:3000 if you set it in `.env`).

## Useful URLs

- Frontend: http://localhost:5173
- API: http://localhost:3000
- pgAdmin: http://localhost:5050 (admin@admin.com / admin)

## Troubleshooting

- Ensure Docker Desktop is running before `docker-compose up -d`.
- If ports are in use, stop other services or change mappings in `docker-compose.yml` and Vite/Nest configs.
- If tables are missing, start the backend; TypeORM will create the `users` table in dev mode.

---

## Deploying Live (Render + Vercel)

Below is a simple, no-cost-friendly setup to deploy the API and frontend publicly:

### Option A: Backend on Render, Frontend on Vercel

Prerequisites:

- Push this repository to GitHub (or GitLab/Bitbucket)

#### 1) Deploy the API to Render

1. Go to https://render.com and create an account.
2. Click “New” → “Web Service”. Connect your repo.
3. Service settings:

- Root Directory: `user-registration-api`
- Runtime: Node
- Build Command: `npm ci && npm run build`
- Start Command: `node dist/main.js`
- Instance Type: Free (for testing)

4. Environment Variables (add these):

- `NODE_ENV=production`
- `PORT=10000` (Render sets `PORT`, but declaring won’t hurt)
- Database (choose one):
  - Preferred: `DATABASE_URL` (copy the DB “Internal Database URL” if API and DB are in the same region; normalize to start with `postgres://` if needed)
  - Or discrete vars: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
  - First deploy only (no migrations): `DB_SYNCHRONIZE=true` (remove after tables are created)

5. Click “Create Web Service”. Wait for deploy to finish. You’ll get a URL like:

- `https://user-registration-api.onrender.com`

Keep this URL; you’ll use it as the frontend API base.

#### 2) Deploy the Frontend to Vercel

1. Go to https://vercel.com and create a project from your repo.
2. Framework Preset: Vite
3. Root Directory: `user-registration-frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables (add under Project Settings → Environment Variables):

- `VITE_API_URL=https://user-registration-api.onrender.com` (use your actual Render URL)

7. Deploy. You’ll get a domain like `https://your-frontend.vercel.app`.

#### 3) Set CORS on the API

In Render, add/update the env var(s) on the API service:

- Single origin: `FRONTEND_URL=https://your-frontend.vercel.app`
- Multiple origins: `FRONTEND_URLS=https://your-frontend.vercel.app,https://your-preview.vercel.app`

Trailing slashes are normalized automatically.

Redeploy the API (or click “Manual Deploy → Clear build cache & deploy”).

You now have:

- Frontend: public Vercel URL
- Backend: public Render URL

### Option B: Everything on Render (Static + API)

You can also deploy the frontend as a Static Site on Render:

1. New → Static Site
2. Root Directory: `user-registration-frontend`
3. Build Command: `npm ci && npm run build`
4. Publish Directory: `dist`
5. Environment Variables for the Static Site:

- `VITE_API_URL=https://user-registration-api.onrender.com`

6. Deploy. Then set `FRONTEND_URL` on the API to the Static Site domain.

### Option C: Single VPS (Docker)

If you prefer a VPS, you can:

1. Build and run the API via Dockerfile (see `user-registration-api/Dockerfile`).
2. Serve the frontend build (`npm run build` in `user-registration-frontend`) via nginx.
3. Use a managed Postgres (Neon/Render/ElephantSQL) or self-host Postgres.

---

## Environment Variables Summary

API (`user-registration-api`):

- `NODE_ENV=production`
- `PORT` (provided by host, default 3000 locally)
- `DATABASE_URL` (preferred in production) or `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `FRONTEND_URL` (CORS allowed origin)
- or `FRONTEND_URLS` (comma‑separated origins)

Health check:

- `GET /health/db` returns database connectivity status (connected/disconnected)

Frontend (`user-registration-frontend`):

- `VITE_API_URL` (points to your API base URL)

---

## Tests (backend)

The backend (`user-registration-api`) includes unit tests and e2e tests using Jest.

Prerequisites:

- PostgreSQL running (you can use the provided Docker Compose)
- A separate test database (the app doesn’t create databases, only tables)

Create the test database once:

```powershell
# Create user_registration_test database
psql "postgresql://postgres:password@localhost:5432/postgres" -c \
  "CREATE DATABASE user_registration_test;"
```

Run unit tests:

```powershell
cd d:/AWAD/IA04/user-registration-api
npm run test
```

Run e2e tests:

```powershell
cd d:/AWAD/IA04/user-registration-api
npm run test:e2e
```

Notes:

- Tests set `NODE_ENV=test` automatically and use an isolated config that targets the `user_registration_test` database, with `synchronize: true` and `dropSchema: true` for a clean schema each run.
- If your Postgres credentials are different, set `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DATABASE=user_registration_test` before running tests.
