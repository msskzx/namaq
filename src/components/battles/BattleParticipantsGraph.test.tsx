// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import type { GraphNodeFull } from '@/types/graph';

const { push, capturedProps } = vi.hoisted(() => ({
  push: vi.fn(),
  capturedProps: { current: null as unknown as { url: string; onNodeClick: (node: GraphNodeFull) => void } },
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('@/components/graph/GraphSurface', () => ({
  default: (props: { url: string; onNodeClick: (node: GraphNodeFull) => void }) => {
    capturedProps.current = props;
    return null;
  },
}));

import BattleParticipantsGraph from './BattleParticipantsGraph';

const battle: GraphNodeFull = { id: 'battle:badr', label: 'غزوة بدر', slug: 'badr', group: 1, type: 'battle' };
const participant: GraphNodeFull = { id: 'person:ali-ibn-abi-talib', label: 'Ali', slug: 'ali-ibn-abi-talib', group: 1, type: 'person' };

describe('BattleParticipantsGraph', () => {
  it('fetches that battle', async () => {
    render(<BattleParticipantsGraph slug="badr" />);

    await waitFor(() => expect(capturedProps.current).not.toBeNull());
    expect(capturedProps.current.url).toBe('/api/graph?battle=badr');
  });

  it('navigates to a person profile when a person node is clicked', async () => {
    render(<BattleParticipantsGraph slug="badr" />);

    await waitFor(() => expect(capturedProps.current).not.toBeNull());
    capturedProps.current.onNodeClick(participant);

    expect(push).toHaveBeenCalledWith('/people/ali-ibn-abi-talib');
  });

  it('does not navigate when the battle node itself is clicked', async () => {
    push.mockClear();
    render(<BattleParticipantsGraph slug="badr" />);

    await waitFor(() => expect(capturedProps.current).not.toBeNull());
    capturedProps.current.onNodeClick(battle);

    expect(push).not.toHaveBeenCalled();
  });
});
