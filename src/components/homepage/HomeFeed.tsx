'use client';

import { Fragment, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeftRight, Bookmark, BookOpen, Check, Eye, EyeOff, LightbulbOff, GalleryHorizontal, Moon, NotebookPen, ScrollText } from 'lucide-react';
import Button from '@/components/common/Button';
import TreeIcon from '@/components/common/TreeIcon';
import LoadingDots from '@/components/common/LoadingDots';
import Cookies from 'js-cookie';
import BranchTree from '@/app/quran/branches/BranchTree';
import AyahCards from '@/app/quran/branches/AyahCards';
import { BRANCH_VIEW_COOKIE, parseBranchView, showsOtherView, type BranchView } from '@shared/quran/branchView';
import { Card as CompareCard } from '@/app/quran/compare/PairCompare';
import { FaintWord, WriteBox, WrittenWord } from '@/app/quran/read/MushafPage';
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
import { memorizedPrefer, memorizedQuestions, recallOfDay, touchesMemorized } from '@shared/memorized';
import { readAyahNotes, serverAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { backToVisit, FEED_AHEAD, newVisit, freshPicks, leftVisit, markFeedSeen, markStoryOpened, readFeedSeen, readStoriesOpened, serverFeedSeen, serverStoriesOpened, storyIsNew, storyTimes, subscribeFeedSeen, subscribeStoriesOpened, subscribeVisit, visitStart, serverVisit, STORIES, type StoryId } from '@shared/feedSeen';
import { forgottenOrder } from '@shared/quran/recite';
import type { PairCard } from '@shared/quran/compareCards';
import { hijriDate, todaysJuz } from '@shared/hijri';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import { dayNumber } from '@shared/dailyPick';
import surahRows from '@shared/data/quran/surahs.json';
import { reviewHref, useAyahTexts } from './HomeCards';
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
function ForgottenPost({ ayah, review }: { ayah: string; review?: string }) {
  const [, setGone] = useState(0);
  const [shown, setShown] = useState(false);
  const [graded, setGraded] = useState<Graded | null>(null);
  useEffect(() => { setShown(false); setGraded(null); }, [ayah]);
  const text = useAyahTexts([ayah])[ayah];
  const words = useMemo(() => (text ? text.split(' ') : []), [text]);
  const asked = useMemo(() => wordTargets(words), [words]);
  const boxes = useWriteBoxes({ ayah: text ? ayah : null, words, asked, onDone: result => {
    setGraded(result);
    if (result.wrong.length) markForgotten(ayah);
  } });
  const [surah, number] = ayah.split(':').map(Number);
  if (!review && recalled.has(ayah)) return null;
  const open = shown || !!graded;
  return <article className={styles.post} dir="rtl">
    <PostHead Icon={LightbulbOff} title="هل تذكرها؟" sub={`${names[surah]} ${num(number)}`} />
    <p className={styles.recall} lang="ar">
      {!text && <LoadingDots label="جارٍ التحميل" />}
      {words.map((word, i) => <Fragment key={i}>{i ? ' ' : ''}{open
        ? <WrittenWord word={mushafText(word)} right={!!graded?.right.includes(i)} mistyped={graded?.wrong.includes(i) ? graded.typed[i] ?? '' : undefined} />
        : asked.includes(i)
          ? <WriteBox word={mushafText(word)} typed={boxes.typed[i] ?? ''} active={boxes.current === i} onPick={() => boxes.pick(i)} />
          : <FaintWord word={mushafText(word)} />}</Fragment>)}
    </p>
    {text && !open && boxes.field({ 'aria-label': 'اكتب الكلمة' })}
    <div className={styles.recallActions}>
      {!graded && <button type="button" className={styles.pill} onClick={() => setShown(value => !value)}>{shown ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}{shown ? 'أخفها' : 'أظهرها'}</button>}
      <button type="button" className={`${styles.pill} ${styles.green}`} onClick={() => { if (review) rememberAyah(ayah); else { recalled.add(ayah); setGone(n => n + 1); } }}><Check size={18} aria-hidden />تذكّرتها</button>
      {!review && <button type="button" className={styles.pill} onClick={() => { recalled.add(ayah); markForgotten(ayah); }}><LightbulbOff size={18} aria-hidden />نسيتها</button>}
      <span className="flex-1" />
      {review && <Button size="lg" variant="muted" href={review} aria-label="راجع ما نسيت" title="راجع ما نسيت"><EyeOff aria-hidden /></Button>}
      <Button size="lg" variant="muted" href={ayahHref(ayah)} aria-label="في المصحف" title="في المصحف"><BookOpen aria-hidden /></Button>
    </div>
  </article>;
}

type Tree = TreePreview & { text: string };
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
  // A reload, which is a phone browser's pull to refresh, starts a new visit: the feed shows what was not seen yet.
  useEffect(() => {
    if ((performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type === 'reload') newVisit();
  }, []);
  const seen = useSyncExternalStore(subscribeFeedSeen, readFeedSeen, serverFeedSeen);
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
    const tree = content?.trees[i];
    if (tree) posts.push(<TreePost key={`t${tree.id}`} tree={tree} />);
  }
  return <section className={styles.feed} aria-label="للتأمل اليوم">
    {posts}
    {!content && <p className="py-6 text-center"><LoadingDots label="جارٍ التحميل" /></p>}
    {content && !pairsLoading && !treesLoading && batches < FEED_AHEAD && <div ref={end} aria-hidden className="h-px" />}
  </section>;
}
