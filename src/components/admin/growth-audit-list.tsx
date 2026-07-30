import Link from 'next/link'
import { growthAuditStatusLabels, maskGrowthAuditEmail, maskGrowthAuditPhone } from '@/lib/growth-audit/admin-service'
import type { GrowthAuditStatus } from '@/lib/growth-audit/status'

export type GrowthAuditQueueItem = {
  id: string
  status: GrowthAuditStatus
  brandName: string
  contactName: string
  email: string
  phone: string
  createdAt: string
}

export function GrowthAuditList({ items }: { items: readonly GrowthAuditQueueItem[] }) {
  if (items.length === 0) {
    return <p className="rounded-card border border-line bg-paper p-6 text-muted">目前沒有符合條件的申請。</p>
  }

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line bg-surface">
          <tr>
            <th className="px-4 py-3">狀態</th>
            <th className="px-4 py-3">品牌／聯絡人</th>
            <th className="px-4 py-3">聯絡資訊</th>
            <th className="px-4 py-3">申請時間</th>
            <th className="px-4 py-3">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-line last:border-0">
              <td className="px-4 py-4 font-bold">{growthAuditStatusLabels[item.status]}</td>
              <td className="px-4 py-4">
                <strong className="block">{item.brandName}</strong>
                <span className="text-muted">{item.contactName}</span>
              </td>
              <td className="px-4 py-4 text-muted">
                <span className="block">{maskGrowthAuditEmail(item.email)}</span>
                <span>{maskGrowthAuditPhone(item.phone)}</span>
              </td>
              <td className="px-4 py-4 text-muted">{new Date(item.createdAt).toLocaleString('zh-TW')}</td>
              <td className="px-4 py-4">
                <Link href={`/admin/growth-audits/${item.id}`} className="font-bold underline">查看詳情</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
