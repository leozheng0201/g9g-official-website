import { describe, expect, it } from 'vitest'
import { createRequestFingerprint } from '@/lib/growth-audit/fingerprint'

describe('growth audit request fingerprint', () => {
  it('is deterministic without exposing raw request identifiers', () => {
    const input = {
      ipAddress: '203.0.113.10',
      userAgent: 'ExampleBrowser/1.0',
      secret: 'test-secret',
    }

    const first = createRequestFingerprint(input)
    const second = createRequestFingerprint(input)

    expect(first).toBe(second)
    expect(first).toMatch(/^[a-f0-9]{64}$/)
    expect(first).not.toContain(input.ipAddress)
    expect(first).not.toContain(input.userAgent)
  })

  it('changes when the IP address, user agent, or secret changes', () => {
    const base = createRequestFingerprint({
      ipAddress: '203.0.113.10',
      userAgent: 'ExampleBrowser/1.0',
      secret: 'test-secret',
    })

    expect(
      createRequestFingerprint({
        ipAddress: '203.0.113.11',
        userAgent: 'ExampleBrowser/1.0',
        secret: 'test-secret',
      }),
    ).not.toBe(base)

    expect(
      createRequestFingerprint({
        ipAddress: '203.0.113.10',
        userAgent: 'OtherBrowser/2.0',
        secret: 'test-secret',
      }),
    ).not.toBe(base)

    expect(
      createRequestFingerprint({
        ipAddress: '203.0.113.10',
        userAgent: 'ExampleBrowser/1.0',
        secret: 'other-secret',
      }),
    ).not.toBe(base)
  })
})
