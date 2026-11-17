import { expect, longPress, open, stored, tab, test } from './fixtures';
import { surahName as S } from '../../shared/quran/surahNames';

// The book reader (docs/plans/book-reader.md): al-Sa'di, which comes with the app, page by page.
// The فاصلة is a page, set from the ribbon in the top bar (owner, 2026-11-17).
test('a book opens from the shelf, its فاصلة stays on its page while the reader turns pages, and its button comes back to it', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'المكتبة').click();
  await page.getByRole('link', { name: 'تيسير الكريم الرحمن' }).click();
  await page.getByRole('button', { name: 'ضع الفاصلة في هذه الصفحة: هنا توقفت' }).click();
  await expect(page.getByRole('button', { name: 'أزل الفاصلة من هذه الصفحة' })).toBeVisible();
  const marked = await stored<{ sadi?: { page: number } }>(page, 'reading-fasila');
  expect(marked?.sadi?.page).toBeGreaterThan(0);

  await page.getByRole('button', { name: 'فهرس الكتاب ومحفوظاته' }).click();
  await page.getByRole('link', { name: new RegExp(`^${S(2)}،`) }).click();
  await expect.poll(async () => (await stored<{ sadi?: { entry: number } }>(page, 'book-last'))?.sadi?.entry).toBe(1);
  expect((await stored<{ sadi?: { page: number } }>(page, 'reading-fasila'))?.sadi?.page).toBe(marked?.sadi?.page);
  await expect(page.getByRole('button', { name: 'ضع الفاصلة في هذه الصفحة: هنا توقفت' })).toBeVisible();

  await page.getByRole('button', { name: /عد إلى فاصلتك/ }).click();
  await expect(page.getByRole('button', { name: 'أزل الفاصلة من هذه الصفحة' })).toBeVisible();
  // A long press on a paragraph no longer offers the فاصلة: it saves, opens the mushaf or shares.
  const paragraph = page.getByText(/^تقدم الكلام|^واعلم/).first();
  await expect(async () => {
    await longPress(page, paragraph);
    await expect(page.getByRole('toolbar', { name: 'أزرار الفقرة' })).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 15_000 });
  await expect(page.getByRole('toolbar', { name: 'أزرار الفقرة' }).getByRole('button', { name: /الفاصلة/ })).toHaveCount(0);
});

test('the search finds a word in the book whatever its vowel marks, and opens its page', async ({ page }) => {
  await open(page, '/book?id=sadi');
  await page.getByRole('button', { name: 'ابحث في الكتاب' }).click();
  await page.getByRole('textbox').fill('غشاوة');
  await page.getByRole('link').filter({ hasText: 'ص ٤١' }).first().click();
  await expect(page.getByText('ص ٤١', { exact: true })).toBeVisible();
});

test('the mushaf keeps its فاصلة on a page apart from the page open', async ({ page }) => {
  await open(page, '/read');
  // A tap on an ayah brings the bars.
  await page.getByText(/^ٱلۡحَمۡدُ/).first().click();
  await page.getByRole('button', { name: 'ضع الفاصلة في هذه الصفحة: هنا توقفت' }).click();
  await expect.poll(async () => (await stored<{ quran?: { key: string; page: number } }>(page, 'reading-fasila'))?.quran).toEqual({ key: '1:1', page: 1 });
  await expect(page.getByRole('button', { name: 'أزل الفاصلة من هذه الصفحة' })).toBeVisible();
});

// Book management moved from the settings to the library (owner, 2026-11-17): the pencil turns on editing.
test('the pencil hides a built-in book and brings it back, and the check ends editing', async ({ page }) => {
  await open(page, '/books');
  await expect(page.getByRole('button', { name: /^أخفِ/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'تعديل الكتب' }).click();
  await page.getByRole('button', { name: 'أخفِ تيسير الكريم الرحمن' }).click();
  await expect(page.getByRole('button', { name: 'أظهر تيسير الكريم الرحمن' })).toBeVisible();
  await page.getByRole('button', { name: 'تم' }).click();
  // Hidden, it leaves the shelf until editing brings it back.
  await expect(page.getByRole('link', { name: 'تيسير الكريم الرحمن' })).toHaveCount(0);
  await page.getByRole('button', { name: 'تعديل الكتب' }).click();
  await page.getByRole('button', { name: 'أظهر تيسير الكريم الرحمن' }).click();
  await page.getByRole('button', { name: 'تم' }).click();
  await page.getByRole('link', { name: 'تيسير الكريم الرحمن' }).click();
  await expect(page.getByRole('button', { name: 'فهرس الكتاب ومحفوظاته' })).toBeVisible();
});
