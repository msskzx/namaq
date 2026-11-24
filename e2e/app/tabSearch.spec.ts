import { expect, open, tab, test } from './fixtures';

// A tab's search sits in the top bar, never in the scrolling page, and the tab has no page title (owner, 2026-11-22:
// Hadith and Tarajim had the box under a big title).
for (const [name, field, typed, found] of [
  ['الحديث', 'ابحث في الصحيحين', 'إنما الأعمال', /كتاب الإمارة/],
  ['التراجم', 'ابحث في التراجم', 'الزبير', /^الزبير بن العوام/],
  ['القرآن', 'ابحث في علوم القرآن', 'يوسف', /^يُوسُفْ$/],
] as const) {
  test(`the ${name} tab searches from the top bar`, async ({ page }) => {
    await open(page, '/');
    await tab(page, name).click();
    const search = page.getByRole('textbox', { name: field }).filter({ visible: true });
    const scrolls = await search.evaluate(input => {
      for (let box = input.parentElement; box; box = box.parentElement) if (/auto|scroll/.test(getComputedStyle(box).overflowY)) return true;
      return false;
    });
    expect(scrolls).toBe(false);
    await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(0);
    await search.fill(typed);
    await expect(page.getByText(found).filter({ visible: true }).first()).toBeVisible();
  });
}

// The Quran tab's search finds its tools by name (owner, 2026-11-23: find a science without opening every page), the
// alif, hamza and ta marbuta forms forgiven, and the tools not named so leave the page.
test('the Quran tab finds a tool by its name', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'القرآن').click();
  await page.getByRole('textbox', { name: 'ابحث في علوم القرآن' }).filter({ visible: true }).fill('بلاغه');
  await expect(page.getByRole('link', { name: 'مصطلحات البلاغة' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'المصحف', exact: true })).toHaveCount(0);
  await page.getByRole('textbox', { name: 'ابحث في علوم القرآن' }).filter({ visible: true }).fill('الاقسام');
  await expect(page.getByRole('link', { name: 'الأقسام', exact: true })).toBeVisible();
});

// A page reached from a tab keeps its search in the top bar too (owner, 2026-11-23: «كل التراجم» had it in the page).
test('the list of all tarajim searches from the top bar', async ({ page }) => {
  await open(page, '/people');
  const search = page.getByRole('textbox', { name: 'ابحث في التراجم' }).filter({ visible: true });
  const scrolls = await search.evaluate(input => {
    for (let box = input.parentElement; box; box = box.parentElement) if (/auto|scroll/.test(getComputedStyle(box).overflowY)) return true;
    return false;
  });
  expect(scrolls).toBe(false);
  await search.fill('صفية');
  await expect(page.getByRole('link', { name: 'صفية بنت عبد المطلب', exact: true })).toBeVisible();
});

// The hadith tab's finds come in tabs (owner, 2026-11-24: a common word listed hundreds of bab headings, and the hadith
// found were drawn only after all of them, so none showed); the Forty are searched too. The test build has no Sahih
// downloaded, so the hadith list itself is checked by hand (npm run phone, after «نزّل الكتاب»).
test('the hadith tab lists its finds by kind, the Forty among them', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'الحديث').click();
  await page.getByRole('textbox', { name: 'ابحث في الصحيحين' }).filter({ visible: true }).fill('الأعمال');
  await page.getByRole('tab', { name: /^الأبواب/ }).click();
  await expect(page.getByRole('link', { name: /صحيح (البخاري|مسلم)/ }).first()).toBeVisible();
  await page.getByRole('tab', { name: /^الأربعون/ }).click();
  await page.getByRole('link', { name: 'الحديث الأول، عن عمر بن الخطاب' }).click();
  await expect(page).toHaveURL(/\/hadith-forty\?n=1$/);
});

// Every list page searches from the top bar, its placeholder naming the page (owner, 2026-11-23), and keeps only what
// holds the words typed (owner, 2026-11-24: these pages had no search, and the stories' opened the app's search).
for (const [route, field, typed, found, gone] of [
  ['/hadith-book?book=forty', 'ابحث في الأربعين النووية', 'الأعمال', 'الحديث الأول', 'الحديث الثاني'],
  ['/hadith-kitab?book=bukhari&kitab=2', 'ابحث في كِتَابُ الْإِيمَانِ', 'الحياء', 'بَابٌ: الْحَيَاءُ مِنَ الْإِيمَانِ', 'بَابٌ: الصَّلَاةُ مِنَ الْإِيمَانِ'],
  ['/books', 'ابحث في المكتبة', 'الإتقان', 'الإتقان في علوم القرآن', 'تحفة الأطفال'],
  ['/order', 'ابحث في ترتيب السور', 'الكهف', 'الكَهْفْ', 'البَقَرَةْ'],
  ['/stories', 'ابحث في قصص السيرة', 'الهجرة', 'هجرة إلى المدينة', 'عتبة بن ربيعة يعرض على النبي ﷺ'],
] as const) {
  test(`${route} searches its list from the top bar`, async ({ page }) => {
    await open(page, route);
    const search = page.getByRole('textbox', { name: field }).filter({ visible: true });
    await search.fill(typed);
    await expect(page.getByText(found, { exact: true }).filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText(gone, { exact: true }).filter({ visible: true })).toHaveCount(0);
  });
}
