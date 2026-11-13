import { expect, open, tab, test } from './fixtures';

test('prayer times for a picked city, then the qibla and the Hijri month', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'الأدوات').click();
  await page.getByRole('button', { name: 'اختر مدينة' }).click();
  await page.getByLabel('ابحث عن مدينة').fill('القاهرة');
  await page.getByRole('radio', { name: 'القاهرة' }).click();
  await expect(page.getByRole('button', { name: 'المكان: القاهرة' })).toBeVisible();
  for (const prayer of ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء']) await expect(page.getByLabel(new RegExp(`^${prayer} `)).filter({ visible: true }).first()).toBeVisible();

  await page.getByRole('radio', { name: 'القبلة' }).click();
  // The dial's label names the qibla's bearing from the picked city.
  await expect(page.getByRole('img', { name: /^القبلة ١٣[٥-٧]° من الشمال/ }).filter({ visible: true }).first()).toBeVisible();

  await page.getByRole('radio', { name: 'التقويم الهجري' }).click();
  await page.getByRole('button', { name: 'الشهر التالي' }).click();
  await page.getByRole('button', { name: 'عودة إلى الشهر الحالي' }).click();
  await expect(page.getByRole('button', { name: 'عودة إلى الشهر الحالي' })).toHaveCount(0);
});
