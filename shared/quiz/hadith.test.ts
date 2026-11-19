import { describe, expect, it } from 'vitest';
import fortyData from '../data/hadith/forty.json';
import rajabData from '../data/hadith/ibnRajab.json';
import { rajabFeedPassages, rajabOpening, sayingStart, type AppForty, type RajabChapter } from '../hadith';
import { bookQuestions, completeQuestions, namedBooks, narratorQuestions } from './hadith';

const FORTY = fortyData as AppForty;
const RAJAB = rajabData as RajabChapter[];
const narrator = narratorQuestions(() => 0.42);
const complete = completeQuestions(() => 0.42);
const right = (question: (typeof narrator)[number]) => question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic;
const bare = (text: string) => text.replace(/[ً-ْٰ]/g, '');

describe('the Forty as al-Nawawi printed them', () => {
  it('holds all forty-two, and every record starts with its own number on the page it cites', () => {
    expect(FORTY.entries.map(entry => entry.n)).toEqual(Array.from({ length: 42 }, (_, i) => i + 1));
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
    for (const entry of FORTY.entries) expect(sayingStart(entry.text)).toMatch(/^(?:سمعت|بينما|حدثنا|قال|أن|حفظت|خادم|عن|كنت|قلت|وعظنا|أخذ)\s/);
  });

  it('carries the corrected wording of the digital transcription', () => {
    const text = FORTY.entries.map(entry => entry.text).join(' ');
    for (const slip of ['يقوم: من رأى', 'اسكترهوا', 'غفرت للك', 'الخشبي', 'مانهيتكم', 'صلى الله وعليه', 'تعالى وعليه']) expect(text).not.toContain(slip);
  });
});

describe('the hadith quizzes', () => {
  it('asks four different choices with one right, and names the source under them', () => {
    expect(narrator.length).toBeGreaterThan(10);
    expect(complete.length).toBeGreaterThan(10);
    for (const question of [...narrator, ...complete]) {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices.map(choice => bare(choice.labelArabic))).size).toBe(4);
      expect(question.note?.text).toMatch(/صحيح البخاري .*ص .*الأربعون النووية/);
    }
  });

  it('asks the Companion with the right one from the entry, and never a saying that names him', () => {
    for (const question of narrator) {
      const n = Number(question.key.split(':')[1]);
      const entry = FORTY.entries.find(item => item.records.some(record => record.book === 'bukhari' && record.number === n))!;
      expect(right(question)).toBe(entry.companion);
      expect(bare(question.promptArabic)).not.toContain(bare(entry.companion));
      for (const other of entry.alsoFrom ?? []) expect(question.choices.map(choice => choice.labelArabic)).not.toContain(other);
    }
  });

  it('hides the last words of the saying, and every wrong ending is named from another record', () => {
    for (const question of complete) {
      expect(question.promptArabic.endsWith('…»')).toBe(true);
      expect(bare(question.promptArabic)).not.toContain(bare(right(question)));
      for (const choice of question.choices.filter(item => item.value !== question.correctAnswer)) expect(question.note!.text).toContain(`«${choice.labelArabic}»`);
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
  it('has a chapter for each, opening on the hadith al-Nawawi quotes', () => {
    expect(RAJAB.map(chapter => chapter.n)).toEqual(Array.from({ length: 42 }, (_, i) => i + 1));
    expect(RAJAB[18].paragraphs.some(paragraph => paragraph.text.includes('احفَظِ الله يَحفَظْكَ'))).toBe(true);
    for (const chapter of RAJAB) expect(rajabOpening(chapter)).toHaveLength(1);
  });

  it('keeps his words only: no footnote marks or editors\' notes', () => {
    const all = RAJAB.flatMap(chapter => chapter.paragraphs.map(paragraph => paragraph.text)).join('\n');
    expect(all).not.toMatch(/\(\^[٠-٩]+\)|_{5}/);
  });

  it('takes the feed\'s passages only from hadith al-Nawawi took whole from the Sahihayn', () => {
    const passages = rajabFeedPassages(RAJAB, FORTY.entries);
    expect(passages.length).toBeGreaterThan(20);
    for (const { chapter } of passages) {
      expect(FORTY.entries[chapter.n - 1].records.every(record => record.book === 'bukhari' || record.book === 'muslim')).toBe(true);
    }
  });
});

describe('«من أخرجه؟»', () => {
  const questions = bookQuestions(() => 0.42);

  it('asks al-Nawawi\'s citation, with other entries\' citations as the wrong choices', () => {
    expect(questions.length).toBeGreaterThan(20);
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
});
