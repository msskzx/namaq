import { NextResponse } from 'next/server';
import { fortyList, fortyPage } from '@/lib/forty';

const CACHE = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' };

/**
 * al-Nawawi's Forty for the hadith quizzes' «ابحث عن الجواب» (src/components/quiz/QuizLook.tsx): the list to search, or
 * `?n=N` one hadith whole with its records and Ibn Rajab's chapter.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (!params.has('n')) return NextResponse.json(fortyList(), { headers: CACHE });
  const page = fortyPage(Number(params.get('n')));
  return page ? NextResponse.json(page, { headers: CACHE }) : NextResponse.json({ error: 'n: one of the Forty' }, { status: 404 });
}
