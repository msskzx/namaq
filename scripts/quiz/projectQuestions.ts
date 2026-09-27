import 'dotenv/config';
import { Prisma, PrismaClient } from '../../src/generated/prisma';
import { readQuestionBank, validateQuestionBank } from '../../src/lib/quiz/bank';

const apply = process.argv.includes('--apply');
const prisma = new PrismaClient();

async function main() {
  const bank = readQuestionBank();
  const issues = validateQuestionBank(bank);
  if (issues.length > 0) throw new Error(`question bank has ${issues.length} validation issue(s)`);
  const live = await prisma.quizQuestion.findMany({ select: { key: true, fingerprint: true, status: true } });
  const liveByKey = new Map(live.map((row) => [row.key, row]));
  const changed = bank.questions.filter((question) => {
    const row = liveByKey.get(question.key);
    return !row || row.fingerprint !== question.fingerprint || row.status !== question.status;
  });
  const wanted = new Set(bank.questions.map((question) => question.key));
  const stale = live.filter((row) => !wanted.has(row.key));
  console.log(`${changed.length} changed row(s), ${stale.length} stale row(s)${apply ? '' : ' (dry run)'}`);
  if (!apply) return;

  const rows = bank.questions.map((question) => ({
    key: question.key,
    fingerprint: question.fingerprint,
    family: question.family,
    topic: question.topic,
    subjectKind: question.subject?.kind,
    subjectSlug: question.subject?.slug,
    attribute: question.attribute,
    personSlugs: question.personSlugs,
    generatedPromptArabic: question.promptArabic,
    promptArabicOverride: question.promptArabicOverride,
    choices: question.choices as unknown as Prisma.InputJsonValue,
    correctAnswer: question.correctAnswer,
    evidence: question.evidence as unknown as Prisma.InputJsonValue,
    status: question.status,
    rejectionReason: question.rejectionReason,
    reviewedAt: question.reviewedAt,
    reviewedBy: question.reviewedBy,
  }));
  await prisma.$transaction([
    prisma.quizQuestion.deleteMany(),
    prisma.quizQuestion.createMany({ data: rows }),
  ]);
  console.log('question bank projected');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
