import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/cms/public-reader', () => ({
  listPublishedSitemapEntries: async () => [],
}))

import { metadata as homeMetadata } from '@/app/(public)/page'
import sitemap from '@/app/sitemap'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { createPageMetadata } from '@/lib/seo/metadata'
import { buildOrganizationSchema } from '@/lib/seo/schema'

describe('public SEO helpers', () => {
  it('creates page-specific metadata with a canonical path', () => {
    const metadata = createPageMetadata({
      title: '品牌成長代營運',
      description: '公開方案與服務內容。',
      path: '/growth-operations',
    })

    expect(metadata.title).toBe('品牌成長代營運')
    expect(metadata.alternates?.canonical).toBe('/growth-operations')
    expect(metadata.openGraph?.title).toBe('品牌成長代營運｜G9G')
  })

  it('keeps the homepage title absolute instead of applying the G9G suffix twice', () => {
    expect(homeMetadata.title).toEqual({ absolute: 'G9G｜LINE 禮物品牌成長平台' })
  })

  it('renders BreadcrumbList JSON-LD with the current page URL', () => {
    const { container } = render(
      <Breadcrumbs currentPath="/about" items={[{ label: '關於 G9G' }]} />,
    )
    const script = container.querySelector('script[type="application/ld+json"]')

    expect(script?.textContent).toContain('BreadcrumbList')
    expect(script?.textContent).toContain('/about')
  })

  it('marks content centers as weekly in the sitemap', async () => {
    const entries = await sitemap()
    const academy = entries.find((entry) => entry.url.endsWith('/line-gift-academy'))
    expect(academy?.changeFrequency).toBe('weekly')
  })

  it('builds organization schema only from visible company information', () => {
    const schema = buildOrganizationSchema('https://example.com')
    const serialized = JSON.stringify(schema)

    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('盛澄策略顧問')
    expect(serialized).not.toContain('scrutator')
  })
})