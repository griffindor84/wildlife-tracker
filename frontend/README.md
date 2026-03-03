# Wildlife Tracker – Frontend

React / TypeScript single-page application for the **Wildlife Tracker** platform — a data-driven tool for rangers, researchers, and conservationists to monitor wildlife, submit field reports, and manage conservation data.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI library |
| [TypeScript 5](https://www.typescriptlang.org/) | Static type safety |
| [Vite 7](https://vitejs.dev/) | Dev server & build tool |
| [React Router DOM 7](https://reactrouter.com/) | Client-side routing |
| [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) | Interactive maps |
| [GBIF API](https://www.gbif.org/developer/summary) | Live species taxonomy data |
| Plain CSS files | Component-level styling |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- The backend API running on `http://localhost:5000` (see `backend/README.md`)

### Install & run

```bash
cd frontend
npm install
npm run dev          # development server on http://localhost:5173
```

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server with hot-reload |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## Project Structure

```
frontend/
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── src/
│   ├── main.tsx             # App bootstrap (BrowserRouter, StrictMode)
│   ├── App.tsx              # Root route definitions & auth state
│   ├── types.ts             # Shared TypeScript interfaces
│   ├── Admin.css            # Shared admin panel styles (light & dark mode)
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx       # Top navigation bar (authenticated users)
│   │   ├── Navbar.css
│   │   ├── Sidebar.tsx      # Admin panel sidebar navigation
│   │   ├── Topbar.tsx       # Admin panel top bar (dark mode toggle)
│   │   ├── Card.tsx         # Generic stat/info card
│   │   └── LocationMap.tsx  # Interactive Leaflet map (click-to-pin)
│   ├── pages/               # Public & user-facing pages
│   │   ├── home.tsx         # Landing / home page
│   │   ├── home.css
│   │   ├── Login.tsx        # Sign-in form
│   │   ├── Register.tsx     # Account creation form
│   │   ├── Auth.css         # Shared login/register styles
│   │   ├── UserProfile.tsx  # View & edit user profile
│   │   ├── UserProfile.css
│   │   ├── Reports.tsx      # Wildlife report submission form + map
│   │   ├── Reports.css
│   │   ├── Observations.tsx # Personal field observation log
│   │   ├── Observations.css
│   │   ├── Species.tsx      # GBIF-powered species search & taxonomy
│   │   ├── Species.css
│   │   ├── Aboutus.tsx      # Mission & objectives page
│   │   ├── Aboutus.css
│   │   ├── addobservation.tsx  # Add observation form (with AI image analysis)
│   │   ├── addobservation.css
│   │   ├── contactus.tsx    # Contact form & details
│   │   └── contactus.css
│   └── admin/               # Admin-only panel (nested routes)
│       ├── AdminLayout.tsx  # Shell: Sidebar + Topbar + <Outlet />
│       ├── Admin.css        # Legacy admin CSS (superseded by src/Admin.css)
│       ├── Dashboard.tsx    # Animated stat cards
│       ├── Users.tsx        # User management table
│       ├── Wildlife.tsx     # Wildlife species management table
│       ├── Reports.tsx      # Reports & analytics placeholder
│       ├── AdminReports.tsx # Alternative reports view
│       ├── Settings.tsx     # System settings page
│       ├── Sidebar.tsx      # (legacy) Admin sidebar
│       └── Topbar.tsx       # (legacy) Admin topbar
```

---

## Routing

All routes are defined in `src/App.tsx`. Every route except `/login` and `/register` requires the user to be authenticated (a non-null `user` state). Unauthenticated visitors are redirected to `/login`.

| Path | Component | Auth? | Description |
|------|-----------|-------|-------------|
| `/` | `Home` | ✅ | Landing page with stats, features, and tracked species |
| `/login` | `Login` | ❌ | Sign-in form |
| `/register` | `Register` | ❌ | Account registration form |
| `/profile` | `UserProfile` | ✅ | View & edit the logged-in user's profile |
| `/observations` | `Observations` | ✅ | Personal field observation log |
| `/addobservation` | `AddObservation` | ✅ | Submit a new observation (with AI image tagging) |
| `/reports` | `Reports` | ✅ | Submit a wildlife incident report with map pin |
| `/species` | `Species` | ✅ | GBIF-powered species taxonomy search |
| `/aboutus` | `AboutUs` | ✅ | Platform mission & objectives |
| `/contactus` | `ContactUs` | ✅ | Contact form and organisation details |
| `/admin` | `AdminLayout` | ✅ | Admin shell (nested routes below) |
| `/admin/dashboard` | `Dashboard` | ✅ | Animated KPI cards |
| `/admin/users` | `Users` | ✅ | User management table |
| `/admin/wildlife` | `Wildlife` | ✅ | Wildlife species management table |
| `/admin/reports` | `AdminReports` | ✅ | Reports & analytics (placeholder) |
| `/admin/settings` | `Settings` | ✅ | System settings |

---

## Pages

### Home (`/`)
The public-facing landing page. Displays a hero section, live statistics (animals tracked, protected zones, monitoring status, species covered), a feature grid (Live Tracking, Species Management, Reports & Insights, Alerts & Safety), a grid of tracked species cards, and a call-to-action section. Links directly to the Admin Panel.

### Login (`/login`) & Register (`/register`)
Shared auth pages styled via `Auth.css`. On success both forms call their respective `onLogin` / `onRegister` callbacks which set the `user` state in `App.tsx` and redirect to `/`.

### User Profile (`/profile`)
Displays the logged-in user's name, role, email, bio, and join date. Supports toggling into **Edit Mode** to update name, role, email, bio, and upload a profile picture (max 5 MB, preview shown inline). Changes are saved locally to component state; a real backend integration point is noted in the code.

### Observations (`/observations`)
A personal field-report log filtered to the current user. Displays a table of sightings with date, species, location, observation type (General Sighting / Injured Animal / Illegal Activity), and expandable notes. Rows are clicked to expand or collapse the full notes text.

### Add Observation (`/addobservation`)
A form to submit a new wildlife observation: species name, location, date, additional notes, and a required image upload. On image selection the frontend calls `POST /api/analyze-image` on the backend — if the AI returns labels, the top suggestion is auto-filled into the species field and all suggestions are shown as clickable buttons.

### Reports (`/reports`)
A two-column layout for submitting wildlife incident reports. The left side contains a form (report type, species, location, date/time, description, photo upload). The right side renders an interactive **Leaflet map** (`LocationMap`) where users can click to pin a location or use the browser's Geolocation API to detect their current position. Coordinates are automatically populated into the location field.

### Species (`/species`)
Integrates live with the **GBIF (Global Biodiversity Information Facility) API** to search for animal taxonomy. As the user types a scientific name (debounced 600 ms), the page fetches up to 6 matching Animalia records, resolves a photo for each via GBIF occurrence images (falling back to Unsplash), and displays them as cards. Clicking **Full Analysis** opens a modal with the complete taxonomic classification (kingdom → genus) and total global occurrence record count.

### About Us (`/aboutus`)
Describes the platform's mission: precision monitoring, real-time insights, data-driven conservation, global collaboration, and public awareness. Also outlines the Observe → Analyze → Protect workflow.

### Contact Us (`/contactus`)
Two-column layout with a contact form (name, email, message) on the left and direct contact details (email, phone, headquarters, social media) on the right.

---

## Admin Panel

The admin panel is accessed at `/admin/*` and uses a **nested layout route** pattern. `AdminLayout` renders a persistent `Sidebar` and `Topbar` around whichever child route is active (`<Outlet />`).

### Admin Layout components

| Component | Location | Purpose |
|-----------|----------|---------|
| `AdminLayout` | `src/admin/AdminLayout.tsx` | Shell: Sidebar + Topbar + page content |
| `Sidebar` | `src/components/Sidebar.tsx` | Vertical nav with NavLinks to all admin sub-pages |
| `Topbar` | `src/components/Topbar.tsx` | Page title, dark mode toggle, logout button |

### Admin sub-pages

| Sub-page | Component | Description |
|----------|-----------|-------------|
| Dashboard | `admin/Dashboard.tsx` | Animated count-up cards: species tracked, animals monitored, protected zones, active alerts |
| Users | `admin/Users.tsx` | Table of users with Edit / Delete action buttons |
| Wildlife | `admin/Wildlife.tsx` | Table of tracked species (Elephant, Lion, Rhino, Giraffe) with Edit / Delete actions |
| Reports | `admin/AdminReports.tsx` | Reports & analytics placeholder (charts planned for future) |
| Settings | `admin/Settings.tsx` | System settings page (notifications, roles) |

### Dark Mode
The `Topbar` reads the `theme` key from `localStorage` on mount. Toggling the button adds/removes the `.dark` CSS class from `document.body`, which activates the dark-mode CSS variable overrides defined in `src/Admin.css`.

---

## Shared Components

### `Navbar` (`src/components/Navbar.tsx`)
Horizontal navigation bar rendered only when a user is authenticated. Contains links to all main pages and the admin panel.

### `Card` (`src/components/Card.tsx`)
Simple stat/info card with a title and a `string | number` value. Used by the admin `Dashboard` to display animated KPI counters.

### `LocationMap` (`src/components/LocationMap.tsx`)
Wraps `react-leaflet` to provide a click-to-pin interactive map. Props:

| Prop | Type | Description |
|------|------|-------------|
| `onLocationSelect` | `(coords: Coords) => void` | Called with `{ lat, lng }` on every map click |
| `initialCoords` | `Coords \| null \| undefined` | When provided, centers the map and places the marker at those coordinates |

---

## TypeScript Types (`src/types.ts`)

| Type | Description |
|------|-------------|
| `User` | Core user shape used throughout `App.tsx` and child pages (`name`, `email`, `joinDate?`, `role?`, `about?`, `avatarUrl?`) |
| `UserData` | Stricter variant requiring `joinDate` (used in `UserProfile`) |
| `LoginFormData` | `{ email, password }` |
| `RegisterFormData` | `{ name, email, password, confirmPassword }` |
| `PageType` | Union `'login' \| 'register' \| 'profile'` |

---

## Authentication Flow

Authentication is currently managed **client-side only** via React state in `App.tsx`. There is no JWT persistence across page refreshes; users must log in each session.

```
User visits any protected route
        │
        ▼
  user state null?
   ├── Yes → redirect to /login
   └── No  → render requested page

/login    → handleLogin(userData)    → setUser(userData) → navigate("/")
/register → handleRegister(userData) → setUser(userData) → navigate("/")
/profile  → Logout button → handleLogout() → setUser(null) → navigate("/login")
```

> **Note:** `Login.tsx` currently uses a mock login (simulates any credentials as successful). Wiring to the real `POST /api/auth/login` backend endpoint is the next integration step.

---

## Styling

All styles are plain CSS files co-located with their component. Global admin styles live in `src/Admin.css` and define CSS custom properties for both light and dark mode:

```css
:root {
  --bg: #f4f7f5;
  --card: #ffffff;
  --text: #1f2937;
  --accent: #22c55e;   /* green accent colour */
}

.dark {
  --bg: #0f172a;
  --card: #1e293b;
  --text: #e5e7eb;
  --accent: #22c55e;
}
```

The green conservation theme (`#22c55e`) is used consistently as the primary accent color throughout the application.

