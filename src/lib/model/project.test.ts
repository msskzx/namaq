import { describe, expect, it } from 'vitest';
import { checkModel } from './check';
import { loadModel } from './load';
import { projectionRows } from './project';
import { revisionOf, selectForProd, unitLookup, type ReviewRecord } from './review';

function review(folders: ReturnType<typeof loadModel>, assertionId: string): ReviewRecord {
  const folder = folders[0];
  const file = folder.units[0];
  const assertion = file.assertions.find((a) => a.id === assertionId)!;
  return {
    record: assertionId,
    revision: revisionOf(folder, file, assertion, '.', [], unitLookup(folders)),
    reviewer: 'test-scholar',
    qualification: 'test',
    date: '2026-01-01',
  };
}

describe('projectionRows (the al-Zubayr entry)', () => {
  const folders = loadModel('.');
  const { spans, entries } = projectionRows(folders, '.');
  const file = folders[0].units[0];

  it('has one row per span, each with the text rendered from the page', () => {
    expect(spans).toHaveLength(file.spans.length);
    const kunya = spans.find((s) => s.spanId === 'sp_kunya')!;
    expect(kunya).toMatchObject({
      unit: file.unit.id,
      witness: 'siyar-alam-al-nubala-risalah',
      volume: 4,
      page: '41',
      layer: 'MAIN',
    });
    expect(kunya.text).toContain('أَبُو عَبْدِ اللهِ');
  });

  it('has a profile row for each stated value under the agent it is identified as', () => {
    const mine = entries.filter((e) => e.agent === 'az-zubayr-ibn-al-awwam');
    expect(mine.map((e) => e.predicate)).toEqual(
      expect.arrayContaining(['name.full', 'name.kunya', 'sex', 'died.year', 'islam.age']),
    );
    const died = mine.find((e) => e.predicate === 'died.year')!;
    expect(died.parsed).toBe(36);
    expect(died.spanIds).toEqual(['sp_death_year']);
    const sex = mine.find((e) => e.predicate === 'sex')!;
    expect(sex.classified).toBe('MALE');
  });

  it('marks nothing reviewed without a review, and exactly the reviewed assertion with one', () => {
    expect(entries.every((e) => !e.reviewed)).toBe(true);
    const withReview = projectionRows(folders, '.', [review(folders, 'a_kunya')]).entries;
    expect(withReview.filter((e) => e.reviewed).map((e) => e.assertionId)).toEqual(['a_kunya']);
  });

  it('projects the reviewed-only set for prod, with every row reviewed', () => {
    const reviews = [review(folders, 'a_kunya'), review(folders, 'a_sex')];
    const prod = selectForProd(folders, reviews, '.');
    expect(checkModel(prod, '.')).toEqual([]);
    const rows = projectionRows(prod, '.', reviews);
    expect(rows.entries.map((e) => e.assertionId).sort()).toEqual(['a_kunya', 'a_sex']);
    expect(rows.entries.every((e) => e.reviewed)).toBe(true);
    expect(rows.spans.length).toBeLessThan(spans.length);
  });

  it('keeps one row per unit, assertion and agent', () => {
    const fresh = loadModel('.');
    const f = fresh[0].units[0];
    f.identifications.push({ ...f.identifications[0], id: 'i_dup' });
    const keys = projectionRows(fresh, '.').entries.map(
      (e) => `${e.unit}/${e.assertionId}/${e.agent}`,
    );
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('projectionRows with a sharh-linked assertion in the reviewed-only set', () => {
  it('marks it reviewed, though the commentary unit is only a slice in the prod set', () => {
    const ROOT = 'src/lib/model/fixtures/jibril';
    const folders = loadModel(ROOT);
    const bukhari = folders.find((f) => f.work.slug === 'test-bukhari')!;
    const file = bukhari.units[0];
    file.assertions.push({
      id: 'a_probe',
      subject: 'm_ismail',
      predicate: 'virtue',
      value: { spans: ['sp_matn'] },
      restsOn: ['st_matn'],
      status: 'PROPOSED',
    });
    const probe = file.assertions.find((a) => a.id === 'a_probe')!;
    const reviews: ReviewRecord[] = [
      {
        record: 'a_probe',
        revision: revisionOf(bukhari, file, probe, ROOT, [], unitLookup(folders)),
        reviewer: 'test-scholar',
        qualification: 'test',
        date: '2026-01-01',
      },
    ];
    const prod = selectForProd(folders, reviews, ROOT);
    const { entries } = projectionRows(prod, ROOT, reviews, [], folders);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.every((e) => e.reviewed)).toBe(true);
  });
});
