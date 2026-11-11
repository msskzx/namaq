// docs/plans/quran-prophet-timelines.md
import { NextResponse } from 'next/server';
import { eventPlaceKeys } from '@shared/quran/prophets/review';
import { STORIES } from '@shared/quran/prophets/stories';
import { appendStoryReview } from '@/lib/quran/curation/storyReviewLog';

/** Every dot a story has now, so a page left open from before a story edit cannot add one that is gone. */
const DOTS = new Set(Object.entries(STORIES).flatMap(([slug, story]) => story.events.flatMap(event => eventPlaceKeys(slug, event).map(({ key }) => key))));

/** Records the owner's choice for one dot of a story map, on their own machine. The press is on disk when this answers. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const origin = request.headers.get('origin');
  if (origin && URL.parse(origin)?.host !== request.headers.get('host')) return new NextResponse(null, { status: 403 });
  const { key, action } = await request.json().catch(() => ({}));
  if (typeof key !== 'string' || !DOTS.has(key) || !['keep', 'drop', 'discuss', 'undo'].includes(action)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  appendStoryReview({ t: Date.now(), key, action });
  return NextResponse.json({ ok: true });
}
