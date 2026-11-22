import { expect, open, tab, test } from './fixtures';

// A tab's search sits in the top bar, never in the scrolling page, and the tab has no page title (owner, 2026-11-22:
// Hadith and Tarajim had the box under a big title).
for (const [name, field, typed, found] of [
  ['الحديث', 'ابحث في الصحيحين', 'إنما الأعمال', /كتاب الإمارة/],
  ['التراجم', 'ابحث في التراجم', 'الزبير', /^الزبير بن العوام/],
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
