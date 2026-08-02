import Link from 'next/link'

import { listContentItems } from '@/lib/cms/repository'

const cards = [
  { href: '/admin/content/article?subtype=insight', title: '品牌觀點', description: '品牌、電商與行銷實務文章。' },
  { href: '/admin/content/article?subtype=line_gift_academy', title: 'LINE 禮物研究院', description: '官方資料、老莊解讀與 G9G 協助建議。' },
  { href: '/admin/content/case_study', title: '品牌案例', description: '保留成果來源與歸屬說明。' },
  { href: '/admin/content/faq', title: 'FAQ', description: '依分類與排序管理常見問題。' },
  { href: '/admin/content/resource', title: '品牌資源', description: '下載檔案與外部資源連結。' },
] as const

export default async function ContentDashboardPage() {
  const { items } = await listContentItems({ pageSize: 8 })
  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <p className="text-xs font-black tracking-[0.16em] text-brand">CONTENT CMS</p><h1 className="mt-2 text-4xl font-black">內容總覽</h1><p className="mt-3 text-muted">草稿不影響正式前台；只有核准發布後才會建立公開快照。</p>
      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{cards.map((card) => <Link key={card.href} href={card.href} className="rounded-card border border-line bg-white p-6 hover:border-brand"><h2 className="text-xl font-black">{card.title}</h2><p className="mt-2 text-sm text-muted">{card.description}</p></Link>)}</section>
      <section className="mt-12"><div className="flex items-center justify-between"><h2 className="text-2xl font-black">最近更新</h2><Link href="/admin/content/review" className="font-bold text-brand">查看待審</Link></div><div className="mt-4 space-y-2">{items.map((item) => <Link key={item.id} href={`/admin/content/${item.content_type}/${item.id}`} className="flex flex-wrap justify-between gap-3 rounded border border-line bg-white p-4"><span className="font-bold">{item.title}</span><span className="text-sm text-muted">{item.status}</span></Link>)}</div></section>
    </main>
  )
}
