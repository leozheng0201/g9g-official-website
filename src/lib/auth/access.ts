import 'server-only'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  hasAnyRole,
  isAppRole,
  type AppRole,
  type CurrentAccess,
} from '@/lib/auth/roles'

type RoleMembership = {
  roles: { key: unknown } | Array<{ key: unknown }> | null
}

function roleKeyFromMembership(membership: RoleMembership): AppRole | null {
  const joinedRole = Array.isArray(membership.roles)
    ? membership.roles[0]
    : membership.roles

  return isAppRole(joinedRole?.key) ? joinedRole.key : null
}

export async function getCurrentAccess(): Promise<CurrentAccess | null> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user?.email) {
    return null
  }

  const { data, error } = await supabase
    .from('profile_roles')
    .select('roles!inner(key)')
    .eq('profile_id', user.id)

  if (error) {
    throw new Error('Unable to load administrator access.')
  }

  const roles = ((data ?? []) as RoleMembership[])
    .map(roleKeyFromMembership)
    .filter((role): role is AppRole => role !== null)

  return {
    userId: user.id,
    email: user.email,
    roles,
  }
}

export async function requireRole(
  allowed: readonly AppRole[],
): Promise<CurrentAccess> {
  const access = await getCurrentAccess()

  if (!access) {
    redirect('/admin/login')
  }

  if (!hasAnyRole(access.roles, allowed)) {
    redirect('/admin/forbidden')
  }

  return access
}
