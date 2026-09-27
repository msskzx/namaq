import { readQuestionBank, validateQuestionBank } from '../../src/lib/quiz/bank';

const bank = readQuestionBank();
const issues = validateQuestionBank(bank);
console.log(`quiz bank: ${bank.questions.length} questions`);
if (issues.length === 0) {
  console.log('no issues');
} else {
  issues.forEach((issue) => console.log(`  ${issue}`));
  console.log(`${issues.length} issue(s)`);
  process.exitCode = 1;
}
