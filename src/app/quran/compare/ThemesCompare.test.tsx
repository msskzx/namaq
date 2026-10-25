// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ThemesCompare from './ThemesCompare';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    ayah: { findMany: async () => [] },
    surah: { findMany: async () => Array.from({ length: 114 }, (_, i) => ({ number: i + 1, name: `سورة ${i + 1}` })) },
  },
}));
vi.mock('@/lib/quran/topicEngine', () => ({ getSharedTopics: async () => [] }));
vi.mock('../themes/ThemesView', () => ({ default: ({ controls }: { controls: React.ReactNode }) => <>{controls}</> }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: () => {} }) }));

afterEach(cleanup);

const value = (label: string) => (screen.getByRole('combobox', { name: label }).parentElement!.querySelector('input[type=hidden]') as HTMLInputElement).value;

describe('ThemesCompare', () => {
  it('shows the newly chosen pair in its surah fields when the page moves to another pair', async () => {
    const { rerender } = render(await ThemesCompare({ query: { mode: 'themes', a: '16', b: '43' }, range: { unit: 'juz', range: null } }));
    rerender(await ThemesCompare({ query: { mode: 'themes', a: '57', b: '64' }, range: { unit: 'juz', range: null } }));
    expect([value('السورة الأولى'), value('السورة الثانية')]).toEqual(['57', '64']);
  });
});
