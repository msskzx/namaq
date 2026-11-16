import { test, expect } from './fixtures';

test('surah order covers the early juz with quoted sources', async ({ page }) => {
  await page.route('https://va.vercel-scripts.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.goto('/quran/order');
  await page.getByRole('button', { name: '١', exact: true }).click();
  const list = page.getByRole('list', { name: 'السور' });
  await expect(list.getByRole('heading')).toHaveCount(2);
  await expect(list.getByRole('heading', { name: /^الفاتحة/ })).toBeVisible();
  await expect(list.getByRole('link', { name: 'السيوطي، تناسق الدرر ص٥٣' })).toHaveAttribute('href', 'https://shamela.ws/book/9992/51');
  await page.getByRole('button', { name: '٢٥', exact: true }).click();
  await expect(list.getByRole('heading').first()).toContainText('فصلت');
});
