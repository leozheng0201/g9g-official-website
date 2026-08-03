import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const cmsState = vi.hoisted(() => ({
  publication: null as Record<string, unknown> | null,
}))

function createPublication(): Record<string, unknown> {
  return {
    id: '30000000-0000-4000-8000-000000000201',
    contentType: 'article',
    articleSubtype: 'line_gift_academy',
    title: '認識 LINE 禮物',
    slug: 'about-line-gift',
    excerpt: '官方資料與營運解讀。',
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
      sceneInterpretations: ['儀式解讀', '商務解讀', '吉時解讀', '情緒解讀'],
      growthFormula: ['商品', '流量', '轉換'],
      growthInterpretations: [
        { title: '商品', text: '商品解讀' },
        { title: '流量', text: '流量解讀' },
        { title: '轉換', text: '轉換解讀' },
      ],
      platformDirections: ['更好逛', '更心動', '更好送'],
      platformDirectionInterpretations: ['逛的解讀', '心動解讀', '送的解讀'],
      disclaimer:
        '資料來源：《2026 LINE 禮物資訊分享》。G9G／盛澄策略顧問非 LINE 官方或官方代理商；本頁將官方資料、營運解讀與 G9G 服務分開呈現。',
    },
    seoTitle: '認識 LINE 禮物',
    seoDescription: '官方資料與營運解讀。',
    canonicalUrl: '/about-line-gift',
    publishedAt: '2026-08-03T00:00:00.000Z',
    snapshot: { status: 'published' },
  }
}

vi.mock('@/lib/cms/public-reader', () => ({
  getPublishedContentBySlug: async () => cmsState.publication,
}))

import HomePage from '@/app/(public)/page'

describe('HomePage', () => {
  beforeEach(() => {
    cmsState.publication = createPublication()
  })

  it('uses the approved hero and primary action', async () => {
    render(await HomePage())

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '讓商品不只上架，而是成為別人想送的理由。',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        '從商品策略、送禮場景到檔期營運，協助品牌在 LINE 禮物找到成長方法。',
      ),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: '申請品牌成長健檢' }).length).toBeGreaterThan(0)
  })

  it('explains the gift-commerce decision model and links to the full comparison', async () => {
    render(await HomePage())

    expect(
      screen.getByText(
        '在 LINE 禮物，付錢的人跟收到商品的人不是同一個。原本的商品文案，很可能寫給錯的人看了。',
      ),
    ).toBeInTheDocument()
    for (const label of ['商品', '流量', '轉換', '情緒', '儀式', '商務', '吉時']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    }
    expect(
      screen.getByRole('link', { name: '了解 G9G 與一般代操的差異' }),
    ).toHaveAttribute('href', '/why-g9g')
  })

  it('renders homepage trust signals from the active CMS publication', async () => {
    render(await HomePage())
    expect(screen.getByText('900 萬以上')).toBeInTheDocument()
    expect(screen.getByText('資料來源：2026 LINE 禮物資訊分享')).toBeInTheDocument()
  })

  it('hides publication-dependent trust signals when the snapshot is unpublished', async () => {
    cmsState.publication = null
    render(await HomePage())
    expect(screen.queryByRole('link', { name: '完整認識 LINE 禮物' })).not.toBeInTheDocument()
  })

  it('does not publish prohibited copy or unsupported platform counts', async () => {
    const { container } = render(await HomePage())
    const text = container.textContent ?? ''

    expect(text).not.toContain('免費健檢')
    expect(text).not.toContain('免費品牌健檢')
    expect(text).not.toContain('900萬')
    expect(text).not.toContain('3,000+')
  })
})
