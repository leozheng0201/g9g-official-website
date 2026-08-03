import type { ReactElement } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getFeaturedOfficialStats, lineGiftOfficialContent } from '@/content/line-gift-official'

const cmsState = vi.hoisted(() => ({
  articles: [] as Array<Record<string, unknown>>,
}))

vi.mock('@/app/(public)/growth-audit/actions', () => ({
  submitGrowthAudit: async () => ({ status: 'idle' }),
}))

vi.mock('@/lib/cms/public-reader', () => ({
  listPublishedContent: async ({ contentType }: { contentType: string }) =>
    contentType === 'case_study'
      ? [
          {
            id: '30000000-0000-4000-8000-000000000001',
            contentType: 'case_study',
            articleSubtype: null,
            title: '微笑甜果｜LINE 禮物電商案例',
            slug: 'smile-fruit',
            excerpt: '以送禮情境與主打品策略，建立節慶檔期的成長動能。',
            blocks: [],
            typeFields: {},
            seoTitle: null,
            seoDescription: null,
            canonicalUrl: null,
            publishedAt: '2026-07-31T00:00:00.000Z',
            snapshot: { status: 'published' },
          },
        ]
      : contentType === 'article'
        ? cmsState.articles
        : [],
  getPublishedContentBySlug: async () => null,
  listPublishedSitemapEntries: async () => [],
}))

import AboutPage from '@/app/(public)/about/page'
import CasesPage from '@/app/(public)/cases/page'
import ContactPage from '@/app/(public)/contact/page'
import FaqPage from '@/app/(public)/faq/page'
import GrowthAuditPage from '@/app/(public)/growth-audit/page'
import GrowthBlueprintPage from '@/app/(public)/growth-blueprint/page'
import GrowthOperationsPage from '@/app/(public)/growth-operations/page'
import InsightsPage from '@/app/(public)/insights/page'
import AcademyPage from '@/app/(public)/line-gift-academy/page'
import PrivacyPage from '@/app/(public)/privacy/page'
import ResourcesPage from '@/app/(public)/resources/page'
import TermsPage from '@/app/(public)/terms/page'
import WhyG9GPage from '@/app/(public)/why-g9g/page'
import NotFound from '@/app/not-found'

type PublicPage = () => ReactElement | Promise<ReactElement>

const foundationPublication = {
  id: '30000000-0000-4000-8000-000000000201',
  contentType: 'article',
  articleSubtype: 'line_gift_academy',
  title: '認識 LINE 禮物：品牌進入送禮市場前，應該先看懂什麼？',
  slug: 'about-line-gift',
  excerpt: '官方資料與營運解讀。',
  blocks: [],
  typeFields: {
    sourceTitle: lineGiftOfficialContent.sourceTitle,
    publicPath: '/about-line-gift',
    featuredStats: getFeaturedOfficialStats(),
    stats: lineGiftOfficialContent.stats,
    scenes: lineGiftOfficialContent.scenes,
    sceneInterpretations: lineGiftOfficialContent.sceneInterpretations,
    growthFormula: lineGiftOfficialContent.growthFormula,
    growthInterpretations: lineGiftOfficialContent.growthInterpretations,
    platformDirections: lineGiftOfficialContent.platformDirections,
    platformDirectionInterpretations: lineGiftOfficialContent.platformDirectionInterpretations,
    disclaimer: lineGiftOfficialContent.disclaimer,
  },
  seoTitle: '認識 LINE 禮物',
  seoDescription: '官方資料與營運解讀。',
  canonicalUrl: '/about-line-gift',
  publishedAt: '2026-08-03T00:00:00.000Z',
  snapshot: { status: 'published' },
}

const pages: readonly [PublicPage, string][] = [
  [AboutPage, '關於 G9G'],
  [WhyG9GPage, '為什麼選擇 G9G'],
  [GrowthAuditPage, '品牌成長健檢'],
  [GrowthBlueprintPage, '品牌成長藍圖'],
  [GrowthOperationsPage, '品牌成長代營運'],
  [AcademyPage, 'LINE 禮物研究院'],
  [CasesPage, '品牌成長案例'],
  [InsightsPage, '品牌觀點'],
  [FaqPage, '常見問題'],
  [ResourcesPage, '品牌資源中心'],
  [ContactPage, '聯絡我們'],
  [PrivacyPage, '隱私權政策'],
  [TermsPage, '網站使用條款'],
]

async function renderPage(Page: PublicPage) {
  return render(await Page())
}

describe('public pages', () => {
  beforeEach(() => {
    cmsState.articles = [foundationPublication]
  })

  it.each(pages)('renders one approved H1 for %s', async (Page, heading) => {
    const { container } = await renderPage(Page)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    expect(container.querySelectorAll('h1')).toHaveLength(1)
  })

  it('explains the G9G and 盛澄 relationship with a static brand asset', async () => {
    await renderPage(AboutPage)
    expect(
      screen.getByText(/G9G 是盛澄策略顧問聚焦 LINE 禮物品牌成長的服務品牌/),
    ).toBeInTheDocument()
    expect(screen.getByText('莊又丞')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '盛澄策略顧問 Sheng Cheng Strategy Consulting' }),
    ).toHaveAttribute('src', '/brand/sheng-cheng-logo.svg')
  })

  it('publishes all approved operations prices and boundaries', async () => {
    const { container } = await renderPage(GrowthOperationsPage)
    const text = container.textContent ?? ''

    expect(text).toContain('NT$30,000')
    expect(text).toContain('35%')
    expect(text).toContain('3.5%')
    expect(text).toContain('NT$12,000')
    expect(text).toContain('不保證商城核准、特定業績或搜尋排名')
    expect(text).not.toMatch(/NT\$[^。]*起/)
  })

  it('lists only published CMS case snapshots', async () => {
    await renderPage(CasesPage)
    expect(screen.getByRole('link', { name: '微笑甜果｜LINE 禮物電商案例' })).toHaveAttribute(
      'href',
      '/cases/smile-fruit',
    )
  })

  it('does not render the foundation publication as a broken academy article card', async () => {
    const { container } = await renderPage(AcademyPage)
    expect(screen.getByRole('link', { name: /先認識 LINE 禮物/ })).toHaveAttribute(
      'href',
      '/about-line-gift',
    )
    expect(container.querySelector('a[href="/line-gift-academy/about-line-gift"]')).toBeNull()
  })

  it('hides the foundation entry after its publication is withdrawn', async () => {
    cmsState.articles = []
    await renderPage(AcademyPage)
    expect(screen.queryByRole('link', { name: /先認識 LINE 禮物/ })).not.toBeInTheDocument()
  })

  it('hides a malformed foundation snapshot instead of linking to a 404', async () => {
    cmsState.articles = [{
      ...foundationPublication,
      typeFields: { publicPath: '/about-line-gift' },
    }]
    const { container } = await renderPage(AcademyPage)
    expect(screen.queryByRole('link', { name: /先認識 LINE 禮物/ })).not.toBeInTheDocument()
    expect(container.querySelector('a[href="/line-gift-academy/about-line-gift"]')).toBeNull()
  })

  it('renders a useful not-found state', () => {
    render(<NotFound />)
    expect(screen.getByRole('heading', { level: 1, name: '找不到這個頁面' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '申請品牌成長健檢' })).toHaveAttribute(
      'href',
      '/growth-audit',
    )
  })
})
