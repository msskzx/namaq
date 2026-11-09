import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { MushafPage } from '@shared/quran/readerPage';
import type { RecitePosition } from '@shared/quran/recite';
import { pageModel, reciteView } from './recitePage';

const page = (n: number): MushafPage => JSON.parse(readFileSync(join(__dirname, '../../../shared/data/quran/mushaf', `${n}.json`), 'utf8'));

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
