import { expect, open, test } from './fixtures';

test.use({ seed: { 'tour-seen': null } });

const seen = (page: import('@playwright/test').Page) => page.evaluate(() => localStorage.getItem('tour-seen'));

test('the first launch tour steps through to the home page', async ({ page }) => {
  await open(page, '/');
  await page.getByRole('button', { name: 'ابدأ', exact: true }).click();
  // A step turns when its slide ends, so each wait is for something only the new step shows: its hint, or the next step's page.
  const next = page.getByRole('button', { name: 'التالي', exact: true });
  await next.click();
  await expect(page.getByText('اسحب الشجرة واضغط غصنًا')).toBeVisible();
  await next.click();
  await expect(page.getByRole('heading', { name: 'قصص الأنبياء' })).toBeAttached();
  await next.click();
  await expect(page.getByText('اضغط نقطة لترى آياتها')).toBeVisible();
  await next.click();
  const home = page.getByRole('button', { name: 'إلى الرئيسية', exact: true });
  await home.click();
  await expect(page.getByRole('button', { name: 'الإعدادات' })).toBeVisible();
  expect(await seen(page)).toBe('true');
  await page.reload();
  await expect(page.getByRole('button', { name: 'الإعدادات' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ابدأ', exact: true })).toHaveCount(0);
});

test('skip ends the tour at once', async ({ page }) => {
  await open(page, '/');
  await page.getByRole('button', { name: 'ابدأ', exact: true }).click();
  await page.getByRole('button', { name: 'تخطَّ' }).filter({ visible: true }).click();
  await expect(page.getByRole('button', { name: 'الإعدادات' })).toBeVisible();
  expect(await seen(page)).toBe('true');
});
