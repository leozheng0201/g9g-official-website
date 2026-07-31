# G9G V2 Content CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready CMS for articles, LINE Gift Academy content, case studies, FAQ, and resources, migrate existing public content without changing approved URLs or claims, and make CMS records the single source of truth.

**Architecture:** Use one normalized content core with validated type-specific JSONB fields, immutable revisions/publications, a validated block model, Supabase Storage media assets, server-side RBAC plus RLS, and separate public read/preview paths. Public pages read only the active published snapshot; drafts remain isolated behind signed preview tokens.

**Tech Stack:** Next.js App Router, React, TypeScript, Zod, Supabase PostgreSQL/Auth/Storage, pgTAP, Vitest, Testing Library, Playwright, GitHub Actions.

## Global Constraints

- Target branch is `develop`; do not modify `main` or deploy production.
- Existing public URLs, approved wording, order, attribution, and claims must be preserved during migration.
- CMS becomes the only source for migrated articles, cases, FAQ, and resources; remove duplicate static sources only after parity tests pass.
- Store editor content as validated structured JSON; never accept arbitrary HTML.
- `super_admin` and `editor` may approve/publish; `marketing` may draft and submit; `service` has no CMS access.
- Delete means trash first; retention is 30 days; only `super_admin` may permanently delete.
- Published slug changes create permanent redirects; historical slugs remain reserved.
- Draft, review, preview, scheduled-before-release, unpublished, and trashed content must be excluded from sitemap and indexing.
- Official LINE Gift data must be visually and semantically separated from G9G interpretation and G9G service recommendations.
- Do not add unsupported promises, unverified platform metrics, or fabricated case results.
- Every task follows TDD and ends with a focused commit.

---

## File Map

### Database and server domain

- Create `supabase/migrations/202607310001_content_cms.sql` — content, workflow, revision, publication, redirect, taxonomy, media, usage, preview, and RLS schema.
- Create `supabase/tests/03_content_cms.sql` — pgTAP coverage for tables, constraints, grants, workflow access, public isolation, trash, and redirects.
- Create `src/lib/cms/types.ts` — shared discriminated unions and DTOs.
- Create `src/lib/cms/schemas.ts` — Zod validation for core fields, type-specific fields, and blocks.
- Create `src/lib/cms/workflow.ts` — transition rules and permission checks.
- Create `src/lib/cms/slugs.ts` — slug generation, validation, reservation, and redirect-loop checks.
- Create `src/lib/cms/preview-tokens.ts` — signed token creation, expiry, and revocation checks.
- Create `src/lib/cms/repository.ts` — server-only Supabase data access.
- Create `src/lib/cms/public-reader.ts` — published snapshot reads only.
- Create `src/lib/cms/scheduler.ts` — idempotent publish/unpublish processing.
- Create `src/lib/cms/media.ts` — media validation and usage protection.

### Admin UI

- Create `src/app/admin/content/layout.tsx` — CMS role gate and navigation shell.
- Create `src/app/admin/content/page.tsx` — content dashboard.
- Create `src/app/admin/content/[type]/page.tsx` — type-specific lists.
- Create `src/app/admin/content/[type]/new/page.tsx` — create flow.
- Create `src/app/admin/content/[type]/[id]/page.tsx` — editor and workflow actions.
- Create `src/app/admin/content/review/page.tsx` — review queue.
- Create `src/app/admin/content/trash/page.tsx` — trash and restore.
- Create `src/app/admin/media/page.tsx` — shared media library.
- Create `src/app/admin/content/actions.ts` — create/update/workflow/trash/schedule server actions.
- Create `src/app/admin/media/actions.ts` — upload/edit/delete server actions.
- Create `src/components/admin/cms/content-list.tsx`.
- Create `src/components/admin/cms/content-editor.tsx`.
- Create `src/components/admin/cms/block-editor.tsx`.
- Create `src/components/admin/cms/live-preview.tsx`.
- Create `src/components/admin/cms/workflow-panel.tsx`.
- Create `src/components/admin/cms/media-picker.tsx`.

### Public rendering and migration

- Create `src/components/public/content/content-renderer.tsx` — approved block renderer.
- Create `src/components/public/content/content-card.tsx`.
- Create `src/app/(preview)/preview/content/[token]/page.tsx` — private preview route.
- Modify `src/app/(public)/insights/page.tsx` — CMS-backed list.
- Modify `src/app/(public)/line-gift-academy/page.tsx` — CMS-backed list.
- Modify `src/app/(public)/cases/page.tsx` — CMS-backed list.
- Modify `src/app/(public)/faq/page.tsx` — CMS-backed FAQ.
- Modify `src/app/(public)/resources/page.tsx` — CMS-backed resources.
- Create detail routes under the existing public namespaces without changing approved legacy URLs.
- Create `src/content/migrations/content-cms-seed.ts` — deterministic migration source for approved existing content.
- Create `scripts/migrate-static-content-to-cms.ts` — idempotent migration command.
- Modify `src/app/sitemap.ts` and SEO helpers to use published CMS records only.
- Modify `src/proxy.ts` to serve CMS redirects before normal route handling.

### Tests

- Create `src/lib/cms/__tests__/schemas.test.ts`.
- Create `src/lib/cms/__tests__/workflow.test.ts`.
- Create `src/lib/cms/__tests__/slugs.test.ts`.
- Create `src/lib/cms/__tests__/preview-tokens.test.ts`.
- Create `src/lib/cms/__tests__/scheduler.test.ts`.
- Create `src/lib/cms/__tests__/media.test.ts`.
- Create `src/components/admin/cms/__tests__/block-editor.test.tsx`.
- Create `src/components/public/content/__tests__/content-renderer.test.tsx`.
- Create `e2e/content-cms.spec.ts`.
- Create `e2e/content-preview.spec.ts`.
- Create `e2e/content-migration-parity.spec.ts`.

---

### Task 1: Database Core and RLS

**Files:**
- Create: `supabase/migrations/202607310001_content_cms.sql`
- Create: `supabase/tests/03_content_cms.sql`

**Interfaces:**
- Produces tables: `content_items`, `content_revisions`, `content_publications`, `content_workflow_events`, `content_redirects`, `content_categories`, `content_tags`, `content_item_tags`, `media_assets`, `media_usages`, `preview_tokens`.
- Produces helper functions: `can_access_cms()`, `can_publish_content()`, `can_permanently_delete_content()`.

- [ ] **Step 1: Write failing pgTAP tests** for table existence, content type/status checks, unique active slug per namespace, immutable revision/publication/event records, RLS enabled, anonymous public access limited to active publications, and role-specific write grants.
- [ ] **Step 2: Run database tests** with `supabase db reset && supabase test db`; expect failures for missing tables/functions.
- [ ] **Step 3: Implement migration** with UUID primary keys, timestamps, optimistic `version`, `deleted_at`, Taiwan scheduling timestamps stored as `timestamptz`, foreign keys, check constraints, partial indexes, and revocation of direct browser writes to immutable tables.
- [ ] **Step 4: Add RLS policies** so `super_admin`, `editor`, and `marketing` have only their approved CMS access; `service` and normal users cannot enter CMS; anonymous users can only select active published snapshots through the public read model.
- [ ] **Step 5: Run pgTAP and database lint**; expect all green.
- [ ] **Step 6: Commit** `feat: add content CMS database core`.

### Task 2: Type Contracts and Block Validation

**Files:**
- Create: `src/lib/cms/types.ts`
- Create: `src/lib/cms/schemas.ts`
- Test: `src/lib/cms/__tests__/schemas.test.ts`

**Interfaces:**
- Produces `ContentType`, `ContentStatus`, `ContentBlock`, `ContentDraftInput`, `ArticleFields`, `CaseStudyFields`, `FaqFields`, `ResourceFields`.
- Produces `parseContentDraft(input)` and `parseContentBlocks(input)`.

- [ ] **Step 1: Write failing unit tests** covering all 12 block types, stable block IDs, unknown-key rejection, HTTPS-only links where required, safe video providers, table shape validation, type-specific required fields, and result attribution requirement for case studies.
- [ ] **Step 2: Run** `npm test -- schemas.test.ts`; expect missing-module failure.
- [ ] **Step 3: Implement discriminated unions and strict Zod schemas** with maximum lengths, allowed URL protocols, no arbitrary HTML, and exact type-specific payloads.
- [ ] **Step 4: Run unit tests**; expect pass.
- [ ] **Step 5: Commit** `feat: define CMS content contracts`.

### Task 3: Workflow, Review Lock, Trash, and Permissions

**Files:**
- Create: `src/lib/cms/workflow.ts`
- Test: `src/lib/cms/__tests__/workflow.test.ts`

**Interfaces:**
- Produces `canPerformContentAction(role, status, action)`.
- Produces `transitionContent({ role, from, action, reason })`.

- [ ] **Step 1: Write failing tests** for every allowed and forbidden transition, required return reason, review lock, marketing restrictions, editor permanent-delete prohibition, 30-day retention, and super-admin override.
- [ ] **Step 2: Run focused tests**; expect missing functions.
- [ ] **Step 3: Implement a table-driven state machine** for draft, in_review, changes_requested, approved, scheduled, published, unpublished, and trashed.
- [ ] **Step 4: Run tests**; expect pass.
- [ ] **Step 5: Commit** `feat: add CMS workflow rules`.

### Task 4: Slugs, Redirects, and SEO Reservation

**Files:**
- Create: `src/lib/cms/slugs.ts`
- Test: `src/lib/cms/__tests__/slugs.test.ts`
- Modify: `src/proxy.ts`

**Interfaces:**
- Produces `createSlug(title)`, `normalizeSlug(value)`, `validateSlugChange(input)`, `detectRedirectLoop(edges)`.

- [ ] **Step 1: Write failing tests** for Traditional Chinese titles, duplicate slugs, reserved history, published slug changes, redirect conflicts, loops, self-redirects, and protected namespaces.
- [ ] **Step 2: Run tests**; expect fail.
- [ ] **Step 3: Implement deterministic slug normalization** with readable ASCII fallback and stable collision suffixes.
- [ ] **Step 4: Implement redirect validation** and proxy lookup before route handling.
- [ ] **Step 5: Run unit tests and existing proxy tests**; expect pass.
- [ ] **Step 6: Commit** `feat: add CMS slug redirects`.

### Task 5: Repository, Revisions, Publications, and Public Reader

**Files:**
- Create: `src/lib/cms/repository.ts`
- Create: `src/lib/cms/public-reader.ts`
- Test: `src/lib/cms/__tests__/repository.test.ts`

**Interfaces:**
- Produces `createContentDraft`, `updateContentDraft`, `submitContentForReview`, `publishContent`, `unpublishContent`, `moveContentToTrash`, `restoreContent`, `getPublishedContentBySlug`, `listPublishedContent`.

- [ ] **Step 1: Write failing repository tests** with mocked Supabase adapter for stale-version rejection, immutable publication snapshot, event creation, draft/public separation, restore behavior, and no-publication-on-failed-transaction.
- [ ] **Step 2: Run tests**; expect missing repository.
- [ ] **Step 3: Implement server-only repository functions** using explicit column lists, optimistic concurrency, transactions/RPC where atomicity is required, and normalized error results.
- [ ] **Step 4: Implement public reader** that reads only active publication snapshots and never falls back to drafts.
- [ ] **Step 5: Run tests**; expect pass.
- [ ] **Step 6: Commit** `feat: add CMS repository and public reader`.

### Task 6: Media Library and Usage Protection

**Files:**
- Create: `src/lib/cms/media.ts`
- Create: `src/app/admin/media/actions.ts`
- Create: `src/app/admin/media/page.tsx`
- Create: `src/components/admin/cms/media-picker.tsx`
- Test: `src/lib/cms/__tests__/media.test.ts`

**Interfaces:**
- Produces `validateMediaUpload`, `createMediaAsset`, `updateMediaMetadata`, `deleteMediaAsset`, `listMediaUsage`.

- [ ] **Step 1: Write failing tests** for MIME/size limits, alt requirements for images, duplicate checksum reuse, usage records, and delete blocking while in use.
- [ ] **Step 2: Run tests**; expect fail.
- [ ] **Step 3: Implement validation and repository logic** for approved images/documents, metadata, checksum, and usage references.
- [ ] **Step 4: Implement server actions and media library page** with role checks, search, filters, upload, metadata edit, and safe deletion.
- [ ] **Step 5: Run tests and typecheck**; expect pass.
- [ ] **Step 6: Commit** `feat: add shared CMS media library`.

### Task 7: Block Editor and Live Preview

**Files:**
- Create: `src/components/admin/cms/block-editor.tsx`
- Create: `src/components/admin/cms/content-editor.tsx`
- Create: `src/components/admin/cms/live-preview.tsx`
- Test: `src/components/admin/cms/__tests__/block-editor.test.tsx`

**Interfaces:**
- Consumes `ContentBlock`, `parseContentBlocks`.
- Produces a controlled editor with `value`, `onChange`, `readOnly`, and stable block IDs.

- [ ] **Step 1: Write failing component tests** for adding, editing, duplicating, reordering, disabling, deleting blocks, preserving IDs, read-only review lock, and validation feedback.
- [ ] **Step 2: Run focused tests**; expect missing components.
- [ ] **Step 3: Implement accessible block controls** using native buttons/forms and controlled state; do not add a large editor framework in phase one.
- [ ] **Step 4: Implement live preview** using the same renderer as public pages.
- [ ] **Step 5: Run tests**; expect pass.
- [ ] **Step 6: Commit** `feat: add structured block editor`.

### Task 8: Public Block Renderer and Structured Data

**Files:**
- Create: `src/components/public/content/content-renderer.tsx`
- Create: `src/components/public/content/content-card.tsx`
- Test: `src/components/public/content/__tests__/content-renderer.test.tsx`
- Modify: SEO structured-data helpers.

**Interfaces:**
- Produces `ContentRenderer({ blocks })` and content-type metadata/schema helpers.

- [ ] **Step 1: Write failing tests** for every block, disabled-block omission, safe link attributes, responsive images, table accessibility, FAQ schema, Article schema, breadcrumb schema, and no raw HTML execution.
- [ ] **Step 2: Run tests**; expect fail.
- [ ] **Step 3: Implement approved visual renderers** matching the public design system.
- [ ] **Step 4: Implement metadata and JSON-LD helpers** using only published snapshot fields.
- [ ] **Step 5: Run tests**; expect pass.
- [ ] **Step 6: Commit** `feat: render CMS content publicly`.

### Task 9: Admin Lists, Editors, Review Queue, and Trash

**Files:**
- Create admin pages and components listed in File Map.
- Create: `src/app/admin/content/actions.ts`
- Modify: admin navigation component.

**Interfaces:**
- Consumes repository/workflow/media/editor modules.
- Produces CMS list, editor, review, scheduling, trash, restore, and publication actions.

- [ ] **Step 1: Write failing component and route tests** for role-specific visibility, type filters, review lock, required return reason, schedule fields, stale-write error, trash/restore, and permanent-delete visibility.
- [ ] **Step 2: Run tests**; expect missing pages/actions.
- [ ] **Step 3: Implement CMS admin shell and navigation** with separate entrances for article, academy, case, FAQ, resource, media, review, and trash.
- [ ] **Step 4: Implement lists and editor pages** with server-side pagination/filtering and no full-dataset client load.
- [ ] **Step 5: Implement Server Actions** with fresh role checks and optimistic version checks on every write.
- [ ] **Step 6: Run unit tests, lint, and typecheck**; expect pass.
- [ ] **Step 7: Commit** `feat: add CMS administration`.

### Task 10: Private Preview Tokens

**Files:**
- Create: `src/lib/cms/preview-tokens.ts`
- Create: `src/app/(preview)/preview/content/[token]/page.tsx`
- Test: `src/lib/cms/__tests__/preview-tokens.test.ts`
- Test: `e2e/content-preview.spec.ts`

**Interfaces:**
- Produces `createPreviewToken`, `verifyPreviewToken`, `revokePreviewToken`.

- [ ] **Step 1: Write failing tests** for opaque signed tokens, expiration, revocation, wrong-content rejection, no PII, latest-draft rendering, and noindex/nofollow.
- [ ] **Step 2: Run tests**; expect fail.
- [ ] **Step 3: Implement token records and HMAC verification** with short expiry and constant-time signature comparison.
- [ ] **Step 4: Implement preview page** with visible preview banner and separate read path.
- [ ] **Step 5: Run unit and Playwright tests**; expect pass.
- [ ] **Step 6: Commit** `feat: add private CMS previews`.

### Task 11: Scheduling and Automatic Unpublish

**Files:**
- Create: `src/lib/cms/scheduler.ts`
- Create: `src/app/api/internal/content-scheduler/route.ts`
- Test: `src/lib/cms/__tests__/scheduler.test.ts`

**Interfaces:**
- Produces `processScheduledContent(now)` and protected scheduler route.

- [ ] **Step 1: Write failing tests** for Taiwan-time conversion, due publish, due unpublish, idempotent rerun, changed-status skip, event recording, and partial failure retry.
- [ ] **Step 2: Run tests**; expect fail.
- [ ] **Step 3: Implement scheduler service** using database locks or atomic update conditions.
- [ ] **Step 4: Implement protected internal route** requiring a server-only secret and returning counts without exposing content.
- [ ] **Step 5: Run tests**; expect pass.
- [ ] **Step 6: Commit** `feat: add CMS scheduling`.

### Task 12: Existing Content Inventory and Deterministic Migration

**Files:**
- Create: `src/content/migrations/content-cms-seed.ts`
- Create: `scripts/migrate-static-content-to-cms.ts`
- Create: `e2e/content-migration-parity.spec.ts`
- Modify/remove static content modules only after parity passes.

**Interfaces:**
- Produces deterministic records keyed by stable migration IDs.

- [ ] **Step 1: Inventory current static content** from insights, academy, cases, FAQ, and resources; record route, wording, order, attribution, SEO fields, and assets.
- [ ] **Step 2: Write failing parity tests** for route count, title, key copy, canonical URL, order, and attribution statements.
- [ ] **Step 3: Build deterministic seed fixtures** without rewriting source copy or adding unsupported metrics.
- [ ] **Step 4: Implement idempotent migration script** that upserts by migration key and never duplicates tags/media/redirects.
- [ ] **Step 5: Run migration in local Supabase and parity tests**; expect pass.
- [ ] **Step 6: Remove duplicate static sources and update imports** only after parity passes.
- [ ] **Step 7: Commit** `feat: migrate existing content into CMS`.

### Task 13: CMS-Backed Public Routes and Sitemap

**Files:**
- Modify public list pages listed in File Map.
- Create detail routes under approved namespaces.
- Modify `src/app/sitemap.ts` and metadata helpers.

**Interfaces:**
- Consumes `listPublishedContent` and `getPublishedContentBySlug`.

- [ ] **Step 1: Write failing route tests** proving drafts do not resolve, published records render, old slugs redirect, scheduled future content is absent, unpublished content is absent, and sitemap includes only active publications.
- [ ] **Step 2: Run tests**; expect existing static behavior to fail new expectations.
- [ ] **Step 3: Replace list/detail reads with public reader** and preserve current public route structure.
- [ ] **Step 4: Generate sitemap and canonical metadata from publications**.
- [ ] **Step 5: Run tests**; expect pass.
- [ ] **Step 6: Commit** `feat: serve public content from CMS`.

### Task 14: Browser Acceptance and Mobile Admin

**Files:**
- Create: `e2e/content-cms.spec.ts`
- Expand: `e2e/content-preview.spec.ts`

**Interfaces:**
- Validates complete browser workflows.

- [ ] **Step 1: Add Playwright scenarios** for marketing draft/submit, editor return/publish, preview expiry/revocation, schedule display, slug redirect, media reuse, trash restore, anonymous CMS denial, and mobile editor/list usability.
- [ ] **Step 2: Run Playwright**; capture actual failures.
- [ ] **Step 3: Fix only evidenced UI/route defects** without weakening assertions.
- [ ] **Step 4: Re-run Playwright**; expect all pass.
- [ ] **Step 5: Commit** `test: cover CMS browser workflows`.

### Task 15: Operations Documentation and Final Quality Gate

**Files:**
- Create: `docs/runbooks/content-cms-operations.md`
- Modify: `README.md`

**Interfaces:**
- Documents media bucket setup, scheduler secret, migration, review workflow, recovery, and incident response.

- [ ] **Step 1: Write runbook** covering Preview/Production configuration, Supabase Storage bucket/policies, scheduler setup, migration dry-run, rollback, trash recovery, redirect repair, preview revocation, and permission incident response.
- [ ] **Step 2: Update README** with CMS setup and verification commands.
- [ ] **Step 3: Run complete quality gate:** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, Playwright suites, `supabase db reset`, `supabase test db`, `supabase db lint`.
- [ ] **Step 4: Perform final diff/security review** for secrets, PII, unsupported claims, duplicate static sources, public draft access, unsafe HTML, and destructive actions.
- [ ] **Step 5: Create/refresh Draft PR to `develop`** with migration notes and evidence.
- [ ] **Step 6: Commit** `docs: add CMS operations runbook`.
