export const APP_ROLES = ['super_admin', 'editor', 'marketing', 'service'] as const

export type AppRole = (typeof APP_ROLES)[number]

export type CurrentAccess = {
  userId: string
  email: string
  roles: AppRole[]
}

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === 'string' && APP_ROLES.includes(value as AppRole)
}

export function hasAnyRole(
  roles: readonly AppRole[],
  allowed: readonly AppRole[],
): boolean {
  return roles.some((role) => allowed.includes(role))
}
