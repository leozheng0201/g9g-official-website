const publicAdminPaths = new Set(['/admin/login', '/auth/callback'])

export const isPublicAdminPath = (pathname: string): boolean =>
  publicAdminPaths.has(pathname)
