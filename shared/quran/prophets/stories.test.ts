import { describe, expect, it } from 'vitest';
import { PROPHETS } from '.';
import { ALYASA } from './alyasa';
import { AYYUB } from './ayyub';
import { DAWUD } from './dawud';
import { DHUL_KIFL } from './dhul-kifl';
import { HARUN } from './harun';
import { IDRIS } from './idris';
import { IBRAHIM } from './ibrahim';
import { ILYAS } from './ilyas';
import { ADAM } from './adam';
import { MUSA } from './musa';
import { NUH } from './nuh';
import { SHUAYB } from './shuayb';
import { SULAYMAN } from './sulayman';
import { STORIES } from './stories';
import { storyKeys } from './story';
import { YAHYA } from './yahya';
import { YAQUB } from './yaqub';
import { YUSUF } from './yusuf';
import { ZAKARIYYA } from './zakariyya';

const MUSA_EVENTS = MUSA.events;

const NAMED: Record<number, number[]> = {
  2: [51, 53, 54, 55, 60, 61, 67, 87, 92, 108, 136, 246, 248],
  3: [84],
  4: [153, 164],
  5: [20, 22, 24],
  6: [84, 91, 154],
  7: [103, 104, 115, 117, 122, 127, 128, 131, 134, 138, 142, 143, 144, 148, 150, 154, 155, 159, 160],
  10: [75, 77, 80, 81, 83, 84, 87, 88],
  11: [17, 96, 110],
  14: [5, 6, 8],
  17: [2, 101],
  18: [60, 66],
  19: [51],
  20: [9, 11, 17, 19, 36, 40, 49, 57, 61, 65, 67, 70, 77, 83, 86, 88, 91],
  21: [48],
  22: [44],
  23: [45, 49],
  25: [35],
  26: [10, 43, 45, 48, 52, 61, 63, 65],
  27: [7, 9, 10],
  28: [3, 7, 10, 15, 18, 19, 20, 29, 30, 31, 36, 37, 38, 43, 44, 48, 76],
  29: [39],
  32: [23],
  33: [7, 69],
  37: [114, 120],
  40: [23, 26, 27, 37, 53],
  41: [45],
  42: [13],
  43: [46],
  46: [12, 30],
  51: [38],
  53: [36],
  61: [5],
  79: [15],
  87: [19],
};

const PHARAOH: Record<number, number[]> = {
  2: [49, 50],
  3: [11],
  7: [103, 104, 109, 113, 123, 127, 130, 137, 141],
  8: [52, 54],
  10: [75, 79, 83, 88, 90],
  11: [97],
  14: [6],
  17: [101, 102],
  20: [24, 43, 60, 78, 79],
  23: [46],
  26: [11, 16, 23, 41, 44, 53],
  27: [12],
  28: [3, 4, 6, 8, 9, 32, 38],
  29: [39],
  38: [12],
  40: [24, 26, 28, 29, 36, 37, 45, 46],
  43: [46, 51],
  44: [17, 31],
  50: [13],
  51: [38],
  54: [41],
  66: [11],
  69: [9],
  73: [15, 16],
  79: [17],
  85: [18],
  89: [10],
};

describe('MUSA_EVENTS', () => {
  const keys = storyKeys(MUSA_EVENTS);

  it('puts no ayah in two events', () => {
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('holds every ayah that names Musa', () => {
    const named = Object.entries(NAMED).flatMap(([s, ns]) => ns.map(n => `${s}:${n}`));
    expect(named).toHaveLength(131);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('holds every ayah that names Pharaoh or Haman', () => {
    const named = Object.entries(PHARAOH).flatMap(([s, ns]) => ns.map(n => `${s}:${n}`));
    expect(named).toHaveLength(67);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('keeps every range ordered', () => {
    for (const e of MUSA_EVENTS) for (const g of e.segments) expect(g.range[0]).toBeLessThanOrEqual(g.range[1]);
  });
});

describe('SHUAYB', () => {
  const keys = storyKeys(SHUAYB.events);
  const flat = (byS: Record<number, number[]>) => Object.entries(byS).flatMap(([s, ns]) => ns.map(n => `${s}:${n}`));

  it('puts no ayah in two events', () => {
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('holds every ayah that names Shuayb', () => {
    const named = flat({ 7: [85, 88, 90, 92], 11: [84, 87, 91, 94], 26: [177], 29: [36] });
    expect(named).toHaveLength(10);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('holds every ayah that names his people, Madyan or the people of the thicket', () => {
    const named = flat({ 7: [85], 9: [70], 11: [84, 95], 15: [78], 22: [44], 26: [176], 29: [36], 38: [13], 50: [14] });
    expect(named).toHaveLength(10);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });
});

// Every ayah that names the prophet (Hafs). 19:28 «يا أخت هارون» is about Maryam, so not in Harun's story; 37:130 «إل ياسين» is Ilyas.
const BRIEF = [
  { slug: 'idris', story: IDRIS, named: ['19:56', '21:85'] },
  { slug: 'nuh', story: NUH, named: ['3:33', '4:163', '6:84', '7:59', '7:69', '9:70', '10:71', '11:25', '11:32', '11:36', '11:42', '11:45', '11:46', '11:48', '11:89', '14:9', '17:3', '17:17', '19:58', '21:76', '22:42', '23:23', '25:37', '26:105', '26:106', '26:116', '29:14', '33:7', '37:75', '37:79', '38:12', '40:5', '40:31', '42:13', '50:12', '51:46', '53:52', '54:9', '57:26', '66:10', '71:1', '71:21', '71:26'] },
  { slug: 'ayyub', story: AYYUB, named: ['4:163', '6:84', '21:83', '38:41'] },
  { slug: 'harun', story: HARUN, named: ['2:248', '4:163', '6:84', '7:122', '7:142', '10:75', '19:53', '20:30', '20:70', '20:90', '20:92', '21:48', '23:45', '25:35', '26:13', '26:48', '28:34', '37:114', '37:120'] },
  { slug: 'dhul-kifl', story: DHUL_KIFL, named: ['21:85', '38:48'] },
  { slug: 'dawud', story: DAWUD, named: ['2:251', '4:163', '5:78', '6:84', '17:55', '21:78', '21:79', '27:15', '27:16', '34:10', '34:13', '38:17', '38:22', '38:24', '38:26', '38:30'] },
  { slug: 'sulayman', story: SULAYMAN, named: ['2:102', '4:163', '6:84', '21:78', '21:79', '21:81', '27:15', '27:16', '27:17', '27:18', '27:30', '27:36', '27:44', '34:12', '38:30', '38:34'] },
  { slug: 'ilyas', story: ILYAS, named: ['6:85', '37:123', '37:130'] },
  { slug: 'alyasa', story: ALYASA, named: ['6:86', '38:48'] },
  {
    slug: 'yusuf',
    story: YUSUF,
    named: ['6:84', ...[4, 7, 8, 9, 10, 11, 17, 21, 29, 46, 51, 56, 58, 69, 76, 77, 80, 84, 85, 87, 89, 90, 94, 99].map(n => `12:${n}`), '40:34'],
  },
  // Yaqub, and Israel where the ayah means him, not his children (3:93, 19:58).
  { slug: 'yaqub', story: YAQUB, named: ['2:132', '2:133', '2:136', '2:140', '3:84', '3:93', '4:163', '6:84', '11:71', '12:6', '12:38', '12:68', '19:6', '19:49', '19:58', '21:72', '29:27', '38:45'] },
];

describe.each(BRIEF)('$slug', ({ story, named }) => {
  const keys = storyKeys(story.events);

  it('puts no ayah in two events', () => {
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('holds every ayah that names him', () => {
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('keeps every range ordered', () => {
    for (const e of story.events) for (const g of e.segments) expect(g.range[0]).toBeLessThanOrEqual(g.range[1]);
  });
});

describe.each([
  { name: 'Zakariyya', story: ZAKARIYYA, named: ['3:37', '3:38', '6:85', '19:2', '19:7', '21:89'] },
  { name: 'Yahya', story: YAHYA, named: ['3:39', '6:85', '19:7', '19:12', '21:90'] },
])('$name', ({ story, named }) => {
  const keys = storyKeys(story.events);

  it('puts no ayah in two events', () => {
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('holds every ayah that names him', () => {
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });
});

const ADAM_NAMED: Record<number, number[]> = {
  2: [31, 33, 34, 35, 37],
  3: [33, 59],
  5: [27],
  7: [11, 19, 26, 27, 31, 35, 172],
  17: [61, 70],
  18: [50],
  19: [58],
  20: [115, 116, 117, 120, 121],
  36: [60],
};

const IBLIS: Record<number, number[]> = {
  2: [34],
  7: [11],
  15: [31, 32],
  17: [61],
  18: [50],
  20: [116],
  34: [20],
  38: [74, 75],
};

describe('ADAM', () => {
  const keys = storyKeys(ADAM.events);

  it('puts no ayah in two events', () => {
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('holds every ayah that names Adam', () => {
    const named = Object.entries(ADAM_NAMED).flatMap(([s, ns]) => ns.map(n => `${s}:${n}`));
    expect(named).toHaveLength(25);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('holds every ayah that names Iblis, but for its scene on the Last Day (26:95)', () => {
    const named = Object.entries(IBLIS).flatMap(([s, ns]) => ns.map(n => `${s}:${n}`));
    expect(named).toHaveLength(10);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('keeps every range ordered', () => {
    for (const e of ADAM.events) for (const g of e.segments) expect(g.range[0]).toBeLessThanOrEqual(g.range[1]);
  });
});

// Ayat that name Ibrahim, and his sons Ismail and Ishaq, whose story is told inside his.
const IBRAHIM_NAMED: Record<string, string> = {
  Ibrahim:
    '2:124 2:125 2:126 2:127 2:130 2:132 2:133 2:135 2:136 2:140 2:258 2:260 3:33 3:65 3:67 3:68 3:84 3:95 3:97 4:54 4:125 4:163 6:74 6:75 6:83 6:161 9:70 9:114 11:69 11:74 11:75 11:76 12:6 12:38 14:35 15:51 16:120 16:123 19:41 19:46 19:58 21:51 21:60 21:62 21:69 22:26 22:43 22:78 26:69 29:16 29:31 33:7 37:83 37:104 37:109 38:45 42:13 43:26 51:24 53:37 57:26 60:4 87:19',
  Ismail: '2:125 2:127 2:133 2:136 2:140 3:84 4:163 6:86 14:39 19:54 21:85 38:48',
  Ishaq: '2:133 2:136 2:140 3:84 4:163 6:84 11:71 12:6 12:38 14:39 19:49 21:72 29:27 37:112 37:113 38:45',
};
const IBRAHIM_COUNTS: Record<string, number> = { Ibrahim: 63, Ismail: 12, Ishaq: 16 };

describe('IBRAHIM', () => {
  const keys = storyKeys(IBRAHIM.events);

  it('puts no ayah in two events', () => {
    expect(new Set(keys).size).toBe(keys.length);
  });

  it.each(Object.keys(IBRAHIM_NAMED))('holds every ayah that names %s', name => {
    const named = IBRAHIM_NAMED[name].split(' ');
    expect(named).toHaveLength(IBRAHIM_COUNTS[name]);
    expect(named.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('keeps every range ordered', () => {
    for (const e of IBRAHIM.events) for (const g of e.segments) expect(g.range[0]).toBeLessThanOrEqual(g.range[1]);
  });
});

describe('STORIES', () => {
  it('gives every prophet a story', () => {
    expect(Object.keys(STORIES).sort()).toEqual(PROPHETS.map(p => p.slug).sort());
  });

  it.each(PROPHETS)('$slug puts every event in a phase, in order, and leaves no phase empty', ({ slug }) => {
    const phases = STORIES[slug].events.map(e => e.phase);
    expect(phases).toEqual([...phases].sort((a, b) => a - b));
    expect([...new Set(phases)]).toEqual(STORIES[slug].phases.map((_, i) => i));
  });
});
