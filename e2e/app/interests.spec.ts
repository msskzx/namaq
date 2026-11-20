import { expect, open, test } from './fixtures';

const stored = (page: import('@playwright/test').Page, key: string) => page.evaluate(name => localStorage.getItem(name), key);

test.describe('the first open', () => {
  test.use({ seed: { 'interests-asked': null } });

  test('asks what to learn, keeps the picks and never asks again', async ({ page }) => {
    await open(page, '/');
    await expect(page.getByRole('heading', { name: 'ماذا تحب أن تتعلّم؟' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ابدأ بالكل', exact: true })).toBeVisible();
    // The picker under the row (the feed behind the sheet has its own buttons).
    await page.getByRole('button', { name: 'التفسير', exact: true }).last().click();
    await page.getByRole('button', { name: 'الحديث', exact: true }).click();
    await page.getByRole('button', { name: 'ابدأ', exact: true }).click();
    expect(JSON.parse((await stored(page, 'interests'))!)).toEqual(['tafsir', 'hadith']);
    expect(await stored(page, 'interests-asked')).toBe('1');
    // The chips over the feed: «لك» and the two picked.
    await expect(page.getByRole('radio', { name: 'لك', exact: true })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'التفسير', exact: true })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'البلاغة', exact: true })).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole('radio', { name: 'لك', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ماذا تحب أن تتعلّم؟' })).toHaveCount(0);
  });
});

test.describe('with balagha and the sira picked', () => {
  test.use({ seed: { interests: '["balagha","sira"]', 'interests-surprise': '0' } });

  test('a chip shows that interest\'s cards alone, and «لك» brings the mix back', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('radio', { name: 'البلاغة', exact: true }).click();
    await expect(page.getByRole('radio', { name: 'البلاغة', exact: true })).toBeChecked();
    await expect(page.getByRole('heading', { name: 'جزء اليوم', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'احفظ البطاقة' }).first()).toBeAttached();
    await page.getByRole('radio', { name: 'لك', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'جزء اليوم', exact: true })).toBeAttached();
  });

  test('the buttons under a card save it and take an interest out, with undo', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('radio', { name: 'البلاغة', exact: true }).click();
    const save = page.getByRole('button', { name: 'احفظ البطاقة' }).first();
    await save.scrollIntoViewIfNeeded();
    await save.click();
    const bookmarks = await stored(page, 'bookmarks');
    expect(bookmarks).toContain('card:');
    await page.getByRole('radio', { name: 'لك', exact: true }).click();
    const more = page.getByRole('button', { name: 'خيارات البطاقة' }).first();
    await more.scrollIntoViewIfNeeded();
    await more.click();
    const notMine = page.getByRole('button', { name: /ليس من اهتماماتي$/ });
    const name = (await notMine.getAttribute('aria-label'))!.match(/«(.+)»/)![1];
    await notMine.click();
    await expect(page.getByText(`أُزيل «${name}» من اهتماماتك`).first()).toBeVisible();
    await page.getByRole('button', { name: 'تراجع', exact: true }).first().click();
    await expect(page.getByText(`أُزيل «${name}» من اهتماماتك`)).toHaveCount(0);
  });

  test('settings show what is picked and change it', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'الإعدادات' }).click();
    const row = page.getByRole('button', { name: 'اهتماماتي: البلاغة، السيرة والمغازي' });
    await row.scrollIntoViewIfNeeded();
    await row.click();
    // The picker under the row (the feed behind the sheet has its own buttons).
    await page.getByRole('button', { name: 'التفسير', exact: true }).last().click();
    expect(JSON.parse((await stored(page, 'interests'))!)).toEqual(['tafsir', 'balagha', 'sira']);
  });
});
