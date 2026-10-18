import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import HeroGraphPreview from './HeroGraphPreview';
import { PROPHET_GRAPH_HREF } from './homeLinks';
import { formatExpandParam } from '@/lib/relationship/urlState';
import type { GraphData, GraphNodeFull } from '@/types/graph';

const { options } = vi.hoisted(() => ({ options: vi.fn() }));
const data: GraphData = {
  nodes: ['prophet-muhammad', 'asma-bint-umays', 'abu-bakr-as-siddiq'].map(slug => ({ id: `person:${slug}`, slug, label: slug, group: 1 })),
  links: [{ source: 'person:asma-bint-umays', target: 'person:abu-bakr-as-siddiq', label: 'WIFE', value: 1 }],
};
vi.mock('@/components/graph/useExplorationGraph', () => ({ useExplorationGraph: (value: unknown) => { options(value); return { data, isLoading: false }; } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('@/components/graph/LazyGraphSurface', () => ({ default: ({ onNodeClick }: { onNodeClick: (node: GraphNodeFull) => void }) => <button onClick={() => onNodeClick(data.nodes[2])}>Select Abu Bakr</button> }));
vi.stubGlobal('ResizeObserver', class {
  constructor(private callback: (entries: { contentRect: { width: number; height: number } }[]) => void) {}
  observe() { this.callback([{ contentRect: { width: 800, height: 520 } }]); }
  disconnect() {}
});
afterEach(() => { cleanup(); options.mockClear(); });

describe('saved graph example', () => {
  it('uses the entire supplied graph state, including its selected person and multi-person expansions', () => {
    render(<HeroGraphPreview />);
    const saved = new URLSearchParams(PROPHET_GRAPH_HREF.split('?')[1]);
    const actual = options.mock.calls[0][0];
    expect(actual.input.roots).toEqual(saved.getAll('subject'));
    expect(actual.input.expansions.map(formatExpandParam)).toEqual(saved.getAll('expand'));
    expect(actual.kindParams).toEqual(saved.getAll('kind'));
    expect(actual.selectedSlug).toBe('asma-bint-umays');
    expect(screen.queryByRole('link', { name: 'View profile' })).toBeNull();
    expect(screen.queryByText('People in this example')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Wives' })).toBeNull();
  });
  it('lets a reader select another person without losing the supplied expansions', () => {
    render(<HeroGraphPreview />);
    fireEvent.click(screen.getByRole('button', { name: 'Select Abu Bakr' }));
    expect(options.mock.calls.at(-1)![0].selectedSlug).toBe('abu-bakr-as-siddiq');
    expect(options.mock.calls.at(-1)![0].input).toEqual(options.mock.calls[0][0].input);
  });
});
