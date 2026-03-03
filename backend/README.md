# Wildlife Tracker – Backend API

Node.js / Express REST API for the Wildlife Tracker application.

## Getting started

```bash
cd backend
cp .env.example .env   # edit values as needed
npm install
npm run dev            # auto-restarts on file changes (Node ≥ 18)
# or
npm start
```

The server listens on **http://localhost:5000** by default.

## Environment variables

| Variable       | Default                    | Description                         |
|----------------|----------------------------|-------------------------------------|
| `PORT`         | `5000`                     | Port the API listens on             |
| `JWT_SECRET`   | `wildlife-tracker-secret-key` | Secret used to sign JWTs (change in prod!) |
| `FRONTEND_URL` | `http://localhost:5173`    | Allowed CORS origin                 |

## API Endpoints

### Auth
| Method | Path | Auth? | Description |
|--------|------|-------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive a JWT |

### Observations (user-scoped)
| Method | Path | Auth? | Description |
|--------|------|-------|-------------|
| GET | `/api/observations` | Yes | List the current user's observations |
| POST | `/api/observations` | Yes | Create a new observation |
| DELETE | `/api/observations/:id` | Yes | Delete an observation |

### Reports
| Method | Path | Auth? | Description |
|--------|------|-------|-------------|
| GET | `/api/reports` | Yes | List reports (all for admins, own for others) |
| POST | `/api/reports` | Yes | Submit a new report |

### Users (admin only)
| Method | Path | Auth? | Description |
|--------|------|-------|-------------|
| GET | `/api/users` | Admin | List all users |
| DELETE | `/api/users/:id` | Admin | Delete a user |

### Wildlife (admin write)
| Method | Path | Auth? | Description |
|--------|------|-------|-------------|
| GET | `/api/wildlife` | Yes | List tracked species |
| POST | `/api/wildlife` | Admin | Add a new species entry |
| PUT | `/api/wildlife/:id` | Admin | Update a species entry |
| DELETE | `/api/wildlife/:id` | Admin | Delete a species entry |

### Image Analysis
| Method | Path | Auth? | Description |
|--------|------|-------|-------------|
| POST | `/api/analyze-image` | No | Upload an image (`multipart/form-data`, field `image`); returns `{ labels: string[] }` |

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Returns `{ status: "ok" }` |

## Authentication

After a successful login or register call you receive a JWT token:

```json
{
  "token": "<jwt>",
  "user": { "id": 1, "name": "...", "email": "...", "role": "Ranger" }
}
```

Pass the token in the `Authorization` header for protected routes:

```
Authorization: Bearer <jwt>
```

## Data storage

Data is persisted in a **SQLite** database (`data/wildlife.db`), managed with
[better-sqlite3](https://github.com/WiseLibs/better-sqlite3).

The database file is created automatically on first start.  Tables are created
via `CREATE TABLE IF NOT EXISTS` statements in `middleware/db.js`, which also
seeds the default users, observations, reports and wildlife rows if the tables
are empty.

The `data/*.db` files are excluded from version control via `.gitignore`.

> **Upgrading to PostgreSQL / MySQL:**  
> Swap `better-sqlite3` for the `pg` or `mysql2` package and update the
> `middleware/db.js` connection.  All route files use standard SQL and require
> only minor adjustments (e.g. `$1` placeholders instead of `?`).


## Default users

| Email | Password | Role |
|-------|----------|------|
| `admin@wildlifetracker.com` | `password` | Administrator |
| `john@example.com` | `password` | Ranger |
