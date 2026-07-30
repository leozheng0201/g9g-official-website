import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export function InfoCard({ title, description, eyebrow }: { title: string; description: string; eyebrow?: string }) {
  return (
    <article className="h-full rounded-card border border-line bg-paper p-6 shadow-[0_12px_35px_rgba(36,41,37,.06)]">
      {eyebrow && <p className="text-sm font-bold text-gold">{eyebrow}</p>}
      <h3 className="mt-2 text-xl font-black">{title}</h3>
      <p className="mt-3 text-muted">{description}</p>
    </article>
  )
}

export function ServiceCard({
  title,
  description,
  href,
  actionLabel,
  items,
}: {
  title: string
  description: string
  href: string
  actionLabel: string
  items: readonly string[]
}) {
  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-paper p-6">
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="mt-3 text-muted">{description}</p>
      <ul className="mt-5 grid gap-2 text-sm">
        {items.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-brand-dark">●</span>{item}</li>)}
      </ul>
      <Link href={href} className="mt-auto pt-6 font-bold underline decoration-brand decoration-4 underline-offset-4">{actionLabel}</Link>
    </article>
  )
}

export function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <article className="relative border-l-2 border-line pl-6">
      <span className="absolute -left-4 top-0 grid size-8 place-items-center rounded-full bg-ink text-xs font-black text-paper">{number}</span>
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </article>
  )
}

export function CaseCard({
  brand,
  category,
  summary,
  results,
  note,
}: {
  brand: string
  category: string
  summary: string
  results: readonly string[]
  note?: string
}) {
  return (
    <article className="rounded-card border border-line bg-paper p-6">
      <p className="text-sm font-bold text-gold">{category}</p>
      <h3 className="mt-2 text-2xl font-black">{brand}</h3>
      <p className="mt-3 text-muted">{summary}</p>
      <ul className="mt-5 grid gap-3">
        {results.map((result) => <li key={result} className="rounded-control bg-surface p-3 font-bold">{result}</li>)}
      </ul>
      {note && <p className="mt-4 text-xs leading-relaxed text-muted">{note}</p>}
    </article>
  )
}

export function PricingCard({
  name,
  price,
  cadence,
  description,
  features,
  recommended = false,
}: {
  name: string
  price: string
  cadence: string
  description: string
  features: readonly string[]
  recommended?: boolean
}) {
  return (
    <article className={cn('relative flex h-full flex-col rounded-card border bg-paper p-6', recommended ? 'border-brand-dark shadow-brand' : 'border-line')}>
      {recommended && <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-black">推薦方案</span>}
      <h3 className="pr-24 text-xl font-black">{name}</h3>
      <p className="mt-5 text-3xl font-black">{price}</p>
      <p className="text-sm text-muted">{cadence}</p>
      <p className="mt-4 text-muted">{description}</p>
      <ul className="mt-5 grid gap-2 text-sm">
        {features.map((feature) => <li key={feature} className="flex gap-2"><span aria-hidden="true" className="text-brand-dark">✓</span>{feature}</li>)}
      </ul>
    </article>
  )
}
