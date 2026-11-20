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

  test('the save under a feed card keeps it, and the library draws the saved card whole', async ({ page }) => {
    await page.addInitScript(() => { localStorage.setItem('interests', '["hadith"]'); localStorage.setItem('interests-asked', '1'); });
    await page.goto('/');
    const save = page.getByRole('button', { name: 'احفظ البطاقة' }).first();
    await expect(save).toBeVisible({ timeout: 30_000 });
    const post = page.locator('article').filter({ has: save });
    const title = (await post.getByRole('heading').first().textContent())!;
    await save.click();
    expect(await stored(page, 'bookmarks')).toContain('card:');
    await page.goto('/library?tab=saved');
    const saved = page.getByRole('heading', { name: title, exact: true });
    await expect(saved).toBeVisible({ timeout: 30_000 });
    // Its save is lit there, and takes it off the list.
    await expect(page.getByRole('button', { name: 'أزلها من المحفوظات' }).first()).toBeVisible();
  });

  test('a card opens its item first in its row, and its source line under the buttons opens a sheet', async ({ page }) => {
    // Owner, 2026-11-20 (sketch reference-place/every-card-2-dark.png): like an Instagram post, as in the app.
    await page.addInitScript(() => { localStorage.setItem('interests', '["hadith"]'); localStorage.setItem('interests-asked', '1'); });
    await page.goto('/');
    const save = page.getByRole('button', { name: 'احفظ البطاقة' }).first();
    await expect(save).toBeVisible({ timeout: 30_000 });
    const post = page.locator('article').filter({ has: save }).first();
    const saved = (await save.boundingBox())!;
    // The row's buttons and links, right to left: the one that opens the hadith leads it.
    const row = (await Promise.all((await post.locator('[data-share-skip] :is(a, button)').all()).map(async item => ({ name: await item.getAttribute('aria-label'), box: await item.boundingBox() }))))
      .filter(item => item.box && Math.abs(item.box.y - saved.y) < 4).sort((a, b) => b.box!.x - a.box!.x);
    expect(row[0].name).toMatch(/^افتح /);
    const line = post.getByRole('button', { name: /^المصدر: / });
    expect((await line.boundingBox())!.y).toBeGreaterThan(saved.y);
    await line.click();
    const sheet = page.getByRole('dialog', { name: 'المصدر' });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('link').first()).toBeVisible();
  });
  test('«ليس من اهتماماتي» sits in the «⋯» alone at the far left, takes the interest out with a line in the card\'s place, and undo puts it back', async ({ page }) => {
    // Owner, 2026-11-20: as in the app; the website had no such button, and it moved into the «⋯» menu.
    await page.addInitScript(() => { localStorage.setItem('interests', '["mutashabih","hadith"]'); localStorage.setItem('interests-asked', '1'); });
    await page.goto('/');
    // Last in its row, at the far left, on a plain card and on the tree card (whose row is the branches page's own).
    const aloneAtLeft = async (post: import('@playwright/test').Locator, button: import('@playwright/test').Locator) => {
      await button.scrollIntoViewIfNeeded();
      const own = (await button.boundingBox())!;
      const row = await Promise.all((await post.locator('[data-share-skip] :is(a, button), :is(a, button)[aria-label]').all()).map(item => item.boundingBox()));
      const middle = (box: { y: number; height: number }) => box.y + box.height / 2;
      const others = row.filter(box => box && Math.abs(middle(box) - middle(own)) < 4 && Math.abs(box.x - own.x) > 1);
      expect(others.length).toBeGreaterThan(0);
      for (const box of others) expect(box!.x).toBeGreaterThanOrEqual(own.x + own.width);
    };
    const more = 'خيارات البطاقة';
    const treeLink = page.getByRole('link', { name: 'افتح الشجرة في متشابهات القرآن' });
    const post = page.locator('article').filter({ has: page.getByRole('link', { name: /^افتح / }), hasNot: treeLink }).filter({ has: page.getByRole('button', { name: more }) }).first();
    await expect(post).toBeVisible({ timeout: 30_000 });
    await aloneAtLeft(post, post.getByRole('button', { name: more }));
    const tree = page.locator('article').filter({ has: treeLink }).first();
    await expect(tree).toBeVisible({ timeout: 30_000 });
    await aloneAtLeft(tree, tree.getByRole('button', { name: more }));
    await tree.getByRole('button', { name: more }).click();
    await expect(tree.getByRole('menuitem', { name: '«المتشابه اللفظي» ليس من اهتماماتي' })).toBeVisible();
    await page.keyboard.press('Escape');
    // The card's place in the feed, to find it again after undo.
    const at = await post.evaluate(card => [...card.parentElement!.children].indexOf(card));
    const text = (await post.innerText()).slice(0, 80);
    await post.getByRole('button', { name: more }).click();
    await post.getByRole('menuitem', { name: '«الحديث» ليس من اهتماماتي' }).click();
    const line = page.getByText('أُزيل «الحديث» من اهتماماتك');
    await expect(line).toHaveCount(1);
    expect(JSON.parse((await stored(page, 'interests'))!)).toEqual(['mutashabih']);
    // The cards on screen stay; with one interest left, none offers to take it out, so no card has a «⋯».
    await expect(page.getByRole('button', { name: more })).toHaveCount(0);
    await page.getByRole('button', { name: 'تراجع' }).click();
    await expect(line).toHaveCount(0);
    expect(JSON.parse((await stored(page, 'interests'))!)).toEqual(['mutashabih', 'hadith']);
    const back = page.getByRole('region', { name: 'للتأمل اليوم' }).locator(':scope > *').nth(at);
    expect((await back.innerText()).slice(0, 80)).toBe(text);
  });

  test('the saved card in the library has no «ليس من اهتماماتي»', async ({ page }) => {
    await page.addInitScript(() => { localStorage.setItem('interests', '["mutashabih","hadith"]'); localStorage.setItem('interests-asked', '1'); });
    await page.goto('/');
    const save = page.getByRole('button', { name: 'احفظ البطاقة' }).first();
    await expect(save).toBeVisible({ timeout: 30_000 });
    await save.click();
    await page.goto('/library?tab=saved');
    await expect(page.getByRole('button', { name: 'أزلها من المحفوظات' }).first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole('button', { name: 'خيارات البطاقة' })).toHaveCount(0);
  });
});
