import { dhikrById } from '../../shared/adhkar';
import { expect, open, test } from './fixtures';

// The utilities open from home's buttons (owner, 2026-11-18): «القبلة» on the qibla, «الأذكار» on the adhkar. Two pages
// since 2026-11-23: «الأدوات» (the date, the prayer times, the qibla under them) and «الأذكار».
const tools = async (page: import('@playwright/test').Page) => {
  await page.getByRole('button', { name: 'القبلة', exact: true }).filter({ visible: true }).first().click();
  await expect(page.getByRole('radio', { name: 'الأدوات' })).toBeChecked();
};

test('the tools page: prayer times for a picked city, the qibla under them, and the Hijri month', async ({ page }) => {
  await open(page, '/');
  await tools(page);
  await page.getByRole('button', { name: 'اختر مدينة' }).filter({ visible: true }).first().click();
  await page.getByLabel('ابحث عن مدينة').fill('القاهرة');
  await page.getByRole('radio', { name: 'القاهرة' }).click();
  await expect(page.getByRole('button', { name: /^المكان وطريقة الحساب: القاهرة/ }).filter({ visible: true }).first()).toBeVisible();
  for (const prayer of ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء']) await expect(page.getByLabel(new RegExp(`^${prayer} `)).filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByLabel(/^الصلاة التالية /).filter({ visible: true }).first()).toBeVisible();

  // The dial's label names the qibla's bearing from the picked city.
  const dial = page.getByRole('img', { name: /^القبلة ١٣[٥-٧]° من الشمال/ }).filter({ visible: true }).first();
  await dial.scrollIntoViewIfNeeded();
  await expect(dial).toBeVisible();

  await page.getByRole('button', { name: 'التقويم الهجري' }).filter({ visible: true }).first().click();
  await page.getByRole('button', { name: 'الشهر التالي' }).click();
  await page.getByRole('button', { name: 'عودة إلى الشهر الحالي' }).click();
  await expect(page.getByRole('button', { name: 'عودة إلى الشهر الحالي' })).toHaveCount(0);
});

test('a sideways swipe moves to the adhkar and its icon', async ({ page }) => {
  await open(page, '/');
  await tools(page);
  // The web export pages with CSS scroll snap; scrolling the pager one page is what a swipe does.
  await page.evaluate(() => {
    const strip = [...document.querySelectorAll('div')].find(div => getComputedStyle(div).scrollSnapType.startsWith('x') && div.scrollWidth > div.clientWidth * 1.5);
    if (strip) strip.scrollLeft = strip.clientWidth;
  });
  await expect(page.getByRole('radio', { name: 'الأذكار' })).toBeChecked();
  // A tap on an icon moves the pages the other way.
  await page.getByRole('radio', { name: 'الأدوات' }).click();
  await expect(page.getByRole('button', { name: 'التقويم الهجري' }).filter({ visible: true })).toBeInViewport();
});

test('the adhkar: each time\'s cards, a counter that stops at its number and starts again, and a search that opens the card', async ({ page }) => {
  await open(page, '/');
  await tools(page);
  await page.getByRole('radio', { name: 'الأذكار' }).click();
  await expect(page.getByRole('tab', { name: 'الصباح' }).filter({ visible: true }).first()).toBeVisible();
  // Only a card whose hadith states a number has a counter; it stops at three.
  const tap = page.getByRole('button', { name: /^عُدَّ مرة/ }).filter({ visible: true }).nth(1);
  await expect(tap).toHaveAccessibleName('عُدَّ مرة، ٠ من ٣');
  for (const n of ['١', '٢', '٣']) { await tap.click(); await expect(tap).toHaveAccessibleName(`عُدَّ مرة، ${n} من ٣`); }
  await expect(tap).toHaveAccessibleName('عُدَّ مرة، ٣ من ٣');
  await expect(tap).toBeDisabled();
  await page.getByRole('button', { name: 'من جديد' }).filter({ visible: true }).first().click();
  await expect(tap).toHaveAccessibleName('عُدَّ مرة، ٠ من ٣');
  // Another tab ends the count, and nothing about it is stored.
  await tap.click();
  await page.getByRole('tab', { name: 'المساء' }).filter({ visible: true }).first().click();
  await page.getByRole('tab', { name: 'الصباح' }).filter({ visible: true }).first().click();
  await expect(page.getByRole('button', { name: /^عُدَّ مرة/ }).filter({ visible: true }).nth(1)).toHaveAccessibleName('عُدَّ مرة، ٠ من ٣');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => /adhkar|count/i.test(key) && key !== 'adhkar-alerts'))).toEqual([]);
  // A card's source line, under its buttons, opens on al-Nawawi's words and the scholar's grade (owner, 2026-11-20).
  await page.getByRole('button', { name: /^المصدر: الأذكار ٧٨ ح٢١٣/ }).filter({ visible: true }).first().click();
  await expect(page.getByText('«قال الترمذي: هذا حديث حسن صحيح»', { exact: false }).filter({ visible: true }).first()).toBeVisible();

  await open(page, '/search');
  await page.getByRole('textbox', { name: /ابحث/ }).first().fill('أنت السلام ومنك السلام');
  const peace = dhikrById('prayer-peace')!.content;
  await page.getByRole('link', { name: peace.kind === 'text' ? peace.text : '' }).first().click();
  await expect(page.getByRole('tab', { name: 'الصلاة' }).filter({ visible: true }).first()).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: /^المصدر: الأذكار ٧١ ح١٨٣/ }).filter({ visible: true }).first()).toBeInViewport();

  // A morning card sits under the whole Quran page, which is drawn after the cards are first laid out.
  await open(page, '/search');
  await page.getByRole('textbox', { name: /ابحث/ }).first().fill('بك أصبحنا وبك أمسينا');
  const morning = dhikrById('morning-by-you')!.content;
  await page.getByRole('link', { name: morning.kind === 'text' ? morning.text : '' }).first().click();
  await expect(page.getByRole('button', { name: /^المصدر: الأذكار ٧٧ ح٢٠٨/ }).filter({ visible: true }).first()).toBeInViewport();
});
