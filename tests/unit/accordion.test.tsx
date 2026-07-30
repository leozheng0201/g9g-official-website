import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Accordion } from '@/components/public/accordion'

it('toggles FAQ content with aria-expanded', () => {
  render(
    <Accordion
      items={[
        {
          id: 'fit',
          question: '什麼品牌適合 LINE 禮物？',
          answer: '需要從商品與送禮場景一起判斷。',
        },
      ]}
    />,
  )

  const trigger = screen.getByRole('button', { name: '什麼品牌適合 LINE 禮物？' })
  expect(trigger).toHaveAttribute('aria-expanded', 'false')

  fireEvent.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByText('需要從商品與送禮場景一起判斷。')).toBeVisible()
})
