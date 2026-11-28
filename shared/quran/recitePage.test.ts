import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { MushafPage } from './readerPage';
import type { RecitePosition } from './recite';
import { joinModels, pageModel, reciteView } from './recitePage';

const page = (n: number): MushafPage => JSON.parse(readFileSync(join(__dirname, '../data/quran/mushaf', `${n}.json`), 'utf8'));

function steps(model: ReturnType<typeof pageModel>, from: RecitePosition) {
  const seen: RecitePosition[] = [];
  for (let at: RecitePosition | null = from; at; at = reciteView(model, at).nextAyah()) seen.push(at);
  return seen;
}

describe('reciting one mushaf page', () => {
  const model = pageModel(page(580), 76);

  it('makes the next surah\'s title and basmala steps of their own before its first ayah', () => {
    const start = { start: '76:31', shown: '76:31', words: 0 };
    const [, title, basmala, first] = steps(model, start);
    const before = reciteView(model, start);
    expect(before.upcoming).toBe('77:1');
    expect(before.hidden('77:1', 0)).toBe(true);
    expect(reciteView(model, title).hidden('77:1', 0)).toBe(false);
    expect(reciteView(model, title).hidden('77:1', 1)).toBe(true);
    expect(reciteView(model, basmala).hidden('77:1', 1)).toBe(false);
    expect(reciteView(model, basmala).hidden('77:1', 2)).toBe(true);
    expect(first).toEqual({ start: '76:31', shown: '77:1', words: 0 });
  });

  it('starts at the surah itself without title steps', () => {
    const view = reciteView(model, { start: '77:1', shown: null, words: 0 });
    expect(view.hidden('77:1', 0)).toBe(true);
    expect(view.nextAyah()).toEqual({ start: '77:1', shown: '77:1', words: 0 });
  });

  it('reveals an ayah word by word, the last word completing it', () => {
    let at: RecitePosition = { start: '77:1', shown: null, words: 0 };
    at = reciteView(model, at).nextWord()!;
    expect(at).toEqual({ start: '77:1', shown: null, words: 1 });
    expect(reciteView(model, at).hidden('77:1', 0)).toBe(false);
    expect(reciteView(model, at).hidden('77:1', 1)).toBe(true);
    expect(reciteView(model, at).nextWord()).toEqual({ start: '77:1', shown: '77:1', words: 0 });
  });

  it('keeps ayat before the start visible and ends the page after its last ayah', () => {
    const view = reciteView(model, { start: '76:31', shown: null, words: 0 });
    expect(view.hidden('76:30', 0)).toBe(false);
    const all = steps(model, { start: '76:31', shown: null, words: 0 });
    expect(all.at(-1)?.shown).toBe(model.order.at(-1));
  });
});

describe('a two-page spread', () => {
  it('counts an ayah that runs over both pages as one, and keeps both pages\' order', () => {
    const [right, left] = [pageModel(page(2)), pageModel(page(3))];
    const spread = joinModels([right, left]);
    expect(spread.order).toEqual([...new Set([...right.order, ...left.order])]);
    const shared = right.order.find(key => left.order.includes(key));
    if (shared) expect(spread.words[shared]).toBe(right.words[shared] + left.words[shared]);
    expect(spread.lines.length).toBe(right.lines.length + left.lines.length);
    expect(joinModels([right])).toBe(right);
  });
});


describe('reviewing forgotten words (owner, 2026-11-21)', () => {
  const model = pageModel(page(2));

  it('hides the ayah and the page after it, then shows it up to each forgotten word, then the word, to its end', () => {
    const start: RecitePosition = { start: '2:2', gaps: [3, 6], shown: null, words: 0 };
    const view = reciteView(model, start);
    expect(view.hidden('2:1', 0)).toBe(false);
    expect(view.hidden('2:2', 0)).toBe(true);
    expect(view.hidden('2:3', 0)).toBe(true);
    expect(view.hidden('2:5', 0)).toBe(true);
    const seen = steps(model, start).slice(0, 5);
    expect(seen.map(at => at.shown ?? at.words)).toEqual([0, 3, 4, 6, '2:2']);
    const upToFirst = reciteView(model, seen[1]);
    expect(upToFirst.hidden('2:2', 2)).toBe(false);
    expect(upToFirst.hidden('2:2', 3)).toBe(true);
    expect(upToFirst.gap).toEqual({ place: 3, at: 3 });
    expect(reciteView(model, seen[2]).gap).toBeNull();
    expect(reciteView(model, seen[4]).hidden('2:3', 0)).toBe(true);
  });

  it('takes two steps when only the last word was forgotten', () => {
    expect(steps(model, { start: '2:2', gaps: [6], shown: null, words: 0 }).slice(0, 3).map(at => at.shown ?? at.words)).toEqual([0, 6, '2:2']);
  });

  it('counts Madina words without counting a hizb sign, so the gap lands on the right word', () => {
    const withHizb = pageModel({ juz: 1, items: [{ surah: 2 }, { line: ['۞', 'أول', 'ثان', 1, 'بعد', 2] }] });
    const view = reciteView(withHizb, { start: '2:1', gaps: [1], shown: null, words: 0 });
    const upTo = reciteView(withHizb, view.nextAyah()!);
    expect(upTo.hidden('2:1', 1)).toBe(false);
    expect(upTo.hidden('2:1', 2)).toBe(true);
    expect(upTo.gap).toEqual({ place: 1, at: 2 });
  });
});

describe('a sign inside the ayah is not a step (owner, 2026-11-28)', () => {
  const withHizb = pageModel({ juz: 1, items: [{ surah: 2 }, { line: ['۞', 'أول', 'ثان', 1, 'بعد', 2] }] });

  it('shows the ۞ together with the word after it', () => {
    const first = reciteView(withHizb, { start: '2:1', shown: null, words: 0 }).nextWord()!;
    expect(reciteView(withHizb, first).hidden('2:1', 0)).toBe(false);
    expect(reciteView(withHizb, first).hidden('2:1', 1)).toBe(false);
    expect(reciteView(withHizb, first).hidden('2:1', 2)).toBe(true);
    expect(reciteView(withHizb, first).nextWord()).toEqual({ start: '2:1', shown: '2:1', words: 0 });
  });

  it('reviews a forgotten first word with no step that shows only the ۞', () => {
    const view = reciteView(withHizb, { start: '2:1', gaps: [0], shown: null, words: 0 });
    expect(view.gap).toEqual({ place: 0, at: 1 });
    expect(reciteView(withHizb, view.nextAyah()!).hidden('2:1', 1)).toBe(false);
  });

  it('takes one tap per word on every quarter-opening ayah of the Quran', () => {
    let top: number | undefined;
    for (let n = 1; n <= 604; n++) {
      const data = page(n);
      const model = pageModel(data, top);
      top = data.items.flatMap(item => ('surah' in item ? [item.surah] : [])).at(-1) ?? top;
      for (const [key, signs] of Object.entries(model.signs)) {
        let at: RecitePosition = { start: key, shown: null, words: 0 };
        let taps = 0;
        while (at.shown !== key) { at = reciteView(model, at).nextWord()!; taps++; }
        expect(taps, key).toBe(model.words[key] - signs.length);
      }
    }
  });
});

describe('a spread keeps each sign at its place in the ayah', () => {
  it('counts a sign on the second page after the first page\'s words', () => {
    const right = pageModel({ juz: 1, items: [{ surah: 2 }, { line: ['أ', 'ب'] }] });
    const left = pageModel({ juz: 1, items: [{ line: ['۞', 'ج', 1] }] }, 2);
    expect(joinModels([right, left]).signs['2:1']).toEqual([2]);
  });
});
