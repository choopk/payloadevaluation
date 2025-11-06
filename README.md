# PayloadCMS Monorepo

A Turborepo + pnpm workspace monorepo containing multiple frontend applications.

## Structure

```
monorepo/
├── apps/
│   ├── nextjs/           # Next.js 16 application
│   ├── sveltekit/        # SvelteKit application
│   └── tanstack-start/   # TanStack Start application
├── packages/
│   ├── typescript-config/ # Shared TypeScript configurations
│   └── eslint-config/     # Shared ESLint configurations
├── turbo.json            # Turborepo configuration
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package.json
```

## Apps

- **nextjs** - Next.js 16 with React 19, Tailwind CSS v4, and TypeScript
- **sveltekit** - SvelteKit with Svelte 5 and TypeScript
- **tanstack-start** - TanStack Start with React 19, TanStack Router, and Vite

## Packages

- **@repo/typescript-config** - Shared TypeScript configurations (base, Next.js, React, Svelte)
- **@repo/eslint-config** - Shared ESLint configurations (base, Next.js, Svelte)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm 9.15.0 or higher

### Installation

```bash
pnpm install
```

## Development

### Run all apps in development mode

```bash
pnpm dev
```

### Run specific app

```bash
pnpm --filter @repo/nextjs dev
pnpm --filter @repo/sveltekit dev
pnpm --filter @repo/tanstack-start dev
```

## Build

### Build all apps

```bash
pnpm build
```

### Build specific app

```bash
pnpm --filter @repo/nextjs build
pnpm --filter @repo/sveltekit build
pnpm --filter @repo/tanstack-start build
```

## Linting

### Lint all apps

```bash
pnpm lint
```

## Type Checking

```bash
pnpm turbo type-check
```

## Clean

### Clean all build artifacts

```bash
pnpm turbo clean
```

## Turborepo Features

- **Caching** - Build and task outputs are cached for faster subsequent runs
- **Parallel execution** - Tasks run in parallel across packages when possible
- **Dependency graph** - Automatically understands package dependencies
- **Remote caching** - Can be configured for team-wide cache sharing

## Adding New Apps

1. Create a new directory in `apps/`
2. Ensure package.json has a name starting with `@repo/`
3. Add required scripts: `dev`, `build`, `lint`, `type-check`, `clean`
4. Run `pnpm install` to link workspace packages

## Adding New Shared Packages

1. Create a new directory in `packages/`
2. Add a package.json with name starting with `@repo/`
3. Run `pnpm install` to link workspace packages
4. Reference it in app package.json files

## Tech Stack

- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo
- **Frameworks**: Next.js, SvelteKit, TanStack Start
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4

## Notes

- All apps are configured to use shared TypeScript and ESLint configurations
- Mixed frameworks (React + Svelte) work perfectly in the same monorepo
- Each app maintains its own build tooling (Next.js, Vite, SvelteKit)
- Shared configs reduce duplication while allowing per-app customization
