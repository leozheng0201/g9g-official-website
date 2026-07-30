import { describe, expect, it } from 'vitest'
import { checkGrowthAuditRateLimit } from '@/lib/growth-audit/rate-limit'

type RecentSubmission = {
  createdAt: Date
  fingerprint: string
  emailHash: string
  duplicateKey: string
}

const now = new Date('2026-07-31T00:00:00+08:00')

function repository(rows: RecentSubmission[]) {
  return {
    findRecent: async () => rows,
  }
}

describe('growth audit rate limiting', () => {
  it('allows a first submission', async () => {
    const result = await checkGrowthAuditRateLimit(
      {
        now,
        fingerprint: 'fp-1',
        emailHash: 'email-1',
        duplicateKey: 'dup-1',
      },
      repository([]),
    )

    expect(result).toEqual({ allowed: true })
  })

  it('rejects a rapid duplicate submission', async () => {
    const result = await checkGrowthAuditRateLimit(
      {
        now,
        fingerprint: 'fp-1',
        emailHash: 'email-1',
        duplicateKey: 'dup-1',
      },
      repository([
        {
          createdAt: new Date(now.getTime() - 60_000),
          fingerprint: 'fp-other',
          emailHash: 'email-other',
          duplicateKey: 'dup-1',
        },
      ]),
    )

    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('duplicate')
  })

  it('limits repeated requests from one fingerprint', async () => {
    const rows = Array.from({ length: 3 }, (_, index) => ({
      createdAt: new Date(now.getTime() - (index + 1) * 5 * 60_000),
      fingerprint: 'fp-1',
      emailHash: `email-${index}`,
      duplicateKey: `dup-${index}`,
    }))

    const result = await checkGrowthAuditRateLimit(
      {
        now,
        fingerprint: 'fp-1',
        emailHash: 'email-new',
        duplicateKey: 'dup-new',
      },
      repository(rows),
    )

    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('fingerprint')
  })

  it('limits repeated requests for one email and expires old rows', async () => {
    const recent = await checkGrowthAuditRateLimit(
      {
        now,
        fingerprint: 'fp-new',
        emailHash: 'email-1',
        duplicateKey: 'dup-new',
      },
      repository([
        {
          createdAt: new Date(now.getTime() - 30 * 60_000),
          fingerprint: 'fp-old',
          emailHash: 'email-1',
          duplicateKey: 'dup-old',
        },
        {
          createdAt: new Date(now.getTime() - 45 * 60_000),
          fingerprint: 'fp-old-2',
          emailHash: 'email-1',
          duplicateKey: 'dup-old-2',
        },
      ]),
    )

    expect(recent.allowed).toBe(false)
    expect(recent.reason).toBe('email')

    const expired = await checkGrowthAuditRateLimit(
      {
        now,
        fingerprint: 'fp-new',
        emailHash: 'email-1',
        duplicateKey: 'dup-new',
      },
      repository([
        {
          createdAt: new Date(now.getTime() - 25 * 60 * 60_000),
          fingerprint: 'fp-new',
          emailHash: 'email-1',
          duplicateKey: 'dup-new',
        },
      ]),
    )

    expect(expired).toEqual({ allowed: true })
  })
})
