import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import ReviewKeys from './ReviewKeys';

const push = vi.fn();
const refresh = vi.fn();
vi.mock('@/components/common/NavigationLoader', () => ({ useNavigatingRouter: () => ({ push, refresh }) }));

afterEach(() => { cleanup(); push.mockReset(); refresh.mockReset(); });

const pressed: string[] = [];
function page(previous?: string, next?: string, unreviewed?: boolean) {
  pressed.length = 0;
  Element.prototype.scrollIntoView = () => {};
  return render(<main dir="rtl">
    <ReviewKeys previous={previous} next={next} unreviewed={unreviewed} />
    <select aria-label="pages"><option>1</option></select>
    {['one', 'two'].map(id => <article key={id} data-review-card={id}>
      {['keep', 'drop', 'discuss'].map(action => <button key={action} data-card-action={action} onClick={() => pressed.push(`${id}:${action}`)}>{action}</button>)}
    </article>)}
  </main>);
}
const current = (container: HTMLElement) => container.querySelector('[data-current]')?.getAttribute('data-review-card');

describe('ReviewKeys', () => {
  it('a, d and q press keep, drop and discuss on the current card and move to the next, on any keyboard layout; r presses nothing', () => {
    const { container } = page();
    expect(current(container)).toBe('one');
    fireEvent.keyDown(window, { key: 'ش', code: 'KeyA' });
    expect(pressed).toEqual(['one:keep']);
    expect(current(container)).toBe('two');
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'd', code: 'KeyD' });
    fireEvent.keyDown(window, { key: 'r', code: 'KeyR' });
    fireEvent.keyDown(window, { key: 'q', code: 'KeyQ' });
    expect(pressed).toEqual(['one:keep', 'one:drop', 'two:discuss']);
  });

  it('left turns to the next page and right to the previous, as an Arabic book turns', () => {
    page('/prev', '/next');
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(push.mock.calls).toEqual([['/next'], ['/prev']]);
  });

  it('with only unreviewed cards shown, turning the page after a press reloads this page, so no unreviewed card is skipped', () => {
    page(undefined, '/next', true);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(push.mock.calls).toEqual([['/next']]);
    fireEvent.click(document.querySelector('[data-card-action="drop"]')!);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(push.mock.calls).toEqual([['/next']]);
    expect(refresh).toHaveBeenCalledOnce();
  });

  it('a click makes a card current, and keys typed into a field, with a modifier or under an open dialog press nothing', () => {
    const { container, getByLabelText } = page();
    fireEvent.pointerDown(container.querySelector('[data-review-card="two"]')!);
    expect(current(container)).toBe('two');
    fireEvent.keyDown(getByLabelText('pages'), { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'a', code: 'KeyA', metaKey: true });
    const dialog = document.body.appendChild(document.createElement('dialog'));
    dialog.setAttribute('open', '');
    fireEvent.keyDown(window, { key: 'a', code: 'KeyA' });
    dialog.remove();
    expect(pressed).toEqual([]);
    expect(current(container)).toBe('two');
  });

  it('a held key presses one card, and a second press on the last card turns the page or does nothing, never an undo', () => {
    page(undefined, '/next');
    fireEvent.keyDown(window, { key: 'a', code: 'KeyA' });
    fireEvent.keyDown(window, { key: 'a', code: 'KeyA', repeat: true });
    expect(pressed).toEqual(['one:keep']);
    fireEvent.keyDown(window, { key: 'a', code: 'KeyA' });
    fireEvent.keyDown(window, { key: 'a', code: 'KeyA' });
    expect(pressed).toEqual(['one:keep', 'two:keep']);
    expect(push.mock.calls).toEqual([['/next']]);
    cleanup();
    const last = page();
    fireEvent.pointerDown(last.container.querySelector('[data-review-card="two"]')!);
    fireEvent.keyDown(window, { key: 'a', code: 'KeyA' });
    fireEvent.keyDown(window, { key: 'a', code: 'KeyA' });
    expect(pressed).toEqual(['two:keep']);
    expect(current(last.container)).toBeUndefined();
  });

  it('left and right never reach the matrices, which slide on them, even with no page to turn to', () => {
    page();
    const reached: string[] = [];
    const matrix = (event: KeyboardEvent) => { if (!event.defaultPrevented) reached.push(event.key); };
    window.addEventListener('keydown', matrix);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    window.removeEventListener('keydown', matrix);
    expect(reached).toEqual([]);
  });
});
