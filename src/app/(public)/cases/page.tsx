import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { ContentCard } from '@/components/public/content/content-card'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { listPublishedContent } from '@/lib/cms/public-reader'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '品牌成長案例', description: '查看 G9G 與團隊過往的 LINE 禮物、電商與品牌轉型操盤經驗。', path: publicRoutes.cases })

export default async function CasesPage() {
  const items = await listPublishedContent({ contentType: 'case_study' })
  return (
    <>
      <PageHero eyebrow="GROWTH CASES" title="品牌成長案例" description="用真實問題、判斷與成果說明策略如何落地；未取得授權或資料不完整的專案不製作空白案例。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: '品牌成長案例' }]} />
        <div className="grid gap-6 lg:grid-cols-2">
          {items.map((item) => <ContentCard key={item.id} href={`/cases/${item.slug}`} title={item.title} excerpt={item.excerpt} eyebrow="CASE STUDY" publishedAt={item.publishedAt} />)}
        </div>
        {items.length === 0 ? <p className="rounded-card border border-line bg-surface p-6 text-muted">目前沒有已發布案例。</p> : null}
        <p className="mt-8 rounded-card border border-line bg-surface p-6 text-muted">其他過往經驗包含幸福毛球、田園鮮生與保密專案；完整內容將在取得公開授權與資料後補充。</p>
      </Container>
      <CtaBand />
    </>
  )
}
