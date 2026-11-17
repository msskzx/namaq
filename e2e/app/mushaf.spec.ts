import { expect, longPress, open, readerPage, stored, test } from './fixtures';

// Words are matched as the mushaf data writes them (shared/data/quran/mushaf/1.json).
const HAMD = 'ٱلۡحَمۡدُ';
const IHDINA = 'ٱهۡدِنَا';

const pressWord = async (page: import('@playwright/test').Page, word: string) => {
  const target = page.getByText(word, { exact: true }).first();
  await expect(target).toBeVisible();
  // A press that lands while the page draws itself again is lost, so it is pressed again until the menu shows.
  await expect(async () => {
    await longPress(page, target);
    await expect(page.getByRole('toolbar')).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 15_000 });
};

test('a tap on an ayah shows the bars, the index finds a surah', async ({ page }) => {
  await open(page, '/read');
  await page.getByText(HAMD, { exact: true }).first().click();
  await page.getByRole('button', { name: 'فهرس السور والبحث' }).click();
  await page.getByLabel('ابحث عن سورة أو آية').fill('يس');
  await page.getByRole('link').filter({ hasText: 'يس' }).first().click();
  await expect.poll(() => readerPage(page)).toBe(440);
});

test('a long press saves an ayah and marks it forgotten', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await expect(page.getByRole('toolbar', { name: 'الآية ٢ من السورة ١' })).toBeVisible();
  await page.getByRole('button', { name: 'احفظ الآية' }).click();
  await expect.poll(async () => (await stored<{ id: string }[]>(page, 'bookmarks'))?.map(b => b.id)).toContain('ayah:1:2');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'نسيت الآية' }).click();
  await expect.poll(async () => Object.keys((await stored<object>(page, 'ayah-forgot')) ?? {})).toContain('1:2');
});

test('a reflection note is written from the long-press menu', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'اكتب تأملًا' }).click();
  await page.getByLabel('تأملك في هذه الآية').fill('الحمد كله لله');
  await expect.poll(async () => (await stored<Record<string, { text: string }>>(page, 'ayah-notes'))?.['1:2']?.text).toBe('الحمد كله لله');
});

test('the trees sheet holds the branches cards, opening as the matrix with their own tree switch, and opens the ayah\'s trees', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'متشابهات الآية' }).click();
  await page.getByRole('button', { name: 'عرض الشجرة' }).first().click();
  await expect(page.getByRole('button', { name: 'عرض المصفوفة' }).first()).toBeVisible();
  await page.getByRole('button', { name: /افتح في المتشابهات/ }).click();
  await expect(page).toHaveURL(/\/branches/);
  // The ayah's tree (الفاتحة ٢ with الصافات ١٨٢) opens in the full list, not in the saved trees, as the matrix.
  await expect(page.getByRole('button', { name: /^قراءة الصافات / }).first()).toBeVisible();
  expect((await stored<{ saved: boolean }>(page, 'branches-list'))?.saved).toBe(false);
});

test('the compare preview sheet opens the compare card', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, IHDINA);
  await page.getByRole('button', { name: /المقارن/ }).first().click();
  await expect(page.getByRole('button', { name: /^الفاتحة مع / }).first()).toBeVisible();
  await page.getByRole('button', { name: /^الفاتحة مع / }).first().click();
  await expect(page).toHaveURL(/\/compare/);
});

test('the tafsir sheet shows al-Sa\'di\'s passage for the ayah\'s run, with its page', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'تفسير السعدي' }).click();
  await expect(page.getByRole('heading', { name: 'الفاتحة ١–٧' })).toBeVisible();
  await expect(page.getByText('هو المألوه المعبود', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: /تيسير الكريم الرحمن للسعدي، ص ٣٩/ })).toBeVisible();
});

test('a word\'s i\'rab shows its short line, and al-\'Ukbari once his book is downloaded', async ({ page }) => {
  await page.route('https://namaq.vercel.app/api/books/ukbari', route => route.fulfill({
    json: { source: { version: '2026-08-10', book: 309 }, entries: [[1, 2, 0, 0, 4, 'قَوْلُهُ تَعَالَى: ﴿الْحَمْدُ﴾ : مُبْتَدَأٌ.']] },
  }));
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'إعراب الكلمة' }).click();
  await expect(page.getByRole('heading', { name: 'الفاتحة ٢' })).toBeVisible();
  await expect(page.getByRole('tab', { name: HAMD })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText(/اسم مرفوع/).first()).toBeVisible();
  await page.getByRole('button', { name: 'نزّل التبيان في إعراب القرآن' }).click();
  await expect(page.getByRole('link', { name: /التبيان في إعراب القرآن للعكبري، ص ٤/ })).toBeVisible();
  await expect.poll(() => stored<string[]>(page, 'books-saved')).toEqual(['ukbari']);
  // Another word of the ayah: its own line, and no passage of his on it.
  await page.getByRole('tablist', { name: 'كلمات الآية' }).getByRole('tab').nth(1).click();
  await expect(page.getByText('لم يتكلم العكبري على هذه الكلمة ولا على آيتها.')).toBeVisible();
});

test('an ayah\'s balagha shows al-Suyuti\'s paragraphs, then al-Zamakhshari\'s passage once al-Kashshaf is downloaded', async ({ page }) => {
  const text = 'قوله ﴿الْحَمْدُ لِلَّهِ﴾ كلام. وفيه استعارة في ﴿الْحَمْدُ﴾. آخر.';
  await page.route('https://namaq.vercel.app/api/books/kashshaf', route => route.fulfill({
    json: { source: { version: '2026-08-10', book: 346, from: '' }, entries: [[1, 1, 7, 1, 8, 9, text, [[text.indexOf('وفيه'), text.indexOf('آخر') - 1, 0, 2, 0, 0]]]] },
  }));
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'البلاغة في الآية' }).click();
  await expect(page.getByRole('heading', { name: 'الفاتحة ٢' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'الإتقان للسيوطي' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('«الصِّفَةُ»', { exact: false })).toBeVisible();
  await expect(page.getByText('الإتقان للسيوطي ٣/٢٣٣')).toBeVisible();
  await page.getByRole('tab', { name: 'الكشاف للزمخشري' }).click();
  await page.getByRole('button', { name: 'نزّل الكشاف عن حقائق التنزيل' }).click();
  await expect(page.getByText('«الاستعارة»', { exact: false })).toBeVisible();
  await expect(page.getByText('الكشاف للزمخشري ١/٨–٩')).toBeVisible();
  await expect.poll(() => stored<string[]>(page, 'books-saved')).toEqual(['kashshaf']);
});

test.describe('a removed default tafsir', () => {
  test.use({ seed: { 'books-hidden': ['sadi'] } });

  test('the tafsir sheet offers it back, and it works at once', async ({ page }) => {
    await open(page, '/read');
    await pressWord(page, HAMD);
    await page.getByRole('button', { name: 'تفسير السعدي' }).click();
    await expect(page.getByText('لم تبقِ تفسيرًا على هاتفك', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'أعد تيسير الكريم الرحمن' }).click();
    await expect(page.getByText('هو المألوه المعبود', { exact: false })).toBeVisible();
    await expect.poll(() => stored<string[]>(page, 'books-hidden')).toEqual([]);
  });
});

test.describe('surah topics', () => {
  test.use({ seed: { 'reader-place': { page: 582 } } });

  test('an ayah\'s buttons open the surah\'s topics with al-Biqa\'i\'s aim, and a section jumps there', async ({ page }) => {
    await open(page, '/read');
    await pressWord(page, 'عَنِ');
    await page.getByRole('button', { name: 'موضوع الآية في السورة' }).click();
    await expect(page.getByRole('heading', { name: 'موضوعات سورة النبأ' })).toBeVisible();
    await expect(page.getByText(/^مقصودها الدلالة على أن يوم القيامة/)).toBeVisible();
    await expect(page.getByText('التفسير الموضوعي لسور القرآن الكريم، جامعة الشارقة، ج ٩ ص ٤')).toBeVisible();
    await page.getByRole('button', { name: /^٤\. جزاء المتقين/ }).click();
    await expect.poll(() => readerPage(page)).toBe(583);
  });
});

test('a word long press shows where else it comes', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: /^مواضع «/ }).click();
  await expect(page.getByRole('button', { name: /^افتح .* في المصحف$/ }).first()).toBeVisible();
});

test.describe('the write quiz', () => {
  test.use({ seed: { 'reader-write': true, 'reader-place': { page: 1, position: { start: '1:1', shown: null, words: 0 } } } });

  test('typed words fill the boxes of the ayah in place', async ({ page }) => {
    await open(page, '/read');
    const written = page.getByRole('button', { name: /^كلمة مكتوبة:/ });
    await expect(page.getByRole('button', { name: 'اكتب هذه الكلمة' }).first()).toBeVisible();
    await page.getByLabel('اكتب الكلمة').focus();
    // A box takes as many letters as its word has, then the next box takes the typing.
    await page.keyboard.type('بسم', { delay: 20 });
    await expect(written).toHaveCount(1);
    await page.keyboard.type('اللهالرحمنالرحيم', { delay: 20 });
    await expect(written).toHaveCount(4);
    await expect(written.first()).toHaveAccessibleName('كلمة مكتوبة: بسم');
  });

  test('a wrong word keeps what was typed above it and puts the ayah on the forgotten shelf', async ({ page }) => {
    await open(page, '/read');
    await expect(page.getByRole('button', { name: 'اكتب هذه الكلمة' }).first()).toBeVisible();
    await page.getByLabel('اكتب الكلمة').focus();
    // A space ends a word whose box takes more letters than were typed.
    await page.keyboard.type('بساالله', { delay: 20 });
    await page.keyboard.type('الرحمن الرحيم', { delay: 20 });
    await expect(page.getByLabel('كتبت: بسا')).toBeVisible();
    await expect.poll(async () => Object.keys((await stored<object>(page, 'ayah-forgot')) ?? {})).toContain('1:1');
  });
});

test.describe('listening', () => {
  // The range plays round without end, so the bar stays while the test works with it.
  test.use({ seed: { 'listen-plan': { eachAyah: 1, rangeTimes: 0, pause: 'none', speed: 1 } } });
test('listening starts from a long press, and its sheet keeps the repeats and the reciter', async ({ page }) => {
  // The recitations are not fetched in the test: every ayah plays a second of silence.
  const silence = await import('node:fs').then(fs => fs.readFileSync('mobile/assets/silence.mp3'));
  await page.route(/\.mp3($|\?)/, route => route.fulfill({ body: silence, contentType: 'audio/mpeg' }));
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'استمع من هذه الآية' }).click();
  const bar = page.getByRole('toolbar', { name: 'الاستماع' });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole('button', { name: /^الفاتحة [٢-٧]،/ })).toBeVisible();
  await bar.getByRole('button', { name: 'التكرار والقارئ' }).click();
  await page.getByRole('button', { name: '٣', exact: true }).first().click();
  await expect.poll(async () => (await stored<{ eachAyah: number }>(page, 'listen-plan'))?.eachAyah).toBe(3);
  await page.getByRole('button', { name: 'القارئ والتنزيل' }).click();
  await page.getByRole('radio', { name: /الحصري \(المعلّم\)/ }).click();
  await expect.poll(() => stored<number>(page, 'reciter')).toBe(12);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'أوقف الاستماع' }).click();
  await expect(bar).toBeHidden();
});
});

test('a forgotten word persists on its own and undo leaves an ayah mark intact', async ({ page }) => {
  await open(page, '/read');
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'نسيتها', exact: true }).click();
  await expect.poll(() => stored(page, 'ayah-forgot')).toEqual({ '1:2:0': { forgot: 1, at: expect.any(Number) } });
  await page.reload();
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'نسيت الآية', exact: true }).click();
  await pressWord(page, HAMD);
  await page.getByRole('button', { name: 'تراجع عن نسيان الكلمة', exact: true }).click();
  await expect.poll(async () => Object.keys((await stored<object>(page, 'ayah-forgot')) ?? {})).toEqual(['1:2']);
});

test.describe('word review', () => {
  test.use({ seed: { 'ayah-forgot': { '1:2:1': { forgot: 1, at: 1 } }, 'reader-place': { page: 1, reviewing: true, position: { start: '1:2', word: 1, shown: null, words: 0 } }, 'reader-write': true } });

  test('tests only the marked word and rests it after a correct answer', async ({ page }) => {
    await open(page, '/read');
    await expect(page.getByRole('button', { name: 'اكتب هذه الكلمة', exact: true })).toHaveCount(1);
    await expect(page.getByText(HAMD, { exact: true }).first()).toBeVisible();
    await page.getByLabel('اكتب الكلمة').fill('لله');
    await expect.poll(async () => (await stored<Record<string, { step?: number }>>(page, 'ayah-forgot'))?.['1:2:1']?.step).toBe(1);
    await expect.poll(async () => Object.keys((await stored<object>(page, 'ayah-forgot')) ?? {})).toEqual(['1:2:1']);
  });

  test('a wrong answer resets only the word mark', async ({ page }) => {
    await open(page, '/read');
    await expect(page.getByRole('button', { name: 'اكتب هذه الكلمة', exact: true })).toHaveCount(1);
    await page.getByLabel('اكتب الكلمة').fill('رب');
    await page.getByLabel('اكتب الكلمة').press('Enter');
    await expect.poll(() => stored(page, 'ayah-forgot')).toEqual({ '1:2:1': { forgot: 2, at: expect.any(Number) } });
  });
});

for (const theme of ['light', 'dark'] as const) {
  test.describe(`forgotten word in ${theme}`, () => {
    test.use({ seed: { theme: JSON.stringify(theme), 'ayah-forgot': { '1:2:1': { forgot: 1, at: 1 } }, 'reader-place': { page: 1 } } });

    test('the reader and home review show the word mark', async ({ page }) => {
      await open(page, '/read');
      await expect(page.getByText(HAMD, { exact: true }).first()).toBeVisible();
      const capture = async (name: string) => {
        if (process.env.WORD_SCREENSHOTS) await page.screenshot({ path: `docs/screenshots/forgotten-word/${theme}-${name}.jpg`, type: 'jpeg', quality: 85 });
      };
      await capture('reader');
      await page.goto('/');
      await page.getByText('هل تذكرها؟', { exact: true }).scrollIntoViewIfNeeded();
      await expect(page.getByRole('toolbar', { name: 'أدوات التسميع' })).toBeVisible();
      await expect(page.getByText(HAMD, { exact: true }).first()).toBeVisible();
      await capture('review');
      await page.getByRole('toolbar', { name: 'أدوات التسميع' }).getByRole('button', { name: 'أظهر الكلمة التالية' }).click();
      await expect(page.getByRole('button', { name: 'أظهر الكلمة التالية' })).toBeDisabled();
    });
  });
}

test.describe('two word reviews in one ayah', () => {
  test.use({ seed: { 'ayah-forgot': { '1:2:0': { forgot: 1, at: 1 }, '1:2:1': { forgot: 1, at: 1 } }, 'reader-place': { page: 1, reviewing: true, position: { start: '1:2', word: 0, shown: null, words: 0 } }, 'reader-write': true } });

  test('the next word has its own blank and no feedback from the previous answer', async ({ page }) => {
    await open(page, '/read');
    await page.getByLabel('اكتب الكلمة').fill('خطأ');
    await page.getByLabel('اكتب الكلمة').press('Enter');
    await expect(page.getByLabel('كتبت: خطأ')).toBeVisible();
    await page.getByRole('button', { name: 'الآية المنسية التالية' }).click();
    await expect(page.getByLabel('كتبت: خطأ')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'اكتب هذه الكلمة', exact: true })).toHaveCount(1);
    await page.getByLabel('اكتب الكلمة').fill('لله');
    await expect.poll(async () => (await stored<Record<string, { step?: number }>>(page, 'ayah-forgot'))?.['1:2:1']?.step).toBe(1);
  });
});
