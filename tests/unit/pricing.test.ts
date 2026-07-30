import { describe, expect, it } from 'vitest'
import {
  calculateAnnualOperationsMonthlyFee,
  calculateRevenueShareFee,
} from '@/lib/pricing/operations'

describe('operations pricing', () => {
  it('calculates the 35 percent completed-order revenue-share fee', () => {
    expect(calculateRevenueShareFee(200_000)).toBe(70_000)
  })

  it('does not charge the variable fee at or below the threshold', () => {
    expect(calculateAnnualOperationsMonthlyFee(300_000)).toBe(30_000)
  })

  it('charges 3.5 percent only above NT$300,000', () => {
    expect(calculateAnnualOperationsMonthlyFee(500_000)).toBe(37_000)
  })

  it('rejects negative or non-finite completed amounts', () => {
    expect(() => calculateRevenueShareFee(-1)).toThrow('completedAmount must be non-negative')
    expect(() => calculateAnnualOperationsMonthlyFee(Number.NaN)).toThrow(
      'completedAmount must be non-negative',
    )
  })
})
