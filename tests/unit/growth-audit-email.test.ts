import { describe, expect, it } from 'vitest'
import {
  buildGrowthAuditAdminNotification,
  buildGrowthAuditApplicantReceipt,
} from '@/lib/email/templates/growth-audit'

const application = {
  id: '11111111-1111-4111-8111-111111111111',
  contactName: '<王小明>',
  brandName: '測試 & 品牌',
  email: 'owner@example.com',
  phone: '+886912345678',
  brandUrl: 'https://example.com',
  createdAt: new Date('2026-07-31T00:00:00+08:00'),
}

describe('growth audit transactional email templates', () => {
  it('builds an acknowledgement-only applicant receipt', () => {
    const email = buildGrowthAuditApplicantReceipt(application, {
      from: 'G9G <audit@example.com>',
      replyTo: 'g9growth@gmail.com',
    })

    expect(email.to).toEqual(['owner@example.com'])
    expect(email.replyTo).toBe('g9growth@gmail.com')
    expect(email.subject).toContain('已收到品牌成長健檢申請')
    expect(email.html).toContain('&lt;王小明&gt;')
    expect(email.html).toContain('測試 &amp; 品牌')
    expect(email.html).toContain('已收到你的申請')
    expect(email.html).not.toContain('保證')
    expect(email.html).not.toContain('一定會')
    expect(email.html).not.toContain('健檢報告已安排')
    expect(email.idempotencyKey).toBe(
      'growth-audit:11111111-1111-4111-8111-111111111111:applicant-receipt:v1',
    )
  })

  it('builds an internal notification with deterministic idempotency', () => {
    const email = buildGrowthAuditAdminNotification(application, {
      from: 'G9G <audit@example.com>',
      adminEmail: 'ops@example.com',
      replyTo: 'owner@example.com',
    })

    expect(email.to).toEqual(['ops@example.com'])
    expect(email.replyTo).toBe('owner@example.com')
    expect(email.subject).toContain('測試 & 品牌')
    expect(email.html).toContain('+886912345678')
    expect(email.html).toContain('https://example.com')
    expect(email.idempotencyKey).toBe(
      'growth-audit:11111111-1111-4111-8111-111111111111:admin-notification:v1',
    )
  })
})
