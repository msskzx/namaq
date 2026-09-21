// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import BattleCounts from './BattleCounts';
import type { Battle } from '@/types/battle';

const { language } = vi.hoisted(() => ({ language: { current: 'en' } }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: language.current }),
}));

afterEach(() => {
  cleanup();
  language.current = 'en';
});

function battle(over: Partial<Battle> = {}): Battle {
  return {
    id: 'b-1',
    slug: 'badr',
    name: 'غزوة بدر',
    nameTransliterated: 'Battle of Badr',
    hijriYear: 2,
    hijriPeriod: null,
    location: null,
    locationEn: null,
    description: null,
    ...over,
  };
}

describe('BattleCounts', () => {
  it('shows every count a source states', () => {
    render(
      <BattleCounts
        battle={battle({
          muslimForceCount: 313,
          nonMuslimForceCount: 950,
          muslimDeathCount: 14,
          nonMuslimDeathCount: 70,
        })}
      />,
    );

    ['313', '950', '14', '70'].forEach((n) => expect(screen.getByText(n)).toBeTruthy());
  });

  // A side nobody counted has no column, and a zero would read as a finding.
  it('leaves out a side nobody counted rather than showing a zero', () => {
    render(<BattleCounts battle={battle({ muslimForceCount: 300 })} />);

    expect(screen.getByText('300')).toBeTruthy();
    expect(screen.queryByText('0')).toBeNull();
    expect(screen.queryByText('Against them')).toBeNull();
  });

  it('renders nothing for a battle no source counted', () => {
    const { container } = render(<BattleCounts battle={battle()} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows a zero a source actually states', () => {
    render(<BattleCounts battle={battle({ muslimDeathCount: 0 })} />);
    expect(screen.getByText('0')).toBeTruthy();
  });
});
