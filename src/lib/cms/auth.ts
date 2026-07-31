import 'server-only'

import { redirect } from 'next/navigation'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export type CmsRole = 'super_admin' | 'editor' | 'marketing'

export async function requireCmsUser(allowed: readonly CmsRole[] = ['super_admin', 'editor', 'marketing']) {
  const client = await createServerSupabaseClient()
  const { data: authData } = await client.auth.getUser()
  if (!authData.user) redirect('/login?next=/admin/content')
  const { data: roles, error } = await client
    .from('profile_roles')
    .select('roles!inner(key)')
    .eq('profile_id', authData.user.id)
  if (error) throw error
  const keys = (roles ?? []).map((row) => {
    const role = row.roles as unknown as { key: string } | Array<{ key: string }>
    return Array.isArray(role) ? role[0]?.key : role.key
  }).filter(Boolean) as string[]
  const role = allowed.find((candidate) => keys.includes(candidate))
  if (!role) redirect('/admin?error=forbidden')
  return { user: authData.user, role }
}

export async function requireContentPublisher() {
  return requireCmsUser(['super_admin', 'editor'])
}

export async function requireSuperAdmin() {
  return requireCmsUser(['super_admin'])
}
