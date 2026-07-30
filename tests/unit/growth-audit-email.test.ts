import { describe, expect, it } from 'vitest'
import { sendResendEmail } from '@/lib/email/resend'
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

describe('Resend email gateway', () => {
  it('sends bearer auth, JSON, and the idempotency key', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> = []
    const fetchImpl: typeof fetch = async (input, init) => {
      requests.push({ input, init })
      return new Response(JSON.stringify({ id: 'email_123' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }

    const result = await sendResendEmail(
      {
        from: 'G9G <audit@example.com>',
        to: ['owner@example.com'],
        replyTo: 'g9growth@gmail.com',
        subject: '測試信件',
        html: '<p>內容</p>',
        idempotencyKey: 'growth-audit:test:v1',
      },
      {
        apiKey: 're_test_key',
        fetchImpl,
        timeoutMs: 1000,
      },
    )

    expect(result).toEqual({ id: 'email_123' })
    expect(requests).toHaveLength(1)
    expect(String(requests[0].input)).toBe('https://api.resend.com/emails')
    expect(requests[0].init?.method).toBe('POST')
    expect(requests[0].init?.headers).toMatchObject({
      Authorization: 'Bearer re_test_key',
      'Content-Type': 'application/json',
      'Idempotency-Key': 'growth-audit:test:v1',
    })
    expect(JSON.parse(String(requests[0].init?.body))).toEqual({
      from: 'G9G <audit@example.com>',
      to: ['owner@example.com'],
      reply_to: 'g9growth@gmail.com',
      subject: '測試信件',
      html: '<p>內容</p>',
    })
  })

  it('throws a safe error when Resend rejects the request', async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify({ message: 'invalid sender' }), {
        status: 422,
        headers: { 'content-type': 'application/json' },
      })

    await expect(
      sendResendEmail(
        {
          from: 'G9G <audit@example.com>',
          to: ['owner@example.com'],
          subject: '測試信件',
          html: '<p>內容</p>',
          idempotencyKey: 'growth-audit:test:v1',
        },
        {
          apiKey: 're_test_key',
          fetchImpl,
          timeoutMs: 1000,
        },
      ),
    ).rejects.toThrow('Resend email request failed')
  })
})
