import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// A light-weight sibling of GET /api/people/[slug]: the graph workspace's
// selected-subject panel only ever shows a person's full name and titles
// (see docs/graph-exploration-plan.md's "Learning information in the
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

    // The pane links to the profile's references rather than listing citations
    // itself, so it needs to know whether there are any, not what they say.
    const evidenceCount = await prisma.historicalClaim.count({
      where: { subjectKind: 'PERSON', subjectSlug: slug },
    });

    return NextResponse.json({ ...person, hasProfile: true, evidenceCount });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch person preview' },
      { status: 500 }
    );
  }
}
