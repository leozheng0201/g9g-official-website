import { describe, expect, it, vi } from 'vitest'
import { processGrowthAuditSubmission } from '@/lib/growth-audit/submit'

const validInput = {
  contactName: ' 王小明 ',
  brandName: ' 測試品牌 ',
  phone: '0912-345-678',
  email: 'OWNER@EXAMPLE.COM',
  brandUrl: 'https://example.com',
  privacyAccepted: true,
  website: '',
}

function dependencies() {
  return {
    now: () => new Date('2026-07-31T00:00:00+08:00'),
    firstTouch: { utm_source: 'google' },
    lastTouch: { landing_page: '/growth-audit' },
    requestFingerprint: 'fingerprint',
    emailHash: vi.fn().mockResolvedValue('email-hash'),
    duplicateKey: vi.fn().mockResolvedValue('duplicate-key'),
    checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
    createApplication: vi.fn().mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      status: 'new' as const,
      createdAt: new Date('2026-07-31T00:00:00+08:00'),
    }),
    appendEvent: vi.fn().mockResolvedValue(undefined),
    sendApplicantReceipt: vi.fn().mockResolvedValue({ id: 'email-1' }),
    sendAdminNotification: vi.fn().mockResolvedValue({ id: 'email-2' }),
  }
}

describe('processGrowthAuditSubmission', () => {
  it('validates, stores, sends both emails and returns success without PII', async () => {
    const deps = dependencies()
    const result = await processGrowthAuditSubmission(validInput, deps)

    expect(result).toEqual({ ok: true, applicationId: '11111111-1111-4111-8111-111111111111' })
    expect(deps.createApplication).toHaveBeenCalledWith(expect.objectContaining({
      contactName: '王小明',
      brandName: '測試品牌',
      phone: '+886912345678',
      email: 'owner@example.com',
    }))
    expect(deps.sendApplicantReceipt).toHaveBeenCalledTimes(1)
    expect(deps.sendAdminNotification).toHaveBeenCalledTimes(1)
  })

  it('returns field errors and does not persist invalid input', async () => {
    const deps = dependencies()
    const result = await processGrowthAuditSubmission({ ...validInput, email: 'bad' }, deps)

    expect(result.ok).toBe(false)
    expect(result).toMatchObject({ kind: 'validation' })
    expect(deps.createApplication).not.toHaveBeenCalled()
  })

  it('silently rejects honeypot submissions before persistence', async () => {
    const deps = dependencies()
    const result = await processGrowthAuditSubmission({ ...validInput, website: 'spam' }, deps)

    expect(result).toEqual({ ok: false, kind: 'spam' })
    expect(deps.createApplication).not.toHaveBeenCalled()
  })

  it('returns a rate-limit result before persistence', async () => {
    const deps = dependencies()
    deps.checkRateLimit.mockResolvedValue({ allowed: false, reason: 'duplicate', retryAfterSeconds: 600 })

    const result = await processGrowthAuditSubmission(validInput, deps)
    expect(result).toEqual({ ok: false, kind: 'rate_limit', retryAfterSeconds: 600 })
    expect(deps.createApplication).not.toHaveBeenCalled()
  })

  it('returns storage failure when persistence fails', async () => {
    const deps = dependencies()
    deps.createApplication.mockRejectedValue(new Error('db down'))

    const result = await processGrowthAuditSubmission(validInput, deps)
    expect(result).toEqual({ ok: false, kind: 'storage' })
  })

  it('keeps the stored application when one email fails and records the failure', async () => {
    const deps = dependencies()
    deps.sendApplicantReceipt.mockRejectedValue(new Error('email down'))

    const result = await processGrowthAuditSubmission(validInput, deps)
    expect(result).toEqual({ ok: true, applicationId: '11111111-1111-4111-8111-111111111111' })
    expect(deps.appendEvent).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'applicant_receipt_failed' }))
    expect(deps.sendAdminNotification).toHaveBeenCalledTimes(1)
  })
})
