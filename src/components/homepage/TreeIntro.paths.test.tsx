// @vitest-environment jsdom
import React, { useRef } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { PathBox, PathButton, PathScope } from '@/app/quran/branches/Paths';
import TreeIntro, { SEEN } from './TreeIntro';

vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

function Tree() {
  const root = useRef<HTMLDivElement>(null);
  return <PathScope><div ref={root}>
    <div data-tree-content>
      {['opening', 'leaf'].map(id => <PathBox key={id} id={id} keys={['1:1']} className="" tone="" lit="">
        <span className="font-quran">{id}</span>
        <PathButton id={id} keys={['1:1']} subject={id} />
      </PathBox>)}
    </div>
    <TreeIntro target={root} ar />
  </div></PathScope>;
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.setItem(SEEN, '1');
  Element.prototype.animate = vi.fn(() => ({ cancel: vi.fn(), finished: Promise.resolve() }) as unknown as Animation);
});
afterEach(() => { cleanup(); localStorage.clear(); vi.useRealTimers(); });

it.each([true, false])('clears a shared path once for the intro and restores it after skip=%s', async skipped => {
  const { container } = render(<Tree />);
  const opening = screen.getByRole('button', { name: 'إظهار المسار: opening' });
  fireEvent.click(opening);
  expect(container.querySelectorAll('[data-path-toggle][aria-pressed="true"]')).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', { name: 'إعادة العرض' }));
  await act(async () => { await vi.advanceTimersByTimeAsync(100); });
  expect(container.querySelectorAll('[data-path-toggle][aria-pressed="true"]')).toHaveLength(0);
  if (skipped) fireEvent.click(screen.getByRole('button', { name: 'تخطّ' }));
  else await act(async () => { await vi.advanceTimersByTimeAsync(20000); });
  expect(container.querySelectorAll('[data-path-toggle][aria-pressed="true"]')).toHaveLength(2);
});
