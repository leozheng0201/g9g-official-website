import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuditPreviewForm } from '@/components/public/audit-preview-form'
import { growthAuditPreviewSchema } from '@/lib/validation/growth-audit-preview'

describe('growth audit preview', () => {
  it('accepts the approved first-stage fields', () => {
    const result = growthAuditPreviewSchema.safeParse({
      contactName: '王小明',
      brandName: '測試品牌',
      phone: '0912345678',
      email: 'owner@example.com',
      brandUrl: 'https://example.com',
      privacyAccepted: true,
      website: '',
    })

    expect(result.success).toBe(true)
  })

  it('rejects an invalid phone and a filled honeypot', () => {
    const result = growthAuditPreviewSchema.safeParse({
      contactName: '王小明',
      brandName: '測試品牌',
      phone: '123',
      email: 'owner@example.com',
      brandUrl: 'https://example.com',
      privacyAccepted: true,
      website: 'spam',
    })

    expect(result.success).toBe(false)
  })

  it('shows an explicit preview notice instead of fake submission success', () => {
    render(<AuditPreviewForm />)

    fireEvent.change(screen.getByLabelText('聯絡人姓名'), { target: { value: '王小明' } })
    fireEvent.change(screen.getByLabelText('品牌名稱'), { target: { value: '測試品牌' } })
    fireEvent.change(screen.getByLabelText('手機'), { target: { value: '0912345678' } })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'owner@example.com' },
    })
    fireEvent.change(screen.getByLabelText('品牌連結'), {
      target: { value: 'https://example.com' },
    })
    fireEvent.click(screen.getByLabelText(/我已閱讀並同意隱私權政策/))
    fireEvent.click(screen.getByRole('button', { name: '檢查申請資料' }))

    expect(
      screen.getByText(
        '目前為 Preview，申請資料尚未送出或儲存。正式送出功能將在品牌成長健檢系統完成後啟用。',
      ),
    ).toBeInTheDocument()
  })
})
