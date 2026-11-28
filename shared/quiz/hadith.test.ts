import { describe, expect, it } from 'vitest';
import fortyData from '../data/hadith/forty.json';
import rajabData from '../data/hadith/ibnRajab.json';
import { rajabFeedPassages, rajabOpening, recordName, sayingStart, type AppForty, type RajabChapter } from '../hadith';
import { num } from '../quran/arabicNumber';
import { bookQuestions, chainQuestions, completeQuestions, namedBooks, narratorQuestions, narratorWitness, recordSource } from './hadith';

const FORTY = fortyData as AppForty;
const RAJAB = rajabData as RajabChapter[];
const narrator = narratorQuestions(() => 0.42);
const complete = completeQuestions(() => 0.42);
const right = (question: (typeof narrator)[number]) => question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic;
const bare = (text: string) => text.replace(/[ً-ْٰ]/g, '');

describe('the Forty as al-Nawawi printed them', () => {
  it('holds all forty-two, then the eight Ibn Rajab adds, and every record starts with its own number on the page it cites', () => {
    expect(FORTY.entries.map(entry => entry.n)).toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
    expect(FORTY.entries.filter(entry => entry.source === 'ibnrajab').map(entry => entry.n)).toEqual([43, 44, 45, 46, 47, 48, 49, 50]);
    for (const record of FORTY.entries.flatMap(entry => entry.records)) {
      expect(record.pages).toEqual([...record.pages].sort((a, b) => a - b));
      if (record.isnadEnd) expect(record.isnadEnd).toBeLessThan(record.text.length);
    }
  });
});

describe('the hadith pages', () => {
  it('leads no. 9 with route ١٣٠ of Muslim 1337, al-Nawawi\'s wording, before the Hajj sermon', () => {
    expect(FORTY.entries[8].records.filter(record => record.book === 'muslim').map(record => record.route)).toEqual(['١٣٠', '١٣٠ م', '١٣١', '٤١٢']);
  });

  it('starts every preview on a whole word after the opening «عن فلان رضي الله عنه»', () => {
    for (const entry of FORTY.entries) expect(bare(sayingStart(entry.text))).toMatch(/^(?:سمعت|بينما|حدثنا|قال|أن|حفظت|خادم|عن|كنت|قلت|وعظنا|أخذ)\s/);
  });

  it('carries the corrected wording of the digital transcription', () => {
    const text = FORTY.entries.map(entry => entry.text).join(' ');
    for (const slip of ['يقوم: من رأى', 'اسكترهوا', 'غفرت للك', 'الخشبي', 'مانهيتكم', 'صلى الله وعليه', 'تعالى وعليه']) expect(text).not.toContain(slip);
  });
});

describe('the hadith quizzes', () => {
  it('asks four different choices with one right, and names the source under them', () => {
    expect(narrator.length).toBeGreaterThan(0);
    expect(complete.length).toBeGreaterThan(0);
    for (const question of [...narrator, ...complete]) {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices.map(choice => bare(choice.labelArabic))).size).toBe(4);
      expect(question.sources[0].book).toBe('صحيح البخاري');
      expect(['الأربعون النووية', 'جامع العلوم والحكم']).toContain(question.sources[1].book);
    }
  });

  it('asks the Companion with the right one from the entry, and never a saying that names him', () => {
    for (const question of narrator) {
      const n = Number(question.key.split(':')[1]);
      const entry = FORTY.entries.find(item => item.records.some(record => record.book === 'bukhari' && record.number === n))!;
      expect(right(question)).toBe(entry.companion);
      expect(bare(question.promptArabic)).not.toContain(bare(entry.companion));
      for (const other of entry.alsoFrom ?? []) expect(question.choices.map(choice => choice.labelArabic)).not.toContain(other);
      for (const choice of question.choices) {
        const his = FORTY.entries.flatMap(item => (bare(item.companion) === bare(choice.labelArabic) ? item.records.filter(record => record.book === 'bukhari').map(record => ({ item, record })) : []));
        const line = question.whereOf?.[choice.value] ?? '';
        const numbers = line.replace(/^راوي (?:الحديث|الأحاديث) /, '').replace(/ من الأربعين$/, '').split('، ');
        expect(numbers.length, line).toBeGreaterThan(0);
        for (const n of numbers) {
          const held = his.filter(({ item }) => num(item.n) === n);
          expect(held.length, `${choice.labelArabic}: ${n}`).toBeGreaterThan(0);
          expect(held.some(({ record }) => question.sources.some(source => JSON.stringify(source) === JSON.stringify(recordSource(record))))).toBe(true);
        }
      }
    }
  });

  it('hides the last words of the saying, and every wrong ending is named from another record', () => {
    for (const question of complete) {
      expect(question.promptArabic.endsWith('…»')).toBe(true);
      expect(bare(question.promptArabic)).not.toContain(bare(right(question)));
      for (const choice of question.choices.filter(item => item.value !== question.correctAnswer)) {
        const line = question.whereOf?.[choice.value];
        const record = FORTY.entries.flatMap(entry => entry.records).find(each => line === `آخر ${recordName(each, num)}`);
        expect(record, choice.labelArabic).toBeDefined();
        expect(question.sources).toContainEqual(recordSource(record!));
      }
    }
  });
});

describe('the hadith outside the Sahihayn', () => {
  const outside = [11, 12, 18, 19, 27, 28, 29, 30, 31, 32, 33, 39, 41, 42].map(n => FORTY.entries[n - 1]);

  it('gives every one its scholars\' grades, al-Nawawi\'s first and Ibn Rajab\'s last, each with its page', () => {
    for (const entry of outside) {
      const grades = entry.grades!;
      expect(grades[0].by).toBe('النووي');
      expect(entry.text).toContain(grades[0].quote);
      expect(grades[grades.length - 1].by).toBe('ابن رجب');
      for (const grade of grades) expect(grade.pages.length).toBeGreaterThan(0);
    }
  });

  it('quotes a compiler\'s grade from his own record', () => {
    for (const entry of outside) for (const grade of entry.grades!.filter(item => item.number)) {
      expect(entry.records.find(record => record.book === grade.book && record.number === grade.number)!.text).toContain(grade.quote);
    }
  });

  it('has a record for each but no. 41, whose book (al-Hujja) is not at hand', () => {
    for (const entry of outside) expect(entry.records.length > 0).toBe(entry.n !== 41);
  });

  it('shows Ibn Majah\'s «لا ضرر» under the Companions he has it from, since Ibn Rajab says he has no Abu Sa\'id route', () => {
    expect(FORTY.entries[31].records.filter(record => record.book === 'ibnmajah').map(record => record.from)).toEqual(['عبادة بن الصامت', 'ابن عباس']);
  });
});

describe('Ibn Rajab on the Forty', () => {
  it('has a chapter for each of the fifty, opening on the hadith it explains', () => {
    expect(RAJAB.map(chapter => chapter.n)).toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
    expect(RAJAB[18].paragraphs.some(paragraph => paragraph.text.includes('احفَظِ الله يَحفَظْكَ'))).toBe(true);
    for (const chapter of RAJAB) {
      const opening = rajabOpening(chapter);
      expect(opening.length).toBeGreaterThan(0);
      expect(opening[opening.length - 1].text).not.toMatch(/:\s*$/);
      expect(bare(opening[0].text)).not.toMatch(/^و?هذا الحديث (?:خرج|رواه)/);
    }
  });

  it('keeps his words only: no footnote marks or editors\' notes', () => {
    const all = RAJAB.flatMap(chapter => chapter.paragraphs.map(paragraph => paragraph.text)).join('\n');
    expect(all).not.toMatch(/\(\^[٠-٩]+\)|_{5}/);
  });

  it('takes the feed\'s passages only from hadith al-Nawawi took whole from the Sahihayn', () => {
    const passages = rajabFeedPassages(RAJAB, FORTY.entries);
    expect(passages.length).toBeGreaterThan(0);
    for (const { chapter, passage } of passages) {
      expect(passage[passage.length - 1].text).not.toMatch(/:\s*$/);
      expect(FORTY.entries[chapter.n - 1].records.every(record => record.book === 'bukhari' || record.book === 'muslim')).toBe(true);
    }
  });
});

describe('«من أخرجه؟»', () => {
  const questions = bookQuestions(() => 0.42);

  it('asks al-Nawawi\'s citation, with other entries\' citations as the wrong choices', () => {
    expect(questions.length).toBeGreaterThan(0);
    for (const question of questions) {
      const entry = FORTY.entries[Number(question.key.split(':')[1]) - 1];
      expect(right(question)).toBe(namedBooks(entry.named));
      expect(new Set(question.choices.map(choice => choice.labelArabic)).size).toBe(4);
      expect(question.promptArabic).not.toMatch(/رواه|رويناه/);
      for (const choice of question.choices.filter(item => item.value !== question.correctAnswer)) {
        for (const book of entry.named) expect(choice.labelArabic.split(/،\s*|\sو/)).not.toContain(book);
      }
    }
  });

  it('carries only the Sahihayn and what a named scholar graded sahih, undisputed, and no «وغيره» citation', () => {
    const asked = new Set(questions.map(question => Number(question.key.split(':')[1])));
    for (const n of [12, 31, 39, 42]) expect(asked.has(n)).toBe(false);
    for (const n of [11, 18, 28, 29]) {
      expect(asked.has(n)).toBe(true);
      expect(FORTY.entries[n - 1].grades!.some(grade => grade.by === 'الترمذي' && bare(grade.quote).includes('صحيح'))).toBe(true);
    }
  });
});

describe('ابحث عن الجواب', () => {
  it('looks a hadith up in the Forty, the asked one marked for after the answer', () => {
    const forty = (fortyData as AppForty).entries;
    for (const question of [...narratorQuestions(() => 0.3), ...completeQuestions(() => 0.3)]) {
      const look = question.look as { view: string; mark: number };
      expect(look.view).toBe('hadith');
      expect(forty.some(entry => entry.n === look.mark && entry.records.some(record => question.key.endsWith(`:${record.number}`)))).toBe(true);
    }
    for (const question of bookQuestions(() => 0.3)) expect(question.look).toEqual({ view: 'hadith', mark: Number(question.key.split(':')[1]) });
  });
});

describe('the eight Ibn Rajab adds (43–50)', () => {
  const added = FORTY.entries.filter(entry => entry.source === 'ibnrajab');

  it('names only the books he names, at the head of his chapter or in the «وخرَّجه…» right after it', () => {
    for (const entry of added) {
      const text = bare(entry.text);
      const next = bare(RAJAB[entry.n - 1].paragraphs[1].text);
      const citation = text.slice(Math.max(text.lastIndexOf('خرجه'), text.lastIndexOf('رواه'))) + (/^وخرجه/.test(next) ? next : '');
      for (const book of entry.named) expect(citation).toContain(book);
    }
  });

  it('quotes the grade for each one outside the Sahihayn, his words and al-Tirmidhi\'s own', () => {
    for (const entry of added.filter(each => each.records.some(record => record.book !== 'bukhari' && record.book !== 'muslim'))) {
      expect(entry.grades!.map(grade => grade.by)).toEqual(['ابن رجب', 'الترمذي']);
    }
  });

  it('is never asked as one of al-Nawawi\'s citations, nor in the Bukhari quizzes until the other Companions al-Bukhari has each from are listed', () => {
    for (const question of bookQuestions(() => 0.3)) expect(Number(question.key.split(':')[1])).toBeLessThanOrEqual(42);
    for (const question of [...narrator, ...complete]) expect(question.look?.mark).toBeLessThanOrEqual(42);
  });
});

describe('«من حدّث به؟»', () => {
  const questions = chainQuestions(() => 0.42);
  const plain = (text: string) => text.replace(/[ً-ْٰ]/g, '').replace(/[أإآٱ]/g, 'ا');

  it('hides one narrator between al-Bukhari\'s teacher and the Companion, and he is the right choice', () => {
    expect(questions.length).toBeGreaterThan(0);
    for (const question of questions) {
      const [, number, at] = question.key.split(':').map(Number);
      const record = FORTY.entries.flatMap(entry => entry.records).find(each => each.book === 'bukhari' && each.number === number && each.isnad)!;
      const narrators = record.isnad!.nodes.filter(node => node.id !== 'c');
      expect(at).toBeGreaterThan(0);
      expect(at).toBeLessThan(narrators.length - 1);
      const right = question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic;
      expect(plain(right).replace(/^ابو /, '')).toBe(plain(narrators.find(node => node.id === `n${at}`)!.label).replace(/^(?:ابي|ابا|ابو) /, ''));
    }
  });

  it('offers no wrong choice named anywhere in the hadith\'s records, so none can be right by another route', () => {
    for (const question of questions) {
      const entry = FORTY.entries[Number(question.look!.mark) - 1];
      const told = plain(entry.records.map(record => record.text).join(' '));
      for (const choice of question.choices.filter(each => each.value !== question.correctAnswer)) {
        expect(told).not.toContain(plain(choice.labelArabic));
        expect(choice.labelArabic).not.toMatch(/^أبي$/);
      }
      expect(question.choices.map(choice => choice.labelArabic)).not.toContain('أبي');
      const shortNames = question.choices.map(choice => plain(choice.labelArabic).split(' ').filter(word => !/^(?:بن|ابن|ابو|ابي)$/.test(word)));
      for (const [i, a] of shortNames.entries()) for (const b of shortNames.slice(i + 1)) expect(a.every(word => b.includes(word)) || b.every(word => a.includes(word)), question.key).toBe(false);
      expect(question.promptArabic.split('\n')[1] + question.choices.map(choice => choice.labelArabic).join(' ')).not.toMatch(/[ً-ْ]/);
    }
  });
});

describe('the words on an isnad line', () => {
  it('keeps «قَالَ:» before the word of transmission where al-Bukhari prints it', () => {
    const record = FORTY.entries[0].records.find(each => each.book === 'bukhari' && each.number === 54)!;
    expect(record.isnad!.edges.map(edge => bare(edge.label))).toEqual(['حدثنا', 'قال: أخبرنا', 'عن', 'عن', 'عن', 'عن']);
  });
});

describe('«الشاهد» of «من راوي الحديث؟»', () => {
  it('is al-Nawawi\'s own opening of the entry, up to the Companion\'s «رضي الله عنه», his name in it', () => {
    const fourth = FORTY.entries.find(entry => entry.n === 4)!;
    const witness = narratorWitness(fourth)!;
    expect(fourth.text).toContain(witness.text);
    expect(witness.text).toBe('عن أبي عبد الرحمن عبد الله بن مسعود رضي الله عنه');
    expect(witness.text).toContain(witness.lit!);
  });

  it('is given for every narrator question, and stops before the saying', () => {
    for (const question of narrator) {
      expect(question.witness).toBeDefined();
      expect(question.witness!.text).toMatch(/رضي الله (تعالى )?عن(ه|ها|هما)$/);
    }
  });
});
