import { dhikrById } from '../../shared/adhkar';
import { expect, open, test } from './fixtures';

// The utilities left the tab bar for the library (owner, 2026-11-17): they open from the compass in home's top bar.
const compass = (page: import('@playwright/test').Page) => page.getByRole('button', { name: 'الأدوات', exact: true }).filter({ visible: true }).first();

test('prayer times for a picked city, then the qibla and the Hijri month', async ({ page }) => {
  await open(page, '/');
  await compass(page).click();
  await page.getByRole('button', { name: 'اختر مدينة' }).filter({ visible: true }).first().click();
  await page.getByLabel('ابحث عن مدينة').fill('القاهرة');
  await page.getByRole('radio', { name: 'القاهرة' }).click();
  await expect(page.getByRole('button', { name: 'المكان: القاهرة' }).filter({ visible: true }).first()).toBeVisible();
  for (const prayer of ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء']) await expect(page.getByLabel(new RegExp(`^${prayer} `)).filter({ visible: true }).first()).toBeVisible();

  await page.getByRole('radio', { name: 'القبلة' }).click();
  // The dial's label names the qibla's bearing from the picked city.
  await expect(page.getByRole('img', { name: /^القبلة ١٣[٥-٧]° من الشمال/ }).filter({ visible: true }).first()).toBeVisible();

  await page.getByRole('radio', { name: 'التقويم الهجري' }).click();
  await page.getByRole('button', { name: 'الشهر التالي' }).click();
  await page.getByRole('button', { name: 'عودة إلى الشهر الحالي' }).click();
  await expect(page.getByRole('button', { name: 'عودة إلى الشهر الحالي' })).toHaveCount(0);
});

test('a sideways swipe moves to the next utility and its icon', async ({ page }) => {
  await open(page, '/');
  await compass(page).click();
  await page.getByRole('radio', { name: 'مواقيت الصلاة' }).click();
  await expect(page.getByRole('radio', { name: 'مواقيت الصلاة' })).toBeChecked();
  // The web export pages with CSS scroll snap; scrolling the pager one page is what a swipe does.
  await page.evaluate(() => {
    const strip = [...document.querySelectorAll('div')].find(div => getComputedStyle(div).scrollSnapType.startsWith('x') && div.scrollWidth > div.clientWidth * 2);
    if (strip) strip.scrollLeft = strip.clientWidth;
  });
  await expect(page.getByRole('radio', { name: 'القبلة' })).toBeChecked();
  // A tap on an icon moves the pages the other way.
  await page.getByRole('radio', { name: 'التقويم الهجري' }).click();
  await expect(page.getByRole('button', { name: 'الشهر التالي' }).filter({ visible: true })).toBeInViewport();
});

test('the adhkar: each time\'s cards, a counter that stops at its number and starts again, and a search that opens the card', async ({ page }) => {
  await open(page, '/');
  await compass(page).click();
  await page.getByRole('radio', { name: 'الأذكار' }).click();
  await expect(page.getByRole('tab', { name: 'صباح' }).filter({ visible: true }).first()).toBeVisible();
  // Only a card whose hadith states a number has a counter; it stops at three.
  const tap = page.getByRole('button', { name: /^عُدَّ مرة/ }).filter({ visible: true }).nth(1);
  await expect(tap).toHaveAccessibleName('عُدَّ مرة، ٠ من ٣');
  for (let i = 0; i < 3; i++) await tap.click();
  await expect(tap).toHaveAccessibleName('عُدَّ مرة، ٣ من ٣');
  await expect(tap).toBeDisabled();
  await page.getByRole('button', { name: 'من جديد' }).filter({ visible: true }).first().click();
  await expect(tap).toHaveAccessibleName('عُدَّ مرة، ٠ من ٣');
  // Another tab ends the count, and nothing about it is stored.
  await tap.click();
  await page.getByRole('tab', { name: 'مساء' }).filter({ visible: true }).first().click();
  await page.getByRole('tab', { name: 'صباح' }).filter({ visible: true }).first().click();
  await expect(page.getByRole('button', { name: /^عُدَّ مرة/ }).filter({ visible: true }).nth(1)).toHaveAccessibleName('عُدَّ مرة، ٠ من ٣');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => /adhkar|count/i.test(key) && key !== 'adhkar-alerts'))).toEqual([]);
  // A card's reference opens on al-Nawawi's words and the scholar's grade.
  await page.getByRole('button', { name: /^الأذكار ٧٨ ح٢١٣/ }).filter({ visible: true }).first().click();
  await expect(page.getByText('«قال الترمذي: هذا حديث حسن صحيح»', { exact: false }).filter({ visible: true }).first()).toBeVisible();

  await open(page, '/search');
  await page.getByLabel(/ابحث/).first().fill('أنت السلام ومنك السلام');
  const peace = dhikrById('prayer-peace')!.content;
  await page.getByRole('link', { name: peace.kind === 'text' ? peace.text : '' }).first().click();
  await expect(page.getByRole('tab', { name: 'صلاة' }).filter({ visible: true }).first()).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: /^الأذكار ٧١ ح١٨٣/ }).filter({ visible: true }).first()).toBeInViewport();
});
