# FoodRescue

FoodRescue is a web platform intended to connect surplus-food donors with community organizations.

## Getting started

1. Copy `.env.example` to `.env.local` and provide only local, non-committed values.
2. Install dependencies with `npm install`.
3. Set up PostgreSQL and apply the development migration as described in [DATABASE.md](DATABASE.md).
4. Start the development server with `npm run dev`.
5. Visit [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Database

FoodRescue uses PostgreSQL with Prisma 7 and the `pg` driver adapter. The checked-in initial migration defines the Phase 3 relational foundation; it does not expose database routes or implement authentication. See [DATABASE.md](DATABASE.md) for local Windows, optional Docker, migration, seed, backup, reset, and integration-test guidance.

## Repository workflow

Development occurs on dedicated feature branches. `main` remains the stable branch and is merged only with approval.

## UI system

See [UI_SYSTEM.md](UI_SYSTEM.md) for the brand tokens, accessibility conventions, responsive layout guidance, and reusable component boundaries.
