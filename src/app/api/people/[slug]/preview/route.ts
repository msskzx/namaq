import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiError, CATALOG_CACHE_HEADERS } from '@/lib/apiError';

// A light-weight sibling of GET /api/people/[slug]: the graph workspace's
// selected-subject panel only ever shows a person's full name and titles
// (see docs/graph-exploration.md's "Learning information in the
// panel" decision), not the full profile payload (participations, events,
// ayat, claims) that route fetches -- reusing it here would mean an extra
// full profile query on every subject the learner clicks through.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const person = await prisma.person.findUnique({
      where: { slug },
      select: {
        fullName: true,
        titles: { select: { name: true, slug: true } },
      },
    });

    if (!person) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...person, hasProfile: true }, { headers: CATALOG_CACHE_HEADERS });
  } catch (error) {
    return apiError('GET /api/people/[slug]/preview', error, 'Failed to fetch person preview');
  }
}
