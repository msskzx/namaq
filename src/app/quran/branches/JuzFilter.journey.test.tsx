// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { branchesHref } from '@/lib/quran/branches';
import JuzFilter from './JuzFilter';
import OpeningSearch from './OpeningSearch';

const navigation = vi.hoisted(() => ({
  search: '?o=قال رب اني&g=opening&p=3&juzFrom=25&juzTo=30',
  replace: vi.fn(),
  push: vi.fn(),
  params: new Map<string, URLSearchParams>(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/quran/branches',
  useRouter: () => ({ replace: navigation.replace, push: navigation.push }),
  useSearchParams: () => {
    if (!navigation.params.has(navigation.search)) navigation.params.set(navigation.search, new URLSearchParams(navigation.search));
    return navigation.params.get(navigation.search);
  },
}));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  navigation.search = '?o=قال رب اني&g=opening&p=3&juzFrom=25&juzTo=30';
  navigation.replace.mockClear();
  navigation.push.mockClear();
});

const input = (container: HTMLElement, name: string) => container.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;

describe('automatic juz range updates', () => {
  it('applies a valid edited range after the typing pause and resets pagination', async () => {
    vi.useFakeTimers();
    const { container } = render(<JuzFilter range={{ from: 25, to: 30 }} phrase="قال رب اني" view={{ grouped: true, page: 3 }} />);
    fireEvent.change(input(container, 'juzFrom'), { target: { value: '27' } });

    await vi.advanceTimersByTimeAsync(350);

    expect(navigation.replace).toHaveBeenCalledWith(branchesHref('قال رب اني', { from: 27, to: 30 }, { grouped: true, page: 1 }), { scroll: false });
  });

  it.each([
    ['من الجزء', ''],
    ['من الجزء', '31'],
    ['إلى الجزء', '24'],
    ['إلى الجزء', '0'],
  ])('keeps the applied range when %s is edited to %s', async (label, value) => {
    vi.useFakeTimers();
    const { container } = render(<JuzFilter range={{ from: 25, to: 30 }} phrase="قال رب اني" view={{ grouped: true, page: 3 }} />);
    fireEvent.change(input(container, label === 'من الجزء' ? 'juzFrom' : 'juzTo'), { target: { value } });

    await vi.advanceTimersByTimeAsync(500);

    expect(navigation.replace).not.toHaveBeenCalled();
    const explanation = container.querySelector<HTMLElement>('[role="status"], [role="alert"]');
    expect(explanation?.textContent).toMatch(/25|٢٥/);
    expect(explanation?.textContent).toMatch(/30|٣٠/);
  });

  it('uses only the latest valid range after rapid edits', async () => {
    vi.useFakeTimers();
    const { container } = render(<JuzFilter range={{ from: 25, to: 30 }} phrase="قال رب اني" view={{ grouped: true, page: 3 }} />);
    const from = input(container, 'juzFrom');
    fireEvent.change(from, { target: { value: '26' } });
    await vi.advanceTimersByTimeAsync(200);
    fireEvent.change(from, { target: { value: '27' } });
    await vi.advanceTimersByTimeAsync(350);

    expect(navigation.replace).toHaveBeenCalledTimes(1);
    expect(navigation.replace).toHaveBeenCalledWith(branchesHref('قال رب اني', { from: 27, to: 30 }, { grouped: true, page: 1 }), { scroll: false });
  });

  it('cancels a pending range update and restores the applied inputs when navigation changes the route', async () => {
    vi.useFakeTimers();
    const props = { range: { from: 25, to: 30 }, phrase: 'قال رب اني', view: { grouped: true, page: 3 } };
    const { container, rerender } = render(<JuzFilter {...props} />);
    fireEvent.change(input(container, 'juzFrom'), { target: { value: '27' } });
    navigation.search = '?o=فلا اقسم&g=opening&p=1&juzFrom=25&juzTo=30';
    rerender(<JuzFilter range={{ from: 25, to: 30 }} phrase="فلا اقسم" view={{ grouped: true, page: 1 }} />);

    await vi.advanceTimersByTimeAsync(500);

    expect(navigation.replace).not.toHaveBeenCalled();
    expect(input(container, 'juzFrom').value).toBe('25');
  });

  it('lets Enter search before a pending range update can overwrite it', async () => {
    vi.useFakeTimers();
    const view = { grouped: true, page: 3 };
    const juz = { from: 25, to: 30 };
    const { container } = render(<>
      <JuzFilter range={juz} phrase="قال رب اني" view={view} />
      <OpeningSearch top={[]} phrases={[{ id: 'ارءيتم', text: 'أَرَءَيْتُمْ', count: 2 }]} current="قال رب اني" juz={juz} view={view} />
    </>);
    fireEvent.change(input(container, 'juzFrom'), { target: { value: '27' } });
    const search = container.querySelector<HTMLElement>('[role="combobox"]')!;
    fireEvent.change(search, { target: { value: 'ارءيتم' } });
    fireEvent.keyDown(search, { key: 'Enter' });

    await vi.advanceTimersByTimeAsync(500);

    expect(navigation.push).toHaveBeenCalledWith(branchesHref('', juz, { grouped: true, query: 'ارءيتم' }));
    expect(navigation.replace).not.toHaveBeenCalled();
  });
});
