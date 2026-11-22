import { describe, expect, it } from 'vitest';
import { bareName } from '../tarajimLine';
import { nameQuestions, nasabQuestions, prophetNameQuestions, prophetNames, TARAJIM_KUNYA, TARAJIM_LAQAB, virtueQuestions } from './tarajim';
import { kunyaFacts, laqabFacts } from '../tarajimNames';
import peopleJson from '../data/tarajim/people.json';
import namesSkip from '../data/tarajim/namesQuizSkip.json';
import type { AppPerson } from '../tarajim';
import { seededRandom } from './feedQuiz';

describe('أين يلتقي النسبان؟', () => {
  const questions = nasabQuestions();
  it('asks only pairs that meet, with the nearest shared father as the answer and fathers of one side alone as wrong choices', () => {
    expect(questions.length).toBeGreaterThan(0);
    const zubayrProphet = questions.find(q => q.key.includes('az-zubayr-ibn-al-awwam') && q.key.includes('prophet-muhammad'))!;
    expect(bareName(zubayrProphet.correctAnswer)).toBe('قصي');
    for (const q of questions) {
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices.map(c => bareName(c.value))).size).toBe(4);
      // No wrong choice is a father the two share (anyone above the meeting point would also be "where they meet").
      expect(q.note?.text.split('\n')[0].endsWith(q.correctAnswer)).toBe(true);
    }
  });
});

describe('صاحب المنقبة', () => {
  it('never asks a virtue whose quote names its owner, and offers four different people', () => {
    const questions = virtueQuestions(undefined, seededRandom(1));
    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) {
      expect(new Set(q.choices.map(c => c.value)).size).toBe(4);
      expect(q.choices.map(c => c.value)).toContain(q.correctAnswer);
    }
    expect(questions.some(q => bareName(q.promptArabic).includes('طلحه'))).toBe(false);
    // Ibn Ma'in's «مسور ثقة» names al-Miswar without the article.
    expect(questions.some(q => bareName(q.promptArabic).startsWith('«مسور'))).toBe(false);
  });
});

describe('fair choices', () => {
  it('never offers the owner’s brother for a virtue, so «عم الرجل صنو أبيه» does not offer Hamzah', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const q = virtueQuestions(undefined, seededRandom(seed)).find(q => bareName(q.promptArabic).includes('صنو'));
      if (q) expect(q.choices.map(c => c.value)).not.toContain('hamzah-ibn-abd-al-muttalib');
    }
  });

  it('writes «بنت» after a woman’s name in the nasab note, and never asks a meeting the question already names', () => {
    for (const q of nasabQuestions()) {
      expect(q.note?.text).not.toMatch(/^(?:صفية|عائشة) بن /u);
      // Word for word: «عمرو بن حريث» does not name «عمر».
      expect(` ${bareName(q.promptArabic).replace(/[؟?]/gu, ' ')} `.includes(` ${bareName(q.correctAnswer)} `)).toBe(false);
    }
  });
});

describe('virtue skip list', () => {
  it('names only virtues that exist, each with a reason', async () => {
    const { skip } = (await import('../data/tarajim/virtueQuizSkip.json')).default as { skip: Record<string, string> };
    const ids = new Set((await import('../data/tarajim/people.json')).default.flatMap((p: { virtues: { id?: string }[] }) => p.virtues.map(v => v.id)));
    for (const [id, why] of Object.entries(skip)) {
      expect(ids.has(id)).toBe(true);
      expect(why.length).toBeGreaterThan(0);
    }
  });
});

describe('ما صلته به؟', () => {
  it('asks what one person is to another, never offering a tie that also holds between them', async () => {
    const { tieQuestions } = await import('./tarajim');
    const questions = tieQuestions();
    expect(questions.length).toBeGreaterThan(0);
    const zubayr = questions.find(q => q.key.includes('az-zubayr-ibn-al-awwam') && q.key.includes('safiyyah-bint-abd-al-muttalib'))!;
    // Asked one way round: what Safiyyah is to al-Zubayr, or he to her.
    expect(['أمه', 'ابنها']).toContain(zubayr.correctAnswer);
    const prophet = questions.find(q => q.key.includes('az-zubayr-ibn-al-awwam') && q.key.includes('prophet-muhammad'));
    if (prophet) expect(prophet.choices.map(c => c.value)).not.toContain('صاحبه');
    for (const q of questions) expect(new Set(q.choices.map(c => c.value)).size).toBe(4);
  });
});

describe('ابحث عن الجواب', () => {
  it('opens each Tarajim question on the people it asks about, with the answer marked for after the reveal', async () => {
    const { tieQuestions } = await import('./tarajim');
    const safiyyah = tieQuestions().find(q => q.key === 'TARAJIM_TIE:safiyyah-bint-abd-al-muttalib:az-zubayr-ibn-al-awwam')!;
    // «ما صفية من الزبير؟»: his ties round him, where her node names what she is to him.
    expect(safiyyah.look).toEqual({ view: 'ties', slug: 'az-zubayr-ibn-al-awwam', mark: 'safiyyah-bint-abd-al-muttalib' });
    const [nasab] = nasabQuestions();
    expect(nasab.look).toEqual({ view: 'nasab', slugs: nasab.key.split(':').slice(1), mark: true });
    for (const virtue of virtueQuestions(undefined, seededRandom(3))) {
      expect(virtue.look?.view).toBe('virtues');
      expect(virtue.look && 'slugs' in virtue.look && virtue.look.slugs).toEqual(virtue.choices.map(c => c.value));
      const [, slug, index] = virtue.key.split(':');
      expect(virtue.look?.mark).toEqual({ slug, index: Number(index) });
      expect(slug).toBe(virtue.correctAnswer);
    }
  });
});

describe('بمَ لُقّب؟ and ما كنيته؟', () => {
  const people = peopleJson as AppPerson[];
  const kinds = [[TARAJIM_LAQAB, laqabFacts(people)], [TARAJIM_KUNYA, kunyaFacts(people)]] as const;

  it('offers only names of people of the asked person’s sex, never one of the Prophet’s ﷺ, and never one the person also bears', () => {
    const prophet = people.find(p => p.slug === 'prophet-muhammad')!;
    const his = new Set([...prophet.titles, ...prophet.laqab, ...prophet.kunya].map(f => bareName('name' in f ? (f.name as string) : f.text)));
    for (const [family, facts] of kinds) {
      const questions = nameQuestions(family, people, seededRandom(1));
      expect(questions.length).toBeGreaterThan(0);
      for (const q of questions) {
        const asked = people.find(p => q.key.startsWith(`${family}:${p.slug}:`))!;
        const own = facts.filter(f => f.person.slug === asked.slug).map(f => bareName(f.name));
        for (const choice of q.choices.filter(c => c.value !== q.correctAnswer)) {
          const holders = facts.filter(f => bareName(f.name) === bareName(choice.value)).map(f => f.person);
          expect(holders.length).toBeGreaterThan(0);
          expect(holders.every(p => p.sex === asked.sex)).toBe(true);
          expect(his.has(bareName(choice.value))).toBe(false);
          expect(own).not.toContain(bareName(choice.value));
        }
      }
    }
  });

  it('does not ask a kunya the name already shows, nor a laqab the sources do not give to one person alone', () => {
    const kunya = nameQuestions(TARAJIM_KUNYA, people, seededRandom(1)).map(q => q.key.split(':')[1]);
    expect(kunya).not.toContain('ukkashah-ibn-mihsan');
    expect(kunya).not.toContain('abu-dharr-al-ghifari');
    const laqab = nameQuestions(TARAJIM_LAQAB, people, seededRandom(1));
    expect(laqab.some(q => q.correctAnswer === 'قاتل أبي جهل')).toBe(false);
  });

  it('skips only laqabs that exist, each with its source', () => {
    const ids = new Set(people.flatMap(p => [...p.laqab, ...p.titles].map(f => f.id)));
    for (const [id, why] of Object.entries(namesSkip.skip as Record<string, string>)) {
      expect(ids.has(id)).toBe(true);
      expect(why.length).toBeGreaterThan(0);
    }
  });
});

describe('once answered, each choice says whose name it is (owner, 2026-11-22)', () => {
  const people = peopleJson as AppPerson[];
  const nameOf = (person: AppPerson) => (person.slug === 'prophet-muhammad' && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name);
  /** The people a name belongs to, read straight from the entries the choices come from. */
  const bearersOf = (facts: ReturnType<typeof laqabFacts>, name: string) => facts.filter(fact => bareName(fact.name) === bareName(name));
  const check = (questions: ReturnType<typeof nameQuestions>, facts: ReturnType<typeof laqabFacts>, rightBy: (q: (typeof questions)[number]) => string) => {
    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) {
      for (const choice of q.choices) {
        const line = q.whereOf?.[choice.value];
        if (q.correctAnswers?.includes(choice.value) ?? q.correctAnswer === choice.value) { expect(line).toBe(rightBy(q)); continue; }
        const bearers = bearersOf(facts, choice.value);
        expect(bearers.length).toBeGreaterThan(0);
        // Every bearer is named, and the words that give each the name are among the question's sources.
        for (const { person, fact } of bearers) {
          expect(line?.split('، ')).toContain(nameOf(person));
          expect(q.sources.some(source => source.quote === fact.text)).toBe(true);
        }
      }
    }
  };

  it('names the Companion whose laqab a wrong choice is, and the Prophet ﷺ under his own names', () => {
    const his = nameOf(people.find(p => p.slug === 'prophet-muhammad')!);
    check(prophetNameQuestions(people, seededRandom(3), 30), laqabFacts(people), () => his);
  });

  it('names whose laqab or kunya each choice is, the asked person under the right one', () => {
    const bySlug = new Map(people.map(person => [person.slug, person]));
    for (const [kind, facts] of [[TARAJIM_LAQAB, laqabFacts(people)], [TARAJIM_KUNYA, kunyaFacts(people)]] as const) {
      check(nameQuestions(kind, people, seededRandom(2)).slice(0, 60), facts, q => nameOf(bySlug.get(q.key.split(':')[1])!));
    }
  });
});

describe('أسماء النبي ﷺ (several right choices)', () => {
  const people = peopleJson as AppPerson[];
  it('offers four choices, one to four of them his names as the hadith gives them, the rest Companions’ laqabs', () => {
    const names = new Set(prophetNames(people).map(title => title.name));
    expect(names.has('نبي')).toBe(false);
    // A name the hadith joins with «و» is his too.
    expect(names.has('نبي التوبة')).toBe(true);
    expect(names.has('خاتم النبيين')).toBe(true);
    const questions = prophetNameQuestions(people, seededRandom(3), 30);
    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) {
      expect(q.choices).toHaveLength(4);
      const right = q.correctAnswers!;
      expect(right.length).toBeGreaterThanOrEqual(1);
      expect(right.every(name => names.has(name))).toBe(true);
      expect(q.choices.filter(c => !right.includes(c.value)).every(c => !names.has(c.value))).toBe(true);
    }
  });
});
