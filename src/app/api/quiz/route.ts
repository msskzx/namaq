import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { assembleQuiz, availableQuestionCount } from '@/lib/quiz/assemble';
import { ayahDetails } from '@/lib/quiz/ayahDetails';
import { selectQuizReference } from '@/lib/quiz/quizReference';
import { parseQuizTopics } from '@/lib/quiz/topics';
import { QUIZ_LENGTHS, QUIZ_TOPICS, type QuizLength, type QuizTopic } from '@/lib/quiz/types';

async function referenceClaims(claimKeys: string[]) {
  if (claimKeys.length === 0) return [];
  return prisma.historicalClaim.findMany({
    where: { authoringKey: { in: claimKeys } },
    select: {
      authoringKey: true,
      citations: {
        select: {
          subjectKind: true,
          subjectSlug: true,
          excerptArabic: true,
          pageReference: true,
          source: { select: { title: true } },
          passage: { select: { anchor: true, page: { select: { printedPage: true, volume: { select: { number: true } } } } } },
        },
      },
    },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topics = parseQuizTopics(searchParams);
  const length = Number(searchParams.get('length'));
  const person = searchParams.get('person') ?? undefined;
  if (!topics.length || topics.some((topic) => !QUIZ_TOPICS.includes(topic as QuizTopic))) return NextResponse.json({ error: 'Unknown topic', topics: QUIZ_TOPICS }, { status: 400 });
  if (!QUIZ_LENGTHS.includes(length as QuizLength)) return NextResponse.json({ error: 'Unknown length', lengths: QUIZ_LENGTHS }, { status: 400 });
  if (topics.includes('PERSON_CIRCLE') && !person) return NextResponse.json({ error: 'This topic needs a person' }, { status: 400 });

  try {
    const selectedTopics = topics as QuizTopic[];
    const available = await availableQuestionCount(selectedTopics, person);
    if (available < length) return NextResponse.json({ error: 'Not enough approved questions', available }, { status: 409 });
    const questions = await assembleQuiz({ topics: selectedTopics, personSlug: person, length: length as QuizLength, random: Math.random });
    const claimKeys = [...new Set(questions.flatMap((question) => question.evidence.claimKeys))];
    const [claims, details] = await Promise.all([referenceClaims(claimKeys), ayahDetails(questions)]);
    return NextResponse.json({
      questions: questions.map((question) => ({
        ...question,
        choiceDetails: Object.fromEntries(
          question.choices.map((choice) => [choice.value, details.get(choice.value)]).filter((entry) => entry[1]),
        ),
        evidence: { reference: selectQuizReference(question.evidence.claimKeys, claims) },
      })),
    });
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json({ error: 'Failed to build the quiz' }, { status: 500 });
  }
}
