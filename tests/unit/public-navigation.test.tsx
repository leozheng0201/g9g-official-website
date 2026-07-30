import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteFooter } from '@/components/public/site-footer'
import { SiteHeader } from '@/components/public/site-header'

describe('public site navigation', () => {
  it('links to every primary destination and the growth audit', () => {
    render(<SiteHeader />)

    expect(screen.getAllByRole('link', { name: '關於 G9G' }).length).toBeGreaterThan(0)
    expect(
      screen.getAllByRole('link', { name: 'LINE 禮物研究院' }).some((link) =>
        link.getAttribute('href')?.includes('/line-gift-academy'),
      ),
    ).toBe(true)
    expect(
      screen.getAllByRole('link', { name: '申請品牌成長健檢' }).some((link) =>
        link.getAttribute('href')?.includes('/growth-audit'),
      ),
    ).toBe(true)
  })

  it('opens and closes the mobile navigation accessibly', () => {
    render(<SiteHeader />)
    const trigger = screen.getByRole('button', { name: '開啟網站選單' })

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog', { name: '網站選單' })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: '網站選單' })).not.toBeInTheDocument()
  })

  it('shows approved public contact methods without the hidden LINE identity', () => {
    const { container } = render(<SiteFooter />)

    expect(screen.getByRole('link', { name: /加入 LINE 諮詢/ })).toHaveAttribute(
      'href',
      'https://lin.ee/QwORXXZ',
    )
    expect(screen.getByText('0915-009-707')).toBeInTheDocument()
    expect(screen.getByText('g9growth@gmail.com')).toBeInTheDocument()
    expect(container.textContent).not.toContain('scrutator')
  })
})
