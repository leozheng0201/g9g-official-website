import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomePage from '@/app/(public)/page'

describe('HomePage', () => {
  it('states the G9G LINE Gift positioning', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'G9G' })).toBeInTheDocument()
    expect(screen.getByText('LINE 禮物品牌成長平台')).toBeInTheDocument()
  })
})
