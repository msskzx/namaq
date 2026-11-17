'use client';

import { Fragment, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeftRight, Bookmark, BookOpen, Check, Feather, Users, EyeOff, LightbulbOff, NotebookPen, ScrollText } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import LoadingDots from '@/components/common/LoadingDots';
import Cookies from 'js-cookie';
import StoryMap from '@/app/quran/prophets/[slug]/StoryMap';
import type { SavedContent, StoryCard } from '@/lib/homeFeed';
import { bookmarkKind } from '@shared/bookmarkKind';
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
import type { TreePreview } from '@/app/quran/read/ayahPreview';
import { LAST_PAGE_KEY } from '@/app/quran/read/ReaderView';
import { lastPage } from '@/app/quran/read/OpenLastPage';
import { useNow } from '@/components/utilities/Utilities';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { savedAs } from '@shared/compareBookmarks';
import { continuePage, readFasilas, serverFasilas, subscribeFasilas } from '@shared/readingMarks';
import { ayahBookmarkId, ayahHref, markForgotten, mostForgotten, readDueMarks, rememberAyah, serverAyahMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { isMemorized, memorizedFilters, memorizedPrefer, memorizedQuestions, recallOfDay, touchesMemorized, type Memorized } from '@shared/memorized';
import { FEED_QUIZ_NAMES, feedQuizKind, feedQuizSeed, OPENINGS, openingSurah, type FeedQuizKind } from '@shared/quiz/feedQuiz';
import QuizAnswer, { type QuizData } from '@/app/quizzes/QuizAnswer';
import type { Hints } from '@shared/quiz/hints';
import { readAyahNotes, serverAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { backToVisit, FEED_AHEAD, freshPicks, hasStoryCard, savedOfSlot, leftVisit, markFeedSeen, markStoryOpened, readFeedSeen, readStoriesOpened, serverFeedSeen, serverStoriesOpened, storyIsNew, storyTimes, subscribeFeedSeen, subscribeStoriesOpened, subscribeVisit, visitStart, serverVisit, STORIES, type StoryId } from '@shared/feedSeen';
import { forgottenOrder, type RecitePosition } from '@shared/quran/recite';
import type { PairCard } from '@shared/quran/compareCards';
import { hijriDate, todaysJuz } from '@shared/hijri';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import { ayahPlaces } from '@shared/quran/ayahPlaces';
import { dayNumber } from '@shared/dailyPick';
import surahRows from '@shared/data/quran/surahs.json';
import { reviewHref } from './HomeCards';
import AyahLines, { PageTop, useAyahPage, type Page } from './AyahLines';
import { useMemorized } from './Memorized';
import styles from './Homepage.module.css';

/**
 * The website's home feed, as the app's (mobile/src/components/HomeFeed.tsx): story circles, the page the mushaf was left on,
 * a feed of pairs and trees that skips what this browser has seen (shared/feedSeen.ts) and loads more on request, and the prayer row.
 */

const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url);
  return response.json();
};

/** «الجزء ٣», or «الجزءان ٢٩ و٣٠» on the last day of a 29-day month. */
const juzLabel = (juz: number[]) => (juz.length > 1 ? `الجزءان ${num(juz[0])} و${num(juz[1])}` : `الجزء ${num(juz[0])}`);
const juzHref = (juz: number) => ayahHref(`${JUZ_INDEX[juz - 1].surah}:${JUZ_INDEX[juz - 1].ayah}`);

/** The reader's own day, worked out in the browser (null while the page is drawn on the server). */
function useToday() {
  const now = useNow();
  return useMemo(() => now ? { day: dayNumber(now), date: hijriDate(now), juz: todaysJuz(now) } : null, [now]);
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
    actions={<>
      <Action Icon={BookOpen} label="اقرأ" href={href} />
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
 * Every feed post's one shape (owner, 2026-11-14), the compare card's and the app's (mobile HomeFeed's Post): the head,
 * the body in one card, and a row of icon buttons under the card, starting on the right.
 */
function Post({ head, actions, bar, labelledBy, children }: { head: React.ReactNode; actions?: React.ReactNode;
  /** A bar of the card's own between it and its buttons (recall's recite bar). */
  bar?: React.ReactNode; labelledBy?: string; children: React.ReactNode }) {
  const body = <>
    {head}
    <div className={styles.post}>{children}</div>
    {bar && <div className="mt-2 flex justify-center" data-share-skip>{bar}</div>}
    {actions && <div className={styles.postActions} data-share-skip>{actions}</div>}
  </>;
  // The reading card is a section of the page named by its head (`labelledBy`); the feed's posts are articles.
  return labelledBy
    ? <section className={styles.postWrap} dir="rtl" aria-labelledby={labelledBy}>{body}</section>
    : <article className={styles.postWrap} dir="rtl">{body}</article>;
}

/** One icon button of a post's row: a link with `href`, else a button; `on` lights it, `tone` colours it. */
function Action({ Icon, label, href, onClick, on, tone, disabled }: { Icon: typeof BookOpen; label: string; href?: string; onClick?: () => void; on?: boolean; tone?: 'green'; disabled?: boolean }) {
  const className = [styles.action, on && styles.actionOn, tone === 'green' && styles.green].filter(Boolean).join(' ');
  const icon = <Icon size={22} aria-hidden />;
  return href
    ? <Link href={href} onClick={onClick} aria-label={label} title={label} className={className}>{icon}</Link>
    : <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} aria-pressed={on} className={className}>{icon}</button>;
}

const compareNames = Object.fromEntries(surahRows.map(row => [row.number, { ar: row.title, en: row.nameTransliterated }]));

/** A look-alike pair as a post: the compare page's own card (read-along, views, saving, sharing), and a link to open it there. */
function PairPost({ pair }: { pair: PairCard }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const [a, b] = pair.sides;
  const label = (side: PairCard['sides'][number]) => `${names[side.surah]} ${num(side.ayat[0].number)}`;
  return <article dir="rtl">
    <PostHead Icon={ArrowLeftRight} title="آيتان متشابهتان" sub={`${label(a)} · ${label(b)}`} />
    <ul className="list-none p-0">
      <CompareCard card={pair} names={compareNames} ar savedIds={savedAs(pair.id, bookmarks)} page={surahPairHref(a.surah, b.surah)} view={defaultBranchView(Cookies.get(BRANCH_VIEW_COOKIE))} />
    </ul>
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
function ForgottenPost({ ayah, review, title = 'هل تذكرها؟' }: { ayah: string; review?: string; title?: string }) {
  const [, setGone] = useState(0);
  const [writing, setWriting] = useState(false);
  useEffect(() => { try { setWriting(localStorage.getItem(RECALL_WRITE) === 'true'); } catch {} }, []);
  const toggleWriting = () => setWriting(on => { try { localStorage.setItem(RECALL_WRITE, String(!on)); } catch {} return !on; });
  const [surah, number] = ayah.split(':').map(Number);
  if (!review && recalled.has(ayah)) return null;
  return <Recall key={`${ayah}-${writing}`} ayah={ayah} title={title} sub={`${names[surah]} ${num(number)}`} writing={writing} onWriting={toggleWriting}>
    <Action Icon={Check} label="تذكّرتها" tone="green" onClick={() => { if (review) rememberAyah(ayah); else { recalled.add(ayah); setGone(n => n + 1); } }} />
    {!review && <Action Icon={LightbulbOff} label="نسيتها" onClick={() => { recalled.add(ayah); markForgotten(ayah); setGone(n => n + 1); }} />}
    {review && <Action Icon={EyeOff} label="راجع ما نسيت" href={review} />}
    <Action Icon={BookOpen} label="في المصحف" href={ayahHref(ayah)} />
  </Recall>;
}

/**
 * The recall card itself (the app's Recall): recite mode on one ayah (components/recite, the mushaf's own), with its bar
 * under the card, stopping at the ayah's end. A tap, double tap or long press on the ayah does what it does in recite mode
 * (the reader's gesture settings, read/usePageGestures); the pen writes what the pen setting asks. Drawn afresh for each way
 * of asking (`writing`).
 */
function Recall({ ayah, title, sub, writing, onWriting, children }: { ayah: string; title: string; sub: string; writing: boolean; onWriting: () => void; children: React.ReactNode }) {
  const { pages, words } = useAyahPage(ayah);
  const model = useMemo(() => (pages ? pageModel(pages.data, pages.top) : null), [pages]);
  const [position, setPosition] = useState<RecitePosition>({ start: ayah, shown: null, words: 0 });
  const pen = usePenRule();
  const recite = useRecite({ model, position, setPosition, writing, pen, until: ayah });
  const run = (action: GestureAction, key: string | undefined) => {
    if (action === 'next-ayah') recite.nextAyah();
    else if (action === 'next-word') recite.nextWord();
    else if (action === 'back') recite.back();
    else if (key !== ayah) return;
    else if (action === 'forgot') markForgotten(ayah);
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
    actions={children}>
    <div ref={lines} className={styles.recall}>
      {!pages && <LoadingDots label="جارٍ التحميل" />}
      {pages && <AyahLines ayah={ayah} pages={pages} shown={recite.done} words={position.words} checked={recite.checked} write={recite.write ?? undefined} />}
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
  return <Post head={<PostHead Icon={kind === 'BRANCHES' ? TreeIcon : Feather} title={FEED_QUIZ_NAMES[kind as FeedQuizKind]} />} actions={<>
    {/* After the answer, the ayah's mushaf button sits in the card's row, as in the app (owner, 2026-11-15). */}
    {given !== undefined && question.ayahKey && <Action Icon={BookOpen} label="في المصحف" href={ayahHref(question.ayahKey)} />}
    <QuizActions />
  </>}>
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
  return <Post head={<PostHead Icon={ScrollText} title={card.title} sub={card.phases[card.phase]} href={href} label="افتح القصة" />}
    actions={<Action Icon={BookOpen} label="افتح القصة" href={href} />}>
    <div className={styles.storyMap} data-story-scroll>
      <StoryMap map={card.map} events={card.events} phases={card.phases} at={card.phase} onRead={read} />
    </div>
  </Post>;
}

type Tree = TreePreview & { text: string };

/** A saved ayah as a post: the ayah in the mushaf's own lines, as the recall card shows it once revealed. */
function SavedAyahPost({ ayah }: { ayah: string }) {
  const { pages } = useAyahPage(ayah);
  const [surah, number] = ayah.split(':').map(Number);
  return <Post head={<PostHead Icon={Bookmark} title="من المحفوظات" sub={`${names[surah]} ${num(number)}`} />}
    actions={<Action Icon={BookOpen} label="في المصحف" href={ayahHref(ayah)} />}>
    <div className={styles.recall}>
      {pages ? <AyahLines ayah={ayah} pages={pages} shown whole checked={null} /> : <LoadingDots label="جارٍ التحميل" />}
    </div>
  </Post>;
}

/**
 * A saved item as its own card (owner, 2026-11-14): a tree as the tree card, a compare card as the pair card, an ayah in the
 * mushaf's lines. One that the data no longer holds is skipped.
 */
function SavedPost({ item }: { item: SavedItem }) {
  const kind = bookmarkKind(item);
  const { data } = useSWR(kind === 'ayah' ? null : `/api/home/feed?saved=${encodeURIComponent(item.id)}`, fetchJson<SavedContent>, { revalidateOnFocus: false });
  if (kind === 'ayah') { const ayah = item.id.slice('ayah:'.length); return /^\d+:\d+$/.test(ayah) && names[Number(ayah.split(':')[0])] ? <SavedAyahPost ayah={ayah} /> : null; }
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
    <TreeViewCard tree={tree} height={TREE_HEIGHT} names={names} mixed frameClassName={styles.post} actionsClassName={styles.postActions} />
  </article>;
}

/** Batches added each time the page nears the feed's end. */
const MORE = 3;
type Ids = { pairs: (string | null)[]; trees: (string | null)[]; pairKeys?: string[][]; treeKeys?: string[][] };
type Content = { pairs: PairCard[]; trees: (TreePreview & { text: string })[] };

/** The home feed: pairs and trees not seen before, a forgotten ayah that is due, and more each time the page nears its end. */
export function Feed() {
  const today = useToday();
  const day = today?.day;
  const visit = useSyncExternalStore(subscribeVisit, visitStart, serverVisit);
  // «More» counts per visit, so a new visit starts again at one batch in the same render that picks it.
  const [more, setMore] = useState({ visit, batches: 1 });
  const batches = more.visit === visit ? more.batches : 1;
  const seen = useSyncExternalStore(subscribeFeedSeen, readFeedSeen, serverFeedSeen);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  // The saved items as they were when the visit began (once read in the browser), so saving or unsaving a card does not move the cards on screen.
  const savedAtVisit = useRef<{ visit: number; list: typeof bookmarks } | null>(null);
  if (!savedAtVisit.current || savedAtVisit.current.visit !== visit || (!savedAtVisit.current.list.length && bookmarks.length)) savedAtVisit.current = { visit, list: bookmarks };
  const saved = savedAtVisit.current.list;
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
  const { data: ids } = useSWR(day ? `/api/home/feed?day=${day}` : null, fetchJson<Ids>, { revalidateOnFocus: false });
  // The offsets picked: fresh ids first, in the day's order.
  const picked = useMemo(() => {
    if (!ids) return null;
    const pick = (list: (string | null)[], keys: string[][] | undefined, count: number) => freshPicks(offset => (list[offset] ? offset : undefined), offset => list[offset]!, seen, count,
      { since: visit, tries: list.length, prefer: prefer && keys ? offset => touchesMemorized(keys[offset] ?? [], memorized) : undefined });
    return { pairs: pick(ids.pairs, ids.pairKeys, batches), trees: pick(ids.trees, ids.treeKeys, batches) };
  }, [ids, seen, batches, prefer, memorized, visit]);
  // Pairs and trees load apart, so the pairs show while the trees are still being worked out.
  const swr = { revalidateOnFocus: false, keepPreviousData: true };
  const { data: pairContent, isValidating: pairsLoading } = useSWR(day && picked ? `/api/home/feed?day=${day}&p=${picked.pairs.join(',')}` : null, fetchJson<Content>, swr);
  const { data: treeContent, isValidating: treesLoading } = useSWR(day && picked ? `/api/home/feed?day=${day}&t=${picked.trees.join(',')}` : null, fetchJson<Content>, swr);
  // The prophets cards of the batches shown, worked out on the server (the stories' ayat stay there).
  const storySlots = Array.from({ length: batches }, (_, i) => i).filter(hasStoryCard);
  const { data: stories } = useSWR(day && storySlots.length ? `/api/home/feed?day=${day}&s=${storySlots.join(',')}` : null, fetchJson<StoryCard[]>, swr);
  const content = pairContent || treeContent ? { pairs: pairContent?.pairs ?? [], trees: treeContent?.trees ?? [] } : undefined;
  useEffect(() => { if (pairContent) markFeedSeen(pairContent.pairs.map(pair => pair.id)); }, [pairContent]);
  useEffect(() => { if (treeContent) markFeedSeen(treeContent.trees.map(tree => tree.id)); }, [treeContent]);
  // A mark below the posts: when it comes near the screen, the next batch is added.
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mark = end.current;
    if (!mark) return;
    const watch = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setMore(now => ({ visit, batches: Math.min(FEED_AHEAD, (now.visit === visit ? now.batches : 1) + MORE) }));
    }, { rootMargin: '0px 0px 1200px 0px' });
    watch.observe(mark);
    return () => watch.disconnect();
  }, [visit, batches, pairsLoading, treesLoading]);
  const posts: React.ReactNode[] = [];
  for (let i = 0; i < batches; i++) {
    const pair = content?.pairs[i];
    if (pair) posts.push(<PairPost key={`p${pair.id}`} pair={pair} />);
    if (i === 0 && forgotten) posts.push(<ForgottenPost key={`ask${forgotten}`} ayah={forgotten} review={reviewHref(forgottenOrder(Object.keys(due))[0])} />);
    else if (i === 0 && recall) posts.push(<ForgottenPost key={`ask${recall}`} ayah={recall} />);
    // A question card in every batch after the first (whose question is the recall card), each kind in turn.
    if (i > 0 && day) {
      const kind = feedQuizKind(day, i);
      const seed = feedQuizSeed(day, i);
      posts.push(kind === OPENINGS
        ? <OpeningPost key={`q${day}-${i}`} seed={seed} memorized={questions ? memorized : null} />
        : <QuizPost key={`q${day}-${i}-${questions ? JSON.stringify(memorizedFilters(memorized)) : ''}`} kind={kind} seed={seed} scope={questions ? memorizedFilters(memorized) : {}} />);
    }
    const tree = content?.trees[i];
    if (tree) posts.push(<TreePost key={`t${tree.id}`} tree={tree} />);
    const savedItem = savedOfSlot(saved, day ?? 0, i);
    if (savedItem) posts.push(<SavedPost key={`b${savedItem.id}-${i}`} item={savedItem} />);
    const story = stories?.find(card => card.slot === i);
    if (story) posts.push(<StoryPost key={`s${day}-${i}`} card={story} />);
  }
  return <section className={styles.feed} aria-label="للتأمل اليوم">
    {posts}
    {!content && <p className="py-6 text-center"><LoadingDots label="جارٍ التحميل" /></p>}
    {content && !pairsLoading && !treesLoading && batches < FEED_AHEAD && <div ref={end} aria-hidden className="h-px" />}
  </section>;
}
