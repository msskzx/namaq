import { expect, open, test, openCards } from './fixtures';

// The home and Quran buttons hold page stacks, so the back arrow (and the swipe from the right edge on a phone) goes one page back.
// A Quran tool's grid goes straight to the Quran hub (owner, 2026-11-15).
test.describe('going back', () => {
  test('a Quran tool goes back to the Quran hub, and the Quran button comes back to the tool', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('tab', { name: 'القرآن' }).click();
    await expect(page).toHaveURL(/\/quran$/);
    await page.getByRole('link', { name: 'الأقسام' }).click();
    await expect(page).toHaveURL(/\/oaths/);
    await page.getByRole('tab', { name: 'الرئيسية' }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.getByRole('tab', { name: 'القرآن' }).click();
    await expect(page).toHaveURL(/\/oaths/);
    await page.getByRole('button', { name: 'أدوات القرآن' }).last().click();
    await expect(page).toHaveURL(/\/quran$/);
  });

  test('a tool opened straight away still has the hub under it', async ({ page }) => {
    await open(page, '/order');
    await page.getByRole('button', { name: 'أدوات القرآن' }).last().click();
    await expect(page).toHaveURL(/\/quran$/);
  });

  test('the grid on a compare opened from a tree goes straight to the hub', async ({ page }) => {
    await openCards(page);
    await page.getByRole('button', { name: 'في المقارنة' }).first().click();
    const pick = page.getByRole('dialog');
    if (await pick.isVisible().catch(() => false)) await pick.getByRole('button').first().click();
    await expect(page).toHaveURL(/\/compare/);
    await page.getByRole('button', { name: 'أدوات القرآن' }).last().click();
    await expect(page).toHaveURL(/\/quran$/);
  });

  test('the search goes back home, by its arrow or the home button', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'البحث' }).click();
    await expect(page).toHaveURL(/\/search/);
    await page.getByRole('button', { name: 'رجوع' }).last().click();
    await expect(page).toHaveURL(/\/$/);
    await page.getByRole('button', { name: 'البحث' }).click();
    await expect(page).toHaveURL(/\/search/);
    await page.getByRole('tab', { name: 'الرئيسية' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test.describe('with the mutashabih picked', () => {
    test.use({ seed: { interests: '["mutashabih"]', 'interests-surprise': '0' } });

    test('a tool opened from home before the Quran button was ever tapped still has the hub under it', async ({ page }) => {
      await open(page, '/');
      const button = page.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' }).first();
      await button.scrollIntoViewIfNeeded();
      await button.click();
      await expect(page).toHaveURL(/\/branches/);
      await page.getByRole('button', { name: 'أدوات القرآن' }).last().click();
      await expect(page).toHaveURL(/\/quran$/);
    });
  });

  test('only the home page shows the logo; other pages go home by the home tab', async ({ page }) => {
    await open(page, '/');
    await expect(page.getByRole('button', { name: 'الصفحة الرئيسية' })).toHaveCount(1);
    await page.getByRole('tab', { name: 'القرآن' }).click();
    await expect(page).toHaveURL(/\/quran$/);
    await expect(page.getByRole('button', { name: 'الصفحة الرئيسية' })).toHaveCount(0);
    await page.getByRole('tab', { name: 'الرئيسية' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('a tool opened again comes to the front with what it was opened for, not as a second copy', async ({ page }) => {
    await openCards(page);
    await page.getByRole('button', { name: 'في المقارنة' }).first().click();
    const pick = page.getByRole('dialog');
    if (await pick.isVisible().catch(() => false)) await pick.getByRole('button').first().click();
    await expect(page).toHaveURL(/\/compare/);
    await page.getByRole('button', { name: 'افتح في متشابهات القرآن' }).first().click();
    await expect(page).toHaveURL(/\/branches/);
    // One trees page, brought to the front: going back leaves the trees, it does not land on another copy of them.
    await expect(page.getByRole('button', { name: 'في المقارنة' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'أدوات القرآن' }).last().click();
    await expect(page).not.toHaveURL(/\/branches/);
  });

  test('the saved list opened straight away goes home by its arrow', async ({ page }) => {
    await open(page, '/library');
    await page.getByRole('button', { name: 'رجوع' }).last().click();
    await expect(page).toHaveURL(/\/$/);
  });
});
