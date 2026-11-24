import { expect, open, tab, test } from './fixtures';

// The hadith tab (owner, 2026-11-18): al-Nawawi's Forty, each opening with his text and the Sahihayn records he names
// (shared/data/hadith/forty.json, written by scripts/hadith/buildForty.ts); no. 2 opens the Jibril pages with their scenes.
test('the hadith tab lists the Forty, and one opens with its chain drawn or its whole text', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'الحديث').click();
  await expect(page.getByRole('textbox', { name: 'ابحث في الصحيحين' }).filter({ visible: true })).toBeVisible();
  // The tab lists the books (the hadith tab redesign); the Forty is one of them.
  await page.getByRole('link', { name: 'الأربعون النووية', exact: true }).click();
  await expect(page.getByRole('link', { name: 'الحديث الأول، عن عمر بن الخطاب' })).toBeVisible();
  await page.getByRole('link', { name: 'الحديث الخامس عشر، عن أبي هريرة' }).click();
  await expect(page).toHaveURL(/\/hadith-forty\?n=15/);
  await expect(page.getByRole('heading', { name: 'في صحيح البخاري' })).toBeVisible();
  // «من أخرجه» (owner, 2026-11-19): each book with its number, al-Nawawi's own marked.
  await expect(page.getByLabel('البخاري ٦٠١٨، سمّاه النووي؛ مسلم ٤٧، سمّاه النووي')).toBeVisible();
  await expect(page.getByLabel(/^الإسناد: البخاري، قُتَيْبَةُ/)).toBeVisible();
  await page.getByRole('tab', { name: 'النص', exact: true }).click();
  await expect(page.getByLabel(/^الإسناد: البخاري/)).toHaveCount(0);
  await expect(page.getByText(/^٦٠١٨ - /)).toBeVisible();
  // The hadith button tapped on a hadith goes back to the list it was opened from.
  await tab(page, 'الحديث').click();
  await expect(page).toHaveURL(/\/hadith-book\?book=forty$/);
});

// Ibn Rajab's eight (Jami' al-'Ulum wal-Hikam, chapters 43–50) under the Forty: his text, and the books he names marked as his.
test('the eight hadith Ibn Rajab added added hadith are a book of their own, each opening on his text and the books he names', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'الحديث').click();
  // His own name for them (Jami' 1/57), a book of its own beside al-Nawawi's (owner, 2026-11-21).
  await page.getByRole('link', { name: 'الأحاديث المزيدة على ما ذكره الشيخ', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'الأحاديث المزيدة على ما ذكره الشيخ', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /^الحديث الأول،/ })).toHaveCount(0);
  await page.getByRole('link', { name: /^الحديث السابع والأربعون، عن المقدام/ }).click();
  await expect(page).toHaveURL(/\/hadith-forty\?n=47/);
  await expect(page.getByLabel(/^الترمذي ٢٣٨٠، سمّاه ابن رجب؛/)).toBeVisible();
  await expect(page.getByText('سمّاه النووي')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'ما قاله العلماء في درجته' })).toBeVisible();
});

// Each Sahih's shape on the tab (owner, 2026-11-23: sketch hadith-design): one bar per kitab; a finger slid along it names
// the kitab under it, and lifting it opens that kitab, the first on the right.
test('sliding along al-Bukhari\'s bars names a kitab, and lifting the finger opens it', async ({ page }) => {
  await open(page, '/hadith');
  const strip = page.getByLabel('كتب صحيح البخاري، المس واسحب').filter({ visible: true });
  const box = (await strip.boundingBox())!;
  const y = box.y + box.height - 8;
  await page.mouse.move(box.x + box.width - 2, y);
  await page.mouse.down();
  await expect(page.getByText('بدء الوحي، ١–٧')).toBeVisible();
  for (let x = box.x + box.width - 2; x > box.x + box.width * 0.6; x -= 10) await page.mouse.move(x, y);
  await page.mouse.up();
  await expect(page).toHaveURL(/\/hadith-kitab\?book=bukhari&kitab=\d+/);
  expect(Number(new URL(page.url()).searchParams.get('kitab'))).toBeGreaterThan(1);
});

// A Sahih's page searches its kitabs and bab headings (owner, 2026-11-23): a kitab whose name holds the word alone, and
// under another kitab the headings that hold it.
test('a Sahih\'s page finds kitabs and bab headings by a word', async ({ page }) => {
  await open(page, '/hadith-book?book=bukhari');
  await page.getByRole('textbox', { name: 'ابحث في صحيح البخاري' }).filter({ visible: true }).fill('الحيض');
  await expect(page.getByRole('link', { name: 'كِتَابُ الْحَيْضِ', exact: true })).toBeVisible();
  await expect(page.getByText(/^بَابُ اعْتِزَالِ/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'بدء الوحي', exact: true })).toHaveCount(0);
});

test('the hadith of Jibril opens its scenes in al-Bukhari and in Muslim', async ({ page }) => {
  await open(page, '/hadith-forty?n=2');
  await page.getByRole('button', { name: 'رواية أبي هريرة في البخاري' }).click();
  await expect(page).toHaveURL(/\/hadith-unit\?unit=bukhari-jibril/);
  await expect(page.getByLabel(/^الإسناد: البخاري، مُسَدَّدٌ/)).toBeVisible();
  // The scenes are drawn with the speakers' chips, and no «المشهد ١» heading of ours (owner, 2026-11-22).
  await expect(page.getByText('رسول الله ﷺ', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/^المشهد /)).toHaveCount(0);
  await page.getByRole('tab', { name: 'النص', exact: true }).click();
  await expect(page.getByText('رسول الله ﷺ', { exact: true })).toHaveCount(0);
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
  await expect(page.getByRole('textbox', { name: 'ابحث في التراجم' }).filter({ visible: true })).toBeVisible();
  await tab(page, 'القرآن').click();
  await page.getByRole('link', { name: 'المصحف', exact: true }).click();
  await expect(page).toHaveURL(/\/read/);
  await expect(tab(page, 'القرآن')).toHaveAttribute('aria-selected', 'true');
  // With a tool left open under the Quran button, the button on the mushaf still goes to the hub.
  await tab(page, 'القرآن').click();
  await page.getByRole('link', { name: 'الأقسام', exact: true }).click();
  await expect(page).toHaveURL(/\/oaths/);
  await tab(page, 'الرئيسية').click();
  await page.getByRole('button', { name: /^افتح المصحف حيث توقفت/ }).first().click();
  await expect(page).toHaveURL(/\/read/);
  // A tap on the page brings the bars back.
  await expect(async () => {
    await page.mouse.click(195, 400);
    await expect(tab(page, 'القرآن')).toBeInViewport({ timeout: 1500 });
  }).toPass({ timeout: 15_000 });
  await tab(page, 'القرآن').click();
  await expect(page).toHaveURL(/\/quran$/);
});

test.describe('the «من أخرجه» card', () => {
  test.use({ seed: { bookmarks: [{ id: 'card:recorded:15', text: '', href: '', savedAt: Date.now() }] } });

  // Owner, 2026-11-19: the card draws the page's own view, and its head opens the hadith's page.
  test('a saved card draws the books and opens its hadith', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByLabel('البخاري ٦٠١٨، سمّاه النووي؛ مسلم ٤٧، سمّاه النووي')).toBeVisible();
    await page.getByRole('button', { name: 'افتح الحديث الخامس عشر' }).first().click();
    await expect(page).toHaveURL(/\/hadith-forty\?n=15/);
  });
});

test.describe('the «من الإسناد» card', () => {
  test.use({ seed: { bookmarks: [{ id: 'card:isnad:15', text: '', href: '', savedAt: Date.now() }] } });

  // Owner, 2026-11-19: al-Bukhari's chain drawn as on the hadith's page, and its head opens that page.
  test('a saved card draws al-Bukhari\'s chain and opens its hadith', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByLabel(/^الإسناد: البخاري، قُتَيْبَةُ/)).toBeVisible();
    await page.getByRole('button', { name: 'افتح الحديث الخامس عشر' }).first().click();
    await expect(page).toHaveURL(/\/hadith-forty\?n=15/);
  });
});

// Owner, 2026-11-24 (sketch hadith-design/sketch4): the line carries the narrators only; the Prophet ﷺ named before his
// words heads the saying, not the drawing.
test('a drawn chain names the narrators, and the Prophet ﷺ heads his words under it', async ({ page }) => {
  await open(page, '/hadith-forty?n=1');
  await expect(page.getByLabel(/^الإسناد: البخاري، عَبْدُ اللهِ بْنُ مَسْلَمَةَ، مَالِكٌ/).first()).toBeVisible();
  await expect(page.getByText('رَسُولَ اللهِ ﷺ قَالَ:').first()).toBeVisible();
});
