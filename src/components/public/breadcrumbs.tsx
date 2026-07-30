import Link from 'next/link'
import { JsonLd } from '@/components/public/json-ld'
import { publicRoutes } from '@/lib/routes/public'
import { buildBreadcrumbSchema } from '@/lib/seo/schema'

export type BreadcrumbItem = { label: string; href?: string }

const publicPathByLabel: Readonly<Record<string, string>> = {
  '關於 G9G': publicRoutes.about,
  '為什麼選擇 G9G': publicRoutes.whyG9g,
  品牌成長健檢: publicRoutes.growthAudit,
  品牌成長藍圖: publicRoutes.growthBlueprint,
  品牌成長代營運: publicRoutes.growthOperations,
  'LINE 禮物研究院': publicRoutes.academy,
  品牌成長案例: publicRoutes.cases,
  品牌觀點: publicRoutes.insights,
  常見問題: publicRoutes.faq,
  品牌資源中心: publicRoutes.resources,
  聯絡我們: publicRoutes.contact,
  隱私權政策: publicRoutes.privacy,
  網站使用條款: publicRoutes.terms,
}

export function Breadcrumbs({
  items,
  currentPath,
}: {
  items: readonly BreadcrumbItem[]
  currentPath?: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const finalLabel = items.at(-1)?.label ?? ''
  const resolvedCurrentPath = currentPath ?? publicPathByLabel[finalLabel] ?? publicRoutes.home
  const schemaItems = [
    { name: '首頁', path: publicRoutes.home },
    ...items.map((item) => ({
      name: item.label,
      path: item.href ?? resolvedCurrentPath,
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
