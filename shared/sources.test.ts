import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import qiraat from './data/quran/qiraat.json';

import { GROUPS, SOURCES } from './sources';

describe('SOURCES', () => {
  it('gives each source a unique id, a known group, a licence and at least one use', () => {
    expect(new Set(SOURCES.map(s => s.id)).size).toBe(SOURCES.length);
    for (const source of SOURCES) {
      expect(GROUPS.map(g => g.group)).toContain(source.group);
      expect(source.licence.ar && source.licence.en).toBeTruthy();
      expect(source.uses.length).toBeGreaterThan(0);
      expect(source.link.url).toMatch(/^https:\/\//);
    }
  });

  it('links each use to a website page that exists', () => {
    for (const use of SOURCES.flatMap(s => s.uses))
      if (use.href) expect(existsSync(join(__dirname, '../src/app', use.href, 'page.tsx')), use.href).toBe(true);
  });

  it('names the Quranpedia dump version the readings were built from', () => {
    const quranpedia = SOURCES.find(s => s.id === 'quranpedia')!;
    expect(quranpedia.edition).toContain(qiraat.source.version.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]));
  });
});
