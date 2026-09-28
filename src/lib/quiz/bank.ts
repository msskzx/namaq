import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { QUESTION_FAMILIES, QUESTION_STATUSES, QUIZ_TOPICS } from './types';
import type { GeneratedQuestion, QuestionBank, QuestionBankEntry } from './types';

export const questionBankPath = 'data/quiz/questions.json';

export function questionFingerprint(question: GeneratedQuestion) {
  return createHash('sha256')
    .update(JSON.stringify({
      family: question.family,
      topic: question.topic,
      subject: question.subject,
      attribute: question.attribute,
      personSlugs: [...question.personSlugs].sort(),
      promptArabic: question.promptArabic,
      choices: [...question.choices].sort((a, b) => a.value.localeCompare(b.value)),
      correctAnswer: question.correctAnswer,
      evidence: question.evidence,
    }))
    .digest('hex');
}

export function emptyQuestionBank(): QuestionBank {
  return { version: 1, generatedAt: new Date(0).toISOString(), questions: [] };
}

export function readQuestionBank(path = questionBankPath): QuestionBank {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as QuestionBank;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return emptyQuestionBank();
    throw error;
  }
}

export function writeQuestionBank(bank: QuestionBank, path = questionBankPath) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(bank, null, 2)}\n`);
}

export function mergeQuestionBank(previous: QuestionBank, generated: GeneratedQuestion[], now = new Date()): QuestionBank {
  const oldByKey = new Map(previous.questions.map((question) => [question.key, question]));
  const generatedKeys = new Set(generated.map((question) => question.key));
  const questions: QuestionBankEntry[] = generated.map((question) => {
    const fingerprint = questionFingerprint(question);
    const old = oldByKey.get(question.key);
    if (old?.fingerprint === fingerprint && old.status !== 'RETIRED') return { ...question, ...old, fingerprint };
    return {
      ...question,
      fingerprint,
      promptArabicOverride: null,
      status: 'PENDING',
      rejectionReason: null,
      reviewedAt: null,
      reviewedBy: null,
    };
  });

  for (const old of previous.questions) {
    if (!generatedKeys.has(old.key)) {
      questions.push({ ...old, status: 'RETIRED', rejectionReason: old.rejectionReason ?? 'لم يعد السؤال يُولَّد من البيانات الحالية.' });
    }
  }

  questions.sort((a, b) => a.key.localeCompare(b.key));
  return { version: 1, generatedAt: now.toISOString(), questions };
}

export function validateQuestionBank(bank: QuestionBank): string[] {
  const issues: string[] = [];
  const keys = new Set<string>();
  if (bank.version !== 1) issues.push(`version: expected 1, received ${String(bank.version)}`);
  for (const question of bank.questions) {
    const at = `questions/${question.key}`;
    if (keys.has(question.key)) issues.push(`${at}: duplicate key`);
    keys.add(question.key);
    if (!QUESTION_FAMILIES.includes(question.family)) issues.push(`${at}: unknown family ${question.family}`);
    if (!QUIZ_TOPICS.includes(question.topic)) issues.push(`${at}: unknown topic ${question.topic}`);
    if (!QUESTION_STATUSES.includes(question.status)) issues.push(`${at}: unknown status ${question.status}`);
    if (question.choices.length !== 4) issues.push(`${at}: expected 4 choices`);
    if (new Set(question.choices.map((choice) => choice.value)).size !== question.choices.length) issues.push(`${at}: choice values must be distinct`);
    if (!question.choices.some((choice) => choice.value === question.correctAnswer)) issues.push(`${at}: correct answer is not a choice`);
    if (question.evidence.claimKeys.length === 0) issues.push(`${at}: evidence is required`);
    if (!(question.promptArabicOverride ?? question.promptArabic).trim()) issues.push(`${at}: Arabic prompt is required`);
    if (question.status === 'PENDING') issues.push(`${at}: review is pending`);
    if (question.status === 'APPROVED' && (!question.reviewedAt || !question.reviewedBy)) issues.push(`${at}: approved question needs reviewer audit fields`);
    if (question.status === 'REJECTED' && !question.rejectionReason?.trim()) issues.push(`${at}: rejected question needs a reason`);
    if (question.fingerprint !== questionFingerprint(question)) issues.push(`${at}: fingerprint is stale`);
  }
  return issues;
}
