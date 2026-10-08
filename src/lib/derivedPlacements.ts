// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
import { prisma } from '@/lib/prisma';
import { quietIfMissing } from '@/lib/modelUnits';
import { placeUndated } from '@/lib/placement';
import type { DerivedBound, DerivedInterval } from '@/lib/timeline';

export async function loadDerivedIntervals(): Promise<Map<string, DerivedInterval>> {
  return derive().catch(() => new Map());
}

async function derive(): Promise<Map<string, DerivedInterval>> {
  const orderings = await prisma.catalogOrdering
    .findMany({ select: { earlier: true, later: true } })
    .catch(quietIfMissing([]));
  if (orderings.length === 0) return new Map();

  const select = { slug: true, name: true, nameTransliterated: true, hijriYear: true } as const;
  const [events, battles, contested] = await Promise.all([
    prisma.event.findMany({ select }),
    prisma.battle.findMany({ select }),
    prisma.historicalClaim.findMany({
      where: { disputed: true, field: 'hijriYear', subjectKind: { in: ['EVENT', 'BATTLE'] } },
      select: { subjectSlug: true },
    }),
  ]);
  const disputed = new Set(contested.map((c) => c.subjectSlug));
  const subjects = [
    ...events.map((s) => ({ ...s, kind: 'event' as const, yearDisputed: disputed.has(s.slug) })),
    ...battles.map((s) => ({ ...s, kind: 'battle' as const, yearDisputed: disputed.has(s.slug) })),
  ];
  const bySlug = new Map(subjects.map((s) => [s.slug, s]));
  const bound = (b: { slug: string; year: number }): DerivedBound => {
    const s = bySlug.get(b.slug)!;
    return { slug: s.slug, kind: s.kind, name: s.name, nameTransliterated: s.nameTransliterated, year: b.year };
  };

  const intervals = new Map<string, DerivedInterval>();
  placeUndated(subjects, orderings).forEach((placement, slug) => {
    if (placement.unplaced || (!placement.from && !placement.to)) return;
    intervals.set(slug, {
      ...(placement.from && { from: bound(placement.from) }),
      ...(placement.to && { to: bound(placement.to) }),
    });
  });
  return intervals;
}
