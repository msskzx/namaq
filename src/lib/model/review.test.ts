import { describe, expect, it } from 'vitest';
import { checkModel } from './check';
import { loadModel } from './load';
import { closureOf, lapsedReviews, revisionOf, selectForProd, type ReviewRecord } from './review';

const scholar = { reviewer: 'test-scholar', qualification: 'test', date: '2026-01-01' };

function setup() {
  const folders = loadModel('.');
  const folder = folders[0];
  const file = folder.units[0];
  const review = (id: string): ReviewRecord => ({
    record: id,
    revision: revisionOf(
      folder,
      file,
      file.assertions.find((a) => a.id === id)!,
      '.',
    ),
    ...scholar,
  });
  return { folders, folder, file, review };
}

describe('revisionOf', () => {
  it('is stable for unchanged records and differs between assertions', () => {
    const { folder, file } = setup();
    const [a, b] = file.assertions;
    expect(revisionOf(folder, file, a, '.')).toBe(revisionOf(folder, file, a, '.'));
    expect(revisionOf(folder, file, a, '.')).not.toBe(revisionOf(folder, file, b, '.'));
  });

  it('changes when a record in the closure changes', () => {
    const { folder, file } = setup();
    const name = file.assertions.find((a) => a.id === 'a_name')!;
    const before = revisionOf(folder, file, name, '.');
    file.identifications.find((i) => i.id === 'i_zb')!.agent = 'someone-else';
    expect(revisionOf(folder, file, name, '.')).not.toBe(before);
  });

  it('changes when the rendered text of a span changes, and ignores unrelated records', () => {
    const { folder, file } = setup();
    const child = file.assertions.find((a) => a.id === 'a_child')!;
    const before = revisionOf(folder, file, child, '.');
    file.assertions.find((a) => a.id === 'a_age8')!.value = { parsed: 9, spans: ['sp_age8'] };
    expect(revisionOf(folder, file, child, '.')).toBe(before);
    file.spans.find((s) => s.id === 'sp_zb2')!.exact = 'ابْنِ قُصَيِّ بنِ كِلاَبِ بنِ مُرَّةَ';
    expect(
      revisionOf(
        folder,
        file,
        file.assertions.find((a) => a.id === 'a_name')!,
        '.',
      ),
    ).not.toBe(before);
  });
});

describe('lapsedReviews', () => {
  it('lists a review whose record changed since, and a review of a record that is gone', () => {
    const { folders, file, review } = setup();
    const reviews = [review('a_name'), review('a_age16')];
    expect(lapsedReviews(folders, reviews, '.')).toEqual([]);
    file.assertions.find((a) => a.id === 'a_age16')!.value = { parsed: 17, spans: ['sp_age16'] };
    expect(lapsedReviews(folders, reviews, '.').map((r) => r.record)).toEqual(['a_age16']);
    expect(lapsedReviews(folders, [{ ...review('a_name'), record: 'gone' }], '.')).toHaveLength(1);
  });
});

describe('selectForProd', () => {
  it('holds nothing without a review', () => {
    expect(selectForProd(setup().folders, [], '.')).toEqual([]);
  });

  it('holds a reviewed assertion with its closure and nothing else', () => {
    const { folders, review } = setup();
    const [folder] = selectForProd(folders, [review('a_child')], '.');
    const [file] = folder.units;
    expect(file.assertions.map((a) => a.id)).toEqual(['a_child']);
    expect(file.statements.map((s) => s.id)).toEqual(['st_name']);
    expect(file.mentions.map((m) => m.id).sort()).toEqual(['m_awwam', 'm_zb']);
    expect(file.identifications.map((i) => i.id).sort()).toEqual(['i_awwam', 'i_zb']);
    expect(file.spans.map((s) => s.id)).toContain('sp_zb_nasab_tail');
    expect(file.reports.map((r) => r.id)).toEqual(['r_zb0']);
  });

  it('drops a review that lapsed, and a LEGACY or REJECTED assertion even if reviewed', () => {
    const { folders, file, review } = setup();
    const lapsed = review('a_age16');
    file.assertions.find((a) => a.id === 'a_age16')!.value = { parsed: 17, spans: ['sp_age16'] };
    expect(selectForProd(folders, [lapsed], '.')).toEqual([]);
    const rejected = review('a_name');
    file.assertions.find((a) => a.id === 'a_name')!.status = 'REJECTED';
    expect(
      selectForProd(
        folders,
        [{ ...rejected, revision: revisionOf(folders[0], file, file.assertions[0], '.') }],
        '.',
      ),
    ).toEqual([]);
  });

  it('keeps a record in prod when any reviewer holds its current revision', () => {
    const { folders, review } = setup();
    const stale = { ...review('a_child'), revision: 'stale', reviewer: 'late-reviewer' };
    expect(selectForProd(folders, [review('a_child'), stale], '.')).not.toEqual([]);
  });

  it('passes model:check as a whole, including the Jibril-free real data', () => {
    const { folders, file, review } = setup();
    const set = selectForProd(
      folders,
      file.assertions.map((a) => review(a.id)),
      '.',
    );
    expect(checkModel(set, '.')).toEqual([]);
  });
});

describe('what lapses a review', () => {
  it('lapses when the work author, the unit, the edition or the witness flags change', () => {
    const { folder, file } = setup();
    const name = file.assertions.find((a) => a.id === 'a_name')!;
    const before = revisionOf(folder, file, name, '.');
    for (const change of [
      () => (folder.work.author = 'someone-else'),
      () => (file.unit.numbers = { printed: '4' }),
      () => (folder.editions[0].printing = 'fourth'),
      () => (folder.witnesses[0].checkedAgainstPrint = true),
    ]) {
      const snapshot = structuredClone({
        w: folder.work,
        u: file.unit,
        e: folder.editions,
        s: folder.witnesses,
      });
      change();
      expect(revisionOf(folder, file, name, '.')).not.toBe(before);
      Object.assign(folder.work, snapshot.w);
      file.unit = snapshot.u;
      folder.editions = snapshot.e;
      folder.witnesses = snapshot.s;
    }
  });

  it('does not lapse when a span is re-anchored to the same rendered text', () => {
    const { folder, file } = setup();
    const name = file.assertions.find((a) => a.id === 'a_name')!;
    const before = revisionOf(folder, file, name, '.');
    const span = file.spans.find((s) => s.id === 'sp_zb1')!;
    span.prefix = '٣ - ';
    span.suffix = ' * (ع)';
    expect(revisionOf(folder, file, name, '.')).toBe(before);
  });
});

describe('a mention resolved by the standing rule', () => {
  it('puts the resolved agent in the closure, so changing the list lapses the review', () => {
    const { file } = setup();
    const cousin = file.assertions.find((a) => a.id === 'a_cousin')!;
    expect(closureOf(file, cousin).standing).toEqual({ m_prophet2: 'prophet-muhammad' });
    file.identifications.push({
      id: 'i_x',
      mention: 'm_prophet2',
      agent: 'someone',
      basis: [{ span: 'sp_zb_heading', role: 'SAME_WORK_EXPLICIT' }],
      status: 'PROPOSED',
    });
    expect(closureOf(file, cousin).standing).toEqual({});
  });
});
