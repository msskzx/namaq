import { NextResponse } from 'next/server';
import { RECITERS } from '@shared/quran/recitation';
import { SyncError, syncRecitation } from '@/lib/quran/contentSync';

export const dynamic = 'force-dynamic';

/**
 * The phone's downloaded recitations stay current through here (mobile/src/lib/listenFiles.ts): `r` is the reciter,
 * `t` the sync token the phone kept; with no token the answer is every ayah file. A token Quran Foundation no longer
 * accepts answers `{ resync: true }`, and the phone starts again without one.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const reciter = Number(params.get('r'));
  if (!RECITERS.some(item => item.id === reciter)) return NextResponse.json({ error: 'Unknown reciter' }, { status: 400 });
  try {
    return NextResponse.json(await syncRecitation(reciter, params.get('t') || undefined), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof SyncError && ['resync_required', 'token_filter_mismatch', 'cursor_filter_mismatch', 'cursor_per_page_mismatch'].includes(error.code ?? '')) return NextResponse.json({ resync: true });
    console.error('listen-sync', error);
    // The reason (no secrets: a status and Quran Foundation's error name) so a failed download can be told apart from the phone.
    return NextResponse.json({ error: 'Sync failed', ...(error instanceof SyncError ? { reason: error.message } : {}) }, { status: error instanceof SyncError ? error.status : 500 });
  }
}
