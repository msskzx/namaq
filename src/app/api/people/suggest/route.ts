import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { filterAndRankPeople } from '@/lib/personSearch';

// The directory searches profiles, not the graph: every suggestion here opens
// /people/<slug>, so a graph-only person -- one with a Neo4j node but no
// PostgreSQL row -- must not appear. Searching the whole graph is the
// workspace's job; see docs/graph-subject-search-plan.md.
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

    const people = await prisma.person.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        fullName: true,
        nameTransliterated: true,
        graphRank: true,
      },
    });
    const candidates = people.map((person) => ({ ...person, hasProfile: true as const }));

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
