import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { filterAndRankPeople } from '@/lib/personSearch';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const limit = Math.min(
      20,
      Math.max(1, parseInt(searchParams.get('limit') || '10', 10) || 10)
    );

    if (!q) {
      return NextResponse.json({ data: [] });
    }

    // The directory lives in PostgreSQL. Do not fall back to Neo4j here: a
    // graph node is not currently guaranteed to have a matching profile.
    // nasabRank is an exception: it's a graph-derived signal, but it's computed
    // offline and persisted here, so reading it is still a plain Postgres read.
    const people = await prisma.person.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        fullName: true,
        nameTransliterated: true,
        nasabRank: true,
        _count: { select: { titles: true } },
      },
    });
    const candidates = people.map(({ _count, ...person }) => ({ ...person, titleCount: _count.titles }));

    const data = filterAndRankPeople(candidates, q)
      .slice(0, limit)
      .map(({ person, match }) => ({ ...person, match }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching people suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people suggestions' },
      { status: 500 }
    );
  }
}
