import 'dotenv/config';
import { mergeQuestionBank, readQuestionBank, writeQuestionBank } from '../../src/lib/quiz/bank';
import { generateQuestionCandidates } from '../../src/lib/quiz/generate';

async function main() {
  const previous = readQuestionBank();
  const generated = await generateQuestionCandidates();
  const bank = mergeQuestionBank(previous, generated);
  writeQuestionBank(bank);
  const counts = new Map<string, number>();
  bank.questions.forEach((question) => counts.set(question.status, (counts.get(question.status) ?? 0) + 1));
  console.log(`generated ${generated.length} candidates`);
  console.log(`bank ${bank.questions.length}: ${[...counts].map(([status, count]) => `${status}=${count}`).join(', ')}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
