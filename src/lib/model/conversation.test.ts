import { describe, expect, it } from 'vitest';
import { conversationOf } from './conversation';
import { applyApprovedInferences, loadInferences } from './inference';
import { loadModel } from './load';

const ROOT = 'src/lib/model/fixtures/jibril';

function muslim(models = loadModel(ROOT)) {
  const folder = models.find((f) => f.work.slug === 'test-muslim')!;
  return { folder, file: folder.units[0] };
}

describe('conversationOf (the hadith of Jibril fixtures)', () => {
  it('lists the scenes in order, the second quoted inside a turn of the first', () => {
    const { folder, file } = muslim();
    const scenes = conversationOf(folder, file, 'r_hadith', ROOT);
    expect(scenes.map((s) => s.ordinal)).toEqual([1, 2]);
    expect(scenes[1].inTurn).toBe('o3');
    expect(scenes[0].turns.map((t) => t.id)).toEqual(['o1', 'o2', 'o3']);
    expect(scenes[1].turns.map((t) => t.id)).toEqual(['s1', 's2', 's3', 's4']);
  });

  it('renders each turn from its spans, keeping two parts around an interruption', () => {
    const { folder, file } = muslim();
    const [first] = conversationOf(folder, file, 'r_hadith', ROOT)[0].turns;
    expect(first.parts).toHaveLength(2);
    expect(first.parts[0].startsWith('أَبَا عَبْدِ الرَّحْمَنِ')).toBe(true);
    expect(first.parts[1].endsWith('أُنُفٌ')).toBe(true);
  });

  it('names a speaker only where the sentence names one, and leaves a bare qala as not stated', () => {
    const { folder, file } = muslim();
    const turns = conversationOf(folder, file, 'r_hadith', ROOT).flatMap((s) => s.turns);
    const byId = Object.fromEntries(turns.map((t) => [t.id, t.speaker?.mention]));
    expect(byId).toMatchObject({
      o1: 'يَحْيَى بْنِ يَعْمَرَ',
      s1: 'رَجُلٌ',
      s2: 'رَسُولُ اللَّهِ',
    });
    expect(byId.o2).toBeUndefined();
    expect(byId.s3).toBeUndefined();
  });

  it('shows the stranger as Jibril once the closing words identify him', () => {
    const { folder, file } = muslim();
    const s1 = conversationOf(folder, file, 'r_hadith', ROOT)[1].turns[0];
    expect(s1.speaker).toEqual({ mention: 'رَجُلٌ', agent: 'jibril' });
  });

  it('marks a speaker that came from an approved inference, and only that one', () => {
    const applied = applyApprovedInferences(loadModel(ROOT), loadInferences(ROOT));
    const { folder, file } = muslim(applied);
    const turns = conversationOf(folder, file, 'r_hadith', ROOT).flatMap((s) => s.turns);
    expect(turns.find((t) => t.id === 'o2')).toMatchObject({ derivedBy: 'inf_o2' });
    expect(turns.find((t) => t.id === 'o3')?.speaker).toBeUndefined();
    expect(turns.filter((t) => t.derivedBy)).toHaveLength(1);
  });

  it('fails loudly on an unknown report', () => {
    const { folder, file } = muslim();
    expect(() => conversationOf(folder, file, 'nope', ROOT)).toThrow(/unknown report/);
  });
});
