import { describe, expect, it } from 'vitest'

import { createSlug, detectRedirectLoop, normalizeSlug, validateSlugChange } from '@/lib/cms/slugs'

describe('CMS slug rules', () => {
  it('normalizes ASCII titles into readable slugs', () => {
    expect(normalizeSlug('LINE Gift Growth 2026')).toBe('line-gift-growth-2026')
  })

  it('creates deterministic fallback slugs for Traditional Chinese titles', () => {
    expect(createSlug('LINE 禮物四大送禮場景')).toMatch(/^line-/)
    expect(createSlug('LINE 禮物四大送禮場景')).toBe(createSlug('LINE 禮物四大送禮場景'))
  })

  it('rejects protected route namespaces', () => {
    expect(() => validateSlugChange({ namespace: 'insights', nextSlug: 'admin', reservedSlugs: [] })).toThrow()
  })

  it('rejects active or historical slug conflicts', () => {
    expect(() =>
      validateSlugChange({ namespace: 'insights', nextSlug: 'gift-strategy', reservedSlugs: ['gift-strategy'] }),
    ).toThrow()
  })

  it('creates a redirect when a published slug changes', () => {
    expect(
      validateSlugChange({
        namespace: 'insights',
        currentSlug: 'old-slug',
        nextSlug: 'new-slug',
        reservedSlugs: [],
        published: true,
      }),
    ).toEqual({
      slug: 'new-slug',
      redirect: { sourcePath: '/insights/old-slug', destinationPath: '/insights/new-slug' },
    })
  })

  it('rejects self redirects and redirect loops', () => {
    expect(detectRedirectLoop([{ sourcePath: '/a', destinationPath: '/a' }])).toBe(true)
    expect(
      detectRedirectLoop([
        { sourcePath: '/a', destinationPath: '/b' },
        { sourcePath: '/b', destinationPath: '/a' },
      ]),
    ).toBe(true)
  })

  it('accepts an acyclic redirect chain', () => {
    expect(
      detectRedirectLoop([
        { sourcePath: '/a', destinationPath: '/b' },
        { sourcePath: '/b', destinationPath: '/c' },
      ]),
    ).toBe(false)
  })
})
