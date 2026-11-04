# FoodRescue

FoodRescue is a web platform intended to connect surplus-food donors with community organizations.

## Getting started

1. Copy `.env.example` to `.env.local` and provide only local, non-committed values when configuration is introduced.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Visit [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Repository workflow

Development occurs on dedicated feature branches. `main` remains the stable branch and is merged only with approval.
