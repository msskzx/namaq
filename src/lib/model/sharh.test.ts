import { describe, expect, it } from 'vitest';
import { checkModel } from './check';
import { loadModel } from './load';
import { renderSpanRecord } from './render';

import { HARAKAT } from './span';

const ROOT = 'src/lib/model/fixtures/jibril';
const plain = (text: string) => text.replace(HARAKAT, '');

function fath() {
  const folders = loadModel(ROOT);
  const folder = folders.find((f) => f.work.slug === 'test-fath')!;
  return { folders, folder, file: folder.units[0] };
}
const issues = (change: (m: ReturnType<typeof fath>) => void) => {
  const m = fath();
  change(m);
  return checkModel(m.folders, ROOT).join('\n');
};

describe('the Fath al-Bari commentary fixture (Shamela book 1673, ids 600-601; test data)', () => {
  it('passes model:check with its three works', () => {
    expect(checkModel(loadModel(ROOT), ROOT)).toEqual([]);
  });

  it('links the commentary to Bukhari 50 by the hadith number printed in its own text', () => {
    const { folder, file } = fath();
    const [link] = file.sharhLinks!;
    expect(link.explains).toBe('bukhari-jibril');
    const number = file.spans.find((s) => s.id === link.basis[0])!;
    const text = renderSpanRecord(folder, number, ROOT);
    expect(plain(text).startsWith('٥٠ - حدثنا مسدد')).toBe(true);
  });

  it("keeps the commentator's identification of a narrator as his own words, in the book's own spelling", () => {
    const { folder, file } = fath();
    const note = file.spans.find((s) => s.id === 'sp_note')!;
    expect(plain(renderSpanRecord(folder, note, ROOT))).toContain('هو البصري المعروف بابن علية');
    expect(file.reports[0].voice).toBe('AUTHOR');
  });
});

describe('sharh link checks', () => {
  it('fails a link from a work that is not a commentary', () => {
    expect(issues((m) => (m.folder.work.genre = 'HADITH'))).toMatch(/is not a SHARH/);
  });

  it('fails a link to an unknown unit, to itself, with no basis, or with a basis outside the unit', () => {
    expect(issues((m) => (m.file.sharhLinks![0].explains = 'nope'))).toMatch(/unknown unit nope/);
    expect(issues((m) => (m.file.sharhLinks![0].explains = m.file.unit.id))).toMatch(
      /explain itself/,
    );
    expect(issues((m) => (m.file.sharhLinks![0].basis = []))).toMatch(/no basis span/);
    expect(issues((m) => (m.file.sharhLinks![0].basis = ['sp_isnad']))).toMatch(
      /not in the commentary unit/,
    );
  });

  it('fails a link to a unit that is not a hadith, and two links to the same hadith', () => {
    expect(
      issues(
        (m) => (m.file.unit.type = 'hadith') && (m.file.sharhLinks![0].explains = 'fath-iman-50'),
      ),
    ).toMatch(/explain itself/);
    expect(
      issues((m) => {
        const other = m.folders.find((f) => f.work.slug === 'test-muslim')!.units[0];
        other.unit.type = 'commentary';
        m.file.sharhLinks![0].explains = other.unit.id;
      }),
    ).toMatch(/is a commentary, not a hadith/);
    expect(
      issues((m) => m.file.sharhLinks!.push({ ...m.file.sharhLinks![0], id: 'sl_again' })),
    ).toMatch(/more than one link to bukhari-jibril/);
  });

  it('fails a duplicate id between a link and another record', () => {
    expect(issues((m) => (m.file.sharhLinks![0].id = 'sp_note'))).toMatch(/duplicate id sp_note/);
  });
});
