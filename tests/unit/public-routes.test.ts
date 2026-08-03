import { describe, expect, it } from 'vitest'
import { indexablePublicRoutes, publicRoutes } from '@/lib/routes/public'

describe('public route registry', () => {
  it('contains every always-indexable public path in navigation order', () => {
    expect(indexablePublicRoutes).toEqual([
      '/',
      '/about',
      '/why-g9g',
      '/growth-audit',
      '/growth-blueprint',
      '/growth-operations',
      '/line-gift-academy',
      '/cases',
      '/insights',
      '/faq',
      '/resources',
      '/contact',
      '/privacy',
      '/terms',
    ])
  })

  it('keeps the CMS-gated LINE Gift page out of the static sitemap registry', () => {
    expect(publicRoutes.aboutLineGift).toBe('/about-line-gift')
    expect(indexablePublicRoutes).not.toContain(publicRoutes.aboutLineGift)
  })

  it('contains no placeholder links', () => {
    expect(Object.values(publicRoutes)).not.toContain('#')
  })
})
