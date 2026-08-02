import Link from 'next/link'

export type ContentCardProps = {
  href: string
  title: string
  excerpt?: string | null
  eyebrow?: string
  publishedAt?: string
}

export function ContentCard({ href, title, excerpt, eyebrow, publishedAt }: ContentCardProps) {
  return (
    <article className="rounded-card border border-line bg-paper p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {eyebrow ? <p className="text-xs font-black tracking-[0.16em] text-brand">{eyebrow}</p> : null}
      <h2 className="mt-3 text-xl font-black"><Link href={href} className="hover:text-brand">{title}</Link></h2>
      {excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{excerpt}</p> : null}
      {publishedAt ? <time className="mt-5 block text-xs text-muted" dateTime={publishedAt}>{new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', dateStyle: 'medium' }).format(new Date(publishedAt))}</time> : null}
    </article>
  )
}
