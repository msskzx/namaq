import { describe, expect, it } from 'vitest';
import { checkModel } from './check';
import { loadModel } from './load';

const ROOT = 'src/lib/model/fixtures/jibril';

function muslim() {
  const folders = loadModel(ROOT);
  const folder = folders.find((f) => f.work.slug === 'test-muslim')!;
  return { folders, report: folder.units[0].reports[0], file: folder.units[0] };
}

describe('the hadith of Jibril fixtures (test data, not a source)', () => {
  it('pass model:check', () => {
    expect(checkModel(loadModel(ROOT), ROOT)).toEqual([]);
  });

  it('give Muslim two scenes, the second quoted inside a turn of the first', () => {
    const { report } = muslim();
    expect(report.scenes).toHaveLength(2);
    expect(report.scenes?.[1].inTurn).toBe('o3');
    expect(report.scenes?.[0].turns.find((t) => t.id === 'o3')?.speaker).toBe('m_ibn_umar');
  });

  it('let a turn keep two spans around an interruption, and leave a bare qala without a speaker', () => {
    const { report } = muslim();
    const [first, second] = report.scenes![0].turns;
    expect(first.spans).toEqual(['sp_o1a', 'sp_o1b']);
    expect(second.speaker).toBeUndefined();
  });

  it('identify the stranger by a span that comes after the turns he speaks in', () => {
    const { file } = muslim();
    const [identification] = file.identifications;
    expect(identification.basis[0].span).toBe('sp_s4');
    expect(file.reports[0].scenes![1].turns.at(-1)?.spans).toEqual(['sp_s4']);
  });
});

describe('scene and turn checks', () => {
  const issues = (change: (m: ReturnType<typeof muslim>) => void) => {
    const m = muslim();
    change(m);
    return checkModel(m.folders, ROOT).join('\n');
  };

  it('fails a turn span outside the report statements', () => {
    expect(issues((m) => (m.file.statements[0].spans = ['sp_o3']))).toMatch(
      /outside the report's statements/,
    );
  });

  it('fails a turn that names an unknown speaker', () => {
    expect(issues((m) => (m.report.scenes![0].turns[0].speaker = 'nobody'))).toMatch(
      /unknown mention nobody/,
    );
  });

  it('fails turn ordinals that do not run from 1', () => {
    expect(issues((m) => (m.report.scenes![0].turns[1].ordinal = 5))).toMatch(/ordinals must run/);
  });

  it('fails an inTurn that names a turn of a later or missing scene', () => {
    expect(issues((m) => (m.report.scenes![1].inTurn = 'nope'))).toMatch(/inTurn must name a turn/);
    expect(issues((m) => (m.report.scenes![1].inTurn = 's2'))).toMatch(/inTurn must name a turn/);
  });

  it('fails an inner turn that lies outside the turn it is quoted in', () => {
    expect(issues((m) => (m.report.scenes![1].inTurn = 'o2'))).toMatch(
      /outside the turn it is quoted in/,
    );
  });

  it('fails a duplicate turn id', () => {
    expect(issues((m) => (m.report.scenes![1].turns[0].id = 'o1'))).toMatch(/duplicate id o1/);
  });
});
