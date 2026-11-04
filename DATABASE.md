# FoodRescue database development

Phase 3 establishes a PostgreSQL and Prisma foundation only. Database access is server-only; public database APIs, authentication, and operational dashboards are intentionally deferred.

## Configuration

Copy `.env.example` to `.env.local`. Set `DATABASE_URL` to a local or development PostgreSQL database. Never commit `.env.local`, connection strings with real credentials, backups, or production exports.

`DATABASE_TEST_URL` is separate from `DATABASE_URL`. It must name a database ending in `_test`; `npm run test:db` refuses any other name. This guard prevents accidental integration-test connections to an ordinary development or production database.

## Windows with native PostgreSQL

With PostgreSQL installed, create two local databases using a PostgreSQL administrator account:

```powershell
createdb foodrescue_dev
createdb foodrescue_test
```

Then set local values in `.env.local`, generate the client, and apply migrations:

```powershell
npm run db:generate
npm run db:migrate
```

Prisma loads `.env.local` through `dotenv`; do not paste credentials into scripts or committed files.

## Optional Docker Compose

Docker is optional. If it is installed, start the development-only PostgreSQL service:

```powershell
docker compose up -d
docker compose ps
```

The compose file has a persistent named volume and a `pg_isready` health check. Set `POSTGRES_PASSWORD` in your local environment before starting it, then use a matching `DATABASE_URL` in `.env.local`. No Docker password is committed.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run db:validate` | Validate the Prisma schema without connecting to PostgreSQL. |
| `npm run db:generate` | Generate the local Prisma Client. |
| `npm run db:migrate` | Create/apply a development migration; requires `DATABASE_URL`. |
| `npm run db:deploy` | Apply committed migrations in a deployment environment. |
| `npm run db:seed` | Insert only repeatable, fictional development data. Disabled in production. |
| `npm run test:db` | Run integration tests against `DATABASE_TEST_URL`; migrate that test database first. |

The initial migration is checked in under `prisma/migrations`. Do not edit migration history after it has been applied to a shared database. Create a new migration for each intentional schema change.

## Data model and integrity

The normalized schema covers users and organization memberships; organization verification; donor pickup locations; donations and NGO matching; volunteer assignments; inspections; transport; custody history; NGO receipts; NGO-managed beneficiary groups; distributions; notifications; and audit logs. Beneficiaries have no individual identity records.

Lifecycle state is represented by PostgreSQL enums aligned with `types/donation.ts`. Timestamps use `timestamptz`; quantities that need precision use PostgreSQL `numeric`. Foreign keys, uniqueness rules, indexes, and restrictive delete rules protect operational records. Audit and custody history are deliberately not cascade-deleted.

Database constraints protect structural integrity. Future service-layer commands must authorize the acting user and perform donation status changes, custody events, and audit entries in one Prisma transaction to protect against concurrent updates.

## Seed, reset, and backup

The seed is idempotent and includes one clearly fictional organization with a pending verification status. It creates no successful rescue, delivery, or distribution. Seed manually with `npm run db:seed`.

Do not run `prisma migrate reset` against shared, staging, or production databases: it drops data. For a disposable local database only, confirm the connection target first, then run `npx prisma migrate reset`.

Back up a PostgreSQL database before production changes, for example with `pg_dump` to a secure location outside this repository. Restore only through a reviewed recovery procedure.

## Troubleshooting

- Confirm PostgreSQL is running and the host, port, and database name in `DATABASE_URL` are correct.
- Run `npm run db:validate` and `npm run db:generate` after changing the schema.
- If migration application fails, do not alter a checked-in migration. Inspect `npx prisma migrate status`, resolve the database state, and create a follow-up migration when appropriate.
- If `npm run test:db` refuses the URL, use a dedicated database name ending in `_test`.
