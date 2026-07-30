import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandMark } from '@/components/brand/brand-mark'
import { Button } from '@/components/ui/button'

describe('foundation UI', () => {
  it('renders the approved CTA', () => {
    render(<Button>申請品牌成長健檢</Button>)
    expect(screen.getByRole('button', { name: '申請品牌成長健檢' })).toHaveAttribute(
      'data-variant',
      'primary',
    )
  })

  it('renders the official positioning', () => {
    render(<BrandMark />)
    expect(screen.getByText('LINE 禮物品牌成長平台')).toBeInTheDocument()
  })
})
