// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useNeighbours } from './useNeighbours';

vi.mock('@/lib/quran/quranText', () => ({
  quranSurrounding: async () => ({ before: { '2:34': { key: '2:33', words: ['قال'] } }, after: { '2:34': { key: '2:35', words: ['وقلنا'] } } }),
}));

const sides = [{ surah: 2, ayah: 34, ayat: [{ number: 34, words: ['وإذ'] }] }];

describe('useNeighbours', () => {
  it('drops the loaded neighbours when the switch turns off', async () => {
    const { result, rerender } = renderHook(({ on }) => useNeighbours(sides, on), { initialProps: { on: true } });
    await waitFor(() => expect(result.current?.before[0]?.number).toBe(33));
    rerender({ on: false });
    expect(result.current).toBeUndefined();
  });
});
