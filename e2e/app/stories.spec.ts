import { expect, open, tab, test } from './fixtures';
import stories from '../../shared/data/events/stories.json';
import { narratorOf, type AppStory } from '../../shared/stories/story';

// The sira stories (owner, 2026-11-18): from the tarajim tab, «قصص السيرة» by tag, and a story whole as the source tells
// it, in moments, with the ayat recited in full in the mushaf's lines and the source's other reports folded
// (shared/data/events/stories.json).
test('the tarajim tab lists the sira stories, and Utbah\'s opens whole with Fussilat 1-13 and the other reports folded', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'التراجم').click();
  await page.getByRole('link', { name: 'قصص السيرة' }).click();
  await expect(page.getByRole('heading', { name: 'قصص السيرة' })).toBeVisible();
  // The first year page is «قبل الهجرة», on al-Bukhari's chapters (owner, 2026-11-23); a tag narrows every year.
  await page.getByRole('button', { name: 'إسلامهم' }).click();
  await expect(page.getByRole('button', { name: 'أذى المشركين بمكة' })).toHaveCount(0);
  await page.getByRole('button', { name: 'إسلامهم' }).click();
  await page.getByRole('button', { name: 'أذى المشركين بمكة' }).first().click();
  await page.getByRole('link', { name: 'عتبة بن ربيعة يعرض على النبي ﷺ' }).first().click();
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
// speaker's bubble in his colour, with no name ring beside it (owner, 2026-11-22); «النص» is the source's text as printed, chain first.
test('Dimad\'s story is drawn by speaker, and «النص» shows it as Muslim prints it', async ({ page }) => {
  const report = (stories as AppStory[]).find(story => story.slug === 'islam-of-dimad')!.reports[0];
  const chain = report.isnad!.slice(0, 30);
  const saying = report.moments.flatMap(moment => moment.turns ?? []).find(turn => turn.speaker?.name === 'ضماد')!.text;
  await open(page, '/story?slug=islam-of-dimad');
  await expect(page.getByRole('tab', { name: 'الرسم' })).toHaveAttribute('aria-selected', 'true');
  // The chain is one line, its last link; the saying stands alone in its bubble, its lead-in outside it.
  await expect(page.getByText(chain, { exact: false })).toHaveCount(0);
  await expect(page.getByText(saying, { exact: true })).toBeVisible();
  // No name ring to tap beside a bubble: the chips are the key, and they are not buttons.
  await expect(page.getByRole('button', { name: 'ضماد', exact: true })).toHaveCount(0);
  await page.getByRole('tab', { name: 'النص', exact: true }).click();
  // The whole chain opens from its last link (owner, 2026-11-23).
  await expect(page.getByText(chain, { exact: false })).toHaveCount(0);
  await page.getByRole('button', { name: `${narratorOf(report.isnad!)}، السند كاملا` }).click();
  await expect(page.getByText(chain, { exact: false })).toBeVisible();
  await expect(page.getByText(saying, { exact: true })).toHaveCount(0);
});

// Owner, 2026-11-21: a drawn story is shared as several pictures of one size (an Instagram post of several), not one tall
// image; the preview steps through them and the button saves them all.
test('a drawn story is shared as several pictures', async ({ page }) => {
  await open(page, '/story?slug=islam-of-dimad');
  await page.getByRole('button', { name: 'شارك إسلام ضماد الأزدي' }).click();
  const pictures = page.getByRole('tab', { name: /^الصورة / });
  await expect(pictures.first()).toBeVisible({ timeout: 20_000 });
  expect(await pictures.count()).toBeGreaterThan(1);
  await pictures.nth(1).click();
  await expect(pictures.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'احفظ الصور في الجهاز' })).toBeEnabled();
});
