import { expect, open, test } from './fixtures';

// The home and Quran buttons hold page stacks, so the back arrow (and the swipe from the right edge on a phone) goes one page back.
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
    await page.getByRole('button', { name: 'رجوع' }).last().click();
    await expect(page).toHaveURL(/\/quran$/);
  });

  test('a tool opened straight away still has the hub under it', async ({ page }) => {
    await open(page, '/order');
    await page.getByRole('button', { name: 'رجوع' }).last().click();
    await expect(page).toHaveURL(/\/quran$/);
  });

  test('compare opened from a tree goes back to the tree', async ({ page }) => {
    await open(page, '/branches');
    await page.getByRole('button', { name: 'في المقارنة' }).first().click();
    const pick = page.getByRole('dialog');
    if (await pick.isVisible().catch(() => false)) await pick.getByRole('button').first().click();
    await expect(page).toHaveURL(/\/compare/);
    await page.getByRole('button', { name: 'رجوع' }).last().click();
    await expect(page).toHaveURL(/\/branches/);
    await page.getByRole('button', { name: 'رجوع' }).last().click();
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

  test('a tool opened from home before the Quran button was ever tapped still has the hub under it', async ({ page }) => {
    await open(page, '/');
    const button = page.getByRole('button', { name: 'افتح الشجرة في متشابهات القرآن' }).first();
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(page).toHaveURL(/\/branches/);
    await page.getByRole('button', { name: 'رجوع' }).last().click();
    await expect(page).toHaveURL(/\/quran$/);
  });

  test('the logo goes home without leaving the search over it', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'البحث' }).click();
    await expect(page).toHaveURL(/\/search/);
    await page.getByRole('tab', { name: 'المصحف' }).click();
    await expect(page).toHaveURL(/\/read/);
    await page.getByRole('tab', { name: 'القرآن' }).click();
    await page.getByRole('button', { name: 'الصفحة الرئيسية' }).last().click();
    await expect(page).toHaveURL(/\/$/);
    // The search page left the home stack: only the home page is drawn there.
    await expect(page.getByLabel('ابحث في كل شيء')).toHaveCount(0);
  });

  test('a tool opened again comes to the front with what it was opened for, not as a second copy', async ({ page }) => {
    await open(page, '/branches');
    await page.getByRole('button', { name: 'في المقارنة' }).first().click();
    const pick = page.getByRole('dialog');
    if (await pick.isVisible().catch(() => false)) await pick.getByRole('button').first().click();
    await expect(page).toHaveURL(/\/compare/);
    await page.getByRole('button', { name: 'افتح في متشابهات القرآن' }).first().click();
    await expect(page).toHaveURL(/\/branches/);
    // One trees page, brought to the front: going back leaves the trees, it does not land on another copy of them.
    await expect(page.getByRole('button', { name: 'في المقارنة' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'رجوع' }).last().click();
    await expect(page).not.toHaveURL(/\/branches/);
  });

  test('the saved list opened straight away goes home by its arrow', async ({ page }) => {
    await open(page, '/library');
    await page.getByRole('button', { name: 'رجوع' }).last().click();
    await expect(page).toHaveURL(/\/$/);
  });
});
