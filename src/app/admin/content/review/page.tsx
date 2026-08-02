import { ContentList } from '@/components/admin/cms/content-list'
import { requireCmsUser } from '@/lib/cms/auth'
import { listContentItems } from '@/lib/cms/repository'

export default async function ContentReviewPage() {
  await requireCmsUser(['super_admin', 'editor'])
  const { items } = await listContentItems({ status: 'in_review', pageSize: 100 })
  return <main className="mx-auto max-w-7xl px-5 py-10"><p className="text-xs font-black tracking-[0.16em] text-brand">REVIEW QUEUE</p><h1 className="mt-2 text-3xl font-black">待審內容</h1><p className="mt-3 text-muted">退回時必須填寫原因；核准後才可排程或發布。</p><div className="mt-8"><ContentList items={items} /></div></main>
}
