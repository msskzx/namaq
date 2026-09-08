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
  it('renders All direct relations and the three lineage actions for a person', () => {
    render(<ExpansionControls {...props} isPerson />);
    expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual([
      'All direct relations',
      'Ancestors',
      'Paternal lineage',
      'Descendants',
    ]);
  });

  it('renders only All direct relations for a non-person subject', () => {
    render(<ExpansionControls {...props} isPerson={false} />);
    expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['All direct relations']);
  });

  it('omits All direct relations when no relation is eligible', () => {
    render(<ExpansionControls {...props} isPerson hasEligibleDirectRelations={false} />);
    expect(screen.queryByText('All direct relations')).toBeNull();
  });
});
