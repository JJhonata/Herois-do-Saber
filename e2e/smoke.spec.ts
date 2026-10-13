import { expect, test } from '@playwright/test'

test('busca jogos na Home', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Heróis do Saber' })).toBeVisible()
  await page.getByLabel('Encontrar uma aventura').fill('matemática')
  await expect(page.locator('.card')).toHaveCount(6)
  await expect(page.locator('.card h3').filter({ hasText: 'Matemática' })).toBeVisible()
})

test('carrega Biblioteca e página 404', async ({ page }) => {
  await page.goto('/books')
  await expect(page.getByRole('heading', { name: 'Biblioteca de leitura' })).toBeVisible()
  await page.goto('/rota-inexistente')
  await expect(page.getByRole('heading', { name: 'Essa aventura não existe' })).toBeVisible()
})

test('move o foco para o feedback após uma resposta', async ({ page }) => {
  await page.goto('/math')
  await page.locator('main .game button').first().click()
  await expect(page.locator('.game-message')).toBeFocused()
})
