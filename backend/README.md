# Wildlife Tracker Backend API

Node.js and Express REST API for Wildlife Tracker. The backend uses Neon PostgreSQL through `pg` and handles authentication with JWTs and bcrypt password hashes.

## Setup

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Environment Variables

Create `backend/.env` with:

```text
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
HF_API_KEY=<optional-image-analysis-key>
```

For Render, set `DATABASE_URL` to your Neon connection string and set `FRONTEND_URL` to your deployed frontend URL.

Do not use the old Supabase variables anymore:

```text
SUPABASE_URL
SUPABASE_SERVICE_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## Database

This project expects a PostgreSQL database with these tables:

- `users`
- `wildlife`
- `observations`
- `reports`

Use the ready-to-run Neon schema and seed file:

```bash
psql "$DATABASE_URL" -f ../docs/neon-schema-and-seed.sql
```

Or paste [../docs/neon-schema-and-seed.sql](../docs/neon-schema-and-seed.sql) into the Neon SQL Editor.

Sample seeded logins:

| Email | Password | Role |
|---|---|---|
| `admin@wildlifetracker.com` | `Admin12345` | Administrator |
| `john@example.com` | `Ranger12345` | Ranger |
| `amina@example.com` | `Ranger12345` | Ranger |

## Authentication

Login and register return a JWT:

```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@wildlifetracker.com",
    "role": "Administrator"
  }
}
```

Send the token with protected requests:

```text
Authorization: Bearer <jwt>
```

## API Endpoints

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a Ranger account |
| `POST` | `/api/auth/login` | No | Login and receive a JWT |
| `GET` | `/api/auth/me` | Yes | Get the current user |
| `PATCH` | `/api/auth/me` | Yes | Update current user's profile |

### Observations

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/observations` | Yes | Rangers see their own observations; admins see all observations |
| `POST` | `/api/observations` | Yes | Create an observation for the current user |
| `DELETE` | `/api/observations/:id` | Yes | Rangers can delete their own observations; admins can delete any |

### Reports

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reports` | Yes | Rangers see their own reports; admins see all reports |
| `POST` | `/api/reports` | Yes | Submit a report |
| `PATCH` | `/api/reports/:id/status` | Admin | Update report status |

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users` | Admin | List users |
| `PATCH` | `/api/users/:id/role` | Admin | Update a user role |
| `DELETE` | `/api/users/:id` | Admin | Delete a user |

### Wildlife

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/wildlife` | Yes | List tracked species |
| `POST` | `/api/wildlife` | Admin | Add a species entry |
| `PUT` | `/api/wildlife/:id` | Admin | Update a species entry |
| `DELETE` | `/api/wildlife/:id` | Admin | Delete a species entry |

### Image Analysis

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/analyze-image` | No | Upload `multipart/form-data` image field and receive labels |

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ "status": "ok" }` |

## Scripts

```bash
npm run dev
npm start
```
