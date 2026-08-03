import type { OfficialStat } from '@/lib/cms/types'

export function OfficialStats({ items }: { items: readonly OfficialStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-card border border-line bg-paper p-6">
          <p className="text-3xl font-black">{item.value}</p>
          <p className="mt-2 text-sm font-bold text-muted">{item.label}</p>
        </article>
      ))}
    </div>
  )
}
