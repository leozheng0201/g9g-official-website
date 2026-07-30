import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { CaseCard } from '@/components/public/content-cards'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { featuredCases } from '@/content/cases'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '品牌成長案例', description: '查看 G9G 與團隊過往的 LINE 禮物、電商與品牌轉型操盤經驗。', path: publicRoutes.cases })

export default function CasesPage() {
  return (
    <>
      <PageHero eyebrow="GROWTH CASES" title="品牌成長案例" description="用真實問題、判斷與成果說明策略如何落地；未取得授權或資料不完整的專案不製作空白案例。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: '品牌成長案例' }]} />
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredCases.map((item) => <CaseCard key={item.brand} {...item} />)}
        </div>
        <p className="mt-8 rounded-card border border-line bg-surface p-6 text-muted">其他過往經驗包含幸福毛球、田園鮮生與保密專案；完整內容將在取得公開授權與資料後補充。</p>
      </Container>
      <CtaBand />
    </>
  )
}
