import { describe, expect, it } from 'vitest';
import { conversationOf } from './conversation';
import { applyApprovedInferences, loadInferences } from './inference';
import { loadModel } from './load';

const ROOT = 'src/lib/model/fixtures/jibril';

function muslim(models = loadModel(ROOT)) {
  const folder = models.find((f) => f.work.slug === 'test-muslim')!;
  return { folder, file: folder.units[0] };
}

describe('conversationOf (the hadith of Jibril fixtures)', () => {
  it('lists the scenes in order, the second quoted inside a turn of the first', () => {
    const { folder, file } = muslim();
    const { scenes } = conversationOf(folder, file, 'r_hadith', ROOT);
    expect(scenes.map((s) => s.ordinal)).toEqual([1, 2]);
    expect(scenes[1].inTurn).toBe('o3');
    expect(scenes[0].turns.map((t) => t.id)).toEqual(['o1', 'o2', 'o3']);
    expect(scenes[1].turns.map((t) => t.id)).toHaveLength(15);
  });

  it('renders each turn from its spans, keeping two parts around an interruption', () => {
    const { folder, file } = muslim();
    const [first] = conversationOf(folder, file, 'r_hadith', ROOT).scenes[0].turns;
    expect(first.parts).toHaveLength(2);
    expect(first.parts[0].startsWith('أَبَا عَبْدِ الرَّحْمَنِ')).toBe(true);
    expect(first.parts[1].endsWith('أُنُفٌ')).toBe(true);
  });

  it('names a speaker only where the sentence names one, and leaves a bare qala as not stated', () => {
    const { folder, file } = muslim();
    const turns = conversationOf(folder, file, 'r_hadith', ROOT).scenes.flatMap((s) => s.turns);
    const byId = Object.fromEntries(turns.map((t) => [t.id, t.speaker?.mention]));
    expect(byId).toMatchObject({
      o1: 'يَحْيَى بْنِ يَعْمَرَ',
      s1: 'رَجُلٌ',
      s2: 'رَسُولُ اللَّهِ',
    });
    expect(byId.o2).toBeUndefined();
  });

  it('shows the stranger as Jibril once the closing words identify him', () => {
    const { folder, file } = muslim();
    const s1 = conversationOf(folder, file, 'r_hadith', ROOT).scenes[1].turns[0];
    expect(s1.speaker).toEqual({
      mention: 'رَجُلٌ',
      agents: [{ agent: 'jibril', status: 'PROPOSED' }],
    });
  });

  it('marks a speaker that came from an approved inference, and only that one', () => {
    const applied = applyApprovedInferences(loadModel(ROOT), loadInferences(ROOT));
    const { folder, file } = muslim(applied);
    const turns = conversationOf(folder, file, 'r_hadith', ROOT).scenes.flatMap((s) => s.turns);
    expect(turns.find((t) => t.id === 'o2')).toMatchObject({ derivedBy: 'inf_o2' });
    expect(turns.find((t) => t.id === 'o3')?.speaker).toBeUndefined();
    expect(turns.filter((t) => t.derivedBy)).toHaveLength(1);
  });

  it('fails loudly on an unknown report', () => {
    const { folder, file } = muslim();
    expect(() => conversationOf(folder, file, 'nope', ROOT)).toThrow(/unknown report/);
  });

  it('carries the unit, the report and its origin, so a view can reach the source', () => {
    const { folder, file } = muslim();
    const conversation = conversationOf(folder, file, 'r_hadith', ROOT);
    expect(conversation).toMatchObject({ unit: 'muslim-jibril', report: 'r_hadith' });
    expect(conversation.origin).toEqual({ mention: 'يَحْيَى بْنِ يَعْمَرَ' });
    const bukhari = loadModel(ROOT).find((f) => f.work.slug === 'test-bukhari')!;
    expect(conversationOf(bukhari, bukhari.units[0], 'r_comment', ROOT).origin).toEqual({
      author: 'test-compiler',
    });
    expect(conversationOf(bukhari, bukhari.units[0], 'r_comment', ROOT).scenes).toEqual([]);
  });

  it('shows every competing identification of a speaker, and drops a rejected one', () => {
    const { folder, file } = muslim();
    const base = file.identifications[0];
    file.identifications.push(
      { ...base, id: 'i_other', agent: 'another', status: 'DISPUTED' },
      { ...base, id: 'i_bad', agent: 'rejected', status: 'REJECTED' },
    );
    const s1 = conversationOf(folder, file, 'r_hadith', ROOT).scenes[1].turns[0];
    expect(s1.speaker?.agents).toEqual([
      { agent: 'jibril', status: 'PROPOSED' },
      { agent: 'another', status: 'DISPUTED' },
    ]);
  });

  it('gives an unidentified speaker no agents', () => {
    const { folder, file } = muslim();
    const o1 = conversationOf(folder, file, 'r_hadith', ROOT).scenes[0].turns[0];
    expect(o1.speaker?.agents).toEqual([]);
  });

  it('fails loudly on an unknown mention or span instead of showing an id', () => {
    const a = muslim();
    a.file.reports[0].scenes![0].turns[0].speaker = 'm_missing';
    expect(() => conversationOf(a.folder, a.file, 'r_hadith', ROOT)).toThrow(/unknown mention/);
    const b = muslim();
    b.file.reports[0].scenes![0].turns[0].spans = ['nope'];
    expect(() => conversationOf(b.folder, b.file, 'r_hadith', ROOT)).toThrow(/unknown span/);
  });

  it('resolves the Prophet as a speaker by the standing rule, with no identification record', () => {
    const { folder, file } = muslim();
    expect(file.identifications.some((i) => i.mention === 'm_prophet')).toBe(false);
    const s2 = conversationOf(folder, file, 'r_hadith', ROOT).scenes[1].turns[1];
    expect(s2.speaker?.agents).toEqual([{ agent: 'prophet-muhammad', status: 'PROPOSED' }]);
  });

  it('does not apply the standing rule to a mention that has a rejected identification', () => {
    const { folder, file } = muslim();
    file.identifications.push({
      id: 'i_other',
      mention: 'm_prophet',
      agent: 'prophet-muhammad',
      basis: [{ span: 'sp_s15', role: 'SAME_WORK_EXPLICIT' }],
      status: 'REJECTED',
    });
    const s2 = conversationOf(folder, file, 'r_hadith', ROOT).scenes[1].turns[1];
    expect(s2.speaker?.agents).toEqual([]);
  });
});
