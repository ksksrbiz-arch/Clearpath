# CLAUDE.md - ClearPath Environmental

## Project Overview

ClearPath Environmental is a single-page marketing/business-plan website for an environmental cleanup company based in Oregon. Built with React 19 and Vite 8, deployed to Netlify.

**Live site:** https://clearpath-environmental.netlify.app

## Tech Stack

- **Framework:** React 19.2.4 (JSX, no TypeScript)
- **Build tool:** Vite 8.0.1 with `@vitejs/plugin-react`
- **Linting:** ESLint 9 (flat config) with react-hooks and react-refresh plugins
- **Hosting:** Netlify (SPA mode, all routes redirect to `/index.html`)
- **Containers:** Docker (multi-stage build with nginx)
- **Styling:** Inline CSS with CSS custom properties (no CSS framework)
- **Fonts:** Google Fonts (DM Serif Display + Source Sans 3)

## Repository Structure

All source files are at the root level. Note: files have ` (1)` suffixes from the upload process.

```
App (1).jsx          # Entire application - all components, styles, and logic
main (1).jsx         # React entry point (renders App into #root)
index (1).html       # HTML shell with meta/OG tags
package (1).json     # Dependencies and scripts
vite.config (1).js   # Vite config (minimal, React plugin only)
eslint.config (1).js # ESLint 9 flat config
netlify (1).toml     # Netlify build + deploy config (headers, redirects)
gitignore (1)        # Standard Node/Vite ignores
```

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Production build (output: dist/)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint

# Docker
docker build -t clearpath .         # Build production image
docker run -p 3000:80 clearpath     # Run production container
docker compose up web               # Run production via compose (port 3000)
docker compose --profile dev up dev # Run Vite dev server in container (port 5173)
```

## Architecture

This is a **single-file React SPA**. All components live in `App (1).jsx`:

- **Custom hooks:** `useInView()` (Intersection Observer for scroll animations)
- **Components:** `Section`, `Stat`, `Card`, `RoleCard`, `MobileDrawer`, `App`
- **Config constants:** `VENTURE_NAME`, `TAGLINE`, `REGION` (top of file)
- **CSS:** Embedded as a `<style>` tag via template literal, uses CSS variables for theming

### Page Sections (nav order)

Mission, Opportunity, Revenue Model, Team & Roles, Operations, Roadmap, Clear Boundaries, Open Invitation, Startup Costs

### CSS Theme Variables

Forest green / pine / sage / earth / clay / sand / cream / charcoal palette. Responsive breakpoints at 640px and 900px. Mobile-first design.

## Code Conventions

- Pure JavaScript (no TypeScript)
- Functional React components with hooks
- BEM-like CSS class naming (`.nav__brand`, `.s--d`)
- Semantic HTML5 elements
- Accessibility: ARIA labels, focus states, `prefers-reduced-motion` support
- No external UI libraries - everything is hand-rolled

## Deployment

Netlify auto-builds on push to `main`:
- Build command: `npm run build`
- Publish directory: `dist`
- Security headers configured (X-Frame-Options, CSP-adjacent policies)
- Site ID: `0202e798-6027-4492-85b6-06580108bd21`

### Docker (alternative)
Multi-stage build: Node 22 Alpine (build) → nginx Alpine (serve). The nginx config replicates Netlify's SPA routing and security headers. Production image serves on port 80.

## Known Issues

- All source filenames have ` (1)` suffixes which will cause build failures (Vite expects `src/main.jsx` per `index.html`). These need to be renamed and placed in proper directories for the build to work.
- No test framework is configured.
- No CI/CD pipeline (`.github/workflows`) exists.
- The `.gitignore` file is named `gitignore (1)` instead of `.gitignore`.

## Working with This Repo

- The entire UI is in one file (`App (1).jsx`). When making changes, search within that file rather than looking across multiple modules.
- Styles are co-located with components as an inline CSS string at the top of `App (1).jsx`.
- To add a new section: create a component, add it to the `App` return JSX, add a nav link, and add corresponding CSS to the style block.
