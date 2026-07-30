import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { SectionHeading } from '@/components/public/section-heading'
import { blueprintDeliverables } from '@/content/services'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '品牌成長藍圖', description: '把品牌成長健檢的判斷整理成可執行的商品、場景、檔期與 KPI 路線。', path: publicRoutes.growthBlueprint })

export default function GrowthBlueprintPage() {
  return (
    <>
      <PageHero eyebrow="GROWTH BLUEPRINT" title="品牌成長藍圖" description="健檢之後、正式長期合作之前，把判斷整理成可執行的三階段成長路線。" primaryAction={{ label: '申請品牌成長健檢', href: publicRoutes.growthAudit }} />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: '品牌成長', href: publicRoutes.growthAudit }, { label: '品牌成長藍圖' }]} />
        <SectionHeading title="藍圖不是一份漂亮簡報，而是接下來要先做什麼、後做什麼的共同依據。" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blueprintDeliverables.map((item, index) => <article key={item} className="rounded-card border border-line bg-surface p-6"><span className="text-sm font-bold text-gold">0{index + 1}</span><h2 className="mt-5 text-xl font-black">{item}</h2></article>)}
        </div>
        <section className="mt-16 rounded-[2rem] border border-line bg-paper p-8">
          <h2 className="text-2xl font-black">三階段成長路線</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {['建立主打商品與送禮理由', '建立檔期與站內流量節奏', '以數據優化轉換與全年營運'].map((item, index) => <div key={item} className="rounded-card bg-soft p-5"><strong>階段 {index + 1}</strong><p className="mt-3">{item}</p></div>)}
          </div>
        </section>
      </Container>
      <CtaBand />
    </>
  )
}
