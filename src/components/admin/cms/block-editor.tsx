'use client'

import type { ContentBlock } from '@/lib/cms/types'

export type BlockEditorProps = {
  value: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
  readOnly?: boolean
}

const newParagraph = (): ContentBlock => ({ id: crypto.randomUUID(), type: 'paragraph', text: '', enabled: true })

export function BlockEditor({ value, onChange, readOnly = false }: BlockEditorProps) {
  const update = (index: number, block: ContentBlock) => onChange(value.map((current, currentIndex) => currentIndex === index ? block : current))
  const move = (index: number, offset: -1 | 1) => {
    const target = index + offset
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }
  const duplicate = (index: number) => {
    const next = [...value]
    next.splice(index + 1, 0, { ...value[index], id: crypto.randomUUID() })
    onChange(next)
  }

  return (
    <section aria-label="內容區塊編輯器" className="space-y-4">
      {value.map((block, index) => (
        <article key={block.id} className="rounded-card border border-line bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-auto text-xs font-black uppercase tracking-wider text-muted">{block.type}</span>
            <button type="button" onClick={() => move(index, -1)} disabled={readOnly || index === 0} className="rounded border px-2 py-1 disabled:opacity-40">上移</button>
            <button type="button" onClick={() => move(index, 1)} disabled={readOnly || index === value.length - 1} className="rounded border px-2 py-1 disabled:opacity-40">下移</button>
            <button type="button" onClick={() => duplicate(index)} disabled={readOnly} className="rounded border px-2 py-1 disabled:opacity-40">複製</button>
            <button type="button" onClick={() => update(index, { ...block, enabled: !block.enabled })} disabled={readOnly} className="rounded border px-2 py-1 disabled:opacity-40">{block.enabled ? '停用' : '啟用'}</button>
            <button type="button" onClick={() => onChange(value.filter((_, currentIndex) => currentIndex !== index))} disabled={readOnly} className="rounded border px-2 py-1 text-red-700 disabled:opacity-40">刪除</button>
          </div>
          {'text' in block ? <textarea aria-label={`${block.type} 文字`} value={block.text} onChange={(event) => update(index, { ...block, text: event.target.value })} disabled={readOnly} className="mt-3 min-h-28 w-full rounded border border-line p-3" /> : null}
          {block.type === 'cta' ? <div className="mt-3 grid gap-3 sm:grid-cols-2"><input aria-label="CTA 文字" value={block.label} onChange={(event) => update(index, { ...block, label: event.target.value })} disabled={readOnly} className="rounded border border-line p-3" /><input aria-label="CTA 連結" value={block.href} onChange={(event) => update(index, { ...block, href: event.target.value })} disabled={readOnly} className="rounded border border-line p-3" /></div> : null}
        </article>
      ))}
      <button type="button" onClick={() => onChange([...value, newParagraph()])} disabled={readOnly} className="rounded-full bg-brand px-5 py-2 font-bold text-white disabled:opacity-40">新增文字段落</button>
    </section>
  )
}
