# DevPulse API

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## 🔗 Links

- **Live URL:** https://level2project-wine.vercel.app
- **GitHub:** https://github.com/yourusername/devpulse

---

## ✨ Features

- User registration and authentication with JWT
- Role-based access control (contributor & maintainer)
- Create, read, update, and delete issue reports
- Filter and sort issues by type, status, and date
- Reporter details fetched without SQL JOINs
- Metrics dashboard for maintainers
- Secure password hashing with bcrypt

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js (24.x) | Runtime |
| TypeScript | Type safety |
| Express.js | Web framework |
| PostgreSQL (NeonDB) | Database |
| Raw SQL (pg) | Database driver |
| bcrypt | Password hashing |
| jsonwebtoken | Authentication |
| Vercel | Deployment |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 24.x or higher
- PostgreSQL database (NeonDB recommended)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/devpulse.git
cd devpulse

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
```

Fill in your `.env`:
```env
CONNECTION_STRING=your_neondb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

```bash
# 4. Start development server
npm run dev
```

Server runs at `http://localhost:5000`

---

## 🗄️ Database Schema

### `users` table

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | Auto-incrementing ID |
| `name` | VARCHAR(100) NOT NULL | Full display name |
| `email` | VARCHAR(100) UNIQUE NOT NULL | Login email |
| `password` | TEXT NOT NULL | Bcrypt hashed password |
| `role` | VARCHAR(20) DEFAULT 'contributor' | contributor or maintainer |
| `created_at` | TIMESTAMP DEFAULT NOW() | Account creation time |
| `updated_at` | TIMESTAMP DEFAULT NOW() | Last update time |

### `issues` table

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | Auto-incrementing ID |
| `title` | VARCHAR(150) NOT NULL | Issue headline (max 150 chars) |
| `description` | TEXT NOT NULL | Detailed description (min 20 chars) |
| `type` | VARCHAR(20) NOT NULL | bug or feature_request |
| `status` | VARCHAR(20) DEFAULT 'open' | open, in_progress, or resolved |
| `reporter_id` | INTEGER | ID of the user who created the issue |
| `created_at` | TIMESTAMP DEFAULT NOW() | Issue creation time |
| `updated_at` | TIMESTAMP DEFAULT NOW() | Last update time |

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues (supports filters) |
| GET | `/api/issues/:id` | Public | Get a single issue |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

### Metrics

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/metrics` | Maintainer only | Get system metrics |

---

### Query Parameters (GET /api/issues)

| Param | Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | none |
| `status` | `open`, `in_progress`, `resolved` | none |

**Example:** `GET /api/issues?sort=oldest&type=bug&status=open`

---

### Authentication Header

All protected endpoints require:
```
Authorization: <JWT_TOKEN>
```

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| **contributor** | Register, login, create issues, view all issues, update own open issues |
| **maintainer** | All contributor permissions + update any issue, delete any issue, change issue status, view metrics |

---

## 📦 Response Format

### Success
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```

---

## 🏗️ Project Structure

```
src/
├── config/          # Environment config
├── middleware/      # Auth, error handler
├── modules/
│   ├── auth/        # Signup, login
│   ├── issues/      # Issue CRUD
│   └── metric/      # Metrics
├── types/           # TypeScript types
├── utility/         # Helper functions
├── db.ts            # PostgreSQL pool
└── server.ts        # Entry point
```