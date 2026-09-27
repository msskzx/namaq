import { NextResponse } from 'next/server';
import { availableQuestionCount } from '@/lib/quiz/assemble';
import { QUIZ_LENGTHS, QUIZ_TOPICS, type QuizTopic } from '@/lib/quiz/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const person = searchParams.get('person') ?? undefined;
  if (!QUIZ_TOPICS.includes(topic as QuizTopic)) return NextResponse.json({ error: 'Unknown topic' }, { status: 400 });
  if (topic === 'PERSON_CIRCLE' && !person) return NextResponse.json({ error: 'This topic needs a person' }, { status: 400 });
  const available = await availableQuestionCount(topic as QuizTopic, person);
  return NextResponse.json({ available, lengths: QUIZ_LENGTHS.filter((length) => length <= available) });
}
