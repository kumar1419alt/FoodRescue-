# FoodRescue authentication architecture

## Phase 4 approach

FoodRescue uses Better Auth with its official Prisma adapter. Better Auth 1.7
supports Next.js 16, PostgreSQL, Prisma 7, email/password authentication,
database-backed sessions, email verification, password reset, and session
revocation. This fits FoodRescue better than Auth.js Credentials for this
phase because the platform requires revocable server-side session persistence
and verification/recovery lifecycle records.

Better Auth manages password hashing with its maintained Node `scrypt`
implementation. Application code must never hash, compare, log, or return a
password itself. Password hashes remain only in the server-side `AuthAccount`
record.

## Database model

The existing `User` model remains the single identity referenced by donations,
memberships, assignments, inspections, notifications, and audit logs. Phase 4
adds `emailVerified` and `image` to it, and adds these distinct relations:

- `AuthAccount`: provider-specific credential data, including an opaque
  framework-managed password hash.
- `AuthSession`: revocable, expiring database sessions with optional device
  metadata.
- `AuthVerification`: expiring verification records. It is deliberately
  separate from the existing `Verification` model, which represents NGO
  organization verification. Better Auth hashes token-bearing verification
  identifiers before persistence.

`20261105000300_authentication_foundation` only adds new authentication
relations and indexes. It does not modify the restrictive donation-history
foreign keys introduced in Phase 3.

## Roles and organization permissions

Global `User.role` selects the principal dashboard and high-level capability:
`donor`, `ngo`, `volunteer`, or trusted `admin`. Public registration can never
select `admin`.

`OrganizationMember.role` is a separate, organization-scoped privilege. It is
the source of truth for organization-specific access. A global role does not
grant access to an arbitrary organization; every organization operation must
validate the authenticated actor's membership and the required membership
privilege. NGO actions that require approval must additionally check that the
organization verification status is `approved`.

## Configuration

Copy `.env.example` to `.env.local` and configure only local secrets:

- `BETTER_AUTH_SECRET`: a unique secret with at least 32 characters. Generate
  one with `openssl rand -base64 32`.
- `BETTER_AUTH_URL`: canonical application origin, normally
  `http://localhost:3000` during local development.
- `FOODRESCUE_DEV_EMAIL_TRANSPORT=console`: an explicit local-only option that
  prints a verification or reset URL to the local server console. It must never
  be enabled in production. Without a configured transport, delivery remains
  pending and no account is verified automatically.
- `DATABASE_URL` and `DATABASE_TEST_URL`: existing, separate PostgreSQL URLs.

Never commit `.env.local`. Production uses HTTPS and secure cookies. Secrets
must be rotated by deploying a new secret according to the framework's
documented rotation process; do not rotate by editing database records.

## Migration workflow

The local PostgreSQL role intentionally cannot create a Prisma shadow database.
Review the checked-in Phase 4 migration, then apply it non-destructively with:

```bash
npm run db:deploy
npm run db:test:migrate
```

Use `npm run test:db` only with the guarded `_test` database. Do not run resets
or direct destructive migration commands against the development database.

## Security baseline

- Auth routes are server-side and use framework-managed HTTP-only cookies.
- Production refuses to start without `BETTER_AUTH_SECRET` or `AUTH_SECRET`.
- Sessions expire after seven days and are refreshed at most once per day.
- Password resets revoke other active sessions.
- Protected routes resolve identities server-side from the database session and
  use deny-by-default authorization helpers. Dashboard access also validates
  the active user and the expected global role.
- Verification and reset delivery require a configured transport; no delivery
  configuration may mark a user verified automatically.

## Phase 4 implementation status

The public registration, sign-in, sign-out, verification notice, password
reset, protected profile, security, and role-aware dashboard entry routes are
implemented. NGO self-registration creates a pending NGO organization and
membership; it does not approve the organization. Admin accounts are never
created through public registration and must be provisioned through a future
audited administrative workflow.
