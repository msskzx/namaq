// docs/plans/hadith-in-the-database.md
// docs/plans/hadith-on-profiles.md
import { hadithView, listUnits, type HadithUnitView } from './hadithView';
import { applyApprovedInferences, loadInferences } from './inference';
import { loadModel } from './load';
import { standingAgent } from './referents';
import type { Chain } from './types';

export const personRoles = ['isnad', 'speaks', 'mentioned'] as const;
export type PersonRole = (typeof personRoles)[number];

export interface UnitPersonRow {
  unit: string;
  person: string;
  role: PersonRole;
}

const narratorsOf = (chain: Chain): string[] => [
  ...chain.elements.flatMap((el) => ('kind' in el ? [] : [el.narrator])),
  ...(chain.branches ?? []).flatMap(narratorsOf),
];

function peopleRows(root: string): UnitPersonRow[] {
  const folders = applyApprovedInferences(
    loadModel(root),
    loadInferences(root).map((i) => ({ ...i, status: 'APPROVED' as const })),
  );
  const rows = new Map<string, UnitPersonRow>();
  for (const file of folders.flatMap((f) => f.units).filter((u) => u.unit.type === 'hadith')) {
    const kinds = new Map<string, Set<PersonRole>>();
    for (const report of file.reports) {
      const chain = report.chain ? new Set(narratorsOf(report.chain)) : new Set<string>();
      const speakers = new Set((report.scenes ?? []).flatMap((s) => s.turns.map((t) => t.speaker)));
      for (const m of file.mentions) {
        const set = kinds.get(m.id) ?? new Set<PersonRole>();
        if (chain.has(m.id)) set.add('isnad');
        if (speakers.has(m.id)) set.add('speaks');
        kinds.set(m.id, set);
      }
    }
    for (const m of file.mentions) {
      const agents = file.identifications.some((i) => i.mention === m.id)
        ? file.identifications.filter((i) => i.mention === m.id && i.status !== 'REJECTED').map((i) => i.agent)
        : [standingAgent(m.exact)].filter((a): a is string => !!a);
      const own = kinds.get(m.id) ?? new Set<PersonRole>();
      for (const person of agents) {
        for (const role of own.size > 0 ? own : new Set<PersonRole>(['mentioned'])) {
          rows.set(`${file.unit.id}|${person}|${role}`, { unit: file.unit.id, person, role });
        }
      }
    }
  }
  return [...rows.values()];
}

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
  return { units, links: [...byKey.values()], people: peopleRows(root) };
}
