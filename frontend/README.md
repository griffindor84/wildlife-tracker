# Wildlife Tracker Frontend

React, TypeScript, and Vite frontend for Wildlife Tracker. The frontend talks to the Express backend API and stores the backend JWT in `localStorage`.

## Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Environment Variables

Create `frontend/.env` with:

```text
VITE_API_URL=http://localhost:5000/api
```

For Render, set:

```text
VITE_API_URL=https://<your-backend-service>.onrender.com/api
```

After changing frontend environment variables on Render, redeploy the frontend because Vite bakes env values into the build.

Do not use the old Supabase frontend variables anymore:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_SERVICE_KEY
```

## Auth Flow

- Login and register call the Express backend.
- The backend returns `{ token, user }`.
- The token is saved as `authToken` in `localStorage`.
- Axios attaches `Authorization: Bearer <token>` to API requests.
- Logout clears the saved token and user.

## Main Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home page |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/observations` | Authenticated | Current user's own observations |
| `/addobservation` | Authenticated | Add a new observation |
| `/reports` | Authenticated | Current user's reports |
| `/species` | Authenticated | Species search and tracked wildlife |
| `/profile` | Authenticated | User profile |
| `/admin/dashboard` | Admin | Admin dashboard |
| `/admin/users` | Admin | Manage users |
| `/admin/wildlife` | Admin | Manage wildlife records |
| `/admin/observations` | Admin | Manage all observations |
| `/admin/reports` | Admin | Manage all reports |
| `/admin/settings` | Admin | Admin settings |

## Sample Logins

If you seeded Neon with [../docs/neon-schema-and-seed.sql](../docs/neon-schema-and-seed.sql):

| Email | Password | Role |
|---|---|---|
| `admin@wildlifetracker.com` | `Admin12345` | Administrator |
| `john@example.com` | `Ranger12345` | Ranger |
| `amina@example.com` | `Ranger12345` | Ranger |

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
