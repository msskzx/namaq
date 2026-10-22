import { describe, expect, it } from 'vitest';
import type { BranchAyah } from './branches';
import { ayahContexts, loadReaderAyat } from './ayahContext';

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
    expect(first.ayah).toEqual({ key: '94:5', page: 596, words: ['فَإِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًا'] });
    expect(second.ayah).toEqual({ key: '94:6', page: 596, words: ['إِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًۭا'] });
    expect(first.after).toEqual(second.ayah);
    expect(second.before).toEqual(first.ayah);
  });
});
