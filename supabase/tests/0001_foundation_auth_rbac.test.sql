begin;

create extension if not exists pgtap with schema extensions;
select plan(11);

select ok(to_regclass('public.profiles') is not null, 'profiles exists');
select ok(to_regclass('public.roles') is not null, 'roles exists');
select ok(to_regclass('public.profile_roles') is not null, 'profile_roles exists');
select ok(to_regclass('public.audit_events') is not null, 'audit_events exists');
select is((select count(*)::integer from public.roles), 4, 'four roles are seeded');
select results_eq(
  $$select key from public.roles order by key$$,
  $$values ('editor'), ('marketing'), ('service'), ('super_admin')$$,
  'role keys match contract'
);
select ok(
  coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.profiles')), false),
  'profiles RLS enabled'
);
select ok(
  coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.profile_roles')), false),
  'profile_roles RLS enabled'
);
select ok(
  coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.audit_events')), false),
  'audit_events RLS enabled'
);
select ok(to_regprocedure('public.has_role(text)') is not null, 'has_role exists');
select is(
  has_table_privilege('authenticated', 'public.profile_roles', 'INSERT'),
  false,
  'authenticated users cannot grant roles'
);

select * from finish();
rollback;
