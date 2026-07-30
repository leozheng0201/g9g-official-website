import type { MetadataRoute } from 'next'
import { indexablePublicRoutes } from '@/lib/routes/public'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return indexablePublicRoutes.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date('2026-07-30'),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.startsWith('/growth-') ? 0.9 : path === '/privacy' || path === '/terms' ? 0.4 : 0.7,
  }))
}
