# Frontend review — LTI Talent Tracking System

**Scope:** Structure, UDS usage, routing, state, accessibility, tests, and suggested improvements.

---

## 1. Structure and architecture

| Area | Status | Notes |
|------|--------|--------|
| **Entry** | OK | `index.tsx` → `index.css` → `App.css` → UDS `styles.css` → `App`; `BrowserRouter` at root. |
| **Routing** | OK | React Router 7: `/login`, `/`, `/candidates/new`, `*` → Navigate to `/`. |
| **Auth** | OK | `AuthProvider` at root; `ProtectedRoute` redirects unauthenticated users to `/login` with `state.from`. |
| **Layout** | OK | `AppLayout` (Navbar + children) wraps Dashboard and AddCandidate; Login is full-screen (Hero + LoginForm). |
| **Pages** | OK | Login, Dashboard, AddCandidate; each self-contained with local state. |
| **Context** | OK | `AuthContext` (login, logout, getAuthHeaders, user, isAuthenticated); token in localStorage. |

**Recommendation:** Keep structure as-is. If the app grows, consider a small `api` module (e.g. `api/candidates`, `api/auth`) so `API_BASE` and fetch logic live in one place.

---

## 2. UDS (Universal Design System) usage

| Area | Status | Notes |
|------|--------|--------|
| **Theme** | OK | `data-theme="corporate"` in `index.html`; fonts (Inter, Source Serif 4) loaded. |
| **CSS order** | OK | App/base CSS before UDS so component styles win. |
| **Tokens** | OK | `App.css` and `index.css` use only UDS tokens (e.g. `--color-*`, `--space-*`, `--font-sans`, `--radius-md`). No overrides of `.uds-*` component classes. |
| **Login** | OK | UDS `Hero` + `LoginForm`; layout classes for container only. |
| **Dashboard** | OK | UDS `Card`, `CardTitle`, `CardContent`, `CardFooter`, `Button`, `Alert`, `DataTable`, `Skeleton`, `Badge`. |
| **AddCandidate** | OK | UDS `Card`, `Form`, `FormSection`, `Input`, `Alert`, `FileUpload`, `Button`; labels/helper/error use token-based classes. |
| **Nav** | OK | UDS `Navbar`; nav links use `.App-nav-link` with tokens; active state via `aria-current="page"`. |

**Minor:** A few inline styles remain (e.g. `style={{ textDecoration: 'none' }}` on `Link`s, `maxWidth: '360px'` on email field, `marginTop: 0, marginBottom: 'var(--space-2)'` on CV helper). Prefer moving to classes in `App.css` for consistency.

---

## 3. Components

| Component | Role | Assessment |
|-----------|------|------------|
| **App** | Routes + AuthProvider | Clear; no layout, only routing. |
| **AppLayout** | Shell + Navbar + nav links + CTA | Good. Logo and CTA are React Router `Link` + UDS `Button`. Logout is a `<button>` with `App-nav-link--button` and `aria-label`. |
| **ProtectedRoute** | Redirect when not authenticated | Minimal and correct. |
| **Login** | Hero + LoginForm, submit → login() → navigate | Good. `from` state used for redirect after login. |
| **Dashboard** | Two cards (intro + “Add candidate”; table + empty/loading/error) | Good. `getAuthHeaders()` in useEffect; cleanup with `cancelled` flag. DataTable columns + custom CV cell (Badge / “—”). |
| **AddCandidate** | Form with validation on blur, submit (JSON or FormData), success/error alerts | Good. Required/optional and error handling align with UDS form patterns. |

**Recommendation:** Consider extracting `API_BASE` (and optionally fetch wrappers) to a small `src/config.ts` or `src/api/client.ts` so both Dashboard and AddCandidate (and AuthContext) use the same base URL.

---

## 4. Accessibility

| Item | Status |
|------|--------|
| Form labels | OK — UDS `Input` and explicit `label`/`htmlFor` for FileUpload. |
| Errors | OK — `errorText` on Input; `role="alert"` on Alert and form error span. |
| Nav active | OK — `aria-current="page"` on active route. |
| Logout | OK — `aria-label` includes email when available. |
| Buttons | OK — “Add candidate” has `aria-label`; submit has `aria-busy={loading}`. |
| Empty table | OK — DataTable `emptyMessage` and semantic structure. |

**Recommendation:** Ensure focus moves to success/error alert on submit (e.g. `autoFocus` or `ref` + `focus()` on Alert container) so screen-reader users get immediate feedback.

---

## 5. State and data flow

- **Auth:** Context holds token and user; login/logout and `getAuthHeaders()` are stable (useCallback).
- **Dashboard:** Fetches on mount; loading/error/candidates in local state; no cache (refetch on every visit). Acceptable for current scope.
- **AddCandidate:** Controlled inputs, local validation state, success/error messages; redirect on success after 1.5s.

**Recommendation:** If you add more screens that need the candidates list, consider a small data layer (e.g. React Query or a context that caches and invalidates after add).

---

## 6. Tests

- **App.test.tsx** still expects “learn react” and does not wrap with `BrowserRouter` or `AuthProvider`, so it’s **outdated** and will fail or render the wrong UI.

**Recommendation:** Update the test to match the app: wrap with `BrowserRouter` and `AuthProvider`, then assert on something that exists (e.g. presence of “LTI” or “Sign in” on login, or a protected route redirect). Add at least one test per main flow (e.g. Login shows form, Dashboard shows “Recruiter dashboard” when authenticated).

---

## 7. Possible improvements (short list)

1. **API module:** Centralize `API_BASE` and auth headers (e.g. `api/client.ts` or `config.ts`).
2. **Inline styles → classes:** Replace remaining inline styles (Link `textDecoration`, email `maxWidth`, CV helper margins) with classes in `App.css`.
3. **Tests:** Fix `App.test.tsx` (routing + auth wrappers, assertions); add minimal tests for Login and Dashboard.
4. **Focus management:** On AddCandidate success/error, move focus to the Alert for a11y.
5. **Error boundary:** Add a simple React error boundary at app or layout level for runtime errors.
6. **Env:** Document `REACT_APP_API_URL` in `frontend/README.md` or `.env.example`.

---

## 8. Summary

- **Strengths:** Clear structure, consistent UDS usage, token-only app CSS, sensible auth and routing, good use of UDS components and a11y attributes.
- **To fix:** Update `App.test.tsx` and add minimal integration/unit tests; optionally centralize API base and replace remaining inline styles with classes.
- **Optional:** API module, focus management on form feedback, error boundary, env docs.
