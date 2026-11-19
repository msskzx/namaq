import { NextResponse } from 'next/server';
import { termOf } from '@/lib/balaghaTerms';

/** The balagha terms named (`?n=…&n=…`), their defining quotes, for the term quiz's «ابحث عن الجواب» (src/components/quiz/QuizLook.tsx). */
export async function GET(request: Request) {
  const names = new URL(request.url).searchParams.getAll('n').slice(0, 8);
  const terms = names.map(termOf).filter(term => !!term);
  return terms.length ? NextResponse.json(terms, { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } })
    : NextResponse.json({ error: 'n=TERM' }, { status: 404 });
}
