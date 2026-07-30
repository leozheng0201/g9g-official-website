import { AdminShell } from '@/components/admin/admin-shell'
import { requireRole } from '@/lib/auth/access'

const FOUNDATION_ADMIN_ROLES = [
  'super_admin',
  'editor',
  'marketing',
  'service',
] as const

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const access = await requireRole(FOUNDATION_ADMIN_ROLES)

  return (
    <AdminShell email={access.email} roles={access.roles}>
      {children}
    </AdminShell>
  )
}
