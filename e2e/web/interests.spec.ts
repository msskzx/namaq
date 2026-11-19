import { expect, hasDatabase, test } from './fixtures';

const stored = (page: import('@playwright/test').Page, key: string) => page.evaluate(name => localStorage.getItem(name), key);

test.describe('interests on the website', () => {
  test.skip(!hasDatabase, 'needs DATABASE_URL or .env (see e2e/README.md)');

  test('the first open asks what to learn once, and the chips over the feed show the picks', async ({ page }) => {
    await page.addInitScript(() => {
      if (sessionStorage.getItem('e2e-ask')) return;
      sessionStorage.setItem('e2e-ask', '1');
      localStorage.removeItem('interests-asked');
    });
    await page.goto('/');
    const sheet = page.getByRole('dialog', { name: 'ماذا تحب أن تتعلّم؟' });
    await expect(sheet).toBeVisible({ timeout: 30_000 });
    await expect(sheet.getByRole('button', { name: 'ابدأ بالكل' })).toBeVisible();
    await sheet.getByRole('button', { name: 'التفسير', exact: true }).click();
    await sheet.getByRole('button', { name: 'المتشابه اللفظي', exact: true }).click();
    await sheet.getByRole('button', { name: 'ابدأ', exact: true }).click();
    expect(JSON.parse((await stored(page, 'interests'))!)).toEqual(['mutashabih', 'tafsir']);
    expect(await stored(page, 'interests-asked')).toBe('1');
    const chips = page.getByRole('radiogroup', { name: 'اهتماماتي' });
    await expect(chips.getByRole('radio', { name: 'لك' })).toBeChecked();
    await expect(chips.getByRole('radio', { name: 'التفسير' })).toBeVisible();
    await expect(chips.getByRole('radio', { name: 'البلاغة' })).toHaveCount(0);
    await page.reload();
    // Once the feed has drawn, the page has had its chance to ask again.
    await expect(page.getByRole('link', { name: 'افتحها في المقارنة' }).first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole('dialog', { name: 'ماذا تحب أن تتعلّم؟' })).toBeHidden();
  });

  test('a chip shows one interest alone, and the pencil changes the picks', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('interests', '["mutashabih","tafsir"]'));
    await page.goto('/');
    const chips = page.getByRole('radiogroup', { name: 'اهتماماتي' });
    await expect(page.getByRole('link', { name: 'افتحها في المقارنة' }).first()).toBeVisible({ timeout: 30_000 });
    // The tafsir alone: its questions, and no compare cards (those are the mutashabih's).
    await chips.getByRole('radio', { name: 'التفسير' }).click();
    await expect(chips.getByRole('radio', { name: 'التفسير' })).toBeChecked();
    await expect(page.getByRole('heading', { name: 'لأي آية هذا التفسير؟' }).first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole('link', { name: 'افتحها في المقارنة' })).toHaveCount(0);
    await page.getByRole('button', { name: 'عدّل اهتماماتي' }).click();
    const sheet = page.getByRole('dialog', { name: 'اهتماماتي' });
    await sheet.getByRole('button', { name: 'البلاغة', exact: true }).click();
    await sheet.getByRole('button', { name: 'تم' }).click();
    expect(JSON.parse((await stored(page, 'interests'))!)).toEqual(['mutashabih', 'tafsir', 'balagha']);
    await expect(chips.getByRole('radio', { name: 'البلاغة' })).toBeVisible();
  });

  test('settings show what is picked and change it', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'الإعدادات' }).first().click();
    await page.getByRole('button', { name: 'اهتماماتي: الكل' }).click();
    await page.getByRole('dialog', { name: 'الإعدادات' }).getByRole('button', { name: 'الحديث', exact: true }).click();
    expect(JSON.parse((await stored(page, 'interests'))!)).toEqual(['hadith']);
  });
});
