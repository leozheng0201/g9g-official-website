import Link from 'next/link'
import { CaseCard, InfoCard, ProcessStep, ServiceCard } from '@/components/public/content-cards'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { FounderPanel } from '@/components/public/founder-panel'
import { HeroStrategyBoard } from '@/components/public/hero-strategy-board'
import { JsonLd } from '@/components/public/json-ld'
import { OfficialTrustSection } from '@/components/public/line-gift/official-trust-section'
import { PageHero } from '@/components/public/page-hero'
import { SectionHeading } from '@/components/public/section-heading'
import { featuredCases } from '@/content/cases'
import { contentEntries, giftScenes, growthPillars, growthServices, painPoints, processSteps } from '@/content/home'
import { parseLineGiftOfficialFields } from '@/content/line-gift-official'
import { siteConfig } from '@/content/site'
import { getPublishedContentBySlug } from '@/lib/cms/public-reader'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/seo/schema'

const baseMetadata = createPageMetadata({
  title: 'G9G｜LINE 禮物品牌成長平台',
  description: siteConfig.heroDescription,
  path: publicRoutes.home,
})

export const metadata = {
  ...baseMetadata,
  title: { absolute: 'G9G｜LINE 禮物品牌成長平台' },
}

const sectionClass = 'py-16 sm:py-20'

export default async function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const officialContent = await getPublishedContentBySlug({
    contentType: 'article',
    articleSubtype: 'line_gift_academy',
    slug: 'about-line-gift',
  })
  const officialFields = officialContent
    ? parseLineGiftOfficialFields(officialContent.typeFields)
    : null
  const officialTrust = officialFields
    ? { sourceTitle: officialFields.sourceTitle, stats: officialFields.featuredStats }
    : null

  return (
    <>
      <JsonLd data={buildOrganizationSchema(siteUrl)} />
      <JsonLd data={buildWebSiteSchema(siteUrl)} />
      <PageHero
        eyebrow={siteConfig.serviceLine}
        title={siteConfig.heroTitle}
        description={siteConfig.heroDescription}
        primaryAction={{ label: siteConfig.primaryCta, href: publicRoutes.growthAudit }}
        secondaryAction={{ label: '了解 G9G 的成長方法', href: '#growth-method' }}
      >
        <HeroStrategyBoard />
      </PageHero>

      <section className={sectionClass} id="brand-challenges">
        <Container>
          <SectionHeading eyebrow="品牌常見處境" title="問題通常不只在上架，而在品牌還沒被放進送禮決策。" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {painPoints.map((item) => <InfoCard key={item.title} {...item} />)}
          </div>
        </Container>
      </section>

      {officialTrust ? <OfficialTrustSection {...officialTrust} /> : null}

      <section className={`${sectionClass} bg-surface`} id="growth-method">
        <Container>
          <p className="max-w-5xl text-3xl font-black leading-tight sm:text-4xl">
            在 LINE 禮物，付錢的人跟收到商品的人不是同一個。原本的商品文案，很可能寫給錯的人看了。
          </p>
          <SectionHeading eyebrow="G9G 方法論" title="送禮業績＝商品 × 流量 × 轉換" description="先建立想送的商品，再安排被看見的節奏，最後把送禮理由說清楚。" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {growthPillars.map((item) => <InfoCard key={item.title} {...item} />)}
          </div>
          <Link
            href={publicRoutes.whyG9g}
            className="mt-7 inline-block font-bold underline decoration-brand decoration-4 underline-offset-4"
          >
            了解 G9G 與一般代操的差異
          </Link>
        </Container>
      </section>

      <section className={sectionClass} id="gift-scenes">
        <Container>
          <SectionHeading eyebrow="四大送禮場景" title="不是所有商品都適合所有人，但每份好商品都需要明確的送禮時刻。" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {giftScenes.map((item) => <InfoCard key={item.title} {...item} eyebrow="送禮場景" />)}
          </div>
        </Container>
      </section>

      <section className={`${sectionClass} bg-soft`} id="growth-services">
        <Container>
          <SectionHeading eyebrow="品牌成長路徑" title="從判斷、規劃到落地，三個產品是一條連續路線。" />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {growthServices.map((item) => <ServiceCard key={item.title} {...item} />)}
          </div>
        </Container>
      </section>

      <section className={sectionClass} id="process">
        <Container>
          <SectionHeading eyebrow="合作流程" title="先把資料與判斷做對，再決定是否進入長期合作。" />
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map(([number, title, description]) => <ProcessStep key={number} number={number} title={title} description={description} />)}
          </div>
        </Container>
      </section>

      <section className={`${sectionClass} bg-surface`} id="cases">
        <Container>
          <SectionHeading eyebrow="過往操盤經驗" title="策略不是套版，而是從品牌問題中找出可持續的成長方法。" />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {featuredCases.map((item) => <CaseCard key={item.brand} {...item} />)}
          </div>
          <Link href={publicRoutes.cases} className="mt-7 inline-block font-bold underline decoration-brand decoration-4 underline-offset-4">查看品牌成長案例</Link>
        </Container>
      </section>

      <section className={sectionClass} id="pricing">
        <Container>
          <SectionHeading eyebrow="公開方案" title="合作方式與價格先說清楚，讓品牌知道自己正在評估什麼。" />
          <div className="mt-8 rounded-[2rem] border border-line bg-paper p-7 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-2xl font-black">商城啟動 NT$30,000／成果分潤 35%／全年代營運 NT$30,000 月費</p>
              <p className="mt-2 text-muted">完整計算方式、平台年費與另計項目皆公開於方案頁。</p>
            </div>
            <Link href={publicRoutes.growthOperations} className="mt-5 inline-block font-bold underline decoration-brand decoration-4 underline-offset-4 sm:mt-0">查看完整方案</Link>
          </div>
        </Container>
      </section>

      <section className={`${sectionClass} bg-soft`} id="knowledge">
        <Container>
          <SectionHeading eyebrow="持續累積的品牌資產" title="研究院、觀點與資源，讓網站不只介紹服務，也能持續回答品牌問題。" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {contentEntries.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-card border border-line bg-paper p-6 hover:border-ink">
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-muted">{item.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className={sectionClass} id="founder">
        <Container><FounderPanel /></Container>
      </section>
      <CtaBand />
    </>
  )
}
