import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import GraphSurface, { GraphSurfaceMethods } from './GraphSurface';
import { GraphData } from '@/types/graph';

const camera = vi.hoisted(() => ({ zoomToFit: vi.fn() }));
vi.mock('react-force-graph-2d', () => ({
  default: React.forwardRef(function ForceGraphStub(_props, ref) {
    React.useImperativeHandle(ref, () => camera);
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
