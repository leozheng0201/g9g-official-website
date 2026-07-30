'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/access'
import { canTransitionGrowthAuditStatus, normalizeInternalNote } from '@/lib/growth-audit/admin-service'
import { isGrowthAuditStatus } from '@/lib/growth-audit/status'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'

const allowedRoles = ['super_admin', 'service'] as const

function requiredString(formData: FormData, key: string): string {
  const value = formData.get(key)
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing ${key}`)
  return value.trim()
}

export async function updateGrowthAuditStatus(formData: FormData) {
  const access = await requireRole(allowedRoles)
  const id = requiredString(formData, 'id')
  const nextStatus = requiredString(formData, 'status')
  const expectedUpdatedAt = requiredString(formData, 'updatedAt')
  if (!isGrowthAuditStatus(nextStatus)) throw new Error('無效的申請狀態')

  const supabase = createAdminSupabaseClient()
  const { data: current, error: readError } = await supabase
    .from('growth_audit_applications')
    .select('status, updated_at')
    .eq('id', id)
    .single()
  if (readError || !current || !isGrowthAuditStatus(current.status)) throw new Error('找不到申請資料')
  if (current.updated_at !== expectedUpdatedAt) throw new Error('資料已被其他人更新，請重新整理')
  if (current.status === nextStatus) return
  if (!canTransitionGrowthAuditStatus(current.status, nextStatus)) throw new Error('不允許的狀態轉換')

  const now = new Date().toISOString()
  const updates: Record<string, string> = { status: nextStatus, updated_at: now }
  if (nextStatus === 'contacted') updates.contacted_at = now
  if (nextStatus === 'completed') updates.completed_at = now

  const { error: updateError } = await supabase
    .from('growth_audit_applications')
    .update(updates)
    .eq('id', id)
    .eq('updated_at', expectedUpdatedAt)
  if (updateError) throw updateError

  const { error: eventError } = await supabase.from('growth_audit_events').insert({
    application_id: id,
    actor_id: access.userId,
    event_type: 'status_changed',
    from_status: current.status,
    to_status: nextStatus,
    metadata: {},
  })
  if (eventError) throw eventError

  revalidatePath('/admin/growth-audits')
  revalidatePath(`/admin/growth-audits/${id}`)
}

export async function addGrowthAuditInternalNote(formData: FormData) {
  const access = await requireRole(allowedRoles)
  const id = requiredString(formData, 'id')
  const note = normalizeInternalNote(requiredString(formData, 'note'))
  const supabase = createAdminSupabaseClient()
  const now = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('growth_audit_applications')
    .update({ internal_note: note, updated_at: now })
    .eq('id', id)
  if (updateError) throw updateError

  const { error: eventError } = await supabase.from('growth_audit_events').insert({
    application_id: id,
    actor_id: access.userId,
    event_type: 'internal_note_added',
    note,
    metadata: {},
  })
  if (eventError) throw eventError

  revalidatePath('/admin/growth-audits')
  revalidatePath(`/admin/growth-audits/${id}`)
}
