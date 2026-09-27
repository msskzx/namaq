import { prisma } from '@/lib/prisma';
import {
  generateEventQuestion,
  generateNameQuestion,
  generateParticipationQuestion,
  generateQuranLinkQuestion,
  generateRelationQuestion,
  generateTitleHolderQuestion,
  generateTitleQuestion,
} from './generate';
import { shuffle, type Random } from './random';
import type { QuestionFamily, QuizEligibility, QuizLength, QuizQuestion, QuizTopic } from './types';

type Generator = (subjectSlug: string, eligibility: QuizEligibility, random: Random) => Promise<QuizQuestion | null>;

const GENERATORS: Record<QuestionFamily, Generator> = {
  RELATION: generateRelationQuestion,
  PARTICIPATION: generateParticipationQuestion,
  TITLE: generateTitleQuestion,
  TITLE_HOLDER: generateTitleHolderQuestion,
  NAME: generateNameQuestion,
  EVENT: generateEventQuestion,
  QURAN_LINK: generateQuranLinkQuestion,
};

const PERSON_FAMILIES: QuestionFamily[] = ['RELATION', 'TITLE', 'NAME', 'QURAN_LINK', 'PARTICIPATION'];

const FAMILIES_BY_TOPIC: Record<Exclude<QuizTopic, 'PERSON_CIRCLE'>, QuestionFamily[]> = {
  PEOPLE: PERSON_FAMILIES,
  BATTLES: ['PARTICIPATION'],
  TITLES: ['TITLE_HOLDER'],
  EVENTS: ['EVENT'],
};

/**
 * A loose candidate pool per family -- matches the family's rough shape, not
 * full eligibility. The generator itself does the precise check and returns
 * null for a candidate that doesn't pan out, so this only needs to be a
 * reasonable set to try, not a guaranteed-eligible one.
 */
async function candidateSubjects(family: QuestionFamily): Promise<string[]> {
  if (family === 'TITLE_HOLDER') {
    const titles = await prisma.title.findMany({ where: { people: { some: {} } }, select: { slug: true } });
    return titles.map((t) => t.slug);
  }
  const where =
    family === 'RELATION'
      ? { subjectKind: 'PERSON' as const, relationshipType: { not: null } }
      : family === 'PARTICIPATION'
        ? { subjectKind: 'PERSON' as const, relatedSubjectKind: 'BATTLE' as const }
        : family === 'TITLE'
          ? { subjectKind: 'PERSON' as const, field: 'titles' }
          : family === 'NAME'
            ? { subjectKind: 'PERSON' as const, field: 'kunya' }
            : family === 'QURAN_LINK'
              ? { subjectKind: 'PERSON' as const, field: 'ayat' }
              : { subjectKind: 'EVENT' as const, field: 'hijriYear' };
  const rows = await prisma.historicalClaim.findMany({ where, distinct: ['subjectSlug'], select: { subjectSlug: true } });
  return rows.map((r) => r.subjectSlug);
}

export interface AssembleQuizParams {
  topic: QuizTopic;
  /** Required, and the only subject used, when topic is PERSON_CIRCLE. */
  personSlug?: string;
  length: QuizLength;
  eligibility: QuizEligibility;
  random: Random;
}

/**
 * Builds up to `length` questions, skipping a candidate that fails to
 * generate and one whose claim is already used by another question in this
 * quiz -- see docs/plans/solo-quiz.md, "A question's identity is its
 * claimId".
 *
 * ponytail: tries candidates one at a time in sequence rather than batching;
 * fine at this data size, revisit if assembling a quiz gets slow.
 */
export async function assembleQuiz({
  topic,
  personSlug,
  length,
  eligibility,
  random,
}: AssembleQuizParams): Promise<QuizQuestion[]> {
  const attempts: { family: QuestionFamily; slug: string }[] = [];
  if (topic === 'PERSON_CIRCLE') {
    if (!personSlug) return [];
    for (const family of PERSON_FAMILIES) attempts.push({ family, slug: personSlug });
  } else {
    for (const family of FAMILIES_BY_TOPIC[topic]) {
      for (const slug of await candidateSubjects(family)) attempts.push({ family, slug });
    }
  }
  const order = shuffle(attempts, random);

  const questions: QuizQuestion[] = [];
  const usedClaimIds = new Set<string>();
  for (const attempt of order) {
    if (questions.length >= length) break;
    const question = await GENERATORS[attempt.family](attempt.slug, eligibility, random);
    if (!question || usedClaimIds.has(question.claimId)) continue;
    usedClaimIds.add(question.claimId);
    questions.push(question);
  }
  return questions;
}
