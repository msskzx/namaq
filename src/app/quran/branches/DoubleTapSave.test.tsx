// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readBookmarks } from '@shared/bookmarks';
import { DoubleTapSave } from './Filters';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('@/components/common/NavigationLoader', () => ({ useNavigatingRouter: () => ({ push: () => {} }) }));
// jsdom has no PointerEvent: a mouse event carries the pointer's position.
class TestPointerEvent extends MouseEvent {
  isPrimary: boolean;
  constructor(type: string, init: PointerEventInit = {}) { super(type, init); this.isPrimary = init.isPrimary ?? true; }
}
beforeEach(() => { localStorage.clear(); vi.stubGlobal('PointerEvent', TestPointerEvent); vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
afterEach(cleanup);

const tap = (element: Element, at: number, x = 10) => {
  vi.setSystemTime(at);
  fireEvent.pointerDown(element, { isPrimary: true, clientX: x, clientY: 10 });
  fireEvent.pointerUp(element, { isPrimary: true, clientX: x, clientY: 10 });
};

describe('DoubleTapSave', () => {
  it('saves the tree on a double tap and never unsaves it', () => {
    render(<DoubleTapSave id="t1" text="هو الذي أرسل"><div data-testid="tree" /><button type="button">b</button></DoubleTapSave>);
    const tree = screen.getByTestId('tree');
    tap(tree, 0);
    tap(tree, 1000);
    expect(readBookmarks()).toHaveLength(0);
    tap(tree, 1100);
    expect(readBookmarks().map(item => item.id)).toEqual(['t1']);
    tap(tree, 2000);
    tap(tree, 2100);
    expect(readBookmarks().map(item => item.id)).toEqual(['t1']);
  });

  it('saves the given link as it is when one is passed', () => {
    render(<DoubleTapSave id="compare:2:154|16:21" text="ولا تقولوا" href="/quran/compare?a=2&b=16#c-2-154-16-21"><div data-testid="card" /></DoubleTapSave>);
    tap(screen.getByTestId('card'), 0);
    tap(screen.getByTestId('card'), 100);
    expect(readBookmarks()).toMatchObject([{ id: 'compare:2:154|16:21', href: '/quran/compare?a=2&b=16#c-2-154-16-21' }]);
  });

  it('saves on a double tap over a row marked to let taps through', () => {
    render(<DoubleTapSave id="t1" text="x"><button type="button" data-tap-through>row</button></DoubleTapSave>);
    const row = screen.getByRole('button', { name: 'row' });
    tap(row, 0);
    tap(row, 100);
    expect(readBookmarks().map(item => item.id)).toEqual(['t1']);
  });

  it('ignores taps on buttons and drags', () => {
    render(<DoubleTapSave id="t1" text="x"><div data-testid="tree" /><button type="button">b</button></DoubleTapSave>);
    const button = screen.getByRole('button', { name: 'b' });
    tap(button, 0);
    tap(button, 100);
    const tree = screen.getByTestId('tree');
    vi.setSystemTime(500);
    fireEvent.pointerDown(tree, { isPrimary: true, clientX: 0, clientY: 10 });
    fireEvent.pointerUp(tree, { isPrimary: true, clientX: 80, clientY: 10 });
    tap(tree, 600);
    expect(readBookmarks()).toHaveLength(0);
  });
});
