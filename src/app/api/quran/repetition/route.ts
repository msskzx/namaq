// docs/plans/quran-repetition-merge.md
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildRepetition } from '@/lib/quran/repetition';

export async function GET() {
  try {
    const rows = await prisma.surah.findMany({
      select: { number: true, name: true, ayat: { select: { number: true, text: true }, orderBy: { number: 'asc' } } },
      orderBy: { number: 'asc' },
    });
    const body = buildRepetition(rows.map(r => ({ number: r.number, name: r.name, ayat: r.ayat.map(a => a.text) })));
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } });
  } catch (error) {
    console.error('Error fetching repetition:', error);
    return NextResponse.json({ error: 'Failed to fetch repetition' }, { status: 500 });
  }
}
