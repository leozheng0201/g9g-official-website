import { describe, expect, it } from 'vitest'
import { parsePublicEnv, parseServerEnv } from '@/lib/env/schema'

const valid = {
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
}

describe('environment parsing', () => {
  it('accepts valid public values', () => {
    expect(parsePublicEnv(valid)).toEqual(valid)
  })

  it('rejects invalid URLs', () => {
    expect(() => parsePublicEnv({ ...valid, NEXT_PUBLIC_SITE_URL: 'g9g' })).toThrow()
  })

  it('requires the service role key for server access', () => {
    expect(() => parseServerEnv(valid)).toThrow('SUPABASE_SERVICE_ROLE_KEY')
  })
})
