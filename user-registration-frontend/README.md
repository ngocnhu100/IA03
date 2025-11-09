# User Registration Frontend

A minimal React + Vite + TypeScript frontend that talks to the user registration API.

Quick start (PowerShell):

```powershell
cd user-registration-frontend
npm install
npm run dev
```

By default the app reads the backend base URL from `VITE_API_URL` in the environment (defaults to `http://localhost:3000` if not set). Create a `.env` file or set the variable before starting the dev server.

Example .env (create `.env` file at project root):

```
VITE_API_URL=http://localhost:3000
```

The register form POSTs to `/user/register` on the configured backend.

**Note:** Login is simulated with no backend authentication. To test the login UI, use `test@example.com` / `password` (hardcoded simulation values).

If you seeded sample data in the backend, the following users exist for reference/testing registration (duplicate email validation):

- alice@example.com / Password123!
- bob@example.com / Password123!
