import { GrowthAuditList, type GrowthAuditQueueItem } from '@/components/admin/growth-audit-list'
import { requireRole } from '@/lib/auth/access'
import { growthAuditStatusLabels } from '@/lib/growth-audit/admin-service'
import { growthAuditStatuses, isGrowthAuditStatus } from '@/lib/growth-audit/status'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const allowedRoles = ['super_admin', 'service'] as const

type SearchParams = Promise<{ status?: string }>

export default async function GrowthAuditsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireRole(allowedRoles)
  const { status } = await searchParams
  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from('growth_audit_applications')
    .select('id, status, brand_name, contact_name, email, phone, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (isGrowthAuditStatus(status)) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw new Error('無法載入品牌成長健檢申請')

  const items: GrowthAuditQueueItem[] = (data ?? [])
    .filter((row) => isGrowthAuditStatus(row.status))
    .map((row) => ({
      id: row.id,
      status: row.status,
      brandName: row.brand_name,
      contactName: row.contact_name,
      email: row.email,
      phone: row.phone,
      createdAt: row.created_at,
    }))

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-muted">LEAD MANAGEMENT</p>
          <h1 className="mt-2 text-3xl font-black">品牌成長健檢申請</h1>
          <p className="mt-2 text-muted">列表僅顯示遮罩後的聯絡資訊；完整資料需進入詳情頁查看。</p>
        </div>
        <form className="flex items-end gap-2">
          <label className="grid gap-1 text-sm font-bold">
            狀態
            <select name="status" defaultValue={isGrowthAuditStatus(status) ? status : ''} className="min-h-11 rounded-control border border-line bg-paper px-3">
              <option value="">全部</option>
              {growthAuditStatuses.map((value) => <option key={value} value={value}>{growthAuditStatusLabels[value]}</option>)}
            </select>
          </label>
          <button type="submit" className="min-h-11 rounded-control bg-ink px-4 font-bold text-paper">篩選</button>
        </form>
      </div>
      <GrowthAuditList items={items} />
    </section>
  )
}
