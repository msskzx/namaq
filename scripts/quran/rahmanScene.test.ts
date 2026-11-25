import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import words from '../../shared/data/quran/words.json';
import { plainText } from '../../shared/sahih';
import { normalizeWord } from '../../shared/quran/normalize';
import {
  FATIHA_HADITH, MERCY_HADITH, rahmanSections, MERCY_KEPT, MERCY_PARTS, TIKRAR_FIRST, TIKRAR_RUNS, kirmaniOn, tikrarWords, SCENE_HADITH, SCENE_HADITH_BY_ID, basmalasBySurah, isName, nameRuns, placeCount, rahmanPlaces, sceneHadithNumbers,
  type SahihBookSlug,
} from '../../shared/quran/scenes/rahman';
import type { WordsData } from '../../shared/quran/words';
import { OUT, buildRahmanHadith, sahihBook } from './rahmanScene';

const built = JSON.parse(readFileSync(OUT, 'utf8')) as ReturnType<typeof buildRahmanHadith>;

describe('the «الرحمن» scene', () => {
  it('ships the hadith words as the Sahih text gives them today (npm run quran:rahman-scene)', () => {
    expect(built).toEqual(buildRahmanHadith());
  });

  it('names «الرحمن» on every hadith page; the hundred mercies alone were asked for by name', () => {
    for (const hadith of [FATIHA_HADITH, ...SCENE_HADITH]) {
      expect(nameRuns(built[hadith.id].text).some(run => run.name), hadith.id).toBe(true);
    }
    expect(plainText(built[MERCY_HADITH.id].text)).toContain('الرحمه مائه جزء');
  });

  it('leaves out no hadith of the Sahihayn whose words name «الرحمن» outside a basmala (Muslim 399 prints «الرحم» for «الرحيم»)', () => {
    const named: string[] = [];
    for (const book of ['bukhari', 'muslim'] as SahihBookSlug[]) {
      for (const file of sahihBook(book).kitabs) {
        for (const hadith of file.hadith) {
          const text = hadith.routes.map(route => route.text.slice(route.isnadEnd ?? 0)).join(' ');
          const plain = plainText(text).replace(/بسم الله الرحمن/g, ' ').split(' ');
          if (plain.some((word, i) => isName(word, plain[i - 1]))) named.push(`${book} ${hadith.n}`);
        }
      }
    }
    expect(sceneHadithNumbers().map(ref => `${ref.book} ${ref.n}`).sort()).toEqual(named.sort());
  });

  it('counts the name where the corpus writes it, and a basmala over every surah but at-Tawba, two in an-Naml', () => {
    const places = rahmanPlaces(words as unknown as WordsData);
    expect(placeCount(places)).toBe(places.flatMap(place => place.words).length);
    expect(places.some(place => place.key === '1:1')).toBe(true);
    expect(places.find(place => place.key === '25:60')?.words.length).toBe(2);
    const basmalas = basmalasBySurah();
    expect(basmalas.filter(n => n === 0)).toHaveLength(1);
    expect(basmalas.reduce((sum, n) => sum + n, 0)).toBe(basmalas.length);
  });

  it('lights every hadith\'s `lit` words where its page shows them (owner, 2026-11-25: «أثنى علي عبدي»)', () => {
    const lit = Object.values(SCENE_HADITH_BY_ID).filter(hadith => hadith.lit);
    expect(lit.length).toBeGreaterThan(0);
    for (const hadith of lit) {
      const runs = nameRuns(built[hadith.id].text, hadith.lit).filter(run => run.lit);
      expect(runs, hadith.id).toHaveLength(hadith.lit!.split(' ').length);
    }
  });

  it('colours the name, not «عبد الرحمن»', () => {
    expect(isName('الرَّحْمَنِ')).toBe(true);
    expect(isName('لِلرَّحْمَنِ')).toBe(true);
    expect(isName('الرَّحْمَنِ', 'عَبْدُ')).toBe(false);
    expect(isName('الرَّحْمَنِ', 'عُبَيْدِ')).toBe(false);
  });

  it('draws the hundred mercies as the hadith counts them (owner, 2026-11-25: sketch B)', () => {
    const text = plainText(built[MERCY_HADITH.id].text);
    expect(text).toContain('مائه جزء');
    expect(text).toContain('تسعه وتسعين جزءا');
    expect([MERCY_PARTS, MERCY_KEPT]).toEqual([100, 99]);
  });

  it('draws al-Kirmani\'s four runs of «فبأي آلاء ربكما تكذبان» in his words, covering every place he counts', () => {
    const plain = (text: string) => text.split(/\s+/).map(word => normalizeWord(word).replace(/[^ء-ي]/g, '')).join(' ');
    const citation = kirmaniOn(TIKRAR_FIRST);
    const NUMBER = { 7: 'سبعه', 8: 'ثمانيه' } as const;
    const quote = plain(citation.quote);
    let from = 0;
    for (const run of TIKRAR_RUNS) {
      const words = plain(tikrarWords(run));
      const at = quote.indexOf(words, from);
      expect(at, words).toBeGreaterThan(from - 1);
      // His count for the run is the number word nearest before or after its words.
      const near = quote.slice(Math.max(0, at - 40), at + words.length + 40);
      expect(near, words).toContain(NUMBER[run.count]);
      from = at;
    }
    expect(TIKRAR_RUNS.reduce((sum, run) => sum + run.count, 0)).toBe(citation.places.length);
  });

  it('shows every ayah of the introduction again inside the scene (owner, 2026-11-25: «تأكد من ذكرها في المشهد»)', () => {
    const sections = rahmanSections(rahmanPlaces(words as unknown as WordsData).map(place => place.key));
    const keysOf = (intro: boolean) => new Set(sections.filter(section => !!section.intro === intro).flatMap(section => section.blocks.flatMap(block =>
      block.kind === 'ayah' ? [block.key] : block.kind === 'run' ? block.keys : [])));
    const inScene = keysOf(false);
    const introKeys = [...keysOf(true)];
    expect(introKeys.length).toBeGreaterThan(0);
    expect(introKeys.filter(key => !inScene.has(key))).toEqual([]);
  });
});
