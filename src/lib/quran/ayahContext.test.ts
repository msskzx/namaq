import { describe, expect, it } from 'vitest';
import type { BranchAyah } from './branches';
import { normalizeWord } from './normalize';
import { ayahContexts, sharedByAll, surrounding } from './ayahContext';
import { loadReaderAyat } from './readerAyat';

const ayah = (key: string, page = 1, words = ['قَالَ']): BranchAyah => ({ key, page, words });

describe('ayahContexts', () => {
  it('returns requested ayat once in numeric Quran order with their original words and pages', () => {
    const selected = ayah('2:10', 3, ['يُسْرًۭا']);
    const all = [ayah('10:1'), selected, ayah('2:9'), ayah('2:11')];
    const snapshot = structuredClone(all);

    expect(ayahContexts(all, ['10:1', '2:10', '2:9', '2:10', '2:99'])).toEqual([
      { ayah: all[2], before: null, after: selected },
      { ayah: selected, before: all[2], after: all[3] },
      { ayah: all[0], before: null, after: null },
    ]);
    expect(all).toEqual(snapshot);
  });

  it('never substitutes a nonadjacent ayah or crosses into another surah', () => {
    const all = [ayah('1:7'), ayah('2:1'), ayah('2:3'), ayah('3:1')];

    expect(ayahContexts(all, all.map(item => item.key))).toEqual(all.map(item => ({
      ayah: item, before: null, after: null,
    })));
    expect(ayahContexts(all, [])).toEqual([]);
  });
});

describe('loadReaderAyat', () => {
  it('loads the complete original corpus, including context outside shared opening groups', async () => {
    const all = await loadReaderAyat();

    expect(all).toHaveLength(6236);
    expect(new Set(all.map(item => item.key)).size).toBe(6236);
    expect(ayahContexts(all, ['1:1', '1:7', '2:1', '114:6']).map(({ ayah, before, after }) => [
      ayah.key, before?.key ?? null, after?.key ?? null,
    ])).toEqual([
      ['1:1', null, '1:2'],
      ['1:7', '1:6', null],
      ['2:1', null, '2:2'],
      ['114:6', '114:5', null],
    ]);
    const [crossPage] = ayahContexts(all, ['2:142']);
    expect(crossPage.before).toMatchObject({ key: '2:141', page: 21 });
    expect(crossPage.ayah).toMatchObject({ key: '2:142', page: 22 });
    expect(crossPage.after).toMatchObject({ key: '2:143', page: 22 });
    const [first, second] = ayahContexts(all, ['94:6', '94:5']);
    expect(first.ayah).toEqual({ key: '94:5', page: 597, words: ['فَإِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًا'] });
    expect(second.ayah).toEqual({ key: '94:6', page: 597, words: ['إِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًۭا'] });
    expect(first.after).toEqual(second.ayah);
    expect(second.before).toEqual(first.ayah);
  });
});

describe('sharedByAll', () => {
  it('marks only the words found in every ayah: the same form exact, otherwise by root', async () => {
    const all = await loadReaderAyat();
    const [first, second, third] = sharedByAll(ayahContexts(all, ['2:6', '94:5', '94:6']));
    expect(first.match).toEqual({ exact: [], rooted: [0] });
    expect(second.match).toEqual({ exact: [], rooted: [0] });
    expect(third.match).toEqual({ exact: [], rooted: [0] });
  });

  it('marks words differing only in tashkeel by root, and every word exact when all ayat agree', async () => {
    const all = await loadReaderAyat();
    expect(sharedByAll(ayahContexts(all, ['94:5', '94:6'])).map(context => context.match)).toEqual([{ exact: [1, 2, 3], rooted: [0] }, { exact: [1, 2, 3], rooted: [0] }]);
    expect(sharedByAll(ayahContexts(all, ['23:26', '23:39', '29:30'])).map(context => context.match?.exact)).toEqual([[0, 1, 2], [0, 1, 2], [0, 1, 2]]);
  });

  it('marks the same number of each shared word in every ayah, even when one ayah repeats it', async () => {
    const all = await loadReaderAyat();
    for (const keys of [['28:16', '7:23', '71:28'], ['2:255', '3:2', '2:6']]) {
      const marked = sharedByAll(ayahContexts(all, keys)).map(context => [...context.match!.exact, ...context.match!.rooted].length);
      expect(new Set(marked).size).toBe(1);
      expect(marked[0]).toBeGreaterThan(0);
    }
    const [own] = sharedByAll(ayahContexts(all, ['28:16', '7:23', '71:28']));
    expect(own.match!.rooted.some(i => own.ayah.words[i].includes('غْفِر'))).toBe(true);
  });

  it('leaves a single ayah unmarked', async () => {
    const all = await loadReaderAyat();
    expect(sharedByAll(ayahContexts(all, ['1:1']))[0].match).toBeUndefined();
  });
});

describe('surrounding', () => {
  it('crosses into the neighbouring surah with the basmala between, except before at-Tawbah', async () => {
    const all = await loadReaderAyat();
    const basmala = all[0].words;
    const { before, after } = surrounding(all, ['2:27', '4:1', '9:1', '1:1'], ['2:27', '3:200', '8:75', '114:6']);

    expect(before['2:27']).toMatchObject({ key: '2:26' });
    expect(before['2:27']).not.toHaveProperty('basmala');
    expect(before['4:1']).toMatchObject({ key: '3:200', basmala });
    expect(before['9:1']).toMatchObject({ key: '8:75' });
    expect(before['9:1']).not.toHaveProperty('basmala');
    expect(before['1:1']).toMatchObject({ key: '114:6' });
    expect(before['1:1']).not.toHaveProperty('basmala');
    expect(after['2:27']).toMatchObject({ key: '2:28' });
    expect(after['3:200']).toMatchObject({ key: '4:1', basmala });
    expect(after['8:75']).not.toHaveProperty('basmala');
    expect(after['8:75']).toMatchObject({ key: '9:1' });
    expect(after['114:6']).toBeNull();
    expect(basmala.map(normalizeWord).join(' ')).toBe('بسم الله الرحمن الرحيم');
  });

  it('crosses from al-Fatiha into al-Baqarah after the basmala ayah ends the surah', async () => {
    const all = await loadReaderAyat();
    expect(surrounding(all, ['2:1'], []).before['2:1']).toMatchObject({ key: '1:7', basmala: all[0].words });
  });

  it('shows the end of an-Nas and then the basmala before al-Fatiha’s second ayah', async () => {
    const all = await loadReaderAyat();
    const last = all.find(entry => entry.key === '114:6')!;
    const basmala = all.find(entry => entry.key === '1:1')!;
    expect(surrounding(all, ['1:2'], []).before['1:2']).toEqual({
      key: last.key, page: last.page, words: last.words, basmala: basmala.words,
    });
  });

  it('wraps before the basmala ayah without repeating the basmala', async () => {
    const all = await loadReaderAyat();
    const last = all.find(entry => entry.key === '114:6')!;
    expect(surrounding(all, ['1:1'], []).before['1:1']).toEqual({ key: last.key, page: last.page, words: last.words });
  });

  it('does not wrap a partial corpus without the actual final ayah of an-Nas', () => {
    const all = [ayah('1:1'), ayah('1:2'), ayah('114:5')];
    expect(surrounding(all, ['1:1', '1:2'], []).before).toEqual({
      '1:1': null,
      '1:2': { key: '1:1', page: 1, words: all[0].words },
    });
  });

  it('gives no neighbour for an unknown ayah', () => {
    expect(surrounding([ayah('2:1'), ayah('2:2')], ['2:9'], ['2:2'])).toEqual({ before: { '2:9': null }, after: { '2:2': null } });
  });
});
