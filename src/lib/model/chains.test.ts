import { describe, expect, it } from 'vitest';
import { checkModel } from './check';
import { loadModel } from './load';
import { renderSpanRecord } from './render';
import { closureOf } from './review';
import type { Assertion, Link } from './types';

const ROOT = 'src/lib/model/fixtures/jibril';
const get = (work: string) => {
  const folders = loadModel(ROOT);
  const folder = folders.find((f) => f.work.slug === work)!;
  return { folders, folder, file: folder.units[0], report: folder.units[0].reports[0] };
};
const issues = (work: string, change: (m: ReturnType<typeof get>) => void) => {
  const m = get(work);
  change(m);
  return checkModel(m.folders, ROOT).join('\n');
};
const links = (chain: { elements: unknown[] }) => chain.elements as Link[];

describe('the isnads of the Jibril fixtures (test data)', () => {
  it('pass model:check', () => {
    expect(checkModel(loadModel(ROOT), ROOT)).toEqual([]);
  });

  it('record Bukhari 50 as five links, each with the formula as printed and its key', () => {
    const { report } = get('test-bukhari');
    expect(report.chainState).toBe('COMPLETE');
    expect(links(report.chain!).map((l) => l.modeKey)).toEqual([
      'haddatha/1pl',
      'haddatha/1pl',
      'akhbara/1pl',
      'an',
      'an',
    ]);
    expect(links(report.chain!).map((l) => l.narrator)).toEqual([
      'm_musaddad',
      'm_ismail',
      'm_abu_hayyan',
      'm_abu_zura',
      'm_abu_hurayra',
    ]);
  });

  it("record Muslim's two routes after the tahwil, each running to Yahya", () => {
    const { folder, file, report } = get('test-muslim');
    const chain = report.chain!;
    expect(chain.elements).toEqual([]);
    expect(chain.branches).toHaveLength(2);
    const [a, b] = chain.branches!.map((x) => links(x));
    expect(a.map((l) => l.modeKey)).toEqual(['haddatha/1sg', 'haddatha/1pl', 'an', 'an', 'an']);
    expect(b.map((l) => l.modeKey)).toEqual([
      'haddatha/1pl',
      'haddatha/1pl',
      'haddatha/1pl',
      'an',
      'an',
    ]);
    expect(a.at(-1)!.narrator).not.toBe(b.at(-1)!.narrator);
    const mark = file.spans.find((s) => s.id === chain.tahwil![0])!;
    expect(renderSpanRecord(folder, mark, ROOT)).toBe('ح');
  });
});

describe('chain checks', () => {
  it('fails a mode key that does not match the printed formula', () => {
    expect(
      issues('test-bukhari', (m) => (links(m.report.chain!)[0].modeKey = 'haddatha/1sg')),
    ).toMatch(/does not match the printed/);
  });

  it('fails an unknown narrator, a link with no mode, and a mode outside the isnad', () => {
    expect(issues('test-bukhari', (m) => (links(m.report.chain!)[1].narrator = 'nobody'))).toMatch(
      /unknown narrator/,
    );
    expect(issues('test-bukhari', (m) => (links(m.report.chain!)[1].mode = []))).toMatch(
      /no mode span/,
    );
    expect(issues('test-bukhari', (m) => (links(m.report.chain!)[1].mode = ['sp_t1']))).toMatch(
      /outside the isnad/,
    );
  });

  it('fails a formula it has no key for', () => {
    expect(issues('test-bukhari', (m) => (links(m.report.chain!)[1].mode = ['sp_t3']))).toMatch(
      /no mode key/,
    );
  });

  it('fails a COMPLETE transmitted report with no chain, and a DEFERRED one with a chain', () => {
    expect(issues('test-bukhari', (m) => delete m.report.chain)).toMatch(/needs a chain/);
    expect(issues('test-bukhari', (m) => (m.report.chainState = 'DEFERRED'))).toMatch(
      /has no chain yet/,
    );
  });

  it('fails a chain with neither links nor two branches', () => {
    expect(
      issues(
        'test-muslim',
        (m) => (m.report.chain!.branches = m.report.chain!.branches!.slice(0, 1)),
      ),
    ).toMatch(/links, or two branches/);
  });
});

describe('stricter chain checks', () => {
  it('fails a chain on a report that is not transmitted, and one with no isnad span', () => {
    expect(issues('test-bukhari', (m) => (m.report.voice = 'AUTHOR'))).toMatch(
      /only a TRANSMITTED report has a chain/,
    );
    expect(issues('test-bukhari', (m) => delete m.report.isnadSpan)).toMatch(
      /needs the report's isnadSpan/,
    );
  });

  it('fails narrators out of reading order, a narrator named twice in a route, and one named outside the isnad', () => {
    expect(
      issues('test-bukhari', (m) => {
        const l = links(m.report.chain!);
        [l[1].narrator, l[2].narrator] = [l[2].narrator, l[1].narrator];
      }),
    ).toMatch(/out of reading order/);
    expect(
      issues('test-bukhari', (m) => (links(m.report.chain!)[1].narrator = 'm_musaddad')),
    ).toMatch(/appears twice in one route/);
    expect(
      issues('test-bukhari', (m) => (links(m.report.chain!)[1].narrator = 'm_jibril')),
    ).toMatch(/named outside the isnad/);
  });

  it('fails branches without the tahwil span, and checks nested branches', () => {
    expect(issues('test-muslim', (m) => delete m.report.chain!.tahwil)).toMatch(
      /need the tahwil span/,
    );
    expect(
      issues('test-muslim', (m) => {
        m.report.chain!.branches![0].branches = [{ elements: [] }];
      }),
    ).toMatch(/links, or two branches/);
  });

  it('accepts a Gap with no marker (a mursal, the missing narrator unnamed) and checks a marker it has', () => {
    expect(
      issues('test-bukhari', (m) => m.report.chain!.elements.splice(4, 0, { kind: 'GAP' })),
    ).toBe('');
    expect(
      issues('test-bukhari', (m) =>
        m.report.chain!.elements.splice(4, 0, { kind: 'GAP', marker: ['nope'] }),
      ),
    ).toMatch(/unknown span nope/);
  });
});

describe('a review closure and a chain', () => {
  it('reaches the formulas and the narrators of the isnad', () => {
    const { file } = get('test-bukhari');
    const assertion: Assertion = {
      id: 'a_probe',
      subject: 'm_abu_hurayra',
      predicate: 'virtue',
      value: { spans: ['sp_matn'] },
      restsOn: ['st_matn'],
      status: 'PROPOSED',
    };
    const closure = closureOf(file, assertion);
    expect(closure.spans.map((s) => s.id)).toEqual(
      expect.arrayContaining(['sp_b1', 'sp_b5', 'sp_isnad']),
    );
    expect(closure.mentions.map((m) => m.id)).toEqual(
      expect.arrayContaining(['m_musaddad', 'm_abu_zura']),
    );
  });

  it('reaches the tahwil mark and both routes of a branched chain', () => {
    const { file } = get('test-muslim');
    const assertion: Assertion = {
      id: 'a_probe',
      subject: 'm_yahya',
      predicate: 'virtue',
      value: { spans: ['sp_story'] },
      restsOn: ['st_story'],
      status: 'PROPOSED',
    };
    const closure = closureOf(file, assertion);
    expect(closure.spans.map((s) => s.id)).toEqual(
      expect.arrayContaining(['sp_tahwil', 'sp_a1', 'sp_b1']),
    );
    expect(closure.mentions.map((m) => m.id)).toEqual(
      expect.arrayContaining(['m_a1', 'm_b1', 'm_yahya_a']),
    );
  });
});
