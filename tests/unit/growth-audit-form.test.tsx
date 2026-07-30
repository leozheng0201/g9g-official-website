import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuditPreviewForm, type GrowthAuditFormAction } from '@/components/public/audit-preview-form'
import { growthAuditSubmissionSchema } from '@/lib/growth-audit/schema'

const validInput = {
  contactName: '王小明',
  brandName: '測試品牌',
  phone: '0912345678',
  email: 'owner@example.com',
  brandUrl: 'https://example.com',
  privacyAccepted: true,
  website: '',
}

const idleAction: GrowthAuditFormAction = async () => ({ status: 'idle' })

describe('production growth audit form', () => {
  it('accepts the approved first-stage fields', () => {
    expect(growthAuditSubmissionSchema.safeParse(validInput).success).toBe(true)
  })

  it('rejects an invalid phone, insecure URL and filled honeypot', () => {
    expect(growthAuditSubmissionSchema.safeParse({ ...validInput, phone: '123' }).success).toBe(false)
    expect(growthAuditSubmissionSchema.safeParse({ ...validInput, brandUrl: 'http://example.com' }).success).toBe(false)
    expect(growthAuditSubmissionSchema.safeParse({ ...validInput, website: 'spam' }).success).toBe(false)
  })

  it('renders a real submission form without preview-only copy', () => {
    const { container } = render(<AuditPreviewForm action={idleAction} />)

    expect(screen.getByRole('button', { name: '送出品牌成長健檢申請' })).toBeInTheDocument()
    expect(screen.getByLabelText('聯絡人姓名')).toBeRequired()
    expect(screen.getByLabelText('品牌名稱')).toBeRequired()
    expect(screen.getByLabelText('手機')).toBeRequired()
    expect(screen.getByLabelText('Email')).toBeRequired()
    expect(screen.getByLabelText('品牌連結')).toBeRequired()
    expect(screen.getByLabelText(/我已閱讀並同意隱私權政策/)).toBeRequired()
    expect(container.textContent).not.toContain('目前為 Preview')
  })
})
