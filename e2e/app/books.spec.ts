import { expect, longPress, open, stored, tab, test } from './fixtures';

// The book reader (docs/plans/book-reader.md): al-Sa'di, which comes with the app, page by page.
test('a book opens from the shelf, a فاصلة stays put while the reader turns pages, and its button comes back to it', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'المكتبة').click();
  await page.getByRole('link', { name: 'تيسير الكريم الرحمن' }).click();
  const paragraph = page.getByText(/^واعلم أن من القواعد/).first();
  await expect(async () => {
    await longPress(page, paragraph);
    await expect(page.getByRole('toolbar', { name: 'أزرار الفقرة' })).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 15_000 });
  await page.getByRole('button', { name: 'ضع الفاصلة هنا: هنا توقفت' }).click();
  await expect.poll(async () => (await stored<{ sadi?: { page: number } }>(page, 'reading-fasila'))?.sadi?.page).toBe(39);

  await page.getByRole('button', { name: 'فهرس الكتاب ومحفوظاته' }).click();
  await page.getByRole('link', { name: /^البقرة،/ }).click();
  await expect.poll(async () => (await stored<{ sadi?: { entry: number } }>(page, 'book-last'))?.sadi?.entry).toBe(1);
  expect((await stored<{ sadi?: { page: number } }>(page, 'reading-fasila'))?.sadi?.page).toBe(39);

  await page.getByRole('button', { name: /عد إلى فاصلتك/ }).click();
  await expect(page.getByText(/^واعلم أن من القواعد/).first()).toBeInViewport();
});

test('the search finds a word in the book whatever its vowel marks, and opens its page', async ({ page }) => {
  await open(page, '/book?id=sadi');
  await page.getByRole('button', { name: 'ابحث في الكتاب' }).click();
  await page.getByRole('textbox').fill('غشاوة');
  await page.getByRole('link').filter({ hasText: 'ص ٤١' }).first().click();
  await expect(page.getByText('ص ٤١', { exact: true })).toBeVisible();
});

test('the mushaf keeps its فاصلة apart from the page open', async ({ page }) => {
  await open(page, '/read');
  const word = page.getByText(/^ٱلۡحَمۡدُ/).first();
  await expect(async () => {
    await longPress(page, word);
    await expect(page.getByRole('toolbar')).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 15_000 });
  await page.getByRole('button', { name: 'ضع الفاصلة هنا: هنا توقفت' }).click();
  await expect.poll(async () => (await stored<{ quran?: { key: string } }>(page, 'reading-fasila'))?.quran?.key).toBe('1:2');
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
