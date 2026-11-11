import { NextResponse } from 'next/server';
import { recordBranchReview } from '@/lib/quran/curation/branchReview';

/** Records the owner's choice for one branches card, on their own machine only. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return new NextResponse(null, { status: 403 });
  const { id, text, action } = await request.json();
  if (typeof id !== 'string' || !/^[\w:\-\u0600-\u06FF ]{1,200}$/.test(id) || (text !== undefined && typeof text !== 'string') || !['keep', 'drop', 'discuss', 'undo'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  recordBranchReview(id, action, text);
  return NextResponse.json({ ok: true });
}
