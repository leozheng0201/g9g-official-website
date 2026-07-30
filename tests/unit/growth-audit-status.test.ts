import { describe, expect, it } from 'vitest'
import { growthAuditStatuses, isGrowthAuditStatus } from '@/lib/growth-audit/status'

describe('growth audit status contract', () => {
  it('contains the approved workflow states in order', () => {
    expect(growthAuditStatuses).toEqual([
      'new',
      'contacted',
      'qualified',
      'questionnaire_sent',
      'reviewing',
      'completed',
      'declined',
      'spam',
    ])
  })

  it('recognizes only approved states', () => {
    expect(isGrowthAuditStatus('new')).toBe(true)
    expect(isGrowthAuditStatus('completed')).toBe(true)
    expect(isGrowthAuditStatus('pending')).toBe(false)
    expect(isGrowthAuditStatus('')).toBe(false)
  })
})
