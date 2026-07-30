import { describe, expect, it } from 'vitest'
import {
  createGrowthAuditApplication,
  DuplicateGrowthAuditApplicationError,
} from '@/lib/growth-audit/repository'

const applicationInput = {
  contactName: '王小明',
  brandName: '測試品牌',
  phone: '+886912345678',
  email: 'owner@example.com',
  brandUrl: 'https://example.com',
  privacyAcceptedAt: new Date('2026-07-31T00:00:00+08:00'),
  consentVersion: '2026-07-31',
  firstTouch: { utm_source: 'facebook' },
  lastTouch: { utm_source: 'line' },
  emailHash: 'email-hash',
  requestFingerprint: 'fingerprint',
  duplicateKey: 'duplicate-key',
  userAgent: 'ExampleBrowser/1.0',
}

describe('growth audit repository', () => {
  it('stores one normalized application and one submitted event', async () => {
    const inserted: unknown[] = []
    const events: unknown[] = []

    const result = await createGrowthAuditApplication(applicationInput, {
      insertApplication: async (record) => {
        inserted.push(record)
        return {
          id: '11111111-1111-4111-8111-111111111111',
          status: 'new' as const,
          createdAt: new Date('2026-07-31T00:00:01+08:00'),
        }
      },
      appendEvent: async (event) => {
        events.push(event)
      },
    })

    expect(inserted).toHaveLength(1)
    expect(inserted[0]).toMatchObject({
      contactName: '王小明',
      email: 'owner@example.com',
      phone: '+886912345678',
      brandUrl: 'https://example.com',
      status: 'new',
    })
    expect(events).toEqual([
      {
        applicationId: '11111111-1111-4111-8111-111111111111',
        eventType: 'submitted',
        metadata: {},
      },
    ])
    expect(result).toEqual({
      id: '11111111-1111-4111-8111-111111111111',
      status: 'new',
      createdAt: new Date('2026-07-31T00:00:01+08:00'),
    })
    expect(JSON.stringify(result)).not.toContain('email-hash')
    expect(JSON.stringify(result)).not.toContain('fingerprint')
  })

  it('maps duplicate storage conflicts to a public-safe domain error', async () => {
    await expect(
      createGrowthAuditApplication(applicationInput, {
        insertApplication: async () => {
          const error = new Error('duplicate key') as Error & { code: string }
          error.code = '23505'
          throw error
        },
        appendEvent: async () => undefined,
      }),
    ).rejects.toBeInstanceOf(DuplicateGrowthAuditApplicationError)
  })
})
