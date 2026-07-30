import { describe, expect, it } from 'vitest'
import { parsePublicEnv, parseServerEnv } from '@/lib/env/schema'

const valid = {
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
}

const validServer = {
  ...valid,
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  RESEND_API_KEY: 're_test_key',
  GROWTH_AUDIT_FROM_EMAIL: 'audit@example.com',
  GROWTH_AUDIT_ADMIN_EMAIL: 'ops@example.com',
  GROWTH_AUDIT_FINGERPRINT_SECRET: '0123456789abcdef0123456789abcdef',
}

describe('environment parsing', () => {
  it('accepts valid public values', () => {
    expect(parsePublicEnv(valid)).toEqual(valid)
  })

  it('rejects invalid URLs', () => {
    expect(() => parsePublicEnv({ ...valid, NEXT_PUBLIC_SITE_URL: 'g9g' })).toThrow()
  })

  it('accepts all production growth audit server settings', () => {
    expect(parseServerEnv(validServer)).toEqual(validServer)
  })

  it('requires private persistence, email, and fingerprint settings', () => {
    expect(() => parseServerEnv(valid)).toThrow('SUPABASE_SERVICE_ROLE_KEY')
    expect(() => parseServerEnv({ ...validServer, RESEND_API_KEY: undefined })).toThrow(
      'RESEND_API_KEY',
    )
    expect(() =>
      parseServerEnv({ ...validServer, GROWTH_AUDIT_FINGERPRINT_SECRET: 'short' }),
    ).toThrow('GROWTH_AUDIT_FINGERPRINT_SECRET')
  })
})
