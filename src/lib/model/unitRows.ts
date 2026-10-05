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
  const links: UnitLinkRow[] = units.flatMap(({ view }) => [
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
  return { units, links };
}
