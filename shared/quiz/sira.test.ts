import { describe, expect, it } from 'vitest';
import { siraQuestions } from './sira';
import { surahName } from '../quran/surahNames';

const questions = siraQuestions(() => 0.42);
const byKey = (key: string) => questions.find(question => question.key === `SIRA:${key}`)!;
const right = (key: string) => byKey(key).choices.find(choice => choice.value === byKey(key).correctAnswer)!.labelArabic;
const wrong = (key: string) => byKey(key).choices.filter(choice => choice.value !== byKey(key).correctAnswer).map(choice => choice.labelArabic);

describe('the sira and battles quiz', () => {
  it('asks four choices with one right, and names its source under them', () => {
    for (const question of questions) {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices.map(choice => choice.labelArabic)).size).toBe(4);
      expect(question.note?.text).toMatch(/ص/);
    }
  });

  it('asks the ayat Utbah heard as «أوائل سورة فصلت», true of both reports, every choice of one shape and the reports in the note', () => {
    expect(right('recited:utbah-offers-and-hears-fussilat:41:1')).toBe(`أوائل سورة ${surahName(41)}`);
    expect(wrong('recited:utbah-offers-and-hears-fussilat:41:1').every(label => label.startsWith('أوائل سورة ') && !label.includes(surahName(41)))).toBe(true);
    expect(questions.find(q => q.key === 'SIRA:recited:utbah-offers-and-hears-fussilat:41:1')!.note!.text).toContain('في رواية محمد بن كعب القرظي');
  });

  it('never asks what a name already says: the place of «غزوة خيبر» or «سرية أبي سلمة إلى قطن», the ayat of «… يسمع سورة الطور»', () => {
    for (const key of ['place:khaybar', 'place:sariyyah-abi-salamah-qatan']) expect(questions.some(q => q.key === `SIRA:${key}`)).toBe(false);
    expect(questions.some(q => q.key.startsWith('SIRA:recited:') && q.key.includes(':52:'))).toBe(false);
  });

  it('asks who al-Muddaththir 11-26 was revealed about, with no one from the story as a wrong choice', () => {
    expect(right('revealed:al-walid-hears-the-quran:74:11')).toBe('الوليد بن المغيرة');
    expect(wrong('revealed:al-walid-hears-the-quran:74:11')).not.toContain('أبو جهل');
  });

  it('asks the year the source holds, not the one it calls «وهم بين», with no year next to it among the wrong ones', () => {
    expect(right('year:banu-qurayzah')).toBe('السنة ٥ للهجرة');
    expect(wrong('year:banu-qurayzah')).not.toContain('السنة ٤ للهجرة');
    expect(wrong('year:banu-qurayzah')).not.toContain('السنة ٦ للهجرة');
  });

  it('asks what came next only within one report', () => {
    expect(right('next:utbah-offers-and-hears-fussilat:0')).toBe('العرض');
    expect(questions.some(question => question.key.startsWith('SIRA:next:badr'))).toBe(false);
  });

  it('words the question for the name', () => {
    expect(byKey('year:fath-makkah').promptArabic).toBe('في أي سنة كان فتح مكة؟');
    expect(byKey('year:badr').promptArabic).toBe('في أي سنة كانت غزوة بدر؟');
  });

  it('looks a story question up in its story and a battle question in its battle', () => {
    expect(byKey('next:utbah-offers-and-hears-fussilat:0').look).toEqual({ view: 'story', slug: 'utbah-offers-and-hears-fussilat' });
    expect(byKey('revealed:al-walid-hears-the-quran:74:11').look).toEqual({ view: 'story', slug: 'al-walid-hears-the-quran' });
    expect(byKey('year:badr').look).toEqual({ view: 'battle', slug: 'badr' });
    expect(questions.every(question => question.look)).toBe(true);
  });
});
