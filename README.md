# Rinament PDF Atelier

Rinament PDF Atelier is a browser-based PDF workspace built with React, Vite,
and shadcn UI. The first milestone focuses on merging multiple PDFs into one
downloadable file, showing visual previews, and reordering the merge queue with
drag and drop.

## What is included

- React 19 + Vite 8 + TypeScript 6
- Clerk authentication
- Convex client wiring
- TanStack Query provider setup
- Global modal host for reusable confirmation flows
- `pdf-lib` for client-side PDF merge and export
- `react-pdf` for PDF preview rendering
- `@dnd-kit/react` for full-card queue reordering
- Editorial workshop theme tokens in `src/index.css`

## Setup

1. Install dependencies:

```bash
bun install
```

2. Create your local environment file from `.env.example`.

Required frontend env keys:

- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk publishable key from the Clerk dashboard
- `VITE_CONVEX_URL`: Convex client URL for the current deployment
- `VITE_CONVEX_SITE_URL`: Public site URL used for auth/callback configuration

Optional local workflow key:

- `CONVEX_DEPLOYMENT`: helpful for Convex local tooling such as `npx convex dev`

3. Verify the project:

```bash
bun run check
```

4. Build the production bundle when needed:

```bash
bun run build
```

## Quality Commands

```bash
bun run lint
bun run lint:fix
bun run typecheck
bun run format
bun run format:check
bun run check
```

`bun run check` is non-mutating. It runs linting, typechecking, and Prettier in
check mode.

## Current Routes

- `/`: public PDF merge workspace in `src/pages/Root.tsx`

## Adding New Pages

- Keep `/` as the special root file in `src/pages/Root.tsx`.
- Put authenticated routes under `src/pages/authenticated/...`.
- Put unauthenticated routes under `src/pages/unauthenticated/...`.
- Mirror nested route segments with kebab-case folders.
- Name page files in PascalCase.

Examples:

- `/dashboard` → `src/pages/authenticated/dashboard/Dashboard.tsx`
- `/history` → `src/pages/authenticated/history/History.tsx`
- `/workspace-settings` → `src/pages/unauthenticated/workspace-settings/WorkspaceSettings.tsx`

## Hooks, Types, and Modals

- Route-scoped hooks should live in matching folders like
  `src/hooks/merge/use-pdf-merge-workspace.ts`.
- Route-scoped types should live in matching folders like
  `src/types/merge/merge.types.ts`.
- Shared modal components should live under `src/components/modals/...`.
- Register global modal entries in `src/context/ModalProvider.tsx`.

## Import Policy

- Prefer direct imports from the concrete module path, for example
  `@/hooks/merge/use-pdf-merge-workspace` or `@/components/ui/button`.
- Keep root barrel files only for intentionally shared public entry points.
- When adding new files, update a root barrel only if that module is meant to be
  a shared template-level export.

## Provider Pattern

- `src/context/ConvexClerkProvider.tsx` is the canonical Convex + Clerk wrapper.
- `src/main.tsx` should compose app-level providers using that wrapper instead of
  duplicating the Convex provider setup inline.
