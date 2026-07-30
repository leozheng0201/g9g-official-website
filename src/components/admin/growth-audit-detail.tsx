import { addGrowthAuditInternalNote, updateGrowthAuditStatus } from '@/app/admin/(protected)/growth-audits/actions'
import { growthAuditStatusLabels } from '@/lib/growth-audit/admin-service'
import { growthAuditStatuses, type GrowthAuditStatus } from '@/lib/growth-audit/status'

export type GrowthAuditDetailData = {
  id: string
  status: GrowthAuditStatus
  contactName: string
  brandName: string
  phone: string
  email: string
  brandUrl: string
  firstTouch: Record<string, string>
  lastTouch: Record<string, string>
  internalNote: string | null
  createdAt: string
  updatedAt: string
}

export type GrowthAuditEventData = {
  id: string
  eventType: string
  fromStatus: string | null
  toStatus: string | null
  note: string | null
  createdAt: string
}

export function GrowthAuditDetail({
  application,
  events,
}: {
  application: GrowthAuditDetailData
  events: readonly GrowthAuditEventData[]
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-card border border-line bg-paper p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-muted">品牌成長健檢申請</p>
            <h1 className="mt-2 text-3xl font-black">{application.brandName}</h1>
          </div>
          <strong className="rounded-full bg-surface px-4 py-2">{growthAuditStatusLabels[application.status]}</strong>
        </div>

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          <div><dt className="text-sm font-bold text-muted">聯絡人</dt><dd className="mt-1">{application.contactName}</dd></div>
          <div><dt className="text-sm font-bold text-muted">手機</dt><dd className="mt-1">{application.phone}</dd></div>
          <div><dt className="text-sm font-bold text-muted">Email</dt><dd className="mt-1"><a className="underline" href={`mailto:${application.email}`}>{application.email}</a></dd></div>
          <div><dt className="text-sm font-bold text-muted">品牌連結</dt><dd className="mt-1"><a className="break-all underline" href={application.brandUrl} target="_blank" rel="noreferrer">{application.brandUrl}</a></dd></div>
          <div><dt className="text-sm font-bold text-muted">申請時間</dt><dd className="mt-1">{new Date(application.createdAt).toLocaleString('zh-TW')}</dd></div>
          <div><dt className="text-sm font-bold text-muted">最後更新</dt><dd className="mt-1">{new Date(application.updatedAt).toLocaleString('zh-TW')}</dd></div>
        </dl>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card bg-surface p-4">
            <h2 className="font-black">首次來源</h2>
            <pre className="mt-3 whitespace-pre-wrap break-all text-xs">{JSON.stringify(application.firstTouch, null, 2)}</pre>
          </div>
          <div className="rounded-card bg-surface p-4">
            <h2 className="font-black">最後來源</h2>
            <pre className="mt-3 whitespace-pre-wrap break-all text-xs">{JSON.stringify(application.lastTouch, null, 2)}</pre>
          </div>
        </div>
      </section>

      <div className="grid content-start gap-6">
        <section className="rounded-card border border-line bg-paper p-6">
          <h2 className="text-xl font-black">更新狀態</h2>
          <form action={updateGrowthAuditStatus} className="mt-4 grid gap-4">
            <input type="hidden" name="id" value={application.id} />
            <input type="hidden" name="updatedAt" value={application.updatedAt} />
            <select name="status" defaultValue={application.status} className="min-h-11 rounded-control border border-line px-3">
              {growthAuditStatuses.map((status) => (
                <option key={status} value={status}>{growthAuditStatusLabels[status]}</option>
              ))}
            </select>
            <button className="min-h-11 rounded-control bg-ink px-4 font-bold text-paper" type="submit">儲存狀態</button>
          </form>
        </section>

        <section className="rounded-card border border-line bg-paper p-6">
          <h2 className="text-xl font-black">內部備註</h2>
          {application.internalNote && <p className="mt-3 rounded-card bg-surface p-4">{application.internalNote}</p>}
          <form action={addGrowthAuditInternalNote} className="mt-4 grid gap-4">
            <input type="hidden" name="id" value={application.id} />
            <textarea name="note" required maxLength={2000} rows={5} className="rounded-control border border-line p-3" />
            <button className="min-h-11 rounded-control bg-ink px-4 font-bold text-paper" type="submit">新增備註</button>
          </form>
        </section>
      </div>

      <section className="rounded-card border border-line bg-paper p-6 xl:col-span-2">
        <h2 className="text-xl font-black">操作紀錄</h2>
        <ol className="mt-4 grid gap-3">
          {events.map((event) => (
            <li key={event.id} className="rounded-card bg-surface p-4">
              <strong>{event.eventType}</strong>
              {(event.fromStatus || event.toStatus) && <span className="ml-2 text-sm text-muted">{event.fromStatus ?? '—'} → {event.toStatus ?? '—'}</span>}
              {event.note && <p className="mt-2">{event.note}</p>}
              <time className="mt-2 block text-xs text-muted">{new Date(event.createdAt).toLocaleString('zh-TW')}</time>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
