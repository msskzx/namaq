import { describe, expect, it } from 'vitest';
import { compareVerdicts } from '@/lib/quran/curation/comparePairs';
import data from './pairs.json';
import passage from './passagePairs.json';
import within from './withinPairs.json';
import curatedLinks from '@/lib/quran/curation/compareLinks.json';
import generated from '@shared/data/quran/compareCards';
import { buildCompareCards } from './buildCards';
import treeData from '@shared/data/quran/trees.json';
import { normalizeWord } from '@shared/quran/normalize';
import { compareLinkFor, compareLinksFor, engineCards, listedPairs, pairCards, reviewPairs, reviewStates, stepsBack, storyCards, timelineParts } from './pairCards';
import { shownCards, type PairCard, type StoredCards } from '@shared/quran/compareCards';
import { STORIES } from '@shared/quran/prophets/stories';

describe('compare pair cards', () => {
  it('shows At-Tur and Al-Qalam as five cards, the last two ayat merged, with marks inside each ayah', () => {
    const cards = pairCards(68, 52);
    expect(cards.map(card => card.id)).toEqual(['52:17|68:34', '52:25|68:30', '52:29|68:2', '52:34|68:41', '52:40-41|68:46-47']);
    for (const ayah of cards.flatMap(card => card.sides).flatMap(side => side.ayat)) for (const index of Object.keys(ayah.marks ?? {})) expect(Number(index)).toBeLessThan(ayah.words.length);
  });

  it('merges the Moses and the magicians passage into one range card and leaves far pairs apart', () => {
    const cards = engineCards(7, 26);
    const moses = cards.find(card => card.id === '7:106-125|26:31-50')!;
    expect(moses.sides.map(side => side.ayat.map(ayah => ayah.number))).toEqual([Array.from({ length: 20 }, (_, i) => 106 + i), Array.from({ length: 20 }, (_, i) => 31 + i)]);
    expect(moses.pairs?.map(pair => pair.id)).toEqual(expect.arrayContaining(['7:106|26:31', '7:113|26:40', '7:113|26:41', '7:125|26:50']));
    expect(cards.map(card => card.id)).toEqual(expect.arrayContaining(['7:106|26:154', '7:111|26:53']));
  });

  it('tells the creation of Adam on Al-Baqarah and Al-A\'raf as its curated parts, in place of the engine cards inside it', () => {
    const ids = pairCards(2, 7, true).map(card => card.id);
    const parts = ['2:30-34|7:11-18', '2:35|7:19', '2:36|7:20-22', '2:37|7:23', '2:38-39|7:24-25'];
    expect(ids.slice(ids.indexOf(parts[0]), ids.indexOf(parts[0]) + 5)).toEqual(parts);
    expect(ids).not.toContain('2:34|7:11');
    expect(ids).not.toContain('2:36|7:24');
    const cards = pairCards(2, 7, true);
    const part = (id: string) => cards.find(card => card.id === id)!;
    expect(part(parts[2]).pairs?.map(pair => pair.id)).toEqual(['2:36|7:24']);
    expect(part(parts[3]).pairs?.map(pair => pair.id)).toEqual(['2:37|7:23']);
    expect(part(parts[4]).pairs?.map(pair => pair.id)).toEqual(['2:38|7:24']);
    expect(part(parts[0]).sides.map(side => side.ayat.map(ayah => ayah.number))).toEqual([[30, 31, 32, 33, 34], [11, 12, 13, 14, 15, 16, 17, 18]]);
    // Al-Baqarah dwells on what comes before the prostration, al-A'raf on Iblis after it; the prostration they share lines up between.
    expect(part(parts[0]).sides.map(side => side.rows)).toEqual([[[30, 31, 32, 33], [34], []], [[], [11], [12, 13, 14, 15, 16, 17, 18]]]);
    expect(Object.keys(part(parts[0]).sides[0].ayat[4].marks ?? {}).length).toBeGreaterThan(5);
    expect(Object.keys(part(parts[0]).sides[0].ayat[0].marks ?? {})).toEqual([]);
    expect(part(parts[1]).sides[0].rows).toBeUndefined();
    const marked = (ayah: { words: string[]; marks?: Record<number, unknown> }) => Object.keys(ayah.marks ?? {}).map(i => normalizeWord(ayah.words[Number(i)]));
    expect(marked(part(parts[4]).sides[0].ayat[0])).toContain(normalizeWord('ٱهْبِطُوا۟'));
    // Adam's story in Sad comes from his timeline: one card, al-Baqarah's whole stretch beside Sad's.
    expect(pairCards(2, 38).map(card => card.id)).toEqual(['2:30-39|38:71-85']);
  });

  it('cuts a prophet\'s story into cards from the timeline: one per shared event, with the one-sided events as rows', () => {
    const rows = (story: string, surahs: [number, number]) => timelineParts(STORIES[story], surahs).map(part => part.rows.map(row => row.map(side => (side.length ? `${side[0]}-${side[side.length - 1]}` : ''))));
    expect(rows('nuh', [11, 26])).toEqual([
      [['25-26', '105-110']],
      [['27-31', '111-115']],
      [['32-35', '116-116'], ['', '117-118'], ['36-39', ''], ['40-41', ''], ['42-43', ''], ['', '119-122'], ['44-44', ''], ['45-47', ''], ['48-49', '']],
    ]);
    // 26:10-17 comes before the first event al-A'raf shares, so it is a row on that card; 11:89 lies outside Nuh's stretch of Hud.
    expect(rows('musa', [7, 26])[0]).toEqual([['', '10-17'], ['103-108', '18-33']]);
    expect(rows('nuh', [11, 26]).flat(2)).not.toContain('89-89');
  });

  it('shows no ayah on two story cards of one pair, across every story that tells it', () => {
    const { timelineStories = [], storyParts = [] } = curatedLinks as { timelineStories?: { story: string; surahs: number[] }[]; storyParts?: { parts: (string | string[])[] }[] };
    const numbers = (range: string) => {
      const [from, to = from] = range.split(':')[1].split('-').map(Number);
      return Array.from({ length: to - from + 1 }, (_, k) => `${range.split(':')[0]}:${from + k}`);
    };
    const shown = new Map<string, string[]>();
    // One card shows an ayah once even when two of its rows hold it, so each card counts its ayat once.
    const add = (pair: string, keys: string[]) => shown.set(pair, [...(shown.get(pair) ?? []), ...new Set(keys)]);
    for (const { story, surahs: [x, y] } of timelineStories) for (const part of timelineParts(STORIES[story], [x, y])) {
      add(`${x}:${y}`, part.rows.flatMap(([a, b]) => [...a.map(n => `a ${x}:${n}`), ...b.map(n => `b ${y}:${n}`)]));
    }
    for (const { parts } of storyParts) {
      const sides = [0, 1].map(s => parts.flat().map(row => row.split('|')[s]).filter(Boolean));
      const pair = sides.map(side => side[0].split(':')[0]).join(':');
      for (const part of parts) add(pair, [part].flat().flatMap(row => row.split('|').flatMap((range, s) => (range ? numbers(range).map(key => `${'ab'[s]} ${key}`) : []))));
    }
    for (const [pair, keys] of shown) expect(keys.filter((key, i) => keys.indexOf(key) !== i), pair).toEqual([]);
  });

  it('tells Zakariyya and Maryam on one pair of surahs without an ayah on two cards', () => {
    const ids = ['3:37-38|19:2-6', '3:39|19:7', '3:40|19:8-9', '3:41|19:10-11', '3:42-63|19:16-40'];
    const story = pairCards(3, 19, true).filter(card => ids.includes(card.id));
    expect(story.map(card => card.id)).toEqual(ids);
    const shown = [0, 1].map(s => story.flatMap(card => card.sides[s].ayat.map(ayah => ayah.number)));
    for (const side of shown) expect(new Set(side).size).toBe(side.length);
    // Al-Ma'idah gathers Isa's signs (5:109-110) apart from his disciples and the table (5:111-119), so neither card steps back.
    const maidah = pairCards(3, 5, true).filter(card => card.sides[0].rows);
    expect(maidah.map(card => card.id)).toEqual(['3:42-51|5:109-110', '3:52-63|5:111-119']);
    expect(maidah.some(card => card.sides.some(side => side.back))).toBe(false);
  });

  it('tells Sulayman then Ayyub on al-Anbiya\' and Sad, and the prophet lists as one card', () => {
    const ids = pairCards(21, 38, true).map(card => card.id);
    expect(ids.slice(ids.indexOf('21:81|38:30-36'), ids.indexOf('21:81|38:30-36') + 4)).toEqual(['21:81|38:30-36', '21:82|38:37-40', '21:83|38:41', '21:84|38:42-44']);
    expect(ids).not.toContain('21:83-84|38:41-43');
    // The prophet lists are one hand-cut card, so 4:163 shows once however many timelines hold it.
    expect(pairCards(4, 6, true).filter(card => card.sides[0].ayat.some(ayah => ayah.number === 163)).map(card => card.id)).toEqual(['4:163|6:84-86']);
  });

  it('serves the timeline cards in place of the engine cards inside the story, and marks a side that steps back', () => {
    const ids = pairCards(11, 26, true).map(card => card.id);
    expect(ids.slice(0, 3)).toEqual(['11:25-26|26:105-110', '11:27-31|26:111-115', '11:32-49|26:116-122']);
    const moses = pairCards(7, 26, true).find(card => card.id === '7:109-126|26:34-51')!;
    expect(moses.pairs?.map(pair => pair.id)).toEqual(expect.arrayContaining(['7:113|26:40', '7:125|26:50']));
    expect(Object.keys(moses.sides[0].ayat[4].marks ?? {}).length).toBeGreaterThan(0);
    expect(stepsBack([[[1, 2], [5]], [[3], [2]], [[4], []]])).toEqual([[false, false], [false, true], [false, false]]);
    // Al-Baqarah lists Musa's events out of the story's order, so its cards run in its own order and al-A'raf steps back once.
    const musa = pairCards(2, 7, true).filter(card => (card.sides[0].rows && !card.id.startsWith('2:30')) || ['2:55-56|7:154-156', '2:63-64|7:171'].includes(card.id));
    expect(musa.map(card => card.id)).toEqual(['2:49-50|7:103-137', '2:51-93|7:142-153', '2:55-56|7:154-156', '2:57-61|7:138-162', '2:63-64|7:171']);
    expect(musa.map(card => card.sides.map(side => !!side.back))).toEqual([[false, false], [false, false], [false, false], [false, true], [false, false]]);
    // The town (2:58-59) sits inside the manna passage, so the two events share one card with no hole in al-Baqarah.
    expect(musa[3].sides.map(side => side.rows)).toEqual([[[], [57, 58, 59, 60, 61]], [[138, 139, 140, 141], [159, 160, 161, 162]]]);
  });

  it('tells Ibrahim\'s guests, the good news and the errand to Lut\'s people as three cards, each holding its pairs', () => {
    const ids = (a: number, b: number) => pairCards(a, b, true).filter(card => card.sides.every(side => side.ayat.length)).map(card => card.id);
    expect(ids(15, 51)).toEqual(expect.arrayContaining(['15:51-52|51:24-27', '15:53-56|51:28-30', '15:57-60|51:31-34']));
    // 51:28 holds the fear and the good news, so it sits with both 11:70 and 15:53.
    expect(ids(11, 51)).toEqual(expect.arrayContaining(['11:69|51:24-27', '11:70-73|51:28-30']));
    const lut = pairCards(26, 37, true).find(card => card.id.startsWith('26:160'))!;
    // 37:133 «وإن لوطا لمن المرسلين» opens the rescue that 37:134 continues with «إذ».
    expect(lut.sides[1].ayat.map(ayah => ayah.number)).toEqual([133, 134, 135]);
  });

  it('keeps every pair of Musa\'s and Harun\'s story on one card and no story ayah on two, apart from echoes across two scenes', () => {
    const echoes = ['2:36|7:24', '11:32|26:31', '7:111|26:53', '2:49|7:141', '7:132|10:79', '7:133|10:75', '20:23|79:20', '20:43|79:17', '20:45|26:12', '20:45|28:33'];
    const pages = (curatedLinks.timelineStories ?? []).filter(({ story }) => story === 'musa' || story === 'harun');
    expect(pages.length).toBeGreaterThan(100);
    for (const { story: slug, surahs: [x, y] } of pages) {
      const told = new Set(STORIES[slug].events.flatMap(event => event.segments.flatMap(({ surah, range: [lo, hi] }) => Array.from({ length: hi - lo + 1 }, (_, k) => `${surah}:${lo + k}`))));
      const engine = engineCards(x, y, true);
      const shape = (card: (typeof engine)[number]) => `${card.id} ${card.sides.map(side => side.ayat.map(ayah => ayah.number).join(',')).join('|')}`;
      const engineShapes = new Set(engine.map(shape));
      const story = pairCards(x, y, true).filter(card => !engineShapes.has(shape(card)) && card.sides.every(side => side.ayat.some(ayah => told.has(`${side.surah}:${ayah.number}`))));
      expect(story.length, `${x}:${y}`).toBeGreaterThan(0);
      for (const s of [0, 1]) {
        const shown = story.flatMap(card => card.sides[s].ayat.map(ayah => ayah.number));
        expect(shown.length, `${x}:${y}`).toBe(new Set(shown).size);
      }
      const cardOf = (s: number, n: number) => story.findIndex(card => card.sides[s].ayat.some(ayah => ayah.number === n));
      for (const { id, verdict } of engine.flatMap(card => card.pairs ?? [{ id: card.id, verdict: card.verdict }])) {
        if (verdict?.keep === false || echoes.includes(id)) continue;
        const [a, b] = id.split('|').map(key => Number(key.split(':')[1]));
        const [ca, cb] = [cardOf(0, a), cardOf(1, b)];
        if (ca >= 0 && cb >= 0) expect(ca, `${id} on ${x}:${y}`).toBe(cb);
      }
    }
  });

  it('leaves a story part the owner dropped off the page, and counts unjudged parts against the page\'s review', () => {
    const id = '2:55|7:154';
    const before = compareVerdicts[id];
    compareVerdicts[id] = { keep: true, why: 'test', checked: true };
    try {
      expect(pairCards(2, 7).some(card => card.id === '2:55-56|7:154-156')).toBe(true);
      compareVerdicts[id] = { keep: false, why: 'test', checked: true };
      expect(pairCards(2, 7).some(card => card.id === '2:55-56|7:154-156')).toBe(false);
      expect(pairCards(2, 7, true).find(card => card.id === '2:55-56|7:154-156')?.pairs?.[0].verdict?.keep).toBe(false);
    } finally {
      if (before) compareVerdicts[id] = before;
      else delete compareVerdicts[id];
    }
    // Every engine pair on 11/26 checked, the Nuh parts still unjudged: the page is not done.
    const engine = engineCards(11, 26, true).flatMap(card => card.pairs?.map(pair => pair.id) ?? [card.id]);
    const saved = engine.map(key => [key, compareVerdicts[key]] as const);
    for (const key of engine) compareVerdicts[key] = { keep: true, why: 'test', checked: true };
    try {
      expect(compareVerdicts['11:25|26:105']?.checked).toBeFalsy();
      expect(reviewStates()['11:26']).not.toBe('checked');
    } finally {
      for (const [key, verdict] of saved) if (verdict) compareVerdicts[key] = verdict; else delete compareVerdicts[key];
    }
  });

  it('puts an engine pair on the story part that shows both its ayat', () => {
    const card = pairCards(2, 7, true).find(card => card.id === '2:57-61|7:138-162')!;
    expect(card.pairs?.map(pair => pair.id)).toEqual(expect.arrayContaining(['2:57|7:160', '2:58|7:161']));
    for (const part of pairCards(2, 7, true).filter(card => card.sides[0].rows)) for (const { id } of part.pairs ?? []) {
      const [a] = id.split('|');
      expect(part.sides[0].ayat.some(ayah => `2:${ayah.number}` === a), id).toBe(true);
    }
  });

  it('tells every timeline story on every page, each story ayah on one story card and no story card pair split', () => {
    const peoples = ['nuh', 'hud', 'salih', 'shuayb', 'adam', 'isa', 'zakariyya', 'ibrahim', 'lut', 'dawud', 'sulayman', 'ayyub', 'yunus'];
    // Open questions for the owner (compare-refine/open-questions.md, #659): an ayah that tells two events, or a shared formula (#659, #655).
    const openSplits = ['2:36|20:123', '3:62|4:158', '2:135|3:95', '15:62|51:25'];
    const span = (numbers: number[]) => `${numbers[0]}${numbers.length > 1 ? `-${numbers[numbers.length - 1]}` : ''}`;
    const pages = new Map<string, [number[], number[]][][]>();
    const add = (key: string, parts: [number[], number[]][][]) => pages.set(key, [...(pages.get(key) ?? []), ...parts]);
    for (const { story, surahs } of curatedLinks.timelineStories) {
      if (story === 'musa' || story === 'harun') continue;
      expect(peoples, story).toContain(story);
      add(surahs.join(':'), timelineParts(STORIES[story], [surahs[0], surahs[1]]).map(part => part.rows));
    }
    const range = (text: string) => {
      const [from, to = from] = text.split(':')[1].split('-').map(Number);
      return Array.from({ length: to - from + 1 }, (_, k) => from + k);
    };
    for (const { story, parts } of curatedLinks.storyParts) {
      if (story === 'Adam\'s creation') continue;
      const rows = parts.map(part => (Array.isArray(part) ? part : [part]).map(row => row.split('|').map(side => (side ? range(side) : [])) as [number[], number[]]));
      const surahs = [0, 1].map(s => Number((parts.flat().map(row => row.split('|')[s]).find(Boolean) ?? '').split(':')[0]));
      add(surahs.join(':'), rows);
    }
    expect(pages.size).toBeGreaterThan(100);
    for (const [key, parts] of pages) {
      const [x, y] = key.split(':').map(Number);
      const cards = pairCards(x, y, true);
      const ids = parts.map(rows => [0, 1].map(s => `${[x, y][s]}:${span([...new Set(rows.flatMap(row => row[s]))].sort((p, q) => p - q))}`).join('|'));
      const story = ids.map(id => cards.find(card => card.id === id));
      expect(story.every(Boolean), `${key}: ${ids.join(' ')}`).toBe(true);
      for (const s of [0, 1]) {
        const shown = story.flatMap(card => card!.sides[s].ayat.map(ayah => ayah.number));
        expect(new Set(shown).size, `${key}: an ayah on two cards`).toBe(shown.length);
        expect(new Set(shown), key).toEqual(new Set(parts.flat().flatMap(row => row[s])));
      }
      for (const card of story) for (const { id } of (card!.pairs ?? []).filter(pair => !openSplits.includes(pair.id))) {
        const [a, b] = id.split('|').map(ayah => Number(ayah.split(':')[1]));
        expect([card!.sides[0].ayat.some(ayah => ayah.number === a), card!.sides[1].ayat.some(ayah => ayah.number === b)], `${key}: ${id} split from ${card!.id}`).toEqual([true, true]);
      }
    }
  });

  it('gives a range card the tree link of its first pair that has one', () => {
    const block = engineCards(2, 7).find(card => card.id === '2:57-60|7:160-162')!;
    expect(block.group).toBeDefined();
    // A story part that takes the range card over keeps its tree link.
    expect(pairCards(2, 7).find(card => card.id === '2:57-61|7:138-162')!.group).toBe(block.group);
  });

  it('shows an ayah paired with several far ones as one card, opening on the first', () => {
    const card = pairCards(10, 26).find(item => item.id === '10:72|26:109,127,145,164,180')!;
    expect(card.many?.side).toBe(1);
    expect(card.many?.options.map(option => option.ayah.number)).toEqual([109, 127, 145, 164, 180]);
    expect(card.sides.map(side => side.ayah)).toEqual([72, 109]);
    expect(card.pairs).toHaveLength(5);
    expect(pairCards(10, 26).filter(item => item.id.startsWith('10:72|'))).toHaveLength(1);
    for (const option of card.many!.options) {
      const links = [option.shared, option.ayah].map(ayah => Object.values(ayah.marks ?? {}).map(mark => mark.link).sort());
      expect(links[0].length).toBeGreaterThan(0);
      expect(links[0]).toEqual(links[1]);
    }
  });

  it('works in both directions and leaves pairs inside a range alone', () => {
    const reversed = pairCards(26, 34).find(item => item.id === '26:109,127,145,164,180|34:47')!;
    expect(reversed.many?.side).toBe(0);
    expect(reversed.sides.map(side => side.ayah)).toEqual([109, 47]);
    const moses = engineCards(7, 26).find(card => card.id === '7:106-125|26:31-50')!;
    expect(moses.many).toBeUndefined();
    expect(engineCards(7, 26).some(card => card.many?.options.some(option => moses.pairs!.some(pair => pair.id === option.id)))).toBe(false);
  });

  it('puts every pair on exactly one card, with verdicts per pair in review', () => {
    const count = new Map<string, number>();
    // Ibrahim's story parts on this page judge a part with no engine pair under its own first ayat; those are not engine pairs.
    const engine = new Set(engineCards(2, 3, true).flatMap(card => card.pairs?.map(pair => pair.id) ?? [card.id]));
    for (const card of pairCards(2, 3, true)) for (const id of card.pairs?.map(pair => pair.id) ?? [card.id]) if (engine.has(id)) count.set(id, (count.get(id) ?? 0) + 1);
    expect(count.size).toBe(reviewPairs.find(pair => pair.a === 2 && pair.b === 3)!.count);
    expect([...count.values()].every(n => n === 1)).toBe(true);
    const many = pairCards(10, 26, true).find(item => item.id === '10:72|26:109,127,145,164,180')!;
    expect(many.verdict).toBeUndefined();
    expect(many.pairs?.every(pair => pair.verdict)).toBe(true);
  });

  it('adds a curated word link and the pair it needs, and keeps it on the story card that takes the range over', () => {
    const card = pairCards(3, 19).find(item => item.id === '3:40|19:8-9')!;
    expect(card.pairs?.map(pair => pair.id)).toContain('3:40|19:9');
    const [a, b] = [card.sides[0].ayat[0], card.sides[1].ayat[1]];
    expect(a.number).toBe(40);
    expect(b.number).toBe(9);
    expect(a.marks?.[12]?.link).toBeDefined();
    expect(a.marks?.[12]?.link).toBe(b.marks?.[1]?.link);
    expect(a.marks?.[12]?.kind).toBe('exact');
  });

  it('keys curated links with the lower surah first, once each', () => {
    const pairs = curatedLinks.links.map(item => item.pair);
    expect(new Set(pairs).size).toBe(pairs.length);
    for (const pair of pairs) expect(Number(pair.split(':')[0])).toBeLessThan(Number(pair.split('|')[1].split(':')[0]));
  });

  it('has curated links only on words that exist', () => {
    const ayat = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));
    for (const item of curatedLinks.links) {
      const [a, b] = item.pair.split('|').map(key => ayat.get(key)!);
      for (const [i, j] of item.links as [number, number, string][]) expect(a[i] && b[j]).toBeTruthy();
    }
  });

  it('keeps a pair marked alone on its own card', () => {
    const ids = pairCards(7, 11).map(card => card.id);
    expect(ids).toContain('7:70|11:62');
    expect(ids.some(id => id.startsWith('7:70-'))).toBe(false);
    expect(pairCards(7, 11).find(card => card.id === '7:70|11:62')?.pairs).toBeUndefined();
  });

  it('is built from the current pairs and verdicts: run npm run quran:compare-cards after changing them', () => {
    const { stories, ...cards } = generated as unknown as StoredCards;
    expect(cards).toEqual(JSON.parse(JSON.stringify(buildCompareCards())));
    expect(stories).toEqual(JSON.parse(JSON.stringify(storyCards())));
  });

  it('gives the phone app every story page as the website shows it', () => {
    const stored = generated as unknown as StoredCards;
    const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));
    const wordsOf = (key: string) => words.get(key);
    expect(Object.keys(stored.stories ?? {}).length).toBeGreaterThan(0);
    for (const key of Object.keys(stored.stories!)) {
      const [a, b] = key.split(':').map(Number);
      // Link names are numbered afresh in the file; only which words share one matters.
      const plain = (cards: PairCard[]) => JSON.parse(JSON.stringify(cards, (key, value) => (key === 'link' ? undefined : value)));
      const partners = (cards: PairCard[]) => cards.map(card => card.sides.flatMap(side => side.ayat.flatMap(ayah => Object.values(ayah.marks ?? {}).map(mark => mark.link))))
        .map(links => links.map(link => (link === undefined ? -1 : links.indexOf(link))));
      const [shown, page] = [shownCards(stored, wordsOf, a, b), pairCards(a, b)];
      expect(plain(shown)).toEqual(plain(page));
      expect(partners(shown)).toEqual(partners(page));
    }
  });

  it('joins a curated passage that runs in a different order into one card', () => {
    const card = pairCards(43, 78).find(item => item.id === '43:9-12|78:6-16')!;
    expect(card.sides.map(side => side.ayat.length)).toEqual([4, 11]);
    const links = card.sides.map(side => side.ayat.flatMap(ayah => Object.values(ayah.marks ?? {}).map(mark => mark.link)).sort());
    expect(links[0]).toEqual(links[1]);
    expect(new Set(links[0]).size).toBe(links[0].length);
  });

  it('gives each word one partner on the curated Moses card', () => {
    const moses = engineCards(7, 26).find(card => card.id === '7:106-125|26:31-50')!;
    const [a, b] = moses.sides.map(side => side.ayat.flatMap(ayah => Object.values(ayah.marks ?? {}).map(mark => mark.link)));
    expect(new Set(a).size).toBe(a.length);
    expect(new Set(b).size).toBe(b.length);
    expect(moses.sides[1].ayat.find(ayah => ayah.number === 40)?.marks).toEqual({});
    expect(moses.sides[1].ayat.find(ayah => ayah.number === 41)?.marks?.[2]).toBeDefined();
  });

  it('merges two runs of one passage when they share an ayah', () => {
    expect(pairCards(69, 101).map(card => card.id)).toContain('69:3-4|101:1-3');
  });

  it('keeps every word link on both sides of a range card', () => {
    for (const card of engineCards(7, 26)) {
      const [a, b] = card.sides.map(side => new Set(side.ayat.flatMap(ayah => Object.values(ayah.marks ?? {}).map(mark => mark.link))));
      expect([...a].sort()).toEqual([...b].sort());
    }
  });

  it('keeps a verdict per ayah pair inside a range card in review', () => {
    const moses = engineCards(7, 26, true).find(card => card.id === '7:106-125|26:31-50')!;
    expect(moses.verdict).toBeUndefined();
    expect(moses.pairs?.every(pair => pair.verdict?.keep)).toBe(true);
    expect(engineCards(7, 26).find(card => card.id === '7:106-125|26:31-50')?.pairs?.some(pair => pair.verdict)).toBe(false);
  });

  it('counts every ayah pair once across the cards of a page', () => {
    // A story part with no engine pair carries one of its own to be judged under, which the engine never counted.
    const engine = new Set([...data.pairs, ...passage.pairs, ...within.pairs].map(pair => `${pair.a}|${pair.b}`));
    const count = (cards: ReturnType<typeof pairCards>) => cards.reduce((sum, card) => sum + (card.pairs?.filter(pair => engine.has(pair.id)).length ?? 1), 0);
    for (const pair of listedPairs.slice(0, 50)) expect(count(pairCards(pair.a, pair.b))).toBe(pair.count);
  });

  it('leaves out pairs a reader judged to share only vocabulary, and shows them with their verdict in review', () => {
    const ids = (cards: ReturnType<typeof pairCards>) => cards.map(card => card.id);
    const dropped = ['2:107|3:29', '2:116|3:29', '2:116|3:189', '2:121|3:100'];
    for (const id of dropped) expect(compareVerdicts[id]?.keep).toBe(false);
    expect(ids(pairCards(2, 3))).not.toEqual(expect.arrayContaining([dropped[0]]));
    expect(ids(pairCards(2, 3))).toEqual(expect.arrayContaining(['2:66|3:138', '2:127|3:35']));
    const review = pairCards(2, 3, true);
    const engine = new Set(engineCards(2, 3, true).flatMap(card => card.pairs?.map(pair => pair.id) ?? [card.id]));
    expect(review.reduce((sum, card) => sum + (card.pairs?.filter(pair => engine.has(pair.id)).length ?? 1), 0)).toBe(reviewPairs.find(pair => pair.a === 2 && pair.b === 3)!.count);
    expect(review.find(card => card.id === '2:107|3:29')?.verdict?.keep).toBe(false);
    expect(listedPairs.find(pair => pair.a === 2 && pair.b === 3)?.count).toBe(pairCards(2, 3).reduce((sum, card) => sum + (card.pairs?.length ?? 1), 0));
  });

  it('lists a page with at least one kept pair, but keeps every engine page in review', () => {
    expect(listedPairs.some(pair => pair.a === 3 && pair.b === 18)).toBe(false);
    expect(reviewPairs.find(pair => pair.a === 3 && pair.b === 18)?.count).toBe(5);
    expect(reviewStates()['3:18']).toBe('dropped');
    for (const pair of listedPairs) expect(pair.count).toBeGreaterThanOrEqual(1);
    expect(listedPairs.some(pair => pair.count < 3)).toBe(true);
  });

  it('shows the whole range of a join, including ayat with no partner', () => {
    const cards = pairCards(69, 84).filter(card => card.id.includes('-'));
    expect(cards.map(card => card.id)).toEqual(['69:1-18|84:1-6', '69:19-24|84:7-9', '69:25-37|84:10-15', '69:38-48|84:16-21', '69:49-52|84:22-25']);
    for (const [side, surahEnd] of [[0, 52], [1, 25]] as const) {
      expect(cards.flatMap(card => card.sides[side].ayat.map(ayah => ayah.number))).toEqual(Array.from({ length: surahEnd }, (_, i) => i + 1));
    }
    expect(cards[0].sides[0].ayat[0].marks).toEqual({});
  });

  it('links two ayat of a tree to their compare card only for a kept pair on a listed page', () => {
    expect(compareLinkFor(['2:23', '7:194', '1:1'])).toBe('/quran/compare?a=2&b=7#c-2-23-7-194');
    // A tree across two surahs has one link; one across more lists every listed pair holding a kept card of two of its ayat.
    expect(compareLinksFor(['2:35', '7:19'])).toEqual([{ href: '/quran/compare?a=2&b=7#c-2-35-7-19', label: 'البقرة مع الأعراف · ٣٥ · ١٩', labelEn: "Al-Baqara with Al-A'raaf · 35 · 19", surahs: [2, 7] }]);
    const many = compareLinksFor(['2:35', '7:19', '20:117']);
    expect(many.map(link => link.href.split('#')[0])).toEqual([...new Set(many.map(link => link.href.split('#')[0]))]);
    expect(compareLinkFor(['3:57', '18:30'])).toBeUndefined();
    expect(compareLinkFor(['2:23'])).toBeUndefined();
  });

  it('links a pair inside a story part to the part that holds it', () => {
    expect(compareLinkFor(['7:113', '26:40'])).toBe('/quran/compare?a=7&b=26#c-7-109-26-34');
  });

  describe('passage pairs', () => {
    const ayat = new Map((treeData.ayat as { key: string; words: string[]; lemmas?: (string | null)[]; roots?: (string | null)[] }[]).map(ayah => [ayah.key, ayah]));
    const pairs = passage.pairs as { a: string; b: string; columns: [number, number, string][] }[];

    it('put the lower surah first, and repeat no engine pair', () => {
      const engine = new Set((data.pairs as { a: string; b: string }[]).flatMap(pair => [`${pair.a}|${pair.b}`, `${pair.b}|${pair.a}`]));
      for (const pair of pairs) {
        expect(Number(pair.a.split(':')[0])).toBeLessThan(Number(pair.b.split(':')[0]));
        expect(engine.has(`${pair.a}|${pair.b}`)).toBe(false);
      }
    });

    it('give each matched word the level its lemma and root support', () => {
      for (const pair of pairs) for (const [i, j, level] of pair.columns) {
        const [a, b] = [ayat.get(pair.a)!, ayat.get(pair.b)!];
        const same = normalizeWord(a.words[i]) === normalizeWord(b.words[j]);
        if (level === 'exact') expect(same).toBe(true);
        else if (level === 'lemma') expect(a.lemmas![i]).toBe(b.lemmas![j]);
        else expect(a.roots![i]).toBe(b.roots![j]);
      }
    });

    it('pair a word that recurs in an ayah with the occurrence at the same place', () => {
      const columns = (id: string) => pairs.find(pair => `${pair.a}|${pair.b}` === id)!.columns.map(([i, j]) => [i, j]);
      expect(columns('77:14|82:18')).toEqual(expect.arrayContaining([[2, 3], [0, 1]]));
      expect(columns('56:8|90:18')).toEqual(expect.arrayContaining([[3, 1], [4, 2]]));
    });

    it('recover the Al-Waqi\'ah and Al-Haqqah passage across ayah boundaries', () => {
      expect(pairCards(56, 69).map(card => card.id)).toEqual(expect.arrayContaining(['56:1|69:15', '56:75-80|69:38-43', '56:94|69:31']));
    });
  });

  describe('a surah with itself', () => {
    it('lists surahs whose own ayat resemble each other, al-Rahman and al-Shu\'ara among them', () => {
      expect(listedPairs).toEqual(expect.arrayContaining([expect.objectContaining({ a: 55, b: 55 }), expect.objectContaining({ a: 26, b: 26 })]));
    });

    it('collapses a refrain repeated word for word into one card from its first place', () => {
      const refrain = pairCards(55, 55).filter(card => card.many?.options.length === 30);
      expect(refrain.map(card => card.sides[0].ayah)).toEqual([13]);
      expect(pairCards(55, 55).filter(card => card.id.startsWith('55:16|'))).toEqual([]);
    });

    it('keeps the two sides of a run from overlapping', () => {
      for (const card of pairCards(6, 6)) {
        const [a, b] = card.sides.map(side => [side.ayah, side.ayat[side.ayat.length - 1].number]);
        expect(card.many || a[1] < b[0] || b[1] < a[0]).toBeTruthy();
      }
    });

    it('names the page «… مع نفسها» from a tree inside one surah', () => {
      expect(compareLinksFor(['6:76', '6:77'])[0]?.label).toBe('الأنعام مع نفسها · ٧٦ · ٧٧');
    });
  });

  it('has a verdict only for known pairs, and one for every passage pair', () => {
    const found = new Set(([...data.pairs, ...passage.pairs, ...within.pairs, ...curatedLinks.links.map(item => ({ a: item.pair.split('|')[0], b: item.pair.split('|')[1] }))] as { a: string; b: string }[]).map(pair => [pair.a, pair.b].sort((x, y) => Number(x.split(':')[0]) - Number(y.split(':')[0])).join('|')));
    expect(Object.keys(compareVerdicts).filter(id => !found.has(id))).toEqual([]);
    expect(passage.pairs.filter(pair => !compareVerdicts[`${pair.a}|${pair.b}`])).toEqual([]);
  });

  it('marks words that share only a root lightly, apart from same-word matches', () => {
    const card = pairCards(2, 3).find(card => card.id === '2:66|3:138')!;
    const kinds = card.sides.map(side => Object.entries(side.ayat[0].marks ?? {}).map(([i, mark]) => `${side.ayat[0].words[Number(i)]}:${mark.kind}`));
    expect(kinds[0]).toContain('بَيْنَ:related');
    expect(kinds[1].filter(entry => entry.endsWith(':related'))).toHaveLength(1);
  });

  it('matches words whose order crosses, and words the corpus spells apart', () => {
    const option = pairCards(2, 3).flatMap(card => card.many?.options ?? []).find(item => item.id === '2:135|3:67')!;
    const [a, b] = [option.shared.marks ?? {}, option.ayah.marks ?? {}];
    // هودا ↔ يهوديا and نصارى ↔ نصرانيا
    expect([a[2]?.link, a[4]?.link]).toEqual([b[3]?.link, b[5]?.link]);
    expect(a[2]?.kind).toBe('root');
    // إبراهيم has no root but is a name: matched although it comes after هودا in one ayah and before يهوديا in the other
    expect(a[9]?.link).toBeDefined();
    expect(a[9]?.link).toBe(b[2]?.link);
  });
});
