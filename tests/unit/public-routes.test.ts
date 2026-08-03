import { describe, expect, it } from 'vitest'
import { indexablePublicRoutes, publicRoutes } from '@/lib/routes/public'

describe('public route registry', () => {
  it('contains every approved public path in navigation order', () => {
    expect(indexablePublicRoutes).toEqual([
      '/',
      '/about',
      '/about-line-gift',
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

  it('contains no placeholder links', () => {
    expect(Object.values(publicRoutes)).not.toContain('#')
  })
})
