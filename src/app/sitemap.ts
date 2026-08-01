import type { MetadataRoute } from 'next'

import { listPublishedSitemapEntries } from '@/lib/cms/public-reader'
import { indexablePublicRoutes } from '@/lib/routes/public'

const weeklyRoutes = new Set([
  '/line-gift-academy',
  '/cases',
  '/insights',
  '/faq',
  '/resources',
])

const legalRoutes = new Set(['/privacy', '/terms'])

function contentPath(item: Awaited<ReturnType<typeof listPublishedSitemapEntries>>[number]) {
  const configured = item.typeFields.publicPath
  if (typeof configured === 'string' && configured.startsWith('/')) return configured.split('#')[0]
  if (item.contentType === 'case_study') return `/cases/${item.slug}`
  if (item.contentType === 'resource') return `/resources/${item.slug}`
  if (item.contentType === 'article' && item.articleSubtype === 'line_gift_academy') return `/line-gift-academy/${item.slug}`
  if (item.contentType === 'article') return `/insights/${item.slug}`
  return null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const staticEntries: MetadataRoute.Sitemap = indexablePublicRoutes.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date('2026-07-30'),
    changeFrequency: path === '/' || weeklyRoutes.has(path) ? 'weekly' : 'monthly',
    priority:
      path === '/'
        ? 1
        : path.startsWith('/growth-')
          ? 0.9
          : legalRoutes.has(path)
            ? 0.4
            : 0.7,
  }))

  const published = await listPublishedSitemapEntries()
  const dynamicEntries: MetadataRoute.Sitemap = published.flatMap((item) => {
    const path = contentPath(item)
    if (!path || path === '/faq') return []
    return [{
      url: new URL(path, siteUrl).toString(),
      lastModified: new Date(item.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }]
  })

  const unique = new Map([...staticEntries, ...dynamicEntries].map((entry) => [entry.url, entry]))
  return [...unique.values()]
}
