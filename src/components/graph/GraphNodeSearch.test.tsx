// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach } from 'vitest';
import GraphNodeSearch from './GraphNodeSearch';
import { GraphNodeFull } from '@/types/graph';

afterEach(cleanup);

const nodes: GraphNodeFull[] = [
  { id: '1', label: 'Battle of Badr', slug: 'battle-of-badr', group: 1, type: 'battle' },
  { id: '2', label: 'Battle of Uhud', slug: 'battle-of-uhud', group: 1, type: 'battle' },
  { id: '3', label: 'أبو بكر الصديق', slug: 'abu-bakr-as-siddiq', group: 2, type: 'person' },
];

describe('GraphNodeSearch', () => {
  it('shows no suggestions for an empty query', () => {
    render(<GraphNodeSearch nodes={nodes} onSelect={vi.fn()} placeholder="Search" />);
    expect(screen.queryByText('Battle of Badr')).toBeNull();
  });

  it('filters suggestions by a partial, case-insensitive match', () => {
    render(<GraphNodeSearch nodes={nodes} onSelect={vi.fn()} placeholder="Search" />);
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'badr' } });
    expect(screen.getByText('Battle of Badr')).toBeTruthy();
    expect(screen.queryByText('Battle of Uhud')).toBeNull();
  });

  it('matches Arabic labels through diacritic/hamza normalization', () => {
    render(<GraphNodeSearch nodes={nodes} onSelect={vi.fn()} placeholder="Search" />);
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'ابو بكر' } });
    expect(screen.getByText('أبو بكر الصديق')).toBeTruthy();
  });

  it('calls onSelect with the matched node and clears the input', () => {
    const onSelect = vi.fn();
    render(<GraphNodeSearch nodes={nodes} onSelect={onSelect} placeholder="Search" />);
    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'uhud' } });
    fireEvent.mouseDown(screen.getByText('Battle of Uhud'));
    expect(onSelect).toHaveBeenCalledWith(nodes[1]);
    expect(input.value).toBe('');
  });

  it('submitting the form selects the top match', () => {
    const onSelect = vi.fn();
    render(<GraphNodeSearch nodes={nodes} onSelect={onSelect} placeholder="Search" />);
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'badr' } });
    fireEvent.submit(screen.getByPlaceholderText('Search').closest('form')!);
    expect(onSelect).toHaveBeenCalledWith(nodes[0]);
  });

  it('shows a type label when nodes span more than one type', () => {
    render(
      <GraphNodeSearch
        nodes={nodes}
        onSelect={vi.fn()}
        placeholder="Search"
        typeLabel={(type) => (type === 'battle' ? 'Battle' : 'Person')}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'badr' } });
    expect(screen.getByText('Battle')).toBeTruthy();
  });
});
