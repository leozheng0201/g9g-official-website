import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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

const pages = [
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
] as const

describe('public pages', () => {
  it.each(pages)('renders one approved H1 for %s', (Page, heading) => {
    const { container } = render(<Page />)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    expect(container.querySelectorAll('h1')).toHaveLength(1)
  })

  it('explains the relationship between G9G and 盛澄策略顧問', () => {
    render(<AboutPage />)
    expect(
      screen.getByText(/G9G 是盛澄策略顧問聚焦 LINE 禮物品牌成長的服務品牌/),
    ).toBeInTheDocument()
    expect(screen.getByText('莊又丞')).toBeInTheDocument()
  })

  it('publishes all approved operations prices and boundaries', () => {
    const { container } = render(<GrowthOperationsPage />)
    const text = container.textContent ?? ''

    expect(text).toContain('NT$30,000')
    expect(text).toContain('35%')
    expect(text).toContain('3.5%')
    expect(text).toContain('NT$12,000')
    expect(text).toContain('不保證商城核准、特定業績或搜尋排名')
    expect(text).not.toMatch(/NT\$[^。]*起/)
  })

  it('attributes 法布甜 results to overall ecommerce', () => {
    render(<CasesPage />)
    expect(
      screen.getByText(/以上為整體電商與品牌轉型成果，不代表 LINE 禮物單一平台成果/),
    ).toBeInTheDocument()
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
