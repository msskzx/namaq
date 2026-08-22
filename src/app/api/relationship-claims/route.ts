import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Public, reviewed evidence for graph edges touching a person. Relationship
 * identity mirrors Neo4j: source person slug + relationship type + target slug.
 */
export async function GET(request: Request) {
  const person = new URL(request.url).searchParams.get('person');

  if (!person) {
    return NextResponse.json({ error: 'A person slug is required' }, { status: 400 });
  }

  try {
    const claims = await prisma.relationshipClaim.findMany({
      where: {
        reviewStatus: 'PUBLISHED',
        OR: [
          { sourcePersonSlug: person },
          { targetPersonSlug: person },
        ],
      },
      include: { source: true },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(claims);
  } catch (error) {
    console.error('Relationship claim API error:', error);
    return NextResponse.json({ error: 'Failed to fetch relationship evidence' }, { status: 500 });
  }
}
