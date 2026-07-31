import { permanentlyDeleteContentAction, restoreContentAction } from '@/app/admin/content/actions'
import { requireCmsUser } from '@/lib/cms/auth'
import { listContentItems } from '@/lib/cms/repository'

const typeLabels: Record<string, string> = {
  article: '文章',
  case_study: '品牌案例',
  faq: 'FAQ',
  resource: '品牌資源',
}

export default async function ContentTrashPage() {
  const { role } = await requireCmsUser(['super_admin', 'editor'])
  const { items } = await listContentItems({ status: 'trashed', pageSize: 100 })
  const now = Date.now()

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <p className="text-xs font-black tracking-[0.16em] text-brand">TRASH</p>
      <h1 className="mt-2 text-3xl font-black">垃圾桶</h1>
      <p className="mt-3 text-muted">內容保留 30 天。還原後回到草稿；只有超級管理員可在保留期結束後永久刪除。</p>

      <div className="mt-8 space-y-4">
        {items.length === 0 ? <p className="rounded-card border border-line bg-paper p-6 text-muted">垃圾桶目前沒有內容。</p> : null}
        {items.map((item) => {
          const deletedAt = item.deleted_at ? new Date(item.deleted_at) : null
          const canDelete = role === 'super_admin' && deletedAt !== null && now - deletedAt.getTime() >= 30 * 24 * 60 * 60 * 1000
          return (
            <article key={item.id} className="rounded-card border border-line bg-paper p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black text-brand">{typeLabels[item.content_type] ?? item.content_type}</p>
                  <h2 className="mt-1 text-lg font-black">{item.title}</h2>
                  <p className="mt-2 text-sm text-muted">刪除時間：{deletedAt ? deletedAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) : '未記錄'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={restoreContentAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="rounded-full border border-line px-4 py-2 text-sm font-black" type="submit">還原為草稿</button>
                  </form>
                  {canDelete ? (
                    <form action={permanentlyDeleteContentAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="rounded-full border border-red-300 px-4 py-2 text-sm font-black text-red-700" type="submit">永久刪除</button>
                    </form>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
