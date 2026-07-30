import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { FounderPanel } from '@/components/public/founder-panel'
import { PageHero } from '@/components/public/page-hero'
import { SectionHeading } from '@/components/public/section-heading'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({
  title: '關於 G9G',
  description: '認識 G9G、盛澄策略顧問與專注 LINE 禮物品牌成長的原因。',
  path: publicRoutes.about,
})

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="ABOUT G9G" title="關於 G9G" description="G9G 是盛澄策略顧問聚焦 LINE 禮物品牌成長的服務品牌。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs currentPath={publicRoutes.about} items={[{ label: '關於 G9G' }]} />
        <SectionHeading title="讓品牌成長，不只是把商品上架。" description="我們不只協助商品上架，而是從商品、送禮場景、價格帶、檔期、版位與轉換，判斷品牌如何在 LINE 禮物建立可持續的成長方法。" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ['專注 LINE 禮物', '不是泛用型行銷公司，而是聚焦送禮電商的商品、場景與營運。'],
            ['從判斷開始', '先理解品牌、商品與供應條件，再決定合作方式。'],
            ['策略連到執行', '從商品定位、檔期規劃到站內版位，讓策略能真正落地。'],
          ].map(([title, description]) => (
            <article key={title} className="rounded-card border border-line bg-surface p-6">
              <h2 className="text-xl font-black">{title}</h2><p className="mt-3 text-muted">{description}</p>
            </article>
          ))}
        </div>
        <div className="mt-16"><FounderPanel /></div>
        <section className="mt-16 rounded-card border border-line p-7">
          <h2 className="text-2xl font-black">服務邊界</h2>
          <p className="mt-4 text-lg">G9G 不保證商城審核、特定業績或搜尋排名，也不以降價作為唯一成長方法。</p>
        </section>
      </Container>
      <CtaBand />
    </>
  )
}
