import { describe, expect, it } from 'vitest'
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

  it('builds organization schema only from visible company information', () => {
    const schema = buildOrganizationSchema('https://example.com')
    const serialized = JSON.stringify(schema)

    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('盛澄策略顧問')
    expect(serialized).not.toContain('scrutator')
  })
})
