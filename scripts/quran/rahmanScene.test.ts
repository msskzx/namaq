import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import words from '../../shared/data/quran/words.json';
import { plainText } from '../../shared/sahih';
import {
  FATIHA_HADITH, MERCY_HADITH, SCENE_HADITH, basmalasBySurah, isName, nameRuns, placeCount, rahmanPlaces, sceneHadithNumbers,
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

  it('colours the name, not «عبد الرحمن»', () => {
    expect(isName('الرَّحْمَنِ')).toBe(true);
    expect(isName('لِلرَّحْمَنِ')).toBe(true);
    expect(isName('الرَّحْمَنِ', 'عَبْدُ')).toBe(false);
    expect(isName('الرَّحْمَنِ', 'عُبَيْدِ')).toBe(false);
  });
});
