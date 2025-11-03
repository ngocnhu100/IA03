# User Registration Frontend

A minimal React + Vite + TypeScript frontend that talks to the user registration API.

Quick start (PowerShell):

```powershell
cd d:/AWAD/IA04/user-registration-frontend
npm install
npm run dev
```

By default the app reads the backend base URL from `VITE_API_URL` in the environment. Create a `.env` file or set the variable before starting the dev server.

Example .env (create `.env` file at project root):

```
VITE_API_URL=http://localhost:3000
```

The register form POSTs to `/user/register` on the configured backend.
