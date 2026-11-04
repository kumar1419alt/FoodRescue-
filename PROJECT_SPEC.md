# FoodRescue Project Specification

## Purpose and scope

FoodRescue is a food-rescue and donation-management platform that helps redirect safe, quality surplus food to community organizations. It supports restaurants, hotels, event organizers, marriage halls, and households as donors; verified NGOs as recipients and distribution managers; volunteers who collect, inspect, and deliver; and administrators who govern the system. Beneficiaries are NGO-managed groups and never receive individual platform accounts.

The product is a real full-stack system, not a static demonstration. This phase establishes only its architecture, validation contracts, documentation, and public UI foundation. Database, authentication, and operational workflows are deferred to later phases.

## Roles and permissions

| Role | Core permissions |
| --- | --- |
| Donor | Create, edit, submit, and cancel eligible donations; see donation progress and receipts for its own organization. |
| NGO | Maintain verified organization data; review matches; accept or decline donations; manage beneficiary groups; acknowledge receipts and distributions. |
| Volunteer | View only assigned collection tasks; record pickup, inspection, and delivery evidence. |
| Admin | Verify organizations and users; manage safety rules, complaints, access, reports, and audit review. |
| Beneficiary | No account or direct system access. NGOs record aggregate groups and distribution outcomes. |

Every protected action must authorize both role and ownership/assignment. An NGO cannot access another NGO’s records; volunteers cannot browse unassigned donations; donors cannot alter a donation after its permitted workflow point. Admin actions require an elevated, audited permission check.

## Donation lifecycle

1. **Donation creation:** a donor describes food, quantity, preparation time, pickup deadline, location, and handling notes.
2. **NGO matching:** the system proposes eligible verified NGOs using service area, capacity, food suitability, and urgency.
3. **NGO acceptance:** the NGO accepts or declines within the safe pickup window.
4. **Volunteer assignment:** an authorized NGO or coordinator assigns a suitable volunteer.
5. **Food safety verification:** the volunteer records the required inspection outcome before pickup.
6. **Pickup:** the volunteer records a timestamp and custody transfer.
7. **Delivery:** delivery to the NGO is confirmed with time and evidence.
8. **NGO receipt:** the NGO acknowledges quantity and condition received.
9. **Beneficiary distribution:** the NGO records aggregate recipient-group distribution, never individual beneficiary accounts.
10. **Impact analytics:** aggregated meals, weight, delivery, and distribution outcomes are available to authorized roles.

Status transitions are strictly controlled: `draft → submitted → matched → accepted → volunteer_assigned → safety_verified → picked_up → delivered → receipted → distributed`. `cancelled`, `expired`, and `rejected` are terminal outcomes; only documented role-specific transitions are permitted.

## Functional requirements

- Organization onboarding and admin verification for donors and NGOs.
- Donation creation, validation, matching, acceptance, assignment, and full custody tracking.
- Safety checklist and exception/complaint workflow.
- NGO-managed beneficiary groups and distribution records.
- Role-specific dashboards, notifications, receipts, and reports.
- Searchable audit history and aggregated impact analytics.
- Accessible responsive public website and authenticated operational interfaces.

## Validation, safety, and auditability

Server-side Zod schemas validate all external input; client validation improves usability but is never authoritative. Food pickup deadlines must follow preparation time, quantities must be positive, and terminal workflow states cannot be reopened without an audited administrative process. Database transactions will enforce concurrent acceptance and assignment integrity.

Every material event records an immutable audit entry: actor, role, action, entity, prior state, new state, timestamp, request metadata, and reason where relevant. Records containing personal contact details use least-privilege access; analytics use aggregated data. Files and evidence require content validation, secure storage, and access checks.

## Security rules

- Authentication, sessions, and authorization are server-enforced in the authentication phase.
- Secrets are supplied through environment variables only; `.env*` files are ignored except `.env.example`.
- No credentials, database URLs, API keys, or beneficiary-identifying data are committed.
- Rate limiting, input validation, CSRF protection where applicable, secure headers, and audit monitoring are implementation requirements before production.
- Database access occurs through data-access adapters; routes and components do not query storage directly.

## Technical architecture

- Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, and shadcn-compatible components.
- Route groups separate public pages from future protected dashboards.
- `components/ui` contains reusable primitives; `components/layout` owns shared shells; `components/shared` holds cross-feature presentation components.
- `types`, `lib/validations`, `lib/constants`, `lib/services`, and `lib/data-access` create clear domain and server boundaries.
- A future database adapter and authentication provider will be selected and integrated only in their respective phases.

## Implementation phases

1. **Foundation:** architecture, design system, specifications, validation contracts, and public shell.
2. **Database:** schema, migrations, repositories, transactions, and audit persistence.
3. **Authentication:** identity, role authorization, organization verification, and protected routes.
4. **Donation workflow:** donor creation, matching, acceptance, assignment, safety, pickup, delivery, and receipts.
5. **NGO, volunteer, and admin operations:** dashboards, beneficiary distribution, safety controls, complaints, and reporting.
6. **Public website and production readiness:** public content, analytics, end-to-end testing, accessibility, observability, and deployment hardening.
