import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { SectionHeading } from '@/components/public/section-heading'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({
  title: '為什麼選擇 G9G',
  description: '了解一般電商與送禮電商的差異，以及適合與 G9G 合作的品牌條件。',
  path: publicRoutes.whyG9g,
})

const suitable = ['有穩定供貨與基本客服能力', '願意建立主打商品，而不是把所有 SKU 原封不動搬上平台', '願意提供商品素材、庫存與檔期資訊', '願意用至少一個完整檔期驗證策略']
const unsuitable = ['只要求代辦上架，不願調整商品與頁面', '供貨、效期、物流或客服尚未穩定', '要求保證審核、保證業績或短期暴量', '只接受削價，卻不願建立送禮理由']

export default function WhyG9GPage() {
  return (
    <>
      <PageHero eyebrow="WHY G9G" title="為什麼選擇 G9G" description="送禮電商不是一般購物流程的複製，而是一套同時處理關係、時機與收禮體驗的決策系統。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs currentPath={publicRoutes.whyG9g} items={[{ label: '為什麼選擇 G9G' }]} />
        <SectionHeading title="一般電商與送禮電商，面對的是不同的購買理由。" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-card border border-line bg-surface p-7">
            <h2 className="text-2xl font-black">一般電商</h2>
            <p className="mt-4 text-muted">購買者多半也是使用者，重點是需求、功能、價格與購買效率。</p>
          </article>
          <article className="rounded-card border border-brand-dark bg-paper p-7 shadow-brand">
            <h2 className="text-2xl font-black">送禮電商</h2>
            <p className="mt-4 text-muted">付錢者與收禮者可能不同，必須同時處理關係、時機、體面、祝福與收禮體驗。</p>
          </article>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <section><h2 className="text-2xl font-black">適合合作的品牌</h2><ul className="mt-5 grid gap-3">{suitable.map((item) => <li key={item} className="rounded-control bg-soft p-4">✓ {item}</li>)}</ul></section>
          <section><h2 className="text-2xl font-black">目前不適合合作的情況</h2><ul className="mt-5 grid gap-3">{unsuitable.map((item) => <li key={item} className="rounded-control border border-line p-4">— {item}</li>)}</ul></section>
        </div>
      </Container>
      <CtaBand />
    </>
  )
}
