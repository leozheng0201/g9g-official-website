import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const publication = {
  id: '30000000-0000-4000-8000-000000000201',
  contentType: 'article' as const,
  articleSubtype: 'line_gift_academy' as const,
  title: '認識 LINE 禮物：品牌進入送禮市場前，應該先看懂什麼？',
  slug: 'about-line-gift',
  excerpt: '從官方資料理解送禮市場。',
  blocks: [],
  typeFields: {
    sourceTitle: '2026 LINE 禮物資訊分享',
    publicPath: '/about-line-gift',
    featuredStats: [
      { id: 'users', value: '900 萬以上', label: 'LINE 禮物用戶' },
      { id: 'gifts', value: '8,000 萬以上', label: '2021–2025 累積送禮份數' },
      { id: 'age-20-44', value: '超過八成', label: '20–44 歲用戶占比' },
      { id: 'scenes', value: '四大場景', label: '儀式、商務、吉時、情緒' },
    ],
    stats: [
      { id: 'users', value: '900 萬以上', label: 'LINE 禮物用戶' },
      { id: 'gifts', value: '8,000 萬以上', label: '2021–2025 累積送禮份數' },
      { id: 'age-20-44', value: '超過八成', label: '20–44 歲用戶占比' },
      { id: 'under-34', value: '超過 55%', label: '34 歲以下族群' },
      { id: 'gender', value: '女性約 60%／男性約 40%', label: '用戶性別比例' },
    ],
    scenes: ['儀式禮物', '商務禮物', '吉時禮物', '情緒禮物'],
    sceneInterpretations: [
      'CMS 儀式場景解讀。',
      'CMS 商務場景解讀。',
      'CMS 吉時場景解讀。',
      'CMS 情緒場景解讀。',
    ],
    growthFormula: ['商品', '流量', '轉換'],
    growthInterpretations: [
      { title: '商品', text: 'CMS 商品解讀。' },
      { title: '流量', text: 'CMS 流量解讀。' },
      { title: '轉換', text: 'CMS 轉換解讀。' },
    ],
    platformDirections: ['更好逛', '更心動', '更好送'],
    platformDirectionInterpretations: [
      'CMS 更好逛解讀。',
      'CMS 更心動解讀。',
      'CMS 更好送解讀。',
    ],
    disclaimer:
      '資料來源：《2026 LINE 禮物資訊分享》。G9G／盛澄策略顧問非 LINE 官方或官方代理商；本頁將官方資料、營運解讀與 G9G 服務分開呈現。',
  },
  seoTitle: '認識 LINE 禮物｜市場、用戶與送禮場景',
  seoDescription: '官方資料與營運解讀。',
  canonicalUrl: '/about-line-gift',
  publishedAt: '2026-08-03T00:00:00.000Z',
  snapshot: { status: 'published' },
}

vi.mock('@/lib/cms/public-reader', () => ({
  getPublishedContentBySlug: async () => publication,
}))

import AboutLineGiftPage from '@/app/(public)/about-line-gift/page'

describe('AboutLineGiftPage', () => {
  it('renders only the active publication and the three source layers', async () => {
    const { container } = render(await AboutLineGiftPage())
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('認識 LINE 禮物')
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(screen.getAllByText('LINE 禮物官方資料').length).toBeGreaterThan(0)
    expect(screen.getAllByText('老莊營運解讀').length).toBeGreaterThan(0)
    expect(screen.getByText('G9G 可以怎麼協助')).toBeInTheDocument()
    expect(screen.getByText(/非 LINE 官方或官方代理商/)).toBeInTheDocument()
    expect(screen.getByText('CMS 儀式場景解讀。')).toBeInTheDocument()
    expect(screen.getByText('CMS 商品解讀。')).toBeInTheDocument()
    expect(screen.getByText('CMS 更好逛解讀。')).toBeInTheDocument()
  })

  it('emits the correct BreadcrumbList and WebPage structured data', async () => {
    const { container } = render(await AboutLineGiftPage())
    const schemas = [...container.querySelectorAll('script[type="application/ld+json"]')].map((script) =>
      JSON.parse(script.textContent ?? '{}') as Record<string, unknown>,
    )
    const breadcrumb = schemas.find((schema) => schema['@type'] === 'BreadcrumbList') as {
      itemListElement: Array<{ item: string }>
    }
    const webPage = schemas.find((schema) => schema['@type'] === 'WebPage')

    expect(breadcrumb.itemListElement.at(-1)?.item).toBe('http://localhost:3000/about-line-gift')
    expect(webPage).toMatchObject({
      name: publication.title,
      url: 'http://localhost:3000/about-line-gift',
      inLanguage: 'zh-TW',
    })
  })
})
