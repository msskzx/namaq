// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { SWRConfig } from 'swr';
import BranchTree from './BranchTree';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const trunk = ['ذَٰلِكَ فَضْلُ اللَّهِ يُؤْتِيهِ مَن يَشَاءُ'];
const prefix = (key: string) => [{ word: '', conj: '', keys: [key], id: 'phrase' }];
const before = { '62:4': { key: '62:3', page: 553, words: ['وَآخَرِينَ مِنْهُمْ لَمَّا يَلْحَقُوا بِهِمْ'] }, '62:3': { key: '62:2', page: 553, words: ['هُوَ الَّذِي بَعَثَ فِي الْأُمِّيِّينَ رَسُولًا مِنْهُمْ'] } };
const wrapper = ({ children }: { children: React.ReactNode }) => <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}>{children}</SWRConfig>;

function tree(key: string, on = false) {
  return <BranchTree tree={{ words: trunk, ayat: [key], children: [] }} names={{}} prefixes={prefix(key)} surround={{ on }} />;
}

describe('preceding ayat as empty phrase prefixes', () => {
  it('loads a preceding ayah with surrounding off, including an all-empty prefix group', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ before: { '34:2': { key: '34:1', page: 428, words: ['الْحَمْدُ لِلَّهِ'] } }, after: {} }) });
    vi.stubGlobal('fetch', fetch);
    render(tree('34:2'), { wrapper });
    expect(screen.getByRole('status').textContent).toContain('جارٍ تحميل');
    await screen.findByText('الْحَمْدُ لِلَّهِ');
    expect(screen.queryByText('بداية الآية')).toBeNull();
    const url = new URL(fetch.mock.calls[0][0], 'http://localhost');
    expect(url.searchParams.get('before')).toBe('34:2');
    expect(url.searchParams.get('after')).toBe('');
    expect(fetch).toHaveBeenCalledOnce();
  });

  it('adds one earlier ayah on the same source path when surrounding is enabled', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ before, after: {} }) }));
    const { container } = render(tree('62:4'), { wrapper });
    await screen.findByText(before['62:4'].words[0]);
    expect(screen.queryByText(before['62:3'].words[0])).toBeNull();
    fireEvent.click(screen.getByRole('switch'));
    await screen.findByText(before['62:3'].words[0]);
    expect(screen.getAllByText(before['62:4'].words[0])).toHaveLength(1);
    const previous = container.querySelector('[data-node="before62:4"]')!;
    const earlier = container.querySelector('[data-node="earlier62:4"]')!;
    expect(previous.getAttribute('data-keys')).toBe('62:4');
    expect(earlier.getAttribute('data-keys')).toBe('62:4');
    const context = container.querySelector<HTMLButtonElement>('[data-node="n-1"] [data-context-open]')!;
    const click = vi.spyOn(context, 'click').mockImplementation(() => {});
    fireEvent.click(within(earlier as HTMLElement).getByRole('button', { name: /عرض الآيات في سياقها/ }));
    expect(click).toHaveBeenCalledOnce();
  });

  it('reuses preloaded neighbors without adding a step before the first ayah of a surah', () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const { container } = render(<BranchTree tree={{ words: trunk, ayat: ['62:4', '34:2'], children: [] }} names={{}}
      prefixes={[...prefix('62:4'), ...prefix('34:2')]}
      surround={{ on: true, data: { before: { ...before, '34:2': { key: '34:1', page: 428, words: ['الْحَمْدُ لِلَّهِ'] } }, after: {} } }} />, { wrapper });
    expect(screen.getAllByText(before['62:4'].words[0])).toHaveLength(1);
    expect(screen.getAllByText('الْحَمْدُ لِلَّهِ')).toHaveLength(1);
    expect(container.querySelector('[data-node="earlier62:4"]')?.getAttribute('data-keys')).toBe('62:4');
    expect(container.querySelector('[data-node="earlier34:2"]')).toBeNull();
    const context = container.querySelector<HTMLButtonElement>('[data-node="n-1"] [data-context-open]')!;
    const click = vi.spyOn(context, 'click').mockImplementation(() => {});
    const previous = container.querySelector<HTMLElement>('[data-node="before34:2"]')!;
    fireEvent.click(within(previous).getByRole('button', { name: /عرض الآيات في سياقها/ }));
    expect(click).toHaveBeenCalledOnce();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('shows the start-of-surah fallback without requesting a cross-surah neighbor', () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    render(tree('34:1'), { wrapper });
    const before = screen.getByRole('list', { name: 'ما قبل العبارة' });
    expect(within(before).getByText('بداية السورة')).toBeTruthy();
    expect(within(before).getByText('٣٤:١')).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('offers a retry when mandatory preceding ayat fail to load', async () => {
    const fetch = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ ok: true, json: async () => ({ before, after: {} }) });
    vi.stubGlobal('fetch', fetch);
    render(tree('62:4'), { wrapper });
    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'حاول مجددًا' }));
    await screen.findByText(before['62:4'].words[0]);
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });
});

it('still loads the following ayah at the start of a surah when surrounding is enabled', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ before: { '34:1': null }, after: { '34:1': { key: '34:2', page: 428, words: ['يَعْلَمُ مَا يَلِجُ'] } } }) }));
  render(tree('34:1', true), { wrapper });
  expect(await screen.findByText('يَعْلَمُ مَا يَلِجُ')).toBeTruthy();
});
