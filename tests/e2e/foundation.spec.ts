import { expect, test } from '@playwright/test'

test('public home identifies G9G', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: '讓商品不只上架，而是成為別人想送的理由。',
    }),
  ).toBeVisible()
})

test('admin login is visible', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(page.getByRole('heading', { name: 'G9G Admin' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: '登入', exact: true }),
  ).toBeVisible()
})

test('anonymous admin request redirects to login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin$/)
})
