import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { MushafPage } from './readerPage';
import { stepBack, type RecitePosition } from './recite';
import { joinModels, pageModel, reciteView } from './recitePage';

const page = (n: number): MushafPage => JSON.parse(readFileSync(join(__dirname, '../data/quran/mushaf', `${n}.json`), 'utf8'));

/** Steps a recitation forward with the main button until the page is done. */
function steps(model: ReturnType<typeof pageModel>, from: RecitePosition) {
  const seen: RecitePosition[] = [];
  for (let at: RecitePosition | null = from; at; at = reciteView(model, at).nextAyah()) seen.push(at);
  return seen;
}

describe('reciting one mushaf page', () => {
  // Page 580 ends Al-Insan (76:31), then opens Al-Mursalat with its title and basmala.
  const model = pageModel(page(580), 76);

  it('makes the next surah\'s title and basmala steps of their own before its first ayah', () => {
    const start = { start: '76:31', shown: '76:31', words: 0 };
    const [, title, basmala, first] = steps(model, start);
    const before = reciteView(model, start);
    expect(before.upcoming).toBe('77:1');
    expect(before.hidden('77:1', 0)).toBe(true); // title
    expect(reciteView(model, title).hidden('77:1', 0)).toBe(false);
    expect(reciteView(model, title).hidden('77:1', 1)).toBe(true); // basmala
    expect(reciteView(model, basmala).hidden('77:1', 1)).toBe(false);
    expect(reciteView(model, basmala).hidden('77:1', 2)).toBe(true); // first word of 77:1
    expect(first).toEqual({ start: '76:31', shown: '77:1', words: 0 });
  });

  it('starts at the surah itself without title steps', () => {
    const view = reciteView(model, { start: '77:1', shown: null, words: 0 });
    expect(view.hidden('77:1', 0)).toBe(true);
    expect(view.nextAyah()).toEqual({ start: '77:1', shown: '77:1', words: 0 });
  });

  it('reveals an ayah word by word, the last word completing it', () => {
    let at: RecitePosition = { start: '77:1', shown: null, words: 0 };
    // 77:1 is two words: وَٱلۡمُرۡسَلَٰتِ عُرۡفٗا
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


describe('single-word recitation', () => {
  const model = pageModel(page(1));

  it('hides only the marked word and keeps the rest of the ayah, its end and neighbouring ayat visible', () => {
    const view = reciteView(model, { start: '1:2', word: 1, shown: null, words: 0 });
    expect(view.hidden('1:2', 0)).toBe(false);
    expect(view.hidden('1:2', 1)).toBe(true);
    expect(view.hidden('1:2', 2)).toBe(false);
    expect(view.hidden('1:2', Number.MAX_SAFE_INTEGER)).toBe(false);
    expect(view.hidden('1:1', 0)).toBe(false);
    expect(view.hidden('1:3', 0)).toBe(false);
  });

  it('reveals the target with either reveal action, then restores its blank on a step back', () => {
    const position = { start: '1:2', word: 0, shown: null, words: 0 };
    const view = reciteView(model, position);
    const revealed = view.nextWord()!;
    expect(revealed).toEqual({ ...position, shown: '1:2' });
    expect(view.nextAyah()).toEqual(revealed);
    expect(reciteView(model, revealed).hidden('1:2', 0)).toBe(false);
    expect(reciteView(model, revealed).nextWord()).toBeNull();
    expect(reciteView(model, revealed).nextAyah()).toBeNull();
    const back = stepBack(revealed, new Map([[1, 7]]));
    expect(back).toEqual(position);
    expect(reciteView(model, back).hidden('1:2', 0)).toBe(true);
  });

  it('counts Madina words without counting a hizb sign as word zero', () => {
    const withHizb = pageModel({ juz: 1, items: [{ surah: 2 }, { line: ['۞', 'أول', 'ثان', 1, 'بعد', 2] }] });
    const first = reciteView(withHizb, { start: '2:1', word: 0, shown: null, words: 0 });
    expect(first.hidden('2:1', 0)).toBe(false);
    expect(first.hidden('2:1', 1)).toBe(true);
    expect(first.hidden('2:1', 2)).toBe(false);
    const second = reciteView(withHizb, { start: '2:1', word: 1, shown: null, words: 0 });
    expect(second.hidden('2:1', 1)).toBe(false);
    expect(second.hidden('2:1', 2)).toBe(true);
    expect(second.hidden('2:2', 0)).toBe(false);
  });
});
