import { describe, expect, it } from 'vitest';
import { eventSlugs } from '../catalog/loadCatalog';
import { checkModel } from './check';
import { loadModel } from './load';
import { closureOf, revisionOf, selectForProd, unitLookup, type ReviewRecord } from './review';
import type { Assertion } from './types';

const ROOT = 'src/lib/model/fixtures/jibril';
const events = await eventSlugs();
const probe: Assertion = {
  id: 'a_probe',
  subject: 'm_ismail',
  predicate: 'virtue',
  value: { spans: ['sp_matn'] },
  restsOn: ['st_matn'],
  status: 'PROPOSED',
};

function setup() {
  const folders = loadModel(ROOT);
  const bukhari = folders.find((f) => f.work.slug === 'test-bukhari')!;
  const fath = folders.find((f) => f.work.slug === 'test-fath')!;
  return { folders, bukhari, fath, file: bukhari.units[0], fathFile: fath.units[0] };
}
const issues = (change: (m: ReturnType<typeof setup>) => void) => {
  const m = setup();
  change(m);
  return checkModel(m.folders, ROOT).join('\n');
};

describe("a commentator's note as the basis for identifying a narrator (test fixtures)", () => {
  it("identifies the narrator Ismail ibn Ibrahim through Ibn Hajar's note on the next page", () => {
    const { file } = setup();
    const identification = file.identifications.find((i) => i.id === 'i_ismail')!;
    expect(identification.basis).toEqual([
      { span: 'fath-iman-50#sp_note', role: 'COMMENTATOR_NOTE' },
    ]);
    expect(checkModel(loadModel(ROOT), ROOT)).toEqual([]);
  });

  it('fails a foreign basis with a role that is not COMMENTATOR_NOTE or RIJAL_ENTRY', () => {
    expect(issues((m) => (m.file.identifications[1].basis[0].role = 'SAME_WORK_EXPLICIT'))).toMatch(
      /only a COMMENTATOR_NOTE or RIJAL_ENTRY basis may be in another unit/,
    );
  });

  it('fails an unknown unit or span, a commentary in a work that is not a SHARH, and a missing sharh link', () => {
    expect(issues((m) => (m.file.identifications[1].basis[0].span = 'nope#sp_note'))).toMatch(
      /unknown span nope#sp_note/,
    );
    expect(issues((m) => (m.file.identifications[1].basis[0].span = 'fath-iman-50#nope'))).toMatch(
      /unknown span/,
    );
    expect(issues((m) => (m.fath.work.genre = 'HADITH'))).toMatch(/must be in a SHARH work/);
    expect(issues((m) => (m.fathFile.sharhLinks = []))).toMatch(
      /has no sharh link to bukhari-jibril/,
    );
  });

  it('fails a note that does not name the narrator being identified', () => {
    expect(issues((m) => (m.file.identifications[1].mention = 'm_musaddad'))).toMatch(
      /does not name/,
    );
  });
});

describe('a review and a foreign basis', () => {
  it('puts the note and its sharh link in the closure, and lapses when the note changes', () => {
    const { folders, bukhari, file, fathFile } = setup();
    const lookup = unitLookup(folders);
    const closure = closureOf(file, probe, [], lookup);
    expect(closure.foreign.map((f) => `${f.unit}#${f.span.id}`)).toEqual(['fath-iman-50#sp_note']);
    expect(closure.foreign[0].links[0].explains).toBe('bukhari-jibril');
    const before = revisionOf(bukhari, file, probe, ROOT, [], lookup);
    const note = fathFile.spans.find((s) => s.id === 'sp_note')!;
    note.exact = note.exact.slice(0, note.exact.indexOf(')') + 1);
    expect(revisionOf(bukhari, file, probe, ROOT, [], lookup)).not.toBe(before);
  });

  it('brings the note into the prod set, which still passes model:check', () => {
    const { folders, bukhari, file } = setup();
    file.assertions.push(probe);
    const review: ReviewRecord = {
      record: probe.id,
      revision: revisionOf(bukhari, file, probe, ROOT, [], unitLookup(folders)),
      reviewer: 'test-scholar',
      qualification: 'test',
      date: '2026-01-01',
    };
    const prod = selectForProd(folders, [review], ROOT);
    expect(prod.map((f) => f.work.slug).sort()).toEqual(['test-bukhari', 'test-fath']);
    const fath = prod.find((f) => f.work.slug === 'test-fath')!;
    expect(fath.units[0].spans.map((s) => s.id).sort()).toEqual(['sp_note', 'sp_number']);
    expect(fath.units[0].sharhLinks?.[0].explains).toBe('bukhari-jibril');
    expect(checkModel(prod, ROOT)).toEqual([]);
  });
});

describe('a foreign basis and the real al-Zubayr unit (a TARAJEM work)', () => {
  const real = (change: (file: ReturnType<typeof loadModel>[number]['units'][number]) => void) => {
    const folders = loadModel('.');
    const file = folders[0].units[0];
    change(file);
    return checkModel(folders, '.', events).join('\n');
  };
  const ident = (mention: string, span: string) => ({
    id: 'i_probe',
    mention,
    agent: 'x',
    basis: [{ span, role: 'RIJAL_ENTRY' as const }],
    status: 'PROPOSED' as const,
  });

  it('accepts a RIJAL_ENTRY span in a TARAJEM unit that names the person', () => {
    expect(
      real((f) => f.identifications.push(ident('m_awwam', 'siyar-v4-3-az-zubayr#sp_zb_heading'))),
    ).toBe('');
  });

  it("fails the mention's own span as a foreign basis, by id and by equal text", () => {
    expect(
      real((f) => f.identifications.push(ident('m_zb', 'siyar-v4-3-az-zubayr#sp_zb1'))),
    ).toMatch(/own span is not a basis/);
    expect(
      real((f) => {
        const twin = { ...f.spans.find((s) => s.id === 'sp_zb1')!, id: 'sp_zb1_twin' };
        f.spans.push(twin);
        f.identifications.push(ident('m_zb', 'siyar-v4-3-az-zubayr#sp_zb1_twin'));
      }),
    ).toMatch(/own span is not a basis/);
  });
});
