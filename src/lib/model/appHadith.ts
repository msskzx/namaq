// The phone app's hadith (owner, 2026-11-18): the app is offline, so each unit's view and its isnad, laid out as the
// website lays it out, are written to shared/data/hadith/units.json (scripts/model/buildAppHadith.ts). The app only draws them.
import type { AppHadith, AppIsnad, HadithUnitView } from '@shared/hadith';
import { hadithView, listUnits } from './hadithView';
import { GAP_X, isnadGraph, layoutIsnad, NODE_W, ROW } from './isnadGraph';
import { TABAQA_NAMES } from './tabaqa';

function isnadOf(view: HadithUnitView, report: HadithUnitView['reports'][number]): AppIsnad {
  const { nodes, edges, rows, width, height } = layoutIsnad(isnadGraph(report, view.compiler ?? view.book, view.id));
  return {
    nodes: nodes.map(({ id, label, x, y }) => ({ id, label, x, y })),
    edges,
    rows: rows.map(({ y, kind, tabaqa }) => (kind === 'tabaqa' ? { y, kind, tabaqa, name: TABAQA_NAMES[tabaqa!]?.ar } : { y, kind })),
    width,
    height,
  };
}

export function appHadith(): AppHadith {
  const units = listUnits().map(({ id }) => {
    const view = hadithView(id)!;
    const isnad = Object.fromEntries(view.reports.filter(report => report.chain).map(report => [report.id, isnadOf(view, report)]));
    return { ...view, isnad };
  });
  return { size: { width: NODE_W, gap: GAP_X, row: ROW }, units };
}
