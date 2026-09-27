import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { assembleQuiz } from '@/lib/quiz/assemble';
import {
  DEVELOPMENT_ELIGIBILITY,
  PRODUCTION_ELIGIBILITY,
  QUIZ_LENGTHS,
  QUIZ_TOPICS,
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const length = Number(searchParams.get('length'));
  const person = searchParams.get('person') ?? undefined;

  if (!QUIZ_TOPICS.includes(topic as QuizTopic)) {
    return NextResponse.json({ error: 'Unknown topic', topics: QUIZ_TOPICS }, { status: 400 });
  }
  if (!QUIZ_LENGTHS.includes(length as QuizLength)) {
    return NextResponse.json({ error: 'Unknown length', lengths: QUIZ_LENGTHS }, { status: 400 });
  }
  if (topic === 'PERSON_CIRCLE' && !person) {
    return NextResponse.json({ error: 'This topic needs a person' }, { status: 400 });
  }

  try {
    const eligibility = process.env.NODE_ENV === 'production' ? PRODUCTION_ELIGIBILITY : DEVELOPMENT_ELIGIBILITY;
    const questions = await assembleQuiz({
      topic: topic as QuizTopic,
      personSlug: person,
      length: length as QuizLength,
      eligibility,
      random: Math.random,
    });

    const citationIds = [...new Set(questions.flatMap((q) => q.evidence.citationIds))];
    const evidence = await resolveEvidence(citationIds);
    const evidenceByCitationId = new Map(evidence.map((e) => [e.citationId, e]));
    const withEvidenceLinks = questions.map((question) => ({
      ...question,
      evidence: {
        ...question.evidence,
        readerUrls: question.evidence.citationIds
          .map((id) => evidenceByCitationId.get(id)?.readerUrl)
          .filter((url): url is string => Boolean(url)),
      },
    }));

    return NextResponse.json({ questions: withEvidenceLinks });
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json({ error: 'Failed to build the quiz' }, { status: 500 });
  }
}
