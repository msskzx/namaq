import { describe, expect, it } from 'vitest';
import type { ReportView } from './hadithView';
import { hadithView } from './hadithView';
import { isnadGraph, layoutIsnad } from './isnadGraph';

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
