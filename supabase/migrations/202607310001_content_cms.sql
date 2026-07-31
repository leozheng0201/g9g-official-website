create table public.content_categories (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('article', 'case_study', 'faq', 'resource')),
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_type, slug)
);

create table public.content_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null default 'content-media',
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  file_size bigint not null check (file_size >= 0),
  width integer,
  height integer,
  checksum text,
  alt_text text,
  title text,
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('article', 'case_study', 'faq', 'resource')),
  article_subtype text check (article_subtype is null or article_subtype in ('insight', 'line_gift_academy')),
  title text not null,
  slug text not null,
  excerpt text,
  cover_media_id uuid references public.media_assets(id) on delete set null,
  category_id uuid references public.content_categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  blocks jsonb not null default '[]'::jsonb check (jsonb_typeof(blocks) = 'array'),
  type_fields jsonb not null default '{}'::jsonb check (jsonb_typeof(type_fields) = 'object'),
  seo_title text,
  seo_description text,
  canonical_url text,
  og_media_id uuid references public.media_assets(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'changes_requested', 'approved', 'scheduled', 'published', 'unpublished', 'trashed')),
  sort_order integer not null default 0,
  scheduled_publish_at timestamptz,
  scheduled_unpublish_at timestamptz,
  published_at timestamptz,
  deleted_at timestamptz,
  version integer not null default 1 check (version > 0),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (scheduled_unpublish_at is null or scheduled_publish_at is null or scheduled_unpublish_at > scheduled_publish_at)
);

create unique index content_items_active_slug_unique
on public.content_items (content_type, coalesce(article_subtype, ''), slug)
where deleted_at is null;

create index content_items_status_schedule_idx
on public.content_items (status, scheduled_publish_at, scheduled_unpublish_at);

create table public.content_item_tags (
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  tag_id uuid not null references public.content_tags(id) on delete cascade,
  primary key (content_item_id, tag_id)
);

create table public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  revision_number integer not null,
  snapshot jsonb not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (content_item_id, revision_number)
);

create table public.content_publications (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  revision_id uuid references public.content_revisions(id) on delete set null,
  snapshot jsonb not null,
  published_by uuid references public.profiles(id),
  published_at timestamptz not null default now(),
  unpublished_at timestamptz
);

create table public.content_workflow_events (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  event_type text not null,
  from_status text,
  to_status text,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.content_redirects (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid references public.content_items(id) on delete cascade,
  source_path text not null,
  destination_path text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  check (source_path <> destination_path)
);

create unique index content_redirects_source_unique
on public.content_redirects (source_path);

create table public.media_usages (
  id uuid primary key default gen_random_uuid(),
  media_asset_id uuid not null references public.media_assets(id) on delete restrict,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  usage_role text not null,
  block_id text,
  created_at timestamptz not null default now(),
  unique (media_asset_id, content_item_id, usage_role, block_id)
);

create index media_assets_checksum_idx on public.media_assets (checksum);

create table public.preview_tokens (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create or replace function public.can_access_cms()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('super_admin')
      or public.has_role('editor')
      or public.has_role('marketing');
$$;

create or replace function public.can_publish_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('super_admin')
      or public.has_role('editor');
$$;

create or replace function public.can_permanently_delete_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('super_admin');
$$;

alter table public.content_categories enable row level security;
alter table public.content_tags enable row level security;
alter table public.media_assets enable row level security;
alter table public.content_items enable row level security;
alter table public.content_item_tags enable row level security;
alter table public.content_revisions enable row level security;
alter table public.content_publications enable row level security;
alter table public.content_workflow_events enable row level security;
alter table public.content_redirects enable row level security;
alter table public.media_usages enable row level security;
alter table public.preview_tokens enable row level security;

revoke all on table public.content_categories from anon, authenticated;
revoke all on table public.content_tags from anon, authenticated;
revoke all on table public.media_assets from anon, authenticated;
revoke all on table public.content_items from anon, authenticated;
revoke all on table public.content_item_tags from anon, authenticated;
revoke all on table public.content_revisions from anon, authenticated;
revoke all on table public.content_publications from anon, authenticated;
revoke all on table public.content_workflow_events from anon, authenticated;
revoke all on table public.content_redirects from anon, authenticated;
revoke all on table public.media_usages from anon, authenticated;
revoke all on table public.preview_tokens from anon, authenticated;
revoke all on function public.can_access_cms() from public;
revoke all on function public.can_publish_content() from public;
revoke all on function public.can_permanently_delete_content() from public;

grant select, insert, update, delete on table public.content_categories to authenticated;
grant select, insert, update, delete on table public.content_tags to authenticated;
grant select, insert, update on table public.media_assets to authenticated;
grant select, insert, update on table public.content_items to authenticated;
grant select, insert, update, delete on table public.content_item_tags to authenticated;
grant select, insert on table public.content_revisions to authenticated;
grant select on table public.content_publications to authenticated;
grant select, insert on table public.content_workflow_events to authenticated;
grant select, insert on table public.content_redirects to authenticated;
grant select, insert, delete on table public.media_usages to authenticated;
grant select, insert, update on table public.preview_tokens to authenticated;
grant execute on function public.can_access_cms() to authenticated;
grant execute on function public.can_publish_content() to authenticated;
grant execute on function public.can_permanently_delete_content() to authenticated;

create policy cms_categories_access
on public.content_categories for all to authenticated
using (public.can_access_cms()) with check (public.can_access_cms());

create policy cms_tags_access
on public.content_tags for all to authenticated
using (public.can_access_cms()) with check (public.can_access_cms());

create policy cms_media_select
on public.media_assets for select to authenticated
using (public.can_access_cms());
create policy cms_media_insert
on public.media_assets for insert to authenticated
with check (public.can_access_cms());
create policy cms_media_update
on public.media_assets for update to authenticated
using (public.can_access_cms()) with check (public.can_access_cms());

create policy cms_content_select
on public.content_items for select to authenticated
using (public.can_access_cms());
create policy cms_content_insert
on public.content_items for insert to authenticated
with check (public.can_access_cms());
create policy cms_content_update
on public.content_items for update to authenticated
using (public.can_access_cms()) with check (public.can_access_cms());

create policy cms_item_tags_access
on public.content_item_tags for all to authenticated
using (public.can_access_cms()) with check (public.can_access_cms());

create policy cms_revisions_select
on public.content_revisions for select to authenticated
using (public.can_access_cms());
create policy cms_revisions_insert
on public.content_revisions for insert to authenticated
with check (public.can_access_cms());

create policy cms_publications_select
on public.content_publications for select to authenticated
using (public.can_access_cms());

create policy cms_workflow_select
on public.content_workflow_events for select to authenticated
using (public.can_access_cms());
create policy cms_workflow_insert
on public.content_workflow_events for insert to authenticated
with check (public.can_access_cms());

create policy cms_redirects_select
on public.content_redirects for select to authenticated
using (public.can_access_cms());
create policy cms_redirects_insert
on public.content_redirects for insert to authenticated
with check (public.can_publish_content());

create policy cms_media_usages_access
on public.media_usages for all to authenticated
using (public.can_access_cms()) with check (public.can_access_cms());

create policy cms_preview_select
on public.preview_tokens for select to authenticated
using (public.can_access_cms());
create policy cms_preview_insert
on public.preview_tokens for insert to authenticated
with check (public.can_access_cms());
create policy cms_preview_update
on public.preview_tokens for update to authenticated
using (public.can_access_cms()) with check (public.can_access_cms());
