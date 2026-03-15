# Ticket — List candidates (view added talent)

## Goal

As a recruiter, I can **see the list of added candidates** (talent) so that I can confirm who has been added and manage them. After adding a candidate, the user currently has no way to view them; this ticket adds a list view (on the dashboard or a dedicated page) and the backend endpoint to load it.

## Reference

- User story: **Add Candidate to the System** (extended: recruiter must be able to see added candidates).
- API spec: [ai-specs/specs/api-spec.yml](../specs/api-spec.yml) — `GET /candidates` is already specified (paginated list).
- Data model: [ai-specs/specs/data-model.md](../specs/data-model.md).
- Frontend standards (UDS): [ai-specs/specs/frontend-standards.mdc](../specs/frontend-standards.mdc).
- Auth: List endpoint must be protected with the same auth as `POST /candidates` (JWT via `requireAuth`).

---

## Scope

### 1. Backend — GET /candidates

**File:** `backend/src/routes/candidates.ts`

- **Implement** `GET /candidates` (already protected by `requireAuth` on the router).
- **Response:** JSON array of candidates suitable for a list view. Minimum fields per item: `id`, `firstName`, `lastName`, `email`, `phone` (optional), `createdAt`. Optional: `address`, `cvFilePath` if useful for the list.
- **Order:** By `createdAt` descending (newest first) by default.
- **Pagination (optional for this ticket):** The API spec defines `page`, `limit`, `search`, `sort`, `order`. For an initial implementation, returning all candidates (or a simple default limit, e.g. 50) is acceptable; add full pagination/search in a follow-up if needed.
- **Include relations (optional):** For a simple list, `educations` and `workExperiences` can be omitted; include them only if the list UI needs to show a summary (e.g. “2 educations”). Prefer a lean response for the list.
- **Errors:** 401 if not authenticated (handled by `requireAuth`); 500 on server/DB errors with a generic message.

**Definition (backend):** `GET /candidates` returns 200 and a JSON body like `{ "data": [ { "id", "firstName", "lastName", "email", "phone", "createdAt" }, ... ] }` (or conforming to `CandidateListResponse` in api-spec.yml). No credentials or internal details in the response.

---

### 2. Frontend — List view

**Goal:** The recruiter sees the list of added candidates (talent) from the dashboard or a dedicated list page.

**Option A — List on dashboard (recommended):**

- On the **Dashboard** page (`/`), below the “Recruiter dashboard” card (or in a second card):
  - **Section title:** e.g. “Added talent” or “Candidates”.
  - **Content:** Fetch `GET /candidates` (with auth headers from `useAuth().getAuthHeaders()`). Display the result in a **table** or **card list** using UDS components.
  - **Columns/fields (minimum):** First name, Last name, Email, Added date (e.g. `createdAt` formatted). Optional: Phone, or a “CV” indicator if `cvFilePath` is present.
  - **Empty state:** If there are no candidates, show a short message: e.g. “No candidates yet. Add your first candidate above.”
  - **Loading state:** Show a loading indicator or message while the request is in progress.
  - **Error state:** On 4xx/5xx or network error, show a user-friendly message (e.g. “Could not load candidates. Try again later.”) and do not leave the user without feedback.

**Option B — Dedicated list page:**

- Add route **`/candidates`** (list) and keep **`/candidates/new`** for the form.
  - Dashboard shows a link/button: “View candidates” (or “Added talent”) that navigates to `/candidates`.
  - The `/candidates` page fetches `GET /candidates` and displays the same table/card list and empty/loading/error states as in Option A.

**UI requirements:**

- Use **UDS** components only (e.g. Card, Button, Table if available, or a list of Cards). Follow [frontend-standards.mdc](../specs/frontend-standards.mdc).
- **Accessibility:** Table or list must have proper headers/labels; keyboard navigation; semantic structure (e.g. `<table>`, `<th>`, `<td>` or list markup).
- **Responsive:** Layout works on different viewports (e.g. table can scroll horizontally on small screens or collapse to cards).
- **Auth:** Use `getAuthHeaders()` from `AuthContext` for the `GET /candidates` request so the backend accepts it.

---

### 3. Navigation

- From the **dashboard**, the user must be able to reach the list (either in place with Option A, or via “View candidates” / “Added talent” with Option B).
- From the **add-candidate success** flow, the user is already redirected to the dashboard; they will then see the list (Option A) or can click “View candidates” (Option B).

---

## Out of scope (this ticket)

- Pagination, search, or sort controls in the UI (can be added later; backend can still return a simple list).
- Edit or delete candidate.
- GET /candidates/:id detail page (separate ticket if needed).

---

## Definition of done

- [ ] **Backend:** `GET /candidates` is implemented and returns a JSON list of candidates (with `id`, `firstName`, `lastName`, `email`, `createdAt` at minimum); protected by existing auth; 200 on success, 401 when unauthenticated, 500 with generic message on error.
- [ ] **Frontend:** Dashboard (or dedicated `/candidates` page) displays the list of added candidates using UDS components; shows loading and error states; shows an empty state when there are no candidates; uses auth headers for the request.
- [ ] **UX:** After adding a candidate, the user can see that candidate in the list (by returning to the dashboard or opening the list page).
- [ ] **Accessibility and compatibility:** List/table has proper labels and structure; layout is responsive.

---

## Summary

| Area      | Task |
|----------|------|
| Backend  | Implement `GET /candidates` (list), auth-protected, return `data` array of candidates. |
| Frontend | Show list on dashboard or `/candidates` page; fetch with auth; UDS components; loading, error, empty states. |
| Navigation | User can open list from dashboard (or via “View candidates” link). |

Implement **backend first**, then **frontend**, so the list view can call the real API.
