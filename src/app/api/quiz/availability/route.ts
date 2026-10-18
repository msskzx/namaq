import { NextResponse } from 'next/server';
import { availableQuestionCount } from '@/lib/quiz/assemble';
import { parseQuizTopics } from '@/lib/quiz/topics';
import { parseJuzRange } from '@/lib/quran/juz';
import { QUIZ_LENGTHS, QUIZ_TOPICS, type QuizTopic } from '@/lib/quiz/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topics = parseQuizTopics(searchParams);
  const person = searchParams.get('person') ?? undefined;
  const juz = parseJuzRange(searchParams.get('juzFrom'), searchParams.get('juzTo'));
  if (!topics.length || topics.some((topic) => !QUIZ_TOPICS.includes(topic as QuizTopic))) return NextResponse.json({ error: 'Unknown topic' }, { status: 400 });
  if (topics.includes('PERSON_CIRCLE') && !person) return NextResponse.json({ error: 'This topic needs a person' }, { status: 400 });
  const available = await availableQuestionCount(topics as QuizTopic[], person, juz);
  return NextResponse.json({ available, lengths: QUIZ_LENGTHS.filter((length) => length <= available) });
}
