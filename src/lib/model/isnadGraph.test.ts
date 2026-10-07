import { describe, expect, it } from 'vitest';
import type { ReportView } from './hadithView';
import { hadithView } from './hadithView';
import { isnadGraph, layoutIsnad } from './isnadGraph';
import { TABAQA, TABAQA_NAMES } from './tabaqa';

describe('isnadGraph and layoutIsnad', () => {
  it('builds Bukhari isnad with 6 nodes and 5 edges', () => {
    const view = hadithView('bukhari-jibril')!;
    const [report] = view.reports;
    const graph = isnadGraph(report, view.book);

    expect(graph.nodes).toHaveLength(6);
    expect(graph.edges).toHaveLength(5);
  });

  it('Bukhari edges run from Abu Huraira down to the collector', () => {
    const view = hadithView('bukhari-jibril')!;
    const graph = isnadGraph(view.reports[0], view.compiler!);
    const label = (id: string) => graph.nodes.find((n) => n.id === id)!.label;
    const path = ['origin'];
    while (path[path.length - 1] !== 'collector') {
      const edge = graph.edges.find((e) => e.from === path[path.length - 1])!;
      path.push(edge.to);
    }
    expect(path.map(label).map((l) => l.replace(/[\u064B-\u0652]/g, ''))).toEqual([
      'أبي هريرة',
      'أبي زرعة',
      'أبو حيان التيمي',
      'إسماعيل بن إبراهيم',
      'مسدد',
      'البخاري',
    ]);
  });

  it('Bukhari edges carry mode wording', () => {
    const view = hadithView('bukhari-jibril')!;
    const [report] = view.reports;
    const graph = isnadGraph(report, view.book);
    const nonGapEdges = graph.edges.filter((e) => e.label);
    expect(nonGapEdges.length).toBeGreaterThan(0);
    nonGapEdges.forEach((edge) => {
      expect(['حَدَّثَنَا', 'أَخْبَرَنَا', 'عَنْ']).toContain(edge.label);
    });
  });

  it('Muslim isnad has two paths from one origin to collector', () => {
    const view = hadithView('muslim-jibril')!;
    const [report] = view.reports;
    const graph = isnadGraph(report, view.book);
    const originNode = graph.nodes.find((n) => n.id === 'origin');
    expect(originNode).toBeDefined();
    const originOutgoing = graph.edges.filter((e) => e.from === 'origin');
    expect(originOutgoing).toHaveLength(2);
    const collectorIncoming = graph.edges.filter((e) => e.to === 'collector');
    expect(collectorIncoming).toHaveLength(2);
  });

  it('Muslim has no other node with more than one incoming or outgoing edge', () => {
    const view = hadithView('muslim-jibril')!;
    const [report] = view.reports;
    const graph = isnadGraph(report, view.book);
    for (const node of graph.nodes) {
      if (node.id === 'origin' || node.id === 'collector') continue;

      const incoming = graph.edges.filter((e) => e.to === node.id).length;
      const outgoing = graph.edges.filter((e) => e.from === node.id).length;

      expect(incoming).toBeLessThanOrEqual(1);
      expect(outgoing).toBeLessThanOrEqual(1);
    }
  });

  it('layout is deterministic and produces deep-equal results', () => {
    const view = hadithView('bukhari-jibril')!;
    const [report] = view.reports;
    const graph = isnadGraph(report, view.book);

    const layout1 = layoutIsnad(graph);
    const layout2 = layoutIsnad(graph);

    expect(layout1).toEqual(layout2);
  });

  it('layout puts the collector first at rank 0 and the origin last', () => {
    const view = hadithView('bukhari-jibril')!;
    const [report] = view.reports;
    const graph = isnadGraph(report, view.book);
    const layout = layoutIsnad(graph);

    const originNode = layout.nodes.find((n) => n.id === 'origin');
    const collectorNode = layout.nodes.find((n) => n.id === 'collector');

    expect(collectorNode?.rank).toBe(0);
    const maxRank = Math.max(...layout.nodes.map((n) => n.rank));
    expect(originNode?.rank).toBe(maxRank);
  });

  it('handles a hand-built report with a gap link without throwing', () => {
    const gapReport = {
      id: 'test-gap',
      voice: 'HADITH',
      origin: 'test',
      chainState: 'complete',
      statements: ['test text'],
      scenes: [],
      chain: {
        links: [
          { gap: false, narrator: 'Person A', mode: 'حَدَّثَنَا', modeKey: 'haddathana' },
          { gap: true },
          { gap: false, narrator: 'Person B', mode: 'عَنْ', modeKey: 'an' },
        ],
      },
    };
    const graph = isnadGraph(gapReport as unknown as ReportView, 'Test Book');
    expect(graph).toBeDefined();
    expect(graph.nodes).toBeDefined();
    expect(graph.edges).toBeDefined();
    const layout = layoutIsnad(graph);
    expect(layout).toBeDefined();
  });
});

describe('rows by tabaqa', () => {
  const build = (unit: string) => {
    const view = hadithView(unit)!;
    const graph = isnadGraph(view.reports[0], view.compiler ?? view.book, unit);
    return { graph, layout: layoutIsnad(graph) };
  };
  const row = (layout: ReturnType<typeof layoutIsnad>, id: string) =>
    layout.nodes.find((n) => n.id === id)!.y;

  it('merges a narrator who sits on both routes into one node', () => {
    const { graph } = build('muslim-jibril');
    expect(graph.nodes.filter((n) => n.id === 'p:kahmas-ibn-al-hasan')).toHaveLength(1);
    expect(graph.nodes.filter((n) => n.id === 'p:yahya-ibn-yamar')).toHaveLength(1);
  });

  it('puts ibn Umar and Umar in one row, joined by an edge', () => {
    const { graph, layout } = build('muslim-jibril');
    expect(row(layout, 'p:abdullah-ibn-umar')).toBe(row(layout, 'p:umar-ibn-al-khattab'));
    expect(graph.edges).toContainEqual({
      from: 'p:umar-ibn-al-khattab',
      to: 'p:abdullah-ibn-umar',
      label: 'حَدَّثَنِي',
    });
  });

  it('puts the collector on top and the Companions at the bottom', () => {
    const { layout } = build('muslim-jibril');
    const ys = layout.nodes.map((n) => n.y);
    expect(row(layout, 'collector')).toBe(Math.min(...ys));
    expect(row(layout, 'p:umar-ibn-al-khattab')).toBe(Math.max(...ys));
  });

  it('labels rows collector first, then tabaqa from the highest down', () => {
    const { layout } = build('bukhari-jibril');
    expect(layout.rows.map((r) => r.tabaqa)).toEqual([undefined, 10, 8, 6, 3, 1]);
    expect(layout.rows[0].kind).toBe('collector');
  });

  it('puts a narrator with no tabaqa in a row of its own at the bottom', () => {
    const view = hadithView('bukhari-jibril')!;
    const graph = isnadGraph(view.reports[0], view.book, 'bukhari-jibril');
    graph.nodes.find((n) => n.id === 'p:abu-zurah-ibn-amr-ibn-jarir')!.tabaqa = undefined;
    const layout = layoutIsnad(graph);
    expect(layout.rows.at(-1)!.kind).toBe('unranked');
  });

  it('leaves a unit without ranks laid out by depth', () => {
    const view = hadithView('bukhari-jibril')!;
    const layout = layoutIsnad(isnadGraph(view.reports[0], view.book));
    expect(layout.rows).toEqual([]);
  });

  it('names every tabaqa the demo table uses, in both languages', () => {
    const used = Object.values(TABAQA).flatMap((u) => [
      ...Object.values(u.narrators),
      ...(u.tail?.links ?? []),
    ]);
    expect(Object.keys(TABAQA_NAMES)).toHaveLength(12);
    for (const { tabaqa } of used) {
      if (tabaqa !== undefined) expect(TABAQA_NAMES[tabaqa].ar && TABAQA_NAMES[tabaqa].en).toBeTruthy();
    }
  });
});
