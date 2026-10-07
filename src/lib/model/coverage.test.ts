// docs/plans/siyar-parsing.md
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { coverageOf } from './coverage';
import { loadModel } from './load';
import type { UnitFile } from './types';

function unit(): UnitFile {
  return {
    unit: { id: 'u1', work: 'work', type: 'tarjama', numbers: { printed: '٣' } },
    spans: [],
    reports: [],
    statements: [],
    mentions: [],
    identifications: [],
    assertions: [],
  };
}

let root: string;

function write(file: UnitFile, pages: Record<string, string>) {
  const dir = join(root, 'data/works/work');
  mkdirSync(join(dir, 'units'), { recursive: true });
  writeFileSync(
    join(dir, 'work.json'),
    JSON.stringify({ slug: 'work', author: 'author', genre: 'TARAJEM' }),
  );
  writeFileSync(
    join(dir, 'editions.json'),
    JSON.stringify({
      editions: [{ slug: 'ed', work: 'work', publisher: 'test', editors: [], printing: '1' }],
      witnesses: [
        {
          slug: 'wit',
          edition: 'ed',
          vowelled: true,
          hasFootnotes: false,
          checkedAgainstPrint: false,
        },
      ],
    }),
  );
  writeFileSync(join(dir, 'units/u1.json'), JSON.stringify(file));
  for (const [page, content] of Object.entries(pages)) {
    const dir2 = join(root, 'data/history/sources/wit/v4');
    mkdirSync(dir2, { recursive: true });
    writeFileSync(join(dir2, `${page}.md`), content);
  }
}

function coverageFor(change: (file: UnitFile) => void, pages: Record<string, string>, manifest?: object) {
  const file = unit();
  change(file);
  write(file, pages);
  if (manifest) writeFileSync(join(root, 'data/history/sources/wit/source.json'), JSON.stringify(manifest));
  const models = loadModel(root);
  if (!models[0] || !models[0].units[0]) throw new Error('no units loaded');
  return coverageOf(models[0], models[0].units[0], root);
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'coverage-'));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

const heading = { id: 'sp1', edition: 'ed', volume: 4, page: '41', layer: 'MAIN' as const, exact: 'الزُّبَيْرُ بنُ العَوَّامِ', prefix: '٣ - ' };
const entry = {
  '41': `٣ - الزُّبَيْرُ بنُ العَوَّامِ

قَالَ أَوَّلُ. وَقَالَ ثَانٍ. وَقَالَ ثَالِثٌ.`,
  '42': `رَابِعٌ هُنَا.

٤ - عَبْدُ الرَّحْمَنِ

خَامِسٌ.`,
};

describe('coverageOf', () => {
  it('counts the entry from its heading to the next heading and reports it bounded', () => {
    const cov = coverageFor((f) => (f.spans = [heading]), entry);
    expect(cov.pages).toEqual(['41', '42']);
    expect(cov.sentences).toBe(5);
    expect(cov.covered).toBe(1);
    expect(cov.notModeled.map((s) => s.text)).toEqual([
      'قَالَ أَوَّلُ.',
      'وَقَالَ ثَانٍ.',
      'وَقَالَ ثَالِثٌ.',
      'رَابِعٌ هُنَا.',
    ]);
    expect(cov.bounded).toBe(true);
    expect(cov.outside).toEqual([]);
  });

  it('counts a sentence as covered only when a span covers half of it', () => {
    const half = { id: 'sp2', edition: 'ed', volume: 4, page: '41', layer: 'MAIN' as const, exact: 'وَقَالَ ثَانٍ', prefix: 'أَوَّلُ. ' };
    const sliver = { id: 'sp3', edition: 'ed', volume: 4, page: '41', layer: 'MAIN' as const, exact: 'ثَالِثٌ', prefix: 'وَقَالَ ' };
    const cov = coverageFor((f) => (f.spans = [heading, half, sliver]), entry);
    expect(cov.notModeled.map((s) => s.text)).toContain('وَقَالَ ثَالِثٌ.');
    expect(cov.notModeled.map((s) => s.text)).not.toContain('وَقَالَ ثَانٍ.');
  });

  it('puts a span after the next heading in outside', () => {
    const stray = { id: 'out1', edition: 'ed', volume: 4, page: '42', layer: 'MAIN' as const, exact: 'عَبْدُ الرَّحْمَنِ', prefix: '٤ - ' };
    expect(coverageFor((f) => (f.spans = [heading, stray]), entry).outside).toEqual(['out1']);
  });

  it('does not start an entry numbered 3 at a body line that merely contains "٣ - "', () => {
    const pages = { '41': 'قَالَ ١٣ - فِي وَسَطِ سَطْرٍ.\n\n٣ - الزُّبَيْرُ بنُ العَوَّامِ\n\nنَصٌّ هُنَا.\n\n٤ - غَيْرُهُ' };
    const cov = coverageFor((f) => (f.spans = [heading]), pages);
    expect(cov.sentences).toBe(2);
    expect(cov.notModeled.map((s) => s.text)).toEqual(['نَصٌّ هُنَا.']);
  });

  it('ends an entry that starts mid-page when the next heading is on the same page', () => {
    const pages = { '41': 'سَابِقٌ هُنَا.\n\n٣ - الزُّبَيْرُ بنُ العَوَّامِ\n\nنَصٌّ هُنَا.\n\n٤ - غَيْرُهُ\n\nآخَرُ.' };
    const cov = coverageFor((f) => (f.spans = [heading]), pages);
    expect(cov.pages).toEqual(['41']);
    expect(cov.notModeled.map((s) => s.text)).toEqual(['نَصٌّ هُنَا.']);
  });

  it('finds the next heading of a two-digit number', () => {
    const file = { ...heading, prefix: '٩ - ' };
    const pages = { '41': '٩ - الزُّبَيْرُ بنُ العَوَّامِ\n\nنَصٌّ هُنَا.\n\n١٠ - غَيْرُهُ\n\nآخَرُ.' };
    const cov = coverageFor((f) => {
      f.unit.numbers.printed = '٩';
      f.spans = [file];
    }, pages);
    expect(cov.notModeled.map((s) => s.text)).toEqual(['نَصٌّ هُنَا.']);
  });

  it('throws when a page the manifest declares is missing before the entry ends', () => {
    const pages = { '41': '٣ - الزُّبَيْرُ بنُ العَوَّامِ\n\nنَصٌّ هُنَا.' };
    expect(() =>
      coverageFor((f) => (f.spans = [heading]), pages, { slug: 'wit', title: 't', volumes: [{ number: 4, lastPrintedPage: 50 }] }),
    ).toThrow(/page 42 is missing/);
  });

  it('reports an entry with no next heading and no known last page as not bounded', () => {
    const pages = { '41': '٣ - الزُّبَيْرُ بنُ العَوَّامِ\n\nنَصٌّ هُنَا.' };
    expect(coverageFor((f) => (f.spans = [heading]), pages).bounded).toBe(false);
    expect(coverageFor((f) => (f.spans = [heading]), pages, { slug: 'wit', title: 't', volumes: [{ number: 4, lastPrintedPage: null }] }).bounded).toBe(false);
  });

  it('bounds the last entry of a volume by the volume\'s last page', () => {
    const pages = { '41': '٣ - الزُّبَيْرُ بنُ العَوَّامِ\n\nنَصٌّ هُنَا.' };
    const manifest = { slug: 'wit', title: 't', volumes: [{ number: 4, lastPrintedPage: 41 }] };
    expect(coverageFor((f) => (f.spans = [heading]), pages, manifest).bounded).toBe(true);
  });

  it('lists an unidentified mention as unresolved, and not a standing referent', () => {
    const cov = coverageFor((f) => {
      f.spans = [heading];
      f.mentions = [
        { id: 'm1', parent: 'sp1', exact: 'الزُّبَيْرُ', occurrence: 1, role: 'SUBJECT' },
        { id: 'm2', parent: 'sp1', exact: 'العَوَّامِ', occurrence: 1, role: 'REFERENT' },
      ];
      f.identifications = [];
    }, entry);
    expect(cov.unresolved).toEqual(['الزُّبَيْرُ', 'العَوَّامِ']);
  });

  it('throws when the heading is missing from the first page', () => {
    expect(() => coverageFor((f) => (f.spans = [heading]), { '41': 'لَا عُنْوَانَ هُنَا.' })).toThrow(/heading/);
  });

  it('bounds every entry under data/works by its own heading and the next one', () => {
    const units = loadModel('.').flatMap((folder) =>
      folder.units.filter((file) => file.unit.numbers.printed).map((file) => ({ folder, file })),
    );
    expect(units.length).toBeGreaterThan(0);
    for (const { folder, file } of units) {
      const cov = coverageOf(folder, file, '.');
      expect(cov.sentences, file.unit.id).toBeGreaterThan(0);
      expect(cov.bounded, file.unit.id).toBe(true);
      expect(cov.outside, file.unit.id).toEqual([]);
    }
  });
});
