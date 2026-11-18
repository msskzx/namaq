import { describe, expect, it } from 'vitest';
import terms from '../data/quran/balaghaTerms';
import { BROAD_ITNAB, BROAD_TERMS, plainName } from '../quran/balaghaTerms';
import { hideName, namedIn, termQuiz } from './balaghaTermQuiz';
import { seededRandom } from './feedQuiz';

const scope = { range: null, filters: {} } as Parameters<typeof termQuiz.questions>[0];

describe('«ما المصطلح؟»', () => {
  it('asks every term the books define, each once, with four choices', () => {
    const questions = termQuiz.questions(scope, 'medium', seededRandom(1));
    expect(questions.length).toBe(termQuiz.count(scope));
    expect(new Set(questions.map(question => question.key)).size).toBe(questions.length);
    for (const question of questions) expect(question.choices).toHaveLength(4);
  });

  it("hides every form of the term's name in its definition, and gives no wrong choice a form of the right one or of the definition", () => {
    for (const question of termQuiz.questions(scope, 'medium', seededRandom(2))) {
      const right = plainName(question.correctAnswer);
      expect(namedIn(right, question.passage!), `${right} shows in its definition`).toBe(false);
      for (const choice of question.choices.filter(choice => choice.value !== question.correctAnswer)) {
        expect(namedIn(choice.labelArabic, `${right} ${question.passage}`), `${choice.labelArabic} beside ${right}`).toBe(false);
        // A term that holds others (a إطناب بالزيادة holds a تذييل) is never the wrong one.
        expect([...BROAD_TERMS, ...BROAD_ITNAB]).not.toContain(choice.value);
      }
      expect(Object.keys(question.terms ?? {}).sort()).toEqual(question.choices.map(choice => choice.value).sort());
    }
  });

  it("hides the name's other forms: a verb, a plural, a word with a pronoun", () => {
    expect(hideName('مَعْنًى فَيَسْتَقْصِيهِ فَيَأْتِي', 'الِاسْتِقْصَاءُ')).toBe('مَعْنًى … فَيَأْتِي');
    expect(hideName('الْكَلَامُ الْمُنْسَجِمُ', 'الانسجام')).toBe('الْكَلَامُ …');
    expect(hideName('أَقْسَامُ الشَّيْءِ', 'التَّقْسِيمُ')).toBe('… الشَّيْءِ');
  });

  it('offers no wrong term under another name the passage gives it (التورية is الإيهام, الاحتراس is التكميل)', () => {
    const never: Record<string, string> = { الاستخدام: 'الإيهام', التدبيج: 'الإيهام', الإبداع: 'التكميل' };
    let asked = 0;
    for (let seed = 0; seed < 40; seed++) {
      for (const question of termQuiz.questions(scope, 'medium', seededRandom(seed))) {
        const wrong = never[plainName(question.correctAnswer)];
        if (!wrong) continue;
        asked++;
        expect(question.choices.map(choice => choice.labelArabic)).not.toContain(wrong);
      }
    }
    expect(asked).toBeGreaterThan(0);
  });

  it('hides another name the definition gives the term', () => {
    expect(hideName('وَتُسَمَّى الطِّبَاقُ: الْجَمْعُ بَيْنَ مُتَضَادَّيْنِ', 'الْمُطَابَقَةُ')).toBe('وَتُسَمَّى …: الْجَمْعُ بَيْنَ مُتَضَادَّيْنِ');
    // A two-letter word of the name is hidden too.
    expect(hideName('لَا فِي اللَّفِّ وَالنَّشْرِ', 'اللَّفُّ وَالنَّشْرُ')).toBe('لَا فِي … …');
    expect(hideName('أَمَّا الْحَصْرُ- وَيُقَالُ لَهُ الْقَصْرُ فَهُوَ', 'الْحَصْرُ وَالِاخْتِصَاصُ')).toBe('أَمَّا …- وَيُقَالُ لَهُ … فَهُوَ');
  });

  it('asks only terms the books define', () => {
    const asked = new Set(termQuiz.questions(scope, 'medium', seededRandom(3)).map(question => question.correctAnswer));
    for (const term of terms.terms.filter(term => !term.defines)) expect(asked.has(term.name)).toBe(false);
    // الحذف and إيجاز الحذف share al-Suyuti's paragraph: one question.
    expect(asked.has('إيجاز الحذف') !== asked.has('الْحَذْفُ')).toBe(true);
  });
});
