const DEFAULT_ADMIN_PATH = '/admin'
const SAFE_REDIRECT_ORIGIN = 'https://g9g.invalid'

export function safeNextPath(value: unknown): string {
  if (typeof value !== 'string' || value.includes('\\')) {
    return DEFAULT_ADMIN_PATH
  }

  try {
    const url = new URL(value, SAFE_REDIRECT_ORIGIN)
    const isSameOrigin = url.origin === SAFE_REDIRECT_ORIGIN
    const isAdminPath = url.pathname === '/admin' || url.pathname.startsWith('/admin/')

    if (!isSameOrigin || !isAdminPath) {
      return DEFAULT_ADMIN_PATH
    }

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return DEFAULT_ADMIN_PATH
  }
}
