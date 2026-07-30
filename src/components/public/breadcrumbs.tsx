import Link from 'next/link'
import { publicRoutes } from '@/lib/routes/public'

export type BreadcrumbItem = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="麵包屑" className="mb-7 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href={publicRoutes.home} className="hover:text-ink">首頁</Link></li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
