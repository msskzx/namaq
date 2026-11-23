import { describe, expect, it } from 'vitest';
import peopleJson from '../data/tarajim/people.json';
import type { AppPerson } from '../tarajim';
import { bareName, boxName, lineOf, sameName } from '../tarajimLine';
import { BOX_ASKED, BOX_BLANK } from './choiceKinds';
import { seededRandom } from './feedQuiz';
import { nasabFillQuestions } from './nasabFill';

const people = peopleJson as AppPerson[];
const questions = nasabFillQuestions(people, seededRandom(7));
const personOf = (key: string) => people.find(p => p.slug === key.split(':')[1])!;
const bare = (name: string) => bareName(boxName(name));
const shape = (name: string) => `${/^(?:أبو|ذو|عبد|امرؤ) /u.exec(name)?.[0] ?? ''}${name.split(' ').length}`;

// «أكمل النسب» (owner, 2026-11-20): the boxes of a person's nasab, every other one blank, one asked at a time.
describe('«أكمل النسب»', () => {
  it('asks the name the nasab prints at the box, in the nominative', () => {
    expect(questions.length).toBeGreaterThan(0);
    for (const question of questions) {
      const k = Number(question.key.split(':')[2]);
      const line = lineOf(personOf(question.key), people);
      expect(question.boxes!.filter(box => box === BOX_ASKED)).toHaveLength(1);
      expect(question.boxes![k]).toBe(BOX_ASKED);
      expect(question.correctAnswer).toBe(boxName(line[k].name));
    }
    // Abu Bakr's father stands alone in his box: «أبو قحافة», as one says it, never the genitive the line prints.
    const father = questions.find(q => q.key === 'TARAJIM_NASAB_FILL:abu-bakr-as-siddiq:1');
    expect(father?.correctAnswer).toMatch(/^أبو قحافة/u);
  });

  it('names the person in his own box without his fathers: they are the boxes after it', () => {
    // Owner, 2026-11-23: «حفصة بنت عمر» then «عمر» said her father twice; her box is «حفصة».
    for (const question of questions) {
      expect(question.boxes![0], question.key).not.toMatch(/\s(?:بن|بنت)\s/u);
    }
    const hafsah = questions.find(q => q.key.startsWith('TARAJIM_NASAB_FILL:hafsah-bint-umar:'));
    if (hafsah) expect(hafsah.boxes![0]).toBe('حفصة');
  });

  it('shows the boxes in between: every other box is a name the reader sees', () => {
    for (const question of questions) {
      const boxes = question.boxes!;
      for (let i = 0; i + 1 < boxes.length; i += 1) {
        const blank = (box: string) => box === BOX_ASKED || box === BOX_BLANK;
        expect(blank(boxes[i]) && blank(boxes[i + 1]), question.key).toBe(false);
      }
    }
  });

  it('never gives the answer away: not in the person\'s name, its nisba or another box, nor told by the choices\' look', () => {
    for (const question of questions) {
      const answer = bare(question.correctAnswer);
      const shown = ` ${bare(personOf(question.key).name)} `;
      expect(shown.includes(` ${answer} `), question.key).toBe(false);
      // «أبو ذر الغفاري» is never asked «غفار».
      expect(shown.includes(` ال${answer.replace(/^ال/u, '').replace(/[هي]$/u, '')}ي `), question.key).toBe(false);
      expect(question.boxes!.some(box => sameName(bare(box), answer)), question.key).toBe(false);
      for (const choice of question.choices) expect(shape(choice.labelArabic), question.key).toBe(shape(question.correctAnswer));
    }
    // «عمرو بن سعيد الأموي» is never asked «أمية».
    expect(questions.filter(q => /الأموي/u.test(personOf(q.key).name) && q.correctAnswer === 'أمية')).toEqual([]);
  });

  it('asks no father the entries disagree on', () => {
    // Khalid's entry prints «يقظة بن كعب», al-Arqam's «يقظة بن مرة»: neither is one answer.
    const khalid = lineOf(personOf('x:khalid-ibn-al-walid'), people).map(n => bare(n.name));
    const at = khalid.indexOf(bare('كعب'));
    expect(at).toBeGreaterThan(0);
    expect(questions.some(q => q.key === `TARAJIM_NASAB_FILL:khalid-ibn-al-walid:${at}`)).toBe(false);
  });

  it('offers four different fathers, none of them in the person\'s own line nor the Prophet\'s ﷺ name', () => {
    for (const question of questions) {
      const line = lineOf(personOf(question.key), people).map(n => bare(n.name));
      const wrong = question.choices.filter(choice => choice.value !== question.correctAnswer).map(choice => bare(choice.labelArabic));
      expect(new Set(question.choices.map(choice => bare(choice.value))).size).toBe(question.choices.length);
      expect(wrong).toHaveLength(question.choices.length - 1);
      for (const name of wrong) {
        expect(line.some(own => sameName(own, name)), `${question.key}: ${name}`).toBe(false);
        expect(['محمد', 'احمد']).not.toContain(name);
      }
    }
  });
});
