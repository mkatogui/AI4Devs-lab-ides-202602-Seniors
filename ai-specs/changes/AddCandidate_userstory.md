# Enriched user story: Add Candidate to the System

This document provides a single reference for acceptance criteria, validations, and error handling so that the three technical tickets (database, backend, frontend) stay aligned.

---

## User story

**As a** recruiter,  
**I want** to add candidates to the ATS with their data and optional CV,  
**So that** I can manage their information and selection processes efficiently.

---

## Acceptance criteria

| # | Criterion | How it is covered |
|---|-----------|-------------------|
| 1 | **Accesibility of the function** — A clearly visible button or link to add a new candidate from the main recruiter dashboard. | Frontend: Dashboard at `/` with prominent "Add candidate" button/link to form. |
| 2 | **Form** — Form with fields: name, surname, email, phone, address, education, experience. | Frontend: Add-candidate form with all fields; Backend: API accepts these fields. |
| 3 | **Validation** — Data is complete and correct; valid email format; required fields not empty. | Frontend: Client-side validation; Backend: Server-side validation; 400 on invalid data. |
| 4 | **CV upload** — Option to upload candidate CV in PDF or DOCX. | Frontend: File input (PDF/DOCX); Backend: multipart/form-data, file validation (type, size ≤10MB), store file and path. |
| 5 | **Confirmation** — After successful submit, show message that candidate was added successfully. | Frontend: Success message and redirect to dashboard (or clear form). |
| 6 | **Errors and exceptions** — On error (e.g. server/connection failure), show an adequate message to the user. | Frontend: Display error message on network or 4xx/5xx; Backend: Consistent 400/500 JSON responses. |
| 7 | **Accessibility and compatibility** — Usable across devices and browsers, accessible. | Frontend: UDS components, labels, semantic HTML, keyboard support, responsive layout. |

---

## Validation rules (shared)

- **Required:** firstName, lastName, email (non-empty).
- **Email:** Valid format (e.g. `*@*.*` or stricter regex).
- **CV (if present):** PDF or DOCX only; max size 10MB.
- **Duplicate email:** Treated as validation error (400) with clear message.

---

## Error handling (shared)

- **Client:** Show user-friendly message on network error or non-2xx response; do not expose raw stack or internal details.
- **Server:** 400 for validation/duplicate email; 500 for unexpected errors with generic message; all responses JSON `{ message?, error? }`; no stack traces in body.

---

## Technical tickets

- **Ticket 1 — Database:** [AddCandidate_database.md](./AddCandidate_database.md)
- **Ticket 2 — Backend:** [AddCandidate_backend.md](./AddCandidate_backend.md)
- **Ticket 3 — Frontend:** [AddCandidate_frontend.md](./AddCandidate_frontend.md)

Implement in order: 1 → 2 → 3. Record prompts used in [prompts-iniciales.md](../../prompts-iniciales.md).
