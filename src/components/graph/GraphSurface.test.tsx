import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import GraphSurface, { GraphSurfaceMethods } from './GraphSurface';
import { GraphData } from '@/types/graph';

const camera = vi.hoisted(() => ({ zoomToFit: vi.fn() }));
const rendered = vi.hoisted(() => ({ props: null as Record<string, unknown> | null }));
vi.mock('react-force-graph-2d', () => ({
  default: React.forwardRef(function ForceGraphStub(props: Record<string, unknown>, ref) {
    React.useImperativeHandle(ref, () => camera);
    rendered.props = props;
    return <div />;
  }),
}));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
afterEach(cleanup);

it('refreshes the forwarded camera ref when loading toggles without changing graph data', () => {
  const ref = React.createRef<GraphSurfaceMethods>();
  const data: GraphData = { nodes: [], links: [] };
  const props = { ref, data, onNodeClick: vi.fn() };
  const view = render(<GraphSurface {...props} isLoading />);
  expect(ref.current).toBeFalsy();

  view.rerender(<GraphSurface {...props} isLoading={false} />);
  expect(ref.current?.zoomToFit).toBe(camera.zoomToFit);

  view.rerender(<GraphSurface {...props} isLoading />);
  expect(ref.current).toBeFalsy();
  view.rerender(<GraphSurface {...props} isLoading={false} />);
  expect(ref.current?.zoomToFit).toBe(camera.zoomToFit);
});


const node = (slug: string, x = 0) => ({ id: `person:${slug}`, slug, label: slug, group: 1, type: 'person', x, y: 0 });

it('hands the renderer only the current members, dropping a hidden node and its link', () => {
  const before: GraphData = {
    nodes: [node('root'), node('wife', 10)],
    links: [{ source: 'person:wife', target: 'person:root', label: 'WIFE', value: 1 }],
  };
  const props = { data: before, onNodeClick: vi.fn() };
  const view = render(<GraphSurface {...props} />);
  expect((rendered.props!.graphData as GraphData).nodes.map(n => n.slug)).toEqual(['root', 'wife']);

  view.rerender(<GraphSurface {...props} data={{ nodes: [node('root')], links: [] }} />);
  const graphData = rendered.props!.graphData as GraphData;
  expect(graphData.nodes.map(n => n.slug)).toEqual(['root']);
  expect(graphData.links).toEqual([]);
});

it('measures a hit area without depending on the visible pass having run', () => {
  render(<GraphSurface data={{ nodes: [node('root')], links: [] }} onNodeClick={vi.fn()} />);
  const paint = rendered.props!.nodePointerAreaPaint as (node: unknown, color: string, ctx: unknown, scale: number) => void;
  const ctx = { font: '', measureText: () => ({ width: 40 }), fillStyle: '', fillRect: vi.fn() };

  paint({ ...node('root'), x: 5, y: 7 }, '#ff0000', ctx, 1);

  expect(ctx.fillRect).toHaveBeenCalledTimes(1);
  expect(ctx.fillStyle).toBe('#ff0000');
});
