import { readQuestionBank, writeQuestionBank } from '../../src/lib/quiz/bank';
import type { QuestionStatus } from '../../src/lib/quiz/types';

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const key = argument('--key');
const family = argument('--family');
const attribute = argument('--attribute');
const answer = argument('--answer');
const subject = argument('--subject');
const status = argument('--status') as QuestionStatus | undefined;
const reason = argument('--reason') ?? null;
const prompt = argument('--prompt') ?? null;
const reviewer = argument('--reviewer') ?? 'Codex';

if ((!key && !family && !attribute && !answer && !subject) || !status || !['APPROVED', 'REJECTED'].includes(status)) {
  console.error('usage: npm run quiz:review -- [--key <key>] [--family <family>] [--attribute <attribute>] [--answer <value>] [--subject <slug>] --status APPROVED|REJECTED [--reason <text>] [--prompt <Arabic>] [--reviewer <name>]');
  process.exit(1);
}
if (status === 'REJECTED' && !reason) {
  console.error('a rejected question needs --reason');
  process.exit(1);
}

const bank = readQuestionBank();
const questions = bank.questions.filter((entry) =>
  entry.status !== 'RETIRED' &&
  (!key || entry.key === key) && (!family || entry.family === family) && (!attribute || entry.attribute === attribute) &&
  (!answer || entry.correctAnswer === answer) && (!subject || entry.subject?.slug === subject),
);
if (questions.length === 0) {
  console.error('no matching questions');
  process.exit(1);
}
if (prompt && questions.length !== 1) {
  console.error('a prompt override requires exactly one matching question');
  process.exit(1);
}

for (const question of questions) {
  question.status = status;
  question.rejectionReason = status === 'REJECTED' ? reason : null;
  question.promptArabicOverride = prompt;
  question.reviewedAt = new Date().toISOString();
  question.reviewedBy = reviewer;
}
writeQuestionBank(bank);
console.log(`${status.toLowerCase()}: ${questions.length} question(s)`);
