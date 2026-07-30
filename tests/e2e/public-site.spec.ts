import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/about',
  '/why-g9g',
  '/growth-audit',
  '/growth-blueprint',
  '/growth-operations',
  '/line-gift-academy',
  '/cases',
  '/insights',
  '/faq',
  '/resources',
  '/contact',
  '/privacy',
  '/terms',
] as const

test('every approved public page renders one visible H1 without horizontal overflow', async ({
  page,
}) => {
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(hasOverflow, `${route} has horizontal overflow`).toBe(false)
  }
})

test('homepage audit CTA reaches the audit page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '申請品牌成長健檢' }).first().click()
  await expect(page).toHaveURL('/growth-audit')
  await expect(page.getByRole('heading', { level: 1, name: '品牌成長健檢' })).toBeVisible()
})

test('public pages do not expose prohibited copy', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route)
    const body = await page.locator('body').innerText()
    expect(body).not.toContain('scrutator')
    expect(body).not.toContain('免費品牌健檢')
    expect(body).not.toContain('免費健檢')
  }
})

test('unknown routes show the custom 404 path forward', async ({ page }) => {
  const response = await page.goto('/not-a-real-g9g-page')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: '找不到這個頁面' })).toBeVisible()
  await expect(page.getByRole('link', { name: '申請品牌成長健檢' })).toBeVisible()
})

test('mobile drawer reaches a major destination and restores page scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: '開啟網站選單' }).click()
  const dialog = page.getByRole('dialog', { name: '網站選單' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('link', { name: '關於 G9G' }).click()
  await expect(page).toHaveURL('/about')
  expect(await page.locator('body').evaluate((element) => element.style.overflow)).not.toBe('hidden')
})

test('mobile service group reaches the operations page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: '開啟網站選單' }).click()
  const dialog = page.getByRole('dialog', { name: '網站選單' })
  await dialog.getByText('品牌成長', { exact: true }).click()
  await dialog.getByRole('link', { name: /品牌成長代營運/ }).click()
  await expect(page).toHaveURL('/growth-operations')
  await expect(page.getByRole('heading', { level: 1, name: '品牌成長代營運' })).toBeVisible()
})
