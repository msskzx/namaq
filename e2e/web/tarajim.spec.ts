import { expect, test } from './fixtures';

// The website's «الصلات» pages, as the app's (owner, 2026-11-19: website parity): «بين عدة أشخاص» draws the nearest chain
// between the people picked, and «حياتهم جنبًا إلى جنب» puts two lives side by side by year. The hub opens both.
test('the hub opens «بين عدة أشخاص», which picks people and draws the chain that joins them', async ({ page }) => {
  await page.goto('/biographies');
  await page.getByRole('link', { name: /بين عدة أشخاص/ }).click();
  await expect(page).toHaveURL(/\/between$/);
  await page.getByRole('searchbox', { name: 'ابحث في التراجم' }).fill('الزبير بن العوام');
  await page.getByRole('link', { name: 'الزبير بن العوام' }).click();
  await page.getByRole('button', { name: 'أضف' }).click();
  // Found by his kunya, as the app's search finds him.
  await page.getByRole('searchbox', { name: 'ابحث في التراجم' }).fill('ابو عمارة');
  await page.getByRole('link', { name: 'حمزة بن عبد المطلب' }).click();
  await expect(page).toHaveURL(/slugs=az-zubayr-ibn-al-awwam,hamzah-ibn-abd-al-muttalib/);
  await expect(page.getByText(/أمُّ الزبير بن العوام/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'حمزة بن عبد المطلب', exact: true })).toBeVisible();
});

test('the hub opens «حياتهم جنبًا إلى جنب», where what two lives shared sits on one row', async ({ page }) => {
  await page.goto('/biographies');
  await page.getByRole('link', { name: /حياتهم جنبًا إلى جنب/ }).click();
  await expect(page).toHaveURL(/\/life$/);
  await page.getByRole('searchbox', { name: 'ابحث في التراجم' }).fill('الزبير بن العوام');
  await page.getByRole('link', { name: 'الزبير بن العوام' }).click();
  await page.getByRole('button', { name: 'أضف' }).click();
  await page.getByRole('searchbox', { name: 'ابحث في التراجم' }).fill('الصديق');
  await page.getByRole('link', { name: /^أبو بكر/ }).click();
  await expect(page).toHaveURL(/slugs=az-zubayr-ibn-al-awwam,abu-bakr-as-siddiq/);
  // Both were at Badr: one box each, side by side; only al-Zubayr at the Camel.
  await expect(page.getByRole('link', { name: 'غزوة بدر' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'معركة الجمل' })).toHaveCount(1);
  // What one lived alone stays in his own column: the server's rows reached the page cut after the last filled cell, so a
  // lone box spread over the other's column.
  const width = async (name: string) => (await page.getByRole('link', { name }).first().boundingBox())!.width;
  expect(await width('معركة الجمل')).toBeCloseTo(await width('غزوة بدر'), 0);
});
