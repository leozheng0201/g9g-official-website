import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomePage from '@/app/(public)/page'

describe('HomePage', () => {
  it('uses the approved hero and primary action', () => {
    render(<HomePage />)

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

  it('explains the gift-commerce decision model', () => {
    render(<HomePage />)

    expect(
      screen.getByText(
        '在 LINE 禮物，付錢的人跟收到商品的人不是同一個。原本的商品文案，很可能寫給錯的人看了。',
      ),
    ).toBeInTheDocument()
    for (const label of ['商品', '流量', '轉換', '情緒', '儀式', '商務', '吉時']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    }
  })

  it('does not publish prohibited copy or unsupported platform counts', () => {
    const { container } = render(<HomePage />)
    const text = container.textContent ?? ''

    expect(text).not.toContain('免費健檢')
    expect(text).not.toContain('免費品牌健檢')
    expect(text).not.toContain('900萬')
    expect(text).not.toContain('3,000+')
  })
})
