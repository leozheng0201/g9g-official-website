import 'server-only'

import type { GrowthAuditStatus } from '@/lib/growth-audit/status'

const transitions: Readonly<Record<GrowthAuditStatus, readonly GrowthAuditStatus[]>> = {
  new: ['contacted', 'declined', 'spam'],
  contacted: ['qualified', 'declined', 'spam'],
  qualified: ['questionnaire_sent', 'declined'],
  questionnaire_sent: ['reviewing', 'declined'],
  reviewing: ['completed', 'declined'],
  completed: [],
  declined: [],
  spam: [],
}

export function canTransitionGrowthAuditStatus(
  from: GrowthAuditStatus,
  to: GrowthAuditStatus,
): boolean {
  return transitions[from].includes(to)
}

export function maskGrowthAuditEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '***'
  if (local.length === 1) return `${local}***@${domain}`
  return `${local[0]}***${local.at(-1)}@${domain}`
}

export function maskGrowthAuditPhone(phone: string): string {
  if (phone.length < 8) return '***'
  return `${phone.slice(0, 5)}*****${phone.slice(-3)}`
}

export function normalizeInternalNote(note: string): string {
  const normalized = note.trim()
  if (!normalized) throw new Error('備註不可空白')
  if (normalized.length > 2000) throw new Error('備註不可超過 2000 字')
  return normalized
}

export const growthAuditStatusLabels: Readonly<Record<GrowthAuditStatus, string>> = {
  new: '新申請',
  contacted: '已聯繫',
  qualified: '符合條件',
  questionnaire_sent: '已寄問卷',
  reviewing: '評估中',
  completed: '已完成',
  declined: '不承接',
  spam: '垃圾訊息',
}
