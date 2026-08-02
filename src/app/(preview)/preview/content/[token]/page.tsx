import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ContentRenderer } from '@/components/public/content/content-renderer'
import { getContentItem } from '@/lib/cms/repository'
import { parseContentBlocks } from '@/lib/cms/schemas'
import { verifyPreviewToken } from '@/lib/cms/preview-tokens'

export const metadata: Metadata = {
  title: '草稿預覽｜G9G',
  robots: { index: false, follow: false, nocache: true },
}

export default async function ContentPreviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const verified = await verifyPreviewToken(token)
  if (!verified) notFound()
  const item = await getContentItem(verified.contentItemId)
  if (!item || item.status === 'trashed') notFound()
  const blocks = parseContentBlocks(item.blocks)

  return (
    <main>
      <div className="sticky top-0 z-50 bg-amber-300 px-4 py-3 text-center text-sm font-black text-black">草稿預覽｜此頁不會被搜尋引擎收錄，連結將於 {verified.expiresAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })} 到期</div>
      <article className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <p className="text-xs font-black tracking-[0.16em] text-brand">DRAFT PREVIEW</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">{item.title}</h1>
        {item.excerpt ? <p className="mt-5 text-xl leading-8 text-muted">{item.excerpt}</p> : null}
        <div className="mt-12"><ContentRenderer blocks={blocks} /></div>
      </article>
    </main>
  )
}
