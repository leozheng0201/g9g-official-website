import { notFound } from 'next/navigation'

import { saveContentAction } from '@/app/admin/content/actions'
import { ContentEditor } from '@/components/admin/cms/content-editor'
import { contentTypes, type ContentType } from '@/lib/cms/types'

function initialTypeFields(type: ContentType, subtype?: string) {
  if (type === 'article') return { subtype: subtype === 'line_gift_academy' ? 'line_gift_academy' : 'insight', readingMinutes: 5 }
  if (type === 'case_study') return { brandName: '', serviceScope: [], resultAttribution: '' }
  if (type === 'faq') return { question: '', category: '一般問題' }
  return { access: 'ungated' }
}

export default async function NewContentPage({ params, searchParams }: { params: Promise<{ type: string }>; searchParams: Promise<{ subtype?: string }> }) {
  const { type } = await params
  if (!contentTypes.includes(type as ContentType)) notFound()
  const { subtype } = await searchParams
  const contentType = type as ContentType
  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <p className="text-xs font-black tracking-[0.16em] text-brand">NEW CONTENT</p><h1 className="mt-2 text-3xl font-black">新增內容</h1>
      <div className="mt-8"><ContentEditor action={saveContentAction} initial={{ contentType, title: '', slug: '', excerpt: '', seoTitle: '', seoDescription: '', blocks: [], typeFields: initialTypeFields(contentType, subtype), status: 'draft' }} /></div>
    </main>
  )
}
