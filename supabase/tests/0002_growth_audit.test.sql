begin;

create extension if not exists pgtap with schema extensions;
select plan(12);

select ok(to_regclass('public.growth_audit_applications') is not null, 'growth audit applications exists');
select ok(to_regclass('public.growth_audit_events') is not null, 'growth audit events exists');
select ok(
  coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.growth_audit_applications')), false),
  'applications RLS enabled'
);
select ok(
  coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.growth_audit_events')), false),
  'events RLS enabled'
);
select is(
  has_table_privilege('anon', 'public.growth_audit_applications', 'SELECT'),
  false,
  'anonymous users cannot select applications'
);
select is(
  has_table_privilege('anon', 'public.growth_audit_events', 'SELECT'),
  false,
  'anonymous users cannot select events'
);
select is(
  has_table_privilege('authenticated', 'public.growth_audit_applications', 'INSERT'),
  false,
  'authenticated browser users cannot insert applications directly'
);
select is(
  has_table_privilege('authenticated', 'public.growth_audit_events', 'INSERT'),
  false,
  'authenticated browser users cannot insert events directly'
);
select ok(to_regprocedure('public.can_manage_growth_audits()') is not null, 'staff access helper exists');
select col_is_pk('public', 'growth_audit_applications', 'id', 'applications id is primary key');
select col_is_pk('public', 'growth_audit_events', 'id', 'events id is primary key');
select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'growth_audit_applications'
      and indexname = 'growth_audit_applications_status_created_idx'
  ),
  'status and created time index exists'
);

select * from finish();
rollback;
