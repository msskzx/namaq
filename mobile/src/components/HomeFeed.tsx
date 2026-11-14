import { memo, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { AppState, Pressable, ScrollView, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeftRight, Bookmark, BookOpen, Check, Eye, EyeOff, LightbulbOff, Moon, NotebookPen, ScrollText, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { markForgotten, mostForgotten, readDueMarks, rememberAyah, subscribeDueMarks } from '@shared/ayahMarks';
import { memorizedPrefer, memorizedQuestions, readMemorized, recallOfDay, subscribeMemorized, touchesMemorized } from '@shared/memorized';
import { readAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { backToVisit, FEED_AHEAD, freshPicks, leftVisit, markFeedSeen, markStoryOpened, readFeedSeen, readStoriesOpened, storyIsNew, storyTimes, subscribeFeedSeen, subscribeStoriesOpened, subscribeVisit, visitStart, serverVisit, type StoryId } from '@shared/feedSeen';
import { hijriDate, todaysJuz } from '@shared/hijri';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import { dayNumber } from '@shared/dailyPick';
import type { PairCard } from '@shared/quran/compareCards';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { pageStart } from '@shared/quran/readerPage';
import { Text } from './Text';
import { quranText } from '@/lib/quranText';
import CompareCard from './CompareCard';
import TreePager from './TreePager';
import { EMPTY_LIST } from '@/lib/branchList';
import TreeIcon from './TreeIcon';
import { REVIEW_LABEL, reviewForgotten } from './HomeCards';
import { forgottenOrder } from '@shared/quran/recite';
import { wordTargets } from '@shared/quran/writeAyah';
import { useWriteBoxes, type Graded } from '@/lib/useWriteBoxes';
import { Mistyped, Veil, WriteBox } from './MushafPageView';
import { pairOfDayNumber, treeOfDay } from '@/lib/daily';
import { sideKeys, sideLabel } from '@/lib/compare';
import { surahNames as shortNames } from '@/lib/branches';
import { ayahText, pageData, PAGES, surahBefore } from '@/lib/mushaf';
import { readJson } from '@/lib/storage';
import { openIntent, toTab } from '@/lib/ways';
import { around as aroundSetting, branchView } from '@/lib/settings';
import { showsOtherView } from '@shared/quran/branchView';
import { useMinute } from '@/lib/prayer';
import { CARD, QURAN_FONT, type Palette } from '@/lib/theme';

type IconType = (props: LucideProps) => React.ReactNode;

/** A small icon button, as on the daily card: muted, or filled in the accent when on. */
function Action({ Icon, label, on, onPress, palette }: { Icon: IconType; label: string; on?: boolean; onPress: () => void; palette: Palette }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} accessibilityRole="button" accessibilityLabel={label} accessibilityState={on === undefined ? undefined : { selected: on }} style={{ padding: 7 }}>
      <Icon size={21} color={on ? palette.accent : palette.muted} fill={on ? palette.accent : 'none'} />
    </Pressable>
  );
}

const cardStyle = (palette: Palette) => ({ borderWidth: 1, borderColor: palette.rule, ...CARD, backgroundColor: palette.card });

/** A feed card's head: a round icon, a title and a line under it, like a post's author. */
function PostHead({ Icon, title, sub, palette, quran, open }: { Icon: IconType; title: string; sub?: string; palette: Palette; quran?: boolean;
  /** A tap on the head opens the post's own page; `label` names it for a screen reader. */
  open?: { onPress: () => void; label: string } }) {
  const head = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.paper, alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={palette.accent} />
      </View>
      <View style={{ flex: 1 }}>
        {/* A Quran title as the branches search draws a phrase: the mushaf's text and the Hafs font's own line height, so its marks are not cut off. */}
        <Text accessibilityRole="header" style={quran ? { color: palette.ink, fontSize: 20, lineHeight: 38, fontFamily: QURAN_FONT, textAlign: 'right' } : { color: palette.ink, fontSize: 16, fontWeight: '700', textAlign: 'right' }}>{quran ? quranText(title) : title}</Text>
        {sub ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{sub}</Text> : null}
      </View>
    </View>
  );
  return open ? <Pressable onPress={open.onPress} accessibilityRole="button" accessibilityLabel={open.label} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>{head}</Pressable> : head;
}

/** «الجزء ٣», or «الجزءان ٢٩ و٣٠» on the last day of a 29-day month. */
export const juzLabel = (juz: number[]) => (juz.length > 1 ? `الجزءان ${num(juz[0])} و${num(juz[1])}` : `الجزء ${num(juz[0])}`);
const openJuz = (juz: number) => { const start = JUZ_INDEX[juz - 1]; openIntent({ tab: 'read', at: `${start.surah}:${start.ayah}` }); };

/** The day's things, the same all day: date, juz. */
function useToday() {
  const now = useMinute();
  const day = dayNumber(now);
  const date = useMemo(() => hijriDate(now), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  const juz = useMemo(() => todaysJuz(now), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  return { day, date, juz };
}

const STORY: Record<StoryId, { label: string; Icon: IconType }> = {
  juz: { label: 'جزء اليوم', Icon: BookOpen },
  forgotten: { label: 'ما نسيته', Icon: LightbulbOff },
  saved: { label: 'المحفوظات', Icon: Bookmark },
  notes: { label: 'تأملاتي', Icon: NotebookPen },
  prophets: { label: 'الأنبياء', Icon: ScrollText },
};

/**
 * The circles at the top, like a social app's stories: places to go back to. A circle's ring is in the accent while it holds
 * something newer than the last time it was opened; nothing is counted.
 */
export function Stories({ palette }: { palette: Palette }) {
  const { juz } = useToday();
  const due = useSyncExternalStore(subscribeDueMarks, readDueMarks);
  const saved = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes);
  const opened = useSyncExternalStore(subscribeStoriesOpened, readStoriesOpened);
  const times = storyTimes({ due, saved, notes });
  const open: Record<StoryId, () => void> = {
    juz: () => juz && openJuz(juz[0]),
    forgotten: () => router.push({ pathname: '/library', params: { tab: 'forgotten' } }),
    saved: () => router.push({ pathname: '/library', params: { tab: 'saved' } }),
    notes: () => router.push({ pathname: '/library', params: { tab: 'notes' } }),
    prophets: () => router.navigate('/prophets'),
  };
  const ids = (Object.keys(STORY) as StoryId[]).filter(id => id !== 'juz' || juz);
  return (
    // Inverted in a left-to-right box, as the shelves are, so the first circle sits on the right on every platform.
    <View style={{ direction: 'ltr', marginHorizontal: -16 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row-reverse', flexGrow: 1, justifyContent: 'flex-start', gap: 12, paddingHorizontal: 16 }}>
        {ids.map(id => {
          const { label, Icon } = STORY[id];
          const lit = storyIsNew(opened, id, times[id]);
          return (
            <Pressable key={id} onPress={() => { markStoryOpened(id); open[id](); }} accessibilityRole="button" accessibilityLabel={id === 'juz' && juz ? `${label}: ${juzLabel(juz)}` : label}
              style={({ pressed }) => ({ alignItems: 'center', gap: 4, width: 66, opacity: pressed ? 0.7 : 1 })}>
              <View style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: lit ? palette.accent : palette.rule, padding: 3 }}>
                <View style={{ flex: 1, borderRadius: 27, backgroundColor: palette.card, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={palette.accent} />
                </View>
              </View>
              <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 13 }}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

/** Where the reader stopped, kept by the mushaf tab (Reader.tsx, key `reader-place`). */
const lastPage = () => Math.min(PAGES, Math.max(1, readJson<{ page: number }>('reader-place')?.page ?? 1));

/** The reading card: a slice of the page the mushaf was left on, a button back to it, and today's date and juz under it. */
export function ContinueReading({ palette }: { palette: Palette }) {
  const [page, setPage] = useState(lastPage);
  // Back on home after reading: show the page reached.
  useFocusEffect(useCallback(() => { setPage(lastPage()); }, []));
  const { surah, words } = useMemo(() => pageStart(pageData(page), surahBefore(page)), [page]);
  const { date, juz } = useToday();
  const read = () => openIntent({ tab: 'read', page });
  return (
    <View style={{ ...cardStyle(palette), padding: 12, gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <BookOpen size={20} color={palette.accent} />
        <Text accessibilityRole="header" style={{ flex: 1, color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>{page > 1 ? 'تابع القراءة' : 'ابدأ القراءة'}</Text>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{shortNames[surah] ?? ''}</Text>
      </View>
      <Pressable onPress={read} accessibilityRole="button" accessibilityLabel={`افتح المصحف حيث توقفت، سورة ${shortNames[surah] ?? ''}`}
        style={{ borderRadius: 10, borderWidth: 1, borderColor: palette.paperDeep, backgroundColor: palette.paper, paddingHorizontal: 12, paddingVertical: 6 }}>
        {/* Three lines, ended by the text's own ellipsis. A fixed-height box squeezed the text on iOS, which then crammed the rest onto its last line and clipped it mid-word. */}
        <Text numberOfLines={3} style={{ fontFamily: QURAN_FONT, fontSize: 21, lineHeight: 40, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
          {words.map((word, i) => typeof word === 'number'
            ? <Text key={i} style={{ fontFamily: QURAN_FONT, color: palette.accent }}>{` ${num(word)} `}</Text>
            : <Text key={i} style={{ fontFamily: QURAN_FONT }}>{`${word} `}</Text>)}
        </Text>
      </Pressable>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Pressable onPress={read} accessibilityRole="button" accessibilityLabel="اقرأ"
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, minHeight: 40, borderRadius: 10, backgroundColor: palette.accent, opacity: pressed ? 0.8 : 1 })}>
          <BookOpen size={18} color={palette.onAccent} />
          <Text style={{ color: palette.onAccent, fontSize: 16 }}>اقرأ</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        {date && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Moon size={16} color={palette.accent} />
          <Text accessibilityLabel={`اليوم ${date}`} style={{ color: palette.muted, fontSize: 14 }}>{date.replace(/ هـ$/, '')}</Text>
        </View>}
        {juz && <Pressable onPress={() => { markStoryOpened('juz'); openJuz(juz[0]); }} hitSlop={6} accessibilityRole="button" accessibilityLabel={`اقرأ ${juzLabel(juz)}، جزء اليوم`}>
          <Text style={{ color: palette.accent, fontSize: 14 }}>{juzLabel(juz)}</Text>
        </Pressable>}
      </View>
    </View>
  );
}

/** A look-alike pair as a post: the compare tab's own card (read-along, views, saving, sharing), and a button to open it there. */
const PairPost = memo(function PairPost({ pair, palette }: { pair: PairCard; palette: Palette }) {
  const [a, b] = pair.sides;
  const compare = useCallback(() => openIntent({ tab: 'compare', lead: a.surah, other: b.surah, ayat: [...sideKeys(a), ...sideKeys(b)] }), [a, b]);
  return (
    <View>
      <PostHead Icon={ArrowLeftRight} title="آيتان متشابهتان" sub={`${sideLabel(a)} · ${sideLabel(b)}`} palette={palette} />
      <CompareCard card={pair} palette={palette} onOpen={compare} />
    </View>
  );
});

/** Today's ayah from the memorized range that the reader said they remembered: it leaves the feed until tomorrow. */
const recalled = new Set<string>();
/** The recall card's letter size: the mushaf's write boxes at a card's size. */
const RECALL_SIZE = 21;

/**
 * An ayah to recall, asked as the reader's write mode asks it: its words hidden, its first and last words as write boxes
 * (the same boxes, keyboard rules and grading, lib/useWriteBoxes). The last box shows the ayah with the written words
 * green or amber; a mistake puts it on the forgotten shelf, as in the reader. A forgotten ayah that is due comes with the
 * review button and «تذكّرتها» rests it; an ayah of the day from what is memorized (`review` absent) has «نسيتها» instead.
 */
function ForgottenPost({ ayah, review, palette }: { ayah: string; review?: () => void; palette: Palette }) {
  const [, setGone] = useState(0);
  const [shown, setShown] = useState(false);
  const [graded, setGraded] = useState<Graded | null>(null);
  useEffect(() => { setShown(false); setGraded(null); }, [ayah]);
  const words = useMemo(() => ayahText(ayah).split(' ').filter(Boolean), [ayah]);
  const asked = useMemo(() => wordTargets(words), [words]);
  const boxes = useWriteBoxes({ ayah, words, asked, onDone: result => {
    setGraded(result);
    if (result.wrong.length) markForgotten(ayah);
  } });
  const [surah, number] = ayah.split(':').map(Number);
  if (!review && recalled.has(ayah)) return null;
  const open = shown || !!graded;
  return (
    <View style={cardStyle(palette)}>
      <PostHead Icon={LightbulbOff} title="هل تذكرها؟" sub={`${shortNames[surah] ?? ''} ${num(number)}`} palette={palette} />
      <View style={{ paddingHorizontal: 12, paddingTop: 10, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 6, rowGap: 14 }}>
        {words.map((word, i) => {
          if (open) {
            const color = graded?.right.includes(i) ? palette.green : graded?.wrong.includes(i) ? palette.amber : palette.ink;
            return (
              <View key={i}>
                {graded?.wrong.includes(i) && graded.typed[i] ? <Mistyped text={graded.typed[i]} size={RECALL_SIZE} palette={palette} /> : null}
                <Text style={{ fontFamily: QURAN_FONT, fontSize: RECALL_SIZE, lineHeight: 40, color }}>{word}</Text>
              </View>
            );
          }
          return asked.includes(i)
            ? <WriteBox key={i} text={word} size={RECALL_SIZE} palette={palette} typed={boxes.typed[i] ?? ''} active={boxes.current === i} onPress={() => boxes.pick(i)} />
            : <Veil key={i} text={word} size={RECALL_SIZE} palette={palette} next={false} faint />;
        })}
        {!open && boxes.field}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, flexWrap: 'wrap' }}>
        {!graded && <Pressable onPress={() => setShown(value => !value)} accessibilityRole="button" accessibilityLabel={shown ? 'أخفها' : 'أظهرها'}
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.7 : 1 })}>
          {shown ? <EyeOff size={18} color={palette.ink} /> : <Eye size={18} color={palette.ink} />}
          <Text style={{ color: palette.ink, fontSize: 16 }}>{shown ? 'أخفها' : 'أظهرها'}</Text>
        </Pressable>}
        <Pressable onPress={() => { if (review) rememberAyah(ayah); else { recalled.add(ayah); setGone(n => n + 1); } }} accessibilityRole="button" accessibilityLabel="تذكّرتها"
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: palette.green, opacity: pressed ? 0.7 : 1 })}>
          <Check size={18} color={palette.green} />
          <Text style={{ color: palette.green, fontSize: 16 }}>تذكّرتها</Text>
        </Pressable>
        {!review && <Pressable onPress={() => { recalled.add(ayah); markForgotten(ayah); }} accessibilityRole="button" accessibilityLabel="نسيتها"
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.7 : 1 })}>
          <LightbulbOff size={18} color={palette.ink} />
          <Text style={{ color: palette.ink, fontSize: 16 }}>نسيتها</Text>
        </Pressable>}
        <View style={{ flex: 1 }} />
        {review && <Action Icon={EyeOff} label={REVIEW_LABEL} onPress={review} palette={palette} />}
        <Action Icon={BookOpen} label="في المصحف" onPress={() => openIntent({ tab: 'read', at: ayah })} palette={palette} />
      </View>
    </View>
  );
}

/** The tree card's height: room for the branches page's tree and its buttons. */
const TREE_HEIGHT = 440;

/**
 * One tree as a post: the branches tab's own pager (TreePager) holding just this tree, so it zooms, pans, lights a path on
 * a tap and saves on a double tap, as there. The open button takes it to the branches tab.
 */
const TreePost = memo(function TreePost({ piece, palette }: { piece: BranchPiece; palette: Palette }) {
  // Opens in the view set on the branches tab; the card's own switch changes only this card.
  const [mode, setMode] = useState(() => { const pref = branchView.get(); return showsOtherView(piece.id) ? (pref === 'tree' ? 'matrix' : 'tree') : pref; });
  const [around] = aroundSetting.use();
  const pieces = useMemo(() => [piece], [piece]);
  const embedded = useMemo(() => ({
    open: (at: BranchPiece) => toTab({ pathname: '/branches', params: { tree: at.id } }),
    toggleView: () => setMode(current => (current === 'tree' ? 'matrix' : 'tree')),
  }), []);
  return (
    <View style={{ ...cardStyle(palette), overflow: 'hidden' }}>
      <PostHead Icon={TreeIcon} title={piece.text} sub="من متشابهات القرآن" palette={palette} quran open={{ onPress: () => embedded.open(piece), label: 'افتح الشجرة في متشابهات القرآن' }} />
      <View style={{ height: TREE_HEIGHT }}>
        <TreePager pieces={pieces} list={EMPTY_LIST} palette={palette} mode={mode} around={around} start={0} embedded={embedded} />
      </View>
    </View>
  );
});

/** Batches added each time the page nears the feed's end. */
const MORE = 3;

/**
 * The home feed: today's pair, a forgotten ayah that is due, today's tree, then more each time the page nears its end (`nearEnd` changes).
 * What was shown before is skipped for good (shared/feedSeen.ts); once all was seen it starts again from the seen ones.
 */
export function Feed({ palette, nearEnd }: { palette: Palette; nearEnd: number }) {
  const { day } = useToday();
  const visit = useSyncExternalStore(subscribeVisit, visitStart, serverVisit);
  // A new visit (pulled to refresh, or back after long away) starts again from one batch, in the same render that picks it.
  const [more, setMore] = useState({ visit, batches: 1 });
  const batches = more.visit === visit ? more.batches : 1;
  useEffect(() => {
    if (nearEnd) setMore(now => ({ visit, batches: Math.min(FEED_AHEAD, (now.visit === visit ? now.batches : 1) + MORE) }));
  }, [nearEnd]); // eslint-disable-line react-hooks/exhaustive-deps -- only a new signal asks for more
  const seen = useSyncExternalStore(subscribeFeedSeen, readFeedSeen);
  const due = useSyncExternalStore(subscribeDueMarks, readDueMarks);
  const forgotten = mostForgotten(due)[0];
  // The settings under «ما أحفظه»: questions come from the memorized range, pondering puts it first.
  const memorized = useSyncExternalStore(subscribeMemorized, readMemorized);
  const questions = useSyncExternalStore(memorizedQuestions.subscribe, memorizedQuestions.read);
  const prefer = useSyncExternalStore(memorizedPrefer.subscribe, memorizedPrefer.read);
  const recall = useMemo(() => (memorized ? recallOfDay(questions ? memorized : { all: true }, day) : undefined), [memorized, questions, day]);
  // Back after a long time in the background: a new visit, so what was shown before counts as seen (shared/feedSeen.ts).
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => (state === 'active' ? backToVisit() : leftVisit()));
    return () => listener.remove();
  }, []);
  const pairs = useMemo(() => freshPicks(offset => pairOfDayNumber(day + offset), pair => pair.id, seen, batches,
    { since: visit, prefer: prefer ? pair => touchesMemorized(pair.sides.flatMap(sideKeys), memorized) : undefined }), [day, batches, seen, prefer, memorized, visit]);
  const trees = useMemo(() => freshPicks(offset => treeOfDay(day, offset), piece => piece.id, seen, batches,
    { since: visit, prefer: prefer ? piece => touchesMemorized(piece.keys, memorized) : undefined }), [day, batches, seen, prefer, memorized, visit]);
  useEffect(() => { markFeedSeen([...pairs.map(pair => pair.id), ...trees.map(piece => piece.id)]); }, [pairs, trees]);
  const posts: React.ReactNode[] = [];
  for (let i = 0; i < batches; i++) {
    if (pairs[i]) posts.push(<PairPost key={`p${pairs[i].id}`} pair={pairs[i]} palette={palette} />);
    if (i === 0 && forgotten) posts.push(<ForgottenPost key={`ask${forgotten}`} ayah={forgotten} review={() => reviewForgotten(forgottenOrder(Object.keys(due)))} palette={palette} />);
    else if (i === 0 && recall) posts.push(<ForgottenPost key={`ask${recall}`} ayah={recall} palette={palette} />);
    if (trees[i]) posts.push(<TreePost key={`t${trees[i].id}`} piece={trees[i]} palette={palette} />);
  }
  return (
    <View style={{ gap: 14 }}>
      {posts}
    </View>
  );
}
