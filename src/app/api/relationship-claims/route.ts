import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Evidence for graph edges touching a person, at any review status
 * (docs/adr/0008-separate-review-from-visibility.md). Relationship identity
 * mirrors Neo4j: subject slug + relationship type + related slug.
 */
/**
 * Resolves each claim's related subject to the name it is recorded under, so a
 * reader sees a person rather than a slug. One query for the whole set.
 */
async function withRelatedSubjectNames<T extends { relatedSubjectSlug: string | null }>(claims: T[]) {
  const slugs = [...new Set(claims.map((claim) => claim.relatedSubjectSlug).filter((slug): slug is string => Boolean(slug)))];
  if (slugs.length === 0) return claims.map((claim) => ({ ...claim, relatedSubjectName: null }));

  const people = await prisma.person.findMany({ where: { slug: { in: slugs } }, select: { slug: true, name: true } });
  const nameBySlug = new Map(people.map((person) => [person.slug, person.name]));
  return claims.map((claim) => ({
    ...claim,
    relatedSubjectName: claim.relatedSubjectSlug ? nameBySlug.get(claim.relatedSubjectSlug) ?? null : null,
  }));
}

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

    return NextResponse.json(await withRelatedSubjectNames(claims));
  } catch (error) {
    console.error('Relationship claim API error:', error);
    return NextResponse.json({ error: 'Failed to fetch relationship evidence' }, { status: 500 });
  }
}
