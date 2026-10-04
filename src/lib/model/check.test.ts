import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { checkModel } from './check';
import { loadModel } from './load';
import type { UnitFile } from './types';

const NAME = 'الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ أَسَدِ بنِ عَبْدِ العُزَّى';
const PAGE = `٣ - ${NAME} * (ع)\n\nابْنِ قُصَيِّ بنِ كِلاَبِ بنِ مُرَّةَ بنِ كَعْبِ بنِ لُؤَيِّ بنِ غَالِبٍ.\n\nوَرَوَى: اللَّيْثُ، عَنْ أَبِي الأَسْوَدِ، عَنْ عُرْوَةَ، قَالَ:\n`;

function unit(): UnitFile {
  return {
    unit: { id: 'u1', work: 'siyar', type: 'tarjama', numbers: { printed: '٣' } },
    spans: [
      {
        id: 'sp1',
        edition: 'ed',
        volume: 4,
        page: '41',
        layer: 'MAIN',
        exact: NAME,
        prefix: '٣ - ',
      },
      {
        id: 'sp2',
        edition: 'ed',
        volume: 4,
        page: '41',
        layer: 'MAIN',
        exact: '٣ - الزُّبَيْرُ بنُ العَوَّامِ',
      },
    ],
    reports: [
      {
        id: 'r1',
        unit: 'u1',
        ordinal: 1,
        voice: 'AUTHOR',
        voiceBasis: 'sp2',
        origin: { workAuthor: true },
        chainState: 'DEFERRED',
      },
    ],
    statements: [{ id: 'st1', report: 'r1', spans: ['sp1'], role: 'AUTHOR_REPORT' }],
    mentions: [{ id: 'm1', parent: 'sp1', exact: 'الزُّبَيْرُ', occurrence: 1, role: 'SUBJECT' }],
    identifications: [
      {
        id: 'i1',
        mention: 'm1',
        agent: 'az-zubayr',
        basis: [{ span: 'sp2', role: 'SAME_WORK_EXPLICIT' }],
        status: 'PROPOSED',
      },
    ],
    assertions: [
      {
        id: 'a1',
        subject: 'm1',
        predicate: 'name.full',
        value: { spans: ['sp1'] },
        restsOn: ['st1'],
        status: 'PROPOSED',
      },
    ],
  };
}

let root: string;

function write(file: UnitFile) {
  const dir = join(root, 'data/works/siyar');
  mkdirSync(join(dir, 'units'), { recursive: true });
  writeFileSync(
    join(dir, 'work.json'),
    JSON.stringify({ slug: 'siyar', author: 'al-dhahabi', genre: 'TARAJEM' }),
  );
  writeFileSync(
    join(dir, 'editions.json'),
    JSON.stringify({
      editions: [{ slug: 'ed', work: 'siyar', publisher: 'test', editors: [], printing: '1' }],
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
  const pages = join(root, 'data/history/sources/wit/v4');
  mkdirSync(pages, { recursive: true });
  writeFileSync(join(pages, '41.md'), PAGE);
}

function issuesFor(change: (file: UnitFile) => void) {
  const file = unit();
  change(file);
  write(file);
  return checkModel(loadModel(root), root);
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'model-'));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('checkModel', () => {
  it('accepts a unit whose spans resolve and whose records agree', () => {
    expect(issuesFor(() => {})).toEqual([]);
  });

  it('fails a span that does not resolve', () => {
    expect(issuesFor((f) => (f.spans[0].exact = `${NAME} بنِ زَيْدٍ`)).join()).toMatch(
      /span sp1.*0 times/,
    );
  });

  it('fails a span on a page with no text', () => {
    expect(issuesFor((f) => (f.spans[0].page = '99')).join()).toMatch(/no MAIN text/);
  });

  it('fails a mention that is not in its parent span', () => {
    expect(issuesFor((f) => (f.mentions[0].exact = 'عُمَرُ')).join()).toMatch(/mention m1/);
  });

  it("fails an identification whose basis is the mention's own span", () => {
    expect(issuesFor((f) => (f.identifications[0].basis[0].span = 'sp1')).join()).toMatch(
      /own span/,
    );
  });

  it('fails an assertion with no statement unless it is LEGACY', () => {
    expect(issuesFor((f) => (f.assertions[0].restsOn = [])).join()).toMatch(
      /rests on no statement/,
    );
    expect(
      issuesFor((f) => {
        f.assertions[0].restsOn = [];
        f.assertions[0].status = 'LEGACY';
      }),
    ).toEqual([]);
  });

  it('fails an AUTHOR report with no voiceBasis, and a role that does not fit the voice', () => {
    expect(issuesFor((f) => delete f.reports[0].voiceBasis).join()).toMatch(/voiceBasis/);
    expect(issuesFor((f) => (f.statements[0].role = 'TRANSMITTED')).join()).toMatch(/does not fit/);
  });

  it('fails a predicate outside the closed list and a duplicate id', () => {
    expect(
      issuesFor((f) => ((f.assertions[0] as { predicate: string }).predicate = 'invented')).join(),
    ).toMatch(/not one of/);
    expect(issuesFor((f) => (f.statements[0].id = 'sp1')).join()).toMatch(/duplicate id sp1/);
  });

  it('reports, not throws, on values outside the closed lists', () => {
    expect(issuesFor((f) => ((f.reports[0] as { voice: string }).voice = 'BOGUS')).join()).toMatch(
      /voice/,
    );
    expect(issuesFor((f) => ((f.mentions[0] as { role: string }).role = 'X')).join()).toMatch(
      /mention m1 role/,
    );
    expect(
      issuesFor((f) => ((f.identifications[0] as { status: string }).status = 'REVIEWED')).join(),
    ).toMatch(/status/);
  });

  it('treats a missing array as empty', () => {
    expect(issuesFor((f) => delete (f as Partial<UnitFile>).mentions)).not.toEqual([]);
  });

  it('fails an empty or non-integer mention quote', () => {
    expect(issuesFor((f) => (f.mentions[0].exact = '')).join()).toMatch(/empty quote/);
    expect(issuesFor((f) => (f.mentions[0].occurrence = 1.5)).join()).toMatch(/whole number/);
  });

  it("fails a basis whose text equals the mention's own span, and an EDITOR_NOTE basis on the main layer", () => {
    expect(
      issuesFor((f) => {
        f.spans.push({ ...f.spans[0], id: 'sp3' });
        f.identifications[0].basis[0].span = 'sp3';
      }).join(),
    ).toMatch(/own span/);
    expect(issuesFor((f) => (f.identifications[0].basis[0].role = 'EDITOR_NOTE')).join()).toMatch(
      /notes-layer/,
    );
  });

  it('fails a missing agent, a foreign report unit, a repeated span and a malformed value', () => {
    expect(issuesFor((f) => (f.identifications[0].agent = ' ')).join()).toMatch(/no agent/);
    expect(issuesFor((f) => (f.reports[0].unit = 'other')).join()).toMatch(/names unit/);
    expect(issuesFor((f) => (f.statements[0].spans = ['sp1', 'sp1'])).join()).toMatch(
      /repeats a span/,
    );
    expect(issuesFor((f) => (f.assertions[0].value = {} as never)).join()).toMatch(
      /no spans or object/,
    );
    expect(
      issuesFor((f) => (f.assertions[0].value = { parsed: NaN, spans: ['sp1'] })).join(),
    ).toMatch(/not a number/);
  });

  it('fails a frame or isnad span the unit does not define', () => {
    expect(issuesFor((f) => (f.reports[0].frame = ['nope'])).join()).toMatch(/unknown span nope/);
    expect(issuesFor((f) => (f.reports[0].isnadSpan = 'nope')).join()).toMatch(/unknown span nope/);
  });

  it('fails an AUTHOR statement that opens with a transmission formula', () => {
    expect(
      issuesFor((f) => {
        f.spans.push({
          id: 'sp3',
          edition: 'ed',
          volume: 4,
          page: '41',
          layer: 'MAIN',
          exact: 'وَرَوَى: اللَّيْثُ، عَنْ أَبِي الأَسْوَدِ',
        });
        f.statements[0].spans = ['sp3'];
      }).join(),
    ).toMatch(/transmission formula/);
  });
});
