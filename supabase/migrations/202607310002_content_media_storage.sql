insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-media',
  'content-media',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/gif','application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public delivery is allowed only for objects in the approved CMS bucket.
create policy content_media_public_read
on storage.objects
for select
to public
using (bucket_id = 'content-media');

-- Upload, replacement, and deletion are performed only with the server-side
-- service role. No anon/authenticated browser write policy is intentionally created.
