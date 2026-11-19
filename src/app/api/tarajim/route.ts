import { NextResponse } from 'next/server';
import { nasabView, personName, searchPeople, tiesView, virtuesView } from '@/lib/tarajim';

const CACHE = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' };
const slugs = (value: string | null) => (value ?? '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 8);

/**
 * The app's Tarajim views for the website's quiz look-ups and person page (src/components/tarajim/TarajimParts.tsx):
 * `?ties=slug` a person's ties ring, `?nasab=a,b` the nasab tree (`&meetings=0` without where they meet),
 * `?virtues=a,b` each person's virtues, `?q=words` the people a search finds.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.has('q')) {
    const q = (params.get('q') ?? '').trim();
    return NextResponse.json(q ? searchPeople(q).slice(0, 20).map(p => ({ slug: p.slug, name: personName(p) })) : [], { headers: CACHE });
  }
  if (params.has('ties')) {
    const view = tiesView(params.get('ties') ?? '');
    return view ? NextResponse.json(view, { headers: CACHE }) : NextResponse.json({ error: 'ties: a converted person' }, { status: 404 });
  }
  if (params.has('nasab')) return NextResponse.json(nasabView(slugs(params.get('nasab')), params.get('meetings') !== '0'), { headers: CACHE });
  if (params.has('virtues')) return NextResponse.json(slugs(params.get('virtues')).map(virtuesView).filter(v => !!v), { headers: CACHE });
  return NextResponse.json({ error: 'ties, nasab, virtues or q' }, { status: 400 });
}
