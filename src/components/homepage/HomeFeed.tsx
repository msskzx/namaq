'use client';

import { Fragment, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import * as adhan from 'adhan';
import { ArrowLeftRight, Bookmark, BookOpen, Check, ChevronLeft, Eye, EyeOff, LightbulbOff, MapPin, Moon, NotebookPen, ScrollText, Send } from 'lucide-react';
import Button from '@/components/common/Button';
import TreeIcon from '@/components/common/TreeIcon';
import LoadingDots from '@/components/common/LoadingDots';
import BranchTree from '@/app/quran/branches/BranchTree';
import type { TreePreview } from '@/app/quran/read/ayahPreview';
import { LAST_PAGE_KEY } from '@/app/quran/read/ReaderView';
import { lastPage } from '@/app/quran/read/OpenLastPage';
import { placeStore, settingsStore, viewStore } from '@/components/utilities/Utilities';
import { mushafText } from '@shared/quran/mushafText';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { compareAnchor, compareBookmarkId, savedAs } from '@shared/compareBookmarks';
import { ayahHref, mostForgotten, readDueMarks, rememberAyah, serverAyahMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { readAyahNotes, serverAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { backToVisit, FEED_AHEAD, freshPicks, leftVisit, markFeedSeen, markStoryOpened, readFeedSeen, readStoriesOpened, serverFeedSeen, serverStoriesOpened, storyIsNew, storyTimes, subscribeFeedSeen, subscribeStoriesOpened, STORIES, type StoryId } from '@shared/feedSeen';
import { forgottenOrder } from '@shared/quran/recite';
import type { CardAyah, PairCard } from '@shared/quran/compareCards';
import { hijriDate, todaysJuz } from '@shared/hijri';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import { dayNumber } from '@shared/dailyPick';
import { clock, FIVE, nextPrayer, prayerDay, PRAYER_NAMES, type Adhan } from '@shared/prayer';
import surahRows from '@shared/data/quran/surahs.json';
import { reviewHref, useAyahTexts } from './HomeCards';
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
  const [today, setToday] = useState<{ day: number; date: string | null; juz: number[] | null } | null>(null);
  useEffect(() => {
    const now = new Date();
    setToday({ day: dayNumber(now), date: hijriDate(now), juz: todaysJuz(now) });
  }, []);
  return today;
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
      {data?.words.map((word, i) => typeof word === 'number' ? <span key={i} className={styles.accent}>{` ${num(word)} `}</span> : `${word} `)}
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
    <div><h3 className={quran ? 'font-quran text-lg font-normal' : undefined}>{title}</h3>{sub && <p className={styles.muted}>{sub}</p>}</div>
  </div>;
}

/** One ayah with its shared words in the accent and shared roots in purple, as on the compare cards. */
function Ayah({ ayah }: { ayah: CardAyah }) {
  return <p className={styles.dailyAyah} lang="ar" dir="rtl">
    {ayah.words.map((word, i) => {
      const mark = ayah.marks?.[i];
      return <span key={i}>{i > 0 ? ' ' : ''}<span className={mark ? styles[mark.kind === 'root' ? 'dailyRoot' : mark.kind === 'related' ? 'dailyRelated' : 'dailySame'] : undefined}>{mushafText(word)}</span></span>;
    })}
    <span className={styles.dailySame}>{' '}{num(ayah.number)}</span>
  </p>;
}

/** Shares a link with the phone's share sheet, or copies it where there is none. */
async function shareLink(text: string, path: string) {
  const url = `${location.origin}${path}`;
  try {
    if (navigator.share) await navigator.share({ text, url });
    else await navigator.clipboard.writeText(`${text}\n${url}`);
  } catch {}
}

function PairPost({ pair }: { pair: PairCard }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const [a, b] = pair.sides;
  const savedIds = savedAs(pair.id, bookmarks);
  const saved = savedIds.length > 0;
  const href = `/quran/compare?a=${Math.min(a.surah, b.surah)}&b=${Math.max(a.surah, b.surah)}#${compareAnchor(a, b)}`;
  const label = (side: PairCard['sides'][number]) => `${names[side.surah]} ${num(side.ayat[0].number)}`;
  const first = `${mushafText(a.ayat[0]?.words.slice(0, 6).join(' ') ?? '')} …`;
  return <article className={styles.post} dir="rtl">
    <PostHead Icon={ArrowLeftRight} title="آيتان متشابهتان" sub={`${label(a)} · ${label(b)}`} />
    <div className="px-3">
      {pair.sides.map(side => <div key={side.surah} className={styles.dailySide}>
        <p className={styles.dailyLabel} lang="ar">{label(side)}</p>
        <Ayah ayah={side.ayat[0]} />
      </div>)}
    </div>
    <div className={styles.actions}>
      <Button size="lg" variant="muted" aria-pressed={saved} aria-label={saved ? 'أزلها من المحفوظات' : 'احفظ'} title={saved ? 'أزلها من المحفوظات' : 'احفظ'} className={saved ? 'text-[var(--home-accent)]' : undefined}
        onClick={() => toggleBookmark({ id: compareBookmarkId(pair.id), text: first, href }, savedIds)}><Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} /></Button>
      <Button size="lg" variant="muted" href={ayahHref(`${a.surah}:${a.ayat[0].number}`)} aria-label="في المصحف" title="في المصحف"><BookOpen aria-hidden /></Button>
      <Button size="lg" variant="muted" href={href} aria-label="افتحها في المقارنة" title="افتحها في المقارنة"><ArrowLeftRight aria-hidden /></Button>
      <Button size="lg" variant="muted" onClick={() => void shareLink(first, href)} aria-label="شارك" title="شارك"><Send aria-hidden /></Button>
    </div>
  </article>;
}

const SHOWN_WORDS = 3;
/** Rough width of a hidden word's box, from its letters. */
const boxWidth = (word: string) => `${0.6 + 0.38 * word.replace(/[ً-ٰٟۖ-ۭ]/g, '').length}rem`;

function ForgottenPost({ ayah, review }: { ayah: string; review: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => setShown(false), [ayah]);
  const text = useAyahTexts([ayah])[ayah];
  const words = text ? text.split(' ') : [];
  const [surah, number] = ayah.split(':').map(Number);
  return <article className={styles.post} dir="rtl">
    <PostHead Icon={LightbulbOff} title="هل تذكرها؟" sub={`${names[surah]} ${num(number)}`} />
    <p className={styles.recall} lang="ar">
      {!text && <LoadingDots label="جارٍ التحميل" />}
      {words.map((word, i) => <Fragment key={i}>{i ? ' ' : ''}{shown || i < SHOWN_WORDS ? <span>{mushafText(word)}</span> : <span aria-hidden className={styles.hiddenWord} style={{ width: boxWidth(word) }} />}</Fragment>)}
    </p>
    <div className={styles.recallActions}>
      <button type="button" className={styles.pill} onClick={() => setShown(value => !value)}>{shown ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}{shown ? 'أخفها' : 'أظهرها'}</button>
      <button type="button" className={`${styles.pill} ${styles.green}`} onClick={() => rememberAyah(ayah)}><Check size={18} aria-hidden />تذكّرتها</button>
      <span className="flex-1" />
      <Button size="lg" variant="muted" href={review} aria-label="راجع ما نسيت" title="راجع ما نسيت"><EyeOff aria-hidden /></Button>
      <Button size="lg" variant="muted" href={ayahHref(ayah)} aria-label="في المصحف" title="في المصحف"><BookOpen aria-hidden /></Button>
    </div>
  </article>;
}

/** A wide tree opens at its middle, where its top-down root is. */
const centre = (card: HTMLElement | null) => { if (card) card.scrollLeft = (card.scrollWidth - card.clientWidth) / 2 * (getComputedStyle(card).direction === 'rtl' ? -1 : 1); };

function TreePost({ tree }: { tree: TreePreview & { text: string } }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const saved = bookmarks.some(item => item.id === tree.id);
  return <article className={styles.post} dir="rtl">
    <PostHead Icon={TreeIcon} title={tree.text} sub="من متشابهات القرآن" quran />
    <Link href={tree.href} aria-label="افتح هذه الشجرة" ref={centre} className="block overflow-x-auto overscroll-x-contain">
      <div inert data-down dir="ltr" className="mx-auto w-max min-w-full p-1 [&_[data-tree-content]]:mx-auto [&_[data-tree-content]]:flex-col [&_[data-tree]]:overflow-visible [&_[data-tree]]:border-0 [&_[data-tree]]:bg-transparent [&_[data-tree]]:p-2">
        <BranchTree tree={tree.tree} ayat={tree.ayat} prefixes={tree.prefixes} offsets={tree.offsets} names={names} zoomable={false} viewportHeight={null} surround={{ on: false, sync: true }} />
      </div>
    </Link>
    <div className={styles.actions}>
      <Button size="lg" variant="muted" aria-pressed={saved} aria-label={saved ? 'أزلها من المحفوظات' : 'احفظ'} title={saved ? 'أزلها من المحفوظات' : 'احفظ'} className={saved ? 'text-[var(--home-accent)]' : undefined}
        onClick={() => toggleBookmark({ id: tree.id, text: tree.text, href: tree.href })}><Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} /></Button>
      <Button size="lg" variant="muted" href={tree.href} aria-label="افتح الشجرة" title="افتح الشجرة"><TreeIcon aria-hidden /></Button>
    </div>
  </article>;
}

/** Posts per batch: one pair and one tree; «المزيد للتأمل» adds this many batches. */
const MORE = 3;
type Ids = { pairs: (string | null)[]; trees: (string | null)[] };
type Content = { pairs: PairCard[]; trees: (TreePreview & { text: string })[] };

/** The feed «للتأمل اليوم»: pairs and trees not seen before, a forgotten ayah that is due, and more on request. */
export function Feed() {
  const today = useToday();
  const day = today?.day;
  const [batches, setBatches] = useState(1);
  const seen = useSyncExternalStore(subscribeFeedSeen, readFeedSeen, serverFeedSeen);
  const due = useSyncExternalStore(subscribeDueMarks, readDueMarks, serverAyahMarks);
  const forgotten = mostForgotten(due)[0];
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
    const pick = (list: (string | null)[]) => freshPicks(offset => (list[offset] ? offset : undefined), offset => list[offset]!, seen, batches, { tries: list.length });
    return { pairs: pick(ids.pairs), trees: pick(ids.trees) };
  }, [ids, seen, batches]);
  const { data: content } = useSWR(day && picked ? `/api/home/feed?day=${day}&p=${picked.pairs.join(',')}&t=${picked.trees.join(',')}` : null, fetchJson<Content>, { revalidateOnFocus: false, keepPreviousData: true });
  useEffect(() => { if (content) markFeedSeen([...content.pairs.map(pair => pair.id), ...content.trees.map(tree => tree.id)]); }, [content]);
  const posts: React.ReactNode[] = [];
  for (let i = 0; i < batches; i++) {
    const pair = content?.pairs[i];
    const tree = content?.trees[i];
    if (pair) posts.push(<PairPost key={`p${pair.id}`} pair={pair} />);
    if (i === 0 && forgotten) posts.push(<ForgottenPost key="forgotten" ayah={forgotten} review={reviewHref(forgottenOrder(Object.keys(due))[0])} />);
    if (tree) posts.push(<TreePost key={`t${tree.id}`} tree={tree} />);
  }
  return <section className={styles.feed} aria-labelledby="feed-title">
    <Divider id="feed-title" label="للتأمل اليوم" />
    {posts}
    {!content && <p className="py-6 text-center"><LoadingDots label="جارٍ التحميل" /></p>}
    {batches < FEED_AHEAD && <button type="button" className={`${styles.pill} self-center`} onClick={() => setBatches(count => Math.min(FEED_AHEAD, count + MORE))}><ChevronLeft size={18} aria-hidden />المزيد للتأمل</button>}
  </section>;
}

export function Divider({ id, label }: { id?: string; label: string }) {
  return <h2 id={id} className={styles.divider}>{label}</h2>;
}

const lib = adhan as unknown as Adhan;

/** Today's five prayers in one row, the next one shaded; a click opens the utilities page. Without a place, a link to pick one there. */
export function PrayerRow() {
  const place = useSyncExternalStore(placeStore.subscribe, placeStore.read, () => null);
  const settings = useSyncExternalStore(settingsStore.subscribe, settingsStore.read, settingsStore.read);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);
  const times = place && now ? prayerDay(lib, place, now, settings) : null;
  const next = times && now ? nextPrayer(times, now) : null;
  return <Link href="/utilities" onClick={() => viewStore.write(JSON.stringify('times'))} className={styles.prayers} aria-label="مواقيت الصلاة" dir="rtl">
    <span className={styles.prayerHead}>
      <MapPin size={18} aria-hidden className={styles.accent} />
      <strong className="flex-1">مواقيت الصلاة</strong>
      <span className={styles.muted}>{place ? place.name : 'اختر مكانك'}</span>
      <ChevronLeft size={16} aria-hidden className={styles.muted} />
    </span>
    {times && <span className={styles.prayerRow}>
      {FIVE.map(key => <span key={key} data-next={key === next || undefined} aria-label={`${PRAYER_NAMES[key]} ${clock(times[key], true)}${key === next ? '، التالية' : ''}`}>
        <small>{PRAYER_NAMES[key]}</small><b>{clock(times[key], true)}</b>
      </span>)}
    </span>}
  </Link>;
}
