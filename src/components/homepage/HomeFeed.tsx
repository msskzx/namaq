'use client';

import { createContext, Fragment, isValidElement, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeftRight, Bookmark, BookOpen, Check, CircleMinus, Feather, Layers, Users, EyeOff, LightbulbOff, NotebookPen, ScrollText, Undo2, Swords, BookOpenText, ListTree, MessagesSquare, Link2, History, Network, GitCommitVertical } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import LoadingDots from '@/components/common/LoadingDots';
import Cookies from 'js-cookie';
import StoryMap from '@/app/quran/prophets/[slug]/StoryMap';
import type { FeedPair, FeedTree, SavedContent, SiraCard, StoryCard } from '@/lib/homeFeed';
import type { TermCard } from '@/lib/balaghaTerms';
import type { HadithCard } from '@/lib/forty';
import type { SahihCard } from '@/lib/sahih';
import { SahihHadithView } from '@/components/hadith/SahihParts';
import type { NameCard, TarajimCard } from '@/lib/tarajim';
import { betweenHref, TiesChain, tiesHref } from '@/components/tarajim/TarajimParts';
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
import { bookmarkKind, cardMenuSaveId, isCardBookmark } from '@shared/bookmarkKind';
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
import { useNow } from '@/components/utilities/Utilities';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { savedAs } from '@shared/compareBookmarks';
import { continuePage, readFasilas, serverFasilas, subscribeFasilas } from '@shared/readingMarks';
import { ayahBookmarkId, ayahHref, markAyah, markWord, wordMarkKey, markForgotten, mostForgotten, readDueMarks, rememberAyah, serverAyahMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { isMemorized, memorizedFilters, memorizedPrefer, memorizedQuestions, recallOfDay, touchesMemorized, type Memorized } from '@shared/memorized';
import { FEED_QUIZ_NAMES, feedQuizSeed, OPENINGS, openingSurah, type FeedQuizKind } from '@shared/quiz/feedQuiz';
import { activeInterests, INTERESTS, interestById, interestOf, pickedInterests, restoredInterest, type FeedCardKind } from '@shared/interests';
import QuizAnswer, { type QuizData } from '@/app/quizzes/QuizAnswer';
import type { Hints } from '@shared/quiz/hints';
import { readAyahNotes, serverAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { backToVisit, FEED_AHEAD, FEED_FAR, growingPicks, hasStoryCard, savedOfSlot, leftVisit, markFeedSeen, markStoryOpened, readFeedSeen, readStoriesOpened, serverFeedSeen, serverStoriesOpened, storyIsNew, storyTimes, subscribeFeedSeen, subscribeStoriesOpened, subscribeVisit, visitStart, serverVisit, STORIES, type StoryId } from '@shared/feedSeen';
import { forgottenOrder, reviewHref, type RecitePosition } from '@shared/quran/recite';
import type { PairCard } from '@shared/quran/compareCards';
import { hijriDate, juzLabel, todaysJuz } from '@shared/hijri';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import { ayahPlaces } from '@shared/quran/ayahPlaces';
import { dayNumber } from '@shared/dailyPick';
import { isKahfDay, KAHF_SLOT } from '@shared/homeFeed';
import surahRows from '@shared/data/quran/surahs.json';
import AyahLines, { PageTop, useAyahPage, type Page } from './AyahLines';
import { useMemorized } from './Memorized';
import styles from './Homepage.module.css';
import { SURAH_NAMES } from '@shared/quran/surahNames';
import { qiraatAyat } from '@shared/quran/qiraatData';
import { ayahNoteAt } from '@shared/quran/ayahNotes';
import { QiraatPlace } from '@/app/quran/qiraat/QiraatView';
import { surahName } from '@shared/quran/surahNames';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { CardRowProvider, useRowSlot } from '@/components/common/UnderCard';
import SourceLine, { sourcesOf } from '@/components/common/SourceLine';
import { SourceSlotContext, type Source } from '@/components/common/sourceSlot';
import { citeSource, mushafSource, MUSHAF_BOOK, type QuizSource } from '@shared/quiz/sources';
import { qiraatSources } from '@shared/quiz/bookSources';
import { storySource } from '@shared/quran/pieceSources';
import { termSource } from '@shared/quran/balaghaTerms';

/**
 * The website's home feed, as the app's (mobile/src/components/HomeFeed.tsx): story circles, the page the mushaf was left on,
 * a feed of pairs and trees that skips what this browser has seen (shared/feedSeen.ts) and loads more on request, and the prayer row.
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

const juzHref = (juz: number) => ayahHref(`${JUZ_INDEX[juz - 1].surah}:${JUZ_INDEX[juz - 1].ayah}`);

/** The reader's own day, worked out in the browser (null while the page is drawn on the server). */
function useToday() {
  const now = useNow();
  return useMemo(() => now ? { day: dayNumber(now), date: hijriDate(now), juz: todaysJuz(now), kahf: isKahfDay(now) } : null, [now]);
}

/** Friday's card (owner, 2026-11-20), the app's KahfPost: Surat al-Kahf's first page, a click opens the mushaf there. */
function KahfPost() {
  const { data } = useSWR('/api/home/feed?ayah=18:1', fetchJson<Page>, { revalidateOnFocus: false });
  const href = ayahHref('18:1');
  return <Post labelledBy="kahf-title" head={<PostHead Icon={BookOpen} id="kahf-title" title="سورة الكهف" sub="يوم الجمعة" />}
    open={<Action Icon={BookOpen} label="اقرأ سورة الكهف" href={href} />}
    source={data ? [mushafSource('18:1', data.page)] : undefined}>
    <Link href={href} className={styles.pageSlice} aria-label="اقرأ سورة الكهف" lang="ar">
      {data ? <PageTop page={data} /> : <span className={styles.pageLines} />}
    </Link>
  </Post>;
}

const STORY: Record<StoryId, { label: string; Icon: typeof BookOpen | typeof TreeIcon; href: string }> = {
  juz: { label: 'جزء اليوم', Icon: BookOpen, href: '' },
  forgotten: { label: 'ما نسيته', Icon: LightbulbOff, href: '/library?tab=forgotten' },
  saved: { label: 'المحفوظات', Icon: Bookmark, href: '/library?tab=saved' },
  notes: { label: 'تأملاتي', Icon: NotebookPen, href: '/library?tab=notes' },
  prophets: { label: 'الأنبياء', Icon: ScrollText, href: '/quran/prophets' },
};

/** The circles at the top: a ring in the accent while a circle holds something newer than its last opening. Nothing counted. */
export function Stories() {
  const today = useToday();
  const due = useSyncExternalStore(subscribeDueMarks, readDueMarks, serverAyahMarks);
  const saved = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes, serverAyahNotes);
  const opened = useSyncExternalStore(subscribeStoriesOpened, readStoriesOpened, serverStoriesOpened);
  const times = today ? storyTimes({ due, saved, notes }) : null;
  const ids = STORIES.filter(id => id !== 'juz' || today?.juz);
  return <nav className={styles.stories} aria-label="اختصارات" dir="rtl">
    {ids.map(id => {
      const { label, Icon, href } = STORY[id];
      const lit = !!times && storyIsNew(opened, id, times[id]);
      return <Link key={id} href={id === 'juz' && today?.juz ? juzHref(today.juz[0]) : href} onClick={() => markStoryOpened(id)} className={styles.story}
        aria-label={id === 'juz' && today?.juz ? `${label}: ${juzLabel(today.juz)}` : label}>
        <span className={styles.ring} data-lit={lit || undefined}><span><Icon size={22} aria-hidden /></span></span>
        <span className={styles.storyLabel}>{label}</span>
      </Link>;
    })}
  </nav>;
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
    open={<Action Icon={BookOpen} label="اقرأ" href={href} />}
    source={data ? [{ book: MUSHAF_BOOK, at: `${names[data.surah]}، ص ${num(data.page)}` }] : undefined}
    actions={<>
      {today?.juz && <Link href={juzHref(today.juz[0])} onClick={() => markStoryOpened('juz')} className={`${styles.action} ${styles.accent} text-sm`} aria-label={`اقرأ ${juzLabel(today.juz)}، جزء اليوم`}>{juzLabel(today.juz)}</Link>}
    </>}>
    <Link href={href} className={styles.pageSlice} aria-label={fasila ? 'افتح المصحف عند فاصلتك' : 'افتح المصحف حيث توقفت'} lang="ar">
      {/* The page's first half as the reader draws it (owner, 2026-11-14). */}
      {data ? <PageTop page={data} /> : <span className={styles.pageLines} />}
    </Link>
  </Post>;
}

/** A feed card's head: a round icon, a title and a line under it, like a post's author. With `href`, a click opens the post's own page. */
function PostHead({ Icon, title, sub, href, label, id }: { Icon: typeof BookOpen | typeof TreeIcon; title: string; sub?: string; href?: string; label?: string; id?: string }) {
  const head = <div className={styles.postHead}>
    <span className={styles.avatar}><Icon size={18} aria-hidden /></span>
    <div className="min-w-0"><h3 id={id}>{title}</h3>{sub && <p className={`${styles.muted} ${styles.oneLine}`}>{sub}</p>}</div>
  </div>;
  return href ? <Link href={href} aria-label={label} className="block hover:opacity-80">{head}</Link> : head;
}

/**
 * Every feed post's one shape (owner, 2026-11-14 and 2026-11-20, like an Instagram post), the app's (mobile HomeFeed's
 * Post): the head, the body in one card, the row of icon buttons under it grouped on the right (the open button, the
 * card's tools, save, share), then the source line.
 */
function Post({ head, open, actions, share, source, bar, labelledBy, save, children }: { head: React.ReactNode;
  /** Opens the item in its own reader (the mushaf at the ayah, the hadith in its book): first in the row. */
  open?: React.ReactNode;
  actions?: React.ReactNode;
  /** The card's share button, last of the group, after save. */
  share?: React.ReactNode;
  /** The books the card stands on, named on its source line; a `Reference` inside the card joins its sheet. */
  source?: QuizSource[];
  /** A bar of the card's own between it and its buttons (recall's recite bar). */
  bar?: React.ReactNode; labelledBy?: string;
  /** The card's kind and item, saved as `card:<kind>:<item>` by the first button of its row (owner 2026-11-20, as the app's CardMenuActions). */
  save?: { kind: string; item: string }; children: React.ReactNode }) {
  // What the card's content hands up with UnderCard lands at the start of the row under the card (owner: buttons under the
  // card, never in it); the row hides while it holds no button.
  const [slot, setSlot] = useRowSlot();
  const [handed, setHanded] = useState<[string, Source][]>([]);
  const sourceSlot = useMemo(() => ({ set: (id: string, given: Source | null) => setHanded(now => {
    const rest = now.filter(([at]) => at !== id);
    if (!given) return rest.length === now.length ? now : rest;
    const at = now.findIndex(([key]) => key === id);
    return at < 0 ? [...now, [id, given]] : now.map(entry => (entry[0] === id ? [id, given] : entry));
  }) }), []);
  const own = source ? sourcesOf(source) : [];
  const inner = handed.map(([, given]) => given);
  const body = <>
    {head}
    <Card className="overflow-hidden"><SourceSlotContext.Provider value={sourceSlot}><CardRowProvider slot={slot}>{children}</CardRowProvider></SourceSlotContext.Provider></Card>
    {bar && <div className="mt-2 flex justify-center" data-share-skip>{bar}</div>}
    <div className={styles.postActions} data-share-skip>{open}<span ref={setSlot} className="contents" />{actions}{save && <SaveCard {...save} head={head} />}{share}<NotMine /></div>
    {own.length + inner.length > 0 && <SourceLine named={own.length ? own : inner} sources={[...own, ...inner]} />}
  </>;
  // The reading card is a section of the page named by its head (`labelledBy`); the feed's posts are articles.
  return labelledBy
    ? <section className={styles.postWrap} dir="rtl" aria-labelledby={labelledBy}>{body}</section>
    : <article className={styles.postWrap} dir="rtl">{body}</article>;
}

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

/** «ليس من اهتماماتي», alone at the row's far left (owner, 2026-11-20, the app's NotMineAction). */
function NotMine() {
  const menu = useContext(NotMineContext);
  if (!menu?.notMine) return null;
  return <span className="ms-auto"><Action Icon={CircleMinus} label={`«${interestById(menu.interest)?.name ?? ''}» ليس من اهتماماتي`} onClick={menu.notMine} /></span>;
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
  return <Post head={<PostHead Icon={LightbulbOff} title={title} sub={sub} />}
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
  if (!question) return null;
  return <Post head={<PostHead Icon={kind === 'BRANCHES' ? TreeIcon : Feather} title={FEED_QUIZ_NAMES[kind as FeedQuizKind]} />}
    // After the answer, the ayah's mushaf button leads the card's row, as in the app (owner, 2026-11-15 and 2026-11-20).
    open={given !== undefined && question.ayahKey ? <Action Icon={BookOpen} label="في المصحف" href={ayahHref(question.ayahKey)} /> : undefined}
    actions={<QuizActions />}>
    <div className={styles.question} lang="ar">
      {question.promptArabic !== FEED_QUIZ_NAMES[kind as FeedQuizKind] && <p className="mb-3 pt-2 text-base leading-loose">{question.promptArabic}</p>}
      <QuizAnswer question={question} given={given} typed={typed} hints={hints} revealed={revealed} names={data?.surahNames ?? {}} ar mushaf={false}
        onReveal={() => setRevealed(true)} onType={setTyped} onHints={setHints} onAnswer={setGiven} />
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
 * sideways at the day's group; the map scrolls both ways inside the card. Any tap opens the story page at its top, not scrolled
 * to an event, so a new reader sees where they landed (owner, 2026-11-14).
 */
function StoryPost({ card }: { card: StoryCard }) {
  const router = useRouter();
  const href = `/quran/prophets/${card.slug}`;
  const read = () => router.push(href);
  return <Post save={{ kind: 'prophets', item: card.item }} head={<PostHead Icon={ScrollText} title={card.title} sub={card.phases[card.phase]} href={href} label="افتح القصة" />}
    open={<Action Icon={BookOpen} label="افتح القصة" href={href} />}
    source={[storySource(card.events, card.phase)]}>
    <div className={styles.storyMap} data-story-scroll>
      <StoryMap map={card.map} events={card.events} phases={card.phases} at={card.phase} onRead={read} />
    </div>
  </Post>;
}

/**
 * A sira story as a post (the app's SiraPost): its first report whole, so a first reader has what led to the words and what
 * came of them; the ayat it turns on folded under it. The head opens the story's page.
 */
function SiraPost({ card }: { card: Extract<SiraCard, { kind: 'sira' }> }) {
  const href = `/stories/${card.slug}`;
  return <Post save={card} head={<PostHead Icon={ScrollText} title="من قصص السيرة" sub={card.name} href={href} label={`افتح ${card.name}`} />}
    open={<Action Icon={ScrollText} label={`افتح ${card.name}`} href={href} />}
    source={[citeSource({ text: '', cite: card.report.cite, url: card.report.url })]}>
    <div className="flex flex-col gap-3 p-4" lang="ar">
      <Report report={card.report} plain />
      {card.ayat.map((item, i) => <StoryAyatLines key={item.from} credit={`${item.label}: ${rangeName(item.from, item.to)}`} pages={card.pages[i] ?? []} folded />)}
    </div>
  </Post>;
}

/** A moment of a battle in the source's words (the app's MomentPost); the head opens the battle's page. */
function MomentPost({ card }: { card: Extract<SiraCard, { kind: 'moment' }> }) {
  const href = `/battles/${card.battle.slug}`;
  return <Post save={card} head={<PostHead Icon={Swords} title={`من ${card.battle.name}`} sub={battleLine(card.battle)} href={href} label={`افتح ${card.battle.name}`} />}
    open={<Action Icon={Swords} label={`افتح ${card.battle.name}`} href={href} />}
    source={[citeSource({ text: '', cite: card.moment.cite, url: card.moment.url })]}>
    <div className="p-4" lang="ar"><Moment moment={card.moment} n={card.n} plain /></div>
  </Post>;
}

/**
 * A balagha term as a post (the app's TermPost): its name, the start of its definition in the book's words, and one of
 * al-Suyuti's examples, the ayah words he quotes lit. The head and the first button open the term's page.
 */
function TermPost({ card }: { card: TermCard }) {
  const name = plainName(card.term.name);
  const href = termHref(card.term.name);
  const quote = card.term.quotes[0];
  return <Post save={{ kind: 'term', item: card.item }} head={<PostHead Icon={BookOpenText} title="من مصطلحات البلاغة" sub={quote.book === 'itqan' ? 'الإتقان للسيوطي' : 'تلخيص المفتاح للقزويني'} href={href} label={`افتح ${name}`} />}
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
 * the books that record one (its RecordedPost); the head and the first button open the hadith's page with its records.
 */
function HadithPost({ card }: { card: HadithCard }) {
  const { entry, books } = card;
  const href = `/hadith/forty/${entry.n}`;
  const open = <Action Icon={MessagesSquare} label={`افتح ${entry.heading}`} href={href} />;
  const sub = `${entry.heading}، ${fromCompanion(entry.companion)}`;
  if (card.kind === 'recorded') return <Post save={card} head={<PostHead Icon={Network} title="من أخرجه" sub={sub} href={href} label={`افتح ${entry.heading}`} />} open={open} source={card.sources}>
    <div className="flex flex-col gap-3 px-4 py-3" lang="ar">
      <p className="line-clamp-3 text-[1.125rem] leading-[1.9]">{entry.text}</p>
      <HadithBooks top={entry.heading} boxes={card.boxes} namer={compilerOf(entry).name} />
    </div>
  </Post>;
  if (card.kind === 'isnad') return <Post save={card} head={<PostHead Icon={GitCommitVertical} title="من الإسناد" sub={sub} href={href} label={`افتح ${entry.heading}`} />}
    open={open} source={card.sources}>
    <div className="flex flex-col gap-3 px-4 py-3" lang="ar">
      <FortyIsnad isnad={card.record.isnad} size={card.size} />
      <p className="line-clamp-3 text-[1.125rem] leading-[1.9]">{card.record.saying}</p>
    </div>
  </Post>;
  const rajab = card.kind === 'rajab';
  return <Post save={card} head={<PostHead Icon={rajab ? BookOpenText : MessagesSquare} title={rajab ? 'من شرح ابن رجب' : 'من الحديث'} sub={sub} href={href} label={`افتح ${entry.heading}`} />}
    open={open} source={card.sources}>
    <div className="px-4 py-3" lang="ar">
      {card.kind === 'rajab' ? <IbnRajab only={card.passage} books={books} /> : <p className="text-[1.1875rem] leading-[1.9]">{entry.text}</p>}
    </div>
  </Post>;
}

/** A hadith of Sahih al-Bukhari or Sahih Muslim whole (the app's SahihPost); the head opens its page. */
function SahihPost({ card }: { card: SahihCard }) {
  const { book, hadith } = card;
  const href = `/hadith/sahih/${book.slug}/${hadith.n}`;
  const name = `${book.title} ${num(hadith.n)}`;
  return <Post save={card} head={<PostHead Icon={MessagesSquare} title={`من ${book.title}`} sub={card.where} href={href} label={`افتح ${name}`} />}
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
  return <Post save={card} head={<PostHead Icon={Users} title="من التراجم" sub={card.person.name} href={href} label={`افتح ترجمة ${card.person.name}`} />}
    open={<Action Icon={Users} label={`افتح ترجمة ${card.person.name}`} href={href} />}
    actions={<Action Icon={Link2} label={card.person.sex === 'FEMALE' ? 'صلاتها' : 'صلاته'} href={tiesHref(card.person.slug)} />}
    source={card.sources}>
    <div className="flex flex-col gap-1.5 px-4 py-3" lang="ar">
      <p className="text-[1.125rem] leading-[1.85]">{card.virtue.text}</p>
      {card.virtue.by && <p className="text-sm text-[var(--home-muted)]">{card.virtue.by}</p>}
    </div>
  </Post>;
}

/**
 * «الألقاب» and «الكنى» (the app's NamePost): one person's laqab or kunya large, the person under it, the book's words when
 * they say more than the name, and the person page's folded reference; the head opens the person's page.
 */
function NamePost({ card }: { card: NameCard }) {
  const href = `/people/${card.person.slug}`;
  return <Post save={card} head={<PostHead Icon={Users} title={card.kind === 'laqab' ? 'لقب وصاحبه' : 'كنية وصاحبها'} sub={card.person.name} href={href} label={`افتح ترجمة ${card.person.name}`} />}
    open={<Action Icon={Users} label={`افتح ترجمة ${card.person.name}`} href={href} />} source={card.sources}>
    <div className="flex flex-col gap-1 px-4 py-3" lang="ar">
      <p className="text-[1.875rem] font-bold leading-[1.6] text-[var(--home-accent)]">{card.name}</p>
      <p className="text-[1.1875rem] leading-[1.6]">{card.person.name}</p>
      {card.quote && <p className="text-base leading-[1.75] text-[var(--home-muted)]">«{card.quote}»{card.by ? ` ${card.by}` : ''}</p>}
    </div>
  </Post>;
}

/**
 * «صلة» (the app's TiePost): two converted people and the nearest chain of ties that joins them, drawn as «بينه وبين…»
 * draws it, then in one sentence with the pages that state each tie; the head opens «بينه وبين…» with the two picked.
 */
function TiePost({ card }: { card: Extract<TarajimCard, { kind: 'tie' }> }) {
  return <Post save={card} head={<PostHead Icon={Link2} title="صلة" sub={`${card.a.name} و${card.b.name}`} href={betweenHref([card.a.slug, card.b.slug])} label={`ارسم الصلة بين ${card.a.name} و${card.b.name}`} />}
    open={<Action Icon={Link2} label={`ارسم الصلة بين ${card.a.name} و${card.b.name}`} href={betweenHref([card.a.slug, card.b.slug])} />}
    source={card.sources}
    actions={<>
      <Action Icon={Link2} label={`صلات ${card.a.name}`} href={tiesHref(card.a.slug)} />
      <Action Icon={Link2} label={`صلات ${card.b.name}`} href={tiesHref(card.b.slug)} />
    </>}>
    <div className="flex flex-col gap-1.5 px-4 py-3" lang="ar">
      <TiesChain chain={card.chain} inCard />
      <p className="text-[1.125rem] leading-[1.85]">{card.sentence}</p>
    </div>
  </Post>;
}

/** «من حياته» (the app's LifePost): a person's «حياته» timeline as his page draws it, the rail a year a line; the head opens his page. */
function LifePost({ card }: { card: Extract<TarajimCard, { kind: 'life' }> }) {
  const href = `/people/${card.person.slug}`;
  return <Post save={card} head={<PostHead Icon={History} title={card.person.sex === 'FEMALE' ? 'من حياتها' : 'من حياته'} sub={card.person.name} href={href} label={`افتح ترجمة ${card.person.name}`} />}
    open={<Action Icon={Users} label={`افتح ترجمة ${card.person.name}`} href={href} />} source={card.sources}>
    <div className="px-2.5 py-3.5">
      <LifeTimeline items={card.items} inCard compact linked={false} />
    </div>
  </Post>;
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
    <PostHead Icon={TreeIcon} title="من متشابهات القرآن" sub={ayahPlaces(tree.ayat?.map(ayah => ayah.key) ?? [], names)} href={tree.href} label="افتح الشجرة في متشابهات القرآن" />
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
    <QiraatPlace ayah={ayah} max={2} more={href} lines={pages ? <AyahLines ayah={ayah} pages={pages} shown whole checked={null} /> : <LoadingDots label="جارٍ التحميل" />} />
  </Post>;
}

/** Batches added each time the page nears the feed's end. */
const MORE = 3;
type Ids = { pairs: (string | null)[]; trees: (string | null)[]; pairKeys?: string[][]; treeKeys?: string[][] };
type Content = { pairs: FeedPair[]; trees: FeedTree[] };

/** The home feed: pairs and trees not seen before, a forgotten ayah that is due, and more each time the page nears its end. */
/** `only`: one interest's id, its cards alone (the chip row over the feed). */
export function Feed({ only = null }: { only?: string | null } = {}) {
  const today = useToday();
  const day = today?.day;
  const visit = useSyncExternalStore(subscribeVisit, visitStart, serverVisit);
  // «More» counts per visit, so a new visit starts again at one batch in the same render that picks it.
  // «More» counts per visit and chip, so either starts again at one batch in the same render that picks it.
  const view = `${visit}|${only ?? ''}`;
  const [more, setMore] = useState({ view, batches: 1 });
  const batches = more.view === view ? more.batches : 1;
  const seen = useSyncExternalStore(subscribeFeedSeen, readFeedSeen, serverFeedSeen);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  // The saved items as they were when the visit began (once read in the browser), so saving or unsaving a card does not move the cards on screen.
  const savedAtVisit = useRef<{ visit: number; list: typeof bookmarks } | null>(null);
  if (!savedAtVisit.current || savedAtVisit.current.visit !== visit || (!savedAtVisit.current.list.length && bookmarks.length)) savedAtVisit.current = { visit, list: bookmarks };
  // Saved cards join only when the website draws their kind; the others stay on the library's list.
  const saved = savedAtVisit.current.list.filter(item => !isCardBookmark(item.id) || drawsCard(item.id));
  // The interests picked on this device (shared/interests.ts), as they were when the visit began (a change starts a new
  // visit, so the cards on screen never move): the feed brings only theirs, questions in turn by them.
  const interests = useSyncExternalStore(pickedInterests.subscribe, pickedInterests.read, pickedInterests.server);
  const picksAtVisit = useRef<{ visit: number; list: typeof interests } | null>(null);
  if (!picksAtVisit.current || picksAtVisit.current.visit !== visit) picksAtVisit.current = { visit, list: interests };
  const active = only ? INTERESTS.filter(interest => interest.id === only) : activeInterests(picksAtVisit.current.list);
  const quizKinds = active.flatMap(interest => interest.quizzes);
  const shows = (kind: string) => active.some(interest => (interest.cards as readonly string[]).includes(kind));
  const due = useSyncExternalStore(subscribeDueMarks, readDueMarks, serverAyahMarks);
  const forgotten = mostForgotten(due)[0];
  // The settings under «ما أحفظه»: questions come from the memorized range, pondering puts it first.
  const memorized = useMemorized();
  const questions = useSyncExternalStore(memorizedQuestions.subscribe, memorizedQuestions.read, memorizedQuestions.server);
  const prefer = useSyncExternalStore(memorizedPrefer.subscribe, memorizedPrefer.read, memorizedPrefer.server);
  const recall = useMemo(() => (memorized && day ? recallOfDay(questions ? memorized : { all: true }, day) : undefined), [memorized, questions, day]);
  // A tab hidden for long and shown again starts a new visit (shared/feedSeen.ts).
  useEffect(() => {
    const change = () => (document.hidden ? leftVisit() : backToVisit());
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  // The ids reach FEED_AHEAD past the batches shown, so the fresh ones can be found further on; never a limit (owner, 2026-11-18).
  const reach = Math.min(FEED_FAR, (Math.floor(batches / FEED_AHEAD) + 2) * FEED_AHEAD);
  const { data: ids } = useSWR(day ? `/api/home/feed?day=${day}&n=${reach}` : null, fetchJson<Ids>, { revalidateOnFocus: false, keepPreviousData: true });
  // The offsets picked: fresh ids first, in the day's order.
  // The offsets already shown stay in place as more come; a new visit, day or setting picks afresh.
  const shownPairs = useRef<{ reset?: unknown[]; list: number[] }>({ list: [] }).current;
  const shownTrees = useRef<{ reset?: unknown[]; list: number[] }>({ list: [] }).current;
  const picked = useMemo(() => {
    if (!ids) return null;
    const pick = (holder: typeof shownPairs, list: (string | null)[], keys: string[][] | undefined, count: number) => growingPicks(holder, [visit, day, prefer, memorized],
      offset => (list[offset] ? offset : undefined), offset => list[offset]!, seen, count,
      { since: visit, tries: list.length, prefer: prefer && keys ? offset => touchesMemorized(keys[offset] ?? [], memorized) : undefined });
    return { pairs: pick(shownPairs, ids.pairs, ids.pairKeys, batches), trees: pick(shownTrees, ids.trees, ids.treeKeys, batches) };
  }, [ids, seen, batches, prefer, memorized, visit, day, shownPairs, shownTrees]);
  // Pairs and trees load apart, so the pairs show while the trees are still being worked out.
  const swr = { revalidateOnFocus: false, keepPreviousData: true };
  const pieces = (kind: 'p' | 't', offsets: number[]) => () => inPieces<Content>(some => `/api/home/feed?day=${day}&${kind}=${some.join(',')}`, offsets)
    .then(all => ({ pairs: all.flatMap(piece => piece.pairs), trees: all.flatMap(piece => piece.trees) }));
  const { data: pairContent, isValidating: pairsLoading } = useSWR(day && picked && shows('pair') ? `/api/home/feed?day=${day}&p=${picked.pairs.join(',')}` : null, picked ? pieces('p', picked.pairs) : null, swr);
  const { data: treeContent, isValidating: treesLoading } = useSWR(day && picked && shows('tree') ? `/api/home/feed?day=${day}&t=${picked.trees.join(',')}` : null, picked ? pieces('t', picked.trees) : null, swr);
  // The prophets cards of the batches shown, worked out on the server (the stories' ayat stay there).
  const storySlots = shows('prophets') ? Array.from({ length: batches }, (_, i) => i).filter(hasStoryCard) : [];
  const { data: stories } = useSWR(day && storySlots.length ? `/api/home/feed?day=${day}&s=${storySlots.join(',')}` : null,
    () => inPieces<StoryCard[]>(some => `/api/home/feed?day=${day}&s=${some.join(',')}`, storySlots).then(all => all.flat()), swr);
  // The sira and battle-moment cards, one a batch, worked out on the server (a story card brings its ayat's mushaf pages with it).
  const siraSlots = shows('sira') || shows('moment') ? Array.from({ length: batches }, (_, i) => i) : [];
  const { data: sira } = useSWR(day && siraSlots.length ? `/api/home/feed?day=${day}&sira=${siraSlots.join(',')}` : null,
    () => inPieces<SiraCard[]>(some => `/api/home/feed?day=${day}&sira=${some.join(',')}`, siraSlots).then(all => all.flat()), swr);
  // The hadith, Ibn Rajab, «من أخرجه» and «من الإسناد» cards, one a batch, worked out on the server (the records and Ibn Rajab's book stay there).
  const hadithSlots = shows('hadith') || shows('rajab') || shows('recorded') || shows('isnad') ? Array.from({ length: batches }, (_, i) => i) : [];
  const { data: hadith } = useSWR(day && hadithSlots.length ? `/api/home/feed?day=${day}&hadith=${hadithSlots.join(',')}` : null,
    () => inPieces<HadithCard[]>(some => `/api/home/feed?day=${day}&hadith=${some.join(',')}`, hadithSlots).then(all => all.flat()), swr);
  // The Sahih cards, one a batch, al-Bukhari and Muslim in turn, worked out on the server (the books' texts stay there).
  const sahihSlots = shows('bukhari') || shows('muslim') ? Array.from({ length: batches }, (_, i) => i) : [];
  const { data: sahih } = useSWR(day && sahihSlots.length ? `/api/home/feed?day=${day}&sahih=${sahihSlots.join(',')}` : null,
    () => inPieces<SahihCard[]>(some => `/api/home/feed?day=${day}&sahih=${some.join(',')}`, sahihSlots).then(all => all.flat()), swr);
  // The virtue and «صلة» cards, one a batch, worked out on the server (the people's entries stay there).
  const tarajimSlots = shows('tarajim') || shows('tie') || shows('life') ? Array.from({ length: batches }, (_, i) => i) : [];
  const { data: tarajim } = useSWR(day && tarajimSlots.length ? `/api/home/feed?day=${day}&tarajim=${tarajimSlots.join(',')}` : null,
    () => inPieces<TarajimCard[]>(some => `/api/home/feed?day=${day}&tarajim=${some.join(',')}`, tarajimSlots).then(all => all.flat()), swr);
  // The laqab and kunya cards, one of each a batch, worked out on the server like the virtue cards.
  const nameSlots = shows('laqab') || shows('kunya') ? Array.from({ length: batches }, (_, i) => i) : [];
  const { data: names } = useSWR(day && nameSlots.length ? `/api/home/feed?day=${day}&names=${nameSlots.join(',')}` : null,
    () => inPieces<NameCard[]>(some => `/api/home/feed?day=${day}&names=${some.join(',')}`, nameSlots).then(all => all.flat()), swr);
  // The balagha term cards, in every other batch, worked out on the server (al-Suyuti's book stays there).
  const termSlots = shows('term') ? Array.from({ length: batches }, (_, i) => i).filter(i => i % 2 === 1) : [];
  const { data: termCards } = useSWR(day && termSlots.length ? `/api/home/feed?day=${day}&term=${termSlots.join(',')}` : null,
    () => inPieces<TermCard[]>(some => `/api/home/feed?day=${day}&term=${some.join(',')}`, termSlots).then(all => all.flat()), swr);
  // Pairs and trees load only for the interests shown, so what is not shown is never fetched or counted as seen.
  const content = pairContent || treeContent ? { pairs: pairContent?.pairs ?? [], trees: treeContent?.trees ?? [] } : undefined;
  const ready = (!shows('pair') || !!pairContent) && (!shows('tree') || !!treeContent);
  useEffect(() => { if (pairContent) markFeedSeen(pairContent.pairs.map(pair => pair.id)); }, [pairContent]);
  useEffect(() => { if (treeContent) markFeedSeen(treeContent.trees.map(tree => tree.id)); }, [treeContent]);
  // A mark below the posts: when it comes near the screen, the next batch is added.
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mark = end.current;
    if (!mark) return;
    const watch = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setMore(now => ({ view, batches: (now.view === view ? now.batches : 1) + MORE }));
    }, { rootMargin: '0px 0px 1200px 0px' });
    watch.observe(mark);
    return () => watch.disconnect();
  }, [view, batches, pairsLoading, treesLoading]);
  // Cards taken out with «ليس من اهتماماتي» this visit, by key: each leaves a line in its place, the others stay as they are
  // (the app's feed). The button is not on one interest's own view, nor on the only interest left (none picked means all),
  // nor on a card whose interest was already taken out.
  const [removed, setRemoved] = useState<{ visit: number; keys: ReadonlySet<string> }>({ visit, keys: new Set() });
  const removedKeys = removed.visit === visit ? removed.keys : new Set<string>();
  const showing = new Set(activeInterests(interests).map(interest => interest.id));
  const posts: React.ReactNode[] = [];
  /** Adds a card of `kind`, with its interest's «ليس من اهتماماتي», or the line that replaced it. */
  const put = (post: React.ReactElement, kind: string) => {
    const key = String(post.key);
    const interest = interestOf(kind as FeedCardKind)?.id;
    if (!interest) { posts.push(post); return; }
    if (removedKeys.has(key)) {
      posts.push(<RemovedLine key={key} interest={interest} onUndo={() => setRemoved({ visit, keys: new Set([...removedKeys].filter(each => each !== key)) })} />);
      return;
    }
    const notMine = only || !showing.has(interest) || showing.size === 1 ? undefined : () => {
      setRemoved({ visit, keys: new Set([...removedKeys, key]) });
      pickedInterests.write(activeInterests(pickedInterests.read()).map(each => each.id).filter(id => id !== interest));
    };
    posts.push(<NotMineContext.Provider key={key} value={{ interest, notMine }}>{post}</NotMineContext.Provider>);
  };
  for (let i = 0; i < batches; i++) {
    const pair = shows('pair') ? content?.pairs[i] : undefined;
    if (pair) put(<PairPost key={`p${pair.id}`} pair={pair} />, 'pair');
    if (i === 0 && forgotten && !only) posts.push(<ForgottenPost key={`ask${forgotten}`} ayah={forgotten} review={reviewHref(forgottenOrder(Object.keys(due))[0])} />);
    else if (i === 0 && recall && !only) posts.push(<ForgottenPost key={`ask${recall}`} ayah={recall} />);
    // A question card in every batch after the first (whose question is the recall card), each kind in turn; from the first
    // when one interest is shown alone.
    if ((i > 0 || only) && day && quizKinds.length) {
      const kind = quizKinds[(day + i) % quizKinds.length];
      const seed = feedQuizSeed(day, i);
      put(kind === OPENINGS
        ? <OpeningPost key={`q${day}-${i}`} seed={seed} memorized={questions ? memorized : null} />
        : <QuizPost key={`q${day}-${i}-${questions ? JSON.stringify(memorizedFilters(memorized)) : ''}`} kind={kind} seed={seed} scope={questions ? memorizedFilters(memorized) : {}} />, kind);
    }
    const tree = shows('tree') ? content?.trees[i] : undefined;
    if (tree) put(<TreePost key={`t${tree.id}`} tree={tree} />, 'tree');
    const savedItem = only ? undefined : savedOfSlot(saved, day ?? 0, i);
    if (savedItem) posts.push(<SavedPost key={`b${savedItem.id}-${i}`} item={savedItem} />);
    // A readings card in every batch after the first, as the app's feed has one among its ayah cards.
    const readings = i > 0 && day && shows('note-qiraat') ? qiraatAyat()[ayahNoteAt(qiraatAyat().length, day, i)] : undefined;
    if (readings) put(<QiraatPost key={`r${readings}`} ayah={readings} />, 'note-qiraat');
    const story = shows('prophets') ? stories?.find(card => card.slot === i) : undefined;
    if (story) put(<StoryPost key={`s${day}-${i}`} card={story} />, 'prophets');
    const hadithCard = hadith?.find(card => card.slot === i);
    if (hadithCard && shows(hadithCard.kind)) put(<HadithPost key={`h${day}-${i}`} card={hadithCard} />, hadithCard.kind);
    const sahihCard = sahih?.find(card => card.slot === i);
    if (sahihCard && shows(sahihCard.kind)) put(<SahihPost key={`sahih${day}-${i}`} card={sahihCard} />, sahihCard.kind);
    const termCard = shows('term') ? termCards?.find(card => card.slot === i) : undefined;
    if (termCard) put(<TermPost key={`term${day}-${i}`} card={termCard} />, 'term');
    const siraCard = sira?.find(card => card.slot === i);
    if (siraCard?.kind === 'sira' && shows('sira')) put(<SiraPost key={`sira${day}-${i}`} card={siraCard} />, 'sira');
    if (siraCard?.kind === 'moment' && shows('moment')) put(<MomentPost key={`m${day}-${i}`} card={siraCard} />, 'moment');
    const tarajimCard = tarajim?.find(card => card.slot === i);
    if (tarajimCard?.kind === 'tarajim' && shows('tarajim')) put(<TarajimPost key={`tj${day}-${i}`} card={tarajimCard} />, 'tarajim');
    if (tarajimCard?.kind === 'tie' && shows('tie')) put(<TiePost key={`tie${day}-${i}`} card={tarajimCard} />, 'tie');
    if (tarajimCard?.kind === 'life' && shows('life')) put(<LifePost key={`life${day}-${i}`} card={tarajimCard} />, 'life');
    // Laqab on even batches, kunya on odd ones, so the two do not stand together; every batch when only one is shown.
    const nameKind = shows('laqab') && shows('kunya') ? (i % 2 ? 'kunya' : 'laqab') : shows('kunya') ? 'kunya' : 'laqab';
    const nameCard = names?.find(card => card.slot === i && card.kind === nameKind);
    if (nameCard && shows(nameCard.kind)) put(<NamePost key={`n${nameCard.kind}${day}-${i}`} card={nameCard} />, nameCard.kind);
  }
  if (today?.kahf && !only) posts.splice(Math.min(KAHF_SLOT, posts.length), 0, <KahfPost key={`kahf${day}`} />);
  return <section className={styles.feed} aria-label="للتأمل اليوم">
    {posts}
    {!ready && <p className="py-6 text-center"><LoadingDots label="جارٍ التحميل" /></p>}
    {ready && !pairsLoading && !treesLoading && <div ref={end} aria-hidden className="h-px" />}
  </section>;
}
