import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Evidence for graph edges touching a person, at any review status
 * (docs/adr/0008-separate-review-from-visibility.md). Relationship identity
 * mirrors Neo4j: subject slug + relationship type + related slug.
 */
export async function GET(request: Request) {
  const person = new URL(request.url).searchParams.get('person');

  if (!person) {
    return NextResponse.json({ error: 'A person slug is required' }, { status: 400 });
  }

  try {
    const claims = await prisma.historicalClaim.findMany({
      where: {
        relationshipType: { not: null },
        OR: [
          { subjectSlug: person },
          { relatedSubjectSlug: person },
        ],
      },
      include: { citations: { include: { source: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(claims);
  } catch (error) {
    console.error('Relationship claim API error:', error);
    return NextResponse.json({ error: 'Failed to fetch relationship evidence' }, { status: 500 });
  }
}
