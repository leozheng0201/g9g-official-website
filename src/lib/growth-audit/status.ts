export const growthAuditStatuses = [
  'new',
  'contacted',
  'qualified',
  'questionnaire_sent',
  'reviewing',
  'completed',
  'declined',
  'spam',
] as const

export type GrowthAuditStatus = (typeof growthAuditStatuses)[number]

export function isGrowthAuditStatus(value: unknown): value is GrowthAuditStatus {
  return typeof value === 'string' && growthAuditStatuses.includes(value as GrowthAuditStatus)
}
