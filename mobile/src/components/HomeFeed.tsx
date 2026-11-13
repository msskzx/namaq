import { memo, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { AppState, Pressable, ScrollView, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeftRight, Bookmark, BookOpen, Check, ChevronLeft, Eye, EyeOff, LightbulbOff, MapPin, Moon, NotebookPen, ScrollText, Send, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { markForgotten, mostForgotten, readDueMarks, rememberAyah, subscribeDueMarks } from '@shared/ayahMarks';
import { memorizedPrefer, memorizedQuestions, readMemorized, recallOfDay, subscribeMemorized, touchesMemorized } from '@shared/memorized';
import { readAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { backToVisit, FEED_AHEAD, freshPicks, leftVisit, markFeedSeen, markStoryOpened, readFeedSeen, readStoriesOpened, storyIsNew, storyTimes, subscribeFeedSeen, subscribeStoriesOpened, subscribeVisit, visitStart, serverVisit, type StoryId } from '@shared/feedSeen';
import { hijriDate, todaysJuz } from '@shared/hijri';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import { dayNumber } from '@shared/dailyPick';
import { clock, FIVE, nextPrayer, PRAYER_NAMES } from '@shared/prayer';
import type { PairCard } from '@shared/quran/compareCards';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { pageStart } from '@shared/quran/readerPage';
import { Text } from './Text';
import { AyahText, cardLink } from './CompareCard';
import { shareCard } from '@/lib/shareImage';
import BranchTree from './BranchTree';
import TreeIcon from './TreeIcon';
import { REVIEW_LABEL, reviewForgotten } from './HomeCards';
import { forgottenOrder } from '@shared/quran/recite';
import { pairOfDayNumber, treeOfDay } from '@/lib/daily';
import { savedIdsOf, sideKeys, sideLabel, toggleCardSaved } from '@/lib/compare';
import { cardOf, isSaved, surahNames as shortNames, toggleSaved } from '@/lib/branches';
import { ayahText, pageData, PAGES, surahBefore } from '@/lib/mushaf';
import { readJson } from '@/lib/storage';
import { openIntent } from '@/lib/ways';
import { prayerPlace, prayerSettings, utilityView } from '@/lib/settings';
import { timesFor, useMinute } from '@/lib/prayer';
import { CARD, QURAN_FONT, type Palette } from '@/lib/theme';

type IconType = (props: LucideProps) => React.ReactNode;
const noTap = () => {};

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
function PostHead({ Icon, title, sub, palette, quran }: { Icon: IconType; title: string; sub?: string; palette: Palette; quran?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.paper, alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={palette.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: quran ? 18 : 16, fontWeight: quran ? undefined : '700', fontFamily: quran ? QURAN_FONT : undefined, textAlign: 'right' }}>{title}</Text>
        {sub ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{sub}</Text> : null}
      </View>
    </View>
  );
}

/** The action row under a post: on the right, share last. */
function Actions({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingBottom: 6 }}>{children}</View>;
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
        style={{ height: 124, overflow: 'hidden', borderRadius: 10, borderWidth: 1, borderColor: palette.paperDeep, backgroundColor: palette.paper, paddingHorizontal: 12, paddingVertical: 6 }}>
        <Text style={{ fontFamily: QURAN_FONT, fontSize: 21, lineHeight: 40, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
          {words.map((word, i) => typeof word === 'number'
            ? <Text key={i} style={{ fontFamily: QURAN_FONT, color: palette.accent }}>{` ${num(word)} `}</Text>
            : <Text key={i} style={{ fontFamily: QURAN_FONT }}>{`${word} `}</Text>)}
        </Text>
        {/* The slice fades into the page, as a peek of what comes next. */}
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, backgroundColor: palette.paper, opacity: 0.7 }} />
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

/** A look-alike pair as a post: both ayat, then save, the mushaf, compare and share. */
const PairPost = memo(function PairPost({ pair, palette }: { pair: PairCard; palette: Palette }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const saved = savedIdsOf(pair, bookmarks).length > 0;
  const [a, b] = pair.sides;
  const compare = () => openIntent({ tab: 'compare', lead: a.surah, other: b.surah, ayat: [...sideKeys(a), ...sideKeys(b)] });
  const sides = (
    <View style={{ paddingHorizontal: 12 }}>
      {pair.sides.map((side, i) => (
        <View key={side.surah} style={{ gap: 2, paddingVertical: 8, borderTopWidth: i ? 1 : 0, borderStyle: 'dashed', borderColor: palette.rule }}>
          <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{sideLabel(side)}</Text>
          <AyahText ayah={side.ayat[0]} palette={palette} />
        </View>
      ))}
    </View>
  );
  // Share as image: the two ayat alone in a card, without the post's head and buttons.
  const share = () => shareCard({ content: width => <View style={{ ...cardStyle(palette), width }}>{sides}</View>, link: cardLink(pair) });
  return (
    <View style={cardStyle(palette)}>
      <PostHead Icon={ArrowLeftRight} title="آيتان متشابهتان" sub={`${sideLabel(a)} · ${sideLabel(b)}`} palette={palette} />
      <View style={{ borderTopWidth: 1, borderColor: palette.rule, marginHorizontal: 12 }} />
      {sides}
      <Actions>
        <Action Icon={Bookmark} label={saved ? 'أزلها من المحفوظات' : 'احفظ'} on={saved} onPress={() => toggleCardSaved(pair)} palette={palette} />
        <Action Icon={BookOpen} label="في المصحف" onPress={() => openIntent({ tab: 'read', at: sideKeys(a)[0] })} palette={palette} />
        <Action Icon={ArrowLeftRight} label="افتحها في المقارنة" onPress={compare} palette={palette} />
        <Action Icon={Send} label="شارك" onPress={share} palette={palette} />
      </Actions>
    </View>
  );
});

/** Rough width of a hidden word's box, from its letters, as the write quiz sizes them. */
const boxWidth = (word: string) => 10 + 6 * word.replace(/[ً-ٰٟۖ-ۭ]/g, '').length;
const SHOWN_WORDS = 3;

/** A forgotten ayah that is due: its first words, the rest hidden as boxes, to recall before showing it. */
/** Today's ayah from the memorized range that the reader said they remembered: it leaves the feed until tomorrow. */
const recalled = new Set<string>();

/**
 * An ayah to recall: its first words, the rest hidden as boxes. A forgotten ayah that is due comes with the review button and
 * «تذكّرتها» rests it; an ayah of the day from what is memorized (`review` absent) has «نسيتها» to mark it forgotten instead.
 */
function ForgottenPost({ ayah, review, palette }: { ayah: string; review?: () => void; palette: Palette }) {
  const [, setGone] = useState(0);
  const [shown, setShown] = useState(false);
  useEffect(() => setShown(false), [ayah]);
  const words = useMemo(() => ayahText(ayah).split(' ').filter(Boolean), [ayah]);
  const [surah, number] = ayah.split(':').map(Number);
  if (!review && recalled.has(ayah)) return null;
  return (
    <View style={cardStyle(palette)}>
      <PostHead Icon={LightbulbOff} title="هل تذكرها؟" sub={`${shortNames[surah] ?? ''} ${num(number)}`} palette={palette} />
      <View style={{ paddingHorizontal: 12, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 6, rowGap: 6 }}>
        {words.map((word, i) => (shown || i < SHOWN_WORDS
          ? <Text key={i} style={{ fontFamily: QURAN_FONT, fontSize: 21, lineHeight: 40, color: palette.ink }}>{word}</Text>
          : <View key={i} accessibilityElementsHidden importantForAccessibility="no" style={{ width: boxWidth(word), height: 26, borderWidth: 1.5, borderColor: palette.rule, borderRadius: 6 }} />))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 }}>
        <Pressable onPress={() => setShown(value => !value)} accessibilityRole="button" accessibilityLabel={shown ? 'أخفها' : 'أظهرها'}
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.7 : 1 })}>
          {shown ? <EyeOff size={18} color={palette.ink} /> : <Eye size={18} color={palette.ink} />}
          <Text style={{ color: palette.ink, fontSize: 16 }}>{shown ? 'أخفها' : 'أظهرها'}</Text>
        </Pressable>
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

/** A tree as a post: drawn small (a wide one scrolls sideways), with save, open and share. */
const TreePost = memo(function TreePost({ piece, palette }: { piece: BranchPiece; palette: Palette }) {
  const tree = useMemo(() => cardOf(piece), [piece]);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const saved = isSaved(piece, bookmarks);
  const open = () => openIntent({ tab: 'branches', open: piece.id });
  return (
    <View style={{ ...cardStyle(palette), overflow: 'hidden' }}>
      <PostHead Icon={TreeIcon} title={piece.text} sub="من متشابهات القرآن" palette={palette} quran />
      <Pressable onPress={open} accessibilityRole="button" accessibilityLabel="افتح هذه الشجرة">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          {/* Trees draw left to right inside, as on the branches page. */}
          <View style={{ direction: 'ltr' }} pointerEvents="none">
            <BranchTree presentation={tree.presentation} matches={tree.matches} names={shortNames} palette={palette} onTap={noTap} direction="down" />
          </View>
        </ScrollView>
      </Pressable>
      <Actions>
        <Action Icon={Bookmark} label={saved ? 'أزلها من المحفوظات' : 'احفظ'} on={saved} onPress={() => toggleSaved(piece)} palette={palette} />
        <Action Icon={TreeIcon} label="افتح الشجرة" onPress={open} palette={palette} />
      </Actions>
    </View>
  );
});

/** Posts per batch: one pair and one tree; «المزيد للتأمل» adds this many batches. */
const MORE = 3;

/**
 * The home feed «للتأمل اليوم»: today's pair, a forgotten ayah that is due, today's tree, then more on request.
 * What was shown before is skipped for good (shared/feedSeen.ts); once all was seen it starts again from the seen ones.
 */
export function Feed({ palette }: { palette: Palette }) {
  const { day } = useToday();
  const [batches, setBatches] = useState(1);
  const visit = useSyncExternalStore(subscribeVisit, visitStart, serverVisit);
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
    if (i === 0 && forgotten) posts.push(<ForgottenPost key="forgotten" ayah={forgotten} review={() => reviewForgotten(forgottenOrder(Object.keys(due)))} palette={palette} />);
    else if (i === 0 && recall) posts.push(<ForgottenPost key={`recall${recall}`} ayah={recall} palette={palette} />);
    if (trees[i]) posts.push(<TreePost key={`t${trees[i].id}`} piece={trees[i]} palette={palette} />);
  }
  return (
    <View style={{ gap: 14 }}>
      <Divider label="للتأمل اليوم" palette={palette} />
      {posts}
      {batches < FEED_AHEAD && <Pressable onPress={() => setBatches(count => Math.min(FEED_AHEAD, count + MORE))} accessibilityRole="button" accessibilityLabel="المزيد للتأمل"
        style={({ pressed }) => ({ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.7 : 1 })}>
        <ChevronLeft size={18} color={palette.ink} />
        <Text style={{ color: palette.ink, fontSize: 16 }}>المزيد للتأمل</Text>
      </Pressable>}
    </View>
  );
}

/** A section label with a rule running beside it. */
export function Divider({ label, palette }: { label: string; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 15, fontWeight: '700' }}>{label}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: palette.rule }} />
    </View>
  );
}

/** Today's five prayers in one row, the next one shaded; a tap opens the utilities tab. Without a place yet, a button to pick one there. */
export function PrayerRow({ palette }: { palette: Palette }) {
  const [place] = prayerPlace.use();
  const [settings] = prayerSettings.use();
  const now = useMinute();
  const dayKey = now.toDateString();
  const times = useMemo(() => (place ? timesFor(place, now, settings) : null), [place, settings, dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const next = times ? nextPrayer(times, now) : null;
  const open = () => { utilityView.set('times'); router.navigate('/utilities'); };
  return (
    <Pressable onPress={open} accessibilityRole="button" accessibilityLabel="مواقيت الصلاة" style={({ pressed }) => ({ ...cardStyle(palette), padding: 10, gap: 8, opacity: pressed ? 0.8 : 1 })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <MapPin size={18} color={palette.accent} />
        <Text style={{ flex: 1, color: palette.ink, fontSize: 16, fontWeight: '700', textAlign: 'right' }}>مواقيت الصلاة</Text>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{place ? place.name : 'اختر مكانك'}</Text>
        <ChevronLeft size={16} color={palette.muted} />
      </View>
      {times && <View style={{ flexDirection: 'row', gap: 4 }}>
        {FIVE.map(key => {
          const on = key === next;
          return (
            <View key={key} accessible accessibilityLabel={`${PRAYER_NAMES[key]} ${clock(times[key], true)}${on ? '، التالية' : ''}`}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 10, backgroundColor: on ? palette.accent : 'transparent' }}>
              <Text style={{ color: on ? palette.onAccent : palette.muted, fontSize: 13 }}>{PRAYER_NAMES[key]}</Text>
              <Text style={{ color: on ? palette.onAccent : palette.ink, fontSize: 15 }}>{clock(times[key], true)}</Text>
            </View>
          );
        })}
      </View>}
    </Pressable>
  );
}
