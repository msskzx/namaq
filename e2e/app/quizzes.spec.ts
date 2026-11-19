import type { Page } from '@playwright/test';
import { branchNodes, givenAnswer } from '../../shared/quiz/branchAnswers';
import type { Branch } from '../../shared/quran/branches';
import { num } from '../../shared/quran/arabicNumber';
import { numberVerses, type Poem } from '../../shared/tajwid/poem';
import poemData from '../../shared/tajwid/tuhfat-al-atfal.json';

const chapters = numberVerses(poemData as Poem);
import { expect, open, stored, tab, test } from './fixtures';

type Run = { questions: { tree: Branch; asked: number[] }[]; current: number };

/** The answer typed for each asked leaf of a question: its words as the tree writes them. */
const answersOf = async (page: Page, index: number) => {
  // The run reaches storage a moment after it starts (mobile/src/lib/soloStore.ts).
  await expect.poll(() => stored(page, 'quiz-solo-run')).not.toBeNull();
  const run = await stored<Run>(page, 'quiz-solo-run');
  const question = run!.questions[index];
  const nodes = branchNodes(question.tree);
  return question.asked.map(node => givenAnswer(nodes[node]));
};

// The quiz explainer draws a read-only example; only the question's own boxes count.
const leaves = (page: Page) => page.locator('input:not([readonly])').and(page.getByLabel(/^الطرف /));

test.beforeEach(async ({ page }) => {
  // The same questions every run: Math.random seeded before the app starts.
  await page.addInitScript(() => {
    let seed = 7;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  });
});

test('the quizzes tab holds solo and party only, and the written kinds are asked inside the quiz', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'الاختبارات').click();
  // Two cards (owner, 2026-11-17): every kind of question is picked inside them.
  await expect(page.getByRole('link')).toHaveText([/^اختبار فردي/, /^اختبار جماعي/]);
  await page.getByRole('link', { name: /^اختبار فردي/ }).click();
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

test('a solo quiz: right, wrong and shown answers, resume after reload, then the result', async ({ page }) => {
  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  await expect(leaves(page).first()).toBeVisible();

  const right = await answersOf(page, 0);
  await expect(leaves(page)).toHaveCount(right.length);
  for (const [i, answer] of right.entries()) await leaves(page).nth(i).fill(answer);
  // Quizzes draw the matrix only (owner, 2026-11-17).
  await expect(page.getByRole('button', { name: 'عرض الشجرة' })).toHaveCount(0);
  await page.getByRole('button', { name: 'تحقق', exact: true }).click();
  await expect(page.getByLabel('السؤال ١ - صحيح')).toBeVisible();

  await page.getByRole('button', { name: 'التالي' }).click();
  await expect(leaves(page).first()).toHaveValue('');
  const count = await leaves(page).count();
  for (let i = 0; i < count; i++) await leaves(page).nth(i).fill('كلام خطأ');
  await page.getByRole('button', { name: 'تحقق', exact: true }).click();
  await expect(page.getByLabel('السؤال ٢ - خطأ')).toBeVisible();

  await page.getByRole('button', { name: 'التالي' }).click();
  await page.getByRole('button', { name: 'إظهار الإجابة' }).click();
  await expect(page.getByLabel(/^السؤال ٣ - /)).toBeVisible();

  await page.getByRole('button', { name: 'التالي' }).click();
  await leaves(page).first().fill('شيء');
  await expect.poll(async () => JSON.stringify(await stored(page, 'quiz-solo-run'))).toContain('شيء');
  await page.reload();
  await expect(leaves(page).first()).toHaveValue('شيء');
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
    } else await page.getByRole('button', { name: question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic, exact: true }).click();
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
  const blanks = page.getByLabel(/^الفراغ /);
  const first = run!.questions[0].compare;
  await expect(blanks).toHaveCount(first.blanks.length);
  // No tree to switch to (owner, 2026-11-17).
  await expect(page.getByRole('button', { name: 'عرض الشجرة' })).toHaveCount(0);
  for (const [i, [from, to]] of first.blanks.entries()) await blanks.nth(i).fill(first.asked.words.slice(from, to).join(' '));
  await page.getByRole('button', { name: 'تحقق', exact: true }).click();
  await expect(page.getByLabel('السؤال ١ - صحيح')).toBeVisible();
  await expect(page.getByRole('button', { name: 'افتح في مقارنة السور' })).toBeVisible();

  await page.getByRole('button', { name: 'التالي' }).click();
  await blanks.first().fill('كلام خطأ');
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
test('a solo quiz of the sira and battles: pick the right answers, each shows its source, then the result', async ({ page }) => {
  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'السيرة والغزوات' }).click();
  await page.getByRole('button', { name: 'متشابهات القرآن', exact: true }).click();
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  await expect.poll(() => stored(page, 'quiz-solo-run')).not.toBeNull();
  const run = await stored<{ questions: { family: string; correctAnswer: string; choices: { value: string; labelArabic: string }[] }[] }>(page, 'quiz-solo-run');
  expect(run!.questions.every(question => question.family === 'SIRA')).toBe(true);
  for (const [index, question] of run!.questions.entries()) {
    await page.getByRole('button', { name: question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic, exact: true }).click();
    await expect(page.getByText(/سير أعلام النبلاء|صحيح البخاري/).first()).toBeVisible();
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
  await page.getByRole('button', { name: question.correctAnswer, exact: true }).click();
  await expect(page.getByRole('button', { name: 'ابحث عن الجواب' })).toHaveCount(0);
  // Only the chapter of the verse that answers, the verse lit.
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
  await page.getByRole('button', { name: question.choices[Number(question.correctAnswer)].labelArabic, exact: true }).click();
  await expect(page.getByText('سير أعلام النبلاء').first()).toBeVisible();
});
