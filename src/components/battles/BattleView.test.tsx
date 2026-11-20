import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { BATTLES, battleOf } from '@/lib/stories';
import BattleView from './BattleView';

afterEach(cleanup);

describe('BattleView', () => {
  it('draws a battle with its map, numbers, moments and people under one page heading', () => {
    const badr = battleOf('badr')!;
    render(<BattleView battle={badr} />);
    expect(screen.getByRole('heading', { level: 1, name: badr.name })).toBeTruthy();
    expect(screen.getByRole('img', { name: `خريطة: ${badr.place!.name}` })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'مجرى الغزوة' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: new RegExp(badr.moments[0].title) })).toBeTruthy();
  });

  it('inside another page starts a level lower, and leaves out the moments heading when there are none', () => {
    const quiet = BATTLES.find(battle => !battle.moments.length)!;
    render(<BattleView battle={quiet} inset />);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: quiet.name })).toBeTruthy();
    expect(screen.queryByText(/^مجرى/)).toBeNull();
  });

  it('reads a count the source does not give as «غير مذكور»', () => {
    const half = BATTLES.find(battle => !!battle.counts.muslims !== !!battle.counts.others);
    if (!half) return;
    render(<BattleView battle={half} />);
    expect(screen.getAllByText('غير مذكور').length).toBeGreaterThan(0);
  });

  it("puts the moments' pages on the book line under their card, not as links inside it (owner, 2026-11-20)", () => {
    const badr = battleOf('badr')!;
    const { container } = render(<BattleView battle={badr} />);
    const card = screen.getByRole('heading', { level: 2, name: 'مجرى الغزوة' }).closest('[data-card]') as HTMLElement;
    expect(within(card).queryAllByRole('link')).toEqual([]);
    const books = [...new Set(badr.moments.map(moment => moment.cite.split('، ')[0]))];
    const line = [...container.querySelectorAll('button')].find(button => button.getAttribute('aria-label') === `المصدر: ${books.join('، ')}`)!;
    expect(line).toBeTruthy();
    fireEvent.click(line);
    for (const moment of badr.moments) expect(screen.getAllByRole('link').some(link => link.getAttribute('href') === moment.url)).toBe(true);
  });
});
