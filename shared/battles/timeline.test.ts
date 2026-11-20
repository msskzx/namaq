import { describe, expect, it } from 'vitest';
import data from '../data/battles/battles.json';
import type { AppBattle } from './battle';
import { battleTimeline, MADINAH_YEARS, UNDATED_TITLE } from './timeline';

const battles = data as AppBattle[];
const timeline = battleTimeline(battles);
const columns = [...timeline.madinah, ...timeline.after];
const undated = battles.filter(battle => battle.year?.value == null);

describe('the battles timeline (owner, 2026-11-20)', () => {
  it('draws no dot for a battle the source gives no year, and lists those last under their own heading', () => {
    expect(undated.length).toBeGreaterThan(0);
    const dotted = new Set(columns.flatMap(column => column.dots.map(dot => dot.slug)));
    expect(undated.filter(battle => dotted.has(battle.slug))).toEqual([]);
    const last = timeline.groups[timeline.groups.length - 1];
    expect(last.title).toBe(UNDATED_TITLE);
    expect(last.year).toBeUndefined();
    expect(last.battles.map(battle => battle.slug)).toEqual(undated.map(battle => battle.slug));
  });

  it('puts each dated battle once on the axis and once in the list, both under its own year', () => {
    const dated = battles.filter(battle => battle.year?.value != null);
    expect(dated.length).toBeGreaterThan(0);
    for (const battle of dated) {
      const year = battle.year!.value;
      expect(columns.filter(column => column.dots.some(dot => dot.slug === battle.slug)).map(column => column.year)).toEqual([year]);
      expect(timeline.groups.filter(group => group.battles.includes(battle)).map(group => group.year)).toEqual([year]);
    }
  });

  it('runs the first axis over every year of Madinah, empty ones included, and the second only over later years with battles', () => {
    expect(timeline.madinah.map(column => column.year)).toEqual(Array.from({ length: MADINAH_YEARS }, (_, i) => i + 1));
    expect(timeline.after.length).toBeGreaterThan(0);
    for (const column of timeline.after) {
      expect(column.year).toBeGreaterThan(MADINAH_YEARS);
      expect(column.dots.length).toBeGreaterThan(0);
    }
  });
});
