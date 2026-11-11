import { describe, expect, it } from 'vitest';
import { keys } from '@shared/quran/branches';
import { connectionBeats, grownIds, growthBeats, lineId, nodeId, nodeIndices } from './growth';
import { aroundOf, cardOf, growthParts, matrixOf, mixedBefore, treeList } from './branches';

const list = treeList();
const presentationOf = (index: number) => cardOf(list[index]).presentation;

describe('a tree growing in the studio', () => {
  const presentation = presentationOf(list.findIndex(piece => piece.keys.length >= 4));
  const ids = [...nodeIndices(presentation.tree).values()].map(nodeId);

  it('draws every box once, each after the connector into it', () => {
    const beats = growthBeats(presentation.tree);
    const revealed = beats.flatMap(beat => beat.reveal);
    for (const id of ids.filter(id => id !== 'n-1')) {
      expect(revealed.filter(item => item === id), id).toHaveLength(1);
      expect(revealed.indexOf(lineId(id)), id).toBeLessThan(revealed.indexOf(id));
    }
  });

  it('grows the ayat one after another, each from the root to its own end', () => {
    const beats = growthBeats(presentation.tree);
    const steps = [...new Set(beats.map(beat => beat.key))];
    expect(steps.sort()).toEqual([...new Set(keys(presentation.tree))].sort());
    expect(beats.map(beat => beat.step)).toEqual([...beats.map(beat => beat.step)].sort((a, b) => a - b));
  });

  it('asks for the first new box of each ayah before showing it, and never for one already drawn', () => {
    const beats = growthBeats(presentation.tree, { ask: true });
    const asks = beats.filter(beat => beat.ask);
    expect(asks.length).toBeGreaterThan(0);
    for (const ask of asks) {
      const at = beats.indexOf(ask);
      expect(beats.slice(0, at).some(beat => beat.reveal.includes(ask.ask!))).toBe(false);
      expect(beats[at + 1].reveal).toContain(ask.ask);
    }
  });

  it('with the surrounding switch, shows the ayah before an ayah ahead of it and the ayah after at its end', () => {
    const around = aroundOf(presentation);
    const parts = growthParts(presentation, around);
    const beats = growthBeats(presentation.tree, { ...parts, prefixes: presentation.prefixes });
    for (const [key, after] of Object.entries(parts.afters)) {
      const own = beats.filter(beat => beat.key === key);
      const shown = own.findIndex(beat => beat.reveal.includes(after));
      expect(shown, key).toBeGreaterThan(0);
      expect(own.slice(shown + 1).every(beat => !beat.reveal.length)).toBe(true);
    }
  });
});

describe('where a growing tree starts', () => {
  it('opens on a box, never on a connector, with or without the surrounding ayat', () => {
    for (const piece of list) {
      const presentation = cardOf(piece).presentation;
      for (const around of [undefined, aroundOf(presentation)]) {
        const parts = growthParts(presentation, around);
        const beats = growthBeats(presentation.tree, { ...parts, prefixes: presentation.prefixes });
        const first = beats.find(beat => beat.reveal.length)!;
        expect(first.reveal[0].startsWith('l:'), piece.id).toBe(false);
        const revealed = beats.flatMap(beat => beat.reveal);
        for (const start of parts.starts) expect(revealed.indexOf(start.id), start.id).toBeLessThan(revealed.indexOf(lineId(start.id)));
      }
    }
  }, 60_000);
});

describe('ayat around a tree', () => {
  it('always draws the ayah before ayat that open with the phrase when other ayat have words before it', () => {
    let mixed = presentationOf(0);
    for (let i = 0; i < list.length; i++) {
      mixed = presentationOf(i);
      if (mixedBefore(mixed) && mixed.prefixes.some(prefix => !prefix.word)) break;
    }
    const openers = mixed.prefixes.filter(prefix => !prefix.word).flatMap(prefix => prefix.keys);
    expect(openers.length).toBeGreaterThan(0);
    const { starts } = growthParts(mixed, undefined);
    for (const key of openers) expect(starts.map(start => start.id)).toContain(`b${key}`);
  });

  it('goes back to the previous surah before a surah’s first ayah, and one more ayah for the earlier box', () => {
    const presentation = { ...presentationOf(0), tree: { words: ['x'], ayat: ['2:1', '3:5'], children: [] }, prefixes: [] };
    const around = aroundOf(presentation);
    expect(around.before['2:1']?.key).toBe('1:7');
    expect(around.before['3:5']?.key).toBe('3:4');
    expect(around.earlier['3:5']?.key).toBe('3:3');
    expect(around.after['3:5']?.key).toBe('3:6');
  });
});

describe('the ayah matrix', () => {
  const presentation = presentationOf(10);

  it('has a row per ayah of the tree, coloured where every row shares the word', () => {
    const matrix = matrixOf(presentation, false);
    expect(matrix.columns).toEqual(['ayah']);
    expect(matrix.rows.map(row => row.ayah!.ayat[0].key)).toEqual(presentation.ayat.map(ayah => ayah.key));
    const sharedCounts = matrix.rows.map(row => row.ayah!.ayat[0].exact.size + row.ayah!.ayat[0].rooted.size);
    expect(new Set(sharedCounts).size).toBe(1);
    expect(sharedCounts[0]).toBeGreaterThan(0);
  });

  it('with the switch, puts the ayah before and after each row beside it', () => {
    const matrix = matrixOf(presentation, true);
    expect(matrix.columns).toEqual(['before', 'ayah', 'after']);
    const [surah, ayah] = matrix.rows[0].ayah!.ayat[0].key.split(':').map(Number);
    if (ayah > 1) expect(matrix.rows[0].before!.ayat[0].key).toBe(`${surah}:${ayah - 1}`);
  });
});

describe('connectionBeats', () => {
  it('draws each connection once, in order, one step each', () => {
    const beats = connectionBeats(3);
    expect([...grownIds(beats)]).toEqual(['r0', 'r1', 'r2']);
    expect(beats.at(-1)!.step).toBe(2);
    expect(beats.some(beat => beat.ask)).toBe(false);
  });

  it('asks for each connection before drawing it', () => {
    const beats = connectionBeats(2, true);
    beats.forEach((beat, i) => { if (beat.ask) expect(beats[i + 1].reveal).toEqual([beat.ask]); });
    expect(beats.filter(beat => beat.ask).map(beat => beat.ask)).toEqual(['r0', 'r1']);
  });
});
