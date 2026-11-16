import { expect, test } from './fixtures';

// The website's book reader (docs/plans/book-reader.md), as the app's: a فاصلة stays put while the pages turn.
test('a book opens from the shelf, a فاصلة stays put while the reader turns pages, and its pill comes back to it', async ({ page }) => {
  await page.goto('/quran/books');
  await page.getByRole('link', { name: /تيسير الكريم الرحمن/ }).click();
  await expect(page).toHaveURL(/\/quran\/books\/sadi\/1$/);
  const paragraph = page.locator('[data-spot]').nth(1);
  await paragraph.click();
  await page.getByRole('button', { name: 'ضع الفاصلة هنا: هنا توقفت' }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('reading-fasila') ?? '{}').sadi?.entry)).toBe(0);
  await page.getByRole('button', { name: 'الصفحة التالية' }).click();
  await expect(page).toHaveURL(/\/sadi\/2$/);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('book-last') ?? '{}').sadi?.entry)).toBeGreaterThan(-1);
  await page.getByRole('link', { name: /عد إلى فاصلتك/ }).click();
  await expect(page).toHaveURL(/\/sadi\/1\?lit=/);
  await expect(page.locator('[data-lit]')).toHaveCount(1);
});

test('the search finds a word whatever its vowel marks and opens its page', async ({ page }) => {
  await page.goto('/quran/books/sadi/1');
  await page.getByRole('button', { name: 'ابحث في الكتاب' }).first().click();
  await page.getByRole('textbox', { name: 'ابحث في الكتاب' }).fill('غشاوة');
  await page.getByRole('link').filter({ hasText: 'غشاوة' }).first().click();
  await expect(page).toHaveURL(/\/sadi\/\d+$/);
  await expect(page.getByText(/غِشَاوَةٌ|غشاوة/).first()).toBeVisible();
});

test('an ayah opens the page of its passage', async ({ page }) => {
  await page.goto('/quran/books/kashshaf?ayah=2:5');
  await expect(page).toHaveURL(/\/quran\/books\/kashshaf\/\d+$/);
  await expect(page.getByRole('link', { name: /افتح البقرة/ }).first()).toBeVisible();
});
