import { NextResponse } from 'next/server';
import { appendCardPress } from '@/lib/quran/curation/cardReviewLog';

const ACTIONS = ['keep', 'drop', 'discuss', 'undo'];
const VERSIONS = ['original', 'agents'];

/** Appends the owner's press on one card to the review log, on their own machine only. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const origin = request.headers.get('origin');
  if (origin && URL.parse(origin)?.host !== request.headers.get('host')) return new NextResponse(null, { status: 403 });
  const body = await request.json().catch(() => null);
  const { id, shared, action, version } = body ?? {};
  const valid = (key: unknown) => typeof key === 'string' && /^[\w:|,\-]{1,400}$/.test(key);
  if (!valid(id) || shared !== undefined && !/^\d+:\d+\|\d+:\d+$/.test(shared) || !ACTIONS.includes(action) || !VERSIONS.includes(version)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  appendCardPress({ t: Date.now(), id, ...(shared ? { shared } : {}), action, version });
  return NextResponse.json({ ok: true });
}
