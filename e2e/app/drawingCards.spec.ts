import { closeSource, expect, open, openSource, test, type Seed } from './fixtures';
import { SURAH_NAMES } from '../../shared/quran/surahNames';

// Owner, 2026-11-20 (sketch layout-cleanup panel 6): home draws the drawings built for their pages, each card the page's own
// component, its open button opening that page at the item. Each card is saved, so the library draws it whatever the day.
const saved = (kind: string, item: string): Seed => ({ bookmarks: [{ id: `card:${kind}:${item}`, text: '', href: '', savedAt: Date.now() }] });

test.describe('«نسبه»', () => {
  test.use({ seed: saved('nasab', 'az-zubayr-ibn-al-awwam') });
  // Owner, 2026-11-22: the nasab tree never folds; every father is drawn.
  test('draws every father of the nasab, none folded, and opens the nasab page', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByText('قصي', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /^أظهر / })).toHaveCount(0);
    await page.getByRole('button', { name: 'افتح نسب الزبير بن العوام' }).click();
    await expect(page).toHaveURL(/\/nasab\?slug=az-zubayr-ibn-al-awwam/);
  });
});

test.describe('«صلاته»', () => {
  test.use({ seed: saved('ties', 'az-zubayr-ibn-al-awwam') });
  test('draws the ties ring, a person on it opens his page, and the card opens the ties page', async ({ page }) => {
    await open(page, '/library');
    await page.getByRole('link', { name: /^أمه: / }).click();
    await expect(page).toHaveURL(/\/person\?slug=/);
    await page.goBack();
    await page.getByRole('button', { name: 'افتح صلاته: الزبير بن العوام' }).click();
    await expect(page).toHaveURL(/\/ties\?slug=az-zubayr-ibn-al-awwam/);
  });
});

test.describe('a battle', () => {
  test.use({ seed: saved('battle', 'uhud') });
  test('draws its map and the two sides\' numbers, and opens its page', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByLabel('خريطة: أحد')).toBeVisible();
    await expect(page.getByLabel(/^في الميدان: المسلمون ٧٠٠، ٣٠٠٠/)).toBeAttached();
    await page.getByRole('button', { name: 'افتح غزوة أحد' }).click();
    await expect(page).toHaveURL(/\/battle\?slug=uhud/);
  });
});

test.describe('a fitna battle', () => {
  test.use({ seed: saved('battle', 'jamal') });
  // Owner, 2026-11-18/19: only its name, year, place and people.
  test('draws its place and no numbers', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByLabel('خريطة: البصرة')).toBeVisible();
    await expect(page.getByLabel(/^في الميدان: /)).toHaveCount(0);
  });
});

test.describe('a hadith\'s scene', () => {
  test.use({ seed: saved('hadith-scene', 'muslim-jibril-2') });
  test('draws the scene as a chat and opens the hadith', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByText('رَجُلٌ', { exact: true }).first()).toBeVisible();
    await page.getByRole('button', { name: 'افتح الحديث في صحيح مسلم' }).click();
    await expect(page).toHaveURL(/\/hadith-unit\?unit=muslim-jibril/);
  });
});

test.describe('«فواتح السور»', () => {
  test.use({ seed: saved('opening', 'hamd') });
  test('draws the card of openings, a surah opens the mushaf, and the card opens the openings page at it', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByRole('link', { name: `افتح ${SURAH_NAMES[18]} في المصحف` })).toBeVisible();
    await page.getByRole('button', { name: 'افتح «الحمد لله» في فواتح السور' }).click();
    await expect(page).toHaveURL(/\/openings\?at=hamd/);
    await expect(page.getByRole('link', { name: `افتح ${SURAH_NAMES[34]} في المصحف` })).toBeInViewport();
  });
});

test.describe('«الأقسام»', () => {
  test.use({ seed: saved('oath', '51:1') });
  test('draws the oath and opens the oaths page at it', async ({ page }) => {
    await open(page, '/library');
    const place = `${SURAH_NAMES[51]} ١–٤`;
    await expect(page.getByRole('heading', { name: 'من الأقسام' })).toBeVisible();
    await page.getByRole('button', { name: `افتح ${place} في الأقسام` }).click();
    await expect(page).toHaveURL(/\/oaths\?at=51%3A1|\/oaths\?at=51:1/);
    await expect(page.getByRole('heading', { name: place, exact: true })).toBeInViewport();
  });
});

test.describe('a prophet\'s event', () => {
  test.use({ seed: saved('event', 'musa-0') });
  test('draws the event\'s places and opens the story at it', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByRole('heading', { name: 'أم موسى والتابوت في اليم' })).toBeVisible();
    await page.getByRole('button', { name: 'افتح أم موسى والتابوت في اليم في القصة' }).click();
    await expect(page).toHaveURL(/\/prophets\/musa\?event=0/);
  });
});

// Owner, 2026-11-21 (sketch feed-visuals panels 1-3, 7-9): the people drawings.
test.describe('the Prophet\'s ﷺ children as a ring', () => {
  test.use({ seed: saved('ring', 'kin:prophet-muhammad:child') });
  // Owner, 2026-11-22: al-Tayyib and al-Tahir are off the drawing, and Ibn al-Qayyim's words on them are in the references,
  // so the card keeps the home layout.
  test('keeps al-Tayyib and al-Tahir off the card with Ibn al-Qayyim\'s words in its references, a daughter opens her page, and the card opens his ties', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByRole('button', { name: /على خلاف/ })).toHaveCount(0);
    await openSource(page);
    await expect(page.getByText(/الطيب والطاهر/)).toBeVisible();
    await closeSource(page);
    await page.getByRole('link', { name: 'فاطمة بنت محمد' }).click();
    await expect(page).toHaveURL(/\/person\?slug=fatimah-bint-muhammad/);
    await page.goBack();
    await page.getByRole('button', { name: /^افتح صلات محمد/ }).click();
    await expect(page).toHaveURL(/\/ties\?slug=prophet-muhammad/);
  });
});

test.describe('a hadith ring', () => {
  test.use({ seed: saved('ring', 'hadith:muslim-2417') });
  test('quotes the Prophet ﷺ over the people the hadith names, and opens the hadith', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByText(/اسْكُنْ\. حِرَاءُ/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'سعد بن أبي وقاص' })).toBeVisible();
    await page.getByRole('button', { name: 'افتح الحديث' }).click();
    await expect(page).toHaveURL(/hadith-sahih/);
  });
});

test.describe('«أصهاره»', () => {
  test.use({ seed: saved('group', 'inlaws:prophet-muhammad') });
  test('draws his wives and their fathers, says it in words, and opens «بينه وبين…» with them', async ({ page }) => {
    await open(page, '/library');
    await page.getByRole('tab', { name: 'النص' }).click();
    await expect(page.getByText(/حفصة/).first()).toBeVisible();
    await page.getByRole('button', { name: 'ارسم الصلة بينهم' }).click();
    await expect(page).toHaveURL(/\/between\?slugs=prophet-muhammad(,|%2C)/);
  });
});

test.describe('«أين يلتقي نسبه ﷺ بنسب الخلفاء الأربعة؟»', () => {
  test.use({ seed: saved('meet', 'prophet-muhammad,abu-bakr-as-siddiq,umar-ibn-al-khattab,uthman-ibn-affan,ali-ibn-abi-talib') });
  test('draws the five lines and opens the nasab page with all five', async ({ page }) => {
    await open(page, '/library');
    await expect(page.getByText(/^أين يلتقي نسبه ﷺ/)).toBeVisible();
    // The fathers they share are written out above the tree, none hidden (owner, 2026-11-22).
    await expect(page.getByText(/^لؤي بن غالب بن فهر/)).toBeVisible();
    await expect(page.getByRole('button', { name: /^أظهر / })).toHaveCount(0);
    await page.getByRole('button', { name: 'افتح النسب' }).click();
    await expect(page).toHaveURL(/\/nasab\?slug=prophet-muhammad(,|%2C)abu-bakr-as-siddiq/);
  });
});
