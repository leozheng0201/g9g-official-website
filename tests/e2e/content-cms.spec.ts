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

test.describe('official LINE Gift foundation content', () => {
  test('renders sourced official data with clear non-official attribution', async ({ page }) => {
    await page.goto('/about-line-gift')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('認識 LINE 禮物')
    await expect(page.getByText('900 萬以上', { exact: true })).toBeVisible()
    await expect(page.getByText('8,000 萬以上', { exact: true })).toBeVisible()
    await expect(page.getByText('儀式禮物', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('商務禮物', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('吉時禮物', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('情緒禮物', { exact: true }).first()).toBeVisible()
    await expect(page.getByText(/G9G／盛澄策略顧問非 LINE 官方或官方代理商/)).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/about-line-gift$/)
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent ?? '{}')),
    )
    expect(schemas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ '@type': 'WebPage', url: expect.stringMatching(/\/about-line-gift$/) }),
        expect.objectContaining({
          '@type': 'BreadcrumbList',
          itemListElement: expect.arrayContaining([
            expect.objectContaining({ item: expect.stringMatching(/\/about-line-gift$/) }),
          ]),
        }),
      ]),
    )
    await expect(page.getByText('免費品牌健檢')).toHaveCount(0)
    await expect(page.getByText('scrutator')).toHaveCount(0)
  })

  test('links to the foundation page from home and academy', async ({ page }) => {
    await page.goto('/')
    const homeLink = page.getByRole('link', { name: '完整認識 LINE 禮物' })
    await expect(homeLink).toHaveAttribute('href', '/about-line-gift')

    await page.goto('/line-gift-academy')
    const academyLink = page.getByRole('link', { name: /先認識 LINE 禮物/ })
    await expect(academyLink).toHaveAttribute('href', '/about-line-gift')
    await expect(page.locator('a[href="/line-gift-academy/about-line-gift"]')).toHaveCount(0)
  })

  test('lists the foundation page once through its active publication snapshot', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.ok()).toBe(true)
    const sitemap = await response.text()
    expect(sitemap.match(/\/about-line-gift/g)).toHaveLength(1)
    expect(sitemap).not.toContain('/line-gift-academy/about-line-gift')
  })

  test('has no horizontal overflow at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/about-line-gift')
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
  })
})
