import { describe, expect, it } from 'vitest';
import { cleanPage, litSentences, markQuran, sentences } from './kashshaf';
import { skeleton } from './irabUkbari';
import { BALAGHA_DEVICES } from '../../shared/quran/kashshaf';

const device = (name: (typeof BALAGHA_DEVICES)[number]) => BALAGHA_DEVICES.indexOf(name);
const quran = new Set(['وَاشْتَعَلَ', 'الرَّأْسُ', 'شَيْباً', 'الْجِبَالُ'].map(skeleton));
const maryam4 = ['قَالَ', 'رَبِّ', 'إِنِّي', 'وَهَنَ', 'ٱلۡعَظۡمُ', 'مِنِّي', 'وَٱشۡتَعَلَ', 'ٱلرَّأۡسُ', 'شَيۡبࣰا'];
const words = (key: string) => (key === '19:4' ? maryam4 : []);

describe("al-Kashshaf's pages", () => {
  it('drops the marginal works and their marks, and keeps a verse of poetry on its own line', () => {
    const page = "<p>قال«١» كذا.</p><table class='poem'><tr><td>صدر</td><td>عجز</td></tr></table><div class=\"foot-notes\">(١) حاشية</div>";
    const text = cleanPage(page);
    expect(text).not.toContain('حاشية');
    expect(text).not.toContain('«١»');
    expect(text).toMatch(/\nصدر\s+عجز\n/);
  });

  it('marks the vocalized Quran he quotes, and leaves a vocalized word outside the Quran as prose', () => {
    expect(markQuran('شبه الشيب بشواظ النار في قوله وَاشْتَعَلَ الرَّأْسُ شَيْباً ثم', quran)).toContain('﴿وَاشْتَعَلَ الرَّأْسُ شَيْباً﴾');
    expect(markQuran('قالوا: أَسْرَعُ مِنْ نِكَاحِ أُمِّ خَارِجَةَ', quran)).not.toContain('﴿');
  });

  it('cuts sentences at his stops and question marks', () => {
    const text = 'أولى. فإن قلت: لم؟ قلت: لأن';
    expect(sentences(text).map(([a, b]) => text.slice(a, b))).toEqual(['أولى.', 'فإن قلت: لم؟', 'قلت: لأن']);
  });
});

describe('the lit sentences', () => {
  const passage = { surah: 19, from: 2, to: 6, text: 'شبه الشيب بشواظ النار في بياضه، ثم أخرجه مخرج الاستعارة في ﴿وَاشْتَعَلَ الرَّأْسُ شَيْباً﴾. وهذا كلام آخر.' };

  it('lights a sentence that names a device in his words, with the ayah words it quotes', () => {
    const lit = litSentences(passage, words);
    expect(lit.map(l => l[2]).sort()).toEqual([device('الاستعارة'), device('التشبيه')].sort());
    expect(lit[0].slice(3)).toEqual([4, 6, 8]);
    expect(passage.text.slice(lit[0][0], lit[0][1])).toMatch(/^شبه.*\.$/);
  });

  it('leaves grammar\'s «كاف التشبيه», a word inside a Quran quote, and a listed sentence unlit', () => {
    expect(litSentences({ ...passage, text: 'والكاف كاف التشبيه.' }, words)).toEqual([]);
    expect(litSentences({ ...passage, text: 'وقوله ﴿مَجَازاً﴾ هنا.' }, words)).toEqual([]);
    expect(litSentences({ ...passage, text: 'وهو تكرير الدرس.' }, words, [{ key: '19:2', contains: 'تكرير الدرس', why: 'study' }])).toEqual([]);
  });

  it('places nothing when the quote is not in the passage\'s ayat', () => {
    const lit = litSentences({ ...passage, text: 'وهذا تمثيل لقوله ﴿الْجِبَالُ﴾.' }, words);
    expect(lit).toEqual([[0, lit[0][1], device('التمثيل'), 0, -1, -1]]);
  });
});
