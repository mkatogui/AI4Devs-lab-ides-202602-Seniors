# Development Guide — LTI Talent Tracking System

This guide provides step-by-step instructions for setting up the development environment for the LTI (Talent Tracking System) ATS project. The stack is **React (Create React App)** frontend, **Express (TypeScript)** backend, and **PostgreSQL** via Docker, with **Prisma** as the ORM.

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Docker** and **Docker Compose**
- **Git**

## 1. Clone the repository

```bash
git clone <your-fork-url>
cd AI4Devs-lab-ides-202602-Seniors
```

## 2. Environment configuration

**Backend** (`backend/.env`):

Use the same credentials as in `docker-compose.yml`:

- **Host**: localhost  
- **Port**: 5432  
- **User**: LTIdbUser  
- **Password**: D1ymf8wyQEGthFR1E9xhCq  
- **Database**: LTIdb  

Example:

```env
DATABASE_URL="postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5432/LTIdb"
JWT_SECRET=your-secret-in-production
```

After the first migration, seed the default login user (optional; run once):

```bash
cd backend
npm run prisma:seed
```

This creates two local test users. Use either at http://localhost:3000/login:

| Email | Password |
|-------|----------|
| recruiter@lti.demo | demo123 |
| test@lti.demo | test123 |

**Frontend** (`frontend/.env`):

Point to the backend API (default backend port is **3010**):

```env
REACT_APP_API_URL=http://localhost:3010
```

## 3. Database (PostgreSQL with Docker)

From the **project root**:

```bash
docker-compose up -d
```

PostgreSQL will be available at:

- **Host**: localhost  
- **Port**: 5432  
- **Database**: LTIdb  
- **User**: LTIdbUser  
- **Password**: D1ymf8wyQEGthFR1E9xhCq  

Stop the database:

```bash
docker-compose down
```

## 4. Backend setup and run

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run build
npm run dev
```

- Backend API: **http://localhost:3010**

## 5. Frontend setup and run

In a **new terminal** from the project root:

```bash
cd frontend
npm install
npm run build
npm start
```

- Frontend: **http://localhost:3000**

## 6. CV upload storage (Add Candidate feature)

- Uploaded CVs (PDF/DOCX) are stored under **`backend/uploads/cvs/`**.
- This directory is in `.gitignore` (`backend/uploads`). The backend creates it at startup or on first upload if missing.
- See [data-model.md](./data-model.md) for the Candidate model and `cvFilePath` field.

## 7. Login

- The app requires login to access the dashboard and Add Candidate.
- **Default user** (after `npm run prisma:seed` in backend): **recruiter@lti.demo** / **demo123**.
- Unauthenticated visits to `/` or `/candidates/new` redirect to **http://localhost:3000/login**.
- Auth: `POST /auth/login` (email + password) returns a JWT; the frontend sends `Authorization: Bearer <token>` on `/candidates` requests.

## 8. Summary

| Service   | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:3000   |
| Backend  | http://localhost:3010   |
| DB       | localhost:5432 (LTIdb)  |
| Login    | /login (recruiter@lti.demo / demo123) |

## Testing

**Backend**

```bash
cd backend
npm test
```

**Frontend**

```bash
cd frontend
npm test
```

## Tech stack (this project)

- **Frontend**: React 18, Create React App, TypeScript. UI: **Universal Design System (UDS)** via `@mkatogui/uds-react` and `@mkatogui/uds-tokens`. See project root [README.md](../../README.md) and [frontend-standards.mdc](./frontend-standards.mdc).
- **Backend**: Node.js, Express, TypeScript, Prisma.
- **Database**: PostgreSQL (Docker), Prisma ORM.
