import { NextResponse } from 'next/server';
import { battleOf, storyAyat, storyOf } from '@/lib/stories';

const CACHE = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' };

/**
 * A sira story or a battle as the sira quiz's «ابحث عن الجواب» shows it (src/components/quiz/QuizLook.tsx):
 * `?story=SLUG` the story with its ayat in the mushaf's lines, `?battle=SLUG` the battle.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const story = storyOf(params.get('story') ?? '');
  if (story) return NextResponse.json({ story, ayat: await storyAyat(story) }, { headers: CACHE });
  const battle = battleOf(params.get('battle') ?? '');
  if (battle) return NextResponse.json({ battle }, { headers: CACHE });
  return NextResponse.json({ error: 'story=SLUG or battle=SLUG' }, { status: 404 });
}
