import { expect, open, tab, test } from './fixtures';

// The sira stories (owner, 2026-11-18): from the tarajim tab, «قصص السيرة» by tag, and a story whole as the source tells
// it, in moments, with the ayat recited in full in the mushaf's lines and the source's other reports folded
// (shared/data/events/stories.json).
test('the tarajim tab lists the sira stories, and Utbah\'s opens whole with Fussilat 1-13 and the other reports folded', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'التراجم').click();
  await page.getByRole('link', { name: 'قصص السيرة' }).click();
  await expect(page.getByRole('heading', { name: 'قصص السيرة' })).toBeVisible();
  // A tag narrows the list.
  await page.getByRole('button', { name: 'إسلامهم' }).click();
  await expect(page.getByRole('link', { name: 'عتبة بن ربيعة يعرض على النبي ﷺ' })).toHaveCount(0);
  await page.getByRole('button', { name: 'إسلامهم' }).click();
  await page.getByRole('link', { name: 'عتبة بن ربيعة يعرض على النبي ﷺ' }).click();
  await expect(page).toHaveURL(/\/story\?slug=utbah-offers-and-hears-fussilat$/);
  await expect(page.getByRole('heading', { name: 'عتبة بن ربيعة يعرض على النبي ﷺ' })).toBeVisible();
  await expect(page.getByText('عن جابر بن عبد الله', { exact: false })).toBeVisible();
  await expect(page.getByText('فأمسك عتبة على فيه', { exact: false })).toBeVisible();
  // The ayat he recited show at first, and fold.
  const ayat = page.getByRole('button', { name: /^ما قرأه في رواية جابر: / });
  await expect(ayat).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('وفي رواية محمد بن كعب القرظي', { exact: false })).toBeVisible();
  // The other reports are folded, and open whole.
  await expect(page.getByText('لما أسلم حمزة', { exact: false })).toHaveCount(0);
  await page.getByRole('button', { name: 'روايات أخرى في الكتاب' }).click();
  await expect(page.getByText('لما أسلم حمزة', { exact: false })).toBeVisible();
});

// Owner, 2026-11-21: a story whose speakers a book names is drawn as a conversation («الرسم»), each saying in its
// speaker's bubble, whose ring shows his name; «النص» is the source's text as printed, chain first.
test('Dimad\'s story is drawn by speaker, and «النص» shows it as Muslim prints it', async ({ page }) => {
  await open(page, '/story?slug=islam-of-dimad');
  await expect(page.getByRole('tab', { name: 'الرسم' })).toHaveAttribute('aria-selected', 'true');
  // The chain is folded under «السند»; the lead-in sits outside the bubble, the saying inside.
  await expect(page.getByText('حَدَّثَنَا إِسْحَاقُ', { exact: false })).toHaveCount(0);
  await expect(page.getByText('هَاتِ يَدَكَ أُبَايِعْكَ عَلَى الْإِسْلَامِ.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'صاحب السرية' }).first().click();
  await expect(page.getByText('صاحب السرية', { exact: true }).last()).toBeVisible();
  await page.getByRole('tab', { name: 'النص' }).click();
  await expect(page.getByText('حَدَّثَنَا إِسْحَاقُ', { exact: false })).toBeVisible();
  await expect(page.getByText('هَاتِ يَدَكَ أُبَايِعْكَ عَلَى الْإِسْلَامِ.', { exact: true })).toHaveCount(0);
});
