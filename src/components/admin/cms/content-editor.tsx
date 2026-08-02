'use client'

import { useState } from 'react'

import { BlockEditor } from '@/components/admin/cms/block-editor'
import { LivePreview } from '@/components/admin/cms/live-preview'
import type { ContentBlock, ContentType } from '@/lib/cms/types'

export type ContentEditorInitial = {
  id?: string
  contentType: ContentType
  title: string
  slug: string
  excerpt: string
  seoTitle: string
  seoDescription: string
  blocks: ContentBlock[]
  typeFields: Record<string, unknown>
  version?: number
  status?: string
}

export function ContentEditor({
  initial,
  action,
  readOnly = false,
}: {
  initial: ContentEditorInitial
  action: (formData: FormData) => void | Promise<void>
  readOnly?: boolean
}) {
  const [title, setTitle] = useState(initial.title)
  const [slug, setSlug] = useState(initial.slug)
  const [excerpt, setExcerpt] = useState(initial.excerpt)
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle)
  const [seoDescription, setSeoDescription] = useState(initial.seoDescription)
  const [blocks, setBlocks] = useState<ContentBlock[]>(initial.blocks)
  const [typeFields, setTypeFields] = useState(JSON.stringify(initial.typeFields, null, 2))

  return (
    <form action={action} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
      <div className="space-y-6">
        <input type="hidden" name="id" value={initial.id ?? ''} />
        <input type="hidden" name="contentType" value={initial.contentType} />
        <input type="hidden" name="version" value={initial.version ?? 0} />
        <input type="hidden" name="blocks" value={JSON.stringify(blocks)} />
        <input type="hidden" name="typeFields" value={typeFields} />
        <label className="block font-bold">標題<input name="title" value={title} onChange={(event) => setTitle(event.target.value)} disabled={readOnly} required className="mt-2 w-full rounded border border-line p-3 font-normal" /></label>
        <label className="block font-bold">網址代稱<input name="slug" value={slug} onChange={(event) => setSlug(event.target.value)} disabled={readOnly} required className="mt-2 w-full rounded border border-line p-3 font-normal" /></label>
        <label className="block font-bold">摘要<textarea name="excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} disabled={readOnly} required className="mt-2 min-h-28 w-full rounded border border-line p-3 font-normal" /></label>
        <section><h2 className="mb-3 text-xl font-black">內容區塊</h2><BlockEditor value={blocks} onChange={setBlocks} readOnly={readOnly} /></section>
        <label className="block font-bold">類型專屬欄位（JSON）<textarea value={typeFields} onChange={(event) => setTypeFields(event.target.value)} disabled={readOnly} className="mt-2 min-h-44 w-full rounded border border-line p-3 font-mono text-sm font-normal" /></label>
        <section className="grid gap-4 sm:grid-cols-2"><label className="block font-bold">SEO 標題<input name="seoTitle" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} disabled={readOnly} required className="mt-2 w-full rounded border border-line p-3 font-normal" /></label><label className="block font-bold">SEO 描述<textarea name="seoDescription" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} disabled={readOnly} required className="mt-2 min-h-24 w-full rounded border border-line p-3 font-normal" /></label></section>
        {!readOnly ? <button type="submit" className="rounded-full bg-brand px-6 py-3 font-bold text-white">儲存草稿</button> : null}
      </div>
      <div className="xl:sticky xl:top-6 xl:self-start"><LivePreview title={title} excerpt={excerpt} blocks={blocks} /></div>
    </form>
  )
}
