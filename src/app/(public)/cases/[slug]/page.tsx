import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { ContentRenderer } from '@/components/public/content/content-renderer'
import { CtaBand } from '@/components/public/cta-band'
import { getPublishedContentBySlug } from '@/lib/cms/public-reader'
import { parseContentBlocks } from '@/lib/cms/schemas'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = await getPublishedContentBySlug({ contentType: 'case_study', slug })
  if (!item) return {}
  return {
    title: item.seoTitle ?? item.title,
    description: item.seoDescription ?? item.excerpt ?? undefined,
    alternates: { canonical: item.canonicalUrl ?? `/cases/${item.slug}` },
  }
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getPublishedContentBySlug({ contentType: 'case_study', slug })
  if (!item) notFound()
  const blocks = parseContentBlocks(item.blocks)
  const attribution = typeof item.typeFields.resultAttribution === 'string' ? item.typeFields.resultAttribution : null

  return (
    <>
      <Container className="py-14 sm:py-20">
        <Breadcrumbs items={[{ label: '品牌成長案例', href: '/cases' }, { label: item.title }]} />
        <article className="mx-auto max-w-4xl">
          <p className="text-xs font-black tracking-[0.16em] text-brand">GROWTH CASE</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{item.title}</h1>
          {item.excerpt ? <p className="mt-5 text-xl leading-8 text-muted">{item.excerpt}</p> : null}
          <div className="mt-10"><ContentRenderer blocks={blocks} /></div>
          {attribution ? <p className="mt-10 rounded-card border border-line bg-paper p-5 text-sm text-muted">成果歸屬說明：{attribution}</p> : null}
        </article>
      </Container>
      <CtaBand title="想確認你的品牌適不適合進入 LINE 禮物？" />
    </>
  )
}
