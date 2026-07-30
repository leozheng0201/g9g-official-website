import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { PricingCard } from '@/components/public/content-cards'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { SectionHeading } from '@/components/public/section-heading'
import { operationsCommonNotes, operationsPlans } from '@/content/services'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '品牌成長代營運', description: '公開 G9G 商城啟動、成果分潤與全年代營運方案及計算方式。', path: publicRoutes.growthOperations })

export default function GrowthOperationsPage() {
  return (
    <>
      <PageHero eyebrow="GROWTH OPERATIONS" title="品牌成長代營運" description="把商品、檔期、站內版位、客服與數據優化落地，建立可持續的 LINE 禮物營運節奏。" primaryAction={{ label: '申請品牌成長健檢', href: publicRoutes.growthAudit }} />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: '品牌成長', href: publicRoutes.growthAudit }, { label: '品牌成長代營運' }]} />
        <SectionHeading title="三種合作方式，完整公開價格與計算基礎。" description="品牌可以先理解成本結構，再決定適合哪一種合作深度。" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {operationsPlans.map((plan) => <PricingCard key={plan.name} {...plan} />)}
        </div>
        <section className="mt-16 rounded-[2rem] border border-line bg-surface p-7 sm:p-9">
          <h2 className="text-2xl font-black">計算範例</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div className="rounded-card bg-paper p-6"><h3 className="font-black">成果分潤</h3><p className="mt-3">完成訂單成交額 NT$200,000 × 35% ＝服務與平台費 NT$70,000。</p></div>
            <div className="rounded-card bg-paper p-6"><h3 className="font-black">全年代營運</h3><p className="mt-3">完成訂單成交額 NT$500,000：月費 NT$30,000＋超過門檻的 NT$200,000 × 3.5% ＝NT$37,000。</p></div>
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-black">共通說明</h2>
          <ul className="mt-5 grid gap-3">
            {operationsCommonNotes.map((note) => <li key={note} className="rounded-control border border-line p-4">{note}</li>)}
          </ul>
        </section>
      </Container>
      <CtaBand title="先確認品牌適配性，再選擇合作方案。" />
    </>
  )
}
