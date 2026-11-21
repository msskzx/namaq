import type { Page } from '@playwright/test';
import { closeSource, expect, open, openSource, readerPage, tab, test } from './fixtures';
import { surahName as S } from '../../shared/quran/surahNames';

test('the Quran hub links to every tool', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'القرآن').click();
  for (const name of ['متشابهات القرآن', 'مقارنة السور', 'قصص الأنبياء', 'تحفة الأطفال', 'ألفاظ القرآن']) {
    await expect(page.getByRole('link', { name })).toBeVisible();
  }
  await page.getByRole('link', { name: 'تحفة الأطفال' }).click();
  await expect(page.getByRole('button', { name: /^اختر بابًا:/ })).toBeVisible();
  await page.getByRole('button', { name: 'أدوات القرآن' }).click();
  await expect(page.getByRole('link', { name: 'متشابهات القرآن' })).toBeVisible();
});

test('the surah order narrows to a juz and cites its books', async ({ page }) => {
  await open(page, '/order');
  await expect(page.getByRole('heading', { name: `${S(1)}` })).toBeVisible();
  await page.getByRole('button', { name: '١', exact: true }).click();
  await expect(page.getByRole('heading', { name: `${S(2)}` })).toBeVisible();
  await page.evaluate(() => { window.open = url => { (window as unknown as { externalUrl: string }).externalUrl = String(url); return null; }; });
  // Its books are on the source line under it; a tap opens each with its page (owner, 2026-11-20).
  await openSource(page, 'السيوطي، تناسق الدرر');
  await page.getByRole('link', { name: /ص٥٣/ }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { externalUrl: string }).externalUrl)).toBe('https://shamela.ws/book/9992/51');
  await closeSource(page);
  // The strip is an inverted list (mirrored), so its far end is the largest scrollLeft; scrollTo() does not move it.
  await page.getByRole('button', { name: '١', exact: true }).evaluate(element => {
    let strip = element.parentElement;
    while (strip && strip.scrollWidth <= strip.clientWidth) strip = strip.parentElement;
    if (strip) strip.scrollLeft = strip.scrollWidth;
  });
  await page.getByRole('button', { name: '٣٠', exact: true }).click();
  await expect(page.getByRole('heading', { name: `${S(78)}` })).toBeVisible();
  await expect(page.getByRole('button', { name: /^المصدر: البقاعي، نظم الدرر/ }).first()).toBeVisible();
});

test('the lata\'if page groups its examples by topic, each with al-Suyuti\'s words folded under it', async ({ page }) => {
  await open(page, '/lataif');
  await expect(page.getByRole('tab', { name: 'الكل' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'الالتفات' })).toBeVisible();
  const reference = page.getByRole('button', { name: 'الإتقان للسيوطي ٣/٢٩٢–٢٩٣' });
  await reference.click();
  await expect(page.getByRole('link', { name: /الإتقان للسيوطي ٣\/٢٩٢–٢٩٣/ }).first()).toBeVisible();
});

test('a new user\'s branches open as the matrix, with a switch to the tree', async ({ page }) => {
  // The matrix is the default view (owner, 2026-11-17).
  await open(page, '/branches');
  await expect(page.getByRole('button', { name: /^قراءة / }).first()).toBeVisible();
  await page.getByRole('button', { name: 'عرض الشجرة' }).first().click();
  await expect(page.getByRole('button', { name: 'عرض المصفوفة' }).first()).toBeVisible();
});

test('every matrix has one studio: the read-along, and on a book matrix a switch to its connections', async ({ page }) => {
  // The cards either side are drawn off screen, ready for a swipe: only the open card's buttons count.
  const onScreen = async (name: string) => {
    const buttons = page.getByRole('button', { name, exact: true });
    const found = [];
    for (let i = 0; i < await buttons.count(); i++) {
      const box = await buttons.nth(i).boundingBox();
      if (box && box.x >= 0 && box.x + box.width <= 390) found.push(buttons.nth(i));
    }
    return found;
  };
  await open(page, '/branches');
  await expect(page.getByLabel(/^الشجرة ١ من /)).toBeAttached();
  await expect.poll(async () => (await onScreen('استوديو القراءة')).length).toBe(1);
  expect(await onScreen('استوديو الروابط')).toHaveLength(0);
  await (await onScreen('استوديو القراءة'))[0].click();
  await page.getByRole('button', { name: 'اقرأ مع التظليل' }).click();
  await expect(page.getByRole('button', { name: 'إيقاف مؤقت' })).toBeVisible();
  await page.getByRole('button', { name: 'إغلاق الاستوديو' }).click();
  // A swipe turns to the next card.
  await page.mouse.move(80, 400);
  await page.mouse.down();
  await page.mouse.move(330, 400, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByLabel(/^الشجرة ٢ من /)).toBeAttached();
  // al-Baqarah 6–7 with Ya Sin 10–11 has book connections.
  await page.getByRole('button', { name: 'ابحث' }).click();
  const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
  await box.fill('سواء عليهم أأنذرتهم أم لم تنذرهم لا يؤمنون');
  await box.press('Enter');
  await expect.poll(async () => (await onScreen('استوديو الروابط')).length).toBe(1);
  expect(await onScreen('استوديو القراءة')).toHaveLength(0);
  await (await onScreen('استوديو الروابط'))[0].click();
  await page.getByRole('button', { name: 'الروابط', exact: true }).click();
  await expect(page.getByRole('button', { name: 'اقرأ مع التظليل' })).toBeVisible();
  await page.getByRole('button', { name: 'الروابط', exact: true }).click();
  await expect(page.getByRole('button', { name: 'شاهد الروابط' })).toBeVisible();
});

test.describe('branches', () => {
  // These tests are about the tree, so they run for a reader who picked it.
  test.use({ seed: { 'branches-view': '"tree"' } });
  // The trees searched for below are our own (no book compares them), so they sit under «تدبّر».
  const openPondering = async (page: Page) => {
    await open(page, '/branches');
    await page.getByRole('tab', { name: 'تدبّر' }).click();
    await expect(page.getByRole('tab', { name: 'تدبّر' })).toHaveAttribute('aria-selected', 'true');
  };

  test('the tree switches to the matrix and back', async ({ page }) => {
    await open(page, '/branches');
    await expect(page.getByLabel(/^الشجرة ١ من /)).toBeAttached();
    // Each card has its own switch, under it.
    await page.getByRole('button', { name: 'عرض المصفوفة' }).first().click();
    await expect(page.getByRole('button', { name: /^قراءة / }).first()).toBeVisible();
    await page.getByRole('button', { name: 'عرض الشجرة' }).first().click();
    await expect(page.getByRole('button', { name: 'حفظ الشجرة' }).first()).toBeVisible();
  });

  test('a tree is saved and shows in «مدونتي» on home', async ({ page }) => {
    await open(page, '/branches');
    await page.getByRole('button', { name: 'حفظ الشجرة' }).first().click();
    await tab(page, 'الرئيسية').click();
    await page.getByRole('button', { name: 'مدونتي', exact: true }).click();
    await expect(page.getByLabel(/^شجرة: /).first()).toBeVisible();
  });

  test('the search narrows the trees to a phrase', async ({ page }) => {
    await openPondering(page);
    await page.getByRole('button', { name: 'ابحث' }).click();
    const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
    await box.fill('إن المتقين');
    await box.press('Enter');
    await expect(page.getByText('«إن المتقين»')).toBeVisible();
    await expect(page.getByRole('button', { name: `سورة ${S(44)}` })).toBeVisible();
  });

  test('the studio grows a tree to its end', async ({ page }) => {
    await openPondering(page);
    await page.getByRole('button', { name: 'ابحث' }).click();
    const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
    await box.fill('إن المتقين في');
    await box.press('Enter');
    await page.getByRole('button', { name: 'استوديو النمو' }).first().click();
    await page.getByRole('button', { name: 'السرعة 1×' }).click();
    await page.getByRole('button', { name: 'شاهد الشجرة تنمو' }).click();
    await expect(page.getByRole('button', { name: 'إيقاف مؤقت' })).toBeVisible();
    // Once grown, each ayah's path is lit in turn and its ayah read under the tree word by word, the word read lit.
    await expect(page.getByRole('button', { name: `قارن ${S(15)} ٤٥` })).toBeVisible({ timeout: 20_000 });
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('span, div')].some(item => getComputedStyle(item).backgroundColor === 'rgb(220, 197, 160)')), { timeout: 15_000 }).toBe(true);
  });

  test('the tree video draws each box from where the app laid out its labels and words', async ({ page }) => {
    await openPondering(page);
    await page.getByRole('button', { name: 'ابحث' }).click();
    const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
    await box.fill('إن المتقين في');
    await box.press('Enter');
    await page.getByRole('button', { name: 'استوديو النمو' }).first().click();
    await page.getByRole('button', { name: 'مشاركة كفيديو' }).click();
    await expect.poll(() => page.frames().length).toBeGreaterThan(1);
    const recorder = page.frames().find(frame => frame !== page.mainFrame())!;
    await expect.poll(() => recorder.evaluate(() => typeof (window as unknown as { INPUT?: unknown }).INPUT)).toBe('object');
    const scene = await recorder.evaluate(() => (window as unknown as { INPUT: { scene: { boxes: { bare?: boolean; parts?: { label?: string; tab?: boolean; words?: unknown[]; size: number }[] }[] }; look: { ui: string } } }).INPUT);
    const boxes = scene.scene.boxes.filter(item => !item.bare);
    expect(boxes.length).toBeGreaterThan(5);
    // Every box carries its words and references at the places the app drew them, the references in the app's font size.
    for (const item of boxes) {
      expect(item.parts?.some(part => part.words?.length)).toBe(true);
      for (const part of item.parts!.filter(part => part.label)) expect(part.size).toBe(13);
    }
    // No tabs: every box names its ayah inside (owner, 2026-11-16).
    expect(boxes.some(item => item.parts!.some(part => part.tab))).toBe(false);
    // Every box ending an ayah closes with the sign: its number, which the Quran font draws as the sign.
    for (const item of boxes.filter(item => item.parts!.some(part => part.label && /[٠-٩]$/.test(part.label)))) {
      const words = item.parts!.flatMap(part => (part.words ?? []) as { text: string }[]);
      expect(words.at(-1)?.text).toMatch(/^[٠-٩]+$/);
    }
    expect(scene.look.ui).toContain('Amiri');
  });

  test('the tree video draws a braid as the app does: each strand outlined with its words, and its curves; the tree whole in the frame', async ({ page }) => {
    await openPondering(page);
    await page.getByRole('button', { name: 'ابحث' }).click();
    const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
    await box.fill('عليكم الميتة والدم ولحم الخنزير وما أهل');
    await box.press('Enter');
    await page.getByRole('button', { name: 'استوديو النمو' }).first().click();
    await page.getByRole('button', { name: 'مشاركة كفيديو' }).click();
    await expect.poll(() => page.frames().length).toBeGreaterThan(1);
    const recorder = page.frames().find(frame => frame !== page.mainFrame())!;
    await expect.poll(() => recorder.evaluate(() => typeof (window as unknown as { INPUT?: unknown }).INPUT)).toBe('object');
    type Rect = { x: number; y: number; w: number; h: number };
    type Part = Rect & { frame?: boolean; braid?: { count: number; join: boolean }; words?: { text: string }[]; label?: string };
    type Scene = { width: number; height: number; boxes: (Rect & { parts?: Part[] })[] };
    const scene = await recorder.evaluate(() => (window as unknown as { INPUT: { scene: Scene } }).INPUT.scene);
    const parts = scene.boxes.flatMap(item => item.parts ?? []);
    // al-Ma'ida 3 reads «الميتةُ والدمُ ولحمُ» where al-Baqara 173 and al-Nahl 115 read «الميتةَ والدمَ ولحمَ»:
    // strands each outlined, a curve into them and one out, and no «… / …» text.
    expect(parts.filter(part => part.frame).length).toBeGreaterThanOrEqual(2);
    expect(parts.some(part => part.braid && !part.braid.join)).toBe(true);
    expect(parts.some(part => part.braid?.join)).toBe(true);
    expect(parts.flatMap(part => part.words ?? []).some(word => word.text.includes('/'))).toBe(false);
    // The frame is sized from what it holds, so a tree shown zoomed out on a phone is not drawn too big for the frame.
    for (const rect of [...scene.boxes, ...parts]) {
      expect(rect.x + rect.w).toBeLessThanOrEqual(scene.width + 0.5);
      expect(rect.y + rect.h).toBeLessThanOrEqual(scene.height + 0.5);
    }
  });

  test('any box only one path runs through toggles that path, however quickly the boxes are tapped', async ({ page }) => {
    await openPondering(page);
    await page.getByRole('button', { name: 'ابحث' }).click();
    const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
    await box.fill('بدت لهما سوآتهما وطفقا يخصفان');
    await box.press('Enter');
    // Two roots (al-A'raf 22, Taha 121) meet in one box, then part again into two leaves.
    const node = (name: RegExp) => page.getByRole('button', { name }).first();
    const rootA = node(/^فَدَلَّىٰهُمَا /), leafA = node(new RegExp(`^${S(7)} ٢٢ وَنَادَىٰهُمَا `)), rootB = node(/فَأَكَلَا /), leafB = node(new RegExp(`^${S(20)} ١٢١`));
    const litA = page.getByRole('button', { name: `قارن ${S(7)} ٢٢` }), litB = page.getByRole('button', { name: `قارن ${S(20)} ١٢١` });
    await rootA.click();
    await expect(litA).toBeVisible();
    await leafA.click();
    await expect(litA).toBeHidden();
    await leafB.click();
    await expect(litB).toBeVisible();
    await rootB.click();
    await expect(litB).toBeHidden();
    // Two quick taps on two boxes are not a double tap: each lights its own path.
    await leafA.click();
    await leafB.click();
    await expect(litA).toBeVisible();
    await expect(litB).toBeVisible();
  });

  test('the tree card keeps its buttons in place when a path is lit', async ({ page }) => {
    await openPondering(page);
    await page.getByRole('button', { name: 'ابحث' }).click();
    const box = page.getByLabel('ابحث عن عبارة مشتركة بين آيتين أو أكثر');
    await box.fill('إن المتقين في');
    await box.press('Enter');
    const save = page.getByRole('button', { name: 'حفظ الشجرة' }).first();
    await expect(save).toBeVisible();
    // The tab's first-visit hint lies over the chips under a full-height tree.
    await page.getByRole('button', { name: /اضغط لإخفاء التلميح/ }).click();
    const before = await save.boundingBox();
    await page.getByRole('button', { name: `سورة ${S(15)}` }).click();
    await expect(page.getByRole('button', { name: `قارن ${S(15)} ٤٥` })).toBeVisible();
    expect(await save.boundingBox()).toEqual(before);
    // The surah's name comes first, then the ayat, in one label on the right (the matrix's head).
    await expect(page.getByText(`${S(15)} ٤٥–٤٦`, { exact: true }).first()).toBeVisible();
  });
});

test('compare shows a pair and its card actions', async ({ page }) => {
  await open(page, '/compare');
  await expect(page.getByRole('button', { name: /^اختر سورتين:/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استوديو القراءة' }).first()).toBeVisible();
  await page.getByRole('button', { name: /^اختر سورتين:/ }).click();
  await page.getByLabel(/^ابحث عن سورة/).fill('الطور');
  await expect(page.getByText(`${S(52)}`).first()).toBeVisible();
});

test('a compare card kept as its matrix has no tree and no tree button', async ({ page }) => {
  // al-Fatiha and al-Nisa open first, and their one card (1:6 against 4:68) shares no two words in a row.
  await open(page, '/compare');
  await expect(page.getByRole('button', { name: 'استوديو القراءة' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: new RegExp(`^اختر سورتين:.*${S(1)}`) })).toBeVisible();
  await expect(page.getByRole('button', { name: 'عرض المصفوفة' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'عرض الشجرة' })).toHaveCount(0);
});

test.describe('a long story compare', () => {
  test.use({ seed: { 'compare-place': { lead: 2, other: 7 }, 'branches-view': '"matrix"' } });

  test('a card switches to side by side: lanes for shared parts, one surah across the card with the other named', async ({ page }) => {
    await open(page, '/compare');
    await expect(page.getByText(`سورة ${S(7)} لا تذكر هذا الجزء`)).toHaveCount(0);
    const story = page.getByRole('button', { name: 'السورتان جنبًا إلى جنب' }).nth(2);
    await story.click();
    await expect(page.getByText(`سورة ${S(7)} لا تذكر هذا الجزء`).first()).toBeVisible();
    await expect(page.getByText(`${S(2)} ٣٠–٣٣`, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(`${S(2)} ٣٤`, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(`${S(7)} ١١`, { exact: true }).first()).toBeVisible();
    await page.getByRole('button', { name: 'السورتان بعضهما تحت بعض' }).first().click();
    await expect(page.getByText(`سورة ${S(7)} لا تذكر هذا الجزء`)).toHaveCount(0);
  });
});

test('a prophet story dot shows its ayat, which open in the mushaf', async ({ page }) => {
  await open(page, '/prophets');
  await expect(page.getByRole('button', { name: /^اختر نبيًّا:/ })).toBeVisible();
  await page.getByRole('button', { name: new RegExp(`^إغراق فرعون وجنوده، ${S(2)}`) }).click();
  const read = page.getByRole('button', { name: new RegExp(`^افتح ${S(2)}`) }).first();
  await expect(read).toBeVisible();
  await read.click();
  await expect.poll(() => readerPage(page)).toBe(8);
});

test('the words page finds a word and lists its places', async ({ page }) => {
  await open(page, '/words');
  await page.getByLabel('ابحث عن كلمة في القرآن').fill('رحم');
  const word = page.getByRole('button', { name: /، .* مرة$/ }).first();
  await expect(word).toBeVisible();
  await word.click();
  await expect(page.getByRole('button', { name: /^افتح .* في المصحف$/ }).first()).toBeVisible();
});

test('an opened word shows where it gathers: a bar picks a surah, names it with its count and brings its ayat up', async ({ page }) => {
  await open(page, '/words');
  await page.getByLabel('ابحث عن كلمة في القرآن').fill('موسى');
  await page.getByRole('button', { name: /، .* مرة$/ }).first().click();
  const strip = page.getByLabel('عدد مرات ورودها في كل سورة');
  const box = (await strip.boundingBox())!;
  // al-A'raf is the seventh surah from the right.
  await page.mouse.click(box.x + box.width * (1 - 6.5 / 114), box.y + 10);
  await expect(page.getByText(`، منها ٢١ في ${S(7)}`)).toBeVisible();
  await expect(page.getByRole('button', { name: new RegExp(`^افتح ${S(7)} .* في المصحف$`) }).first()).toBeInViewport();
});

test('the words page shows its source and how it counts in the page, collapsed', async ({ page }) => {
  await open(page, '/words');
  await expect(page.getByRole('button', { name: 'المصادر' })).toHaveCount(0);
  await expect(page.getByText(/تُعدّ الكلمة بمدخلها المعجمي/)).toHaveCount(0);
  await page.getByRole('button', { name: /المصدر: المدوّنة القرآنية العربية/ }).click();
  await expect(page.getByText(/تُعدّ الكلمة بمدخلها المعجمي/)).toBeVisible();
  await page.evaluate(() => { window.open = url => { (window as unknown as { externalUrl: string }).externalUrl = String(url); return null; }; });
  await page.getByRole('link', { name: 'المصادر والتراخيص' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { externalUrl: string }).externalUrl)).toBe('https://namaq.vercel.app/attributions#quranic-arabic-corpus');
});

test('the balagha terms list finds a term, opens its definition and examples, and an example opens the reader', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'القرآن').click();
  await page.getByRole('link', { name: 'مصطلحات البلاغة' }).click();
  await page.getByRole('textbox', { name: 'ابحث عن مصطلح' }).fill('الجناس');
  await page.getByRole('link', { name: 'الجناس', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'الجناس', exact: true })).toBeVisible();
  await expect(page.getByText('تعريفه', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^أمثلته في الإتقان/ })).toBeVisible();
  await page.getByRole('button', { name: `افتح ${S(75)} ٢٩ في المصحف` }).first().click();
  await expect(page).toHaveURL(/\/read/);
});
