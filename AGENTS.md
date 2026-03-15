# Cursor — Agent instructions

This project is developed with **Cursor**. Use this file as the main context for the AI when working in this repo.

**Project:** LTI — Talent Tracking System. Full-stack ATS: React (Create React App) + Express (TypeScript) + Prisma + PostgreSQL. UI uses **Universal Design System (UDS)** only (`@mkatogui/uds-react`).

## Rules and standards

- Follow **`ai-specs/specs/base-standards.mdc`** — it links to backend, frontend, UDS, and documentation standards. Cursor rules in `.cursor/rules/` also point there.
- Work in **small steps**; keep code **typed** and in **English**.

## Key paths

| What            | Where |
|-----------------|--------|
| Base standards  | `ai-specs/specs/base-standards.mdc` |
| Frontend specs | `ai-specs/specs/frontend-standards.mdc` |
| Backend specs   | `ai-specs/specs/backend-standards.mdc` |
| UDS usage       | `ai-specs/specs/uds-reference.md` |
| Cursor rules    | `.cursor/rules/use-base-rules.mdc` |
| App entry HTML  | `frontend/public/index.html` (UDS `data-theme`) |
| App entry JS    | `frontend/src/index.tsx`, `frontend/src/App.tsx` |
| API entry       | `backend/src/index.ts` |
| Schema / seed   | `backend/prisma/schema.prisma`, `backend/prisma/seed.ts` |

## Run the project

- **One command (root):** `npm run dev` — starts backend (3010) and frontend (3000).
- **DB:** `docker-compose up -d` then `cd backend && npx prisma migrate dev` and `npx prisma db seed` for test users (e.g. recruiter@lti.demo / demo123).

Do not change stack or add unrelated libraries; stay aligned with the existing specs and structure.
