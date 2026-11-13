// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

import { PageVideo } from './CompareVideo';
import type { CardSide, PairCard } from './pairCards';

const side = (surah: number, ayah: number, words: string[]): CardSide => ({ surah, ayah, ayat: [{ number: ayah, words, marks: { 0: { kind: 'exact', link: '0' } } }] });
const card = (id: string, ayah: number, length: number): PairCard => ({ id, sides: [side(2, ayah, Array(length).fill('قال')), side(7, ayah, Array(length).fill('قال'))] });
const label = (s: CardSide) => `${s.surah}:${s.ayah}`;

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) { this.open = true; });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) { this.open = false; this.dispatchEvent(new Event('close')); });
});
afterEach(cleanup);

const open = (cards: PairCard[]) => render(<PageVideo cards={cards} title="البقرة والأعراف" label={label} ar onClose={() => {}} />);

describe('the page video', () => {
  it('lists every card ticked, and unticking leaves a card out', () => {
    open([card('a', 1, 5), card('b', 2, 5)]);
    const boxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(boxes.map(box => box.checked)).toEqual([true, true]);
    expect(screen.getByText('2:1 · 7:1')).toBeTruthy();
    fireEvent.click(boxes[0]);
    expect(boxes.map(box => box.checked)).toEqual([false, true]);
    fireEvent.click(screen.getByRole('button', { name: 'تحديد الكل' }));
    expect(boxes.map(box => box.checked)).toEqual([true, true]);
    fireEvent.click(screen.getByRole('button', { name: 'إلغاء تحديد الكل' }));
    expect(boxes.every(box => !box.checked)).toBe(true);
    expect((screen.getByRole('button', { name: 'مشاركة كفيديو' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('splits a long page into parts and records the first with the title and end frames', () => {
    // About 80 seconds a card at 1×: six cards don't fit in 3 minutes.
    open(Array.from({ length: 6 }, (_, i) => card(String(i), i + 1, 100)));
    expect(screen.getByText(/^الأجزاء ٣/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'مشاركة كفيديو' }));
    expect(screen.getByRole('dialog', { name: 'مشاركة كفيديو · الجزء ١ من ٣' })).toBeTruthy();
    const page = (document.querySelector('iframe') as HTMLIFrameElement).getAttribute('srcdoc')!;
    const input = JSON.parse(page.match(/var INPUT = (.*);\n/)![1]);
    expect(input.part).toBe('الجزء ١ من ٣');
    expect(input.next).toBe('يتبع في الجزء ٢');
    expect(page).not.toContain('vercel');
    expect(input.timeline[0].kind).toBe('title');
    expect(input.timeline.at(-1).kind).toBe('end');
    expect(input.counters).toEqual(['١ من ٦', '٢ من ٦']);
  });
});
