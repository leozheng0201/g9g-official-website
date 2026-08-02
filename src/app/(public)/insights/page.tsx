import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { ContentCard } from '@/components/public/content/content-card'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { listPublishedContent } from '@/lib/cms/public-reader'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '品牌觀點', description: 'G9G 對 LINE 禮物、電商、品牌、商品與行銷的實務觀點。', path: publicRoutes.insights })

export default async function InsightsPage() {
  const items = await listPublishedContent({ contentType: 'article', articleSubtype: 'insight' })
  return (
    <>
      <PageHero eyebrow="INSIGHTS" title="品牌觀點" description="整理品牌在商品、通路與成長決策中真正會遇到的問題。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: '品牌觀點' }]} />
        {items.length === 0 ? <p className="rounded-card border border-line bg-paper p-6 text-muted">目前尚無已發布文章。</p> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <ContentCard key={item.id} href={`/insights/${item.slug}`} title={item.title} excerpt={item.excerpt} eyebrow="品牌觀點" publishedAt={item.publishedAt} />)}</div>}
      </Container>
      <CtaBand />
    </>
  )
}
