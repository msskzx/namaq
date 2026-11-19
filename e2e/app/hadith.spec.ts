import { expect, open, tab, test } from './fixtures';

// The hadith tab (owner, 2026-11-18): al-Nawawi's Forty, each opening with his text and the Sahihayn records he names
// (shared/data/hadith/forty.json, written by scripts/hadith/buildForty.ts); no. 2 opens the Jibril pages with their scenes.
test('the hadith tab lists the Forty, and one opens with its chain drawn or its whole text', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'الحديث').click();
  await expect(page.getByRole('heading', { name: 'الحديث', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'الحديث الأول، عن عمر بن الخطاب' })).toBeVisible();
  await page.getByRole('link', { name: 'الحديث الخامس عشر، عن أبي هريرة' }).click();
  await expect(page).toHaveURL(/\/hadith-forty\?n=15/);
  await expect(page.getByRole('heading', { name: 'في صحيح البخاري' })).toBeVisible();
  // «من أخرجه» (owner, 2026-11-19): each book with its number, al-Nawawi's own marked.
  await expect(page.getByLabel('البخاري ٦٠١٨، سمّاه النووي؛ مسلم ٤٧، سمّاه النووي')).toBeVisible();
  await expect(page.getByLabel(/^الإسناد: البخاري، قُتَيْبَةُ/)).toBeVisible();
  await page.getByRole('tab', { name: 'النص كاملًا' }).click();
  await expect(page.getByLabel(/^الإسناد: البخاري/)).toHaveCount(0);
  await expect(page.getByText(/^٦٠١٨ - /)).toBeVisible();
  // The hadith button tapped on a hadith goes back to the list.
  await tab(page, 'الحديث').click();
  await expect(page).toHaveURL(/\/hadith$/);
});

test('the hadith of Jibril opens its scenes in al-Bukhari and in Muslim', async ({ page }) => {
  await open(page, '/hadith-forty?n=2');
  await page.getByRole('button', { name: 'رواية أبي هريرة في البخاري' }).click();
  await expect(page).toHaveURL(/\/hadith-unit\?unit=bukhari-jibril/);
  await expect(page.getByLabel(/^الإسناد: البخاري، مُسَدَّدٌ/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'المشهد ١' })).toBeVisible();
  await page.getByRole('tab', { name: 'النص كاملًا' }).click();
  await expect(page.getByRole('heading', { name: 'المشهد ١' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'تعليق المصنف' })).toBeVisible();
  // Where else the same event is: Muslim's hadith opens over it, and back comes back.
  await page.getByRole('button', { name: 'اقرأ الحديث في صحيح مسلم' }).click();
  await expect(page).toHaveURL(/unit=muslim-jibril/);
  await expect(page.getByLabel(/^الإسناد: مسلم/)).toBeVisible();
  await page.getByRole('button', { name: 'رجوع' }).last().click();
  await expect(page).toHaveURL(/unit=bukhari-jibril/);
});

test('the library opens from home and goes back to it', async ({ page }) => {
  await open(page, '/');
  await page.getByRole('button', { name: 'المكتبة', exact: true }).click();
  await expect(page).toHaveURL(/\/books/);
  await page.getByRole('button', { name: 'رجوع' }).click();
  await expect(page.getByRole('button', { name: 'مدونتي', exact: true })).toBeVisible();
});

test('the bar is Quran, hadith, home, tarajim and quizzes, and the mushaf opens from the Quran hub with the Quran button lit', async ({ page }) => {
  await open(page, '/');
  // Polled: under a full run the bar may not have drawn all its tabs when the page first answers.
  await expect.poll(() => page.getByRole('tab').evaluateAll(tabs => tabs.map(item => item.getAttribute('aria-label'))))
    .toEqual(['القرآن', 'الحديث', 'الرئيسية', 'التراجم', 'الاختبارات']);
  await tab(page, 'التراجم').click();
  await expect(page.getByRole('heading', { name: 'التراجم', exact: true })).toBeVisible();
  await tab(page, 'القرآن').click();
  await page.getByRole('link', { name: 'المصحف', exact: true }).click();
  await expect(page).toHaveURL(/\/read/);
  await expect(tab(page, 'القرآن')).toHaveAttribute('aria-selected', 'true');
  // With a tool left open under the Quran button, the button on the mushaf still goes to the hub.
  await tab(page, 'القرآن').click();
  await page.getByRole('link', { name: 'الأقسام', exact: true }).click();
  await expect(page).toHaveURL(/\/oaths/);
  await tab(page, 'الرئيسية').click();
  await page.getByRole('button', { name: 'اقرأ', exact: true }).first().click();
  await expect(page).toHaveURL(/\/read/);
  // A tap on the page brings the bars back.
  await expect(async () => {
    await page.mouse.click(195, 400);
    await expect(tab(page, 'القرآن')).toBeInViewport({ timeout: 1500 });
  }).toPass({ timeout: 15_000 });
  await tab(page, 'القرآن').click();
  await expect(page).toHaveURL(/\/quran$/);
});
