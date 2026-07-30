import { describe, expect, it } from 'vitest'
import { isPublicAdminPath } from '@/lib/routes/admin'

describe('admin routes', () => {
  it.each(['/admin/login', '/auth/callback'])('allows %s without an admin role', (path) => {
    expect(isPublicAdminPath(path)).toBe(true)
  })

  it.each(['/admin', '/admin/content', '/admin/settings'])('protects %s', (path) => {
    expect(isPublicAdminPath(path)).toBe(false)
  })
})
