import { describe, expect, it } from 'vitest';
import forty from './data/hadith/forty.json';
import units from './data/hadith/units.json';
import { COLLECTOR, PROPHET_AGENT, recordedIn, sceneSlots, sceneSpeakers, searchForty, splitLead, type AppForty, type AppHadith, type SceneView } from './hadith';

const ENTRIES = (forty as AppForty).entries;

describe('searchForty', () => {
  it('finds a hadith by its words whatever their marks or hamzas, and by its Companion', () => {
    const niyyat = searchForty(ENTRIES, 'انما الاعمال بالنيات');
    expect(niyyat.map(entry => entry.n)).toContain(1);
    expect(searchForty(ENTRIES, 'عمر بن الخطاب').length).toBeGreaterThan(0);
    expect(searchForty(ENTRIES, 'كلمة لا توجد في الأربعين ابدا')).toEqual([]);
  });

  it('lists them all while nothing is typed', () => {
    expect(searchForty(ENTRIES, '  ')).toHaveLength(ENTRIES.length);
  });
});

describe('recordedIn («من أخرجه»)', () => {
  it('shows every book al-Nawawi names, marked as his, and marks no book he does not name', () => {
    for (const entry of ENTRIES) {
      const boxes = recordedIn(entry);
      for (const name of entry.named) expect(boxes.some(box => box.name === name && box.named), `${entry.n}: ${name}`).toBe(true);
      for (const record of entry.records) expect(boxes.filter(box => box.number === undefined && box.name === COLLECTOR[record.book]), `${entry.n}: ${record.book}`).toEqual([]);
      for (const box of boxes) expect(box.named, `${entry.n}: ${box.name}`).toBe(entry.named.includes(box.name));
    }
  });

  it('gives a Muslim number once, however many routes are printed under it', () => {
    const many = ENTRIES.find(entry => entry.records.filter(record => record.book === 'muslim').length > 1)!;
    const numbers = recordedIn(many).filter(box => box.name === 'مسلم').map(box => box.number);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('says «بعضه» under the Sahihayn when al-Nawawi says only part of it is there (no. 33)', () => {
    const boxes = recordedIn(ENTRIES.find(entry => entry.n === 33)!);
    expect(boxes.filter(box => box.name === 'البخاري' || box.name === 'مسلم').every(box => box.notes.includes('بعضه'))).toBe(true);
    expect(boxes.find(box => box.name === 'البيهقي')!.notes).not.toContain('بعضه');
  });
});

const turn = (speaker: string, agent?: string) => ({ kind: 'turn' as const, speaker, agent, text: '' });
const SCENES = (units as AppHadith).units.flatMap(unit => unit.reports.map(report => report.scenes));

describe('the colours of a scene\'s speakers', () => {
  it('gives the Prophet ﷺ the first colour and the first chip, even when someone else speaks before him', () => {
    const scene: SceneView = { ordinal: 1, lines: [turn('رجل'), turn('رسول الله', PROPHET_AGENT), turn('عمر')] };
    expect(sceneSlots([scene], sceneSpeakers(scene.lines).length + 1)[0].get('رسول الله')).toBe(0);
    expect(sceneSpeakers(scene.lines).map(one => one.speaker)).toEqual(['رسول الله', 'رجل', 'عمر']);
  });

  it('never gives two speakers of one scene the same colour while there are colours enough, nor anyone else the Prophet\'s', () => {
    for (const scenes of SCENES) {
      const enough = 1 + Math.max(...scenes.map(scene => sceneSpeakers(scene.lines).length));
      for (const [i, slots] of sceneSlots(scenes, enough).entries()) {
        const speakers = sceneSpeakers(scenes[i].lines);
        expect(new Set(slots.values()).size).toBe(slots.size);
        for (const { speaker, prophet } of speakers) expect(slots.get(speaker) === 0).toBe(prophet);
      }
    }
  });

  it('still gives everyone a colour when a scene has more speakers than colours', () => {
    const scene: SceneView = { ordinal: 1, lines: ['أ', 'ب', 'ج', 'د', 'ه'].map(name => turn(name)) };
    const fewer = sceneSpeakers(scene.lines).length - 1;
    const slots = sceneSlots([scene], fewer)[0];
    expect(slots.size).toBe(sceneSpeakers(scene.lines).length);
    for (const at of slots.values()) expect(at > 0 && at < fewer).toBe(true);
  });
});

describe('splitLead (the words before a bubble)', () => {
  it('takes the last saying verb and what follows it as the lead-in', () => {
    expect(splitLead('قَالَ فَعَجِبْنَا لَهُ يَسْأَلُهُ وَيُصَدِّقُهُ. قَالَ')).toEqual({ before: 'قَالَ فَعَجِبْنَا لَهُ يَسْأَلُهُ وَيُصَدِّقُهُ.', lead: 'قَالَ' });
    expect(splitLead('فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم')).toEqual({ lead: 'فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم' });
    expect(splitLead('قَالَ ثُمَّ انْطَلَقَ فَلَبِثْتُ مَلِيًّا ثُمَّ قَالَ لِي')).toEqual({ before: 'قَالَ ثُمَّ انْطَلَقَ فَلَبِثْتُ مَلِيًّا', lead: 'ثُمَّ قَالَ لِي' });
  });

  it('cuts every narration of the stored scenes without losing or changing a letter', () => {
    for (const scenes of SCENES) for (const scene of scenes) for (const line of scene.lines) {
      if (line.kind !== 'narration') continue;
      const { before, lead } = splitLead(line.text);
      expect([before, lead].filter(Boolean).join(' ').replace(/\s+/g, ' ')).toBe(line.text.trim().replace(/\s+/g, ' '));
    }
  });
});
