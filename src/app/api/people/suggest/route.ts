import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/neo4j';
import { filterAndRankPeople } from '@/lib/personSearch';

// People are searchable whether or not they have a PostgreSQL profile row;
// see docs/graph-only-people-search-plan.md for why both sources rank
// together instead of PostgreSQL always winning. `hasProfile: false` tells
// the client there's no profile page to link a graph-only match to.
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
        nasabRank: true,
        _count: { select: { titles: true } },
      },
    });
    const postgresCandidates = people.map(({ _count, ...person }) => ({ ...person, titleCount: _count.titles, hasProfile: true as const }));
    const postgresSlugs = new Set(postgresCandidates.map((person) => person.slug));

    // Best-effort augmentation: a missing/unreachable Neo4j session degrades
    // to PostgreSQL-only results instead of failing the request.
    const session = getSession();
    const graphOnlyCandidates = session
      ? (await session.run('MATCH (p:Person) RETURN p.slug AS slug, p.name AS name, p.nasabRank AS nasabRank')).records
        .map((record) => ({ slug: record.get('slug') as string, name: record.get('name') as string, nasabRank: (record.get('nasabRank') as number | null) ?? null }))
        .filter((person) => person.slug && person.name && !postgresSlugs.has(person.slug))
        .map((person) => ({ ...person, id: person.slug, fullName: null, nameTransliterated: null, titleCount: 0, hasProfile: false as const }))
      : [];

    const candidates = [...postgresCandidates, ...graphOnlyCandidates];
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
