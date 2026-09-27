import { NextResponse } from 'next/server';
import type { SubjectKind } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { assembleQuiz } from '@/lib/quiz/assemble';
import {
  DEVELOPMENT_ELIGIBILITY,
  QUIZ_LENGTHS,
  QUIZ_TOPICS,
  type QuestionFamily,
  type QuizLength,
  type QuizTopic,
} from '@/lib/quiz/types';

/**
 * A citation's reader link, when one exists -- see
 * src/components/common/ClaimEvidence.tsx for the same URL shape. Only a
 * PERSON-subject citation has a profile reader to link to today.
 */
interface EvidenceLink {
  citationId: string;
  readerUrl: string | null;
}

async function resolveEvidence(citationIds: readonly string[]): Promise<EvidenceLink[]> {
  if (citationIds.length === 0) return [];
  const citations = await prisma.citation.findMany({
    where: { id: { in: [...citationIds] } },
    include: { passage: { include: { page: true } } },
  });
  return citations.map((citation) => ({
    citationId: citation.id,
    readerUrl:
      citation.subjectKind === 'PERSON' && citation.passage?.page
        ? `/people/${citation.subjectSlug}?book=${citation.passage.page.accountId}&page=${citation.passage.page.sequence}`
        : null,
  }));
}

interface DisplayName {
  name: string;
  nameTransliterated: string | null;
}

interface AyahDisplay {
  text: string;
  reference: string;
}

async function resolveAyahDetails(questions: readonly { family: string; choices: readonly string[] }[]) {
  const keys = [...new Set(questions.filter((q) => q.family === 'QURAN_LINK').flatMap((q) => q.choices))];
  const pairs = keys.flatMap((key) => {
    const [surah, number] = key.split(':').map(Number);
    return Number.isInteger(surah) && Number.isInteger(number) ? [{ surah, number }] : [];
  });
  if (!pairs.length) return new Map<string, AyahDisplay>();
  const ayat = await prisma.ayah.findMany({
    where: { OR: pairs.map(({ surah, number }) => ({ number, surah: { number: surah } })) },
    include: { surah: { select: { number: true, name: true, nameTransliterated: true } } },
  });
  return new Map(ayat.map((ayah) => [`${ayah.surah.number}:${ayah.number}`, {
    text: ayah.text,
    reference: `${ayah.surah.nameTransliterated || ayah.surah.name} ${ayah.surah.number}:${ayah.number}`,
  }]));
}

/**
 * The kind a family's choices are slugs of, so the client can show a name
 * instead of the raw slug. NAME (a kunya) and EVENT (a year) are already
 * human-readable values, not slugs, so they're absent here.
 */
const CHOICE_SUBJECT_KIND: Partial<Record<QuestionFamily, SubjectKind>> = {
  RELATION: 'PERSON',
  PARTICIPATION: 'BATTLE',
  TITLE: 'TITLE',
  TITLE_HOLDER: 'PERSON',
};

async function resolveDisplayNames(
  questions: readonly { family: string; subject: { kind: SubjectKind; slug: string }; choices: readonly string[] }[],
): Promise<Record<SubjectKind, Map<string, DisplayName>>> {
  const slugsByKind: Record<SubjectKind, Set<string>> = {
    PERSON: new Set(),
    TITLE: new Set(),
    BATTLE: new Set(),
    EVENT: new Set(),
  };
  for (const question of questions) {
    slugsByKind[question.subject.kind].add(question.subject.slug);
    const choiceKind = CHOICE_SUBJECT_KIND[question.family as QuestionFamily];
    if (choiceKind) for (const choice of question.choices) slugsByKind[choiceKind].add(choice);
  }

  const select = { slug: true, name: true, nameTransliterated: true } as const;
  const [people, titles, battles, events] = await Promise.all([
    slugsByKind.PERSON.size ? prisma.person.findMany({ where: { slug: { in: [...slugsByKind.PERSON] } }, select }) : [],
    slugsByKind.TITLE.size ? prisma.title.findMany({ where: { slug: { in: [...slugsByKind.TITLE] } }, select }) : [],
    slugsByKind.BATTLE.size ? prisma.battle.findMany({ where: { slug: { in: [...slugsByKind.BATTLE] } }, select }) : [],
    slugsByKind.EVENT.size ? prisma.event.findMany({ where: { slug: { in: [...slugsByKind.EVENT] } }, select }) : [],
  ]);

  const toDisplayName = ({ name, nameTransliterated }: { name: string; nameTransliterated: string | null }) => ({
    name,
    nameTransliterated,
  });
  return {
    PERSON: new Map(people.map((p) => [p.slug, toDisplayName(p)])),
    TITLE: new Map(titles.map((t) => [t.slug, toDisplayName(t)])),
    BATTLE: new Map(battles.map((b) => [b.slug, toDisplayName(b)])),
    EVENT: new Map(events.map((e) => [e.slug, toDisplayName(e)])),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topics = [...new Set(searchParams.getAll('topic').flatMap((value) => value.split(',').filter(Boolean)))];
  const length = Number(searchParams.get('length'));
  const person = searchParams.get('person') ?? undefined;

  if (!topics.length || topics.some((topic) => !QUIZ_TOPICS.includes(topic as QuizTopic))) {
    return NextResponse.json({ error: 'Unknown topic', topics: QUIZ_TOPICS }, { status: 400 });
  }
  if (!QUIZ_LENGTHS.includes(length as QuizLength)) {
    return NextResponse.json({ error: 'Unknown length', lengths: QUIZ_LENGTHS }, { status: 400 });
  }
  if (topics.includes('PERSON_CIRCLE') && !person) {
    return NextResponse.json({ error: 'This topic needs a person' }, { status: 400 });
  }

  try {
    const eligibility = DEVELOPMENT_ELIGIBILITY;
    const questions = await assembleQuiz({
      topics: topics as QuizTopic[],
      personSlug: person,
      length: length as QuizLength,
      eligibility,
      random: Math.random,
    });

    const citationIds = [...new Set(questions.flatMap((q) => q.evidence.citationIds))];
    const [evidence, namesByKind, ayahDetails] = await Promise.all([
      resolveEvidence(citationIds),
      resolveDisplayNames(questions),
      resolveAyahDetails(questions),
    ]);
    const evidenceByCitationId = new Map(evidence.map((e) => [e.citationId, e]));
    const withEvidenceLinks = questions.map((question) => {
      const choiceKind = CHOICE_SUBJECT_KIND[question.family as QuestionFamily];
      const choiceLabels: Record<string, DisplayName> = {};
      if (choiceKind) {
        for (const choice of question.choices) {
          const resolved = namesByKind[choiceKind].get(choice);
          if (resolved) choiceLabels[choice] = resolved;
        }
      }
      return {
        ...question,
        subjectName: namesByKind[question.subject.kind].get(question.subject.slug) ?? null,
        choiceLabels,
        choiceDetails: Object.fromEntries(
          question.choices
            .map((choice) => [choice, ayahDetails.get(choice)])
            .filter((entry): entry is [string, AyahDisplay] => Boolean(entry[1])),
        ),
        evidence: {
          ...question.evidence,
          readerUrls: question.evidence.citationIds
            .map((id) => evidenceByCitationId.get(id)?.readerUrl)
            .filter((url): url is string => Boolean(url)),
        },
      };
    });

    return NextResponse.json({ questions: withEvidenceLinks });
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json({ error: 'Failed to build the quiz' }, { status: 500 });
  }
}
