import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { academyCategories } from '@/content/content-centers'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: 'LINE 禮物研究院', description: '從平台、用戶、送禮場景、商品、價格到營運實戰的知識中心。', path: publicRoutes.academy })

export default function AcademyPage() {
  return (
    <>
      <PageHero eyebrow="LINE GIFT ACADEMY" title="LINE 禮物研究院" description="把 LINE 禮物資訊整理成可索引、可交叉閱讀、可持續擴充的品牌知識中心。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: 'LINE 禮物研究院' }]} />
        <p className="max-w-3xl text-lg text-muted">目前先建立公開分類入口；文章將在內容系統完成並通過來源與年份查核後陸續發布。</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {academyCategories.map((category) => <article key={category} className="rounded-card border border-line bg-surface p-6"><h2 className="text-xl font-black">{category}</h2><p className="mt-3 text-sm text-muted">相關內容準備與查核中。</p></article>)}
        </div>
      </Container>
      <CtaBand title="品牌有具體問題，不必等文章全部上線。" />
    </>
  )
}
