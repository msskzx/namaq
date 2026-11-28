import type { Page } from '@playwright/test';
import { branchNodes, givenAnswer } from '../../shared/quiz/branchAnswers';
import type { Branch } from '../../shared/quran/branches';
import { num } from '../../shared/quran/arabicNumber';
import { numberVerses, type Poem } from '../../shared/tajwid/poem';
import poemData from '../../shared/tajwid/tuhfat-al-atfal.json';

const chapters = numberVerses(poemData as Poem);
import { closeSource, drag, expect, firstBoxes, middle, open, stored, tab, test, writeBlank } from './fixtures';

type Run = { questions: { tree: Branch; asked: number[] }[]; current: number };

/** The answer typed for each asked leaf of a question: its words as the tree writes them. */
const answersOf = async (page: Page, index: number) => {
  // The run reaches storage a moment after it starts (mobile/src/lib/soloStore.ts).
  await expect.poll(() => stored(page, 'quiz-solo-run')).not.toBeNull();
  const run = await stored<Run>(page, 'quiz-solo-run');
  const question = run!.questions[index];
  const nodes = branchNodes(question.tree);
  // In the boxes' order: the tree's own node order («الطرف ١» first).
  return [...question.asked].sort((a, b) => a - b).map(node => givenAnswer(nodes[node]));
};

/** Each asked leaf's first box (recite mode's boxes, owner 2026-11-19), named in the boxes' order. */
const leaves = (page: Page) => firstBoxes(page, 'الطرف \\S+');
const leaf = (i: number) => `الطرف ${num(i + 1)}`;

/** A one-answer question: a tap selects the choice, «تحقق» answers (owner, 2026-11-21). */
const choose = async (page: Page, label: string) => {
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.getByRole('button', { name: 'تحقق', exact: true }).click();
};

test.beforeEach(async ({ page }) => {
  // The same questions every run: Math.random seeded before the app starts.
  await page.addInitScript(() => {
    let seed = 7;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  });
});

test("the quizzes tab: a science's tree puts the tapped kind's question on the page, and the setup still mixes the written kinds", async ({ page }) => {
  await open(page, '/');
  await tab(page, 'الاختبارات').click();
  // The four sciences (owner, 2026-11-23: the three designs joined), each with its tree of kinds under a live question.
  await expect(page.getByRole('tab', { name: 'القرآن', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'السيرة', exact: true }).click();
  await page.getByRole('radio', { name: 'ما كنيته؟', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'ما كنيته؟', exact: true })).toBeChecked();
  await expect(page.getByRole('heading', { name: 'ما كنيته؟', exact: true })).toBeVisible();
  // «خمسة أسئلة منه» starts a quiz of that kind alone.
  await page.getByRole('button', { name: 'خمسة أسئلة منه' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  await expect(page.getByText(/^ما كنية /).filter({ visible: true }).first()).toBeVisible();

  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'سمّع الآية', exact: true }).click();
  await page.getByRole('button', { name: 'أوائل السور' }).click();
  await page.getByRole('button', { name: 'متشابهات القرآن', exact: true }).click();
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  // The ayah's words are boxes on its own page; the first is written into.
  await expect(page.getByRole('button', { name: 'اكتب هذه الكلمة' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'أظهر الآية التالية' }).click();
  await page.getByRole('button', { name: 'نسيتها' }).click();
  await expect.poll(async () => Object.keys(await stored<Record<string, unknown>>(page, 'ayah-forgot') ?? {}).length).toBe(1);
});

test('«من راوي الحديث؟» folds the hadith, asks by chips, and once answered gives al-Nawawi\'s line as «الشاهد», the whole place in a sheet', async ({ page }) => {
  await open(page, '/quizzes');
  await page.getByRole('tablist', { name: 'العلوم' }).getByRole('tab', { name: 'الحديث', exact: true }).click();
  await page.getByRole('radio', { name: 'من راوي الحديث؟', exact: true }).click();
  // The hadith opens folded, «النص كاملًا» under it (owner, 2026-11-24: sketch question-look design أ).
  await expect(page.getByRole('button', { name: 'النص كاملًا' })).toBeVisible();
  const head = page.getByRole('heading', { name: 'من راوي الحديث؟', exact: true });
  const choices = page.getByRole('button').filter({ hasText: /^(?!سؤال آخر|خمسة أسئلة منه|تحقق|تلميح|النص كاملًا|اختبار)/ });
  const headAt = (await head.boundingBox())!.y;
  const stop = (await page.getByRole('button', { name: 'سؤال آخر' }).boundingBox())!.y;
  for (let i = 0; i < await choices.count(); i++) {
    const box = await choices.nth(i).boundingBox();
    if (box && box.y > headAt && box.y < stop) { await choices.nth(i).click(); break; }
  }
  await page.getByRole('button', { name: 'تحقق' }).filter({ visible: true }).first().click();
  await expect(page.getByText('الشاهد', { exact: true })).toBeVisible();
  await expect(page.getByText(/^قال النووي في /).filter({ visible: true }).first()).toBeVisible();
  // Answered, the card stays within the screen (it ran to nearly three screens with the whole view under it).
  const screen = page.viewportSize()!.height;
  expect((await page.getByRole('button', { name: 'سؤال آخر' }).boundingBox())!.y - (await head.boundingBox())!.y).toBeLessThan(screen);
  await page.getByRole('button', { name: 'الموضع كاملًا' }).click();
  await expect(page.getByRole('button', { name: 'رجوع إلى السؤال' })).toBeVisible();
});

test.describe('a question answered wrong', () => {
  // Missed in the feed, its rest over yesterday (shared/quiz/missedQuestions.ts).
  test.use({ seed: { 'missed-questions': { 'TARAJIM_KUNYA:11': { kind: 'TARAJIM_KUNYA', seed: 11, step: 1, due: Date.now() - 86_400_000 } } } });

  test('comes back in «عادت إليك», and a tap asks it again on the page', async ({ page }) => {
    await open(page, '/');
    await tab(page, 'الاختبارات').click();
    await expect(page.getByRole('heading', { name: 'عادت إليك' })).toBeVisible();
    await page.getByRole('button', { name: 'أجب: ما كنيته؟' }).click();
    // Its science opens with it in the card, the leaf of its kind picked.
    await expect(page.getByRole('tab', { name: 'السيرة', exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('radio', { name: 'ما كنيته؟', exact: true })).toBeChecked();
  });
});

test('a solo quiz: right, wrong and empty answers, resume after reload, then the result', async ({ page }) => {
  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  await expect(leaves(page).first()).toBeVisible();

  const right = await answersOf(page, 0);
  await expect(leaves(page)).toHaveCount(right.length);
  for (const [i, answer] of right.entries()) await writeBlank(page, leaf(i), answer);
  // Quizzes draw the matrix only (owner, 2026-11-17).
  await expect(page.getByRole('button', { name: 'عرض الشجرة' })).toHaveCount(0);
  await page.getByRole('button', { name: 'تحقق', exact: true }).click();
  await expect(page.getByLabel('السؤال ١ - صحيح')).toBeVisible();

  await page.getByRole('button', { name: 'التالي' }).click();
  await expect(leaves(page).first()).toHaveAccessibleName('الطرف ١، الكلمة ١');
  const count = await leaves(page).count();
  for (let i = 0; i < count; i++) await writeBlank(page, leaf(i), 'كلام خطأ');
  await page.getByRole('button', { name: 'تحقق', exact: true }).click();
  await expect(page.getByLabel('السؤال ٢ - خطأ')).toBeVisible();

  // «تحقق» with nothing typed is the way on for one who does not know (owner, 2026-11-21).
  await page.getByRole('button', { name: 'التالي' }).click();
  await page.getByRole('button', { name: 'تحقق', exact: true }).click();
  await expect(page.getByLabel(/^السؤال ٣ - /)).toBeVisible();

  await page.getByRole('button', { name: 'التالي' }).click();
  await writeBlank(page, leaf(0), 'شيء');
  await expect.poll(async () => JSON.stringify(await stored(page, 'quiz-solo-run'))).toContain('شيء');
  await page.reload();
  await expect(leaves(page).first()).toHaveAccessibleName('الطرف ١، الكلمة ١: شيء');
  await expect(page.getByLabel('السؤال ١ - صحيح')).toBeVisible();

  const send = page.getByRole('button', { name: 'إرسال' });
  const next = page.getByRole('button', { name: 'التالي' });
  for (let i = 0; i < 15; i++) {
    await expect(send.or(next)).toBeVisible();
    if (await send.count()) break;
    await next.click();
  }
  await send.click();
  await expect(page.getByText(/^النتيجة: /)).toBeVisible();
  await page.getByLabel('السؤال ١ - صحيح').click();
  await expect(page.getByText(/أطراف$/)).toBeVisible();
  await page.getByRole('button', { name: 'العودة للنتيجة' }).click();
  await expect(page.getByRole('button', { name: 'اختبار جديد' })).toBeVisible();
});

test('a solo quiz of which surah and recite questions: pick, reveal, then the result', async ({ page }) => {
  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'في أي سورة؟' }).click();
  await page.getByRole('button', { name: 'سمّع بقية الآية' }).click();
  await page.getByRole('button', { name: 'متشابهات القرآن', exact: true }).click();
  await expect(page.getByText('عدد الإجابات')).toHaveCount(0);
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  await expect.poll(() => stored(page, 'quiz-solo-run')).not.toBeNull();
  const run = await stored<{ questions: { family: string; correctAnswer: string; choices: { value: string; labelArabic: string }[] }[] }>(page, 'quiz-solo-run');
  for (const [index, question] of run!.questions.entries()) {
    if (question.family === 'RECITE') {
      await page.getByRole('button', { name: 'أظهر الآية التالية' }).click();
      await page.getByRole('button', { name: 'حفظتها' }).click();
    } else await choose(page, question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic);
    await expect(page.getByRole('button', { name: 'في المصحف' })).toBeVisible();
    await page.getByRole('button', { name: index === run!.questions.length - 1 ? 'إرسال' : 'التالي' }).click();
  }
  await expect(page.getByText(/^النتيجة: ٥ من ٥/)).toBeVisible();
});

test('a compare quiz: the matrix only, a right and a wrong blank, then the result', async ({ page }) => {
  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'قارن الموضعين' }).click();
  await page.getByRole('button', { name: 'متشابهات القرآن', exact: true }).click();
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  await expect.poll(() => stored(page, 'quiz-solo-run')).not.toBeNull();
  const run = await stored<{ questions: { compare: { asked: { words: string[] }; blanks: [number, number][] } }[] }>(page, 'quiz-solo-run');
  const blanks = firstBoxes(page, 'الفراغ \\S+');
  const first = run!.questions[0].compare;
  await expect(blanks).toHaveCount(first.blanks.length);
  // No tree to switch to (owner, 2026-11-17).
  await expect(page.getByRole('button', { name: 'عرض الشجرة' })).toHaveCount(0);
  for (const [i, [from, to]] of first.blanks.entries()) await writeBlank(page, `الفراغ ${num(i + 1)}`, first.asked.words.slice(from, to).join(' '));
  await page.getByRole('button', { name: 'تحقق', exact: true }).click();
  await expect(page.getByLabel('السؤال ١ - صحيح')).toBeVisible();
  await expect(page.getByRole('button', { name: 'افتح في مقارنة السور' })).toBeVisible();

  await page.getByRole('button', { name: 'التالي' }).click();
  await writeBlank(page, 'الفراغ ١', 'كلام خطأ');
  await page.getByRole('button', { name: 'تحقق', exact: true }).click();
  await expect(page.getByText('كتبتَ:').first()).toBeVisible();

  const send = page.getByRole('button', { name: 'إرسال' });
  const next = page.getByRole('button', { name: 'التالي' });
  for (let i = 0; i < 15; i++) {
    await expect(send.or(next)).toBeVisible();
    if (await send.count()) break;
    await next.click();
  }
  await send.click();
  await expect(page.getByText(/^النتيجة: /)).toBeVisible();
  await page.getByLabel('السؤال ١ - صحيح').click();
  await expect(page.getByText(/فراغات$/)).toBeVisible();
});

// «السيرة والغزوات» (owner, 2026-11-18): the sira stories and battles as a quiz kind, each answer with its source under it.
test('a solo quiz of the sira and battles: pick the right answers, each shows its source collapsed to the book, then the result', async ({ page }) => {
  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'السيرة والغزوات' }).click();
  await page.getByRole('button', { name: 'متشابهات القرآن', exact: true }).click();
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  await expect.poll(() => stored(page, 'quiz-solo-run')).not.toBeNull();
  const run = await stored<{ questions: { family: string; correctAnswer: string; choices: { value: string; labelArabic: string }[] }[] }>(page, 'quiz-solo-run');
  expect(run!.questions.every(question => question.family === 'SIRA')).toBe(true);
  for (const [index, question] of run!.questions.entries()) {
    await choose(page, question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic);
    await expect(page.getByText(/سير أعلام النبلاء|صحيح البخاري|صحيح مسلم/).first()).toBeVisible();
    if (index === 0) {
      // Collapsed to the book's name (owner, 2026-11-19); a tap opens where in it the answer is.
      const book = page.getByRole('button', { name: /سير أعلام النبلاء|صحيح البخاري|صحيح مسلم/ }).first();
      const places = page.getByText(/ص [٠-٩]|رقم [٠-٩]/);
      const before = await places.count();
      await book.click();
      await expect.poll(() => places.count()).toBeGreaterThan(before);
      await closeSource(page);
    }
    await page.getByRole('button', { name: index === run!.questions.length - 1 ? 'إرسال' : 'التالي' }).click();
  }
  await expect(page.getByText(/^النتيجة: ٥ من ٥/)).toBeVisible();
});

test('a solo quiz looks an answer up in the poem, and after the answer shows the verse that gives it', async ({ page }) => {
  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'التحفة: أكمل البيت' }).click();
  await page.getByRole('button', { name: 'متشابهات القرآن', exact: true }).click();
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  await expect.poll(() => stored(page, 'quiz-solo-run')).not.toBeNull();
  const run = await stored<{ questions: { correctAnswer: string; look: { mark: number } }[] }>(page, 'quiz-solo-run');
  const question = run!.questions[0];
  await page.getByRole('button', { name: 'ابحث عن الجواب' }).click();
  // The whole poem, its first chapter and its last.
  await expect(page.getByRole('heading', { name: chapters[0].title })).toBeVisible();
  await expect(page.getByRole('heading', { name: chapters.at(-1)!.title })).toBeAttached();
  await page.getByRole('button', { name: 'رجوع إلى السؤال' }).click();
  await choose(page, question.correctAnswer);
  await expect(page.getByRole('button', { name: 'ابحث عن الجواب' })).toHaveCount(0);
  // «الموضع كاملًا» opens only the chapter of the verse that answers, the verse lit (owner, 2026-11-24: in a sheet).
  await page.getByRole('button', { name: 'الموضع كاملًا' }).click();
  await expect(page.getByLabel(`${num(question.look.mark)}: `, { exact: false }).first()).toBeVisible();
  const chapter = chapters.find(part => part.verses.some(verse => verse.number === question.look.mark))!;
  await expect(page.getByRole('heading', { name: chapter.title })).toBeVisible();
  for (const other of chapters.filter(part => part !== chapter)) await expect(page.getByRole('heading', { name: other.title, exact: true })).toHaveCount(0);
});

test('a solo quiz of the year of a thing looks it up on the timeline, then names the book', async ({ page }) => {
  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'في أي سنة كان؟' }).click();
  await page.getByRole('button', { name: 'متشابهات القرآن', exact: true }).click();
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  await expect.poll(() => stored(page, 'quiz-solo-run')).not.toBeNull();
  const run = await stored<{ questions: { promptArabic: string; correctAnswer: string; choices: { value: string; labelArabic: string }[] }[] }>(page, 'quiz-solo-run');
  const question = run!.questions[0];
  // The look-up is a timeline: its strip of years and its filter chips.
  await page.getByRole('button', { name: 'ابحث عن الجواب' }).click();
  await expect(page.getByLabel(/^على سنوات الهجرة/).last()).toBeVisible();
  await page.getByRole('button', { name: 'رجوع إلى السؤال' }).click();
  await choose(page, question.choices[Number(question.correctAnswer)].labelArabic);
  await expect(page.getByText('سير أعلام النبلاء').first()).toBeVisible();
});

test.describe('«رتّب السور»', () => {
  test.use({ seed: { 'quiz-solo-settings': { kinds: ['ORDER'], list: { filters: { categories: 'mutashabeh' }, range: { from: 30, to: 30 }, saved: false }, difficulty: 'medium', leaves: 3, length: 5 } } });

  test('a surah dragged onto its number lands there, a tapped one fills the lit box, and each in its place earns its share', async ({ page }) => {
    await open(page, '/quiz/solo');
    await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
    await expect(page.getByText('اسحب السورة إلى رقمها', { exact: false })).toBeVisible();
    await expect.poll(() => stored(page, 'quiz-solo-run')).not.toBeNull();
    const run = await stored<{ questions: { choices: { value: string; labelArabic: string }[]; order: string[] }[] }>(page, 'quiz-solo-run');
    const { choices, order } = run!.questions[0];
    const name = (value: string) => choices.find(choice => choice.value === value)!.labelArabic;
    // The boxes carry each surah's own number (owner, 2026-11-28); the last surah is dragged onto the last box.
    const last = order[order.length - 1];
    await drag(page, page.getByLabel(name(last), { exact: true }), await middle(page.getByLabel(new RegExp(`^${num(Number(last))}، `))));
    await expect(page.getByLabel(`${num(Number(last))}، ${name(last)}، اضغط لإرجاعها`)).toBeVisible();
    // The first box is still lit: a tap puts the first surah there.
    await page.getByLabel(name(order[0]), { exact: true }).click();
    await page.getByRole('button', { name: 'تحقق' }).click();
    const answer = async () => (await stored<{ typed: (string | undefined)[][] }>(page, 'quiz-solo-run'))!.typed[0][0];
    await expect.poll(answer).toBeDefined();
    const given = (await answer())!.split('\u001f');
    expect(given[0]).toBe(order[0]);
    expect(given[order.length - 1]).toBe(last);
    for (const value of [order[0], last]) await expect(page.getByLabel(`${num(Number(value))} ${name(value)}، في مكانها`)).toBeVisible();
    for (const value of order.slice(1, -1)) await expect(page.getByLabel(`${num(Number(value))} ${name(value)}، لم تضعها`)).toBeVisible();
  });
});
