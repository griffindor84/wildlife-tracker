# 🐾 Wildlife Tracker

A full-stack web application for tracking wildlife, managing observations, and supporting conservation decisions through real-time data and analytics.

---

## 🌍 Live Demo

- **Frontend:** [https://wildlife-tracker-1.onrender.com](https://wildlife-tracker-1.onrender.com)
- **Backend API:** [https://wildlife-tracker-qrv6.onrender.com](https://wildlife-tracker-qrv6.onrender.com)

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React + TypeScript | UI framework |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Supabase Auth | Authentication (login, register, sessions) |
| Axios | HTTP client with JWT interceptors |
| Leaflet | Interactive maps |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| PostgreSQL | Relational database |
| Supabase | Authentication & user management |
| bcryptjs | Password hashing |
| Multer | Image upload handling |
| Hugging Face API | Wildlife image analysis (AI) |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Render | Backend hosting (Web Service) |
| Render | Frontend hosting (Static Site) |
| Render PostgreSQL | Database hosting |
| Supabase | Authentication service |

---

## ✨ Features

- 🔐 **Authentication** — Secure login and registration via Supabase Auth
- 🗺️ **Live Tracking** — Monitor animal locations on an interactive map
- 🐘 **Species Management** — Add, edit, and manage tracked wildlife species
- 📋 **Observations** — Log and manage wildlife sightings with location and notes
- 📊 **Reports** — Submit and review wildlife reports with location mapping
- 🤖 **AI Image Analysis** — Upload wildlife images for automatic species identification
- 👤 **User Profiles** — Editable profiles with avatar support
- 🛡️ **Admin Panel** — Full dashboard for managing users, wildlife, and reports
- 🔒 **Role-Based Access** — Administrator and Ranger roles with different permissions
- 📱 **Responsive Design** — Works on desktop and mobile devices

---

## 📁 Project Structure

```
wildlife-tracker/
├── backend/
│   └── src/
│       ├── middleware/
│       │   ├── db.js           # PostgreSQL connection
│       │   ├── auth.js         # Supabase JWT verification
│       │   └── admin.js        # Admin role guard
│       ├── routes/
│       │   ├── auth.js         # POST /api/auth/sync, GET /api/auth/role/:id
│       │   ├── observations.js # GET, POST, DELETE /api/observations
│       │   ├── reports.js      # GET, POST, PATCH /api/reports
│       │   ├── users.js        # GET, PATCH, DELETE /api/users
│       │   ├── wildlife.js     # CRUD /api/wildlife
│       │   └── imageAnalysis.js # POST /api/analyze-image
│       └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   ├── axios.ts        # Axios instance with Supabase token interceptor
        │   ├── auth.ts         # Auth API calls
        │   ├── observations.ts # Observations API calls
        │   ├── reports.ts      # Reports API calls
        │   ├── wildlife.ts     # Wildlife CRUD API calls
        │   └── users.ts        # Admin users API calls
        ├── context/
        │   └── AuthContext.tsx # Supabase auth context + role management
        ├── lib/
        │   └── supabase.ts     # Supabase client initialization
        ├── admin/
        │   ├── AdminLayout.tsx # Admin panel layout with sidebar
        │   ├── Dashboard.tsx   # Stats dashboard
        │   ├── Users.tsx       # User management
        │   ├── Wildlife.tsx    # Wildlife management
        │   ├── AdminReports.tsx # Reports management
        │   ├── Settings.tsx    # Admin settings
        │   ├── Sidebar.tsx     # Admin sidebar navigation
        │   └── Topbar.tsx      # Admin topbar
        ├── pages/
        │   ├── home.tsx        # Public landing page
        │   ├── Login.tsx       # Login page
        │   ├── Register.tsx    # Register page
        │   ├── Observations.tsx # User observations
        │   ├── addobservation.tsx # Add observation form
        │   ├── Reports.tsx     # Submit & view reports
        │   ├── Species.tsx     # GBIF species browser
        │   ├── UserProfile.tsx # User profile & logout
        │   └── ...
        ├── components/
        │   ├── Navbar.tsx      # Responsive navbar with hamburger
        │   ├── Card.tsx        # Dashboard stat card
        │   └── LocationMap.tsx # Leaflet map component
        ├── App.tsx             # Routes & protected route logic
        └── main.tsx            # App entry point
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- A [Supabase](https://supabase.com) account (free)
- A [Hugging Face](https://huggingface.co) account (free)

---

### Backend Setup

```bash
cd backend
cp .env.example .env
npm install
```

Edit `.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@host:5432/wildlife_tracker
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
HF_API_KEY=hf_xxxxxxxxxxxxxxxx
NODE_ENV=development
```

Start the server:

```bash
npm run dev
```

API runs at `http://localhost:5000`

---

### Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## 🗄️ Database Setup

Run these SQL commands in your PostgreSQL database:

```sql
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  supabase_id UUID UNIQUE,
  name        VARCHAR(255),
  email       VARCHAR(255) UNIQUE NOT NULL,
  role        VARCHAR(50) NOT NULL DEFAULT 'Ranger',
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wildlife (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  species     VARCHAR(255),
  description TEXT,
  habitat     VARCHAR(255),
  status      VARCHAR(100),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS observations (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wildlife_id INTEGER REFERENCES wildlife(id) ON DELETE SET NULL,
  location    VARCHAR(255),
  notes       TEXT,
  observed_at TIMESTAMP DEFAULT NOW(),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255),
  description TEXT,
  status      VARCHAR(100) DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/sync` | No | Sync Supabase user to PostgreSQL |
| GET | `/api/auth/role/:supabaseId` | No | Get user role from DB |

### Observations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/observations` | Yes | Get current user's observations |
| POST | `/api/observations` | Yes | Create a new observation |
| DELETE | `/api/observations/:id` | Yes | Delete an observation |

### Reports
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reports` | Yes | All reports (admin) or own (ranger) |
| POST | `/api/reports` | Yes | Submit a report |
| PATCH | `/api/reports/:id/status` | Admin | Update report status |

### Wildlife
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wildlife` | Yes | List all species |
| POST | `/api/wildlife` | Admin | Add a new species |
| PUT | `/api/wildlife/:id` | Admin | Update a species |
| DELETE | `/api/wildlife/:id` | Admin | Delete a species |

### Users (Admin Only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | Admin | List all users |
| PATCH | `/api/users/:id/role` | Admin | Update user role |
| DELETE | `/api/users/:id` | Admin | Delete a user |

### Image Analysis
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/analyze-image` | No | Analyze wildlife image |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Returns `{ status: "ok" }` |

---

## 🔐 Authentication Flow

1. User registers/logs in via Supabase Auth
2. On registration, user is synced to PostgreSQL via `POST /api/auth/sync`
3. Supabase session token is stored in browser
4. Axios interceptor automatically attaches token to every API request
5. Backend `auth.js` middleware verifies token with Supabase, fetches user from DB
6. If token expires, user is redirected to `/login` automatically

---

## 👥 User Roles

| Role | Permissions |
|------|------------|
| **Ranger** | View wildlife, log observations, submit reports, view own data |
| **Administrator** | All ranger permissions + manage users, manage wildlife, view all reports, update report status |

**To promote a user to Administrator:**
```sql
UPDATE users SET role = 'Administrator' WHERE email = 'user@example.com';
```

---

## 🤖 AI Image Analysis

Upload a wildlife image to `/api/analyze-image` for automatic species identification powered by Hugging Face Vision API.

**Request:**
```
POST /api/analyze-image
Content-Type: multipart/form-data
Body: image (file)
```

**Response:**
```json
{
  "species": "African elephant",
  "labels": ["African elephant", "Indian elephant", "tusker"],
  "confidence": "high",
  "description": "Detected African elephant with 94.2% confidence.",
  "habitat": null,
  "raw": [
    { "label": "African elephant", "score": "94.2%" }
  ]
}
```

---

## 🚀 Deployment

### Render Deployment

**Backend (Web Service):**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node src/server.js`

**Frontend (Static Site):**
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

**Environment Variables — Backend:**
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_KEY=...
HF_API_KEY=hf_...
FRONTEND_URL=https://your-frontend.onrender.com
NODE_ENV=production
```

**Environment Variables — Frontend:**
```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🚧 Roadmap

- [ ] Real-time animal location updates via WebSockets
- [ ] Push notifications for unusual animal movements
- [ ] Mobile app (React Native)
- [ ] Export reports to PDF
- [ ] Advanced analytics dashboard with charts
- [ ] Integration with GPS tracking devices
- [ ] Multi-language support

---

## 📄 License

MIT License — free to use and modify for conservation projects.

---

## 🙏 Acknowledgements

Built with ❤️ for wildlife conservation.
Every tracked animal brings us one step closer to protecting our planet's biodiversity.

> *"The Earth does not belong to us, we belong to the Earth."*
