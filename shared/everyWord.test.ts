import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findHadith, type SahihText } from './sahih';
import type { AppForty } from './hadith';
import type { AppStory } from './stories/story';
import { READER_BOOKS } from './readerBooks';
import { kashshafRuns } from './quran/kashshaf';
import { readerBook } from '../src/lib/books/readerBook';
import forty from './data/hadith/forty.json';
import stories from './data/events/stories.json';
import kashshaf from './data/quran/kashshaf';

const sahih = {
  bukhari: JSON.parse(readFileSync(join(__dirname, '../data/hadith/sahih/bukhari.json'), 'utf8')) as SahihText,
  muslim: JSON.parse(readFileSync(join(__dirname, '../data/hadith/sahih/muslim.json'), 'utf8')) as SahihText,
};
const words = (text: string) => text.replace(/[^\p{L}\p{M}\p{Nd}ﷺ]+/gu, ' ').trim();
const fromArabicDigits = (digits: string) => Number([...digits].map(digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit)).join(''));
const printedRecordNumber = /^(?:[\s\-()٠-٩]|م(?=[\s٠-٩]))+/;

describe('the Forty\'s records from the Sahihayn', () => {
  const RUNS_ON_INTO: Record<string, string> = { 'muslim 1733 ٧٠': 'حدثنا محمد بن عباد' };

  it('show the same words as the Sahih text, whole routes, none dropped or added', () => {
    const records = (forty as unknown as AppForty).entries.flatMap(entry => entry.records).filter(record => record.book === 'bukhari' || record.book === 'muslim');
    expect(records.length).toBeGreaterThan(0);
    const name = (record: (typeof records)[number]) => `${record.book} ${record.number} ${record.route ?? ''}`.trim();
    const differ = records.filter(record => {
      const printed = findHadith(sahih[record.book as 'bukhari' | 'muslim'], record.number)?.hadith.routes ?? [];
      const routes = printed.map(route => words(route.text));
      const own = record.route ? printed.findIndex(route => route.route === record.route) : -1;
      const shown = words(record.text.replace(printedRecordNumber, ''));
      if (name(record) in RUNS_ON_INTO) return !routes[own]?.startsWith(`${shown} ${words(RUNS_ON_INTO[name(record)])} `);
      if (record.route && own < 0) return true;
      const starts = own >= 0 ? [own] : routes.map((_, at) => at);
      return !starts.some(from => routes.some((_, to) => to >= from && routes.slice(from, to + 1).join(' ') === shown));
    }).map(name);
    expect(differ).toEqual([]);
  });
});

describe('the sira stories', () => {
  const reports = (stories as unknown as AppStory[]).flatMap(story => story.reports.map(report => ({ story: story.slug, report })));

  it('tell a Sahih report as one unbroken run of its printed words, from a route\'s start to a sentence\'s end', () => {
    const fromSahih = reports.flatMap(({ story, report }) => {
      const cite = report.cite.match(/^صحيح (البخاري|مسلم)، رقم ([٠-٩]+)/);
      return cite ? [{ story, report, book: cite[1] === 'البخاري' ? sahih.bukhari : sahih.muslim, n: fromArabicDigits(cite[2]) }] : [];
    });
    expect(fromSahih.length).toBeGreaterThan(0);
    const broken = fromSahih.filter(({ report, book, n }) => {
      const routes = (findHadith(book, n)?.hadith.routes ?? []).map(route => words(route.text));
      const told = [report.isnad ?? '', ...report.moments.map(moment => moment.text)].join(' ').trim();
      const shown = words(told);
      if (shown === routes.join(' ')) return false;
      const raw = (findHadith(book, n)?.hadith.routes ?? []).map(route => route.text);
      const count = shown.split(' ').length;
      const endsSentence = (from: number) => {
        const text = raw.slice(from).join('\n');
        const found = [...text.matchAll(/[\p{L}\p{M}\p{Nd}ﷺ]+/gu)];
        if (found.length === count) return true;
        const last = found[count - 1];
        return /[.؟!\n]/.test(text.slice(last.index! + last[0].length, found[count].index));
      };
      const fromRoute = routes.some((_, from) => `${routes.slice(from).join(' ')} `.startsWith(`${shown} `) && endsSentence(from));
      return !fromRoute;
    }).map(({ story, report }) => `${story} ${report.cite}`);
    expect(broken).toEqual([]);
  });

  it('draw each moment\'s speakers with every word of the moment', () => {
    const drawn = reports.flatMap(({ story, report }) => report.moments.filter(moment => moment.turns?.length).map(moment => ({ story, moment })));
    expect(drawn.length).toBeGreaterThan(0);
    const differ = drawn.filter(({ moment }) => words(moment.turns!.map(turn => `${turn.lead ?? ''} ${turn.text}`).join(' ')) !== words(moment.text));
    expect(differ.map(({ story, moment }) => `${story}: ${moment.title}`)).toEqual([]);
  });
});

describe('the tafsir and the books in the reader', () => {
  it('draw every passage of al-Kashshaf whole, its lit sentences and Quran quotes cut out of the prose and nothing else', () => {
    const passages = kashshaf.entries.map(([, , , , , , text, lit]) => ({ text, lit }));
    expect(passages.filter(passage => kashshafRuns(passage).map(run => run.text).join('') !== passage.text).map(passage => passage.text.slice(0, 40))).toEqual([]);
  });

  it.each(READER_BOOKS)('turn %s page by page through every passage, each word once and in order', async id => {
    const { entries, pages } = await readerBook(id);
    expect(entries.length).toBeGreaterThan(0);
    const shown = entries.map(() => '');
    for (const page of pages) {
      expect(page.slices.length, `page ${page.part}/${page.page}`).toBeGreaterThan(0);
      for (const slice of page.slices) shown[slice.entry] += entries[slice.entry].text.slice(slice.from, slice.to);
    }
    expect(shown.flatMap((text, at) => (text === entries[at].text ? [] : [at]))).toEqual([]);
  });
});
