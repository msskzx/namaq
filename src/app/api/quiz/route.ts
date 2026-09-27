import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { assembleQuiz, availableQuestionCount } from '@/lib/quiz/assemble';
import { QUIZ_LENGTHS, QUIZ_TOPICS, type QuizLength, type QuizTopic } from '@/lib/quiz/types';

async function evidenceLinks(claimKeys: string[]) {
  if (claimKeys.length === 0) return new Map<string, string[]>();
  const claims = await prisma.historicalClaim.findMany({
    where: { authoringKey: { in: claimKeys } },
    select: {
      authoringKey: true,
      citations: { select: { subjectKind: true, subjectSlug: true, passage: { select: { page: { select: { accountId: true, sequence: true } } } } } },
    },
  });
  return new Map(claims.map((claim) => [
    claim.authoringKey,
    claim.citations.flatMap((citation) =>
      citation.subjectKind === 'PERSON' && citation.passage?.page
        ? [`/people/${citation.subjectSlug}?book=${citation.passage.page.accountId}&page=${citation.passage.page.sequence}`]
        : [],
    ),
  ]));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const length = Number(searchParams.get('length'));
  const person = searchParams.get('person') ?? undefined;
  if (!QUIZ_TOPICS.includes(topic as QuizTopic)) return NextResponse.json({ error: 'Unknown topic', topics: QUIZ_TOPICS }, { status: 400 });
  if (!QUIZ_LENGTHS.includes(length as QuizLength)) return NextResponse.json({ error: 'Unknown length', lengths: QUIZ_LENGTHS }, { status: 400 });
  if (topic === 'PERSON_CIRCLE' && !person) return NextResponse.json({ error: 'This topic needs a person' }, { status: 400 });

  try {
    const available = await availableQuestionCount(topic as QuizTopic, person);
    if (available < length) return NextResponse.json({ error: 'Not enough approved questions', available }, { status: 409 });
    const questions = await assembleQuiz({ topic: topic as QuizTopic, personSlug: person, length: length as QuizLength, random: Math.random });
    const claimKeys = [...new Set(questions.flatMap((question) => question.evidence.claimKeys))];
    const links = await evidenceLinks(claimKeys);
    return NextResponse.json({
      questions: questions.map((question) => ({
        ...question,
        evidence: { readerUrls: [...new Set(question.evidence.claimKeys.flatMap((key) => links.get(key) ?? []))] },
      })),
    });
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json({ error: 'Failed to build the quiz' }, { status: 500 });
  }
}
