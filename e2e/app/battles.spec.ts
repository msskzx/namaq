import { expect, open, tab, test } from './fixtures';

// The battles (owner, 2026-11-18): from the tarajim tab, a battle's page with its place on a still map, its numbers,
// its moments in the source's words and the people there (shared/data/battles/battles.json).
test('the tarajim tab lists the battles, and Badr opens with its map, numbers, moments and people', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'التراجم').click();
  await page.getByRole('link', { name: 'الغزوات والمعارك' }).click();
  await expect(page.getByLabel('ابحث في الغزوات والمعارك')).toBeVisible();
  await page.getByRole('link', { name: 'غزوة بدر', exact: true }).click();
  await expect(page).toHaveURL(/\/battle\?slug=badr$/);
  await expect(page.getByRole('heading', { name: 'غزوة بدر', exact: true })).toBeVisible();
  await expect(page.getByText('غزوة · السنة ٢ للهجرة').filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'خريطة: بدر' })).toBeVisible();
  await expect(page.getByLabel(/^في الميدان: المسلمون ٣١٣، ٩٥٠/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'مجرى الغزوة' })).toBeVisible();
  await expect(page.getByText('هذا جبريل آخذ برأس فرسه، عليه أداة الحرب', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'من استشهد يومئذ' })).toBeVisible();
  // A section's reference opens to the quote it stands on.
  await page.getByRole('button', { name: 'سير أعلام النبلاء، السيرة ١، ص ٣٢٥' }).click();
  await expect(page.getByText(/ثلاثمائة وثلاثة عشر رجلا/)).toBeVisible();
});

// The search in the top bar (owner, 2026-11-23) keeps the battles whose name or place holds the typed words, and says so when none does.
test('the battles search keeps the matching battles', async ({ page }) => {
  await open(page, '/battles');
  const search = page.getByLabel('ابحث في الغزوات والمعارك');
  await search.fill('احد');
  await expect(page.getByRole('link', { name: 'غزوة أحد', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'غزوة بدر', exact: true })).toHaveCount(0);
  await search.fill('لا شيء بهذا الاسم');
  await expect(page.getByText('لا غزوة ولا معركة بهذا الاسم')).toBeVisible();
});
