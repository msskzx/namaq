// docs/plans/hadith-on-profiles.md
import type { HadithUnitView } from '@/lib/model/hadithView';
import { fixturesRoot } from '@/lib/model/hadithView';
import { unitRows, type PersonRole } from '@/lib/model/unitRows';
import { quietIfMissing } from '@/lib/modelUnits';
import { prisma } from '@/lib/prisma';

export interface PersonHadith {
  unit: string;
  title: string;
  book: string;
  kitab: string | null;
  bab: string | null;
  roles: PersonRole[];
  view: HadithUnitView;
}

const roleOrder: PersonRole[] = ['isnad', 'speaks', 'mentioned'];

const compare = (a: string | null, b: string | null) => (a ?? '').localeCompare(b ?? '');

export async function loadPersonHadith(slug: string): Promise<PersonHadith[]> {
  const people = await prisma.modelUnitPerson
    .findMany({ where: { person: slug } })
    .catch(quietIfMissing([]));
  let rows: { unit: string; work: string; book: string; kitab: string | null; bab: string | null; view: HadithUnitView }[];
  let roles: { unit: string; role: string }[];
  if (people.length > 0) {
    roles = people;
    rows = (
      await prisma.modelUnit
        .findMany({ where: { unit: { in: people.map((p) => p.unit) }, type: 'hadith' } })
        .catch(quietIfMissing([]))
    ).map((r) => ({ ...r, view: r.view as unknown as HadithUnitView }));
  } else {
    const all = unitRows(fixturesRoot);
    roles = all.people.filter((p) => p.person === slug);
    rows = all.units.filter((u) => u.type === 'hadith' && roles.some((r) => r.unit === u.unit));
  }
  return rows
    .sort(
      (a, b) =>
        compare(a.work, b.work) || compare(a.kitab, b.kitab) || compare(a.bab, b.bab) || compare(a.unit, b.unit),
    )
    .map((r) => ({
      unit: r.unit,
      title: r.bab ?? r.kitab ?? r.book,
      book: r.book,
      kitab: r.kitab,
      bab: r.bab,
      roles: roleOrder.filter((role) => roles.some((p) => p.unit === r.unit && p.role === role)),
      view: r.view,
    }));
}
