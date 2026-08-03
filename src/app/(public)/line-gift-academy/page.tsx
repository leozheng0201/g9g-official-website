import Link from 'next/link'

import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { ContentCard } from '@/components/public/content/content-card'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { listPublishedContent } from '@/lib/cms/public-reader'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: 'LINE 禮物研究院', description: '從平台、用戶、送禮場景、商品、價格到營運實戰的知識中心。', path: publicRoutes.academy })

export default async function AcademyPage() {
  const items = await listPublishedContent({ contentType: 'article', articleSubtype: 'line_gift_academy' })
  return (
    <>
      <PageHero eyebrow="LINE GIFT ACADEMY" title="LINE 禮物研究院" description="把 LINE 禮物資訊整理成可索引、可交叉閱讀、可持續擴充的品牌知識中心。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: 'LINE 禮物研究院' }]} />
        <Link
          href={publicRoutes.aboutLineGift}
          className="mt-8 block rounded-[2rem] border border-line bg-soft p-7 transition hover:border-ink sm:p-9"
        >
          <p className="text-sm font-black tracking-[0.16em] text-muted">START HERE</p>
          <h2 className="mt-3 text-3xl font-black">先認識 LINE 禮物</h2>
          <p className="mt-3 max-w-3xl text-muted">從官方市場資料、用戶輪廓、四大送禮場景與平台方向，建立品牌進場前需要的共同基礎。</p>
          <span className="mt-5 inline-block font-bold underline decoration-brand decoration-4 underline-offset-4">閱讀完整基礎介紹</span>
        </Link>
        <div className="mt-10">
          {items.length === 0 ? <p className="rounded-card border border-line bg-paper p-6 text-muted">文章將在內容通過來源與年份查核後發布。</p> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <ContentCard key={item.id} href={`/line-gift-academy/${item.slug}`} title={item.title} excerpt={item.excerpt} eyebrow="LINE 禮物研究院" publishedAt={item.publishedAt} />)}</div>}
        </div>
      </Container>
      <CtaBand title="品牌有具體問題，不必等文章全部上線。" />
    </>
  )
}
