# user-registration-api

Minimal NestJS starter for user registration API with PostgreSQL database.

## Database Setup

### Prerequisites

- Node.js 18+ installed

### Option 1: Using Docker (Recommended)

If you have Docker installed, you can quickly spin up a PostgreSQL database:

```bash
# Start PostgreSQL database
docker-compose up -d postgres

# The database will be available at localhost:5432
# Credentials: postgres/password
```

### Option 2: Manual PostgreSQL Setup

Install PostgreSQL locally and create the database:

```bash
# On Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# On macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb user_registration
```

### Environment Variables

Copy `.env.example` to `.env` and update the database credentials:

```bash
cp .env.example .env
```

Default configuration (update as needed):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=user_registration
```

### Install Dependencies & Run

```powershell
cd d:/AWAD/IA04/user-registration-api
npm install
npm run start:dev
# Server runs on http://localhost:3000/
```

**Note:** TypeORM will automatically create the `users` table when the application starts (in development mode).

## Database Schema

### User Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "IDX_USER_EMAIL" ON users (email);
```

## API Endpoints

### POST /user/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (201 Created):**

```json
{
  "id": "1234567890",
  "email": "user@example.com",
  "createdAt": "2025-11-03T08:48:45.163Z"
}
```

**Error Responses:**

**400 Bad Request - Validation Errors:**

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    "Email is required",
    "Please provide a valid email address (e.g., user@example.com)",
    "Password is required",
    "Password must be at least 8 characters long to ensure security"
  ],
  "timestamp": "2025-11-03T08:48:42.873Z"
}
```

**409 Conflict - Email Already Exists:**

```json
{
  "statusCode": 409,
  "error": "Email already registered",
  "message": "An account with this email address already exists. Please use a different email or try logging in instead.",
  "timestamp": "2025-11-03T08:48:46.186Z"
}
```

**500 Internal Server Error - System Errors:**

```json
{
  "statusCode": 500,
  "error": "Password processing failed",
  "message": "Unable to process your password. Please try again.",
  "timestamp": "2025-11-03T08:48:47.000Z"
}
```

## Validation Rules

- **Email**: Required, must be valid email format, normalized to lowercase
- **Password**: Required, 8-128 characters, hashed with bcrypt

## Testing

```powershell
# Test successful registration
Invoke-WebRequest -Uri http://localhost:3000/user/register -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'

# Test validation errors
Invoke-WebRequest -Uri http://localhost:3000/user/register -Method POST -ContentType "application/json" -Body '{"email":"invalid","password":"short"}'

# Test duplicate email
Invoke-WebRequest -Uri http://localhost:3000/user/register -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"different123"}'
```

## Files Created

- `package.json` — scripts and dependencies
- `tsconfig.json` / `tsconfig.build.json` — TypeScript configs
- `src/` — application source code
- `src/global-exception.filter.ts` — custom error handling
- `src/user.model.ts` — user data models
- `src/user.service.ts` — business logic
- `src/register-user.dto.ts` — input validation
- `src/app.controller.ts` — API endpoints
- `src/app.service.ts` — basic app service
- `src/app.module.ts` — NestJS module configuration
- `src/main.ts` — application bootstrap

## Next Steps

1. Add database integration (MongoDB, PostgreSQL, etc.)
2. Implement authentication (JWT tokens, login endpoint)
3. Add user profile management
4. Add email verification
5. Add password reset functionality
