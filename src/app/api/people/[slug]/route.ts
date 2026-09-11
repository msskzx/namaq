import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RelatedSubject = { relatedSubjectSlug: string | null; relatedSubjectKind: string | null };

/**
 * Resolves each claim's related subject to the name it is recorded under, so a
 * reader sees a subject rather than a slug. One query per kind in play.
 */
async function withRelatedSubjectNames<T extends RelatedSubject>(claims: T[]) {
  const byKind = new Map<string, Set<string>>();
  for (const claim of claims) {
    if (!claim.relatedSubjectSlug) continue;
    const kind = claim.relatedSubjectKind ?? 'PERSON';
    if (!byKind.has(kind)) byKind.set(kind, new Set());
    byKind.get(kind)!.add(claim.relatedSubjectSlug);
  }
  if (byKind.size === 0) return claims.map((claim) => ({ ...claim, relatedSubjectName: null }));

  const names = new Map<string, string>();
  const select = { slug: true, name: true } as const;
  await Promise.all(
    [...byKind].map(async ([kind, set]) => {
      const where = { slug: { in: [...set] } };
      const rows =
        kind === 'BATTLE' ? await prisma.battle.findMany({ where, select })
        : kind === 'EVENT' ? await prisma.event.findMany({ where, select })
        : kind === 'TITLE' ? await prisma.title.findMany({ where, select })
        : await prisma.person.findMany({ where, select });
      rows.forEach((row) => names.set(`${kind}:${row.slug}`, row.name));
    }),
  );

  return claims.map((claim) => ({
    ...claim,
    relatedSubjectName: claim.relatedSubjectSlug
      ? names.get(`${claim.relatedSubjectKind ?? 'PERSON'}:${claim.relatedSubjectSlug}`) ?? null
      : null,
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
      include: { citations: { include: { source: true, passage: { include: { page: true } } } } },
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
