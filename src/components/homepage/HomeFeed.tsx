'use client';

import { createContext, Fragment, isValidElement, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeftRight, Bookmark, BookOpen, Check, CircleMinus, Clock, Compass, Feather, Layers, LibraryBig, Users, EyeOff, LightbulbOff, Plus, Presentation, ScrollText, Sparkles, Undo2, Swords, BookOpenText, ListTree, ListStart, MessagesSquare, Link2, History, Network, GitCommitVertical } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import LoadingDots from '@/components/common/LoadingDots';
import Segmented from '@/components/common/Segmented';
import Saying from '@/components/common/Saying';
import { DRAWING_OR_TEXT, type DrawingOrText } from '@shared/drawingText';
import Cookies from 'js-cookie';
import StoryMap from '@/app/quran/prophets/[slug]/StoryMap';
import type { FeedPair, FeedTree, SavedContent, SiraCard, StoryCard } from '@/lib/homeFeed';
import type { TermCard } from '@/lib/balaghaTerms';
import type { HadithCard } from '@/lib/forty';
import type { SahihCard } from '@/lib/sahih';
import { SahihHadithView } from '@/components/hadith/SahihParts';
import type { NameCard, TarajimCard } from '@/lib/tarajim';
import { betweenHref, NasabTree, nasabHref, TieSays, TiesChain, tiesHref, TiesRing } from '@/components/tarajim/TarajimParts';
import type { RingTie } from '@/lib/tarajim';
import type { DrawingCard } from '@/lib/drawingCards';
import BattleMap from '@/components/battles/BattleMap';
import { Counts } from '@/components/battles/BattleView';
import { Bubbles, sceneColours } from '@/components/hadith/HadithBody';
import { OpeningRows } from '@/app/quran/openings/OpeningsView';
import { OathWords, oathAnchor } from '@/app/quran/oaths/OathsView';
import EventPlaces from '@/app/quran/prophets/[slug]/EventPlaces';
import { oathPlace } from '@shared/quran/oaths';
import LifeTimeline from '@/components/tarajim/LifeTimeline';
import { IbnRajab } from '@/components/hadith/FortyParts';
import HadithBooks from '@/components/hadith/HadithBooks';
import FortyIsnad from '@/components/hadith/FortyIsnad';
import { compilerOf, fromCompanion } from '@shared/hadith';
import { ExampleAyat, ayatName, quotesTitle, termHref } from '@/components/balagha/TermParts';
import BookRuns from '@/components/quran/text/BookRuns';
import { plainName } from '@shared/quran/balaghaTerms';
import { Report } from '@/components/stories/StoryView';
import StoryAyatLines from '@/components/stories/StoryAyatLines';
import { Moment } from '@/components/battles/BattleMoments';
import { battleLine } from '@shared/battles/battle';
import { rangeName } from '@shared/stories/story';
import { bookmarkKind, cardBookmarkId, cardMenuSaveId, isCardBookmark } from '@shared/bookmarkKind';
import { drawsCard } from '@/lib/feedCardKinds';
import type { SavedFeedCard } from '@/lib/feedCard';
import type { Bookmark as SavedItem } from '@shared/bookmarks';
import { useRouter } from 'next/navigation';
import TreeViewCard from '@/app/quran/branches/TreeViewCard';
import { BRANCH_VIEW_COOKIE, defaultBranchView } from '@shared/quran/branchView';
import { Card as CompareCard } from '@/app/quran/compare/PairCompare';
import RecitePill from '@/components/recite/RecitePill';
import { useRecite } from '@/components/recite/useRecite';
import { usePenRule } from '@/lib/penRule';
import { pageModel } from '@shared/quran/recitePage';
import { usePageGestures } from '@/app/quran/read/usePageGestures';
import { readGestures, type GestureAction } from '@shared/readerGestures';
import { surahPairHref } from '@shared/quran/curatedComparisons';
import { LAST_PAGE_KEY } from '@/app/quran/read/ReaderView';
import { lastPage } from '@/app/quran/read/OpenLastPage';
import { placeStore, prayerTimes, settingsStore, useNow } from '@/components/utilities/Utilities';
import { clock, DEFAULT_PRAYER_SETTINGS, FIVE, METHODS, PRAYER_NAMES, type PrayerDay, type PrayerKey } from '@shared/prayer';
import { feedRound, hasBooksCard, hasJuzCard, inMinutes, insertAt, feedBooks, LIST_KINDS, prayerSoon, type FeedSlot, type ListKind } from '@shared/homeFeed';
import { answeredQuestion, dueSeeds, readMissed } from '@shared/quiz/missedQuestions';
import { questionPoints } from '@shared/quiz/score';
import type { NoteBody } from '@shared/quran/ayahNoteBody';
import AyahPreviewSheet, { type Preview } from '@/app/quran/read/AyahPreviewSheet';
import SadiText from '@/components/quran/SadiText';
import { QuranWord } from '@/components/quran/text/AyahFlow';
import { ExampleScene } from '@/app/quran/lataif/LataifView';
import type { ExampleView } from '@shared/quran/iltifat';
import { topicOf, type LataifReference } from '@shared/quran/lataif';
import { BOOKS } from '@shared/books';
import { isReaderBook } from '@shared/readerBooks';
import { BookCard, TuhfaCard } from '@/app/quran/books/BooksShelf';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { savedAs } from '@shared/compareBookmarks';
import { continuePage, readFasilas, serverFasilas, subscribeFasilas } from '@shared/readingMarks';
import { ayahBookmarkId, ayahHref, markAyah, markWord, wordMarkKey, markForgotten, mostForgotten, readDueMarks, rememberAyah, serverAyahMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { isMemorized, memorizedFilters, memorizedPrefer, memorizedQuestions, recallOfDay, touchesMemorized, type Memorized } from '@shared/memorized';
import { FEED_QUIZ_NAMES, feedQuizSeed, OPENINGS, openingSurah, type FeedQuizKind } from '@shared/quiz/feedQuiz';
import { activeInterests, INTERESTS, interestById, pickedInterests, restoredInterest, surpriseMe, toggledInterest } from '@shared/interests';
import QuizAnswer, { type QuizData } from '@/app/quizzes/QuizAnswer';
import type { Hints } from '@shared/quiz/hints';
import { backToVisit, FEED_AHEAD, FEED_FAR, growingPicks, savedOfSlot, leftVisit, markFeedSeen, readFeedSeen, serverFeedSeen, subscribeFeedSeen, subscribeVisit, visitStart, serverVisit, type Seen } from '@shared/feedSeen';
import { forgottenOrder, reviewHref, type RecitePosition } from '@shared/quran/recite';
import type { PairCard } from '@shared/quran/compareCards';
import { hijriDate, juzLabel, todaysJuz } from '@shared/hijri';
import { JUZ_STARTS } from '@shared/quran/juz';
import { num } from '@shared/quran/arabicNumber';
import { ayahPlaces } from '@shared/quran/ayahPlaces';
import { dayNumber } from '@shared/dailyPick';
import { isKahfDay, KAHF_SLOT } from '@shared/homeFeed';
import surahRows from '@shared/data/quran/surahs.json';
import AyahLines, { PageTop, useAyahPage, type Page } from './AyahLines';
import { useMemorized } from './Memorized';
import styles from './Homepage.module.css';
import { SURAH_NAMES } from '@shared/quran/surahNames';
import { QiraatPlace } from '@/app/quran/qiraat/QiraatView';
import { surahName } from '@shared/quran/surahNames';
import Card from '@/components/common/Card';
import CappedCard from '@/components/common/CappedCard';
import MoreMenu from '@/components/common/MoreMenu';
import Button from '@/components/common/Button';
import { CardRowProvider, useRowSlot } from '@/components/common/UnderCard';
import SourceLine, { sourcesOf } from '@/components/common/SourceLine';
import { SourceSlotContext, type Source } from '@/components/common/sourceSlot';
import { citeSource, mushafSource, MUSHAF_BOOK, type QuizSource } from '@shared/quiz/sources';
import { qiraatSources } from '@shared/quiz/bookSources';
import { storySource } from '@shared/quran/pieceSources';
import { termSource } from '@shared/quran/balaghaTerms';

/**
 * The website's home feed, as the app's (mobile/src/components/HomeFeed.tsx): the page the mushaf was left on, then the
 * app's feed in its order (shared/homeFeed.ts feedRound), skipping what this browser has seen (shared/feedSeen.ts) and loading more near the end.
 */

const names: Record<number, string> = SURAH_NAMES;
const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url);
  return response.json();
};

/** Pieces already asked for on this page: the feed only grows at its end, so a longer feed asks again only for its last piece. */
const pieceCache = new Map<string, Promise<unknown>>();
const fetchPiece = <T,>(url: string): Promise<T> => {
  if (!pieceCache.has(url)) pieceCache.set(url, fetchJson<T>(url).catch(error => { pieceCache.delete(url); throw error; }));
  return pieceCache.get(url) as Promise<T>;
};
/** Asks for the offsets FEED_AHEAD at a time (the most the API sends at once), in parallel. */
const inPieces = <T,>(url: (offsets: number[]) => string, offsets: number[]): Promise<T[]> =>
  Promise.all(Array.from({ length: Math.ceil(offsets.length / FEED_AHEAD) }, (_, at) => fetchPiece<T>(url(offsets.slice(at * FEED_AHEAD, (at + 1) * FEED_AHEAD)))));


/** The reader's own day, worked out in the browser (null while the page is drawn on the server). */
function useToday() {
  const now = useNow();
  return useMemo(() => now ? { day: dayNumber(now), date: hijriDate(now), juz: todaysJuz(now), kahf: isKahfDay(now) } : null, [now]);
}

/** Friday's card (owner, 2026-11-20), the app's KahfPost: Surat al-Kahf's first page; its button opens the mushaf there. */
function KahfPost() {
  const { data } = useSWR('/api/home/feed?ayah=18:1', fetchJson<Page>, { revalidateOnFocus: false });
  const href = ayahHref('18:1');
  return <Post labelledBy="kahf-title" head={<PostHead Icon={BookOpen} id="kahf-title" title="سورة الكهف" sub="يوم الجمعة" />}
    open={<Action Icon={BookOpen} label="اقرأ سورة الكهف" href={href} />}
    source={data ? [mushafSource('18:1', data.page)] : undefined}>
    <div className={styles.pageSlice} lang="ar">
      {data ? <PageTop page={data} /> : <span className={styles.pageLines} />}
    </div>
  </Post>;
}

/** The reading card: the first lines of the page at the mushaf's فاصلة (else the page it was left on), a button there, and today's date and juz. */
export function ContinueReading() {
  const today = useToday();
  const [last, setLast] = useState<number | null>(null);
  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(LAST_PAGE_KEY); } catch {}
    setLast(lastPage(stored));
  }, []);
  const fasilas = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas);
  const { page, fasila } = last === null ? { page: null, fasila: false } : continuePage(fasilas, last);
  const { data } = useSWR(page ? `/api/home/feed?page=${page}` : null, fetchJson<Page & { surah: number }>, { revalidateOnFocus: false });
  const href = `/quran/read/${page ?? 1}`;
  const where = [data && names[data.surah], today?.date?.replace(/ هـ$/, '')].filter(Boolean).join(' · ');
  return <Post labelledBy="reading-title" head={<PostHead Icon={BookOpen} id="reading-title" title={fasila || (page && page > 1) ? 'تابع القراءة' : 'ابدأ القراءة'} sub={where || undefined} />}
    open={<Action Icon={BookOpen} label={fasila ? 'افتح المصحف عند فاصلتك' : 'افتح المصحف حيث توقفت'} href={href} />}
    source={data ? [{ book: MUSHAF_BOOK, at: `${names[data.surah]}، ص ${num(data.page)}` }] : undefined}
    // The juz of the page it opens on (the app's): today's juz is its own card in the feed (owner, 2026-11-18).
    actions={data ? <span className="p-2 text-sm text-[var(--home-muted)]">{juzLabel([data.data.juz])}</span> : undefined}>
    <div className={styles.pageSlice} lang="ar">
      {/* The page's first half as the reader draws it (owner, 2026-11-14). */}
      {data ? <PageTop page={data} /> : <span className={styles.pageLines} />}
    </div>
  </Post>;
}

/** A feed card's head: a round icon, a title and a line under it, like a post's author; the row's open button opens the post's page. */
function PostHead({ Icon, title, sub, id }: { Icon: typeof BookOpen | typeof TreeIcon; title: string; sub?: string; id?: string }) {
  return <div className={styles.postHead}>
    <span className={styles.avatar}><Icon size={18} aria-hidden /></span>
    <div className="min-w-0"><h3 id={id}>{title}</h3>{sub && <p className={`${styles.muted} ${styles.oneLine}`}>{sub}</p>}</div>
  </div>;
}

/**
 * Every feed post's one shape (owner, 2026-11-14 and 2026-11-20, like an Instagram post), the app's (mobile HomeFeed's
 * Post): the head, the body in one card, the row of icon buttons under it grouped on the right (the open button, the
 * card's tools, save, share) with the «⋯» alone on the left, then the source line. The row's open button is the one way to
 * the item's page (owner, 2026-11-20: one control per destination). A long card stops at two thirds of the screen, the rest
 * in a sheet (common/CappedCard).
 */
function Post({ head, open, actions, share, source, lines = [], bar, labelledBy, save, whole = false, children }: { head: React.ReactNode;
  /** Opens the item in its own reader (the mushaf at the ayah, the hadith in its book): first in the row. */
  open?: React.ReactNode;
  actions?: React.ReactNode;
  /** The card's share button, last of the group, after save. */
  share?: React.ReactNode;
  /** The books the card stands on, named on its source line; a `Reference` inside the card joins its sheet. */
  source?: QuizSource[];
  /** A source line of the card's own that is not a book (the prayer card's way of working out the times; a scene's reference). */
  lines?: Source[];
  /** A bar of the card's own between it and its buttons (recall's recite bar). */
  bar?: React.ReactNode; labelledBy?: string;
  /** The card's kind and item, saved as `card:<kind>:<item>` by the first button of its row (owner 2026-11-20, as the app's CardMenuActions). */
  save?: { kind: string; item: string };
  /** Never capped (owner, 2026-11-20): a question shows all its choices, a recall card its whole ayah. */
  whole?: boolean; children: React.ReactNode }) {
  // What the card's content hands up with UnderCard lands at the start of the row under the card (owner: buttons under the
  // card, never in it); the row hides while it holds no button.
  const [slot, setSlot] = useRowSlot();
  // The row under the copy of a capped card in its sheet, where that copy's UnderCard buttons go.
  const [sheetSlot, setSheetSlot] = useRowSlot();
  const [handed, setHanded] = useState<[string, Source][]>([]);
  const sourceSlot = useMemo(() => ({ set: (id: string, given: Source | null) => setHanded(now => {
    const rest = now.filter(([at]) => at !== id);
    if (!given) return rest.length === now.length ? now : rest;
    const at = now.findIndex(([key]) => key === id);
    return at < 0 ? [...now, [id, given]] : now.map(entry => (entry[0] === id ? [id, given] : entry));
  }) }), []);
  const own = [...(source ? sourcesOf(source) : []), ...lines];
  const inner = handed.map(([, given]) => given);
  const row = (ref: (element: HTMLElement | null) => void, more?: React.ReactNode) => <>
    {bar && <div className="mt-2 flex justify-center" data-share-skip>{bar}</div>}
    <div className={styles.postActions} data-share-skip>{open}<span ref={ref} className="contents" />{actions}{save && <SaveCard {...save} head={head} />}{share}{more}</div>
  </>;
  const sources = own.length + inner.length > 0 && <SourceLine named={own.length ? own : inner} sources={[...own, ...inner]} />;
  const content = <SourceSlotContext.Provider value={sourceSlot}><CardRowProvider slot={slot}>{children}</CardRowProvider></SourceSlotContext.Provider>;
  const body = <>
    {head}
    {whole ? <Card className="overflow-hidden">{content}</Card> : <CappedCard className="overflow-hidden" whole={<>
      <Card className="overflow-hidden"><SourceSlotContext.Provider value={NO_SOURCES}><CardRowProvider slot={sheetSlot}>{children}</CardRowProvider></SourceSlotContext.Provider></Card>
      {row(setSheetSlot)}
      {sources}
    </>}>{content}</CappedCard>}
    {row(setSlot, <NotMine />)}
    {sources}
  </>;
  // The reading card is a section of the page named by its head (`labelledBy`); the feed's posts are articles.
  return labelledBy
    ? <section className={styles.postWrap} dir="rtl" aria-labelledby={labelledBy}>{body}</section>
    : <article className={styles.postWrap} dir="rtl">{body}</article>;
}

/** In the sheet that shows a capped card whole, the card's references stay on the source line at the sheet's foot. */
const NO_SOURCES = { set: () => {} };

/** A feed card's save, after its tools and before share; the saved shelf names it by the card's head (its title and line). */
function SaveCard({ kind, item, head }: { kind: string; item: string; head: React.ReactNode }) {
  const saved = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const id = cardMenuSaveId(kind, item);
  if (!id) return null;
  const on = saved.some(each => each.id === id);
  const text = isValidElement<{ title?: string; sub?: string }>(head) ? [head.props.title, head.props.sub].filter(Boolean).join(' · ') : '';
  return <Action Icon={Bookmark} label={on ? 'أزلها من المحفوظات' : 'احفظ البطاقة'} on={on} onClick={() => toggleBookmark({ id, text, href: '' })} />;
}

/**
 * The feed card's interest and what «ليس من اهتماماتي» does on it (the app's CardMenuContext): set by the feed around each
 * card of an interest, absent on the saved shelf and the library, so the button shows only in the feed.
 */
const NotMineContext = createContext<{ interest: string; notMine?: () => void } | null>(null);

/** The card's «⋯» alone at the row's far left, holding «ليس من اهتماماتي» (owner, 2026-11-20, the app's NotMineMenu); none elsewhere. */
function NotMine() {
  const menu = useContext(NotMineContext);
  return <MoreMenu items={menu?.notMine ? [{ Icon: CircleMinus, name: 'ليس من اهتماماتي', label: `«${interestById(menu.interest)?.name ?? ''}» ليس من اهتماماتي`, onClick: menu.notMine }] : []} />;
}

/** In a card's place after «ليس من اهتماماتي»: what was taken out, and a button to put it back (the app's RemovedLine). */
function RemovedLine({ interest, onUndo }: { interest: string; onUndo: () => void }) {
  const name = interestById(interest)?.name ?? '';
  return <Card dashed dir="rtl" className="flex items-center gap-2 px-3 py-2">
    <p className="flex-1 text-[var(--home-ink)]">{`أُزيل «${name}» من اهتماماتك`}</p>
    <Button variant="muted" onClick={() => { pickedInterests.write(restoredInterest(pickedInterests.read(), interest)); onUndo(); }}><Undo2 aria-hidden />تراجع</Button>
  </Card>;
}

/** One icon button of a post's row: a link with `href`, else a button; `on` lights it, `tone` colours it. */
function Action({ Icon, label, href, onClick, on, tone, disabled }: { Icon: typeof BookOpen | typeof TreeIcon; label: string; href?: string; onClick?: () => void; on?: boolean; tone?: 'green'; disabled?: boolean }) {
  const className = [styles.action, on && styles.actionOn, tone === 'green' && styles.green].filter(Boolean).join(' ');
  const icon = <Icon size={22} aria-hidden />;
  return href
    ? <Link href={href} onClick={onClick} aria-label={label} title={label} className={className}>{icon}</Link>
    : <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} aria-pressed={on} className={className}>{icon}</button>;
}

const compareNames = Object.fromEntries(surahRows.map(row => [row.number, { ar: surahName(row.number), en: row.nameTransliterated }]));

/** A look-alike pair as a post: the compare page's own card (read-along, views, saving, sharing), and a link to open it there. */
function PairPost({ pair }: { pair: FeedPair }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const [a, b] = pair.sides;
  const label = (side: PairCard['sides'][number]) => `${names[side.surah]} ${num(side.ayat[0].number)}`;
  return <article dir="rtl">
    <PostHead Icon={ArrowLeftRight} title="آيتان متشابهتان" sub={`${label(a)} · ${label(b)}`} />
    <ul className="list-none p-0">
      <CompareCard card={pair} names={compareNames} ar savedIds={savedAs(pair.id, bookmarks)} page={surahPairHref(a.surah, b.surah)} view={defaultBranchView(Cookies.get(BRANCH_VIEW_COOKIE))} aside={<NotMine />} />
    </ul>
    <SourceLine named={sourcesOf(pair.sources)} sources={sourcesOf(pair.sources)} />
  </article>;
}

/** Today's ayah from the memorized range that the reader said they remembered: it leaves the feed until the page reloads. */
const recalled = new Set<string>();
/** Whether the recall card asks to write the whole ayah (on) or reveals it word by word (off). */
const RECALL_WRITE = 'recall-write';

/**
 * An ayah to recall in the mushaf's own lines, asked as recite mode asks it (owner, 2026-11-14): its words hidden, and
 * recite mode's own bar and pen (components/recite) reveal or write it; a mistake puts it on the forgotten shelf, as in the
 * reader. A forgotten ayah that is due comes with the review link and «تذكّرتها» rests it; an ayah of the day from what is
 * memorized (`review` absent) has «نسيتها» too.
 */
function ForgottenPost({ ayah: mark, review, title = 'هل تذكرها؟' }: { ayah: string; review?: string; title?: string }) {
  // A forgotten word is asked alone, in its ayah's lines (the app's).
  const ayah = markAyah(mark);
  const [, setGone] = useState(0);
  const [writing, setWriting] = useState(false);
  useEffect(() => { try { setWriting(localStorage.getItem(RECALL_WRITE) === 'true'); } catch {} }, []);
  const toggleWriting = () => setWriting(on => { try { localStorage.setItem(RECALL_WRITE, String(!on)); } catch {} return !on; });
  const [surah, number] = ayah.split(':').map(Number);
  if (!review && recalled.has(ayah)) return null;
  return <Recall key={`${mark}-${writing}`} ayah={ayah} targetWord={markWord(mark)} title={title} sub={`${names[surah]} ${num(number)}`} writing={writing} onWriting={toggleWriting}
    open={<Action Icon={BookOpen} label="في المصحف" href={ayahHref(ayah)} />}>
    <Action Icon={Check} label="تذكّرتها" tone="green" onClick={() => { if (review) rememberAyah(mark); else { recalled.add(ayah); setGone(n => n + 1); } }} />
    {!review && <Action Icon={LightbulbOff} label="نسيتها" onClick={() => { recalled.add(ayah); markForgotten(ayah); setGone(n => n + 1); }} />}
    {review && <Action Icon={EyeOff} label="راجع ما نسيت" href={review} />}
  </Recall>;
}

/**
 * The recall card itself (the app's Recall): recite mode on one ayah (components/recite, the mushaf's own), with its bar
 * under the card, stopping at the ayah's end. A tap, double tap or long press on the ayah does what it does in recite mode
 * (the reader's gesture settings, read/usePageGestures); the pen writes what the pen setting asks. Drawn afresh for each way
 * of asking (`writing`).
 */
function Recall({ ayah, targetWord, title, sub, writing, onWriting, open, children }: { ayah: string; targetWord?: number; title: string; sub: string; writing: boolean; onWriting: () => void; open: React.ReactNode; children: React.ReactNode }) {
  const { pages, words } = useAyahPage(ayah);
  const model = useMemo(() => (pages ? pageModel(pages.data, pages.top) : null), [pages]);
  const [position, setPosition] = useState<RecitePosition>({ start: ayah, ...(targetWord !== undefined ? { word: targetWord } : {}), shown: null, words: 0 });
  const pen = usePenRule();
  const recite = useRecite({ model, position, setPosition, writing, pen, until: ayah });
  const run = (action: GestureAction, key: string | undefined) => {
    if (action === 'next-ayah') recite.nextAyah();
    else if (action === 'next-word') recite.nextWord();
    else if (action === 'back') recite.back();
    else if (key !== ayah) return;
    else if (action === 'forgot') markForgotten(targetWord === undefined ? ayah : wordMarkKey(ayah, targetWord));
    else if (action === 'save' && words) toggleBookmark({ id: ayahBookmarkId(ayah), text: words.join(' '), href: ayahHref(ayah) });
  };
  const lines = useRef<HTMLDivElement>(null);
  usePageGestures(lines, {
    onGesture: (gesture, target) => {
      // While writing, a touch on the ayah only brings the keyboard back, as in the reader; the boxes pick a word themselves.
      if (recite.write) recite.boxes.focus();
      else run(readGestures().recite[gesture], target.closest<HTMLElement>('[data-ayah]:not([data-veiled])')?.dataset.ayah);
    },
    waitForDouble: () => readGestures().recite.double !== 'none',
  });
  return <Post head={<PostHead Icon={LightbulbOff} title={title} sub={sub} />} whole
    bar={<RecitePill recite={recite} writing={writing} onWriting={onWriting} />}
    open={open} actions={children} source={[mushafSource(ayah, pages?.page)]}>
    <div ref={lines} className={styles.recall}>
      {!pages && <LoadingDots label="جارٍ التحميل" />}
      {pages && <AyahLines ayah={ayah} targetWord={targetWord} pages={pages} shown={recite.done} words={position.words} checked={recite.checked} write={recite.write ?? undefined} />}
      {recite.write && recite.boxes.field({ 'aria-label': 'اكتب الكلمة' })}
    </div>
  </Post>;
}

/**
 * The quiz buttons a question card carries (owner, 2026-11-14, in place of home's quiz box): a solo quiz, a quiz with others,
 * and recite.
 */
export function QuizActions() {
  return <>
    <Action Icon={Feather} label="اختبار فردي" href="/quizzes" />
    <Action Icon={Users} label="اختبار جماعي" href="/quizzes/party" />
    <Action Icon={EyeOff} label="تسميع" href="/quran/read/recite" />
  </>;
}

/**
 * One question of the solo quiz as a post (owner, 2026-11-14): the quiz page's own question (QuizAnswer), one kind a card in
 * turn, the same question all day (`seed`). With «الأسئلة مما أحفظ فقط» on, it asks from what is memorized, as the quiz page does.
 */
function QuizPost({ kind, seed, scope }: { kind: string; seed: number; scope: Record<string, string> }) {
  const query = new URLSearchParams({ topic: kind, length: '1', seed: String(seed), ...scope });
  const { data } = useSWR(`/api/quiz?${query}`, fetchJson<QuizData>, { revalidateOnFocus: false, shouldRetryOnError: false });
  const [given, setGiven] = useState<string>();
  const [typed, setTyped] = useState<string[]>();
  const [hints, setHints] = useState<Hints>();
  const [revealed, setRevealed] = useState(false);
  const question = data?.questions?.[0];
  // Answered wrong (or looked up first), the question comes back after a rest; right, it goes (shared/quiz/missedQuestions.ts).
  const answer = (value: string) => {
    if (given === undefined && question) {
      // Several right choices or an order are right only when every part is (the quiz page's and the app's grading).
      const { earned, total } = questionPoints(question, value);
      answeredQuestion(kind, seed, !revealed && (value === question.correctAnswer || earned === total));
    }
    setGiven(value);
  };
  if (!question) return null;
  return <Post head={<PostHead Icon={kind === 'BRANCHES' ? TreeIcon : Feather} title={FEED_QUIZ_NAMES[kind as FeedQuizKind]} />} whole
    // After the answer, the ayah's mushaf button leads the card's row, as in the app (owner, 2026-11-15 and 2026-11-20).
    open={given !== undefined && question.ayahKey ? <Action Icon={BookOpen} label="في المصحف" href={ayahHref(question.ayahKey)} /> : undefined}
    actions={<QuizActions />}>
    <div className={styles.question} lang="ar">
      {question.promptArabic !== FEED_QUIZ_NAMES[kind as FeedQuizKind] && <p className="mb-3 pt-2 text-base leading-loose">{question.promptArabic}</p>}
      <QuizAnswer question={question} given={given} typed={typed} hints={hints} revealed={revealed} names={data?.surahNames ?? {}} ar mushaf={false}
        onReveal={() => setRevealed(true)} onType={setTyped} onHints={setHints} onAnswer={answer} />
    </div>
  </Post>;
}

/** The surah openings quiz as a post: a surah's first ayah to write under its name, as the openings quiz asks it in the mushaf. */
function OpeningPost({ seed, memorized }: { seed: number; memorized: Memorized | null }) {
  const surah = useMemo(() => openingSurah(seed, memorized && !('all' in memorized)
    ? Array.from({ length: 114 }, (_, i) => i + 1).filter(n => isMemorized(`${n}:1`, memorized)) : undefined), [seed, memorized]);
  return surah ? <ForgottenPost ayah={`${surah}:1`} title={FEED_QUIZ_NAMES[OPENINGS]} /> : null;
}

/**
 * A prophet's story map as a post (owner, 2026-11-14): the prophets page's own map (StoryMap), every event and surah, opened
 * sideways at the day's group; the map scrolls sideways inside the card, never down (owner, 2026-11-20). Any tap opens the story page at its top, not scrolled
 * to an event, so a new reader sees where they landed (owner, 2026-11-14).
 */
function StoryPost({ card }: { card: StoryCard }) {
  const router = useRouter();
  const href = `/quran/prophets/${card.slug}`;
  const opened = () => continueAfter('prophets', card.item);
  const read = () => { opened(); router.push(href); };
  return <Post save={{ kind: 'prophets', item: card.item }} head={<PostHead Icon={ScrollText} title={card.title} sub={card.phases[card.phase]} />}
    open={<Action Icon={BookOpen} label="افتح القصة" href={href} onClick={opened} />}
    source={[storySource(card.events, card.phase)]}>
    <div className={styles.storyMap} data-story-scroll>
      <StoryMap map={card.map} events={card.events} phases={card.phases} at={card.phase} onRead={read} />
    </div>
  </Post>;
}

/**
 * A sira story as a post (the app's SiraPost): its first report whole, so a first reader has what led to the words and what
 * came of them; the ayat it turns on folded under it. Its open button opens the story's page.
 */
function SiraPost({ card }: { card: Extract<SiraCard, { kind: 'sira' }> }) {
  const href = `/stories/${card.slug}`;
  const opened = () => continueAfter('sira', card.item);
  return <Post save={card} head={<PostHead Icon={ScrollText} title="من قصص السيرة" sub={card.name} />}
    open={<Action Icon={ScrollText} label={`افتح ${card.name}`} href={href} onClick={opened} />}
    source={[citeSource({ text: '', cite: card.report.cite, url: card.report.url })]}>
    <div className="flex flex-col gap-3 p-4" lang="ar">
      <Report report={card.report} plain />
      {card.ayat.map((item, i) => <StoryAyatLines key={item.from} credit={`${item.label}: ${rangeName(item.from, item.to)}`} pages={card.pages[i] ?? []} folded />)}
    </div>
  </Post>;
}

/** A moment of a battle in the source's words (the app's MomentPost); its open button opens the battle's page. */
function MomentPost({ card }: { card: Extract<SiraCard, { kind: 'moment' }> }) {
  const href = `/battles/${card.battle.slug}`;
  const opened = () => continueAfter('moment', card.item);
  return <Post save={card} head={<PostHead Icon={Swords} title={`من ${card.battle.name}`} sub={battleLine(card.battle)} />}
    open={<Action Icon={Swords} label={`افتح ${card.battle.name}`} href={href} onClick={opened} />}
    source={[citeSource({ text: '', cite: card.moment.cite, url: card.moment.url })]}>
    <div className="p-4" lang="ar"><Moment moment={card.moment} n={card.n} plain /></div>
  </Post>;
}

/**
 * A balagha term as a post (the app's TermPost): its name, the start of its definition in the book's words, and one of
 * al-Suyuti's examples, the ayah words he quotes lit. The first button opens the term's page.
 */
function TermPost({ card }: { card: TermCard }) {
  const name = plainName(card.term.name);
  const href = termHref(card.term.name);
  const quote = card.term.quotes[0];
  return <Post save={{ kind: 'term', item: card.item }} head={<PostHead Icon={BookOpenText} title="من مصطلحات البلاغة" sub={quote.book === 'itqan' ? 'الإتقان للسيوطي' : 'تلخيص المفتاح للقزويني'} />}
    open={<Action Icon={BookOpenText} label={`${name}: تعريفه وأمثلته`} href={href} />}
    actions={<Action Icon={ListTree} label="مصطلحات البلاغة" href="/quran/terms" />}
    source={[termSource(quote)]}>
    <div className="flex flex-col gap-1.5 px-3.5 py-3" lang="ar">
      <p className="text-2xl">{name}</p>
      {!card.term.defines && <p className="text-sm text-[var(--home-muted)]">{quotesTitle(card.term)}</p>}
      <p className="line-clamp-5 text-[1.125rem] leading-[1.85]"><BookRuns text={quote.text} /></p>
      {card.example && <>
        <hr className="my-1 border-[var(--home-rule)] opacity-60" />
        <p className="text-sm text-[var(--home-muted)]">من أمثلته</p>
        <ExampleAyat lines={card.example.lines} />
        <p className="text-[0.8125rem] text-[var(--home-muted)]">{ayatName(card.example.ayat)}</p>
      </>}
    </div>
  </Post>;
}

/**
 * One of the Forty in al-Nawawi's words, or Ibn Rajab's for his eight (the app's HadithPost), a passage of Ibn Rajab's explanation of one (its RajabPost), or
 * the books that record one (its RecordedPost); the first button opens the hadith's page with its records.
 */
function HadithPost({ card }: { card: HadithCard }) {
  const { entry, books } = card;
  const href = `/hadith/forty/${entry.n}`;
  const open = <Action Icon={MessagesSquare} label={`افتح ${entry.heading}`} href={href} />;
  const sub = `${entry.heading}، ${fromCompanion(entry.companion)}`;
  if (card.kind === 'recorded') return <Post save={card} head={<PostHead Icon={Network} title="من أخرجه" sub={sub} />} open={open} source={card.sources}>
    <div className="flex flex-col gap-3 px-4 py-3" lang="ar">
      <p className="line-clamp-3 text-[1.125rem] leading-[1.9]">{entry.text}</p>
      <HadithBooks top={entry.heading} boxes={card.boxes} namer={compilerOf(entry).name} />
    </div>
  </Post>;
  if (card.kind === 'isnad') return <Post save={card} head={<PostHead Icon={GitCommitVertical} title="من الإسناد" sub={sub} />}
    open={open} source={card.sources}>
    <div className="flex flex-col gap-3 px-4 py-3" lang="ar">
      <FortyIsnad isnad={card.record.isnad} size={card.size} />
      <p className="line-clamp-3 text-[1.125rem] leading-[1.9]">{card.record.saying}</p>
    </div>
  </Post>;
  const rajab = card.kind === 'rajab';
  return <Post save={card} head={<PostHead Icon={rajab ? BookOpenText : MessagesSquare} title={rajab ? 'من شرح ابن رجب' : 'من الحديث'} sub={sub} />}
    open={open} source={card.sources}>
    <div className="px-4 py-3" lang="ar">
      {card.kind === 'rajab' ? <IbnRajab only={card.passage} books={books} /> : <p className="text-[1.1875rem] leading-[1.9]">{entry.text}</p>}
    </div>
  </Post>;
}

/** A hadith of Sahih al-Bukhari or Sahih Muslim whole (the app's SahihPost); its open button opens its page. */
function SahihPost({ card }: { card: SahihCard }) {
  const { book, hadith } = card;
  const href = `/hadith/sahih/${book.slug}/${hadith.n}`;
  const name = `${book.title} ${num(hadith.n)}`;
  return <Post save={card} head={<PostHead Icon={MessagesSquare} title={`من ${book.title}`} sub={card.where} />}
    open={<Action Icon={MessagesSquare} label={`افتح ${name}`} href={href} />}
    source={[{ book: book.title, author: book.slug === 'bukhari' ? 'البخاري' : 'مسلم' }]}>
    <div className="px-4 py-3"><SahihHadithView book={book} hadith={hadith} /></div>
  </Post>;
}

/**
 * «من التراجم» (the app's TarajimPost): a virtue from a converted Siyar entry, in the book's words with who says it and its
 * page; the head opens the person's page.
 */
function TarajimPost({ card }: { card: Extract<TarajimCard, { kind: 'tarajim' }> }) {
  const href = `/people/${card.person.slug}`;
  return <Post save={card} head={<PostHead Icon={Users} title="من التراجم" sub={card.person.name} />}
    open={<Action Icon={Users} label={`افتح ترجمة ${card.person.name}`} href={href} />}
    actions={<Action Icon={Link2} label={card.person.sex === 'FEMALE' ? 'صلاتها' : 'صلاته'} href={tiesHref(card.person.slug)} />}
    source={card.sources}>
    <div className="flex flex-col gap-1.5 px-4 py-3" lang="ar">
      <Saying by={card.virtue.by}><p className="text-[1.125rem] leading-[1.85]">{card.virtue.text}</p></Saying>
    </div>
  </Post>;
}

/**
 * «الألقاب» and «الكنى» (the app's NamePost): one person's laqab or kunya large, the person under it, the book's words when
 * they say more than the name, and the person page's folded reference; the head opens the person's page.
 */
function NamePost({ card }: { card: NameCard }) {
  const href = `/people/${card.person.slug}`;
  return <Post save={card} head={<PostHead Icon={Users} title={card.kind === 'laqab' ? 'لقب وصاحبه' : 'كنية وصاحبها'} sub={card.person.name} />}
    open={<Action Icon={Users} label={`افتح ترجمة ${card.person.name}`} href={href} />} source={card.sources}>
    <div className="flex flex-col gap-1 px-4 py-3" lang="ar">
      <p className="text-[1.875rem] font-bold leading-[1.6] text-[var(--home-accent)]">{card.name}</p>
      <p className="text-[1.1875rem] leading-[1.6]">{card.person.name}</p>
      {card.quote && <Saying by={card.by}><p className="text-base leading-[1.75] text-[var(--home-muted)]">«{card.quote}»</p></Saying>}
    </div>
  </Post>;
}

/**
 * «صلة» (the app's TiePost): two converted people and the nearest chain of ties that joins them, drawn as «بينه وبين…»
 * draws it, then in one sentence with the pages that state each tie; the head opens «بينه وبين…» with the two picked.
 */
function TiePost({ card }: { card: Extract<TarajimCard, { kind: 'tie' }> }) {
  const [shown, setShown] = useState<DrawingOrText>('drawing');
  return <Post save={card} head={<PostHead Icon={Link2} title="صلة" sub={`${card.a.name} و${card.b.name}`} />}
    open={<Action Icon={Link2} label={`ارسم الصلة بين ${card.a.name} و${card.b.name}`} href={betweenHref([card.a.slug, card.b.slug])} />}
    source={card.sources}
    actions={<>
      <Action Icon={Link2} label={`صلات ${card.a.name}`} href={tiesHref(card.a.slug)} />
      <Action Icon={Link2} label={`صلات ${card.b.name}`} href={tiesHref(card.b.slug)} />
    </>}>
    <div className="flex flex-col gap-1.5 px-4 py-3" lang="ar">
      {/* The drawing or the sentence that says it: one at a time, the drawing first (owner, 2026-11-20). */}
      <Segmented tabs label="كيف تُعرض الصلة" className="self-start"
        options={DRAWING_OR_TEXT.map(item => ({ ...item, current: shown === item.key, onClick: () => setShown(item.key) }))} />
      {shown === 'drawing' ? <TiesChain chain={card.chain} inCard /> : <p className="text-[1.125rem] leading-[1.85]">{card.sentence}</p>}
    </div>
  </Post>;
}

/** «من حياته» (the app's LifePost): a person's «حياته» timeline as his page draws it, the rail a year a line; the head opens his page. */
function LifePost({ card }: { card: Extract<TarajimCard, { kind: 'life' }> }) {
  const href = `/people/${card.person.slug}`;
  return <Post save={card} head={<PostHead Icon={History} title={card.person.sex === 'FEMALE' ? 'من حياتها' : 'من حياته'} sub={card.person.name} />}
    open={<Action Icon={Users} label={`افتح ترجمة ${card.person.name}`} href={href} />} source={card.sources}>
    <div className="px-2.5 py-3.5">
      <LifeTimeline items={card.items} inCard compact linked={false} />
    </div>
  </Post>;
}

/**
 * The drawings built for their pages, each as its page draws it (the app's NasabPost, TiesPost, BattlePost, HadithScenePost,
 * OpeningCardPost, OathPost and EventPost; owner 2026-11-20, sketch layout-cleanup panel 6); the row's open button opens the
 * page at the item.
 */
function DrawingPost({ card }: { card: DrawingCard }) {
  const [tie, setTie] = useState<RingTie>();
  const save = { kind: card.kind, item: card.item };
  switch (card.kind) {
    case 'nasab': {
      const title = card.person.sex === 'FEMALE' ? 'نسبها' : 'نسبه';
      return <Post save={save} head={<PostHead Icon={Network} title={title} sub={card.person.name} />}
        open={<Action Icon={Network} label={`افتح نسب ${card.person.name}`} href={nasabHref([card.person.slug])} />} source={card.sources}>
        <div className="px-4 py-3"><NasabTree view={card.nasab} text={false} inCard /></div>
      </Post>;
    }
    case 'ties': {
      const title = card.person.sex === 'FEMALE' ? 'صلاتها' : 'صلاته';
      return <Post save={save} head={<PostHead Icon={Link2} title={title} sub={card.person.name} />}
        open={<Action Icon={Link2} label={`افتح ${title}: ${card.person.name}`} href={tiesHref(card.person.slug)} />} source={card.sources}>
        <div className="flex flex-col gap-3 px-4 py-3"><TiesRing view={card.ties} onShow={setTie} />{tie && <TieSays tie={tie} />}</div>
      </Post>;
    }
    case 'battle': {
      const { battle } = card;
      return <Post save={save} head={<PostHead Icon={Swords} title={battle.name} sub={battleLine(battle)} />}
        open={<Action Icon={Swords} label={`افتح ${battle.name}`} href={`/battles/${battle.slug}`} />} source={card.sources}>
        <div lang="ar">
          {battle.place && <><BattleMap place={battle.place} /><p className="px-3 pt-1.5 text-sm text-[var(--home-muted)]">موضع تقريبي على خريطة اليوم، من عندنا.</p></>}
          <div className="px-4 py-3"><Counts battle={battle} Heading="h3" /></div>
        </div>
      </Post>;
    }
    case 'hadith-scene': {
      const scene = card.scenes[card.at];
      return <Post save={save} head={<PostHead Icon={MessagesSquare} title={`من ${card.unit.book}`} sub={[card.unit.kitab, `المشهد ${num(scene.ordinal)}`].filter(Boolean).join(' · ')} />}
        open={<Action Icon={MessagesSquare} label={`افتح الحديث في ${card.unit.book}`} href={`/hadith/${card.unit.id}`} />} source={card.sources}>
        <div className="px-4 py-3"><Bubbles lines={scene.lines} colours={sceneColours(card.scenes)[card.at]} /></div>
      </Post>;
    }
    case 'opening':
      return <Post save={save} head={<PostHead Icon={ListStart} title="من فواتح السور" sub={card.card.title} />}
        open={<Action Icon={ListStart} label={`افتح «${card.card.title}» في فواتح السور`} href={`/quran/openings?kind=${card.card.kind}#${card.card.id}`} />} source={card.sources}>
        <div className="px-4 py-2" lang="ar"><OpeningRows card={card.card} names={names} /></div>
      </Post>;
    case 'oath': {
      const place = oathPlace(card.oath, num);
      return <Post save={save} head={<PostHead Icon={Feather} title="من الأقسام" sub={[place, card.oath.who].filter(Boolean).join(' · ')} />}
        open={<Action Icon={Feather} label={`افتح ${place} في الأقسام`} href={`/quran/oaths#${oathAnchor(card.oath.id)}`} />}
        actions={<Action Icon={BookOpen} label={`افتح ${place} في المصحف`} href={ayahHref(card.oath.id)} />} source={card.sources}>
        <div className="px-4 py-1.5" lang="ar"><OathWords oath={card.oath} /></div>
      </Post>;
    }
    case 'event':
      return <Post save={save} head={<PostHead Icon={ScrollText} title={card.title} sub={card.phase} />}
        open={<Action Icon={BookOpen} label={`افتح ${card.event.title} في القصة`} href={`/quran/prophets/${card.slug}?event=${card.at}`} />} source={card.sources}>
        <div className="px-4 py-3" lang="ar">
          <EventPlaces slug={card.slug} compare={{}} event={card.event} places={card.places} phase={card.phase} readable={false}
            onStep={() => {}} hasPrev={false} hasNext={false} />
        </div>
      </Post>;
  }
}

type Tree = FeedTree;

/** A saved ayah as a post: the ayah in the mushaf's own lines, as the recall card shows it once revealed. */
function SavedAyahPost({ ayah }: { ayah: string }) {
  const { pages } = useAyahPage(ayah);
  const [surah, number] = ayah.split(':').map(Number);
  return <Post head={<PostHead Icon={Bookmark} title="من المحفوظات" sub={`${names[surah]} ${num(number)}`} />}
    open={<Action Icon={BookOpen} label="في المصحف" href={ayahHref(ayah)} />} source={[mushafSource(ayah, pages?.page)]}>
    <div className={styles.recall}>
      {pages ? <AyahLines ayah={ayah} pages={pages} shown whole checked={null} /> : <LoadingDots label="جارٍ التحميل" />}
    </div>
  </Post>;
}

/** A saved feed card (owner 2026-11-19: every card can be saved), drawn as the feed drew it; nothing when the data no longer holds it. */
export function SavedCardPost({ id }: { id: string }) {
  const day = dayNumber(new Date());
  const { data } = useSWR(`/api/home/feed?day=${day}&card=${encodeURIComponent(id)}`, fetchJson<SavedFeedCard | Record<string, never>>, { revalidateOnFocus: false });
  if (!data || !('kind' in data)) return null;
  switch (data.kind) {
    case 'hadith': case 'rajab': case 'recorded': case 'isnad': return <HadithPost card={data.card} />;
    case 'bukhari': case 'muslim': return <SahihPost card={data.card} />;
    case 'tarajim': return data.card.kind === 'tarajim' ? <TarajimPost card={data.card} /> : null;
    case 'tie': return data.card.kind === 'tie' ? <TiePost card={data.card} /> : null;
    case 'life': return data.card.kind === 'life' ? <LifePost card={data.card} /> : null;
    case 'laqab': case 'kunya': return <NamePost card={data.card} />;
    case 'sira': return data.card.kind === 'sira' ? <SiraPost card={data.card} /> : null;
    case 'moment': return data.card.kind === 'moment' ? <MomentPost card={data.card} /> : null;
    case 'prophets': return <StoryPost card={data.card} />;
    case 'term': return <TermPost card={data.card} />;
    case 'note-qiraat': return <QiraatPost ayah={data.ayah} />;
    case 'note-tafsir': case 'note-irab': case 'note-balagha': return <AyahNotePost kind={data.kind} note={data.note} />;
    case 'scene': return <ScenePost view={data.view} reference={data.reference} />;
    default: return <DrawingPost card={data.card} />;
  }
}

/**
 * A saved item as its own card (owner, 2026-11-14): a tree as the tree card, a compare card as the pair card, an ayah in the
 * mushaf's lines. One that the data no longer holds is skipped.
 */
function SavedPost({ item }: { item: SavedItem }) {
  const kind = bookmarkKind(item);
  const { data } = useSWR(kind === 'ayah' || kind === 'card' ? null : `/api/home/feed?saved=${encodeURIComponent(item.id)}`, fetchJson<SavedContent>, { revalidateOnFocus: false });
  if (kind === 'ayah') { const ayah = item.id.slice('ayah:'.length); return /^\d+:\d+$/.test(ayah) && names[Number(ayah.split(':')[0])] ? <SavedAyahPost ayah={ayah} /> : null; }
  if (kind === 'card') return <SavedCardPost id={item.id} />;
  if (data?.tree) return <TreePost tree={data.tree} />;
  return data?.pair ? <PairPost pair={data.pair} /> : null;
}
/** As the app's tree card (owner, 2026-11-15): grows with a taller screen, 68% of it less the buttons and chips under the tree, never under 24rem. */
const TREE_HEIGHT = 'max(24rem, calc(68svh - 5rem))';

/**
 * One tree as a post: the branches page's own tree (TreeViewCard), so it zooms, pans and lights a path on a click, as there.
 * The open button takes it to the branches page.
 */
function TreePost({ tree }: { tree: Tree }) {
  return <article className={styles.postWrap} dir="rtl">
    <PostHead Icon={TreeIcon} title="من متشابهات القرآن" sub={ayahPlaces(tree.ayat?.map(ayah => ayah.key) ?? [], names)} />
    <TreeViewCard tree={tree} height={TREE_HEIGHT} names={names} mixed frameClassName={styles.post} actionsClassName={styles.postActions}
      lead={<Action Icon={TreeIcon} label="افتح الشجرة في متشابهات القرآن" href={tree.href} />} aside={<NotMine />} />
    <SourceLine named={sourcesOf(tree.sources)} sources={sourcesOf(tree.sources)} />
  </article>;
}

/**
 * A place the readers differ, as the app's readings card (owner, 2026-11-19: every phone feature on the website too): the
 * ayah in the mushaf's own lines and at most two of its words as each reader reads them, the «القراءات» page's own view
 * (QiraatPlace), and a button that opens that page at this ayah.
 */
function QiraatPost({ ayah }: { ayah: string }) {
  const { pages } = useAyahPage(ayah);
  const [surah, number] = ayah.split(':').map(Number);
  const href = `/quran/qiraat#a${ayah.replace(':', '-')}`;
  return <Post save={{ kind: 'note-qiraat', item: ayah }} head={<PostHead Icon={Layers} title="من القراءات" sub={`${names[surah]} ${num(number)}`} />} open={<Action Icon={Layers} label="القراءات كاملة" href={href} />} source={qiraatSources(ayah)}>
    <QiraatPlace ayah={ayah} max={2} lines={pages ? <AyahLines ayah={ayah} pages={pages} shown whole checked={null} /> : <LoadingDots label="جارٍ التحميل" />} />
  </Post>;
}

const NOTE_HEADS: Record<'note-tafsir' | 'note-irab' | 'note-balagha', { note: 'tafsir' | 'irab' | 'balagha'; Icon: typeof BookOpen; title: string; open: string }> = {
  'note-tafsir': { note: 'tafsir', Icon: BookOpen, title: 'من التفسير', open: 'التفسير كاملًا' },
  'note-balagha': { note: 'balagha', Icon: Sparkles, title: 'من البلاغة', open: 'البلاغة كاملة' },
  'note-irab': { note: 'irab', Icon: ListTree, title: 'من الإعراب', open: 'إعراب الآية' },
};

/**
 * An ayah with a little of what a book says on it (the app's AyahNotePost, owner 2026-11-18: small cards, the whole text one
 * tap away): al-Sa'di on an ayah he explains alone, al-Suyuti's balagha paragraph on an ayah he surely names, or a word's
 * i'rab. The open button brings the reader's own sheet for it.
 */
function AyahNotePost({ kind, note }: { kind: keyof typeof NOTE_HEADS; note: NoteBody }) {
  const { pages } = useAyahPage(note.key);
  const [open, setOpen] = useState(false);
  const head = NOTE_HEADS[kind];
  const [surah, number] = note.key.split(':').map(Number);
  const preview: Preview = head.note === 'irab' ? { kind: 'irab', key: note.key, w: 'word' in note ? note.word : 0 } : { kind: head.note, key: note.key };
  return <>
    <Post save={{ kind, item: note.key }} head={<PostHead Icon={head.Icon} title={head.title} sub={`${names[surah]} ${num(number)}`} />}
      open={<Action Icon={head.Icon} label={head.open} onClick={() => setOpen(true)} />} source={note.sources}>
      <div className="flex flex-col gap-1.5 py-2.5" lang="ar">
        <div className="px-3">{pages ? <AyahLines ayah={note.key} pages={pages} shown whole checked={null} /> : <LoadingDots label="جارٍ التحميل" />}</div>
        <hr className="mx-3.5 border-[var(--home-rule)] opacity-60" />
        {'heading' in note && note.heading && <p className="px-3.5 text-sm text-[var(--home-muted)]">{note.heading}</p>}
        {'text' in note && <div className="line-clamp-4 px-3.5 [&_p]:px-0 [&_p]:text-[1.0625rem] [&_p]:leading-[1.85]"><SadiText text={note.text} /></div>}
        {'word' in note && <div className="flex flex-col gap-0.5 px-3.5">
          <QuranWord className="text-[var(--home-accent)]">{note.shown}</QuranWord>
          <p className="text-[1.1875rem] leading-[1.6]">{note.role}</p>
          <p className="text-[0.9375rem] leading-[1.6] text-[var(--home-muted)]">{note.morph}</p>
        </div>}
      </div>
    </Post>
    <AyahPreviewSheet preview={open ? preview : null} onClose={() => setOpen(false)} />
  </>;
}

/** A scene from «مشاهد» as a post (the app's ScenePost, owner 2026-11-18): the page's own picture; the head opens «مشاهد», as the app's. */
function ScenePost({ view, reference }: { view: ExampleView; reference: LataifReference }) {
  const href = `/quran/lataif#${view.key}`;
  return <Post save={{ kind: 'scene', item: view.key }} head={<Link href={href} aria-label="افتح المشاهد" className="block hover:opacity-80"><PostHead Icon={Presentation} title="من المشاهد" sub={topicOf(view).name} /></Link>}
    open={<Action Icon={BookOpen} label="افتح في المصحف" href={ayahHref(`${view.surah}:${view.from}`)} />}
    lines={[{ line: reference.title, quotes: reference.quotes }]}>
    <div className="flex flex-col gap-2.5 px-4 py-3" lang="ar"><ExampleScene view={view} /></div>
  </Post>;
}

/** Today's juz as a post (the app's JuzPost, owner 2026-11-18): its first page's top lines; the button opens the mushaf there. */
function JuzPost({ juz, date }: { juz: number[]; date?: string | null }) {
  const key = JUZ_STARTS[juz[0] - 1];
  const { pages } = useAyahPage(key);
  const href = ayahHref(key);
  return <Post labelledBy="juz-title" head={<PostHead Icon={BookOpen} id="juz-title" title="جزء اليوم" sub={[juzLabel(juz), date?.replace(/ هـ$/, '')].filter(Boolean).join(' · ')} />}
    open={<Action Icon={BookOpen} label={`اقرأ ${juzLabel(juz)}`} href={href} />} source={[mushafSource(key, pages?.page)]}>
    <Link href={href} className={styles.pageSlice} aria-label={`اقرأ ${juzLabel(juz)}، جزء اليوم`} lang="ar">
      {pages ? <PageTop page={pages} /> : <span className={styles.pageLines} />}
    </Link>
  </Post>;
}

type Soon = { key: string; prayer: Exclude<PrayerKey, 'sunrise'>; times: PrayerDay };

/** The prayer that is near now at the place the utilities keep, with its day's times, or null. */
function soonNow(): Soon | null {
  const place = placeStore.read();
  if (!place) return null;
  const now = new Date();
  const times = prayerTimes(place, now, settingsStore.read());
  const soon = prayerSoon(times, now);
  return soon ? { key: `${now.toDateString()}-${soon.key}`, prayer: soon.key, times } : null;
}

/** The prayer that is near, checked every half minute and when the tab comes back; it changes only when it becomes another. */
function usePrayerSoon() {
  const [soon, setSoon] = useState<Soon | null>(null);
  useEffect(() => {
    const check = () => setSoon(now => { const next = soonNow(); return next?.key === now?.key ? now : next; });
    check();
    const timer = setInterval(check, 30_000);
    document.addEventListener('visibilitychange', check);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', check); };
  }, []);
  return soon;
}

/** A prayer that is near as a post (the app's PrayerPost, owner 2026-11-18): the five times, the near one lit, and how it is worked out. */
function PrayerPost({ prayer, times }: { prayer: Exclude<PrayerKey, 'sunrise'>; times: PrayerDay }) {
  const now = useNow();
  const place = useSyncExternalStore(placeStore.subscribe, placeStore.read, () => null);
  const settings = useSyncExternalStore(settingsStore.subscribe, settingsStore.read, () => DEFAULT_PRAYER_SETTINGS);
  const method = METHODS.find(each => each.id === settings.method)?.label ?? '';
  const left = now ? Math.ceil((times[prayer].getTime() - now.getTime()) / 60_000) : 1;
  const title = left > 0 ? `${PRAYER_NAMES[prayer]} ${inMinutes(left)}` : `حان وقت ${PRAYER_NAMES[prayer]}`;
  return <Post head={<PostHead Icon={Clock} title={title} sub={[now && hijriDate(now), place?.name].filter(Boolean).join(' · ')} />}
    actions={<>
      <Action Icon={Clock} label="مواقيت الصلاة" href="/utilities?view=times" />
      <Action Icon={Compass} label="القبلة" href="/utilities?view=qibla" />
    </>}
    lines={[{ line: `طريقة الحساب · ${method}`, quotes: [{ text: `حُسبت المواقيت بطريقة ${method}${settings.hanafi ? '، والعصر على مذهب الحنفية' : ''}، وتُغيَّر من مواقيت الصلاة.` }] }]}>
    <div className="flex justify-between px-3.5 py-3">
      {FIVE.map(key => <p key={key} className="flex flex-col items-center gap-0.5" aria-label={`${PRAYER_NAMES[key]} ${clock(times[key], true)}`}>
        <span aria-hidden className={`text-[0.8125rem] ${key === prayer ? 'text-[var(--home-accent)]' : 'text-[var(--home-muted)]'}`}>{PRAYER_NAMES[key]}</span>
        <span aria-hidden className={key === prayer ? 'text-[var(--home-accent)]' : ''}>{clock(times[key])}</span>
      </p>)}
    </div>
  </Post>;
}

/**
 * A few books from the library as a post (the app's BooksPost, owner 2026-11-18): the shelf's own cards, those with a فاصلة
 * first, in a row that scrolls; the head opens the library.
 */
function BooksPost({ day }: { day: number }) {
  const fasilas = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas);
  const shelf = [...BOOKS.filter(book => isReaderBook(book.id)), { id: 'tuhfa' }];
  const picks = feedBooks(shelf, id => id in fasilas, day);
  return <section className={styles.postWrap} dir="rtl" aria-labelledby={`books-${day}`}>
    <Link href="/quran/books" aria-label="افتح المكتبة" className="block hover:opacity-80"><PostHead Icon={LibraryBig} id={`books-${day}`} title="من المكتبة" /></Link>
    <ul className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
      {picks.map(book => <li key={book.id} className="w-[150px] shrink-0">
        {'title' in book ? <BookCard book={book} fasila={isReaderBook(book.id) ? fasilas[book.id] : undefined} /> : <TuhfaCard />}
      </li>)}
    </ul>
  </section>;
}

/** The line over a card from outside the reader's interests (the app's SurpriseLine), with a button to add it. */
function SurpriseLine({ interest, added }: { interest: string; added: boolean }) {
  const name = interestById(interest)?.name ?? '';
  // Once added the line stays, saying so, so the card under it does not move.
  return <div dir="rtl" className="flex items-center gap-2 px-3">
    <p className="flex-1 text-[0.8125rem] text-[var(--home-muted)]">{added ? `أُضيف «${name}» إلى اهتماماتك` : `من غير اهتماماتك: ${name}`}</p>
    <Button variant="muted" aria-label={added ? `أزل «${name}» من اهتماماتي` : `أضف «${name}» إلى اهتماماتي`}
      onClick={() => pickedInterests.write(toggledInterest(pickedInterests.read(), interest))}>{added ? <Check aria-hidden /> : <Plus aria-hidden />}{added ? 'تراجع' : 'أضفه'}</Button>
  </div>;
}

/**
 * A story opened from the feed continues (owner, 2026-11-19, the app's): that kind's next card is the one after it in the list
 * (the next phase of a prophet's story, the next moment of the battle, the next sira story).
 */
const continued = new Map<ListKind, string>();
const continuedListeners = new Set<() => void>();
let continuedVersion = 0;
function continueAfter(kind: ListKind, item: string) {
  continued.set(kind, item);
  continuedVersion++;
  continuedListeners.forEach(listener => listener());
}
const subscribeContinued = (listener: () => void) => { continuedListeners.add(listener); return () => { continuedListeners.delete(listener); }; };
const readContinued = () => continuedVersion;

/** A prayer that comes this soon after home opens leads the feed, as one near when it opens does. */
const OPENING_MS = 3000;
/** About how many cards come at a time, as the page opens and each time it nears its end: a round of every interest. */
const STEP_CARDS = INTERESTS.length;
type Ids = { pairs: (string | null)[]; trees: (string | null)[]; pairKeys?: string[][]; treeKeys?: string[][] };
type Content = { pairs: FeedPair[]; trees: FeedTree[] };
/** A list kind's ids are asked for in steps of this many, so the same few requests serve a growing feed. */
const ITEMS_STEP = 20;

/** The ids of one list kind's next items from the day's start (or just after a continued story), enough to pass the seen ones. */
function useItemIds(kind: ListKind, day: number | undefined, need: number, seen: Seen, after?: string) {
  const seenOfKind = useMemo(() => Object.keys(seen).filter(id => id.startsWith(`${kind}:`)).length, [seen, kind]);
  const n = Math.min(FEED_FAR, Math.ceil((need + seenOfKind) / ITEMS_STEP) * ITEMS_STEP);
  const query = day && need ? `/api/home/feed?day=${day}&items=${kind}&n=${n}${after ? `&after=${encodeURIComponent(after)}` : ''}` : null;
  return useSWR(query, fetchJson<string[]>, { revalidateOnFocus: false, keepPreviousData: true }).data;
}

/** The items each list kind shows, as the app's feed picks them (shared/feedSeen.ts growingPicks): fresh ones first, kept in place as more come. */
function useListItems(counts: Record<string, number>, day: number | undefined, seen: Seen, view: string, visit: number) {
  const turn = useSyncExternalStore(subscribeContinued, readContinued, readContinued);
  const fetched = Object.fromEntries(LIST_KINDS.map(kind => [kind,
    // One hook per kind, in a fixed order.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useItemIds(kind, day, counts[kind] ?? 0, seen, continued.get(kind))])) as Record<ListKind, string[] | undefined>;
  const holders = useRef<Partial<Record<ListKind, { reset?: unknown[]; list: string[] }>>>({}).current;
  const key = LIST_KINDS.map(kind => fetched[kind]?.join(',') ?? '').join('|');
  return useMemo(() => {
    const out: Partial<Record<ListKind, string[]>> = {};
    for (const kind of LIST_KINDS) {
      const list = fetched[kind];
      const need = counts[kind] ?? 0;
      if (!list || !need) continue;
      out[kind] = growingPicks(holders[kind] ??= { list: [] }, [view, day], offset => list[offset], item => `${kind}:${item}`, seen, need, { since: visit, tries: list.length });
    }
    return out;
    // `turn` (a story opened) recomputes without a reset, as the app's: cards on screen stay, later ones continue after it.
  }, [key, counts, day, seen, view, visit, turn]); // eslint-disable-line react-hooks/exhaustive-deps -- `key` stands for the fetched lists
}

/**
 * The home feed, the app's (mobile/src/components/HomeFeed.tsx Feed, owner 2026-11-19): the reader's own cards at the top (a
 * forgotten ayah that is due, today's juz, the prayer when near), then rounds, each one card from every interest picked
 * (shared/homeFeed.ts feedRound), content and questions taking turns, with a card from outside the interests when the
 * reader allows it, a saved item and the books now and then; more rounds as the page nears its end. What was shown before is
 * skipped (shared/feedSeen.ts), a question answered wrong comes back after a rest, and a story opened continues.
 * `only`: one interest's id, its cards alone (the chip row over the feed).
 */
export function Feed({ only = null }: { only?: string | null } = {}) {
  const today = useToday();
  const day = today?.day;
  const visit = useSyncExternalStore(subscribeVisit, visitStart, serverVisit);
  // A new visit, or another chip, starts again from one step of rounds.
  const view = `${visit}|${only ?? ''}`;
  const [more, setMore] = useState({ view, batches: 0 });
  const seen = useSyncExternalStore(subscribeFeedSeen, readFeedSeen, serverFeedSeen);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  // The saved items as they were when the visit began (once read in the browser), so saving or unsaving a card does not move the cards on screen.
  const savedAtVisit = useRef<{ visit: number; list: typeof bookmarks } | null>(null);
  if (!savedAtVisit.current || savedAtVisit.current.visit !== visit || (!savedAtVisit.current.list.length && bookmarks.length)) savedAtVisit.current = { visit, list: bookmarks };
  const saved = savedAtVisit.current.list.filter(item => !isCardBookmark(item.id) || drawsCard(item.id));
  // The interests and «فاجئني» as they were when the visit began (a change starts a new visit, so the cards on screen never move).
  const picked = useSyncExternalStore(pickedInterests.subscribe, pickedInterests.read, pickedInterests.server);
  const surprise = useSyncExternalStore(surpriseMe.subscribe, surpriseMe.read, surpriseMe.server);
  const frozen = useRef<{ visit: number; picked: typeof picked; surprise: boolean } | null>(null);
  if (!frozen.current || frozen.current.visit !== visit) frozen.current = { visit, picked, surprise };
  const { active, others } = useMemo(() => {
    if (only) return { active: INTERESTS.filter(interest => interest.id === only), others: [] };
    const chosen = activeInterests(frozen.current!.picked);
    return { active: chosen, others: frozen.current!.surprise && frozen.current!.picked.length ? INTERESTS.filter(interest => !chosen.includes(interest)) : [] };
  }, [only, visit]); // eslint-disable-line react-hooks/exhaustive-deps -- read once a visit
  // Rounds of few interests are short: as many rounds at a time as make about a round of all; the books and a saved item come once a step.
  const step = Math.max(1, Math.ceil(STEP_CARDS / (active.length + (others.length ? 1 : 0))));
  const batches = more.view === view && more.batches ? more.batches : step;
  const due = useSyncExternalStore(subscribeDueMarks, readDueMarks, serverAyahMarks);
  const forgotten = mostForgotten(due)[0];
  // The settings under «ما أحفظه»: questions come from the memorized range, pondering puts it first.
  const memorized = useMemorized();
  const questions = useSyncExternalStore(memorizedQuestions.subscribe, memorizedQuestions.read, memorizedQuestions.server);
  const prefer = useSyncExternalStore(memorizedPrefer.subscribe, memorizedPrefer.read, memorizedPrefer.server);
  const recall = useMemo(() => (memorized && day ? recallOfDay(questions ? memorized : { all: true }, day) : undefined), [memorized, questions, day]);
  const rounds = useMemo(() => (day ? Array.from({ length: batches }, (_, round) => feedRound(active, round, day, others)) : []), [active, others, batches, day]);
  // The questions answered wrong that are due again, as they were when the visit began.
  const missed = useMemo(() => ({ list: readMissed(), at: Date.now() }), [visit]); // eslint-disable-line react-hooks/exhaustive-deps -- read once a visit
  // A tab hidden for long and shown again starts a new visit (shared/feedSeen.ts).
  useEffect(() => {
    const change = () => (document.hidden ? leftVisit() : backToVisit());
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  const counts = useMemo(() => {
    const count: Record<string, number> = {};
    for (const slot of rounds.flat()) count[slot.kind] = (count[slot.kind] ?? 0) + 1;
    return count;
  }, [rounds]);
  // Pairs and trees: their ids reach FEED_AHEAD past those shown, so the fresh ones can be found further on (owner, 2026-11-18: never a limit).
  const wanted = Math.max(counts.pair ?? 0, counts.tree ?? 0);
  const reach = Math.min(FEED_FAR, (Math.floor(wanted / FEED_AHEAD) + 2) * FEED_AHEAD);
  const { data: ids } = useSWR(day && wanted ? `/api/home/feed?day=${day}&n=${reach}` : null, fetchJson<Ids>, { revalidateOnFocus: false, keepPreviousData: true });
  const shownPairs = useRef<{ reset?: unknown[]; list: number[] }>({ list: [] }).current;
  const shownTrees = useRef<{ reset?: unknown[]; list: number[] }>({ list: [] }).current;
  const offsets = useMemo(() => {
    if (!ids) return { pairs: [], trees: [] };
    const pick = (holder: typeof shownPairs, list: (string | null)[], keys: string[][] | undefined, count: number) => growingPicks(holder, [view, day, prefer, memorized],
      offset => (list[offset] ? offset : undefined), offset => list[offset]!, seen, count,
      { since: visit, tries: list.length, prefer: prefer && keys ? offset => touchesMemorized(keys[offset] ?? [], memorized) : undefined });
    return { pairs: pick(shownPairs, ids.pairs, ids.pairKeys, counts.pair ?? 0), trees: pick(shownTrees, ids.trees, ids.treeKeys, counts.tree ?? 0) };
  }, [ids, seen, counts, prefer, memorized, visit, view, day, shownPairs, shownTrees]);
  const swr = { revalidateOnFocus: false, keepPreviousData: true };
  const pieces = (kind: 'p' | 't', some: number[]) => () => inPieces<Content>(part => `/api/home/feed?day=${day}&${kind}=${part.join(',')}`, some)
    .then(all => ({ pairs: all.flatMap(piece => piece.pairs), trees: all.flatMap(piece => piece.trees) }));
  const { data: pairContent } = useSWR(day && offsets.pairs.length ? `/api/home/feed?day=${day}&p=${offsets.pairs.join(',')}` : null, pieces('p', offsets.pairs), swr);
  const { data: treeContent } = useSWR(day && offsets.trees.length ? `/api/home/feed?day=${day}&t=${offsets.trees.join(',')}` : null, pieces('t', offsets.trees), swr);
  const items = useListItems(counts, day, seen, view, visit);
  // Cards taken out with «ليس من اهتماماتي» this visit, by key: each leaves a line in its place, the others stay as they are.
  const [removed, setRemoved] = useState<{ visit: number; keys: ReadonlySet<string> }>({ visit, keys: new Set() });
  const removedKeys = removed.visit === visit ? removed.keys : new Set<string>();
  const showing = new Set(activeInterests(picked).map(interest => interest.id));
  const posts: React.ReactElement[] = [];
  // Only what is drawn counts as seen.
  const rendered: string[] = [];
  const used: Record<string, number> = {};
  const next = (kind: string) => { const at = used[kind] ?? 0; used[kind] = at + 1; return at; };
  for (let round = 0; round < rounds.length; round++) {
    if (round === 0 && !only) {
      if (forgotten) posts.push(<ForgottenPost key={`ask${forgotten}`} ayah={forgotten} review={reviewHref(forgottenOrder(Object.keys(due))[0])} />);
      else if (recall) posts.push(<ForgottenPost key={`ask${recall}`} ayah={recall} />);
      if (hasJuzCard(round) && today?.juz) posts.push(<JuzPost key={`j${day}`} juz={today.juz} date={today.date} />);
    }
    rounds[round].forEach((slot: FeedSlot) => {
      const at = next(slot.kind);
      let key: string;
      let post: React.ReactElement | null = null;
      let item: string | undefined;
      if (slot.quiz) {
        const kind = slot.kind as FeedQuizKind;
        const seed = dueSeeds(missed.list, kind, missed.at)[at] ?? feedQuizSeed(day!, round);
        key = `q${kind}-${seed}-${round}`;
        post = kind === OPENINGS
          ? <OpeningPost seed={seed} memorized={questions ? memorized : null} />
          : <QuizPost key={questions ? JSON.stringify(memorizedFilters(memorized)) : ''} kind={kind} seed={seed} scope={questions ? memorizedFilters(memorized) : {}} />;
      } else if (slot.kind === 'pair' || slot.kind === 'tree') {
        const offset = (slot.kind === 'pair' ? offsets.pairs : offsets.trees)[at];
        const content = slot.kind === 'pair' ? pairContent?.pairs.find(pair => pair.id === ids?.pairs[offset]) : treeContent?.trees.find(tree => tree.id === ids?.trees[offset]);
        item = content?.id;
        key = `${slot.kind === 'pair' ? 'p' : 't'}${item ?? at}`;
        post = !content ? null : slot.kind === 'pair' ? <PairPost pair={content as FeedPair} /> : <TreePost tree={content as FeedTree} />;
      } else {
        item = items[slot.kind as ListKind]?.[at];
        key = `${slot.kind}:${item ?? at}`;
        post = item !== undefined ? <SavedCardPost id={cardBookmarkId(slot.kind, item)} /> : null;
      }
      if (!post) return;
      if (removedKeys.has(key)) {
        posts.push(<RemovedLine key={key} interest={slot.interest} onUndo={() => setRemoved({ visit, keys: new Set([...removedKeys].filter(each => each !== key)) })} />);
        return;
      }
      if (item !== undefined) rendered.push(slot.kind === 'pair' || slot.kind === 'tree' ? item : `${slot.kind}:${item}`);
      // Not on the only interest left (none picked means all), on one interest's own view, on a surprise card, nor on one already taken out.
      const notMine = only || slot.surprise || !showing.has(slot.interest) || showing.size === 1 ? undefined : () => {
        setRemoved({ visit, keys: new Set([...removedKeys, key]) });
        pickedInterests.write(activeInterests(pickedInterests.read()).map(each => each.id).filter(id => id !== slot.interest));
      };
      posts.push(<NotMineContext.Provider key={key} value={{ interest: slot.interest, notMine }}>
        {slot.surprise ? <div className="flex flex-col gap-1"><SurpriseLine interest={slot.interest} added={picked.includes(slot.interest)} />{post}</div> : post}
      </NotMineContext.Provider>);
    });
    if (!only && round % step === step - 1) {
      const at = (round + 1) / step - 1;
      const savedItem = savedOfSlot(saved, day ?? 0, at);
      if (savedItem) posts.push(<SavedPost key={`b${savedItem.id}-${at}`} item={savedItem} />);
      if (hasBooksCard(at) && day) posts.push(<BooksPost key={`k${day}-${at}`} day={day} />);
    }
  }
  if (today?.kahf && !only) posts.splice(Math.min(KAHF_SLOT, posts.length), 0, <KahfPost key={`kahf${day}`} />);
  // Pair ids hold «|», so the list is kept on lines.
  const renderedKey = rendered.join('\n');
  useEffect(() => { if (renderedKey) markFeedSeen(renderedKey.split('\n')); }, [renderedKey]);
  // A prayer that is near comes in once, before the first post below the screen, so what the reader looks at stays put (owner,
  // 2026-11-18); one near when home opens leads the feed. A new visit starts again with the prayer near now leading.
  const soon = usePrayerSoon();
  const feed = useRef<HTMLElement>(null);
  const [cards, setCards] = useState<{ visit: number; list: (Soon & { after: string | null })[] }>({ visit, list: [] });
  // When home opened, or a new visit began: a prayer near then leads the feed.
  const began = useRef({ visit, at: 0 });
  useEffect(() => { began.current = { visit, at: Date.now() }; }, [visit]);
  const prayers = cards.visit === visit ? cards.list : [];
  const keys = posts.map(post => String(post.key));
  useEffect(() => {
    if (!soon || prayers.some(card => card.key === soon.key)) return;
    const tops = keys.map(key => feed.current?.querySelector<HTMLElement>(`[data-post="${CSS.escape(key)}"]`)?.getBoundingClientRect().top ?? Infinity);
    const opening = began.current.visit === visit && Date.now() - began.current.at < OPENING_MS;
    const at = opening ? 0 : insertAt(tops, window.innerHeight);
    setCards({ visit, list: [...prayers.filter(card => (feed.current?.querySelector<HTMLElement>(`[data-post="pr${card.key}"]`)?.getBoundingClientRect().top ?? Infinity) < window.innerHeight), { ...soon, after: at ? keys[at - 1] : null }] });
  }, [soon?.key, visit]); // eslint-disable-line react-hooks/exhaustive-deps -- once for each prayer and visit
  for (const card of only ? [] : prayers) {
    const at = card.after === null ? 0 : keys.indexOf(card.after) + 1;
    posts.splice(at, 0, <PrayerPost key={`pr${card.key}`} prayer={card.prayer} times={card.times} />);
    keys.splice(at, 0, `pr${card.key}`);
  }
  // A mark below the posts: when it comes near the screen, the next step of rounds is added.
  const end = useRef<HTMLDivElement>(null);
  const ready = rounds.length > 0;
  useEffect(() => {
    const mark = end.current;
    if (!mark) return;
    const watch = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setMore(now => ({ view, batches: (now.view === view && now.batches ? now.batches : step) + step }));
    }, { rootMargin: '0px 0px 1200px 0px' });
    watch.observe(mark);
    return () => watch.disconnect();
  }, [view, step, batches, ready]);
  return <section ref={feed} className={styles.feed} aria-label="للتأمل اليوم">
    {posts.map((post, i) => <div key={keys[i]} data-post={keys[i]}>{post}</div>)}
    {!ready && <p className="py-6 text-center"><LoadingDots label="جارٍ التحميل" /></p>}
    {ready && <div ref={end} aria-hidden className="h-px" />}
  </section>;
}
