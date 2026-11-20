'use client';

import { useState, type ReactNode } from 'react';
import { RECORD_BOOKS, compilerOf, fromCompanion, lastPage, recordedIn, rajabOpening, recordName, type AppHadith, type FortyBook, type FortyEntry, type FortyGrade, type FortyRecord, type RajabChapter, type RajabParagraph } from '@shared/hadith';
import { num } from '@shared/quran/arabicNumber';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import CardWithRow from '@/components/common/CardWithRow';
import Reference from '@/components/common/Reference';
import { UnderCard } from '@/components/common/UnderCard';
import Chip from '@/components/common/Chip';
import Folded from '@/components/common/Folded';
import Segmented from '@/components/common/Segmented';
import type { FortyBooks, FortyListItem } from '@/lib/forty';
import FortyIsnad from './FortyIsnad';
import HadithBooks from './HadithBooks';

/**
 * The Forty's pieces on the website (the app's mobile/src/screens/hadithForty.tsx, hadith.tsx and components/IbnRajab.tsx):
 * a hadith whole with its records drawn or read, the scholars' grades and Ibn Rajab's explanation; the hadith tab's card.
 * The hadith page, the feed's cards and the quiz's look-up all draw them.
 */
type Mode = 'drawing' | 'text';
// The owner's names (2026-11-18): the drawing, and the whole text with its isnad.
const MODES: { key: Mode; label: string }[] = [{ key: 'drawing', label: 'الرسم' }, { key: 'text', label: 'النص كاملًا' }];
const BODY = 'text-[1.1875rem] leading-[1.9]';

const pagesName = (pages: number[]) => (pages.length > 1 ? `ص ${num(pages[0])}–${num(pages[pages.length - 1])}` : `ص ${num(pages[0])}`);
/** A page of one of the Forty's books on Shamela, by the page's id there. */
export const shamelaPage = (books: Pick<FortyBooks, FortyBook> | Partial<FortyBooks>, book: FortyBook, id: number) => `https://shamela.ws/book/${books[book]!.shamela}/${id}`;

/** A source's page: the book on its card's line, the place (linked to Shamela's page) and the edition in its sheet (the app's Cite). */
function Cite({ book, place, url }: { book: { title: string; edition: string }; place: string; url: string }) {
  return <Reference title={book.title} quotes={[{ text: '', cite: place, url }, { text: `${book.title}، ${book.edition}` }]} />;
}

/** One record: the drawn chain with the saying under it, or the whole text, the chain in muted ink before the saying. */
function Record({ record, mode, books, size }: { record: FortyRecord; mode: Mode; books: FortyBooks; size: AppHadith['size'] }) {
  const chain = record.isnadEnd ? record.text.slice(0, record.isnadEnd) : '';
  const saying = record.text.slice(chain.length);
  return (
    <div className="flex flex-col gap-2.5">
      {mode === 'drawing' && record.isnad
        ? <><FortyIsnad isnad={record.isnad} size={size} /><p className={BODY}>{saying}</p></>
        : <p className={BODY}><span className="text-[var(--home-muted)]">{chain}</span>{saying}</p>}
      {record.from && <p className="text-sm text-[var(--home-muted)]">{record.mursal ? `مرسلًا، عن ${record.from}` : `من حديث ${record.from}`}</p>}
      <Cite book={books[record.book]} place={`${recordName(record, num, books)}، ج ${num(record.volume)}، ${pagesName(record.pages)}`} url={shamelaPage(books, record.book, record.shamela)} />
    </div>
  );
}

/** A book's records for the hadith: the first in full, the others (Muslim's other routes, another place) folded under it. */
function BookRecords({ title, records, mode, books, size, heading: Heading = 'h2' }: { title: string; records: FortyRecord[]; mode: Mode; books: FortyBooks; size: AppHadith['size']; heading?: 'h2' | 'h3' }) {
  const firstWhole = records.find(record => !record.partial) ?? records[0];
  const rest = records.filter(record => record !== firstWhole);
  return (
    <CardWithRow className="flex flex-col gap-2.5 p-4">
      <Heading className="text-[1.0625rem] font-bold">{title}</Heading>
      {firstWhole.partial && <p className="text-sm text-[var(--home-muted)]">فيه بعض لفظ الحديث</p>}
      <Record record={firstWhole} mode={mode} books={books} size={size} />
      {rest.length > 0 && (
        <Folded bare credit={firstWhole.book === 'muslim' ? `طرق أخرى عند مسلم (${num(rest.length)})` : `مواضع أخرى في ${books[firstWhole.book].title} (${num(rest.length)})`}>
          {rest.map((record, i) => (
            <div key={`${record.number}-${i}`} className="mt-1.5 flex flex-col gap-1.5">
              {record.partial && <p className="text-sm text-[var(--home-muted)]">فيه بعض لفظ الحديث</p>}
              <Record record={record} mode={mode} books={books} size={size} />
            </div>
          ))}
        </Folded>
      )}
    </CardWithRow>
  );
}

/** «الأربعون النووية، ص ٦٣» or «سنن الترمذي ٢٥١٨، ج ٤، ص ٦٦٨»: where a grade is printed. */
const gradePlace = (grade: FortyGrade, books: FortyBooks) => {
  const book = books[grade.book];
  if (grade.book === 'nawawi') return `${book.title}، ${pagesName(grade.pages)}`;
  if (grade.book === 'ibnrajab') return `${book.title}، ${num(grade.volume)}/ ${num(grade.pages[0])}${grade.pages.length > 1 ? `–${num(grade.pages[grade.pages.length - 1])}` : ''}`;
  return `${recordName({ book: grade.book, number: grade.number! }, num, books)}، ج ${num(grade.volume)}، ${pagesName(grade.pages)}`;
};

/** A grade longer than a few lines (Ibn Rajab's whole discussion of the routes) opens on «المزيد». */
const LONG_GRADE = 300;

function Grade({ grade, books }: { grade: FortyGrade; books: FortyBooks }) {
  const [open, setOpen] = useState(false);
  const long = grade.quote.length > LONG_GRADE;
  return (
    <div className="flex flex-col gap-1 border-s-2 border-[var(--home-rule)] ps-2.5">
      <p className="text-sm text-[var(--home-muted)]">{grade.by}</p>
      <p className={`${BODY} ${long && !open ? 'line-clamp-5' : ''}`}>{grade.quote}</p>
      {long && <Button variant="ghost" size="sm" className="self-start" onClick={() => setOpen(was => !was)} aria-label={open ? 'اطو الكلام' : `اقرأ كلام ${grade.by} كاملًا`}>{open ? 'أقل' : 'المزيد'}</Button>}
      <Cite book={books[grade.book]} place={gradePlace(grade, books)} url={shamelaPage(books, grade.book, grade.shamela)} />
    </div>
  );
}

/** «جامع العلوم والحكم، ٢/ ١٥٠»: a paragraph's place, as the edition's two parts are cited. */
const rajabPlace = (title: string, paragraph: Pick<RajabParagraph, 'volume' | 'page'>) => `${title}، ${num(paragraph.volume)}/ ${num(paragraph.page)}`;
function rajabRange(title: string, first: RajabParagraph, last: RajabParagraph) {
  const end = lastPage(last);
  if (first.volume !== last.volume) return `${rajabPlace(title, first)}–${num(last.volume)}/ ${num(end)}`;
  return end === first.page ? rajabPlace(title, first) : `${rajabPlace(title, first)}–${num(end)}`;
}
/** A paragraph's text cut where each page it runs onto starts, with that page. */
const pieces = (paragraph: RajabParagraph) => {
  const turns = paragraph.turns ?? [];
  return [{ page: paragraph.page, at: 0 }, ...turns].map((turn, i) => ({ page: turn.page, text: paragraph.text.slice(turn.at, turns[i]?.at ?? paragraph.text.length).trim() }));
};

/**
 * Ibn Rajab's words on a hadith: his explanation's opening, then the whole chapter a click away, each page marked, and its
 * reference. The hadith page shows it and the feed card one passage of it (`only`).
 */
export function IbnRajab({ chapter, only, books }: { chapter?: RajabChapter; only?: RajabParagraph[]; books: Pick<FortyBooks, 'ibnrajab'> }) {
  const [whole, setWhole] = useState(false);
  const shown = whole && chapter ? chapter.paragraphs : only ?? (chapter ? rajabOpening(chapter) : []);
  if (!shown.length) return null;
  const book = books.ibnrajab;
  return (
    <div className="flex flex-col gap-2">
      {shown.map((paragraph, i) => (
        <div key={`${paragraph.shamela}-${i}`} className="flex flex-col gap-1">
          {i > 0 && paragraph.page !== lastPage(shown[i - 1]) && <p className="text-end text-[0.8125rem] text-[var(--home-muted)]">{`${num(paragraph.volume)}/ ${num(paragraph.page)}`}</p>}
          {/* A page that starts inside a paragraph is marked in its line, so the sentence it cuts reads on. */}
          <p className="text-[1.125rem] leading-[1.9]">{pieces(paragraph).map((piece, j) => <span key={j}>
            {j > 0 && <span className="text-[0.8125rem] text-[var(--home-muted)]">{` [${num(paragraph.volume)}/ ${num(piece.page)}] `}</span>}
            {piece.text}
          </span>)}</p>
        </div>
      ))}
      {!only && chapter && <UnderCard><Button variant="ghost" size="sm" onClick={() => setWhole(was => !was)}
        aria-label={whole ? 'اطو الشرح' : 'اقرأ شرح ابن رجب للحديث كاملًا'}>{whole ? 'أقل' : 'الشرح كاملًا'}</Button></UnderCard>}
      <Cite book={book} place={rajabRange(book.title, shown[0], shown[shown.length - 1])} url={`https://shamela.ws/book/${book.shamela}/${shown[0].shamela}`} />
    </div>
  );
}

/**
 * One of the Forty whole: its heading and Companion, al-Nawawi's text, then each book he names with its records, drawn or
 * read, and Ibn Rajab's explanation. `inset` inside another page (the quiz's look-up); `jibril` goes under al-Nawawi's text.
 */
export function FortyHadith({ entry, books, chapter, size, inset = false, jibril }: { entry: FortyEntry; books: FortyBooks; chapter: RajabChapter | null; size: AppHadith['size']; inset?: boolean; jibril?: ReactNode }) {
  const [mode, setMode] = useState<Mode>('drawing');
  const Name = inset ? 'h2' : 'h1';
  const Heading = inset ? 'h3' : 'h2';
  const grouped = RECORD_BOOKS.map(book => ({ book, records: entry.records.filter(record => record.book === book) })).filter(({ records }) => records.length > 0);
  const drawn = entry.records.some(record => record.isnad);
  // al-Nawawi's text, or Ibn Rajab's for the eight he adds (43–50).
  const compiler = compilerOf(entry);
  const book = books[compiler.book];
  return (
    <div dir="rtl" lang="ar" className="flex flex-col gap-3.5 text-[var(--home-ink)]">
      <div className="flex flex-col gap-0.5">
        <Name className="text-[1.625rem]">{entry.heading}</Name>
        <p className="text-[var(--home-muted)]">{fromCompanion(entry.companion)}</p>
      </div>
      <CardWithRow className="flex flex-col gap-2 p-4">
        <p className={BODY}>{entry.text}</p>
        <Cite book={book} place={`${book.title}، ${entry.volume ? `${num(entry.volume)}/ ${num(entry.pages[0])}` : pagesName(entry.pages)}`} url={shamelaPage(books, compiler.book, entry.shamela)} />
      </CardWithRow>
      <Heading className="text-lg">من أخرجه</Heading>
      <HadithBooks top={entry.heading} boxes={recordedIn(entry)} namer={compiler.name} />
      {jibril}
      {drawn && <Segmented tabs label="طريقة العرض" className="self-start" options={MODES.map(item => ({ ...item, current: mode === item.key, onClick: () => setMode(item.key) }))} />}
      {entry.partial && entry.records.length > 0 && <p className="text-[0.9375rem] text-[var(--home-muted)]">في الصحيحين بعض لفظ الحديث</p>}
      {entry.grades && <CardWithRow className="flex flex-col gap-3.5 p-4">
        <Heading className="text-[1.0625rem] font-bold">ما قاله العلماء في درجته</Heading>
        {entry.grades.map((grade, i) => <Grade key={`${grade.by}-${i}`} grade={grade} books={books} />)}
      </CardWithRow>}
      {grouped.map(({ book, records }) => <BookRecords key={book} title={`في ${books[book].title}`} records={records} mode={mode} books={books} size={size} heading={Heading} />)}
      {chapter && <>
        <Heading className="text-lg">من شرح ابن رجب</Heading>
        <CardWithRow className="flex flex-col p-4"><IbnRajab chapter={chapter} books={books} /></CardWithRow>
      </>}
    </div>
  );
}

/** One of the Forty in a list: his number, the Companion, the opening of his text and the books he names (the app's FortyCard). */
export function FortyCard({ item, href, onClick }: { item: FortyListItem; href?: string; onClick?: () => void }) {
  const inside = <>
    <span className="flex justify-between gap-2">
      <span className="text-[0.9375rem] text-[var(--home-accent)]">{item.heading}</span>
      <span className="text-sm text-[var(--home-muted)]">{item.companion}</span>
    </span>
    <span className="line-clamp-3 text-[1.0625rem] leading-[1.8]">{item.start}</span>
    <span className="flex flex-wrap gap-1.5">{item.named.map(book => <Chip key={book} label={book} small />)}</span>
  </>;
  const look = 'flex flex-col gap-1 px-3.5 py-2.5';
  return href
    ? <Card href={href} aria-label={`${item.heading}، ${fromCompanion(item.companion)}`} className={look}>{inside}</Card>
    : <Card as="button" onClick={onClick} aria-label={`${item.heading}، ${fromCompanion(item.companion)}`} className={`${look} w-full`}>{inside}</Card>;
}
