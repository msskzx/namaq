import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/neo4j';
import { filterAndRankSubjects, type SubjectKind } from '@/lib/subjectSearch';

// The workspace searches the graph; /api/people/suggest searches profiles.
// See docs/graph-subject-search-plan.md for why these stayed two endpoints.
const KIND_BY_LABEL: Record<string, SubjectKind> = {
  Person: 'person',
  Title: 'title',
  Battle: 'battle',
  Event: 'event',
};

// Neo4j is the candidate source for every kind: it is the only store with
// complete coverage, since a graph-only person has no PostgreSQL row. All 659
// subjects are ranked in memory -- a considered choice at this size.
const candidatesQuery = `
  MATCH (n)
  WHERE n:Person OR n:Title OR n:Battle OR n:Event
  RETURN labels(n) AS labels, n.slug AS slug, n.name AS name,
         n.fullName AS fullName, n.nameTransliterated AS nameTransliterated,
         n.graphRank AS graphRank
`;

function kindOf(labels: string[]): SubjectKind | null {
  for (const label of labels) {
    const kind = KIND_BY_LABEL[label];
    if (kind) return kind;
  }
  return null;
}

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

    // Nothing to search, so the dropdown comes up empty rather than the
    // workspace erroring on a keystroke.
    const session = getSession();
    if (!session) {
      console.error('Graph suggestions unavailable: no Neo4j session.');
      return NextResponse.json({ data: [] });
    }

    const result = await session.run(candidatesQuery);
    const subjects = result.records
      .map((record) => ({
        kind: kindOf(record.get('labels') as string[]),
        slug: record.get('slug') as string | null,
        name: record.get('name') as string | null,
        fullName: (record.get('fullName') as string | null) ?? null,
        nameTransliterated: (record.get('nameTransliterated') as string | null) ?? null,
        graphRank: (record.get('graphRank') as number | null) ?? null,
      }))
      .filter((subject): subject is typeof subject & { kind: SubjectKind; slug: string; name: string } =>
        subject.kind !== null && !!subject.slug && !!subject.name
      );

    // Only people can be graph-only: every title, battle and event in the
    // graph was synced from a PostgreSQL row and has a profile page.
    const personSlugs = subjects.filter((subject) => subject.kind === 'person').map((subject) => subject.slug);
    const profiled = new Set(
      (await prisma.person.findMany({ where: { slug: { in: personSlugs } }, select: { slug: true } }))
        .map((person) => person.slug)
    );

    const data = filterAndRankSubjects(subjects, q)
      .slice(0, limit)
      .map(({ subject, match }) => ({
        // Slugs are unique only within a kind, so the pair is the id.
        id: `${subject.kind}:${subject.slug}`,
        ...subject,
        hasProfile: subject.kind !== 'person' || profiled.has(subject.slug),
        match,
      }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching graph suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch graph suggestions' },
      { status: 500 }
    );
  }
}
