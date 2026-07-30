# G9G Growth Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the preview-only brand growth audit form into a production-ready lead workflow with secure persistence, spam protection, email notifications, attribution, and role-protected admin management.

**Architecture:** Keep the Next.js App Router application and Supabase foundation. Submit through a server action that validates with Zod, applies honeypot and rate-limit checks, stores one normalized application record plus immutable activity events, and sends two transactional emails through the Resend HTTP API with idempotency keys. Admin pages read through server-side services and Supabase RLS; no browser client can read complete applicant PII.

**Tech Stack:** Node.js 24, Next.js 16.2.12, React 19.2.8, TypeScript 6.0.3, Supabase PostgreSQL/RLS, Zod 4.4.3, Resend HTTPS API, Vitest, Testing Library, Playwright, pgTAP.

## Global Constraints

- Work only on `feature/growth-audit`; integration target is `develop`; do not modify `main` or create a production deployment.
- The public name is always `品牌成長健檢`; never describe it as free.
- First-stage fields are exactly contact name, brand name, mobile, email, brand URL, privacy consent, and hidden honeypot.
- A confirmation email acknowledges receipt only and does not promise acceptance, a report, a meeting, or a place in the service.
- Complete PII and internal notes are readable only by `super_admin` and `service` roles through both RLS and server-side authorization.
- Never expose Resend API keys, Supabase service role keys, rate-limit secrets, internal notes, or applicant PII to client bundles.
- Store first-touch and last-touch attribution without trusting arbitrary client-supplied timestamps or statuses.
- Use the Resend `Idempotency-Key` header for each transactional email request.
- Keep the current public visual system and existing `/admin` behavior intact.

---

### Task 1: Database Model, Status Contract, and RLS

**Files:**
- Create: `supabase/migrations/202607300002_growth_audit.sql`
- Create: `supabase/tests/0002_growth_audit.test.sql`
- Create: `src/lib/growth-audit/status.ts`
- Test: `tests/unit/growth-audit-status.test.ts`

**Interfaces:**
- Produces `growth_audit_statuses`, `GrowthAuditStatus`, `growth_audit_applications`, `growth_audit_events`, and database policies.

- [ ] Write failing unit tests asserting allowed statuses are `new`, `contacted`, `qualified`, `questionnaire_sent`, `reviewing`, `completed`, `declined`, and `spam`.
- [ ] Write failing pgTAP tests proving anonymous users cannot select applications, authenticated non-staff cannot select them, and `super_admin`/`service` can read them.
- [ ] Add tables with UUID primary keys, normalized applicant fields, consent timestamp, source attribution JSON, hashed request fingerprint, status timestamps, created/updated timestamps, and immutable event rows.
- [ ] Add constraints for E.164-compatible mobile storage, HTTPS brand URL, lowercase email, allowed statuses, non-empty consent version, and no blank event type.
- [ ] Add RLS policies and indexes for created time, status, email hash, and request fingerprint.
- [ ] Run `npm run db:reset`, `npm run db:test`, `npx supabase db lint`, unit tests, lint, and typecheck; commit.

### Task 2: Server Validation, Attribution, Honeypot, and Rate Limiting

**Files:**
- Create: `src/lib/growth-audit/schema.ts`
- Create: `src/lib/growth-audit/attribution.ts`
- Create: `src/lib/growth-audit/fingerprint.ts`
- Create: `src/lib/growth-audit/rate-limit.ts`
- Test: `tests/unit/growth-audit-schema.test.ts`
- Test: `tests/unit/growth-audit-rate-limit.test.ts`

**Interfaces:**
- Produces `growthAuditSubmissionSchema`, `normalizeGrowthAuditSubmission`, `parseAttributionCookies`, `createRequestFingerprint`, and `checkGrowthAuditRateLimit`.

- [ ] Write failing tests for trimmed names, lowercase email, Taiwan mobile normalization, HTTPS-only URL, required consent, empty honeypot, maximum lengths, and rejection of unknown fields.
- [ ] Write failing tests that preserve approved UTM/referrer/landing-page keys only, derive first and last touch independently, and reject oversized attribution values.
- [ ] Write failing rate-limit tests for per-fingerprint and per-email windows, duplicate rapid submissions, and expiry.
- [ ] Implement pure validation/normalization helpers and a Supabase-backed rate-limit check using recent application rows; do not trust client IP headers except Vercel-provided forwarding order.
- [ ] Run focused tests, lint, typecheck, database tests; commit.

### Task 3: Persistence Service and Transactional Email Gateway

**Files:**
- Create: `src/lib/growth-audit/repository.ts`
- Create: `src/lib/email/resend.ts`
- Create: `src/lib/email/templates/growth-audit.ts`
- Modify: `src/lib/env/schema.ts`
- Modify: `.env.example`
- Test: `tests/unit/growth-audit-email.test.ts`
- Test: `tests/unit/growth-audit-repository.test.ts`

**Interfaces:**
- Produces `createGrowthAuditApplication`, `appendGrowthAuditEvent`, `sendApplicantReceipt`, and `sendAdminNotification`.

- [ ] Write failing tests for one stored application plus `submitted` event, normalized values, duplicate prevention, and no internal fields returned to public callers.
- [ ] Write failing email tests for recipient, reply-to, subject, acknowledgement-only copy, escaped applicant values, and deterministic idempotency keys.
- [ ] Add required server env fields `RESEND_API_KEY`, `GROWTH_AUDIT_FROM_EMAIL`, and `GROWTH_AUDIT_ADMIN_EMAIL`.
- [ ] Implement Resend via `fetch('https://api.resend.com/emails')`, bearer auth, JSON body, timeout/abort, response validation, and `Idempotency-Key`.
- [ ] Persist first, then send both emails; record individual email success/failure events without deleting the application when delivery fails.
- [ ] Run focused tests, lint, typecheck, build; commit.

### Task 4: Public Submission Action, Success State, and Attribution Cookies

**Files:**
- Create: `src/app/(public)/growth-audit/actions.ts`
- Create: `src/app/(public)/growth-audit/success/page.tsx`
- Modify: `src/components/public/audit-preview-form.tsx`
- Modify: `src/app/(public)/growth-audit/page.tsx`
- Create: `src/proxy/attribution.ts`
- Modify: `src/proxy.ts`
- Test: `tests/unit/growth-audit-action.test.ts`
- Modify: `tests/e2e/public-site.spec.ts`

**Interfaces:**
- Produces `submitGrowthAudit`, attribution cookies, and `/growth-audit/success`.

- [ ] Write failing action tests for valid success, field errors, honeypot rejection, rate-limit rejection, repository failure, and email failure with stored application.
- [ ] Replace preview-only client behavior with progressive-enhancement form submission and accessible pending/error states.
- [ ] Capture signed first-touch cookie once and refresh last-touch cookie on eligible public landings; exclude admin/auth/static paths and strip PII-like query keys.
- [ ] Redirect successful submissions to a noindex success page that states receipt, expected contact timing, and no guarantee of acceptance.
- [ ] Add Playwright coverage for keyboard submission, invalid fields, success redirect with test adapter, and no PII in URL.
- [ ] Run unit, build, Playwright, database tests; commit.

### Task 5: Admin Queue, Detail, Notes, Status Changes, and Audit Events

**Files:**
- Create: `src/app/admin/(protected)/growth-audits/page.tsx`
- Create: `src/app/admin/(protected)/growth-audits/[id]/page.tsx`
- Create: `src/app/admin/(protected)/growth-audits/actions.ts`
- Create: `src/components/admin/growth-audit-list.tsx`
- Create: `src/components/admin/growth-audit-detail.tsx`
- Create: `src/lib/growth-audit/admin-service.ts`
- Modify: `src/components/admin/admin-shell.tsx`
- Test: `tests/unit/growth-audit-admin.test.tsx`
- Modify: `tests/e2e/foundation.spec.ts`

**Interfaces:**
- Produces role-protected list/detail pages, `updateGrowthAuditStatus`, and `addGrowthAuditInternalNote`.

- [ ] Write failing tests for queue filters, masked list PII, full detail for allowed roles, denial for unrelated roles, valid status transitions, note validation, and immutable event creation.
- [ ] Implement server-only queries with pagination and status/date filters; never fetch all records into the browser.
- [ ] Implement status and note server actions with fresh role checks, optimistic concurrency using `updated_at`, and event recording.
- [ ] Add admin navigation and empty/error states.
- [ ] Add browser smoke coverage for authorized queue access and anonymous redirect.
- [ ] Run the complete quality gate and database policy tests; request review; commit.

### Task 6: Operational Documentation and Release Gate

**Files:**
- Create: `docs/operations/growth-audit.md`
- Modify: `README.md`
- Modify: `.github/workflows/quality.yml` only if existing commands do not cover the new migration and tests.

- [ ] Document Resend domain verification, sender/admin addresses, Preview versus Production environment variables, Supabase migration order, email test procedure, retry procedure, PII handling, retention, and incident response.
- [ ] Verify no secrets or applicant data appear in logs, fixtures, screenshots, URLs, or client bundles.
- [ ] Run `npm ci`, lint, typecheck, all unit tests, build, Playwright, `db:reset`, `db:test`, and Supabase lint.
- [ ] Open a Draft PR to `develop`; keep `main` unchanged and do not deploy production.

## Plan Self-Review Record

- Spec coverage: persistence, validation, honeypot, rate limit, statuses, admin management, notes, events, two emails, attribution, RLS, and success page are covered.
- Scope boundary: content CMS, fixed-page CMS, revision publishing, analytics dashboards, domain purchase, and production promotion remain separate roadmap phases.
- Placeholder scan: no implementation placeholders or fake URLs are present.
- Type consistency: status, repository, email, action, and admin interfaces are defined before use.
