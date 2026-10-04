import { describe, expect, it } from 'vitest';
import {
  applyApprovedInferences,
  checkInferences,
  loadInferences,
  type Inference,
} from './inference';
import { loadModel } from './load';
import { revisionOf } from './review';

const ROOT = 'src/lib/model/fixtures/jibril';
const turnsOf = (folders: ReturnType<typeof loadModel>) =>
  folders
    .flatMap((f) => f.units)
    .flatMap((u) => u.reports)
    .flatMap((r) => r.scenes ?? [])
    .flatMap((s) => s.turns);

describe('checkInferences (test fixtures)', () => {
  const folders = loadModel(ROOT);
  const inferences = loadInferences(ROOT);
  const issues = (change: (list: Inference[]) => void) => {
    const list = structuredClone(inferences);
    change(list);
    return checkInferences(folders, list).join('\n');
  };

  it('passes on the fixtures', () => {
    expect(inferences.map((i) => i.status).sort()).toEqual(['APPROVED', 'REPORTED']);
    expect(checkInferences(folders, inferences)).toEqual([]);
  });

  it('fails an APPROVED inference with no approving PR, and a REPORTED one that carries one', () => {
    expect(issues((l) => delete l[0].approvedInPr)).toMatch(/APPROVED without approvedInPr/);
    expect(issues((l) => (l[1].approvedInPr = '9'))).toMatch(/approvedInPr on an unapproved/);
  });

  it('fails unknown units, spans, turns, mentions and premises, and no premises', () => {
    expect(issues((l) => (l[0].unit = 'nope'))).toMatch(/unknown unit/);
    expect(issues((l) => (l[0].passage = ['nope']))).toMatch(/unknown passage span/);
    expect(
      issues((l) => (l[0].value = { kind: 'TURN_SPEAKER', turn: 'nope', speaker: 'm_yahya' })),
    ).toMatch(/unknown turn/);
    expect(
      issues((l) => (l[0].value = { kind: 'TURN_SPEAKER', turn: 'o2', speaker: 'nope' })),
    ).toMatch(/unknown speaker/);
    expect(issues((l) => (l[0].premises = [{ turn: 'nope' }]))).toMatch(/unknown premise turn/);
    expect(issues((l) => (l[0].premises = []))).toMatch(/no premises/);
  });

  it('fails an unknown kind, a bad predicate, a half-empty timeline and missing fields', () => {
    expect(issues((l) => ((l[0].value as { kind: string }).kind = 'FOO'))).toMatch(/is not one of/);
    expect(
      issues(
        (l) =>
          (l[0].value = {
            kind: 'RELATION',
            predicate: 'invented' as never,
            subject: 'm_yahya',
            object: 'm_prophet',
          }),
      ),
    ).toMatch(/closed list/);
    expect(
      issues(
        (l) => (l[0].value = { kind: 'TIMELINE_BETWEEN', event: 'a', after: '', before: 'c' }),
      ),
    ).toMatch(/needs an event/);
    expect(issues((l) => delete (l[0] as Partial<Inference>).premises)).toMatch(
      /needs passage, premises and value/,
    );
  });

  it('fails two approved inferences for one turn, and one on a turn with a printed speaker', () => {
    expect(
      issues((l) =>
        l.push({
          ...l[0],
          id: 'inf_again',
          value: { kind: 'TURN_SPEAKER', turn: 'o2', speaker: 'm_yahya' },
        }),
      ),
    ).toMatch(/second approved inference for turn o2/);
    expect(
      issues((l) => (l[0].value = { kind: 'TURN_SPEAKER', turn: 'o1', speaker: 'm_ibn_umar' })),
    ).toMatch(/already has a printed speaker/);
  });

  it('fails a duplicate id', () => {
    expect(issues((l) => (l[1].id = l[0].id))).toMatch(/duplicate id/);
  });
});

describe('applyApprovedInferences', () => {
  it('sets the speaker of an approved turn and says which inference did it', () => {
    const applied = applyApprovedInferences(loadModel(ROOT), loadInferences(ROOT));
    const o2 = turnsOf(applied).find((t) => t.id === 'o2');
    expect(o2?.speaker).toBe('m_ibn_umar');
    expect(o2?.derivedBy).toBe('inf_o2');
  });

  it('leaves a REPORTED inference without effect, and never overrides a printed speaker', () => {
    const folders = loadModel(ROOT);
    const inferences = loadInferences(ROOT);
    const applied = applyApprovedInferences(folders, inferences);
    expect(turnsOf(applied).find((t) => t.id === 'o3')?.speaker).toBeUndefined();
    const printed: Inference = {
      ...inferences[0],
      id: 'inf_x',
      value: { kind: 'TURN_SPEAKER', turn: 'o1', speaker: 'm_prophet' },
    };
    const again = applyApprovedInferences(folders, [printed]);
    expect(turnsOf(again).find((t) => t.id === 'o1')?.speaker).toBe('m_yahya');
  });

  it('does not change the loaded model', () => {
    const folders = loadModel(ROOT);
    applyApprovedInferences(folders, loadInferences(ROOT));
    expect(turnsOf(folders).find((t) => t.id === 'o2')?.speaker).toBeUndefined();
  });
});

describe('a review and an approved inference', () => {
  const folders = loadModel(ROOT);
  const file = folders.find((f) => f.work.slug === 'test-muslim')!.units[0];
  const folder = folders.find((f) => f.work.slug === 'test-muslim')!;
  const assertion = {
    id: 'a_probe',
    subject: 'm_yahya',
    predicate: 'virtue' as const,
    value: { spans: ['sp_o1a'] },
    restsOn: ['st_story'],
    status: 'PROPOSED' as const,
  };

  it('lapses when an approved inference touching its turns changes or is rejected', () => {
    const inferences = loadInferences(ROOT);
    const before = revisionOf(folder, file, assertion, ROOT, inferences);
    const rejected = inferences.map((i) =>
      i.id === 'inf_o2' ? { ...i, status: 'REJECTED' as const, approvedInPr: undefined } : i,
    );
    expect(revisionOf(folder, file, assertion, ROOT, rejected)).not.toBe(before);
    const moved = inferences.map((i) => (i.id === 'inf_o2' ? { ...i, approvedInPr: 'other' } : i));
    expect(revisionOf(folder, file, assertion, ROOT, moved)).not.toBe(before);
  });
});
