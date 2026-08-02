import { notFound } from 'next/navigation'

import { saveContentAction } from '@/app/admin/content/actions'
import { ContentEditor } from '@/components/admin/cms/content-editor'
import { WorkflowPanel } from '@/components/admin/cms/workflow-panel'
import { requireCmsUser } from '@/lib/cms/auth'
import { getContentItem } from '@/lib/cms/repository'
import { parseContentBlocks } from '@/lib/cms/schemas'
import type { ContentType } from '@/lib/cms/types'

export default async function ContentEditPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { role } = await requireCmsUser()
  const { type, id } = await params
  const item = await getContentItem(id)
  if (!item || item.content_type !== type) notFound()
  const readOnly = item.status === 'in_review'
  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-start justify-between gap-6"><div><p className="text-xs font-black tracking-[0.16em] text-brand">EDIT CONTENT</p><h1 className="mt-2 text-3xl font-black">{item.title}</h1>{readOnly ? <p className="mt-2 font-bold text-amber-700">內容正在審核中，已鎖定一般編輯。</p> : null}</div><div className="w-full max-w-sm"><WorkflowPanel id={id} status={item.status} role={role} /></div></div>
      <div className="mt-10"><ContentEditor action={saveContentAction} readOnly={readOnly} initial={{ id, contentType: item.content_type as ContentType, title: item.title, slug: item.slug, excerpt: item.excerpt ?? '', seoTitle: item.seo_title ?? '', seoDescription: item.seo_description ?? '', blocks: parseContentBlocks(item.blocks), typeFields: item.type_fields as Record<string, unknown>, version: item.version, status: item.status }} /></div>
    </main>
  )
}
