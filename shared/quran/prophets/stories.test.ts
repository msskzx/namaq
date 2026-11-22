import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pageAyat } from '../branches';
import { normalizeWord } from '../normalize';
import type { MushafPage } from '../readerPage';
import { PROPHETS, prophetName } from '.';
import { STORIES } from './stories';
import { storyKeys } from './story';

const mushaf: MushafPage[] = Array.from({ length: 604 }, (_, i) =>
  JSON.parse(readFileSync(join(__dirname, '../../data/quran/mushaf', `${i + 1}.json`), 'utf8')),
);
const ayahWords = pageAyat(mushaf).map(ayah => ({ key: ayah.key, words: ayah.words.flatMap(word => word.split(/\s+/)).map(normalizeWord) }));

/** Ayat holding one of these words (as normalizeWord spells them), alone or after و/ف and then ب/ل/ك or the vocative يا. */
const ayatNaming = (forms: readonly string[]) =>
  ayahWords
    .filter(({ words }) => words.some(word => forms.includes(word) || forms.includes(word.replace(/^[وف]/, '')) || forms.includes(word.replace(/^[وف]?[بلكي]/, ''))))
    .map(({ key }) => key);

/**
 * What every ayah naming a prophet (Hafs) has to sit in his story: the words
 * that name him, or the people or person whose story is told inside his, found
 * in the Quran text; `also`, ayat that tell of him by another name, or whose
 * name is also an ordinary word (هود «Jews», صالح «righteous», يحيى «gives
 * life», عاد «transgressing») and so are listed by hand; `elsewhere`, ayat the
 * words find that belong to another story, each with its reason.
 */
const NAMED: Record<string, { words: string[]; also?: string[]; elsewhere?: Record<string, string> }> = {
  adam: { words: ['ءادم', 'ادم', 'ابليس'], elsewhere: { '26:95': 'the hosts of Iblis on the Last Day' } },
  idris: { words: ['ادريس'] },
  nuh: { words: ['نوح', 'نوحا'] },
  hud: {
    words: [],
    also: [
      // Hud
      '7:65', '11:50', '11:53', '11:58', '11:60', '11:89', '26:124',
      // Aad
      '9:70', '11:59', '14:9', '22:42', '25:38', '26:123', '29:38', '38:12', '40:31', '41:13', '41:15', '46:21', '50:13',
      '51:41', '53:50', '54:18', '69:4', '69:6', '89:6',
    ],
  },
  salih: {
    words: ['ثمود', 'ثمودا'],
    // Salih by name, and the people of al-Hijr (15:80).
    also: ['7:73', '7:75', '7:77', '11:61', '11:62', '11:66', '11:89', '26:142', '27:45', '15:80'],
  },
  // His sons Ismail and Ishaq, whose stories are told inside his.
  ibrahim: { words: ['ابرهيم', 'ابرهم', 'اسمعيل', 'اسحق'] },
  // And the overturned towns of his people.
  lut: { words: ['لوط', 'لوطا'], also: ['9:70', '53:53', '69:9'] },
  shuayb: {
    words: ['شعيب', 'شعيبا', 'مدين', 'الايكه', 'ليكه'],
    elsewhere: { '20:40': 'Musa in Madyan', '28:22': 'Musa in Madyan', '28:23': 'Musa in Madyan', '28:45': 'Musa in Madyan' },
  },
  // Israel, where the ayah means him and not his children.
  yaqub: { words: ['يعقوب'], also: ['3:93', '19:58'] },
  yusuf: { words: ['يوسف'] },
  ayyub: { words: ['ايوب'] },
  'dhul-kifl': { words: ['الكفل'] },
  // Dhu al-Nun (21:87), the companion of the whale (68:48), and the whole telling in al-Saffat.
  yunus: { words: ['يونس'], also: ['21:87', '21:88', '68:48', '68:49', '68:50', ...Array.from({ length: 10 }, (_, i) => `37:${139 + i}`)] },
  musa: { words: ['موسي', 'فرعون', 'همن'] },
  harun: { words: ['هرون'], elsewhere: { '19:28': '«يا أخت هارون» is said to Maryam' } },
  // «إل ياسين» (37:130).
  ilyas: { words: ['الياس'], also: ['37:130'] },
  alyasa: { words: ['اليسع'] },
  dawud: { words: ['داود'] },
  sulayman: { words: ['سليمن'] },
  zakariyya: { words: ['زكريا'] },
  yahya: { words: [], also: ['3:39', '6:85', '19:7', '19:12', '21:90'] },
  // Named عيسى, المسيح or ابن مريم; Maryam's story is told inside his.
  isa: { words: ['عيسي', 'المسيح', 'مريم'] },
  muhammad: { words: ['محمد'] },
};

describe('PROPHETS', () => {
  it('names each prophet with «عليه السلام», and the Prophet Muhammad with ﷺ', () => {
    expect(PROPHETS.map(prophetName)[0]).toBe('آدم عليه السلام');
    expect(prophetName(PROPHETS[PROPHETS.length - 1])).toBe('محمد ﷺ');
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

  it.each(PROPHETS)('$slug keeps every range ordered and puts no ayah in two events', ({ slug }) => {
    const { events } = STORIES[slug];
    for (const e of events) for (const g of e.segments) expect(g.range[0]).toBeLessThanOrEqual(g.range[1]);
    const keys = storyKeys(events);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it.each(PROPHETS)('$slug holds every ayah that names him', ({ slug }) => {
    const { words, also = [], elsewhere = {} } = NAMED[slug];
    const keys = new Set(storyKeys(STORIES[slug].events));
    const named = [...ayatNaming(words).filter(key => !(key in elsewhere)), ...also];

    expect(named.length).toBeGreaterThan(0);
    expect(named.filter(key => !keys.has(key))).toEqual([]);
  });

  it('leaves the name Ahmad to Isa, who gives the good news of him', () => {
    expect(storyKeys(STORIES.muhammad.events)).not.toContain('61:6');
    expect(storyKeys(STORIES.isa.events)).toContain('61:6');
  });
});
