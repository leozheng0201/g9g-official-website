import type { ContentBlock } from '@/lib/cms/types'

export type ContentRendererProps = {
  blocks: readonly ContentBlock[]
  mediaUrl?: (mediaId: string) => string | null
}

function safeHref(href: string) {
  try {
    const url = new URL(href)
    return url.protocol === 'https:' ? href : '#'
  } catch {
    return href.startsWith('/') && !href.startsWith('//') ? href : '#'
  }
}

export function ContentRenderer({ blocks, mediaUrl = () => null }: ContentRendererProps) {
  return (
    <div className="space-y-8">
      {blocks.filter((block) => block.enabled).map((block) => {
        switch (block.type) {
          case 'heading': {
            const className = block.level === 2 ? 'text-3xl font-black' : block.level === 3 ? 'text-2xl font-bold' : 'text-xl font-bold'
            if (block.level === 2) return <h2 id={block.id} key={block.id} className={className}>{block.text}</h2>
            if (block.level === 3) return <h3 id={block.id} key={block.id} className={className}>{block.text}</h3>
            return <h4 id={block.id} key={block.id} className={className}>{block.text}</h4>
          }
          case 'paragraph':
            return <p key={block.id} className="whitespace-pre-line text-lg leading-8 text-muted">{block.text}</p>
          case 'image': {
            const src = mediaUrl(block.mediaId)
            return src ? <figure key={block.id}><img src={src} alt={block.alt} className="h-auto w-full rounded-card" loading="lazy" />{block.caption ? <figcaption className="mt-2 text-sm text-muted">{block.caption}</figcaption> : null}</figure> : null
          }
          case 'image_text': {
            const src = mediaUrl(block.mediaId)
            return <section key={block.id} className="grid gap-6 md:grid-cols-2">{block.imagePosition === 'left' && src ? <img src={src} alt={block.alt} className="h-auto w-full rounded-card" loading="lazy" /> : null}<p className="whitespace-pre-line text-lg leading-8 text-muted">{block.text}</p>{block.imagePosition === 'right' && src ? <img src={src} alt={block.alt} className="h-auto w-full rounded-card" loading="lazy" /> : null}</section>
          }
          case 'quote':
            return <blockquote key={block.id} className="rounded-card border-l-4 border-brand bg-paper p-6 text-xl font-bold"><p>{block.text}</p>{block.attribution ? <footer className="mt-3 text-sm font-normal text-muted">— {block.attribution}</footer> : null}</blockquote>
          case 'list': {
            const Tag = block.style === 'numbered' ? 'ol' : 'ul'
            return <Tag key={block.id} className={`space-y-2 pl-6 text-lg leading-8 text-muted ${block.style === 'numbered' ? 'list-decimal' : 'list-disc'}`}>{block.items.map((item) => <li key={item}>{item}</li>)}</Tag>
          }
          case 'cta':
            return <p key={block.id}><a href={safeHref(block.href)} className="inline-flex rounded-full bg-brand px-6 py-3 font-bold text-white" rel={block.href.startsWith('https://') ? 'noopener noreferrer' : undefined}>{block.label}</a></p>
          case 'metrics':
            return <section key={block.id} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{block.items.map((item) => <article key={`${item.label}-${item.value}`} className="rounded-card border border-line bg-paper p-6"><p className="text-3xl font-black">{item.value}</p><h3 className="mt-2 font-bold">{item.label}</h3>{item.note ? <p className="mt-2 text-sm text-muted">{item.note}</p> : null}</article>)}</section>
          case 'table':
            return <div key={block.id} className="overflow-x-auto"><table className="w-full border-collapse text-left"><thead><tr>{block.headers.map((header) => <th key={header} scope="col" className="border border-line bg-paper p-3 font-bold">{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border border-line p-3 text-muted">{cell}</td>)}</tr>)}</tbody></table></div>
          case 'video': {
            const embed = block.provider === 'youtube' ? block.url.replace('watch?v=', 'embed/') : block.url.replace('vimeo.com/', 'player.vimeo.com/video/')
            return <div key={block.id} className="aspect-video overflow-hidden rounded-card"><iframe src={embed} title={block.title ?? '影片'} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
          }
          case 'faq_group':
            return <section key={block.id} className="space-y-3">{block.items.map((item) => <details key={item.question} className="rounded-card border border-line bg-paper p-5"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 whitespace-pre-line text-muted">{item.answer}</p></details>)}</section>
          case 'divider':
            return <hr key={block.id} className="border-line" />
        }
      })}
    </div>
  )
}
