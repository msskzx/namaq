import { describe, expect, it } from 'vitest';
import { mergeQuestionBank, questionFingerprint, validateQuestionBank } from './bank';
import type { GeneratedQuestion, QuestionBank } from './types';

const generated: GeneratedQuestion = {
  key: 'KUNYA:PERSON:person:kunya:a',
  family: 'KUNYA',
  topic: 'PEOPLE',
  subject: { kind: 'PERSON', slug: 'person' },
  attribute: 'kunya',
  personSlugs: ['person'],
  promptArabic: 'ما كنيته؟',
  choices: [
    { value: 'a', labelArabic: 'أ' },
    { value: 'b', labelArabic: 'ب' },
    { value: 'c', labelArabic: 'ج' },
    { value: 'd', labelArabic: 'د' },
  ],
  correctAnswer: 'a',
  evidence: { claimKeys: ['claim'] },
};

describe('question bank lifecycle', () => {
  it('preserves an unchanged review decision', () => {
    const first = mergeQuestionBank({ version: 1, generatedAt: '', questions: [] }, [generated]);
    first.questions[0] = { ...first.questions[0], status: 'APPROVED', reviewedAt: '2026-09-27', reviewedBy: 'Codex' };
    expect(mergeQuestionBank(first, [generated]).questions[0].status).toBe('APPROVED');
  });

  it('returns changed generated content to pending', () => {
    const first = mergeQuestionBank({ version: 1, generatedAt: '', questions: [] }, [generated]);
    first.questions[0] = { ...first.questions[0], status: 'APPROVED', reviewedAt: '2026-09-27', reviewedBy: 'Codex' };
    expect(mergeQuestionBank(first, [{ ...generated, promptArabic: 'ما هي كنيته؟' }]).questions[0].status).toBe('PENDING');
  });

  it('retires a question that is no longer generated', () => {
    const first = mergeQuestionBank({ version: 1, generatedAt: '', questions: [] }, [generated]);
    expect(mergeQuestionBank(first, []).questions[0].status).toBe('RETIRED');
  });

  it('returns a reappearing retired question to pending review', () => {
    const first = mergeQuestionBank({ version: 1, generatedAt: '', questions: [] }, [generated]);
    const retired = mergeQuestionBank(first, []);
    expect(mergeQuestionBank(retired, [generated]).questions[0].status).toBe('PENDING');
  });

  it('validates a reviewed complete question', () => {
    const question = {
      ...generated,
      fingerprint: questionFingerprint(generated),
      promptArabicOverride: null,
      status: 'APPROVED' as const,
      rejectionReason: null,
      reviewedAt: '2026-09-27',
      reviewedBy: 'Codex',
    };
    const bank: QuestionBank = { version: 1, generatedAt: '', questions: [question] };
    expect(validateQuestionBank(bank)).toEqual([]);
  });
});
