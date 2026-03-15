# Ticket 2 — Backend: Create candidate API, validation, file upload, security

## Goal

Expose a secure API to create a candidate (form data + optional CV file), validate input, store data and file, and return clear success/error responses. Depends on Ticket 1 (database and upload directory) being done.

## Reference

- User story: **Add Candidate to the System**.
- API spec: [ai-specs/specs/api-spec.yml](../specs/api-spec.yml).
- Backend standards: [ai-specs/specs/backend-standards.mdc](../specs/backend-standards.mdc).
- Entry point: [backend/src/index.ts](../../backend/src/index.ts).

---

## Scope

### 1. API contract

- **Endpoint:** `POST /candidates` (or `POST /api/candidates` if the app is mounted under `/api`). Use a single path consistently.
- **Request:**
  - **Content-Type: application/json** — body with: `firstName`, `lastName`, `email` (required); `phone`, `address`, `education`, `experience` optional (strings or structured per data model). No file in JSON flow; CV can be omitted or uploaded separately if desired, but for this ticket support at least one way to create a candidate with an optional CV.
  - **Content-Type: multipart/form-data** — fields: `firstName`, `lastName`, `email` (required); `phone`, `address`, `education`, `experience` optional; file field `cv` (optional, PDF or DOCX, max 10MB). This allows form + file in one request.
- **Success response:** HTTP 201, body JSON: `{ "message": "Candidate created successfully", "data": { "id", "firstName", "lastName", "email", "phone", "address", "cvFilePath", "createdAt", ... } }` (include only safe, public fields). If Education/WorkExperience are stored as relations, include them in `data` or document that they are returned.
- **Error responses:**
  - 400 — Validation error (missing required fields, invalid email, invalid file type/size, duplicate email). Body: `{ "message": "...", "error": "..." }`.
  - 500 — Server or database error. Body: generic message; do not leak stack traces or internal details.

Align with existing [api-spec.yml](../specs/api-spec.yml) for `POST /candidates` and `CreateCandidateRequest` / `CreateCandidateResponse`. If the implementation accepts multipart in addition to JSON, add a note or example in the api-spec.

### 2. Validation (server-side)

- **Required:** `firstName`, `lastName`, `email` — non-empty strings; `email` must match a valid email format (e.g. regex or validator library).
- **Optional:** `phone`, `address` — strings; `education`, `experience` — if sending as JSON, can be strings or arrays of objects matching Education/WorkExperience (institution, title, startDate, endDate; company, position, description, startDate, endDate). Validate types and required sub-fields if structured.
- **File (when multipart):** If field `cv` is present: allow only PDF (`application/pdf`) and DOCX (e.g. `application/vnd.openxmlformats-officedocument.wordprocessingml.document`); max size 10MB. Reject with 400 and a clear message otherwise (e.g. "CV must be PDF or DOCX, max 10MB").

### 3. Implementation

- **Express:** Use `express.json()` for JSON bodies. Use **multer** (or equivalent) for multipart/form-data. Configure multer to store files in the upload directory defined in Ticket 1 (e.g. `backend/uploads/cvs/`). Use a safe filename (e.g. `uuid.v4() + path.extname(originalname)` or similar) to avoid collisions and path traversal.
- **Prisma:** Create `Candidate` (and related `Education` / `WorkExperience` if normalized). If a file was uploaded, set `cvFilePath` to the stored path (relative or absolute as agreed in Ticket 1).
- **Security:** No credentials or secrets in code; use `process.env` for `DATABASE_URL` and upload path. Sanitize filenames (no path traversal, no executable extensions). Do not execute uploaded files. Ensure upload directory is not served as static content with execute permissions.

### 4. Error handling

- Use a single error-handling middleware (e.g. `app.use((err, req, res, next) => { ... })`) so all errors return a consistent JSON shape.
- Validation errors (from a validator function or middleware) → 400 with message.
- Duplicate email (Prisma unique constraint) → 400 with message like "Email already registered".
- Database or unexpected errors → 500 with a generic message (e.g. "An error occurred. Please try again."). Log details server-side only.

### 5. CORS

- Enable CORS for the frontend origin (e.g. `http://localhost:3000`). Use the `cors` package or set headers manually so that the React app can call `POST /candidates` from the browser.

---

## Out of scope (this ticket)

- GET /candidates (list) — can be a separate task.
- Authentication/authorization — unless explicitly required.
- PATCH/DELETE candidate.

---

## Definition of done

- [ ] `POST /candidates` accepts JSON and creates a candidate (with optional education/experience if supported by schema).
- [ ] `POST /candidates` accepts multipart/form-data with form fields + optional `cv` file; file is validated (PDF/DOCX, max 10MB), stored in the upload directory, and path saved on Candidate.
- [ ] Validation returns 400 with clear messages for invalid or missing required fields, invalid email, duplicate email, and invalid file.
- [ ] Success returns 201 with created candidate data; errors return 400/500 with consistent JSON format.
- [ ] CORS allows the frontend origin (e.g. http://localhost:3000).
- [ ] No sensitive data or stack traces in error responses; all names and messages in English.

---

## Implementation order (for developer/AI)

1. Add dependencies: `cors`, `multer`; add types if needed (`@types/multer`, `@types/cors`).
2. Create upload directory at startup if it does not exist (path from Ticket 1).
3. Configure Express: `express.json()`, `cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' })`, multer for multipart (limit 10MB, file filter for PDF/DOCX).
4. Implement a validation function (or middleware) for candidate payload (required + email format).
5. Implement POST /candidates handler: parse JSON or multipart; validate; create Candidate (and Education/WorkExperience if applicable); if file present, save with safe name and set `cvFilePath`; return 201 with candidate data.
6. Implement error middleware: map validation/duplicate to 400, others to 500; return JSON `{ message, error }`.
7. Register route in [backend/src/index.ts](../../backend/src/index.ts) (or in a separate routes file and mount it).
8. Optionally update [ai-specs/specs/api-spec.yml](../specs/api-spec.yml) to document multipart for POST /candidates.
