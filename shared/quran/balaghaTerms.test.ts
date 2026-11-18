import { describe, expect, it } from 'vitest';
import terms from '../data/quran/balaghaTerms';
import itqan from '../data/quran/itqanBalagha';
import { itqanAt } from './itqanBalagha';
import { exampleWords, termOfParagraph, plainName, searchTerms, termCredit, termExamples, termNamed, termOf, termPage, termsByChapter } from './balaghaTerms';

describe('balagha terms', () => {
  it('holds a term for every heading the balagha cards use, each with words quoted from a book', () => {
    const used = new Set(itqan.entries.map(([kind, heading]) => termOf(kind, heading)).filter(Boolean));
    expect(new Set(terms.terms.map(term => term.name))).toEqual(used);
    for (const term of terms.terms) expect(term.quotes.length).toBeGreaterThan(0);
  });

  it('names a headless paragraph by its chapter, mends his print slips and leaves out a heading that names no device', () => {
    expect(termOf(53, '')).toBe('التَّشْبِيهُ وَالِاسْتِعَارَةُ');
    expect(termOf(56, 'الإطناب الزيادة')).toBe('الإطناب بالزيادة');
    expect(termOf(52, 'الْأَعْلَامُ')).toBeNull();
    expect(termOf(58, '')).toBeNull();
  });

  it("quotes al-Suyuti's definition of jinas, with its page", () => {
    const jinas = termNamed(terms, 'الجناس');
    expect(jinas?.defines).toBe(true);
    expect(jinas?.quotes[0].text.startsWith('هُوَ تَشَابُهُ اللَّفْظَيْنِ فِي اللَّفْظِ')).toBe(true);
    expect(jinas && termCredit(jinas.quotes[0])).toBe('الإتقان للسيوطي ٣/٣١٠');
    expect(jinas && termPage(jinas.quotes[0])).toBe('https://shamela.ws/book/11728/1074');
  });

  it("gives al-Qazwini's words first where al-Suyuti does not define the device", () => {
    const term = termNamed(terms, 'تأكيد المدح بما يشبه الذم');
    expect(term?.quotes[0].book).toBe('talkhis');
    expect(term && termCredit(term.quotes[0])).toBe('تلخيص المفتاح للقزويني، في عروس الأفراح ٢/٢٦٩');
    expect(term?.quotes.at(-1)?.book).toBe('itqan');
  });

  it('lists the ayat of al-Qiyama 29 and 30 under jinas, with the quoted words', () => {
    const examples = termExamples(itqan, 'الْجِنَاسُ');
    const naqis = examples.find(example => example.ayat.includes('75:29'));
    expect(naqis?.ayat).toEqual(['75:29', '75:30']);
    expect(naqis && exampleWords(itqan, naqis, '75:29').length).toBeGreaterThan(0);
  });

  it("names the term of each paragraph in the reader's sheet", () => {
    expect(itqanAt(itqan, '75:29').map(paragraph => termOfParagraph(itqan, paragraph))).toContain('الْجِنَاسُ');
  });

  it('groups by chapter in the book order and finds a term by its plain name', () => {
    expect(termsByChapter(terms).map(([kind]) => kind)).toEqual([52, 53, 54, 55, 56, 57, 58]);
    expect(plainName('الْجِنَاسُ')).toBe('الجناس');
    expect(searchTerms(terms, 'الجمع').map(term => plainName(term.name))).toContain('الجمع والتفريق');
  });
});
