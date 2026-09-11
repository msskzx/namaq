import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const person = await prisma.person.findUnique({
      where: { slug },
      include: {
        titles: true,
        participations: {
          include: { battle: true },
        },
        events: true,
        ayat: {
          include: { surah: true },
        },
      },
    });

    if (!person) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    const claims = await prisma.historicalClaim.findMany({
      where: { subjectKind: 'PERSON', subjectSlug: slug },
      include: { citations: { include: { source: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ ...person, claims: await withRelatedSubjectNames(claims) });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch person' },
      { status: 500 }
    );
  }
} 
