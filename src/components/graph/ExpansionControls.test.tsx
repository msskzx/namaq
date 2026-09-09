import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ExpansionControls from './ExpansionControls';
import translations from '@/components/language/translations';

afterEach(cleanup);

const props = {
  hasEligibleDirectRelations: true,
  isActive: () => false,
  onToggle: vi.fn(),
  onExpandAllDirectRelations: vi.fn(),
  g: translations.en.graph,
};

describe('ExpansionControls', () => {
  it('renders Explore and the two lineage directions for a person', () => {
    render(<ExpansionControls {...props} isPerson />);
    expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual([
      'Explore',
      'Ancestors',
      'Descendants',
    ]);
  });

  it('renders only Explore for a non-person subject', () => {
    render(<ExpansionControls {...props} isPerson={false} />);
    expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['Explore']);
  });

  it('omits Explore when no enabled relation has neighbors', () => {
    render(<ExpansionControls {...props} isPerson hasEligibleDirectRelations={false} />);
    expect(screen.queryByText('Explore')).toBeNull();
  });
});
