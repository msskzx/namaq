import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
});
