import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { JsonLd } from '@/components/public/json-ld'
import { OfficialStats } from '@/components/public/line-gift/official-stats'
import { SceneCard } from '@/components/public/line-gift/scene-card'
import { SourceLabel } from '@/components/public/line-gift/source-label'
import { PageHero } from '@/components/public/page-hero'
import { SectionHeading } from '@/components/public/section-heading'
import { parseLineGiftOfficialFields } from '@/content/line-gift-official'
import { getPublishedContentBySlug } from '@/lib/cms/public-reader'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'
import { buildWebPageSchema } from '@/lib/seo/schema'

export const metadata = createPageMetadata({
  title: '認識 LINE 禮物｜市場、用戶與送禮場景',
  description: '整理 LINE 禮物官方市場資料、用戶輪廓、四大送禮場景與品牌經營重點。',
  path: publicRoutes.aboutLineGift,
})

export default async function AboutLineGiftPage() {
  const content = await getPublishedContentBySlug({
    contentType: 'article',
    articleSubtype: 'line_gift_academy',
    slug: 'about-line-gift',
  })

  if (!content) notFound()
  const officialFields = parseLineGiftOfficialFields(content.typeFields)
  if (!officialFields) notFound()

  const {
    stats,
    scenes,
    sceneInterpretations,
    growthFormula,
    growthInterpretations,
    platformDirections: directions,
    platformDirectionInterpretations: directionInterpretations,
    disclaimer,
  } = officialFields
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return (
    <>
      <JsonLd
        data={buildWebPageSchema(siteUrl, {
          name: content.title,
          description: content.excerpt ?? '',
          path: publicRoutes.aboutLineGift,
          datePublished: content.publishedAt,
        })}
      />
      <PageHero
        eyebrow="LINE 禮物官方資料 × 老莊營運解讀"
        title={content.title}
        description={content.excerpt ?? ''}
        primaryAction={{ label: '申請品牌成長健檢', href: publicRoutes.growthAudit }}
        secondaryAction={{ label: '進入 LINE 禮物研究院', href: publicRoutes.academy }}
      />

      <Container className="py-16 sm:py-20">
        <Breadcrumbs currentPath={publicRoutes.aboutLineGift} items={[{ label: '認識 LINE 禮物' }]} />

        <section className="mt-10 rounded-[2rem] border border-line bg-soft p-7 sm:p-10">
          <SourceLabel kind="interpretation" />
          <h2 className="mt-4 text-3xl font-black">LINE 禮物與一般電商，最大的差異是什麼？</h2>
          <p className="mt-4 max-w-4xl text-lg text-muted">一般電商主要解決「我需要什麼」；送禮電商還需要回答「我想對誰表達什麼」。</p>
        </section>

        <section className="mt-16">
          <SourceLabel kind="official" />
          <SectionHeading eyebrow="市場與用戶輪廓" title="先用官方資料理解這個送禮市場。" />
          <div className="mt-8"><OfficialStats items={stats} /></div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="四大社交送禮場景" title="同一個商品，在不同關係與時刻，需要不同的送禮理由。" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {scenes.map((scene, index) => <SceneCard key={scene} title={scene} interpretation={sceneInterpretations[index] ?? '依送禮對象、時刻與關係重新整理商品表達。'} />)}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-line bg-paper p-7 sm:p-10">
          <SourceLabel kind="official" />
          <h2 className="mt-4 text-3xl font-black">{growthFormula.join(' × ')}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {growthInterpretations.map((item) => (
              <article key={item.title} className="rounded-card bg-soft p-5">
                <SourceLabel kind="interpretation" />
                <h3 className="mt-4 text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="2026 平台方向" title="更好逛、更心動、更好送。" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {directions.map((direction, index) => (
              <article key={direction} className="rounded-card border border-line bg-paper p-6">
                <SourceLabel kind="official" />
                <h3 className="mt-4 text-2xl font-black">{direction}</h3>
                <div className="mt-5 border-t border-line pt-5">
                  <SourceLabel kind="interpretation" />
                  <p className="mt-3 text-muted">{directionInterpretations[index]}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-3">
          <article className="rounded-card border border-line bg-paper p-6"><SourceLabel kind="official" /><p className="mt-4 text-muted">呈現來源支持的市場數據、場景與平台方向。</p></article>
          <article className="rounded-card border border-line bg-paper p-6"><SourceLabel kind="interpretation" /><p className="mt-4 text-muted">將官方資訊轉成商品、包裝、文案、檔期與版位的營運判斷。</p></article>
          <article className="rounded-card border border-line bg-soft p-6"><SourceLabel kind="support" /><p className="mt-4 text-muted">從品牌成長健檢、成長藍圖到代營運，依品牌現況安排下一步。</p><Link className="mt-5 inline-block font-bold underline decoration-brand decoration-4 underline-offset-4" href={publicRoutes.growthAudit}>申請品牌成長健檢</Link></article>
        </section>

        <p className="mt-12 rounded-card border border-line bg-surface p-6 text-sm text-muted">{disclaimer}</p>
      </Container>
      <CtaBand />
    </>
  )
}
