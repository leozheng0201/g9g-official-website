import { notFound } from 'next/navigation'
import { ContentRenderer } from '@/components/public/content/content-renderer'
import { getPublishedContentBySlug } from '@/lib/cms/public-reader'
import type { ContentBlock } from '@/lib/cms/types'

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getPublishedContentBySlug({ contentType: 'case_study', slug })
  if (!item) notFound()
  return <main className="mx-auto max-w-4xl px-5 py-16"><h1 className="text-4xl font-black">{item.title}</h1><p className="mt-5 text-muted">{item.excerpt}</p><div className="mt-10"><ContentRenderer blocks={item.blocks as ContentBlock[]} /></div></main>
}
