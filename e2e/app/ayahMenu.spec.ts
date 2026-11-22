import { expect, longPress, open, readerPage, stored, test } from './fixtures';

// The reader's long-press menu on every ayah view (owner, 2026-11-22; /mnt/project-files/ayah-page/agreed.md part 4):
// the same buttons as the mushaf's, with the mushaf (and the ayah's page, away from it) first.
test.describe('a long press on an ayah off the mushaf', () => {
  test('on the ayah page, opens the reader\'s menu: its sheets, its marks, and the mushaf at the ayah', async ({ page }) => {
    await open(page, '/ayah?key=93:3');
    // The ayah's first word, in the card above its row of buttons (each word is its own run).
    const ayah = page.getByText('مَا', { exact: true }).first();
    await longPress(page, ayah);
    await expect(page.getByRole('button', { name: 'تفسير السعدي' })).toBeVisible();
    // On its own page, the menu does not offer the page again.
    await expect(page.getByRole('button', { name: 'صفحة الآية', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'احفظ الآية' }).filter({ visible: true }).last().click();
    await expect.poll(async () => (await stored<{ id: string }[]>(page, 'bookmarks'))?.some(item => item.id === 'ayah:93:3')).toBe(true);
    await longPress(page, ayah);
    await page.getByRole('button', { name: 'تفسير السعدي' }).click();
    await expect(page.getByRole('link', { name: 'اقرأ في الكتاب' })).toBeVisible();
  });

  test('opens the mushaf at the ayah from the menu', async ({ page }) => {
    await open(page, '/ayah?key=93:3');
    await longPress(page, page.getByText('مَا', { exact: true }).first());
    await page.getByRole('button', { name: 'في المصحف', exact: true }).last().click();
    await expect.poll(() => readerPage(page)).toBe(596);
  });
});
