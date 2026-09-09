import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subjectKinds } from '@/lib/history/batchSchema';
import type { SubjectKind } from '@/generated/prisma';

/**
 * Evidence for any historical subject, addressed by kind and slug. Subjects
 * without a profile row are reachable here too — see
 * docs/adr/0007-citations-independent-of-profiles.md. Review status is returned
 * with each claim rather than filtering what is served.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kind: string; slug: string }> },
) {
  const { kind, slug } = await params;
  const subjectKind = kind.toUpperCase() as SubjectKind;

  if (!(subjectKinds as readonly string[]).includes(subjectKind)) {
    return NextResponse.json(
      { error: `Unknown subject kind "${kind}"`, kinds: subjectKinds },
      { status: 400 },
    );
  }

  try {
    const [claims, accounts] = await Promise.all([
      prisma.historicalClaim.findMany({
        where: { subjectKind, subjectSlug: slug },
        include: {
          citations: {
            include: { source: true, passage: { include: { page: true } } },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.sourceAccount.count({ where: { subjectKind, subjectSlug: slug } }),
    ]);

    return NextResponse.json({ subjectKind, subjectSlug: slug, claims, accountCount: accounts });
  } catch (error) {
    console.error('Subject references API error:', error);
    return NextResponse.json({ error: 'Failed to fetch references' }, { status: 500 });
  }
}
