const DEFAULT_ADMIN_PATH = '/admin'

export function safeNextPath(value: unknown): string {
  if (typeof value !== 'string') {
    return DEFAULT_ADMIN_PATH
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return DEFAULT_ADMIN_PATH
  }

  return value
}
