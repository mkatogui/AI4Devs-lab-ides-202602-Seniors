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
| `uds-reference/packages/react/package.json` | Current @mkatogui/uds-react version (e.g. 0.5.1) |
| `uds-reference/docs/` | Interactive HTML docs (playground, component library) |
| `uds-reference/src/templates/platforms/cursor.json` | Cursor skill/rules config for UDS |

## UDS MCP Server

The UDS MCP server is **bundled** in `@mkatogui/universal-design-system` and is **configured** in this project for Cursor.

- **Config file:** `.cursor/mcp.json` — registers the server `universal-design-system` (runs `node` on `node_modules/@mkatogui/universal-design-system/src/mcp/index.js`).
- **To (re)install:** From project root run `npx @mkatogui/universal-design-system install`. It detects Cursor and updates `.cursor/mcp.json`, and can add skills/agents/commands.
- **MCP tools:** `search_design_system`, `get_palette`, `get_component`, `generate_tokens`, `list_palettes`, `list_components` — use these when implementing or refactoring UI so the AI can suggest correct UDS usage (APIs, tokens, patterns).
- **Prerequisites:** Node.js 18+; Python 3.8+ required for `search_design_system` and `generate_tokens` (BM25 engine).

## Official links

- **Live demo / playground:** https://mkatogui.github.io/universal-design-system/
- **Documentation:** https://mkatogui.github.io/universal-design-system/docs.html
- **Component library:** https://mkatogui.github.io/universal-design-system/component-library.html
- **Token reference:** https://mkatogui.github.io/universal-design-system/reference.html
- **GitHub:** https://github.com/mkatogui/universal-design-system

## UDS getting started in this project

This project follows the **UDS getting-started** flow (see `.cursor/skills/uds-getting-started/SKILL.md`):

- **Skills:** Use UDS skills by trigger (design system, palettes, components, accessibility audit, UI styling). MCP tools: `search_design_system`, `get_palette`, `get_component`, `list_palettes`, `list_components`.
- **Tokens only:** All app CSS uses UDS tokens (`var(--color-*)`, `var(--space-*)`, `var(--font-*)`, etc.). No hardcoded colors or spacing.
- **Re-run install:** From project root, `npx @mkatogui/universal-design-system install` to refresh MCP config and skills.

## Usage in this project

- **Palette:** Set via `data-theme` on `<html>` in `frontend/public/index.html` (`data-theme="corporate"` for recruiter/ATS). `theme-color` meta matches corporate `--color-brand-primary` (#1a365d).
- **Styles:** Import once at app entry: `import '@mkatogui/uds-react/styles.css'` in `frontend/src/index.tsx`. Do not import `@mkatogui/uds-tokens/css` separately; UDS React styles include tokens and palette overrides.
- **Components:** Use only `@mkatogui/uds-react`. Prefer explicit `size="md"` and `variant` as in the [playground](https://mkatogui.github.io/universal-design-system/playground.html).
- **Package version:** Prefer the same major/minor as the repo’s `packages/react/package.json` (e.g. `^0.5.1`).

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

**Currently used in this project (aligned to UDS getting started):**

| Component | Where |
|-----------|--------|
| **Navbar** | AppLayout (logo, nav links, CTA) |
| **Button** | Dashboard, AddCandidate, Navbar CTA, LoginForm |
| **Card** (CardHeader, CardTitle, CardContent, CardFooter) | Dashboard (2 cards), AddCandidate (1 card) |
| **Breadcrumb** | Dashboard, AddCandidate (nav context) |
| **Input** | AddCandidate form, LoginForm |
| **Form**, **FormSection** | AddCandidate |
| **Alert** | Dashboard (error), AddCandidate (success/error) |
| **FileUpload** | AddCandidate (CV) |
| **DataTable** | Dashboard (candidates list) |
| **Skeleton** | Dashboard (loading) |
| **Badge** | Dashboard (CV column) |
| **Hero**, **LoginForm** | Login page |

**UDS components we could adopt next:**

| Component | Use case in LTI |
|-----------|------------------|
| **Toast** | Success/error feedback after add candidate (in addition to or instead of inline Alert). |
| **Pagination** | When candidates list is paginated. |
| **Select** | Filters (e.g. status, sort), dropdowns in forms. |
| **Modal** / **AlertDialog** | Confirm delete, confirm logout, detail view. |
| **Tabs** | Dashboard tabs (e.g. Candidates \| Positions \| Settings). |
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
