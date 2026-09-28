import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { assembleQuiz, availableQuestionCount } from '@/lib/quiz/assemble';
import { parseQuizTopics } from '@/lib/quiz/topics';
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

async function ayahDetails(questions: readonly { family: string; choices: readonly { value: string }[] }[]) {
  const keys = [...new Set(questions.filter((question) => question.family === 'AYAH_LINK').flatMap((question) => question.choices.map((choice) => choice.value)))];
  const pairs = keys.flatMap((key) => {
    const [surah, number] = key.split(':').map(Number);
    return Number.isInteger(surah) && Number.isInteger(number) ? [{ surah, number }] : [];
  });
  if (pairs.length === 0) return new Map<string, { text: string; reference: string }>();
  const ayat = await prisma.ayah.findMany({
    where: { OR: pairs.map(({ surah, number }) => ({ number, surah: { number: surah } })) },
    include: { surah: { select: { number: true, name: true } } },
  });
  return new Map(ayat.map((ayah) => [
    `${ayah.surah.number}:${ayah.number}`,
    { text: ayah.text, reference: `${ayah.surah.name} ${ayah.surah.number}:${ayah.number}` },
  ]));
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
    const [links, details] = await Promise.all([evidenceLinks(claimKeys), ayahDetails(questions)]);
    return NextResponse.json({
      questions: questions.map((question) => ({
        ...question,
        choiceDetails: Object.fromEntries(
          question.choices.map((choice) => [choice.value, details.get(choice.value)]).filter((entry) => entry[1]),
        ),
        evidence: { readerUrls: [...new Set(question.evidence.claimKeys.flatMap((key) => links.get(key) ?? []))] },
      })),
    });
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json({ error: 'Failed to build the quiz' }, { status: 500 });
  }
}
