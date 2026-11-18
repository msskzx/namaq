import { describe, expect, it } from 'vitest';
import terms from '../data/quran/balaghaTerms';
import { plainName } from '../quran/balaghaTerms';
import { stems } from './ayahQuizText';
import { normalizeWord } from '../quran/normalize';
import { hideName, termQuiz } from './balaghaTermQuiz';
import { seededRandom } from './feedQuiz';

const scope = { range: null, filters: {} } as Parameters<typeof termQuiz.questions>[0];

describe('«ما المصطلح؟»', () => {
  it('asks every term the books define, each once, with four choices', () => {
    const questions = termQuiz.questions(scope, 'medium', seededRandom(1));
    expect(questions.length).toBe(termQuiz.count(scope));
    expect(new Set(questions.map(question => question.key)).size).toBe(questions.length);
    for (const question of questions) expect(question.choices).toHaveLength(4);
  });

  it("hides the term's name in its definition, and gives no wrong choice a word of the right one or of the definition", () => {
    for (const question of termQuiz.questions(scope, 'medium', seededRandom(2))) {
      const right = plainName(question.correctAnswer);
      const shown = stems(question.passage!);
      for (const word of stems(right)) expect(shown.has(word), `${right} shows in its definition`).toBe(false);
      for (const choice of question.choices.filter(choice => choice.value !== question.correctAnswer)) {
        for (const word of stems(choice.labelArabic)) expect(stems(right).has(word) || normalizeWord(question.passage!).includes(word), `${choice.labelArabic} beside ${right}`).toBe(false);
      }
      expect(Object.keys(question.terms ?? {}).sort()).toEqual(question.choices.map(choice => choice.value).sort());
    }
  });

  it('hides another name the definition gives the term', () => {
    expect(hideName('وَتُسَمَّى الطِّبَاقُ: الْجَمْعُ بَيْنَ مُتَضَادَّيْنِ', 'الْمُطَابَقَةُ')).toBe('وَتُسَمَّى …: الْجَمْعُ بَيْنَ مُتَضَادَّيْنِ');
    expect(hideName('أَمَّا الْحَصْرُ- وَيُقَالُ لَهُ الْقَصْرُ فَهُوَ', 'الْحَصْرُ وَالِاخْتِصَاصُ')).toBe('أَمَّا …- وَيُقَالُ لَهُ … فَهُوَ');
  });

  it('asks only terms the books define', () => {
    const asked = new Set(termQuiz.questions(scope, 'medium', seededRandom(3)).map(question => question.correctAnswer));
    for (const term of terms.terms.filter(term => !term.defines)) expect(asked.has(term.name)).toBe(false);
    // الحذف and إيجاز الحذف share al-Suyuti's paragraph: one question.
    expect(asked.has('إيجاز الحذف') !== asked.has('الْحَذْفُ')).toBe(true);
  });
});
