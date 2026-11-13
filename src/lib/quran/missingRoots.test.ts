import { describe, expect, it } from 'vitest';
import type { BranchAyah } from '@shared/quran/branches';
import type { PairCard } from '@shared/quran/compareCards';
import { rootGaps, rootTable, rootTableMarkdown } from './missingRoots';

const info = new Map<string, BranchAyah>([
  ['7:116', { key: '7:116', words: ['قَالَ', 'أَلْقُوا۟', 'سَحَرُوٓا۟'], roots: ['qwl', 'lqy', 'sHr'], lemmas: ['qaAla', '>aloqaY`', 'saHara'] } as BranchAyah],
  ['26:35', { key: '26:35', words: ['يُرِيدُ', 'بِسِحْرِهِۦ', 'قَالَ'], roots: ['rwd', 'sHr', 'qwl'], lemmas: ['>araAda', 'siHor', 'qaAla'] } as BranchAyah],
  ['26:36', { key: '26:36', words: ['قَالُوا۟', 'أَلْقُوا۟'], roots: ['qwl', 'lqy'], lemmas: ['qaAla', '>aloqaY`'] } as BranchAyah],
]);

const ayah = (key: string, marks: Record<number, { kind: 'exact' }> = {}) => ({ number: Number(key.split(':')[1]), words: info.get(key)!.words, marks });

describe('rootGaps', () => {
  it('finds words sharing a root across the sides when neither is marked, and says how close they are', () => {
    const card: PairCard = { id: '7:116|26:35', sides: [{ surah: 7, ayah: 116, ayat: [ayah('7:116')] }, { surah: 26, ayah: 35, ayat: [ayah('26:35')] }] };
    const gaps = rootGaps(card, info, [7, 26]);
    expect(gaps.map(gap => [gap.root, gap.a.word, gap.b.word, gap.same, gap.where])).toEqual([
      ['qwl', 'قَالَ', 'قَالَ', 'letters', 'same pair'],
      ['sHr', 'سَحَرُوٓا۟', 'بِسِحْرِهِۦ', 'root', 'same pair'],
    ]);
    expect(gaps[0].href).toBe('/quran/compare?a=7&b=26#c-7-116-26-35');
  });

  it('skips a word that carries a mark, and names ayat a range card does not pair', () => {
    const card: PairCard = {
      id: '7:116|26:35-36',
      pairs: [{ id: '7:116|26:35' }],
      sides: [{ surah: 7, ayah: 116, ayat: [ayah('7:116', { 0: { kind: 'exact' }, 2: { kind: 'exact' } })] }, { surah: 26, ayah: 35, ayat: [ayah('26:35'), ayah('26:36')] }],
    };
    expect(rootGaps(card, info, [7, 26]).map(gap => [gap.root, gap.b.key, gap.where])).toEqual([['lqy', '26:36', 'unpaired ayat']]);
  });

  it('tells a story part’s rows apart', () => {
    const card: PairCard = {
      id: '7:116|26:35-36',
      pairs: [{ id: '7:116|26:36' }],
      sides: [
        { surah: 7, ayah: 116, ayat: [ayah('7:116')], rows: [[116], []] },
        { surah: 26, ayah: 35, ayat: [ayah('26:35'), ayah('26:36')], rows: [[36], [35]] },
      ],
    };
    expect(rootGaps(card, info, [7, 26]).map(gap => [gap.root, gap.b.key, gap.where])).toEqual([
      ['qwl', '26:36', 'same row'],
      ['lqy', '26:36', 'same row'],
      ['sHr', '26:35', 'other rows'],
    ]);
  });

  it('checks each partner of a one-to-many card against the shared ayah', () => {
    const card: PairCard = {
      id: '7:116|26:35,36',
      pairs: [{ id: '7:116|26:35' }, { id: '7:116|26:36' }],
      many: { side: 1, options: [{ id: '7:116|26:35', ayah: ayah('26:35'), shared: ayah('7:116') }, { id: '7:116|26:36', ayah: ayah('26:36'), shared: ayah('7:116') }] },
      sides: [{ surah: 7, ayah: 116, ayat: [ayah('7:116')] }, { surah: 26, ayah: 35, ayat: [ayah('26:35')] }],
    };
    expect(rootGaps(card, info, [7, 26]).map(gap => [gap.a.key, gap.b.key, gap.root])).toEqual([
      ['7:116', '26:35', 'qwl'], ['7:116', '26:35', 'sHr'], ['7:116', '26:36', 'qwl'], ['7:116', '26:36', 'lqy'],
    ]);
  });
});

describe('rootTable', () => {
  it('puts the rarest root first and writes one Markdown row per gap', () => {
    const card: PairCard = { id: '7:116|26:35', sides: [{ surah: 7, ayah: 116, ayat: [ayah('7:116')] }, { surah: 26, ayah: 35, ayat: [ayah('26:35')] }] };
    const rows = rootTable(rootGaps(card, info, [7, 26]), new Map([['qwl', 0.5], ['sHr', 5]]));
    expect(rows.map(row => row.root)).toEqual(['sHr', 'qwl']);
    const markdown = rootTableMarkdown(rows);
    expect(markdown).toContain('| سحر | 5.0 | 1 | سَحَرُوٓا۟ (7:116) | بِسِحْرِهِۦ (26:35) | root only | same pair | [open](http://localhost:3000/quran/compare?a=7&b=26#c-7-116-26-35) |');
    expect(markdown).toContain('2 gaps under 2 roots');
  });
});
