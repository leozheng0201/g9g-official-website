import Link from 'next/link'
import { JsonLd } from '@/components/public/json-ld'
import { publicRoutes } from '@/lib/routes/public'
import { buildBreadcrumbSchema } from '@/lib/seo/schema'

export type BreadcrumbItem = { label: string; href?: string }

export function Breadcrumbs({
  items,
  currentPath,
}: {
  items: readonly BreadcrumbItem[]
  currentPath: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const schemaItems = [
    { name: '首頁', path: publicRoutes.home },
    ...items.map((item) => ({
      name: item.label,
      path: item.href ?? currentPath,
    })),
  ]

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(siteUrl, schemaItems)} />
      <nav aria-label="麵包屑" className="mb-7 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={publicRoutes.home} className="hover:text-ink">
              首頁
            </Link>
          </li>
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
