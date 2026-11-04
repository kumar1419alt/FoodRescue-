# FoodRescue Contribution Guide

## Git workflow

- Work on a dedicated `feature/phase-XX-*` branch; never develop directly on `main`.
- Before work, inspect `git status` and recent commits. Stop if unrelated uncommitted user changes are present.
- Make focused commits using conventional commit messages.
- Run type checking, linting, relevant tests, and a production build before committing.
- Never force-push, rewrite shared history, delete branches, or merge to `main` without explicit approval.

## Security

- Never commit `.env` files, credentials, API keys, passwords, database connection strings, or personal data.
- Add configuration variable names only to `.env.example`, with non-sensitive placeholder values.

## Project conventions

- Keep components and routes modular and typed.
- Use the `@/` import alias for project-root imports.
- Do not add advanced functionality before its planned phase.
