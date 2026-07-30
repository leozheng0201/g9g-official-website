import { describe, expect, it } from 'vitest'
import {
  growthAuditSubmissionSchema,
  normalizeGrowthAuditSubmission,
} from '@/lib/growth-audit/schema'
import { parseAttributionCookies } from '@/lib/growth-audit/attribution'

const validInput = {
  contactName: '  王小明  ',
  brandName: '  測試品牌  ',
  phone: '0912-345-678',
  email: ' OWNER@EXAMPLE.COM ',
  brandUrl: 'https://example.com/shop',
  privacyAccepted: true,
  website: '',
}

describe('growth audit submission schema', () => {
  it('normalizes approved first-stage fields', () => {
    const parsed = growthAuditSubmissionSchema.parse(validInput)
    const normalized = normalizeGrowthAuditSubmission(parsed)

    expect(normalized).toEqual({
      contactName: '王小明',
      brandName: '測試品牌',
      phone: '+886912345678',
      email: 'owner@example.com',
      brandUrl: 'https://example.com/shop',
      privacyAccepted: true,
      website: '',
    })
  })

  it('requires consent, an empty honeypot, and an HTTPS brand URL', () => {
    expect(
      growthAuditSubmissionSchema.safeParse({
        ...validInput,
        privacyAccepted: false,
      }).success,
    ).toBe(false)

    expect(
      growthAuditSubmissionSchema.safeParse({
        ...validInput,
        website: 'https://spam.example',
      }).success,
    ).toBe(false)

    expect(
      growthAuditSubmissionSchema.safeParse({
        ...validInput,
        brandUrl: 'http://example.com',
      }).success,
    ).toBe(false)
  })

  it('rejects unknown fields and oversized values', () => {
    expect(
      growthAuditSubmissionSchema.safeParse({
        ...validInput,
        status: 'completed',
      }).success,
    ).toBe(false)

    expect(
      growthAuditSubmissionSchema.safeParse({
        ...validInput,
        brandName: '品'.repeat(121),
      }).success,
    ).toBe(false)
  })
})

describe('growth audit attribution', () => {
  it('keeps only approved bounded attribution keys', () => {
    const result = parseAttributionCookies(
      JSON.stringify({
        utm_source: 'facebook',
        utm_medium: 'paid_social',
        utm_campaign: 'summer',
        referrer: 'https://www.google.com/',
        landing_page: '/growth-audit?utm_source=facebook',
        email: 'private@example.com',
        oversized: 'x'.repeat(1000),
      }),
      JSON.stringify({
        utm_source: 'line',
        utm_medium: 'social',
        landing_page: '/growth-audit',
      }),
    )

    expect(result.firstTouch).toEqual({
      utm_source: 'facebook',
      utm_medium: 'paid_social',
      utm_campaign: 'summer',
      referrer: 'https://www.google.com/',
      landing_page: '/growth-audit?utm_source=facebook',
    })
    expect(result.lastTouch).toEqual({
      utm_source: 'line',
      utm_medium: 'social',
      landing_page: '/growth-audit',
    })
    expect(JSON.stringify(result)).not.toContain('private@example.com')
    expect(JSON.stringify(result)).not.toContain('oversized')
  })

  it('returns empty touches for invalid cookie JSON', () => {
    expect(parseAttributionCookies('{bad', '')).toEqual({
      firstTouch: {},
      lastTouch: {},
    })
  })
})
