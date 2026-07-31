'use client'

import { ContentRenderer } from '@/components/public/content/content-renderer'
import type { ContentBlock } from '@/lib/cms/types'

export function LivePreview({ title, excerpt, blocks }: { title: string; excerpt: string; blocks: ContentBlock[] }) {
  return (
    <aside aria-label="即時預覽" className="rounded-card border border-line bg-white p-6">
      <p className="text-xs font-black tracking-[0.16em] text-brand">即時預覽</p>
      <h1 className="mt-3 text-3xl font-black">{title || '尚未填寫標題'}</h1>
      {excerpt ? <p className="mt-3 text-muted">{excerpt}</p> : null}
      <div className="mt-8"><ContentRenderer blocks={blocks} /></div>
    </aside>
  )
}
