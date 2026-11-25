import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { findHadith, type SahihText } from '@shared/sahih';
import { sahihLabel, sahihSources, unmarked, type AppPerson } from '@shared/tarajim';
import { lastNarrator, noteNumbers, noteOf } from './sahihNotes';

const people = JSON.parse(readFileSync('shared/data/tarajim/people.json', 'utf8')) as AppPerson[];
const sahih = { bukhari: JSON.parse(readFileSync('data/hadith/sahih/bukhari.json', 'utf8')) as SahihText, muslim: JSON.parse(readFileSync('data/hadith/sahih/muslim.json', 'utf8')) as SahihText };
const quoted = people.flatMap((person) => [...person.virtues, ...person.ayat].flatMap((fact) => (fact.sahih ? [{ person, fact }] : [])));
const spaced = (text: string) => text.replace(/\s+/g, ' ').trim();

describe('a report on a person page in the Sahih\'s words (owner, 2026-11-25)', () => {
  it('reads the note the mark points to, though the notes give hadith numbers in the same brackets', () => {
    // Siyar 1/100: note 3 names al-Bukhari's numbers in brackets like the notes' own (١) (٢) (٣).
    const notes = '(١) إسناده صحيح. (٢) أخرجه البخاري (٢٩٠٥) و (٤٠٥٨) ومسلم (٢٤١١). (٣) أخرجه البخاري (٤٠٥٩).';
    expect(noteOf(notes, 2)).toContain('(٤٠٥٨)');
    expect(noteOf(notes, 3)).toBe('(٣) أخرجه البخاري (٤٠٥٩).');
    expect(noteNumbers(noteOf(notes, 2), 'البخاري')).toEqual([2905, 4058]);
    expect(noteNumbers(noteOf(notes, 2), 'مسلم')).toEqual([2411]);
  });

  it('folds a Muslim chain up to its last narrator, who opens what is shown', () => {
    const route = findHadith(sahih.muslim, 2411)!.hadith.routes[0];
    const cut = lastNarrator(route)!;
    expect(unmarked(route.text.slice(cut)).startsWith('سمعت عليا يقول')).toBe(true);
  });

  it('opens Sa\'d\'s «يجمع أبويه» on al-Bukhari\'s route and keeps Muslim\'s among the others', () => {
    const saad = people.find((person) => person.slug === 'saad-ibn-abi-waqqas')!;
    const fact = saad.virtues.find((one) => one.id?.endsWith('#a_sd_v_ali'))!;
    expect(fact.sahih![0]).toMatchObject({ book: 'bukhari', n: 4058 });
    expect(fact.sahih!.some((quote) => quote.book === 'muslim' && quote.n === 2411)).toBe(true);
    // One line under it (owner, 2026-11-25), its sheet every place the report is: the Sahih's routes, then the Siyar's page.
    expect(unmarked(sahihLabel(fact))).toBe('صحيح البخاري (٤٠٥٨)، وذكره غيره');
    const books = sahihSources(fact).map((source) => source.book);
    expect(books[0]).toBe('صحيح البخاري');
    expect(books).toContain('صحيح مسلم');
    expect(books.at(-1)).toBe(sahihSources({ ...fact, sahih: [] }).at(-1)!.book);
  });

  it('drops no word of a route: its folded chain and what is shown are the whole printed text', () => {
    expect(quoted.length).toBeGreaterThan(0);
    for (const { fact } of quoted) for (const quote of fact.sahih!) {
      const route = findHadith(sahih[quote.book], quote.n)!.hadith.routes.find((one) => (one.route ?? '') === (quote.route ?? '') && one.shamela === quote.shamela)!;
      expect(spaced(`${quote.isnad} ${quote.words}`)).toBe(spaced(route.text));
    }
  });

  it('gives the Sahih only to sayings: a name, a date or a tie stays al-Dhahabi\'s', () => {
    for (const person of people) {
      for (const fact of [...(person.fullName ? [person.fullName] : []), ...person.kunya, ...person.died.year, ...person.parents, ...person.spouses]) {
        expect(fact.sahih).toBeUndefined();
      }
    }
  });
});
