import { expect, test } from '@playwright/test'

test('public home identifies G9G', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'G9G' })).toBeVisible()
  await expect(page.getByText('LINE 禮物品牌成長平台')).toBeVisible()
})
