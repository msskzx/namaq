import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findHadith, type SahihText } from './sahih';
import type { AppForty } from './hadith';
import type { AppStory } from './stories/story';
import { bookPagesOf, type BookEntry, type PageBreak, type ReaderBookId } from './bookReader';
import { kashshafEntries, mutashabihEntries, sadiEntries, ukbariEntries } from './readerBooks';
import { tafsirRuns } from './quran/tafsirSadi';
import { kashshafRuns } from './quran/kashshaf';
import forty from './data/hadith/forty.json';
import stories from './data/events/stories.json';
import sadi from './data/quran/tafsirSadi.json';
import breaks from './data/quran/bookPages.json';
import kashshaf from './data/quran/kashshaf';
import ukbari from './data/quran/irabUkbari';
import kirmani from './data/quran/mutashabihKirmani';
import iskafi from './data/quran/mutashabihIskafi';
import zubayr from './data/quran/mutashabihZubayr';

// Owner 2026-11-24: no display drops or adds a word of a source text. Each text the app shows from a book is checked
// here whole, every record and passage, against the one copy it is taken from.

const sahih = {
  bukhari: JSON.parse(readFileSync(join(__dirname, '../data/hadith/sahih/bukhari.json'), 'utf8')) as SahihText,
  muslim: JSON.parse(readFileSync(join(__dirname, '../data/hadith/sahih/muslim.json'), 'utf8')) as SahihText,
};
/** The words, their marks kept; only punctuation and spacing set aside, which the two copies print their own ways. */
const words = (text: string) => text.replace(/[^\p{L}\p{M}ﷺ]+/gu, ' ').trim();
/** A number as a cite writes it («٣٨٥٢»). */
const fromArabicDigits = (digits: string) => Number([...digits].map(digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit)).join(''));
/** The record's own number in front of it as its book prints it («٧٠ - (١٧٣٣)», «م - »), which is not the hadith's text. */
const printedNumber = /^(?:[\s\-()٠-٩]|م(?=[\s٠-٩]))+/;

describe('the Forty\'s records from the Sahihayn', () => {
  /**
   * Where data/hadith/sahih holds a route run on into the next one, so a whole record is only the start of it. Reported
   * to the owner 2026-11-28: Abd al-Baqi prints the next route under its own number; it leaves here once the Sahih text
   * splits it from the printed page.
   */
  const RUN_ON: Record<string, string> = { 'muslim 1733 ٧٠': 'runs on into «حدثنا محمد بن عباد…»' };

  it('show the same words as the Sahih text, whole routes, none dropped or added', () => {
    const records = (forty as unknown as AppForty).entries.flatMap(entry => entry.records).filter(record => record.book === 'bukhari' || record.book === 'muslim');
    expect(records.length).toBeGreaterThan(0);
    const differ = records.filter(record => {
      const routes = findHadith(sahih[record.book as 'bukhari' | 'muslim'], record.number)?.hadith.routes.map(route => words(route.text)) ?? [];
      const shown = words(record.text.replace(printedNumber, ''));
      return !routes.some((_, from) => routes.some((_, to) => to >= from && routes.slice(from, to + 1).join(' ') === shown));
    }).map(record => `${record.book} ${record.number} ${record.route ?? ''}`.trim());
    expect(differ).toEqual(Object.keys(RUN_ON));
  });
});

describe('the sira stories', () => {
  const reports = (stories as unknown as AppStory[]).flatMap(story => story.reports.map(report => ({ story: story.slug, report })));

  it('tell a Sahih report as one unbroken run of its printed words, chain and moments together', () => {
    const fromSahih = reports.flatMap(({ story, report }) => {
      const cite = report.cite.match(/^صحيح (البخاري|مسلم)، رقم ([٠-٩]+)/);
      return cite ? [{ story, report, book: cite[1] === 'البخاري' ? sahih.bukhari : sahih.muslim, n: fromArabicDigits(cite[2]) }] : [];
    });
    expect(fromSahih.length).toBeGreaterThan(0);
    const broken = fromSahih.filter(({ report, book, n }) => {
      const printed = words(findHadith(book, n)?.hadith.routes.map(route => route.text).join(' ') ?? '');
      return !printed.includes(words([report.isnad ?? '', ...report.moments.map(moment => moment.text)].join(' ')));
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
  it('draw every passage of al-Sa\'di and al-Kashshaf whole, the Quran quotes cut out of the prose and nothing else', () => {
    const sadiText = sadiEntries(sadi.passages).map(entry => entry.text);
    expect(sadiText.filter(text => tafsirRuns(text).map(run => run.text).join('') !== text)).toEqual([]);
    const passages = kashshaf.entries.map(([, , , , , , text, lit]) => ({ text, lit }));
    expect(passages.filter(passage => kashshafRuns(passage).map(run => run.text).join('') !== passage.text).map(passage => passage.text.slice(0, 40))).toEqual([]);
  });

  const BOOKS: Record<ReaderBookId, { entries: BookEntry[]; breaks: PageBreak[] }> = {
    sadi: { entries: sadiEntries(sadi.passages), breaks: breaks.sadi as PageBreak[] },
    kashshaf: { entries: kashshafEntries(kashshaf), breaks: breaks.kashshaf as PageBreak[] },
    ukbari: { entries: ukbariEntries(ukbari), breaks: breaks.ukbari as PageBreak[] },
    kirmani: { entries: mutashabihEntries(kirmani), breaks: kirmani.breaks },
    iskafi: { entries: mutashabihEntries(iskafi), breaks: iskafi.breaks },
    zubayr: { entries: mutashabihEntries(zubayr), breaks: zubayr.breaks },
  };

  it.each(Object.entries(BOOKS))('turn %s page by page through every passage, each word once and in order', (_, { entries, breaks: pageBreaks }) => {
    expect(entries.length).toBeGreaterThan(0);
    const shown = entries.map(() => '');
    for (const page of bookPagesOf(entries, pageBreaks)) {
      expect(page.slices.length, `page ${page.part}/${page.page}`).toBeGreaterThan(0);
      for (const slice of page.slices) shown[slice.entry] += entries[slice.entry].text.slice(slice.from, slice.to);
    }
    expect(shown.flatMap((text, at) => (text === entries[at].text ? [] : [at]))).toEqual([]);
  });
});
