import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContentList } from '@/components/admin/cms/content-list'
import { listContentItems } from '@/lib/cms/repository'
import { contentTypes, type ContentType } from '@/lib/cms/types'

export default async function ContentTypeListPage({ params, searchParams }: { params: Promise<{ type: string }>; searchParams: Promise<{ subtype?: string; status?: string; q?: string; page?: string }> }) {
  const { type } = await params
  if (!contentTypes.includes(type as ContentType)) notFound()
  const query = await searchParams
  const subtype = query.subtype === 'insight' || query.subtype === 'line_gift_academy' ? query.subtype : undefined
  const result = await listContentItems({
    contentType: type as ContentType,
    articleSubtype: subtype,
    status: query.status as never,
    query: query.q,
    page: Number(query.page ?? 1),
  })
  const title = subtype === 'insight' ? '品牌觀點' : subtype === 'line_gift_academy' ? 'LINE 禮物研究院' : type === 'case_study' ? '品牌案例' : type === 'faq' ? 'FAQ' : '品牌資源'
  const newHref = `/admin/content/${type}/new${subtype ? `?subtype=${subtype}` : ''}`
  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black tracking-[0.16em] text-brand">CMS LIST</p><h1 className="mt-2 text-3xl font-black">{title}</h1></div><Link href={newHref} className="rounded-full bg-brand px-5 py-3 font-bold text-white">新增內容</Link></div>
      <form className="mt-8 grid gap-3 rounded-card border border-line bg-paper p-4 sm:grid-cols-[1fr_180px_auto]"><input type="hidden" name="subtype" value={subtype ?? ''} /><input name="q" defaultValue={query.q ?? ''} placeholder="搜尋標題" className="rounded border border-line p-3" /><select name="status" defaultValue={query.status ?? ''} className="rounded border border-line p-3"><option value="">全部狀態</option><option value="draft">草稿</option><option value="in_review">待審</option><option value="approved">已核准</option><option value="scheduled">已排程</option><option value="published">已發布</option><option value="unpublished">已下架</option></select><button className="rounded border px-5 py-3 font-bold">篩選</button></form>
      <div className="mt-6"><ContentList items={result.items} /></div>
    </main>
  )
}
