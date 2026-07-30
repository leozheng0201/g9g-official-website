import { describe, expect, it } from 'vitest'
import { hasAnyRole } from '@/lib/auth/roles'
import { safeNextPath } from '@/lib/auth/redirects'

describe('hasAnyRole', () => {
  it('allows matching roles', () => {
    expect(hasAnyRole(['editor'], ['super_admin', 'editor'])).toBe(true)
  })

  it('denies non-matching roles', () => {
    expect(hasAnyRole(['service'], ['marketing'])).toBe(false)
  })

  it('denies users without roles', () => {
    expect(hasAnyRole([], ['super_admin'])).toBe(false)
  })
})

describe('safeNextPath', () => {
  it('keeps internal admin paths', () => {
    expect(safeNextPath('/admin/content?status=draft')).toBe('/admin/content?status=draft')
  })

  it.each([
    'https://attacker.example',
    '//attacker.example',
    '/\\attacker.example',
    '/contact',
    'admin',
  ])('rejects non-admin or malformed destination %s', (value) => {
    expect(safeNextPath(value)).toBe('/admin')
  })
})
