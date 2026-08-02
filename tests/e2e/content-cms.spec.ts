import { expect, test } from '@playwright/test'

test.describe('published CMS content', () => {
  test('renders the migrated case and preserves result attribution', async ({ page }) => {
    await page.goto('/cases/ar-patisserie')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('法布甜')
    await expect(page.getByText('整體電商年營業額突破千萬')).toBeVisible()
    await expect(
      page.getByText('成果歸屬說明：以上為整體電商與品牌轉型成果，不代表 LINE 禮物單一平台成果。', {
        exact: true,
      }),
    ).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/cases\/ar-patisserie$/)
  })

  test('does not resolve an unpublished or unknown case', async ({ page }) => {
    const response = await page.goto('/cases/not-published')
    expect(response?.status()).toBe(404)
  })

  test('renders migrated case on a mobile viewport without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/cases/smile-fruit')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('微笑甜果')
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
  })
})
