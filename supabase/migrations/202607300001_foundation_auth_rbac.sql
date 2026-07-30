create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('super_admin', 'editor', 'marketing', 'service')),
  label text not null,
  created_at timestamptz not null default now()
);

create table public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references public.profiles(id),
  primary key (profile_id, role_id)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.roles (key, label)
values
  ('super_admin', '超級管理員'),
  ('editor', '編輯'),
  ('marketing', '行銷'),
  ('service', '客服')
on conflict (key) do update set label = excluded.label;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    updated_at = now();

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create trigger on_auth_user_profile_updated
after update of email, raw_user_meta_data on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.has_role(role_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profile_roles pr
    join public.roles r on r.id = pr.role_id
    where pr.profile_id = auth.uid()
      and r.key = role_key
  );
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.profile_roles enable row level security;
alter table public.audit_events enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.roles from anon, authenticated;
revoke all on table public.profile_roles from anon, authenticated;
revoke all on table public.audit_events from anon, authenticated;
revoke all on function public.has_role(text) from public;

grant select on table public.profiles to authenticated;
grant select on table public.roles to authenticated;
grant select on table public.profile_roles to authenticated;
grant select on table public.audit_events to authenticated;
grant execute on function public.has_role(text) to authenticated;

create policy profiles_select_self_or_super_admin
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.has_role('super_admin'));

create policy roles_select_authenticated
on public.roles
for select
to authenticated
using (true);

create policy profile_roles_select_self_or_super_admin
on public.profile_roles
for select
to authenticated
using (profile_id = auth.uid() or public.has_role('super_admin'));

create policy audit_events_select_super_admin
on public.audit_events
for select
to authenticated
using (public.has_role('super_admin'));
