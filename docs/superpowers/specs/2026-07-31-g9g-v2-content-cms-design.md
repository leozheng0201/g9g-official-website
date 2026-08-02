# G9G V2 Content CMS Design

## 1. Goal

Build a production-ready content management system for:

- 品牌觀點與 LINE 禮物研究院文章
- 品牌成長案例
- FAQ
- 品牌資源

The CMS becomes the single source of truth for these content types. Existing public content is migrated into the CMS without changing approved public URLs, wording, ordering, attribution, or claims.

## 2. Scope Boundaries

This phase includes content records, block-based editing, media library, workflow, preview, scheduling, redirects, soft deletion, version snapshots, public rendering, migration, permissions, and quality gates.

This phase does not include full fixed-page CMS for the homepage and service pages. That remains the next roadmap phase. It also does not publish to `main` or create a production deployment.

## 3. Core Architecture

Use one shared content core plus type-specific fields.

### Shared content core

Each content item has:

- UUID
- content type
- title
- slug
- excerpt
- cover media
- category
- tags
- author
- structured content blocks
- SEO title
- SEO description
- canonical URL
- OG media
- workflow status
- sort order
- scheduled publish time
- scheduled unpublish time
- published time
- deleted time
- created by
- updated by
- created at
- updated at
- optimistic concurrency version

### Type-specific fields

#### Article

- reading time
- related content
- related CTA
- article subtype: 品牌觀點 or LINE 禮物研究院

#### Case study

- brand name
- service scope
- result summary
- result attribution statement
- optional timeline

The 法布甜 attribution must continue to state that results are from overall ecommerce and brand transformation, not LINE Gift alone.

#### FAQ

- question
- answer blocks
- FAQ category
- display order

#### Resource

- downloadable media
- external URL
- download instructions
- gated or ungated access setting

Gated resource lead capture is data-model ready but not enabled unless separately approved.

## 4. Content Blocks

Store editor content as validated structured JSON, never arbitrary HTML.

Initial block types:

- heading
- paragraph
- image
- image-text split
- quote or key insight
- bullet or numbered list
- CTA button
- metric or highlight cards
- table
- video embed
- FAQ group
- divider

Every block supports:

- stable block ID
- add
- edit
- duplicate
- reorder
- disable
- delete

Rendering is controlled by approved frontend components so content cannot break the visual system.

## 5. Roles and Permissions

### super_admin

- full CMS access
- create and edit
- submit and withdraw review
- approve, schedule, publish, unpublish
- move to trash
- restore
- permanently delete
- override locks when necessary

### editor

- create and edit
- submit and withdraw review
- return for revision
- approve, schedule, publish, unpublish
- move to trash
- restore
- cannot permanently delete

### marketing

- create and edit drafts
- submit for review
- withdraw review
- cannot approve, publish, unpublish, or permanently delete

### service

- no CMS access
- continues to manage growth audit applications only

Permissions are enforced in both server-side authorization and Supabase RLS.

## 6. Workflow

Statuses:

- draft
- in_review
- changes_requested
- approved
- scheduled
- published
- unpublished
- trashed

Rules:

- marketing may move draft or changes_requested to in_review.
- editor and super_admin may return in_review content with a required reason.
- editor and super_admin may approve content.
- approved content may be published immediately or scheduled.
- published content may be unpublished immediately or automatically.
- content under review is locked against normal editing.
- every transition records actor, timestamp, source status, destination status, and optional reason.

## 7. Preview

Provide both:

- in-admin live preview for fast editing feedback
- private frontend preview links for accurate review

Private preview links:

- use signed opaque tokens
- expire automatically
- can be revoked
- are excluded from sitemap
- send `noindex, nofollow`
- display a visible draft preview label
- never contain personal data in the URL
- always render the latest draft revision

## 8. Scheduling

Support:

- immediate publish
- scheduled publish
- scheduled unpublish
- Taiwan timezone input and display

Scheduling jobs must be idempotent. Re-running the same job cannot create duplicate publication events or corrupt status.

A scheduled item cannot publish if it no longer satisfies workflow requirements.

## 9. Slugs and Redirects

- slugs are generated automatically from title
- editors may modify slugs manually
- slugs are unique within their public route namespace
- published slug changes automatically create a permanent redirect record
- historical slugs remain reserved and cannot be reused by another content item
- redirect loops and conflicting destinations are blocked
- legacy public URLs remain unchanged during migration

## 10. SEO Rules

Published content may appear in sitemap and search indexing.

Draft, review, preview, scheduled-before-release, unpublished, and trashed content must not appear in sitemap and must not be indexable.

Metadata:

- title
- description
- canonical URL
- OG image
- Article schema for articles
- FAQ schema for FAQ content where appropriate
- breadcrumb schema

No unsupported claims, fabricated performance data, or unverified metrics may be introduced during migration or editing.

## 11. Media Library

Use Supabase Storage with a shared media library.

Support:

- image and approved document uploads
- drag-and-drop upload inside editor
- direct library upload
- search
- categories and tags
- alt text
- title and description
- dimensions, MIME type, and file size
- usage references
- reuse across content
- prevention of deleting files still in use

Uploads are validated server-side for type and size. Public delivery URLs do not expose admin credentials or storage secrets.

## 12. Trash and Recovery

- delete moves content to trash
- trash retention is 30 days
- restore is available during retention
- only super_admin may permanently delete
- editor may move to trash and restore
- marketing cannot permanently delete
- published URLs stop resolving as public content after unpublish or trash according to defined redirect or 404 rules

Automatic cleanup may permanently delete records only after the retention period and only when no legal or operational hold exists.

## 13. Versioning

- each publish creates an immutable snapshot
- draft edits do not modify the currently published snapshot
- users can view revision history
- users can compare major field and block differences
- restoring an old revision creates a new draft rather than rewriting history
- workflow events and revision history are separate immutable records

Broader fixed-page revision publishing remains a later phase.

## 14. Public Read Model

Public pages read only the current published snapshot.

The public application must never read draft content through normal routes. Preview access uses a separate signed-token path.

Existing public route groups remain:

- `/insights`
- `/line-gift-academy`
- `/cases`
- `/faq`
- `/resources`

Detail route structure keeps existing approved URLs where already present. New detail routes follow stable namespace rules defined in implementation planning.

## 15. Existing Content Migration

Migration procedure:

1. inventory existing static content and route ownership
2. create deterministic migration fixtures
3. import records, blocks, SEO fields, sort order, and content type metadata
4. preserve existing URLs
5. preserve approved wording and attribution
6. render CMS-backed pages in a feature branch
7. compare static and CMS outputs
8. switch public reads to CMS only after parity tests pass
9. remove old static sources to prevent duplicate maintenance

Migration must not silently rewrite content, reconcile conflicting claims, add metrics, or change result attribution.

## 16. Concurrency and Error Handling

- use optimistic concurrency with version and `updated_at`
- reject stale writes with a clear conflict message
- failed saves retain current editor state
- failed media uploads can retry independently
- failed schedules record retryable operational events
- invalid redirects block publishing
- internal errors do not expose draft content, secrets, or admin notes
- destructive actions require explicit confirmation

## 17. Database Model

Expected tables or equivalent normalized structures:

- content_items
- content_revisions
- content_publications
- content_workflow_events
- content_redirects
- content_categories
- content_tags
- content_item_tags
- media_assets
- media_usages
- preview_tokens

Type-specific data may use validated JSONB or dedicated tables. The implementation plan must choose the smallest structure that preserves constraints, query performance, and type safety.

## 18. Admin Information Architecture

Main navigation:

- 內容總覽
- 品牌觀點
- LINE 禮物研究院
- 品牌案例
- FAQ
- 品牌資源
- 媒體庫
- 待審內容
- 垃圾桶

Each type has its own list and editor experience while sharing the same underlying content system.

Lists support:

- search
- status filter
- category filter
- author filter
- date filter
- pagination
- sort order
- bulk move to trash where permission allows

## 19. Testing and Acceptance Gates

Required tests:

- schema and validation unit tests
- block validation and rendering tests
- role permission tests
- RLS and pgTAP tests
- workflow transition tests
- review lock tests
- scheduling and idempotency tests
- slug and redirect tests
- preview token expiry and revocation tests
- media upload and usage tests
- trash, restore, and permanent deletion tests
- public read isolation tests
- SEO, sitemap, canonical, and noindex tests
- migration parity tests
- desktop and mobile admin browser tests

Full quality gate:

- lint
- TypeScript
- unit tests
- production build
- Playwright
- Supabase reset
- pgTAP
- database lint

No phase completion claim is allowed until the complete quality gate passes.

## 20. Release Boundary

This work targets `develop` through a feature pull request.

It must not:

- modify `main`
- deploy production
- enable public indexing for previews
- publish migrated CMS content to the production domain

A private preview and explicit user approval are required before any production release.