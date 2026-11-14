'use client';

import { Fragment, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeftRight, Bookmark, BookOpen, Check, Feather, Users, Eye, EyeOff, LightbulbOff, GalleryHorizontal, Moon, NotebookPen, ScrollText } from 'lucide-react';
import Button from '@/components/common/Button';
import TreeIcon from '@/components/common/TreeIcon';
import LoadingDots from '@/components/common/LoadingDots';
import Cookies from 'js-cookie';
import StoryMap from '@/app/quran/prophets/[slug]/StoryMap';
import type { SavedContent, StoryCard } from '@/lib/homeFeed';
import { bookmarkKind } from '@shared/bookmarkKind';
import type { Bookmark as SavedItem } from '@shared/bookmarks';
import { useRouter } from 'next/navigation';
import BranchTree from '@/app/quran/branches/BranchTree';
import AyahCards from '@/app/quran/branches/AyahCards';
import { BRANCH_VIEW_COOKIE, parseBranchView, showsOtherView, type BranchView } from '@shared/quran/branchView';
import { Card as CompareCard } from '@/app/quran/compare/PairCompare';
import { useWriteBoxes, type Graded } from '@/app/quran/read/useWriteBoxes';
import { wordTargets } from '@shared/quran/writeAyah';
import { surahPairHref } from '@shared/quran/curatedComparisons';
import type { TreePreview } from '@/app/quran/read/ayahPreview';
import { LAST_PAGE_KEY } from '@/app/quran/read/ReaderView';
import { lastPage } from '@/app/quran/read/OpenLastPage';
import { useNow } from '@/components/utilities/Utilities';
import { mushafText } from '@shared/quran/mushafText';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { savedAs } from '@shared/compareBookmarks';
import { ayahHref, markForgotten, mostForgotten, readDueMarks, rememberAyah, serverAyahMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { isMemorized, memorizedFilters, memorizedPrefer, memorizedQuestions, recallOfDay, touchesMemorized, type Memorized } from '@shared/memorized';
import { FEED_QUIZ_NAMES, feedQuizKind, feedQuizSeed, OPENINGS, openingSurah, type FeedQuizKind } from '@shared/quiz/feedQuiz';
import QuizAnswer, { type QuizData } from '@/app/quizzes/QuizAnswer';
import type { Hints } from '@shared/quiz/hints';
import { readAyahNotes, serverAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { backToVisit, FEED_AHEAD, freshPicks, hasStoryCard, savedOfSlot, leftVisit, markFeedSeen, markStoryOpened, readFeedSeen, readStoriesOpened, serverFeedSeen, serverStoriesOpened, storyIsNew, storyTimes, subscribeFeedSeen, subscribeStoriesOpened, subscribeVisit, visitStart, serverVisit, STORIES, type StoryId } from '@shared/feedSeen';
import { forgottenOrder } from '@shared/quran/recite';
import type { PairCard } from '@shared/quran/compareCards';
import { hijriDate, todaysJuz } from '@shared/hijri';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import { dayNumber } from '@shared/dailyPick';
import surahRows from '@shared/data/quran/surahs.json';
import { reviewHref } from './HomeCards';
import AyahLines, { useAyahPage } from './AyahLines';
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

/** The reading card: the first lines of the page the mushaf was left on, a button back to it, and today's date and juz. */
export function ContinueReading() {
  const today = useToday();
  const [page, setPage] = useState<number | null>(null);
  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(LAST_PAGE_KEY); } catch {}
    setPage(lastPage(stored));
  }, []);
  const { data } = useSWR(page ? `/api/home/feed?page=${page}` : null, fetchJson<{ surah: number; words: (string | number)[] }>, { revalidateOnFocus: false });
  const href = `/quran/read/${page ?? 1}`;
  return <section className={styles.post} aria-labelledby="reading-title" dir="rtl">
    <div className={styles.readHead}>
      <BookOpen size={20} aria-hidden />
      <h2 id="reading-title">{page && page > 1 ? 'تابع القراءة' : 'ابدأ القراءة'}</h2>
      {data && <span className={styles.muted}>{names[data.surah]}</span>}
    </div>
    <Link href={href} className={styles.pageSlice} aria-label="افتح المصحف حيث توقفت" lang="ar">
      <span className={styles.pageLines}>{data?.words.map((word, i) => typeof word === 'number' ? <span key={i} className={styles.accent}>{` ${num(word)} `}</span> : `${word} `)}</span>
    </Link>
    <div className={styles.readFoot}>
      <Button href={href} variant="primary" className="min-h-10 rounded-[10px] px-4 text-base"><BookOpen size={18} aria-hidden />اقرأ</Button>
      <span className="flex-1" />
      {today?.date && <span className={styles.muted}><Moon size={16} aria-hidden className={styles.accent} />{today.date.replace(/ هـ$/, '')}</span>}
      {today?.juz && <Link href={juzHref(today.juz[0])} onClick={() => markStoryOpened('juz')} className={styles.accent} aria-label={`اقرأ ${juzLabel(today.juz)}، جزء اليوم`}>{juzLabel(today.juz)}</Link>}
    </div>
  </section>;
}

function PostHead({ Icon, title, sub, quran }: { Icon: typeof BookOpen | typeof TreeIcon; title: string; sub?: string; quran?: boolean }) {
  return <div className={styles.postHead}>
    <span className={styles.avatar}><Icon size={18} aria-hidden /></span>
    <div><h3 className={quran ? 'font-quran text-xl font-normal leading-[2]' : undefined}>{quran ? mushafText(title) : title}</h3>{sub && <p className={styles.muted}>{sub}</p>}</div>
  </div>;
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
      <CompareCard card={pair} names={compareNames} ar savedIds={savedAs(pair.id, bookmarks)} page={surahPairHref(a.surah, b.surah)} view={parseBranchView(Cookies.get(BRANCH_VIEW_COOKIE))} />
    </ul>
  </article>;
}

/** Today's ayah from the memorized range that the reader said they remembered: it leaves the feed until the page reloads. */
const recalled = new Set<string>();

/**
 * An ayah to recall, asked as the reader's write mode asks it: its words hidden, its first and last words as write boxes
 * (the same boxes, keyboard rules and grading, read/useWriteBoxes). The last box shows the ayah with the written words
 * green or amber; a mistake puts it on the forgotten shelf, as in the reader. A forgotten ayah that is due comes with the
 * review link and «تذكّرتها» rests it; an ayah of the day from what is memorized (`review` absent) has «نسيتها» instead.
 */
function ForgottenPost({ ayah, review, title = 'هل تذكرها؟' }: { ayah: string; review?: string; title?: string }) {
  const [, setGone] = useState(0);
  const [shown, setShown] = useState(false);
  const [graded, setGraded] = useState<Graded | null>(null);
  useEffect(() => { setShown(false); setGraded(null); }, [ayah]);
  const { pages, words } = useAyahPage(ayah);
  const asked = useMemo(() => wordTargets(words ?? []), [words]);
  const boxes = useWriteBoxes({ ayah: words ? ayah : null, words: words ?? [], asked, onDone: result => {
    setGraded(result);
    if (result.wrong.length) markForgotten(ayah);
  } });
  const [surah, number] = ayah.split(':').map(Number);
  if (!review && recalled.has(ayah)) return null;
  const open = shown || !!graded;
  return <article className={styles.post} dir="rtl">
    <PostHead Icon={LightbulbOff} title={title} sub={`${names[surah]} ${num(number)}`} />
    <div className={styles.recall}>
      {!pages && <LoadingDots label="جارٍ التحميل" />}
      {pages && <AyahLines ayah={ayah} pages={pages} shown={open} checked={graded ? { key: ayah, ...graded } : null}
        write={{ key: ayah, targets: asked, typed: boxes.typed, current: boxes.current, onBox: boxes.pick }} />}
    </div>
    {words && !open && boxes.field({ 'aria-label': 'اكتب الكلمة' })}
    <div className={styles.recallActions}>
      {!graded && <button type="button" className={styles.pill} onClick={() => setShown(value => !value)}>{shown ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}{shown ? 'أخفها' : 'أظهرها'}</button>}
      <button type="button" className={`${styles.pill} ${styles.green}`} onClick={() => { if (review) rememberAyah(ayah); else { recalled.add(ayah); setGone(n => n + 1); } }}><Check size={18} aria-hidden />تذكّرتها</button>
      {!review && <button type="button" className={styles.pill} onClick={() => { recalled.add(ayah); markForgotten(ayah); }}><LightbulbOff size={18} aria-hidden />نسيتها</button>}
      <span className="flex-1" />
      <QuizActions review={review} />
      <Button size="lg" variant="muted" href={ayahHref(ayah)} aria-label="في المصحف" title="في المصحف"><BookOpen aria-hidden /></Button>
    </div>
  </article>;
}

/**
 * The quiz buttons a question card carries (owner, 2026-11-14, in place of home's quiz box): a solo quiz, a quiz with others,
 * and recite (or, for a forgotten ayah that is due, the review of the forgotten ones).
 */
export function QuizActions({ review }: { review?: string }) {
  return <>
    <Button size="lg" variant="muted" href="/quizzes" aria-label="اختبار فردي" title="اختبار فردي"><Feather aria-hidden /></Button>
    <Button size="lg" variant="muted" href="/quizzes/party" aria-label="اختبار جماعي" title="اختبار جماعي"><Users aria-hidden /></Button>
    {review
      ? <Button size="lg" variant="muted" href={review} aria-label="راجع ما نسيت" title="راجع ما نسيت"><EyeOff aria-hidden /></Button>
      : <Button size="lg" variant="muted" href="/quran/read/recite" aria-label="تسميع" title="تسميع"><EyeOff aria-hidden /></Button>}
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
  return <article className={styles.post} dir="rtl">
    <PostHead Icon={kind === 'BRANCHES' ? TreeIcon : Feather} title={FEED_QUIZ_NAMES[kind as FeedQuizKind]} />
    <div className={styles.question} lang="ar">
      {question.promptArabic !== FEED_QUIZ_NAMES[kind as FeedQuizKind] && <p className="mb-3 text-base leading-relaxed">{question.promptArabic}</p>}
      <QuizAnswer question={question} given={given} typed={typed} hints={hints} revealed={revealed} names={data?.surahNames ?? {}} ar
        onReveal={() => setRevealed(true)} onType={setTyped} onHints={setHints} onAnswer={setGiven} />
    </div>
    <div className={styles.recallActions}>
      <span className="flex-1" />
      <QuizActions />
    </div>
  </article>;
}

/** The surah openings quiz as a post: a surah's first ayah to write under its name, as the openings quiz asks it in the mushaf. */
function OpeningPost({ seed, memorized }: { seed: number; memorized: Memorized | null }) {
  const surah = useMemo(() => openingSurah(seed, memorized && !('all' in memorized)
    ? Array.from({ length: 114 }, (_, i) => i + 1).filter(n => isMemorized(`${n}:1`, memorized)) : undefined), [seed, memorized]);
  return surah ? <ForgottenPost ayah={`${surah}:1`} title={FEED_QUIZ_NAMES[OPENINGS]} /> : null;
}

/**
 * One group of a prophet's story map as a post (owner, 2026-11-14): the prophets page's own map (StoryMap) showing just that
 * group, with every surah that tells part of it; the surahs scroll up and down inside the card, never sideways. A dot or an
 * event's title opens the story there.
 */
function StoryPost({ card }: { card: StoryCard }) {
  const router = useRouter();
  const href = `/quran/prophets/${card.slug}`;
  const read = (event: number, surah?: number) => router.push(`${href}?event=${card.story[event]}${surah === undefined ? '' : `&surah=${surah}`}`);
  return <article className={styles.post} dir="rtl">
    <Link href={href} aria-label="افتح القصة" className="block hover:opacity-80"><PostHead Icon={ScrollText} title={card.title} sub={card.phases[card.phase]} /></Link>
    <div className={styles.story}>
      <StoryMap map={card.map} events={card.events} phases={card.phases} only={card.phase} onRead={read} />
    </div>
  </article>;
}

type Tree = TreePreview & { text: string };

/** A saved ayah as a post: the ayah in the mushaf's own lines, as the recall card shows it once revealed. */
function SavedAyahPost({ ayah }: { ayah: string }) {
  const { pages } = useAyahPage(ayah);
  const [surah, number] = ayah.split(':').map(Number);
  return <article className={styles.post} dir="rtl">
    <PostHead Icon={Bookmark} title={`${names[surah]} ${num(number)}`} sub="من المحفوظات" />
    <div className={styles.recall}>
      {pages ? <AyahLines ayah={ayah} pages={pages} shown whole checked={null} /> : <LoadingDots label="جارٍ التحميل" />}
    </div>
    <div className={styles.recallActions}>
      <span className="flex-1" />
      <Button size="lg" variant="muted" href={ayahHref(ayah)} aria-label="في المصحف" title="في المصحف"><BookOpen aria-hidden /></Button>
    </div>
  </article>;
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
/** The tree card's height, as the branches page's on a phone. */
const TREE_HEIGHT = '24rem';

/**
 * One tree as a post: the branches page's own tree (BranchTree), so it zooms, pans and lights a path on a click, as there.
 * The open button takes it to the branches page.
 */
function TreePost({ tree }: { tree: Tree }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const saved = bookmarks.some(item => item.id === tree.id);
  // Opens in the view chosen in the settings (the branches page's cookie); the card's own switch changes only this card.
  const [view, setView] = useState<BranchView>(() => { const pref = parseBranchView(Cookies.get(BRANCH_VIEW_COOKIE)) ?? 'tree'; return showsOtherView(tree.id) ? (pref === 'tree' ? 'cards' : 'tree') : pref; });
  const viewLabel = view === 'tree' ? 'عرض المصفوفة' : 'عرض الشجرة';
  return <article className={styles.post} dir="rtl">
    <Link href={tree.href} aria-label="افتح الشجرة في متشابهات القرآن" className="block hover:opacity-80"><PostHead Icon={TreeIcon} title={tree.text} sub="من متشابهات القرآن" quran /></Link>
    <div className="px-2">
      {view === 'cards'
        ? <AyahCards ayahKeys={tree.ayat?.map(ayah => ayah.key) ?? []} names={names} />
        : <BranchTree tree={tree.tree} ayat={tree.ayat} prefixes={tree.prefixes} offsets={tree.offsets} names={names} surround={{ on: false, sync: true }} viewportHeight={TREE_HEIGHT} direction="auto" zoomInRail />}
    </div>
    <div className={styles.actions} data-share-skip>
      <Button size="lg" variant="muted" aria-pressed={saved} aria-label={saved ? 'أزلها من المحفوظات' : 'احفظ'} title={saved ? 'أزلها من المحفوظات' : 'احفظ'} className={saved ? 'text-[var(--home-accent)]' : undefined}
        onClick={() => toggleBookmark({ id: tree.id, text: tree.text, href: tree.href })}><Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} /></Button>
      <Button size="lg" variant="muted" onClick={() => setView(view === 'tree' ? 'cards' : 'tree')} aria-label={viewLabel} title={viewLabel}>{view === 'tree' ? <GalleryHorizontal aria-hidden /> : <TreeIcon aria-hidden />}</Button>
    </div>
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
