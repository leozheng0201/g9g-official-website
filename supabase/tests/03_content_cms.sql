begin;

select plan(52);

select has_table('public', 'content_items', 'content_items exists');
select has_table('public', 'content_revisions', 'content_revisions exists');
select has_table('public', 'content_publications', 'content_publications exists');
select has_table('public', 'content_workflow_events', 'content_workflow_events exists');
select has_table('public', 'content_redirects', 'content_redirects exists');
select has_table('public', 'content_categories', 'content_categories exists');
select has_table('public', 'content_tags', 'content_tags exists');
select has_table('public', 'content_item_tags', 'content_item_tags exists');
select has_table('public', 'media_assets', 'media_assets exists');
select has_table('public', 'media_usages', 'media_usages exists');
select has_table('public', 'preview_tokens', 'preview_tokens exists');

select has_function('public', 'can_access_cms', array[]::text[], 'can_access_cms exists');
select has_function('public', 'can_publish_content', array[]::text[], 'can_publish_content exists');
select has_function('public', 'can_permanently_delete_content', array[]::text[], 'can_permanently_delete_content exists');

select col_is_pk('public', 'content_items', 'id', 'content_items has id primary key');
select col_not_null('public', 'content_items', 'content_type', 'content type required');
select col_not_null('public', 'content_items', 'status', 'status required');
select col_not_null('public', 'content_items', 'slug', 'slug required');
select col_not_null('public', 'content_items', 'version', 'optimistic version required');
select col_has_default('public', 'content_items', 'version', 'version has default');
select col_type_is('public', 'content_items', 'type_fields', 'jsonb', 'type fields stored as jsonb');
select col_type_is('public', 'content_items', 'blocks', 'jsonb', 'blocks stored as jsonb');

select col_not_null('public', 'content_revisions', 'snapshot', 'revision snapshot required');
select col_not_null('public', 'content_publications', 'snapshot', 'publication snapshot required');
select col_not_null('public', 'content_workflow_events', 'event_type', 'workflow event type required');
select col_not_null('public', 'content_redirects', 'source_path', 'redirect source required');
select col_not_null('public', 'content_redirects', 'destination_path', 'redirect destination required');
select col_not_null('public', 'preview_tokens', 'token_hash', 'preview token hash required');
select col_not_null('public', 'preview_tokens', 'expires_at', 'preview expiry required');

select is(
  (select relrowsecurity from pg_class where oid = 'public.content_items'::regclass),
  true,
  'content_items has RLS'
);
select is(
  (select relrowsecurity from pg_class where oid = 'public.content_revisions'::regclass),
  true,
  'content_revisions has RLS'
);
select is(
  (select relrowsecurity from pg_class where oid = 'public.content_publications'::regclass),
  true,
  'content_publications has RLS'
);
select is(
  (select relrowsecurity from pg_class where oid = 'public.media_assets'::regclass),
  true,
  'media_assets has RLS'
);
select is(
  (select relrowsecurity from pg_class where oid = 'public.preview_tokens'::regclass),
  true,
  'preview_tokens has RLS'
);

select has_index('public', 'content_items', 'content_items_active_slug_unique', 'active slug is uniquely indexed');
select has_index('public', 'content_items', 'content_items_status_schedule_idx', 'status and schedule index exists');
select has_index('public', 'content_redirects', 'content_redirects_source_unique', 'redirect source is unique');
select has_index('public', 'media_assets', 'media_assets_checksum_idx', 'media checksum index exists');

select is(
  has_table_privilege('anon', 'public.content_items', 'INSERT'),
  false,
  'anonymous cannot insert content'
);
select is(
  has_table_privilege('authenticated', 'public.content_publications', 'INSERT'),
  false,
  'browser users cannot directly insert publication snapshots'
);

select is(
  (select count(*)::integer from public.content_items where slug = 'about-line-gift' and content_type = 'article' and article_subtype = 'line_gift_academy'),
  1,
  'official LINE Gift foundation content exists once'
);
select is(
  (select status from public.content_items where slug = 'about-line-gift'),
  'published',
  'official LINE Gift foundation content is published'
);
select is(
  (select count(*)::integer from public.content_publications p join public.content_items i on i.id = p.content_item_id where i.slug = 'about-line-gift' and p.unpublished_at is null),
  1,
  'official LINE Gift foundation content has one active publication'
);
select is(
  (select type_fields ->> 'sourceTitle' from public.content_items where slug = 'about-line-gift'),
  '2026 LINE 禮物資訊分享',
  'official LINE Gift source title is preserved'
);
select is(
  (select jsonb_array_length(type_fields -> 'featuredStats') from public.content_items where slug = 'about-line-gift'),
  4,
  'homepage trust signals contain four approved stats'
);
select is(
  (select type_fields ->> 'publicPath' from public.content_items where slug = 'about-line-gift'),
  '/about-line-gift',
  'official LINE Gift custom public path is preserved'
);
select is(
  (select p.snapshot #>> '{type_fields,sourceTitle}' from public.content_publications p join public.content_items i on i.id = p.content_item_id where i.slug = 'about-line-gift' and p.unpublished_at is null),
  '2026 LINE 禮物資訊分享',
  'publication snapshot preserves the official source title'
);
select is(
  (select jsonb_array_length(p.snapshot #> '{type_fields,featuredStats}') from public.content_publications p join public.content_items i on i.id = p.content_item_id where i.slug = 'about-line-gift' and p.unpublished_at is null),
  4,
  'publication snapshot preserves four homepage trust signals'
);
select is(
  (select count(*)::integer from public.content_revisions r join public.content_items i on i.id = r.content_item_id where i.slug = 'about-line-gift'),
  2,
  'official field normalization creates a new immutable revision'
);
select is(
  (select snapshot #>> '{type_fields,source_title}' from public.content_revisions where content_item_id = '30000000-0000-4000-8000-000000000201' and revision_number = 1),
  '2026 LINE 禮物資訊分享',
  'original revision remains unchanged for audit history'
);
select is(
  (select p.snapshot #>> '{type_fields,source_title}' from public.content_publications p join public.content_revisions r on r.id = p.revision_id where p.content_item_id = '30000000-0000-4000-8000-000000000201' and r.revision_number = 1 and p.unpublished_at is not null),
  '2026 LINE 禮物資訊分享',
  'original publication remains unchanged and is retired'
);
select is(
  (select count(*)::integer from public.content_workflow_events where content_item_id = '30000000-0000-4000-8000-000000000201' and event_type = 'official_fields_normalized'),
  1,
  'official field normalization leaves an audit event'
);

select * from finish();
rollback;
