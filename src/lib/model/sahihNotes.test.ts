import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { findHadith, type SahihText } from '@shared/sahih';
import { sahihLabel, sahihPlace, sahihSources, unmarked, type AppPerson } from '@shared/tarajim';
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

  it('stops a chain where the narrator\'s story begins, and shows no route that prints no chain', () => {
    // Muslim 1610: «…عن أبيه؛ أن أروى بنت أويس ادعت… فقال سعيد…»: the story's own «سمعت» is not a link of the chain.
    const story = findHadith(sahih.muslim, 1610)!.hadith.routes.find((route) => unmarked(route.text).includes('أن أروى بنت أويس'))!;
    expect(unmarked(story.text.slice(lastNarrator(story)!)).startsWith('أن أروى بنت أويس')).toBe(true);
    // Muslim 2503 is the later part of 2502, printed with no chain: there is no narrator to open it with.
    expect(lastNarrator(findHadith(sahih.muslim, 2503)!.hadith.routes[0])).toBeUndefined();
  });

  it('opens on the route closest to the Siyar\'s words, under one line naming it, its sheet the Sahih then the Siyar', () => {
    for (const { fact } of quoted) {
      expect(unmarked(sahihLabel(fact))).toBe(`${unmarked(sahihPlace(fact.sahih![0]))}، وذكره غيره`);
      const books = sahihSources(fact).map((source) => source.book);
      expect(books.slice(0, fact.sahih!.length)).toEqual(fact.sahih!.map((quote) => (quote.book === 'bukhari' ? 'صحيح البخاري' : 'صحيح مسلم')));
      expect(books.slice(fact.sahih!.length)).toEqual(sahihSources({ ...fact, sahih: [] }).map((source) => source.book));
    }
  });

  it('folds a chain and only a chain, and drops no word of the route', () => {
    expect(quoted.length).toBeGreaterThan(0);
    for (const { fact } of quoted) for (const quote of fact.sahih!) {
      const route = findHadith(sahih[quote.book], quote.n)!.hadith.routes.find((one) => (one.route ?? '') === (quote.route ?? '') && one.shamela === quote.shamela)!;
      expect(spaced(`${quote.isnad} ${quote.words}`)).toBe(spaced(route.text));
      // A chain is folded, never the story: it is there, and it is told before the Prophet ﷺ is named.
      expect(quote.isnad).not.toBe('');
      expect(quote.isnad).not.toContain('ﷺ');
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
