function assertNonNegative(completedAmount: number) {
  if (!Number.isFinite(completedAmount) || completedAmount < 0) {
    throw new Error('completedAmount must be non-negative')
  }
}

export function calculateRevenueShareFee(completedAmount: number): number {
  assertNonNegative(completedAmount)
  return Math.round(completedAmount * 0.35)
}

export function calculateAnnualOperationsMonthlyFee(completedAmount: number): number {
  assertNonNegative(completedAmount)
  const variableBase = Math.max(0, completedAmount - 300_000)
  return 30_000 + Math.round(variableBase * 0.035)
}
