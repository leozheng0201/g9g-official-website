import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandMark } from '@/components/brand/brand-mark'
import { LinkButton } from '@/components/ui/link-button'

describe('LinkButton', () => {
  it('renders a navigable primary CTA', () => {
    render(<LinkButton href="/growth-audit">申請品牌成長健檢</LinkButton>)

    expect(screen.getByRole('link', { name: '申請品牌成長健檢' })).toHaveAttribute(
      'href',
      '/growth-audit',
    )
  })
})

describe('BrandMark', () => {
  it('links the primary G9G brand to the homepage', () => {
    render(<BrandMark />)

    expect(
      screen.getByRole('link', { name: 'G9G LINE 禮物品牌成長平台' }),
    ).toHaveAttribute('href', '/')
  })
})
