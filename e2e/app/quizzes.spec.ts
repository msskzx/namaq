import type { Page } from '@playwright/test';
import { branchNodes, givenAnswer } from '../../shared/quiz/branchAnswers';
import type { Branch } from '../../shared/quran/branches';
import { expect, open, readerPage, stored, tab, test } from './fixtures';

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

const leaves = (page: Page) => page.getByLabel(/^الطرف /);

test.beforeEach(async ({ page }) => {
  // The same questions every run: Math.random seeded before the app starts.
  await page.addInitScript(() => {
    let seed = 7;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  });
});

test('the quizzes tab opens every quiz', async ({ page }) => {
  await open(page, '/');
  await tab(page, 'الاختبارات').click();
  for (const name of ['اختبار فردي', 'اختبار جماعي', 'تسميع', 'اكتب أول الآية وآخرها']) await expect(page.getByRole('link', { name: new RegExp(`^${name}`) })).toBeVisible();
  await page.getByRole('link', { name: /^اكتب أول الآية وآخرها/ }).click();
  await expect(page.getByRole('button', { name: 'اكتب هذه الكلمة' }).first()).toBeVisible();
});

test('a solo quiz: right, wrong and shown answers, resume after reload, then the result', async ({ page }) => {
  await open(page, '/quiz/solo');
  await page.getByRole('button', { name: 'ابدأ الاختبار' }).click();
  await expect(page).toHaveURL(/\/quiz\/play/);
  await expect(leaves(page).first()).toBeVisible();

  const right = await answersOf(page, 0);
  await expect(leaves(page)).toHaveCount(right.length);
  for (const [i, answer] of right.entries()) await leaves(page).nth(i).fill(answer);
  await page.getByRole('button', { name: 'عرض المصفوفة' }).first().click();
  await expect(leaves(page).first()).toHaveValue(right[0]);
  await page.getByRole('button', { name: 'عرض الشجرة' }).first().click();
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

test('recite mode on the mushaf shows the next ayah on a tap', async ({ page }) => {
  await open(page, '/');
  await page.getByRole('button', { name: 'تسميع', exact: true }).click();
  await expect(page.getByRole('button', { name: 'أظهر الآية التالية' })).toBeVisible();
  const before = await stored<{ position: { shown: string | null } }>(page, 'reader-place');
  await page.getByRole('button', { name: 'أظهر الآية التالية' }).click();
  await expect.poll(async () => (await stored<{ position: { shown: string | null } }>(page, 'reader-place'))?.position?.shown).not.toBe(before?.position?.shown ?? null);
  expect(await readerPage(page)).not.toBeNull();
});
