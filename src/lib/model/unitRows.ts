// docs/plans/hadith-in-the-database.md
import { hadithView, listUnits, type HadithUnitView } from './hadithView';

export interface UnitRow {
  unit: string;
  work: string;
  type: string;
  book: string;
  kitab: string | null;
  bab: string | null;
  view: HadithUnitView;
}

export interface UnitLinkRow {
  fromUnit: string;
  toUnit: string;
  kind: 'EXPLAINS' | 'SAME_EVENT';
  basis: string;
}

export function unitRows(root: string) {
  const units: UnitRow[] = listUnits(root).map(({ id }) => {
    const view = hadithView(id, root)!;
    return {
      unit: view.id,
      work: view.work,
      type: view.type,
      book: view.book,
      kitab: view.kitab ?? null,
      bab: view.bab ?? null,
      view,
    };
  });
  const all: UnitLinkRow[] = units.flatMap(({ view }) => [
    ...view.explains.map((e) => ({
      fromUnit: view.id,
      toUnit: e.unit,
      kind: 'EXPLAINS' as const,
      basis: e.basis,
    })),
    ...view.sameEvent.map((e) => ({
      fromUnit: view.id,
      toUnit: e.unit,
      kind: 'SAME_EVENT' as const,
      basis: e.basis,
    })),
  ]);
  const byKey = new Map<string, UnitLinkRow>();
  for (const link of all) {
    const key = `${link.fromUnit}>${link.toUnit}:${link.kind}`;
    const seen = byKey.get(key);
    if (!seen) byKey.set(key, link);
    else if (!seen.basis.split(' | ').includes(link.basis)) seen.basis += ` | ${link.basis}`;
  }
  return { units, links: [...byKey.values()] };
}
