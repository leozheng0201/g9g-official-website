import { describe, expect, it } from 'vitest'
import {
  canTransitionGrowthAuditStatus,
  maskGrowthAuditEmail,
  maskGrowthAuditPhone,
  normalizeInternalNote,
} from '@/lib/growth-audit/admin-service'

describe('growth audit admin rules', () => {
  it('masks applicant PII in queue rows', () => {
    expect(maskGrowthAuditEmail('owner@example.com')).toBe('o***r@example.com')
    expect(maskGrowthAuditPhone('+886912345678')).toBe('+8869*****678')
  })

  it('allows only approved forward or terminal status transitions', () => {
    expect(canTransitionGrowthAuditStatus('new', 'contacted')).toBe(true)
    expect(canTransitionGrowthAuditStatus('contacted', 'qualified')).toBe(true)
    expect(canTransitionGrowthAuditStatus('qualified', 'questionnaire_sent')).toBe(true)
    expect(canTransitionGrowthAuditStatus('questionnaire_sent', 'reviewing')).toBe(true)
    expect(canTransitionGrowthAuditStatus('reviewing', 'completed')).toBe(true)
    expect(canTransitionGrowthAuditStatus('new', 'declined')).toBe(true)
    expect(canTransitionGrowthAuditStatus('new', 'spam')).toBe(true)
    expect(canTransitionGrowthAuditStatus('completed', 'new')).toBe(false)
    expect(canTransitionGrowthAuditStatus('reviewing', 'contacted')).toBe(false)
  })

  it('trims valid notes and rejects blank or oversized notes', () => {
    expect(normalizeInternalNote('  已電話聯繫  ')).toBe('已電話聯繫')
    expect(() => normalizeInternalNote('   ')).toThrow('備註不可空白')
    expect(() => normalizeInternalNote('x'.repeat(2001))).toThrow('備註不可超過 2000 字')
  })
})
