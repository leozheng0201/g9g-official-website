create table public.growth_audit_applications (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (
    status in (
      'new',
      'contacted',
      'qualified',
      'questionnaire_sent',
      'reviewing',
      'completed',
      'declined',
      'spam'
    )
  ),
  contact_name text not null,
  brand_name text not null,
  phone text not null,
  email text not null,
  brand_url text not null,
  privacy_accepted_at timestamptz not null,
  first_touch jsonb not null default '{}'::jsonb,
  last_touch jsonb not null default '{}'::jsonb,
  source_ip_hash text,
  user_agent text,
  duplicate_key text not null,
  internal_note text,
  contacted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.growth_audit_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.growth_audit_applications(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  event_type text not null,
  from_status text,
  to_status text,
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index growth_audit_applications_status_created_idx
  on public.growth_audit_applications (status, created_at desc);

create index growth_audit_applications_duplicate_created_idx
  on public.growth_audit_applications (duplicate_key, created_at desc);

create index growth_audit_events_application_created_idx
  on public.growth_audit_events (application_id, created_at desc);

create or replace function public.can_manage_growth_audits()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('super_admin') or public.has_role('service');
$$;

alter table public.growth_audit_applications enable row level security;
alter table public.growth_audit_events enable row level security;

revoke all on table public.growth_audit_applications from anon, authenticated;
revoke all on table public.growth_audit_events from anon, authenticated;
revoke all on function public.can_manage_growth_audits() from public;

grant select, update on table public.growth_audit_applications to authenticated;
grant select on table public.growth_audit_events to authenticated;
grant execute on function public.can_manage_growth_audits() to authenticated;

create policy growth_audit_applications_select_staff
on public.growth_audit_applications
for select
to authenticated
using (public.can_manage_growth_audits());

create policy growth_audit_applications_update_staff
on public.growth_audit_applications
for update
to authenticated
using (public.can_manage_growth_audits())
with check (public.can_manage_growth_audits());

create policy growth_audit_events_select_staff
on public.growth_audit_events
for select
to authenticated
using (public.can_manage_growth_audits());
