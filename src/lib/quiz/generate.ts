import { prisma } from '@/lib/prisma';
import { sampleDistinct, shuffleChoices, type Random } from './random';
import type { QuizEligibility, QuizQuestion } from './types';

function evidence(citations: readonly { id: string }[]) {
  return { citationIds: citations.map((c) => c.id) };
}

export async function generateRelationQuestion(
  personSlug: string,
  eligibility: QuizEligibility,
  random: Random,
): Promise<QuizQuestion | null> {
  const claim = await prisma.historicalClaim.findFirst({
    where: {
      subjectKind: 'PERSON',
      subjectSlug: personSlug,
      relationshipType: { not: null },
      relatedSubjectKind: 'PERSON',
      relatedSubjectSlug: { not: null },
      reviewStatus: { in: eligibility.reviewStatuses },
      disputed: false,
    },
    include: { citations: true },
  });
  if (!claim?.relationshipType || !claim.relatedSubjectSlug) return null;

  // docs/plans/quiz-question-engine.md
  const relatedPerson = await prisma.person.findUnique({ where: { slug: claim.relatedSubjectSlug }, select: { slug: true } });
  if (!relatedPerson) return null;

  const trueForSubject = await prisma.historicalClaim.findMany({
    where: { subjectKind: 'PERSON', subjectSlug: personSlug, relationshipType: claim.relationshipType },
    select: { relatedSubjectSlug: true },
  });
  const excluded = trueForSubject.map((c) => c.relatedSubjectSlug).filter((slug): slug is string => slug !== null);

  const otherClaims = await prisma.historicalClaim.findMany({
    where: {
      relationshipType: claim.relationshipType,
      relatedSubjectKind: 'PERSON',
      relatedSubjectSlug: { not: null, notIn: excluded },
      reviewStatus: { in: eligibility.reviewStatuses },
    },
    distinct: ['relatedSubjectSlug'],
    select: { relatedSubjectSlug: true },
  });
  const candidateSlugs = otherClaims.map((c) => c.relatedSubjectSlug!);
  const existingCandidates = await prisma.person.findMany({
    where: { slug: { in: candidateSlugs } },
    select: { slug: true },
  });
  const existingSlugs = new Set(existingCandidates.map((p) => p.slug));
  const distractors = sampleDistinct(
    candidateSlugs.filter((slug) => existingSlugs.has(slug)),
    3,
    random,
  );
  if (!distractors) return null;

  const choices = shuffleChoices(claim.relatedSubjectSlug, distractors, random);
  return {
    claimId: claim.id,
    family: 'RELATION',
    attribute: claim.relationshipType,
    subject: { kind: 'PERSON', slug: personSlug },
    choices,
    correctAnswer: claim.relatedSubjectSlug,
    evidence: evidence(claim.citations),
  };
}

export async function generateParticipationQuestion(
  personSlug: string,
  eligibility: QuizEligibility,
  random: Random,
): Promise<QuizQuestion | null> {
  const claim = await prisma.historicalClaim.findFirst({
    where: {
      subjectKind: 'PERSON',
      subjectSlug: personSlug,
      relationshipType: { in: ['PARTICIPATED_IN', 'ABSENT_FROM'] },
      relatedSubjectKind: 'BATTLE',
      relatedSubjectSlug: { not: null },
      reviewStatus: { in: eligibility.reviewStatuses },
      disputed: false,
    },
    include: { citations: true },
  });
  if (!claim?.relatedSubjectSlug) return null;

  const trueForSubject = await prisma.historicalClaim.findMany({
    where: { subjectKind: 'PERSON', subjectSlug: personSlug, relatedSubjectKind: 'BATTLE' },
    select: { relatedSubjectSlug: true },
  });
  const excluded = trueForSubject.map((c) => c.relatedSubjectSlug).filter((slug): slug is string => slug !== null);

  const battles = await prisma.battle.findMany({ where: { slug: { notIn: excluded } }, select: { slug: true } });
  const distractors = sampleDistinct(
    battles.map((b) => b.slug),
    3,
    random,
  );
  if (!distractors) return null;

  const choices = shuffleChoices(claim.relatedSubjectSlug, distractors, random);
  return {
    claimId: claim.id,
    family: 'PARTICIPATION',
    attribute: claim.relationshipType!,
    subject: { kind: 'PERSON', slug: personSlug },
    choices,
    correctAnswer: claim.relatedSubjectSlug,
    evidence: evidence(claim.citations),
  };
}

/**
 * A "titles" claim names no specific title (no relatedSubjectSlug), so a
 * person's assignment is only unambiguous when they hold exactly one title
 * backed by exactly one eligible claim -- see docs/plans/quiz-question-engine.md.
 */
export async function generateTitleQuestion(
  personSlug: string,
  eligibility: QuizEligibility,
  random: Random,
): Promise<QuizQuestion | null> {
  const [claims, person] = await Promise.all([
    prisma.historicalClaim.findMany({
      where: {
        subjectKind: 'PERSON',
        subjectSlug: personSlug,
        field: 'titles',
        reviewStatus: { in: eligibility.reviewStatuses },
        disputed: false,
      },
      include: { citations: true },
    }),
    prisma.person.findUnique({ where: { slug: personSlug }, include: { titles: { select: { slug: true } } } }),
  ]);
  if (claims.length !== 1 || !person || person.titles.length !== 1) return null;
  const titleSlug = person.titles[0].slug;

  const otherTitles = await prisma.title.findMany({ where: { slug: { not: titleSlug } }, select: { slug: true } });
  const distractors = sampleDistinct(
    otherTitles.map((t) => t.slug),
    3,
    random,
  );
  if (!distractors) return null;

  const choices = shuffleChoices(titleSlug, distractors, random);
  return {
    claimId: claims[0].id,
    family: 'TITLE',
    attribute: 'titles',
    subject: { kind: 'PERSON', slug: personSlug },
    choices,
    correctAnswer: titleSlug,
    evidence: evidence(claims[0].citations),
  };
}

/** Same ambiguity rule as generateTitleQuestion, applied from the title's side. */
export async function generateTitleHolderQuestion(
  titleSlug: string,
  eligibility: QuizEligibility,
  random: Random,
): Promise<QuizQuestion | null> {
  const title = await prisma.title.findUnique({ where: { slug: titleSlug }, include: { people: { select: { slug: true } } } });
  if (!title || title.people.length === 0) return null;
  const candidateSlugs = title.people.map((p) => p.slug);

  const [claims, people] = await Promise.all([
    prisma.historicalClaim.findMany({
      where: {
        subjectKind: 'PERSON',
        subjectSlug: { in: candidateSlugs },
        field: 'titles',
        reviewStatus: { in: eligibility.reviewStatuses },
        disputed: false,
      },
      include: { citations: true },
    }),
    prisma.person.findMany({ where: { slug: { in: candidateSlugs } }, include: { titles: { select: { slug: true } } } }),
  ]);
  const soleHolderOf = new Set(people.filter((p) => p.titles.length === 1).map((p) => p.slug));
  const claimsBySubject = new Map<string, typeof claims>();
  for (const claim of claims) {
    claimsBySubject.set(claim.subjectSlug, [...(claimsBySubject.get(claim.subjectSlug) ?? []), claim]);
  }
  const unambiguousHolders = [...claimsBySubject.entries()]
    .filter(([slug, cs]) => cs.length === 1 && soleHolderOf.has(slug))
    .map(([slug, cs]) => ({ slug, claim: cs[0] }));
  if (unambiguousHolders.length === 0) return null;
  const answer = unambiguousHolders[Math.floor(random() * unambiguousHolders.length)];

  const otherPeople = await prisma.person.findMany({
    where: { titles: { none: { slug: titleSlug } } },
    select: { slug: true },
    take: 200, // ponytail: small sample cap, widen if 3 distinct distractors get hard to find
  });
  const distractors = sampleDistinct(
    otherPeople.map((p) => p.slug),
    3,
    random,
  );
  if (!distractors) return null;

  const choices = shuffleChoices(answer.slug, distractors, random);
  return {
    claimId: answer.claim.id,
    family: 'TITLE_HOLDER',
    attribute: 'titles',
    subject: { kind: 'TITLE', slug: titleSlug },
    choices,
    correctAnswer: answer.slug,
    evidence: evidence(answer.claim.citations),
  };
}

export async function generateNameQuestion(
  personSlug: string,
  eligibility: QuizEligibility,
  random: Random,
): Promise<QuizQuestion | null> {
  const claim = await prisma.historicalClaim.findFirst({
    where: {
      subjectKind: 'PERSON',
      subjectSlug: personSlug,
      field: 'kunya',
      reviewStatus: { in: eligibility.reviewStatuses },
      disputed: false,
    },
    include: { citations: true },
  });
  if (!claim) return null;
  const person = await prisma.person.findUnique({ where: { slug: personSlug } });
  if (!person?.kunya) return null;

  const others = await prisma.person.findMany({
    where: { kunya: { not: null }, slug: { not: personSlug } },
    select: { kunya: true },
    distinct: ['kunya'],
  });
  const distractors = sampleDistinct(
    others.map((p) => p.kunya!).filter((k) => k !== person.kunya),
    3,
    random,
  );
  if (!distractors) return null;

  const choices = shuffleChoices(person.kunya, distractors, random);
  return {
    claimId: claim.id,
    family: 'NAME',
    attribute: 'kunya',
    subject: { kind: 'PERSON', slug: personSlug },
    choices,
    correctAnswer: person.kunya,
    evidence: evidence(claim.citations),
  };
}

export async function generateEventQuestion(
  eventSlug: string,
  eligibility: QuizEligibility,
  random: Random,
): Promise<QuizQuestion | null> {
  const claim = await prisma.historicalClaim.findFirst({
    where: {
      subjectKind: 'EVENT',
      subjectSlug: eventSlug,
      field: 'hijriYear',
      reviewStatus: { in: eligibility.reviewStatuses },
      disputed: false,
    },
    include: { citations: true },
  });
  if (!claim) return null;
  const event = await prisma.event.findUnique({ where: { slug: eventSlug } });
  if (event?.hijriYear == null) return null;

  const others = await prisma.event.findMany({
    where: { hijriYear: { not: null }, slug: { not: eventSlug } },
    select: { hijriYear: true },
    distinct: ['hijriYear'],
  });
  const distractors = sampleDistinct(
    others.map((e) => String(e.hijriYear)).filter((year) => year !== String(event.hijriYear)),
    3,
    random,
  );
  if (!distractors) return null;

  const choices = shuffleChoices(String(event.hijriYear), distractors, random);
  return {
    claimId: claim.id,
    family: 'EVENT',
    attribute: 'hijriYear',
    subject: { kind: 'EVENT', slug: eventSlug },
    choices,
    correctAnswer: String(event.hijriYear),
    evidence: evidence(claim.citations),
  };
}

/**
 * A "ayat" claim backs the person having Qur'an links at all, not one specific
 * ayah -- the answer is drawn from their linked ayat directly, per
 * docs/plans/quiz-question-engine.md.
 */
export async function generateQuranLinkQuestion(
  personSlug: string,
  eligibility: QuizEligibility,
  random: Random,
): Promise<QuizQuestion | null> {
  const claim = await prisma.historicalClaim.findFirst({
    where: {
      subjectKind: 'PERSON',
      subjectSlug: personSlug,
      field: 'ayat',
      reviewStatus: { in: eligibility.reviewStatuses },
      disputed: false,
    },
    include: { citations: true },
  });
  if (!claim) return null;
  const person = await prisma.person.findUnique({
    where: { slug: personSlug },
    include: { ayat: { include: { surah: { select: { number: true } } } } },
  });
  if (!person || person.ayat.length === 0) return null;

  const linked = person.ayat.map((a) => `${a.surah.number}:${a.number}`);
  const correct = linked[Math.floor(random() * linked.length)];
  const excluded = new Set(linked);

  const others = await prisma.ayah.findMany({
    where: { people: { none: { slug: personSlug } } },
    include: { surah: { select: { number: true } } },
    take: 100, // ponytail: small sample cap, widen if 3 distinct distractors get hard to find
  });
  const pool = new Set(others.map((a) => `${a.surah.number}:${a.number}`).filter((v) => !excluded.has(v)));
  const distractors = sampleDistinct([...pool], 3, random);
  if (!distractors) return null;

  const choices = shuffleChoices(correct, distractors, random);
  return {
    claimId: claim.id,
    family: 'QURAN_LINK',
    attribute: 'ayat',
    subject: { kind: 'PERSON', slug: personSlug },
    choices,
    correctAnswer: correct,
    evidence: evidence(claim.citations),
  };
}
