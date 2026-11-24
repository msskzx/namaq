import { dhikrById } from '../../shared/adhkar';
import { expect, open, test } from './fixtures';

// The utilities open from home's buttons (owner, 2026-11-18): «القبلة» on the qibla, «الأذكار» on the adhkar. Two pages
// since 2026-11-23: «الأدوات» (the date, the prayer times, the qibla under them) and «الأذكار».
/** A dhikr's row in a list is named by its first words. */
const rowOf = (id: string) => {
  const content = dhikrById(id)!.content;
  const start = content.kind === 'text' ? content.text.split(/\s+/).slice(0, 3).join(' ') : '';
  return new RegExp(`^${start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
};

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
  // The times are drawn round a dial or down the day's line (owner, 2026-11-24); the line is kept after a reload, bells and all.
  await page.getByRole('tab', { name: 'خط' }).filter({ visible: true }).first().click();
  await page.reload();
  await expect(page.getByRole('radio', { name: 'الأدوات' })).toBeChecked();
  await expect(page.getByRole('tab', { name: 'خط' }).filter({ visible: true }).first()).toHaveAttribute('aria-selected', 'true');
  for (const prayer of ['الفجر', 'العشاء']) await expect(page.getByLabel(new RegExp(`^${prayer} `)).filter({ visible: true }).first()).toBeVisible();

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

// The adhkar (owner, 2026-11-24): the times as a list, a time's adhkar as rows, a dhikr open full screen that swipes
// through the rest; what was said is kept until the day ends.
test('the adhkar: a time, its list, a dhikr open with its count kept for the day, its whole report and its source', async ({ page }) => {
  await open(page, '/');
  await tools(page);
  await page.getByRole('radio', { name: 'الأذكار' }).click();
  await page.getByRole('button', { name: /^أذكار الصباح،/ }).filter({ visible: true }).first().click();
  await expect(page.getByRole('heading', { name: 'أذكار الصباح' }).filter({ visible: true })).toBeVisible();
  await page.getByRole('button', { name: rowOf('morning-evening-name') }).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/dhikr/);
  // Only a dhikr whose hadith states a number counts to it; the ring stops there.
  const ring = page.getByRole('button', { name: /^عُدَّ مرة/ }).filter({ visible: true }).first();
  await expect(ring).toHaveAccessibleName('عُدَّ مرة، ٠ من ٣');
  for (const n of ['١', '٢']) { await ring.click(); await expect(ring).toHaveAccessibleName(`عُدَّ مرة، ${n} من ٣`); }
  await ring.click();
  // Said three times, it is kept for today, and the next dhikr comes in; «السابق» goes back to it, done.
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('adhkar-said') ?? 'null')?.counts)).toEqual({ 'morning:morning-evening-name': { n: 3, of: 3 } });
  await expect(page.getByLabel(/^الذكر .*، قلت ١$/)).toBeVisible();
  await page.getByRole('button', { name: 'السابق' }).click();
  const done = page.getByRole('button', { name: 'عُدَّ مرة، ٣ من ٣' }).filter({ visible: true }).first();
  await expect(done).toBeDisabled();
  await page.reload();
  await expect(page.getByRole('button', { name: 'عُدَّ مرة، ٣ من ٣' }).filter({ visible: true }).first()).toBeDisabled();
  await page.getByRole('button', { name: 'من جديد' }).filter({ visible: true }).first().click();
  await expect(page.getByRole('button', { name: /^عُدَّ مرة/ }).filter({ visible: true }).first()).toHaveAccessibleName('عُدَّ مرة، ٠ من ٣');
  // The whole report, al-Nawawi's own words, folded under the dhikr (owner, 2026-11-24: a sample on one or two first).
  await page.getByRole('button', { name: 'الحديث كاملًا كما رواه النووي' }).filter({ visible: true }).first().click();
  await expect(page.getByText(/هذا لفظ الترمذي/).filter({ visible: true }).first()).toBeVisible();
  // A card's source line opens on al-Nawawi's words and the scholar's grade (owner, 2026-11-20).
  await page.getByRole('button', { name: /^المصدر: الأذكار ٧٨ ح٢١٣/ }).filter({ visible: true }).first().click();
  await expect(page.getByText('«قال الترمذي: هذا حديث حسن صحيح»', { exact: false }).filter({ visible: true }).first()).toBeVisible();
});

test('a search finds a dhikr, on the adhkar page and in the app\'s search, and opens it', async ({ page }) => {
  await open(page, '/');
  await tools(page);
  await page.getByRole('radio', { name: 'الأذكار' }).click();
  await page.getByLabel('ابحث في الأذكار').filter({ visible: true }).first().fill('بك أصبحنا');
  await page.getByRole('button', { name: rowOf('morning-by-you') }).filter({ visible: true }).first().click();
  await expect(page.getByRole('button', { name: /^المصدر: الأذكار ٧٧ ح٢٠٨/ }).filter({ visible: true }).first()).toBeInViewport();

  await open(page, '/search');
  await page.getByRole('textbox', { name: /ابحث/ }).first().fill('أنت السلام ومنك السلام');
  const peace = dhikrById('prayer-peace')!.content;
  await page.getByRole('link', { name: peace.kind === 'text' ? peace.text : '' }).first().click();
  await expect(page.getByRole('button', { name: /^المصدر: الأذكار ٧١ ح١٨٣/ }).filter({ visible: true }).first()).toBeInViewport();
});
