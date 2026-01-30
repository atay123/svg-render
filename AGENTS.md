# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains the Next.js App Router pages, layouts, and route segments (entry point: `app/page.tsx`).
- `components/` holds shared UI components used across routes.
- `lib/` stores reusable helpers and utilities.
- `public/` is for static assets (icons, images, and generated SEO files).
- Root configs include `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and `postcss.config.mjs`.

## Build, Test, and Development Commands
- `npm run dev` starts the local dev server at http://localhost:3000 with hot reload.
- `npm run build` creates the production build.
- `npm run start` runs the production server from the build output.
- `npm run lint` runs ESLint using Next.js Core Web Vitals + TypeScript rules.

## Coding Style & Naming Conventions
- TypeScript is required; keep JSX/TSX indentation to 2 spaces and follow ESLint rules.
- Component files use `PascalCase` (e.g., `components/UploadPanel.tsx`).
- Utility functions use `camelCase` and live in `lib/`.
- Prefer small, focused components and colocate related styles/logic when possible.

## Testing Guidelines
- No test framework is configured yet (no Jest/Vitest/Playwright in `package.json`).
- If you introduce tests, add the tooling, document the command, and keep tests close to the feature area.

## Commit & Pull Request Guidelines
- Follow Conventional Commits as seen in history: `feat:`, `chore:`, `feat(ui):`, `feat(seo):`.
- PRs should include a concise description, scope, and any relevant context.
- Include screenshots or short clips for UI changes.
- Link related issues or tasks when available.

## Configuration & SEO Notes
- SEO metadata and structured data live under `app/` and configuration files.
- Validate that analytics (`@vercel/analytics`) and metadata outputs remain intact after changes.
