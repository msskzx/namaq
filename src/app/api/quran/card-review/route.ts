import { NextResponse } from 'next/server';
import { appendCardPress } from '@/lib/quran/curation/cardReviewLog';

const ACTIONS = ['keep', 'drop', 'discuss', 'undo'];
const VERSIONS = ['original', 'agents'];

/** Appends the owner's press on one card to the review log, on their own machine only. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return new NextResponse(null, { status: 403 });
  const { id, action, version } = await request.json();
  if (typeof id !== 'string' || !/^[\w:|,\-]{1,400}$/.test(id) || !ACTIONS.includes(action) || !VERSIONS.includes(version)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  appendCardPress({ t: Date.now(), id, action, version });
  return NextResponse.json({ ok: true });
}
