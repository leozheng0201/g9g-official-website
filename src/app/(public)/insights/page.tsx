import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { insightCategories } from '@/content/content-centers'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '品牌觀點', description: 'G9G 對 LINE 禮物、電商、品牌、商品與行銷的實務觀點。', path: publicRoutes.insights })

export default function InsightsPage() {
  return (
    <>
      <PageHero eyebrow="INSIGHTS" title="品牌觀點" description="不追求大量泛用文章，而是整理品牌在商品、通路與成長決策中真正會遇到的問題。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: '品牌觀點' }]} />
        <p className="max-w-3xl text-lg text-muted">目前先建立文章分類入口；未完成的文章不製作假連結。</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {insightCategories.map((category) => <article key={category} className="rounded-card border border-line bg-paper p-6"><h2 className="text-xl font-black">{category}</h2><p className="mt-3 text-sm text-muted">專題內容整理中。</p></article>)}
        </div>
      </Container>
      <CtaBand />
    </>
  )
}
