# Universal Design System — Latest Reference

This project uses [mkatogui/universal-design-system](https://github.com/mkatogui/universal-design-system) (UDS) for the frontend. The **latest information** from the repo is available as follows.

## Local reference clone

A shallow clone of the official repo is kept at **`uds-reference/`** (gitignored) for offline reference:

- **Refresh it** when you need the latest docs/specs:
  ```bash
  cd uds-reference && git fetch origin main && git reset --hard origin/main
  ```
- **Or re-clone** from scratch:
  ```bash
  rm -rf uds-reference
  git clone --depth 1 https://github.com/mkatogui/universal-design-system.git uds-reference
  ```

## Key paths in the repo

| Path | Purpose |
|------|--------|
| `uds-reference/README.md` | Overview, quick start, 9 palettes, 43 components |
| `uds-reference/SPECIFICATION.md` | Full spec (tokens, palettes, components, WCAG) |
| `uds-reference/packages/react/README.md` | React component API and examples |
| `uds-reference/packages/react/package.json` | Current @mkatogui/uds-react version (e.g. 0.4.2) |
| `uds-reference/docs/` | Interactive HTML docs (playground, component library) |
| `uds-reference/src/templates/platforms/cursor.json` | Cursor skill/rules config for UDS |

## Official links

- **Live demo / playground:** https://mkatogui.github.io/universal-design-system/
- **Documentation:** https://mkatogui.github.io/universal-design-system/docs.html
- **Component library:** https://mkatogui.github.io/universal-design-system/component-library.html
- **Token reference:** https://mkatogui.github.io/universal-design-system/reference.html
- **GitHub:** https://github.com/mkatogui/universal-design-system

## Usage in this project

- **Palette:** Set via `data-theme` on `<html>` in `frontend/public/index.html` (`data-theme="corporate"` for recruiter/ATS).
- **Styles:** Import once at app entry: `import '@mkatogui/uds-react/styles.css'` in `frontend/src/index.tsx`. Do not import `@mkatogui/uds-tokens/css` separately; UDS React styles include tokens and palette overrides.
- **Components:** Use only `@mkatogui/uds-react` (Button, Card, Input, Alert, Navbar, FileUpload, etc.). Prefer explicit `size="md"` and `variant` as in the [playground](https://mkatogui.github.io/universal-design-system/playground.html).
- **Package version:** Prefer the same major/minor as the repo’s `packages/react/package.json` (e.g. `^0.4.2`).

## Palettes (from repo)

| Palette | Best for |
|---------|----------|
| `minimal-saas` | SaaS, productivity tools |
| `dashboard` | Analytics, admin panels (used here for recruiter ATS) |
| `corporate` | Enterprise, B2B, regulated |
| `ai-futuristic` | AI products, dev tools |
| `gradient-startup` | Startups, MVPs |
| Others | See README in repo |

## What we use vs. what we could use (43 components)

**Currently used in this project:** Navbar, Button, Card (CardTitle, CardContent, CardFooter), Input, Alert, FileUpload.

**UDS components we could adopt:**

| Component | Use case in LTI |
|-----------|------------------|
| **DataTable** | Candidates list (replace custom table): columns, sortable, `emptyMessage`, `loading`. |
| **Skeleton** | Loading state for dashboard/list (`variant="table"` or `"card"`). |
| **Badge** | CV column (“Yes” / “—”), status labels, counts. |
| **Breadcrumb** | Navigation context: Dashboard > Added talent, or Dashboard > Add candidate. |
| **Toast** | Success/error feedback after add candidate (in addition to or instead of inline Alert). |
| **Hero** | Dashboard or login header (headline + subtitle + CTA). |
| **Pagination** | When candidates list is paginated. |
| **Select** | Filters (e.g. status, sort), dropdowns in forms. |
| **Modal** / **AlertDialog** | Confirm delete, confirm logout, detail view. |
| **Tabs** | Dashboard tabs (e.g. Candidates | Positions | Settings). |
| **SideNav** | Alternative to top Navbar for more sections. |
| **Dropdown** | User menu (profile, logout) in navbar. |
| **Drawer** | Candidate detail or filters panel. |
| **Accordion** | FAQ, “How to add a candidate”, expandable sections. |
| **Avatar** | User avatar in nav, candidate initials in list. |
| **Progress** | Onboarding or upload progress. |
| **Checkbox** / **Toggle** | Settings, filters. |

Use the [component library](https://mkatogui.github.io/universal-design-system/component-library.html) and React types in `node_modules/@mkatogui/uds-react/dist/index.d.ts` for API details.

## Keeping this doc in sync

When the upstream repo is updated, refresh `uds-reference/` and, if needed, bump `@mkatogui/uds-react` in `frontend/package.json` to match `uds-reference/packages/react/package.json` and update this table or links.
