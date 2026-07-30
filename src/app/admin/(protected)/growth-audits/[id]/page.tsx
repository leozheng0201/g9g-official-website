import { notFound } from 'next/navigation'
import { GrowthAuditDetail } from '@/components/admin/growth-audit-detail'
import { requireRole } from '@/lib/auth/access'
import { isGrowthAuditStatus } from '@/lib/growth-audit/status'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const allowedRoles = ['super_admin', 'service'] as const

type Params = Promise<{ id: string }>

export default async function GrowthAuditDetailPage({ params }: { params: Params }) {
  await requireRole(allowedRoles)
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const [{ data: application, error: applicationError }, { data: events, error: eventsError }] = await Promise.all([
    supabase
      .from('growth_audit_applications')
      .select('id, status, contact_name, brand_name, phone, email, brand_url, first_touch, last_touch, internal_note, created_at, updated_at')
      .eq('id', id)
      .single(),
    supabase
      .from('growth_audit_events')
      .select('id, event_type, from_status, to_status, note, created_at')
      .eq('application_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (applicationError || !application || !isGrowthAuditStatus(application.status)) notFound()
  if (eventsError) throw new Error('無法載入操作紀錄')

  return (
    <GrowthAuditDetail
      application={{
        id: application.id,
        status: application.status,
        contactName: application.contact_name,
        brandName: application.brand_name,
        phone: application.phone,
        email: application.email,
        brandUrl: application.brand_url,
        firstTouch: (application.first_touch ?? {}) as Record<string, string>,
        lastTouch: (application.last_touch ?? {}) as Record<string, string>,
        internalNote: application.internal_note,
        createdAt: application.created_at,
        updatedAt: application.updated_at,
      }}
      events={(events ?? []).map((event) => ({
        id: event.id,
        eventType: event.event_type,
        fromStatus: event.from_status,
        toStatus: event.to_status,
        note: event.note,
        createdAt: event.created_at,
      }))}
    />
  )
}
