import { expect, open, tab, test } from './fixtures';

// The tarajim tab (owner, 2026-11-18; a hub since 2026-11-19, the full list on its own page): only the people whose Siyar
// entry is converted (shared/data/tarajim/people.json), each with a page built from the entry, and the nasab tree where lines meet.
test('the tarajim tab opens the list of converted people, filters by title, and opens a person', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'التراجم').click();
  await page.getByRole('link', { name: 'كل التراجم', exact: true }).click();
  await expect(page.getByRole('link', { name: 'الزبير بن العوام', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'العشرة المبشرون بالجنة' }).click();
  await expect(page.getByRole('link', { name: 'طلحة بن عبيد الله', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'حمزة بن عبد المطلب', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'الكل' }).click();
  await page.getByPlaceholder('ابحث في التراجم', { exact: true }).fill('صفية');
  await expect(page.getByRole('link', { name: 'صفية بنت عبد المطلب', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'الزبير بن العوام', exact: true })).toHaveCount(0);

  await page.getByRole('link', { name: 'صفية بنت عبد المطلب', exact: true }).click();
  await expect(page).toHaveURL(/\/person\?slug=safiyyah-bint-abd-al-muttalib/);
  await expect(page.getByRole('heading', { name: /نسبها/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /صلاتها/ })).toBeVisible();
  // Her son has a page too: his node on her ties ring opens it.
  await page.getByRole('link', { name: /^ابنها: الزبير/ }).click();
  await expect(page).toHaveURL(/slug=az-zubayr-ibn-al-awwam/);
  await expect(page.getByRole('heading', { name: /مناقبه/ })).toBeVisible();
});

test('the nasab tree shows where two lines meet', async ({ page }) => {
  await open(page, '/nasab?slug=al-abbas-ibn-abd-al-muttalib');
  // One person's line is his nasab as text, never drawn (owner, 2026-11-23); the tree comes with a second.
  await expect(page.getByRole('tab', { name: 'الرسم' })).toHaveCount(0);
  await expect(page.getByText(/^العباس بن عبد المطلب بن هاشم/)).toBeVisible();
  await page.getByRole('button', { name: 'أضف' }).click();
  await page.getByRole('button', { name: 'محمد ﷺ' }).click();
  // The drawing first (owner, 2026-11-20); where they meet is the text.
  await expect(page.getByRole('link', { name: 'محمد ﷺ' })).toBeVisible();
  await page.getByRole('tab', { name: 'النص' }).click();
  await expect(page.getByText('يلتقيان في: عبد المطلب')).toBeVisible();
});

// The hub's «النسب» opens the nasab page on its search of people (owner, 2026-11-20).
test('the tarajim hub opens the nasab search, and two picks draw their tree', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'التراجم').click();
  await page.getByRole('link', { name: /^النسب/ }).click();
  // The hub under it keeps its own top-bar search of the same name; the picker's is in the sheet.
  await page.getByRole('dialog').getByRole('textbox', { name: 'ابحث في التراجم' }).fill('أبو بكر');
  await page.getByRole('button', { name: 'أبو بكر الصديق' }).click();
  await page.getByRole('button', { name: 'أضف' }).click();
  await page.getByRole('dialog').getByRole('textbox', { name: 'ابحث في التراجم' }).fill('عمر');
  await page.getByRole('button', { name: 'عمر بن الخطاب', exact: true }).click();
  // A box stands alone, so it names his father in the nominative: «أبو قحافة», never «أبي قحافة».
  await expect(page.getByText(/^أبو قحافة/)).toBeVisible();
});

// A relative the entry names who has no page looks like everyone else (owner, 2026-11-22): a tap opens the sentence
// that names him, with its page, on the ring and in the text view alike.
test('a relative with no page opens the sentence that names him', async ({ page }) => {
  await open(page, '/person?slug=jabr-ibn-atik');
  await page.getByRole('button', { name: 'ابنه: عتيك', exact: true }).click();
  await expect(page.getByRole('dialog').getByText(/وَلَهُ أَوْلاَدٌ/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.getByRole('tab', { name: 'النص' }).last().click();
  await page.getByRole('button', { name: 'عتيك', exact: true }).click();
  await expect(page.getByRole('dialog').getByText(/وَلَهُ أَوْلاَدٌ/)).toBeVisible();
});

// The people graph (owner, 2026-11-18; sketch tarajim-app/graph/sketch2-dark.png): one person in the middle with his ties,
// and «بينه وبين…» drawing the nearest chain between the people picked.
test('the ties view draws a person with his ties and walks to a relative', async ({ page }) => {
  await open(page, '/person?slug=az-zubayr-ibn-al-awwam');
  await page.getByRole('button', { name: 'تنقّل في صلاته' }).click();
  await expect(page).toHaveURL(/\/ties\?slug=az-zubayr-ibn-al-awwam/);
  await expect(page.getByRole('heading', { name: 'الزبير بن العوام' })).toBeVisible();
  await page.getByRole('link', { name: /^أمه: صفية/ }).click();
  await expect(page.getByRole('heading', { name: /^صفية/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /^ابنها: الزبير/ })).toBeVisible();
});

// Round her father a daughter is named alone (owner, 2026-11-23), even where her nasab gives his kunya in the genitive and
// without his laqab: «عائشة بنت أبي بكر» round «أبو بكر الصديق» is «عائشة».
test('the ring names a child without the father in the middle', async ({ page }) => {
  await open(page, '/person?slug=abu-bakr-as-siddiq');
  // The link still reads her whole name aloud; the drawing shows her name alone.
  await expect(page.getByRole('link', { name: 'بنته: عائشة بنت أبي بكر', exact: true })).toHaveText('عائشة');
  await expect(page.getByRole('link', { name: 'ابنه: محمد بن أبي بكر الصديق', exact: true })).toHaveText('محمد');
  // His line to the Prophet ﷺ says what he was, «صحابي», with its arrow from him (owner, 2026-11-23); the key below names it too.
  await expect(page.getByText('صحابي', { exact: true }).first()).toBeVisible();
});

test('between two people shows the chain that joins them, with its pages', async ({ page }) => {
  await open(page, '/between?slugs=az-zubayr-ibn-al-awwam,hamzah-ibn-abd-al-muttalib');
  // The drawing first, in the page's card (owner, 2026-11-20); the sentence that says it on «النص».
  await expect(page.getByRole('button', { name: 'حمزة بن عبد المطلب', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'النص' }).click();
  await expect(page.getByText(/أمُّ الزبير بن العوام/)).toBeVisible();
  await page.getByRole('tab', { name: 'الرسم' }).click();
  await page.getByRole('button', { name: 'أضف' }).click();
  await page.getByRole('button', { name: /^العباس/ }).click();
  await expect(page.getByRole('button', { name: /^العباس/ })).toBeVisible();
});

// The person page draws what we have of him (owner, 2026-11-19): «نسبه» as the book's text (2026-11-23), «حياته» on the timeline
// (sketch timeline-events/sketch-dark.png, screens 1 and 4), «صلاته» as the ring.
test('the person page gives his nasab, draws his life and his ties', async ({ page }) => {
  await open(page, '/person?slug=az-zubayr-ibn-al-awwam');
  // His full name as the book gives it, with no drawing of it (owner, 2026-11-23); the tree is for comparing, on the button,
  // which opens the comparison on its list of people.
  await expect(page.getByText(/الزُّبَيْرُ بنُ العَوَّامِ/).first()).toBeVisible();
  await expect(page.getByRole('tab', { name: 'الرسم' })).toHaveCount(1);
  await page.getByRole('button', { name: 'قارن نسبه بغيره' }).click();
  await expect(page).toHaveURL(/\/nasab\?.*pick=1/);
  await page.goBack();
  // His ties round him: his mother opens her own page.
  await expect(page.getByRole('link', { name: /^أمه: صفية/ })).toBeVisible();
  // His life, opened past its fold: a raid filter keeps Badr and drops the battle of the Camel; Badr opens its page.
  await page.getByRole('button', { name: /^أظهر البقية/ }).click();
  await expect(page.getByRole('link', { name: /معركة الجمل/ })).toBeVisible();
  await page.getByRole('button', { name: 'الغزوات' }).click();
  await expect(page.getByRole('link', { name: /معركة الجمل/ })).toHaveCount(0);
  await page.getByRole('link', { name: 'غزوة بدر' }).click();
  await expect(page).toHaveURL(/\/battle\?slug=badr/);
});

test('his life beside another\'s puts what they shared on one row', async ({ page }) => {
  await open(page, '/life?slugs=az-zubayr-ibn-al-awwam,abu-bakr-as-siddiq');
  // Both were at Badr: one box each, side by side; only al-Zubayr at the Camel.
  await expect(page.getByRole('link', { name: 'غزوة بدر' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'معركة الجمل' })).toHaveCount(1);
});

// A long life folds on the person page (owner, 2026-11-23: the Prophet's ﷺ is long): its first rows, then a row that opens the rest.
test('a long life on the person page opens folded, and its fold opens the rest', async ({ page }) => {
  await open(page, '/person?slug=prophet-muhammad');
  await expect(page.getByRole('link', { name: 'غزوة تبوك', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: /^أظهر البقية/ }).click();
  await expect(page.getByRole('link', { name: 'غزوة تبوك', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'اطوِ', exact: true }).click();
  await expect(page.getByRole('link', { name: 'غزوة تبوك', exact: true })).toHaveCount(0);
});

// «مناقبه» and «صفته» (owner, 2026-11-23, sketch tarajim-feed-card/sketch/traits-dark.png): the Prophet's ﷺ words first, each
// with its own page that opens the book there; his looks as the book's words, the sayer the book names under each, and no
// name under a word only an unnamed «وقيل» gives.
test('his virtues put the Prophet\'s ﷺ words first with their pages, his looks as the book\'s words', async ({ page }) => {
  await open(page, '/person?slug=abu-bakr-as-siddiq');
  const saying = page.getByText(/ولو كنت متخذا خليلا/).first();
  await saying.scrollIntoViewIfNeeded();
  await expect(page.getByText('قال النبي ﷺ:').first()).toBeVisible();
  await page.getByRole('button', { name: 'المصدر: سيرة الخلفاء الراشدين ١٢' }).first().click();
  await expect(page.getByText(/^«ويأب. الله والمؤمنون إلا أبا بكر»$/)).toBeVisible();
  await page.keyboard.press('Escape');
  // Al-Zuhri names «مسترق الوركين»; «نحيف» is the unnamed sentence's only.
  await expect(page.getByLabel('مسترق الوركين، عند الزهري', { exact: true })).toBeVisible();
  await expect(page.getByLabel('نحيف', { exact: true })).toBeVisible();
});
