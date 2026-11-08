// docs/plans/curated-passage-comparisons.md
import { NextResponse } from 'next/server';
import { appendReview } from '@/lib/quran/curation/reviewLog';

/** Records the owner's choice for a whole page on their own machine. The press is on disk when this answers. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return new NextResponse(null, { status: 403 });
  const { a, b, action, card } = await request.json();
  const validCard = card === undefined || (Array.isArray(card) && card.length > 0 && card.every(key => typeof key === 'string' && new RegExp(`^${a}:\\d+\\|${b}:\\d+$`).test(key)));
  const actions = card === undefined ? ['agree', 'drop', 'undo'] : ['keep', 'drop', 'discuss', 'undo'];
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b > 114 || a >= b || !validCard || !actions.includes(action)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  appendReview({ t: Date.now(), page: `${a}/${b}`, ...(card ? { card } : {}), action });
  return NextResponse.json({ ok: true });
}
