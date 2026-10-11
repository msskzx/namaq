import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { clampSubjects } from '@/lib/apiParams';
import { apiError, CATALOG_CACHE_HEADERS } from '@/lib/apiError';
import type { NasabPerson } from '@/lib/relationship/nasabLayout';

// See docs/plans/nasab-plot.md. FATHER edges are stored father -> child.
const ancestorsQuery = `
  UNWIND $slugs AS slug
  MATCH (:Person {slug: slug})<-[:FATHER*0..]-(a:Person)
  WITH DISTINCT a
  OPTIONAL MATCH (f:Person)-[:FATHER]->(a)
  RETURN a.slug AS slug, a.name AS name, collect(f.slug) AS fathers
`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjects = clampSubjects(searchParams.getAll('person'));
    if (subjects.length === 0) return NextResponse.json({ people: [], subjects: [] });

    const session = getSession();
    if (!session) return NextResponse.json({ error: 'Database configuration is missing' }, { status: 500 });

    const result = await session.run(ancestorsQuery, { slugs: subjects });
    const people: NasabPerson[] = result.records.map((record) => ({
      slug: record.get('slug'),
      name: record.get('name'),
      fathers: record.get('fathers'),
    }));
    const found = new Set(people.map((person) => person.slug));
    return NextResponse.json(
      { people, subjects: subjects.filter((slug) => found.has(slug)) },
      { headers: CATALOG_CACHE_HEADERS },
    );
  } catch (error) {
    return apiError('GET /api/nasab', error, 'Failed to fetch nasab');
  }
}
