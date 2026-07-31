import Link from 'next/link'
import type { ReactNode } from 'react'

import { requireCmsUser } from '@/lib/cms/auth'

const links = [
  ['/admin/content', '內容總覽'],
  ['/admin/content/article?subtype=insight', '品牌觀點'],
  ['/admin/content/article?subtype=line_gift_academy', 'LINE 禮物研究院'],
  ['/admin/content/case_study', '品牌案例'],
  ['/admin/content/faq', 'FAQ'],
  ['/admin/content/resource', '品牌資源'],
  ['/admin/media', '媒體庫'],
  ['/admin/content/review', '待審內容'],
  ['/admin/content/trash', '垃圾桶'],
] as const

export default async function ContentAdminLayout({ children }: { children: ReactNode }) {
  const { role } = await requireCmsUser()
  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <header className="border-b border-line bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-4"><Link href="/admin" className="text-xl font-black">G9G 後台</Link><span className="text-xs font-bold text-muted">角色：{role}</span><nav className="flex flex-wrap gap-3 text-sm">{links.map(([href, label]) => <Link key={href} href={href} className="font-bold hover:text-brand">{label}</Link>)}</nav></div></header>
      {children}
    </div>
  )
}
