import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import bukhariIndex from './data/hadith/bukhari.json';
import muslimIndex from './data/hadith/muslim.json';
import { findHadith, kitabsHolding, leadIn, placeOf, plainText, searchSahih, type SahihIndex, type SahihText } from './sahih';
import { sahihKitabQuestions } from './quiz/sahih';
import { seededRandom } from './quiz/feedQuiz';

const index = bukhariIndex as SahihIndex;
const text = JSON.parse(readFileSync(join(__dirname, '../data/hadith/sahih/bukhari.json'), 'utf8')) as SahihText;

describe('the Sahihayn', () => {
  it('opens a number Abd al-Baqi gives a record printed under another to that record', () => {
    const record = text.kitabs.flatMap(file => file.hadith).find(hadith => hadith.also?.length)!;
    expect(findHadith(text, record.also![0])?.hadith).toBe(record);
  });

  it('places al-Bukhari\'s first hadith in «بدء الوحي»', () => {
    expect(placeOf(index, 1)?.kitab.title).toBe('بدء الوحي');
  });

  it('finds a hadith by its words typed without marks or hamzas', () => {
    const { hadith } = searchSahih([{ index, text }], 'انما الاعمال بالنيات');
    expect(hadith.map(hit => hit.n)).toContain(1);
  });

  it('finds a bab heading typed without marks, and only babs whose kitab and heading hold every word', () => {
    const { babs } = searchSahih([{ index }], 'فضل الوضوء');
    expect(babs.length).toBeGreaterThan(0);
    for (const hit of babs) {
      const kitab = index.kitabs.find(each => each.n === hit.kitab)!;
      const words = `${kitab.title} ${kitab.babs[hit.bab!].title}`.replace(/[ً-ْ]/g, '');
      expect(words).toMatch(/فضل/);
      expect(words).toMatch(/الوضوء/);
    }
  });
});

describe('a book page\'s search', () => {
  it('lists a kitab whose name holds the words alone, and under any other kitab only the bab headings that hold them', () => {
    const found = kitabsHolding(index, 'الحيض');
    const named = index.kitabs.filter(kitab => plainText(kitab.title).includes('الحيض'));
    expect(named.length).toBeGreaterThan(0);
    for (const kitab of named) expect(found.get(kitab.n)).toEqual([]);
    const others = [...found].filter(([n]) => !named.some(kitab => kitab.n === n));
    expect(others.length).toBeGreaterThan(0);
    for (const [n, babs] of others) {
      expect(babs.length).toBeGreaterThan(0);
      const kitab = index.kitabs.find(each => each.n === n)!;
      for (const at of babs) expect(plainText(kitab.babs[at].title)).toContain('الحيض');
    }
  });
});

describe('«في أيّ كتاب؟»', () => {
  const bare = (text: string) => text.replace(/[ً-ْٰ]/g, '').replace(/[أإآ]/g, 'ا').replace(/[.،]+$/, '').trim();
  const books = { bukhari: index, muslim: muslimIndex as SahihIndex };
  const questions = sahihKitabQuestions(seededRandom(3));

  it('the right kitab holds the bab, and no wrong one holds a bab of the same heading, in both books', () => {
    expect(questions.some(each => each.key.includes(':muslim:'))).toBe(true);
    for (const question of questions) {
      const [, slug, kitabN, babAt] = question.key.split(':');
      const book = books[slug as keyof typeof books];
      const kitab = book.kitabs.find(each => each.n === Number(kitabN))!;
      const heading = kitab.babs[Number(babAt)].title;
      expect(question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic).toBe(kitab.title.replace(/[ً-ْٰ]/g, '').replace(/[.،]+$/, '').trim());
      // Matched with their hamzas: Muslim has «كتاب الإيمان» and «كتاب الأيمان» (oaths).
      const label = (title: string) => title.replace(/[ً-ْٰ]/g, '').replace(/[.،]+$/, '').trim();
      const wrong = question.choices.filter(choice => choice.value !== question.correctAnswer).map(choice => book.kitabs.find(each => label(each.title) === choice.labelArabic)!);
      for (const other of wrong) expect(other.babs.some(bab => bare(bab.title) === bare(heading)), `${heading} in ${other.title}`).toBe(false);
    }
  });

  it('never shows a heading that holds a word of the right kitab\'s name («باب فضل الوضوء» under «كتاب الوضوء»)', () => {
    for (const question of questions) {
      const right = bare(question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic);
      const heading = bare(question.promptArabic.split('\n')[0]);
      const subject = right.split(' ').map(word => word.replace(/^(?:و?ال)/, '').replace(/ة$/, '')).filter(word => word.length >= 3 && !['كتاب', 'باب', 'ابواب', 'وغيرها', 'رضي', 'الله', 'تعالى', 'عنهم'].includes(word));
      for (const word of subject) expect(heading.includes(word), `${heading} / ${right}`).toBe(false);
    }
  });
});

describe('the words between the chain and the saying', () => {
  const umar = { name: 'عُمَرَ بْنَ الْخَطَّابِ', mode: 'سَمِعْتُ' };
  it("keeps what the narrator tells in the text, and the Prophet ﷺ named before his words apart", () => {
    const chain = 'أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ، يَقُولُ: سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ  رضي الله عنه عَلَى الْمِنْبَرِ، قَالَ: سَمِعْتُ رَسُولَ اللهِ ﷺ، يَقُولُ: ';
    expect(leadIn(chain, umar)).toEqual({ lead: 'سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ  رضي الله عنه عَلَى الْمِنْبَرِ، قَالَ:', prophet: 'سَمِعْتُ رَسُولَ اللهِ ﷺ، يَقُولُ:' });
  });
  it('names him after the narrator with no clause between', () => {
    expect(leadIn('عَنْ عُمَرَ: أَنَّ رَسُولَ اللهِ ﷺ قَالَ: ', { name: 'عُمَرَ', mode: 'عَنْ' })).toEqual({ lead: '', prophet: 'أَنَّ رَسُولَ اللهِ ﷺ قَالَ:' });
    expect(leadIn('عَنْ أَبِي هُرَيْرَةَ، عَنِ النَّبِيِّ ﷺ قَالَ: ', { name: 'أَبِي هُرَيْرَةَ', mode: 'عَنْ' })).toEqual({ lead: '', prophet: 'عَنِ النَّبِيِّ ﷺ قَالَ:' });
  });
  it('keeps the narrator\'s last vowel, «رضي الله عنه» and his own «قَالَ» with him when no clause mark follows his name', () => {
    expect(leadIn('عَنْ أَبِي هُرَيْرَةَ  رضي الله عنه عَنِ النَّبِيِّ ﷺ قَالَ: ', { name: 'أَبِي هُرَيْرَةَ', mode: 'عَنْ' })).toEqual({ lead: '', prophet: 'عَنِ النَّبِيِّ ﷺ قَالَ:' });
    expect(leadIn('عَنْ أَبِي مَسْعُودٍ قَالَ قَالَ النَّبِيُّ ﷺ: ', { name: 'أَبِي مَسْعُودٍ', mode: 'عَنْ' })).toEqual({ lead: '', prophet: 'قَالَ النَّبِيُّ ﷺ:' });
  });
  it('never gives a narrator\'s own words to the Prophet ﷺ', () => {
    const aisha = { name: 'عَائِشَةَ', mode: 'عَنْ' };
    expect(leadIn('عَنْ عَائِشَةَ زَوْجِ النَّبِيِّ ﷺ قَالَتْ: ', aisha).prophet).toBeUndefined();
    expect(leadIn('عَنْ أَبِي بَكْرَةَ: ذُكِرَ النَّبِيُّ ﷺ قَالَ: ', { name: 'أَبِي بَكْرَةَ', mode: 'عَنْ' }).prophet).toBeUndefined();
  });
  it('drops a lead that only names the narrator again, the line saying it already', () => {
    expect(leadIn('عَنْ أَنَسٍ رضي الله عنه قَالَ: ', { name: 'أَنَسٍ', mode: 'عَنْ' })).toEqual({ lead: '' });
  });
  it('leaves words that are not his as the narrator\'s', () => {
    const story = 'عَنْ أَبِي هُرَيْرَةَ قَالَ: كَانَ النَّبِيُّ ﷺ بَارِزًا يَوْمًا لِلنَّاسِ، فَأَتَاهُ جِبْرِيلُ فَقَالَ: ';
    expect(leadIn(story, { name: 'أَبِي هُرَيْرَةَ', mode: 'عَنْ' })).toEqual({ lead: story.trim() });
  });
});
