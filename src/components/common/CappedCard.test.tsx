// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CappedCard from './CappedCard';

/** jsdom lays nothing out: the content's height and the card's frame are given here. */
function sized(content: number, frame: number) {
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(content);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(frame);
}

const card = <CappedCard whole={<><p>النص كله</p><button>احفظ البطاقة</button></>}><p>أول النص</p></CappedCard>;

// Owner, 2026-11-20: no feed card is taller than about two thirds of the screen; a longer one stops with a fade and
// «اقرأ كاملًا» opens it whole in a sheet, with the card's buttons at the sheet's foot.
describe('CappedCard', () => {
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });

  it('shows a card that fits whole, with no «اقرأ كاملًا»', () => {
    sized(300, 300);
    render(card);
    expect(screen.getByText('أول النص')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'اقرأ كاملًا' })).toBeNull();
  });

  it('stops a longer card and opens it whole, with its buttons, in a sheet', () => {
    sized(1400, 600);
    render(card);
    expect(screen.queryByText('النص كله')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'اقرأ كاملًا' }));
    const sheet = screen.getByRole('dialog', { name: 'اقرأ كاملًا' });
    expect(within(sheet).getByText('النص كله')).toBeTruthy();
    expect(within(sheet).getByRole('button', { name: 'احفظ البطاقة' })).toBeTruthy();
  });
});
