# AGENTS.md

This document provides essential information for AI agents working in this codebase.

## Project Type and Technologies

This is a **Next.js** project bootstrapped with `create-next-app`, using **React** and **TypeScript**. It leverages the following key technologies:

- **Next.js App Router**: For routing and server-side rendering/static site generation.
- **Tailwind CSS**: For styling.
- **Convex**: As the backend for real-time database and serverless functions.
- **Clerk**: For user authentication and management.
- **Shadcn/ui**: The `components/ui` directory suggests usage of Shadcn UI components.

## Essential Commands

The following scripts are defined in `package.json`:

- `npm run dev`: Starts the development server. This command runs both the Next.js frontend and the Convex backend simultaneously using `npm-run-all`.
  - `npm run dev:frontend`: Starts the Next.js development server only.
  - `npm run dev:convex`: Starts the Convex development server only.
- `npm run build`: Builds the Next.js application for production.
- `npm run start`: Starts the production Next.js server.
- `npm run lint`: Runs ESLint for code linting.

## Code Organization and Architecture

The project follows the Next.js App Router structure:

- `app/`: Contains the main application routes and layouts.
  - `(auth)/`: Group for authentication-related pages (signin, signup, passwordreset).
  - `dashboard/`: Contains dashboard-related routes and layouts.
  - `designers/`: Contains designer profile related pages.
- `components/`: Reusable UI components.
  - `ui/`: Likely houses Shadcn UI components.
  - `reusable/`: General reusable components.
  - `dashboard/`: Components specific to the dashboard.
  - `home/`: Components specific to the homepage.
- `convex/`: Contains Convex backend code.
  - `schema.ts`: Defines the Convex database schema.
  - `auth.config.ts`: Convex authentication configuration.
  - Various `.ts` files (e.g., `users.ts`, `jobs.ts`, `proposals.ts`): Define Convex mutations, queries, and actions.
  - `_generated/`: Automatically generated Convex client and server types.
- `lib/`: Utility functions.
  - `utils.ts`: General utility functions (e.g., `cn` for class merging, common in Tailwind/Shadcn projects).
- `public/`: Static assets.

### Control and Data Flow

- **Frontend (Next.js/React)**: Components in `app/` and `components/` render the UI.
- **Authentication (Clerk)**: Handled via `@clerk/nextjs` integration, visible in `app/layout.tsx` and `app/(auth)`.
- **Backend (Convex)**: Data fetching and mutations are performed using the Convex client, interacting with functions defined in the `convex/` directory. `ConvexClientProvider` in `app/ConvexClientProvider.tsx` sets up the Convex client.

## Naming Conventions and Style Patterns

- **Components**: PascalCase for React components (e.g., `ConditionalLayout.tsx`, `Footer.tsx`).
- **Files**: kebab-case for route segments (e.g., `passwordreset`, `designers`).
- **CSS**: Uses Tailwind CSS classes. `globals.css` imports Tailwind and other base styles.
- **TypeScript**: Strict TypeScript is enforced, and type definitions are used extensively, especially with Convex's generated types.

## Testing Approach

- The `package.json` includes an `eslint` script for linting.
- No explicit unit or integration testing frameworks (like Jest, React Testing Library, Playwright, or Cypress) are defined in `package.json` or immediately apparent in the file structure.

## Gotchas and Non-Obvious Patterns

- **Dual Development Servers**: Running `npm run dev` starts both the Next.js frontend and the Convex backend. Ensure both are running when developing.
- **Convex Code Generation**: The `convex/_generated/` directory contains automatically generated files (`api.d.ts`, `server.d.ts`, etc.). These should not be manually edited as they are overwritten by the Convex CLI.
- **Conditional Layouts**: `app/ConditionalLayout.tsx` is used in `app/layout.tsx`, suggesting a pattern for rendering different layouts based on authentication status or route.
- **Dynamic Routes**: The `[id]` and `[[...rest]]` conventions in `app/designers/[id]` and `app/(auth)/signin/[[...rest]]` indicate dynamic routes and catch-all routes respectively.
