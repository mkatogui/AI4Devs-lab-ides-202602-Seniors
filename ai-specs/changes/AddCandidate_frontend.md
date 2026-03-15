# Ticket 3 — Frontend: Recruiter dashboard, Add Candidate form, validation, upload, feedback, a11y

## Goal

The recruiter sees a dashboard with a visible "Add candidate" entry and a form to submit candidate data and optional CV; receives success or error feedback; and the UI is accessible and responsive. Depends on Ticket 2 (backend POST /candidates) being available.

## Reference

- User story: **Add Candidate to the System**.
- Frontend standards (UDS mandatory): [ai-specs/specs/frontend-standards.mdc](../specs/frontend-standards.mdc).
- App entry: [frontend/src/App.tsx](../../frontend/src/App.tsx); [frontend/src/index.tsx](../../frontend/src/index.tsx).

---

## Scope

### 1. Routing

- Install **react-router-dom** (e.g. `npm install react-router-dom`).
- Define routes:
  - **`/`** — Recruiter dashboard (main page).
  - **`/candidates/new`** (or **`/add-candidate`**) — Add candidate form page.
- Wrap the app with `BrowserRouter` in [frontend/src/index.tsx](../../frontend/src/index.tsx) (or App.tsx) and use `Routes` / `Route` to render the dashboard and form.
- **Acceptance criterion:** From the main page (dashboard), there must be a **clearly visible** button or link labeled "Add candidate" (or equivalent) that navigates to the form.

### 2. Dashboard page

- **Route:** `/`.
- **Content:** Title such as "Recruiter dashboard" (or "LTI — Talent Tracking System"); a prominent **button or link: "Add candidate"** that navigates to `/candidates/new` (or chosen path) using React Router (e.g. `Link` or `useNavigate`).
- **UI:** Use only **UDS** components from `@mkatogui/uds-react` (e.g. Card, Button). No Bootstrap or other component libraries. Follow [frontend-standards.mdc](../specs/frontend-standards.mdc).

### 3. Add-candidate form page

- **Route:** `/candidates/new` (or `/add-candidate`).
- **Fields (match backend):** firstName, lastName, email (required); phone, address, education, experience (optional). For education and experience, use text inputs or textareas for this ticket (structured sub-forms can be a follow-up). **File input:** CV upload, accept PDF and DOCX; optional client-side size check (e.g. 10MB).
- **UI:** Use UDS components (Input, Button, Card, etc.). All inputs must have visible **labels** and be associated for accessibility (e.g. `htmlFor` / `id`).
- **Validation (client-side):**
  - Required: firstName, lastName, email non-empty; email in valid format (e.g. regex or simple pattern).
  - Show inline errors or a summary (e.g. below form or next to fields). Optionally prevent submit until valid, or allow submit and show errors on submit.
- **Submit:**
  - If **no file:** POST JSON to backend `POST /candidates` with `Content-Type: application/json`. Base URL from `process.env.REACT_APP_API_URL` or default `http://localhost:3010`.
  - If **file present:** POST as **multipart/form-data** to `POST /candidates` with fields firstName, lastName, email, phone?, address?, education?, experience?, and file field `cv`.
- **Loading state:** While the request is in progress, disable the submit button and show a loading indicator or text (e.g. "Saving...").
- **Success:** Show a confirmation message: "Candidate added successfully." Then redirect to the dashboard (or clear the form). Use React Router `useNavigate` for redirect.
- **Error:** On network failure or 4xx/5xx response, show a user-friendly message (e.g. "Connection error" or the server `message`/`error` if available). Do not leave the user without feedback (acceptance: errors and exceptions handled).

### 4. Accessibility and compatibility

- **Labels:** Every form field has a visible label and correct association (e.g. `label` + `id` / `htmlFor`).
- **Semantic HTML:** Use form, fieldset, legend where appropriate; use headings (h1, h2) for page structure.
- **Keyboard:** Form and "Add candidate" button/link are focusable and usable via keyboard.
- **Responsive:** Layout works on different viewports (desktop and mobile). UDS supports this; follow its patterns and avoid fixed widths where they break layout.

### 5. Optional (deferred)

- **Autocomplete** for education/experience from existing data: can be a follow-up ticket (e.g. GET /candidates or a suggestions endpoint). Not required for this ticket.

---

## Out of scope (this ticket)

- Full list of candidates (table or list view) — separate ticket.
- Authentication UI.
- Edit/delete candidate.

---

## Definition of done

- [ ] React Router installed; routes `/` (dashboard) and `/candidates/new` (or `/add-candidate`) work.
- [ ] Dashboard shows a clearly visible "Add candidate" button/link that navigates to the form.
- [ ] Add-candidate form has all required and optional fields; uses UDS components only; includes CV file input (accept PDF/DOCX).
- [ ] Client-side validation for required fields and email format; errors shown to the user.
- [ ] Submit sends JSON or multipart to `REACT_APP_API_URL/candidates`; loading state and success/error handling implemented.
- [ ] Success shows "Candidate added successfully" and redirects to dashboard (or clears form).
- [ ] Errors (network or server) show a user-friendly message.
- [ ] Form and dashboard are accessible (labels, semantic HTML, keyboard) and responsive.
- [ ] All text and messages in English.

---

## Implementation order (for developer/AI)

1. Install `react-router-dom`. Wrap app with `BrowserRouter`; add `Routes` and `Route` for `/` and `/candidates/new` (or `/add-candidate`).
2. Create a **Dashboard** component (or page) for `/`: title + "Add candidate" button/link (Link or useNavigate).
3. Create an **AddCandidateForm** (or **AddCandidate** page) component for `/candidates/new`: form with firstName, lastName, email, phone, address, education, experience, CV file input. Use UDS Input/Button/Card. Use controlled state (useState) for all fields.
4. Implement client-side validation (required + email format); set error state and display errors.
5. On submit: build JSON or FormData; call `fetch` or axios to `REACT_APP_API_URL/candidates`; set loading true/false; on 201 show success and navigate to `/`; on error show message.
6. Ensure labels and IDs; check keyboard navigation and responsive layout.
7. Optionally add a link on the form page back to the dashboard ("Back to dashboard").
