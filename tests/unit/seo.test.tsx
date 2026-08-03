import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const cmsState = vi.hoisted(() => ({ entries: [] as Array<Record<string, unknown>> }))
vi.mock('@/lib/cms/public-reader', () => ({
  listPublishedSitemapEntries: async () => cmsState.entries,
}))

import { metadata as aboutLineGiftMetadata } from '@/app/(public)/about-line-gift/page'
import { metadata as homeMetadata } from '@/app/(public)/page'
import { metadata as previewMetadata } from '@/app/(preview)/preview/content/[token]/page'
import sitemap from '@/app/sitemap'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { createPageMetadata } from '@/lib/seo/metadata'
import { buildOrganizationSchema } from '@/lib/seo/schema'

describe('public SEO helpers', () => {
  beforeEach(() => {
    cmsState.entries = []
  })

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

  it('uses the canonical route for the LINE Gift foundation page', () => {
    expect(aboutLineGiftMetadata.alternates?.canonical).toBe('/about-line-gift')
  })

  it('keeps every private content preview out of search indexes', () => {
    expect(previewMetadata.robots).toMatchObject({ index: false, follow: false })
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

  it('omits the CMS-gated LINE Gift page when no published snapshot exists', async () => {
    const entries = await sitemap()
    expect(entries.some((entry) => entry.url.endsWith('/about-line-gift'))).toBe(false)
  })

  it('adds the LINE Gift page from its published snapshot only', async () => {
    cmsState.entries = [
      {
        id: '30000000-0000-4000-8000-000000000201',
        contentType: 'article',
        articleSubtype: 'line_gift_academy',
        title: '認識 LINE 禮物',
        slug: 'about-line-gift',
        excerpt: '官方資料與營運解讀。',
        blocks: [],
        typeFields: { publicPath: '/about-line-gift' },
        seoTitle: '認識 LINE 禮物',
        seoDescription: '官方資料與營運解讀。',
        canonicalUrl: '/about-line-gift',
        publishedAt: '2026-08-03T00:00:00.000Z',
        snapshot: { status: 'published' },
      },
    ]

    const entries = await sitemap()
    expect(entries.filter((entry) => entry.url.endsWith('/about-line-gift'))).toHaveLength(1)
  })

  it('builds organization schema only from visible company information', () => {
    const schema = buildOrganizationSchema('https://example.com')
    const serialized = JSON.stringify(schema)

    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('盛澄策略顧問')
    expect(serialized).not.toContain('scrutator')
  })
})
