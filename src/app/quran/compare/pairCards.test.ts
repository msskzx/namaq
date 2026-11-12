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
    expect(pairCards(2, 38).map(card => card.id)).toEqual(['2:34|38:74']);
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
    for (const card of pairCards(2, 3, true)) for (const id of card.pairs?.map(pair => pair.id) ?? [card.id]) count.set(id, (count.get(id) ?? 0) + 1);
    expect(count.size).toBe(reviewPairs.find(pair => pair.a === 2 && pair.b === 3)!.count);
    expect([...count.values()].every(n => n === 1)).toBe(true);
    const many = pairCards(10, 26, true).find(item => item.id === '10:72|26:109,127,145,164,180')!;
    expect(many.verdict).toBeUndefined();
    expect(many.pairs?.every(pair => pair.verdict)).toBe(true);
  });

  it('adds a curated word link and the pair it needs, inside the range card', () => {
    const card = pairCards(3, 19).find(item => item.id === '3:40-41|19:8-10')!;
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
    expect(review.reduce((sum, card) => sum + (card.pairs?.length ?? 1), 0)).toBe(reviewPairs.find(pair => pair.a === 2 && pair.b === 3)!.count);
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
