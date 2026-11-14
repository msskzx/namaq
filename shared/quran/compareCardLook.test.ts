import { describe, expect, it } from 'vitest';
import type { CardAyah, PairCard } from './compareCards';
import { COMPARE_CARD, markColour, runsLabel, sideTitle, sideView } from './compareCardLook';
import { compareVideoInput, markColours, videoCard } from '../video/compareVideo';
import { readPlan } from './readPlan';

const ayah = (number: number, words = ['قال', 'رب']): CardAyah => ({ number, words, marks: { 0: { kind: 'exact', link: 'a' } } });
const names = { side: (name: { surah: number; numbers: number[]; listed?: boolean }) => sideTitle(name, n => `س${n}`), silent: (surah: number) => `لا تذكر ${surah}` };

describe('the compare card shared by the app and its video', () => {
  it('splits a side into stretches named on dotted rules', () => {
    const card: PairCard = { id: 'c', sides: [{ surah: 2, ayah: 1, ayat: [ayah(1), ayah(2), ayah(5)] }, { surah: 7, ayah: 1, ayat: [ayah(1)] }] };
    expect(sideView(card, 0).pieces.map(piece => piece.kind)).toEqual(['range', 'ayat', 'gap', 'ayat']);
    expect(sideTitle(sideView(card, 0).name, n => `س${n}`)).toBe('س2 ١–٢ · ٥');
  });

  it('lists every partner of a one-to-many side, the picked one marked and the others plain', () => {
    const card: PairCard = { id: 'm', sides: [{ surah: 3, ayah: 15, ayat: [ayah(15)] }, { surah: 48, ayah: 5, ayat: [ayah(5)] }],
      many: { side: 0, options: [{ id: 'x', ayah: ayah(15, ['قل']), shared: ayah(5) }, { id: 'y', ayah: ayah(198, ['لكن']), shared: ayah(5) }] } };
    const view = sideView(card, 0, 1);
    expect(view.pieces.filter(piece => piece.kind === 'ayat')).toMatchObject([{ plain: true, picked: false }, { picked: true }]);
    expect(sideTitle(view.name, n => `س${n}`)).toBe('س3 ١٥ · ١٩٨');
    // The video draws each partner's sides from the same pieces.
    const video = videoCard(card, readPlan(card), 1, names);
    expect(video.options).toHaveLength(2);
    expect(video.options[1][0].pieces.map(piece => piece.kind)).toEqual(['ayat', 'dash', 'ayat']);
  });

  it('opens a story part on its rule and names a part a surah does not tell', () => {
    const card: PairCard = { id: 's', sides: [{ surah: 2, ayah: 1, ayat: [ayah(1)], rows: [[1], []] }, { surah: 7, ayah: 3, ayat: [ayah(3)], rows: [[3], [9]] }] };
    expect(sideView(card, 0).pieces.map(piece => piece.kind)).toEqual(['part', 'ayat', 'part', 'silent']);
    expect(sideView(card, 0, 0, [0]).pieces.map(piece => piece.kind)).toEqual(['part', 'part', 'silent']);
    expect(videoCard(card, readPlan(card), 1, names).options[0][0].pieces.at(-1)).toEqual({ kind: 'silent', note: 'لا تذكر 2' });
  });

  it("gives the video the app's measures and mark colours, and ends every video on the emblem", () => {
    const colours = { accent: '#783d49', root: '#665177', muted: '#62645e' };
    expect(markColours(colours)).toEqual({ exact: '#783d49', root: '#665177', related: markColour('related', colours) });
    const card: PairCard = { id: 'p', sides: [{ surah: 2, ayah: 1, ayat: [ayah(1)] }, { surah: 7, ayah: 1, ayat: [ayah(1)] }] };
    const look = { paper: '', card: '', deep: '', ink: '', muted: '', rule: '', accent: '', green: '', highlight: '', onHighlight: '', marks: markColours(colours), font: '', ui: '', logo: '' };
    const input = compareVideoInput({ title: 't', cards: [videoCard(card, readPlan(card), 1, names)], look });
    expect(input.measures).toBe(COMPARE_CARD);
    expect(input.timeline.map(segment => segment.kind)).toEqual(['card', 'end']);
    expect(runsLabel([3, 4, 5, 9])).toBe('٣–٥ · ٩');
  });
});

describe('the end frame', () => {
  it("draws the emblem with the app's name and slogan, in every video's recorder", async () => {
    const { OUTRO } = await import('../video/recorder');
    const { compareRecorderPage } = await import('../video/compareVideo');
    const { APP_NAME, SLOGAN } = await import('../brand');
    expect(OUTRO).toContain(JSON.stringify(APP_NAME));
    expect(OUTRO).toContain(JSON.stringify(SLOGAN));
    const card: PairCard = { id: 'p', sides: [{ surah: 2, ayah: 1, ayat: [ayah(1)] }, { surah: 7, ayah: 1, ayat: [ayah(1)] }] };
    const look = { paper: '', card: '', deep: '', ink: '', muted: '', rule: '', accent: '', green: '', highlight: '', onHighlight: '', marks: markColours({ accent: '#000000', root: '#000000', muted: '#000000' }), font: '', ui: '', logo: '' };
    expect(compareRecorderPage(compareVideoInput({ title: 't', cards: [videoCard(card, readPlan(card), 1, names)], look }))).toContain('function outro(');
  });
});
