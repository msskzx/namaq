import { expect, open, tab, test } from './fixtures';

// The hadith tab (owner, 2026-11-18): the hadith of Jibril in al-Bukhari and in Muslim, as the website shows them
// (shared/data/hadith/units.json, written from src/lib/model/hadithView.ts).
test('the hadith tab lists the two hadith, and one opens with its isnad and its scenes, or its whole text', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'الحديث').click();
  await expect(page.getByRole('heading', { name: 'الحديث', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /^صحيح مسلم،/ })).toBeVisible();
  await page.getByRole('link', { name: /^صحيح البخاري،/ }).click();
  await expect(page).toHaveURL(/\/hadith-unit\?unit=bukhari-jibril/);
  await expect(page.getByLabel(/^الإسناد: البخاري، مُسَدَّدٌ/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'المشهد ١' })).toBeVisible();
  await expect(page.getByText('هَذَا جِبْرِيلُ جَاءَ يُعَلِّمُ النَّاسَ دِينَهُمْ').first()).toBeAttached();
  await page.getByRole('tab', { name: 'النص كاملًا' }).click();
  await expect(page.getByRole('heading', { name: 'المشهد ١' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'تعليق المصنف' })).toBeVisible();

  // Where else the same event is: Muslim's hadith opens over it, and back comes back.
  await page.getByRole('button', { name: 'اقرأ الحديث في صحيح مسلم' }).click();
  await expect(page).toHaveURL(/unit=muslim-jibril/);
  await expect(page.getByLabel(/^الإسناد: مسلم/)).toBeVisible();
  await page.getByRole('button', { name: 'رجوع' }).last().click();
  await expect(page).toHaveURL(/unit=bukhari-jibril/);
  // The hadith button tapped on a hadith goes back to the list.
  await tab(page, 'الحديث').click();
  await expect(page).toHaveURL(/\/hadith$/);
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
  const names = await page.getByRole('tab').evaluateAll(tabs => tabs.map(item => item.getAttribute('aria-label')));
  expect(names).toEqual(['القرآن', 'الحديث', 'الرئيسية', 'التراجم', 'الاختبارات']);
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
