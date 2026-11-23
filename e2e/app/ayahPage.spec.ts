import { expect, open, test } from './fixtures';

// The ayah page's «كلماتها» (owner, 2026-11-23, sketch quran-design/ayah-page design أ): each word Ibn Qutaybah explains
// is a chip with his short meaning, and the picked chip's whole entry shows under them, his name first.
test('a word chip on the ayah page shows Ibn Qutaybah\'s whole entry on that word', async ({ page }) => {
  await open(page, '/ayah?key=2:255');
  const chips = page.getByRole('tab', { name: /عند ابن قتيبة$/ });
  await expect(chips.first()).toHaveAttribute('aria-selected', 'true');
  const second = chips.filter({ hasText: 'لا يُثقله' });
  await second.scrollIntoViewIfNeeded();
  await second.click();
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText(/آدَهُ الشيءُ/)).toBeVisible();
});
