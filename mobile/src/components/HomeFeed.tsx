import { createContext, isValidElement, memo, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AppState, useWindowDimensions, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeftRight, BookOpenText, CalendarRange, ChartNoAxesColumn, DoorOpen, Gem, Bookmark, BookOpen, Check, CircleMinus, Clock, Compass, EyeOff, Feather, GitCommitVertical, Layers, LibraryBig, Link2, MessagesSquare, Network, Plus, LightbulbOff, ListTree, Presentation, Sparkles, Milestone, ScrollText, Swords, History, Target, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks, type Bookmark as SavedItem } from '@shared/bookmarks';
import { compareBookmarkAyat, savedAs } from '@shared/compareBookmarks';
import { ayahBookmarkId, ayahHref, markAyah, markWord, markForgotten, toggleForgotten, mostForgotten, readDueMarks, rememberAyah, subscribeDueMarks } from '@shared/ayahMarks';
import { toggleBookmark } from '@shared/bookmarks';
import { readGestures, type GestureAction } from '@shared/readerGestures';
import { isMemorized, memorizedPrefer, memorizedQuestions, readMemorized, recallOfDay, subscribeMemorized, touchesMemorized, withMemorizedScope } from '@shared/memorized';
import { FEED_QUIZ_NAMES, feedQuizSeed, OPENINGS, openingSurah, seededRandom, type FeedQuizKind } from '@shared/quiz/feedQuiz';
import { answeredQuestion, dueSeeds, readMissed } from '@shared/quiz/missedQuestions';
import { activeInterests, INTERESTS, interestById, interestOf, pickedInterests, restoredInterest, surpriseMe, toggledInterest, type FeedCardKind } from '@shared/interests';
import { bookmarkKind, cardMenuSaveId, cardOfBookmark, isCardBookmark } from '@shared/bookmarkKind';
import { FORGOT, recited } from '@shared/quiz/choiceKinds';
import type { QuizTopic } from '@shared/quiz/settings';
import { backToVisit, growingPicks, savedOfSlot, leftVisit, markFeedSeen, readFeedSeen, subscribeFeedSeen, subscribeVisit, visitStart, serverVisit } from '@shared/feedSeen';
import { allVirtues, feedBooks, LIST_KINDS, listStart, type ListKind, feedRound, hasBooksCard, hasJuzCard, inMinutes, insertAt, isKahfDay, KAHF_SLOT, prayerSoon, type FeedSlot } from '@shared/homeFeed';
import { pageSources, saidBy } from '@shared/tarajim';
import { DRAWING_OR_TEXT, type DrawingOrText } from '@shared/drawingText';
import Saying from '@/ui/Saying';
import Tabs from '@/ui/Tabs';
import { findPerson, GRAPH, PEOPLE, personName, tiePairs, unvowelled } from '@/lib/tarajim';
import { kunyaFacts, laqabFacts, type NameFact } from '@shared/tarajimNames';
import { chainSentence } from '@shared/tarajimGraph';
import TiesChain from './TiesChain';
import LifeTimeline from './LifeTimeline';
import { personLife } from '@/lib/life';
import { drawsLine } from '@shared/events/lifeTimeline';
import balaghaTerms from '@shared/data/quran/balaghaTerms';
import { plainName, examplesOf } from '@shared/quran/balaghaTerms';
import { BookWords, ExampleAyat, ayatName, quotesTitle } from './BalaghaTerm';
import { clock, FIVE, PRAYER_NAMES, type PrayerDay, type PrayerKey } from '@shared/prayer';
import { BOOKS } from '@shared/books';
import { isReaderBook, pageName } from '@shared/readerBooks';
import { hijriDate, todaysJuz } from '@shared/hijri';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import { dayNumber } from '@shared/dailyPick';
import type { PairCard } from '@shared/quran/compareCards';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { pageStart } from '@shared/quran/readerPage';
import { continuePage, readFasilas, serverFasilas, subscribeFasilas } from '@shared/readingMarks';
import { Text } from '@/ui/Text';
import momentBattles from '@shared/data/battles/moments.json';
import type { AppBattle, AppMomentBattle } from '@shared/battles/battle';
import { battleLine, CountRow, Counts, Moment, Readings, SidesHead } from './battles/BattleParts';
import { BattleYears } from './battles/BattleTimeline';
import { yearTitle } from '@shared/battles/timeline';
import TapRow from '@/ui/TapRow';
import { STORIES } from '@/lib/stories';
import { FORTY, fortyEntry } from '@/lib/hadith';
import { compilerOf, drawnBukhari, fromCompanion, fromSahihayn, rajabFeedPassages, recordedIn, type RajabChapter } from '@shared/hadith';
import Isnad from '@/components/Isnad';
import HadithBooks from '@/components/HadithBooks';
import rajab from '@shared/data/hadith/ibnRajab.json';
import IbnRajab from '@/components/IbnRajab';
import { Report, ReportScene, reportSource, StoryAyat, StoryShare } from './stories/StoryParts';
import { drawnReport } from '@shared/stories/story';
import { armiesBattles, armiesItems, armiesSources, battleHeadSources, battleItems, battleOnCard, battleYearItems, battleYearSlice, battleYearSources, type ArmiesTab, eventItems, eventOf, eventSources, nasabPeople, nasabSources, oathItems, oathSources, openingItems, openingSources, sceneItems, sceneOf, sceneSources, tiesPeople, tiesSources } from '@shared/drawingCards';
import { NasabTree } from '@/screens/nasab';
import { OpeningRows } from '@/screens/openings';
import TiesRing, { TieSheet } from './TiesRing';
import type { Tie } from '@shared/tarajimGraph';
import BattleMap from './battles/BattleMap';
import { BATTLES, battleOf } from '@/lib/battles';
import HadithScene from './HadithScene';
import { HADITH } from '@/lib/hadith';
import { sceneSlots } from '@shared/hadith';
import { openingCards, type OpeningCard } from '@shared/quran/openingKinds';
import { ayahOf } from '@/lib/branches';
import OathWords from './OathWords';
import { buildOaths, oathPlace, type OathView } from '@shared/quran/oaths';
import EventPlaces from './EventPlaces';
import { placesOf as eventPlaces } from '@shared/quran/prophets/story';
import { STORIES as STORY_EVENTS } from '@shared/quran/prophets/stories';
import CompareCard from './CompareCard';
import TreePager from './TreePager';
import { aliasesOf, EMPTY_LIST } from '@/lib/branchList';
import { treeList } from '@/lib/branches';
import { shownBookmarks } from '@/lib/home';
import TreeIcon from './TreeIcon';
import OrderIcon from './OrderIcon';
import { REVIEW_LABEL, reviewForgotten } from './HomeCards';
import { forgottenOrder, type RecitePosition } from '@shared/quran/recite';
import { pageModel } from '@shared/quran/recitePage';
import RecitePill from './recite/RecitePill';
import { useRecite } from './recite/useRecite';
import { usePageTouch } from '@/lib/usePageTouch';
import AyahLines, { pageWords, PageTop } from './AyahLines';
import QiraatPlace from './QiraatPlace';
import { pairOfDayNumber, treeOfDay } from '@/lib/daily';
import { cardsFor, sideKeys, sideLabel } from '@/lib/compare';
import { surahNames as shortNames } from '@/lib/branches';
import { ayahMushafWords, pageData, pageOfAyah, PAGES, surahBefore } from '@/lib/mushaf';
import { isBoolean, isNumberIn, isRecord, readJson, writeJson } from '@/lib/storage';
import { openIntent, openUtility, toTab } from '@/lib/ways';
import { juzLabel, openJuz } from '@/lib/juz';
import { around as aroundSetting, branchView, penRule, prayerPlace, prayerSettings } from '@/lib/settings';
import { showsOtherView } from '@shared/quran/branchView';
import { timesFor, useMinute } from '@/lib/prayer';
import { bookState, useBooks } from '@/lib/books';
import { SAHIH, isSahihSlug, useSahihText } from '@/lib/sahih';
import { SahihHadithView } from '@/components/Sahih';
import { findHadith, placeOf, type SahihSlug } from '@shared/sahih';
import type { BookId } from '@shared/books';
import { BookCard, Shelf, TUHFA } from '@/screens/books';
import DarkSea, { DarkSeaActions, darkSeaName, darkSeaSourceList } from './DarkSea';
import { DARK_SEA_KEY } from '@shared/quran/scenes/darkSea';
import { prophetStory } from '@/lib/prophets';
import StoryMap from './StoryMap';
import { ayahPlaces } from '@shared/quran/ayahPlaces';
import itqan from '@shared/data/quran/itqanBalagha';
import surahCounts from '@shared/data/quran/surahs.json';
import { allAyat, itqanSureAyat, type AyahNote } from '@shared/quran/ayahNotes';
import { noteBody } from '@shared/quran/ayahNoteBody';
import { itqanAt } from '@shared/quran/itqanBalagha';
import { irabWordsAt } from '@shared/quran/irabData';
import { qiraatAyat, qiraatOf } from '@shared/quran/qiraatData';
import { singleAyahPassages, tafsirSadiOf } from '@shared/quran/tafsirSadiData';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import { corpusWords } from '@shared/quran/words';
import AyahPreviewSheet from './AyahPreviewSheet';
import type { WordDifference } from '@shared/quran/qiraat';
import BalaghaSheet from './BalaghaSheet';
import IrabSheet from './IrabSheet';
import QuranWords from './quran/text/QuranWords';
import { momentItem, nameItem, rajabItem, storyItem, tieItem, virtueItem } from '@shared/feedItems';
import { useFitHeight } from '@/lib/useFit';
import { storyMap } from '@shared/quran/prophets/story';
import { STORY_GROUPS } from '@shared/quran/prophets/storyGroup';
import { check, DEFAULT_LIST, DEFAULT_SOLO, isCompare, isTree, pick, questionState, reveal, startSolo, typeAnswer, type SoloRun } from '@/lib/quiz';
import { readAyah } from '@/lib/openReader';
import QuizChoice, { QuizPrompt } from './QuizChoice';
import { orderJuz } from '@shared/quiz/orderAnswer';
import { aimItems, aimSources, linkItems, linkSources, type OrderSurah } from '@shared/quran/surahOrder';
import { LinkWords, orderSurahList, SurahBody } from '@/components/OrderSurah';
import { CompareFeedback, CompareInputs } from './QuizCompare';
import { QuizFeedback, QuizInputs } from './QuizTree';
import { type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import { Tap } from '@/ui/Tap';
import Card, { CardWithRow } from '@/ui/Card';
import MoreMenu, { type MoreItem } from '@/ui/MoreMenu';
import RowScroll from '@/ui/RowScroll';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import type { Source } from '@/ui/sourceSlot';
import { citeSource, mushafSource, MUSHAF_BOOK, uniqueSources, type QuizSource } from '@shared/quiz/sources';
import { irabSources, itqanSource, qiraatSources, sadiSource } from '@shared/quiz/bookSources';
import { compiledSource, recordSource } from '@shared/quiz/hadith';
import { termSource } from '@shared/quran/balaghaTerms';
import { pieceSources, storySource } from '@shared/quran/pieceSources';
import { tanasubLink, tanasubSource } from '@shared/quran/tanasubCards';
import { SURAH_NAMES } from '@shared/quran/surahNames';
import { METHODS } from '@shared/prayer';
import Button from '@/ui/Button';
import { QuranWord } from '@/components/quran/text/AyahFlow';

type IconType = (props: LucideProps) => React.ReactNode;

/** A post's icon button, as the compare card's row has them: muted, or in the accent when on. */
function Action({ Icon, label, on, onPress, tone, disabled }: { Icon: IconType; label: string; on?: boolean; onPress: () => void; palette: Palette; tone?: 'green'; disabled?: boolean }) {
  return <IconButton Icon={Icon} label={label} onPress={onPress} on={on} disabled={disabled} tone={tone} />;
}

/**
 * Every feed post's one shape (owner, 2026-11-14 and 2026-11-20, like an Instagram post): the head, the body in one card,
 * the row of icon buttons under it grouped on the right (the open button, the card's tools, save, share) with the «⋯» of
 * «ليس من اهتماماتي» alone on the left, then the source line. The row's open button is the one way to the item's page: the
 * head and the card are not buttons for it too (owner, 2026-11-20: one control per destination). A long card stops at two
 * thirds of the screen, the rest in a sheet (ui/Card `cap`).
 */
function Post({ head, open, actions, share, source, bar, palette, whole = false, children }: { head: React.ReactNode;
  /** Opens the item in its own reader (the mushaf at the ayah, the hadith in its book): first in the row. */
  open?: React.ReactNode;
  actions?: React.ReactNode;
  /** The card's share button, last of the group, after save. */
  share?: React.ReactNode;
  /** The books the card stands on, named on its source line; a `Reference` inside the card joins its sheet. */
  source?: Source[];
  /**
   * Never capped (owner, 2026-11-20): a question shows all its choices so it can be answered on the card, and a recall card
   * its whole ayah with one write box.
   */
  whole?: boolean;
  /** A bar of the feature's own under the card, leading the buttons' row (recite mode's small bar, on the recall card; owner 2026-11-17). */
  bar?: React.ReactNode; palette: Palette; children: React.ReactNode }) {
  // The card's save is named on the saved shelf by its head's title and line.
  const named = isValidElement<{ title?: string; sub?: string }>(head) ? [head.props.title, head.props.sub].filter(Boolean).join(' · ') : '';
  const menu = useNotMine();
  return (
    <View style={{ gap: 4 }}>
      {head}
      {/* What the card's content hands up with UnderCard joins the row under the card, before the post's own buttons; share stays last. */}
      <CardWithRow palette={palette} pad={0} clip cap={!whole} bar={bar}
        lead={open} row={<>{actions}<SaveAction text={named} />{share}</>} menu={menu} source={source} sourceLine={sourceLine(palette)}>{children}</CardWithRow>
    </View>
  );
}

/**
 * What a feed card's own buttons act on (owner, 2026-11-19): the card's kind and item (to save it) and the interest it came
 * from («ليس من اهتماماتي»). A card from outside the reader's interests is added from its line above (SurpriseLine).
 */
type CardMenu = { kind: FeedCardKind | FeedQuizKind; item?: string; interest: string; surprise?: boolean;
  /** Left out where taking the interest out makes no sense (the only one picked, one interest's own view). */
  notMine?: () => void;
  /** A saved card shown again (the saved shelf, «مدونتي»): only to unsave it. */
  savedOnly?: boolean };
const CardMenuContext = createContext<CardMenu | null>(null);

/**
 * A feed card's save, in the row under the card like every other button (owner, 2026-11-20: every home card has one
 * layout, no «…» menu). `text` names a saved card on the saved shelf. The pair and tree cards save from their own row
 * (shared/bookmarkKind.ts SAVES_ITSELF).
 */
function SaveAction({ text }: { text: string }) {
  const menu = useContext(CardMenuContext);
  const saved = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const id = menu ? cardMenuSaveId(menu.kind, menu.item) : null;
  if (!id) return null;
  const on = saved.some(item => item.id === id);
  return <IconButton Icon={Bookmark} label={on ? 'أزلها من المحفوظات' : 'احفظ البطاقة'} on={on} fill onPress={() => toggleBookmark({ id, text, href: '' })} />;
}

/** The card's «⋯» menu (owner, 2026-11-20): «ليس من اهتماماتي» on a card an interest brought, nothing elsewhere. */
function useNotMine(): MoreItem[] {
  const menu = useContext(CardMenuContext);
  const notMine = menu && !menu.savedOnly && !menu.surprise ? menu.notMine : undefined;
  return notMine ? [{ Icon: CircleMinus, name: 'ليس من اهتماماتي', label: `«${interestById(menu!.interest)?.name ?? ''}» ليس من اهتماماتي`, onPress: notMine }] : [];
}

/** That «⋯» for a card that draws its own row (the pair and tree cards). */
function NotMineMenu() {
  return <MoreMenu items={useNotMine()} />;
}

/** The source line under a card's buttons (owner, 2026-11-20). */
const sourceLine = (palette: Palette) => (named: Source[], all: Source[]) => <SourceLine named={named} sources={all} palette={palette} />;

/** A feed card's head: a round icon, a title and a line under it, like a post's author. */
function PostHead({ Icon, title, sub, palette, open }: { Icon: IconType; title: string; sub?: string; palette: Palette;
  /** A tap on the head opens a page no button of the row opens (the library, «مشاهد»); `label` names it for a screen reader. */
  open?: { onPress: () => void; label: string } }) {
  const head = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.paper, alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={palette.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 16, fontWeight: '700', textAlign: 'right' }}>{title}</Text>
        {sub ? <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{sub}</Text> : null}
      </View>
    </View>
  );
  return open ? <Tap onPress={open.onPress} accessibilityRole="button" accessibilityLabel={open.label} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>{head}</Tap> : head;
}

/** Where a post's ayat are, for its head: «البقرة ٦١ · آل عمران ٢١، ١١٢» (shared/quran/ayahPlaces.ts). */
const placesOf = (keys: string[]) => ayahPlaces(keys, shortNames);

/** A mushaf page as a card's source: «المصحف · البقرة», the page in its sheet. */
const mushafPage = (surah: number, page: number): QuizSource => ({ book: MUSHAF_BOOK, at: `${SURAH_NAMES[surah]}، ص ${num(page)}` });
/** The ayat a card shows as its source: «المصحف · الإخلاص ٣», each with its page in the sheet. */
const mushafOf = (...keys: string[]) => sourcesOf(keys.map(key => mushafSource(key, pageOfAyah(key))));

/** The day's things, the same all day: date, juz. */
function useToday() {
  const now = useMinute();
  const day = dayNumber(now);
  const date = useMemo(() => hijriDate(now), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  const juz = useMemo(() => todaysJuz(now), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  return { day, date, juz };
}

/** Where the reader stopped, kept by the mushaf tab (Reader.tsx, key `reader-place`). */
const lastPage = () => { const place = readJson('reader-place', isRecord); return isNumberIn(1, PAGES)(place?.page) ? Math.round(place.page) : 1; };

/** The reading card: a slice of the page at the mushaf's فاصلة (else the page it was left on), a button there, today's date, and that page's juz. */
export function ContinueReading({ palette }: { palette: Palette }) {
  const [last, setLast] = useState(lastPage);
  // Back on home after reading: show the page reached when no فاصلة is set.
  useFocusEffect(useCallback(() => { setLast(lastPage()); }, []));
  const { page, fasila } = continuePage(useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas), last);
  const { surah } = useMemo(() => pageStart(pageData(page), surahBefore(page)), [page]);
  const { date } = useToday();
  // The juz of the page it opens on, not today's juz (owner, 2026-11-18: today's juz is its own card in the feed).
  const juz = pageData(page).juz;
  const read = () => openIntent({ tab: 'read', page });
  const where = [shortNames[surah], date?.replace(/ هـ$/, '')].filter(Boolean).join(' · ');
  return (
    <Post palette={palette} head={<PostHead Icon={BookOpen} title={fasila || page > 1 ? 'تابع القراءة' : 'ابدأ القراءة'} sub={where} palette={palette} />}
      open={<Action Icon={BookOpen} label={`افتح المصحف ${fasila ? 'عند فاصلتك' : 'حيث توقفت'}، سورة ${shortNames[surah] ?? ''}`} onPress={read} palette={palette} />}
      actions={<Text style={{ color: palette.muted, fontSize: 14, padding: 8 }}>{juzLabel([juz])}</Text>}
      source={sourcesOf([mushafPage(surah, page)])}>
      {/* The page's first half as the reader draws it (owner, 2026-11-14). */}
      <View style={{ paddingHorizontal: 12, paddingVertical: 6 }}><PageTop page={page} palette={palette} /></View>
    </Post>
  );
}

/** A look-alike pair as a post: the compare tab's own card (read-along, views, saving, sharing), and a button to open it there. */
const PairPost = memo(function PairPost({ pair, palette }: { pair: PairCard; palette: Palette }) {
  const [a, b] = pair.sides;
  const compare = useCallback(() => openIntent({ tab: 'compare', lead: a.surah, other: b.surah, ayat: [...sideKeys(a), ...sideKeys(b)] }), [a, b]);
  const sources = useMemo(() => {
    const link = pair.book ? tanasubLink(pair.book) : undefined;
    return sourcesOf([...pieceSources([...sideKeys(a), ...sideKeys(b)], pair.group ? treeList().find(piece => piece.id === pair.group || aliasesOf(piece).includes(pair.group!))?.group : undefined), ...(link ? [tanasubSource(link)] : [])]);
  }, [a, b, pair.group, pair.book]);
  return (
    <View>
      <PostHead Icon={ArrowLeftRight} title="آيتان متشابهتان" sub={`${sideLabel(a)} · ${sideLabel(b)}`} palette={palette} />
      <CompareCard card={pair} palette={palette} onOpen={compare} aside={<NotMineMenu />} />
      <SourceLine named={sources} sources={sources} palette={palette} />
    </View>
  );
});

/** Today's ayah from the memorized range that the reader said they remembered: it leaves the feed until tomorrow. */
const recalled = new Set<string>();
/** Whether the recall card asks to write the whole ayah (on) or reveals it word by word (off). */
const RECALL_WRITE = 'recall-write';

/**
 * An ayah to recall in the mushaf's own lines (AyahLines), asked as recite mode asks it (owner, 2026-11-14): what comes
 * before it shows, its words are hidden in their places, and recite mode's buttons reveal the next word or the whole ayah.
 * The pen switches to writing the whole ayah in write boxes (lib/useWriteBoxes); the last box shows the ayah with the
 * written words green or amber, and a mistake puts it on the forgotten shelf, as in the reader. A forgotten ayah that is due
 * comes with the review button and «تذكّرتها» rests it; an ayah of the day from what is memorized (`review` absent) has «نسيتها» too.
 */
function ForgottenPost({ ayah, review, title = 'هل تذكرها؟', palette }: { ayah: string; review?: () => void; title?: string; palette: Palette }) {
  const [, setGone] = useState(0);
  const [writing, setWriting] = useState(() => readJson(RECALL_WRITE, isBoolean) === true);
  const toggleWriting = () => setWriting(on => { writeJson(RECALL_WRITE, !on); return !on; });
  if (!review && recalled.has(ayah)) return null;
  const marks = <>
    <Action Icon={Check} label="تذكّرتها" tone="green" palette={palette} onPress={() => { if (review) rememberAyah(ayah); else { recalled.add(ayah); setGone(n => n + 1); } }} />
    {!review && <Action Icon={LightbulbOff} label="نسيتها" palette={palette} onPress={() => { recalled.add(ayah); markForgotten(ayah); setGone(n => n + 1); }} />}
    {review && <Action Icon={EyeOff} label={REVIEW_LABEL} onPress={review} palette={palette} />}
  </>;
  const open = <Action Icon={BookOpen} label="في المصحف" onPress={() => openIntent({ tab: 'read', at: markAyah(ayah), word: markWord(ayah) })} palette={palette} />;
  return <Recall key={`${ayah}-${writing}`} ayah={markAyah(ayah)} targetWord={markWord(ayah)} title={title} writing={writing} onWriting={toggleWriting} open={open} marks={marks} palette={palette} />;
}

/**
 * The recall card itself: recite mode on one ayah (recite/useRecite.ts, the mushaf's own), with its bar under the card. A
 * tap, double tap or long press on the ayah does what it does in recite mode (the reader's gesture settings); the pen writes
 * what the pen setting asks, and it stops at the ayah's end. Drawn afresh for each way of asking (`writing`).
 */
function Recall({ ayah, targetWord, title, writing, onWriting, open, marks, palette }: { ayah: string; targetWord?: number; title: string; writing: boolean; onWriting: () => void; open: React.ReactNode; marks: React.ReactNode; palette: Palette }) {
  const model = useMemo(() => { const page = pageOfAyah(ayah); return page ? pageModel(pageData(page), surahBefore(page)) : null; }, [ayah]);
  const [position, setPosition] = useState<RecitePosition>({ start: ayah, ...(targetWord !== undefined ? { gaps: [targetWord] } : {}), shown: null, words: 0 });
  const [pen] = penRule.use();
  const recite = useRecite({ model, position, setPosition, writing, pen, until: ayah });
  const shown = recite.done;
  const run = (action: GestureAction, key: string | null) => {
    if (action === 'next-ayah') recite.nextAyah();
    else if (action === 'next-word') recite.nextWord();
    else if (action === 'back') recite.back();
    else if (key !== ayah) return;
    else if (action === 'forgot') toggleForgotten(targetWord === undefined ? ayah : `${ayah}:${targetWord}`);
    else if (action === 'save') toggleBookmark({ id: ayahBookmarkId(ayah), text: pageWords(ayah).join(' '), href: ayahHref(ayah) });
  };
  const touches = usePageTouch((gesture, key) => run(readGestures().recite[gesture], key), () => readGestures().recite.double !== 'none');
  // While writing, a touch on the ayah only brings the keyboard back, as in the reader; the boxes pick a word themselves.
  const onTouch: typeof touches.touch = (...touch) => (recite.write ? recite.boxes.focus() : touches.touch(...touch));
  const [surah, number] = ayah.split(':').map(Number);
  return (
    <Post palette={palette} head={<PostHead Icon={LightbulbOff} title={title} sub={`${shortNames[surah] ?? ''} ${num(number)}`} palette={palette} />} whole
      bar={<RecitePill recite={recite} writing={writing} onWriting={onWriting} palette={palette} small />}
      open={open} actions={marks} source={mushafOf(ayah)}>
      <View style={{ padding: 12 }}>
        <AyahLines ayah={ayah} targetWord={targetWord} palette={palette} shown={shown} words={position.words} checked={recite.checked} onTouch={onTouch} write={recite.write} />
        {recite.write && recite.boxes.field}
      </View>
    </Post>
  );
}

/**
 * The quiz buttons a question card carries (owner, 2026-11-14, in place of home's quiz box): a solo quiz, a quiz with others,
 * and recite.
 */
export function QuizActions({ palette }: { palette: Palette }) {
  return (
    <>
      <Action Icon={Feather} label="اختبار فردي" onPress={() => router.push('/quiz/solo')} palette={palette} />
      <Action Icon={MessagesSquare} label="اختبار جماعي" onPress={() => router.push('/quiz/party')} palette={palette} />
      <Action Icon={EyeOff} label="تسميع" onPress={() => openIntent({ tab: 'read', recite: true })} palette={palette} />
    </>
  );
}

/** The tree or compare question's room in a card before it has measured what it holds: the quiz's own tree and its buttons. */
const QUIZ_TREE_HEIGHT = 380;

/**
 * One question of the solo quiz as a post (owner, 2026-11-14): the quiz's own question, drawn by its own parts (QuizChoice,
 * or a tree's QuizInputs and QuizFeedback), one kind a card in turn, the same question all day (`seed`). With «الأسئلة مما أحفظ
 * فقط» on, it asks from what is memorized, as the solo quiz does.
 */
const QuizPost = memo(function QuizPost({ kind, seed, palette }: { kind: QuizTopic; seed: number; palette: Palette }) {
  // A tree or compare question's room follows what it holds, up to most of the screen (owner, 2026-11-18).
  const [roomHeight, onFit] = useFitHeight(QUIZ_TREE_HEIGHT);
  const memorized = useSyncExternalStore(subscribeMemorized, readMemorized);
  const questions = useSyncExternalStore(memorizedQuestions.subscribe, memorizedQuestions.read);
  const [run, setRun] = useState<SoloRun | null>(null);
  useEffect(() => {
    const base = memorized && questions ? { ...DEFAULT_LIST, filters: withMemorizedScope(DEFAULT_LIST.filters, memorized) } : DEFAULT_LIST;
    // «رتّب الجزء كله» asks a run of surahs that fits the card, not a whole juz (owner, 2026-11-21).
    const list = kind === 'ORDER_JUZ' ? { ...base, filters: { ...base.filters, run: '1' } } : base;
    const started = startSolo({ ...DEFAULT_SOLO, kinds: [kind], length: 1, list }, seededRandom(seed));
    setRun(started.questions.length ? started : null);
  }, [kind, seed, memorized, questions]);
  // Answered wrong (or looked up), the question comes back after a rest; right, it goes (shared/quiz/missedQuestions.ts).
  const reported = useRef<string | null>(null);
  useEffect(() => {
    if (!run?.checked[0] || reported.current === `${kind}:${seed}`) return;
    reported.current = `${kind}:${seed}`;
    answeredQuestion(kind, seed, questionState(run, 0) === 'correct');
  }, [run, kind, seed]);
  if (!run) return null;
  const question = run.questions[0];
  const checked = run.checked[0];
  const prompt = question.promptArabic && question.promptArabic !== FEED_QUIZ_NAMES[kind] ? <QuizPrompt text={question.promptArabic} palette={palette} /> : undefined;
  return (
    <Post palette={palette} head={<PostHead Icon={kind === 'BRANCHES' ? TreeIcon : Feather} title={FEED_QUIZ_NAMES[kind]} palette={palette} />} whole
      open={!isTree(question) && !isCompare(question) && question.ayahKey && run.typed[0][0] !== undefined
        ? <Action Icon={BookOpen} label="في المصحف" onPress={() => readAyah(question.ayahKey!)} palette={palette} />
        // «رتّب السور» opens the surah order page at the asked surahs' juz.
        : !isTree(question) && question.order?.length && run.typed[0][0] !== undefined
        ? <Action Icon={OrderIcon} label="ترتيب السور" onPress={() => router.push({ pathname: '/order', params: { juz: String(orderJuz(question.order!)) } })} palette={palette} /> : undefined}
      actions={<>
        {(isTree(question) || isCompare(question)) && !checked &&
          <Action Icon={Check} label="تحقق" onPress={() => setRun(check(run))} palette={palette} />}
        <QuizActions palette={palette} />
      </>}>
      {isCompare(question)
        ? <View style={{ height: roomHeight }}>
          {checked
            ? <CompareFeedback onFit={onFit} question={question} typed={run.typed[0]} palette={palette} header={prompt} hints={run.hints?.[0]} />
            : <CompareInputs onFit={onFit} question={question} typed={run.typed[0]} onType={(blank, text) => setRun(now => now && typeAnswer(now, blank, text))} palette={palette} header={prompt} />}
        </View>
        : !isTree(question)
        ? <View style={{ paddingBottom: 12 }}>
          <QuizChoice question={question} picked={run.typed[0][0]} shown={!!run.shown?.[0]} palette={palette} header={prompt} scroll={false}
            onReveal={() => setRun(reveal(run))}
            onPick={value => {
              if (recited(question) && value === FORGOT && question.ayahKey) markForgotten(question.ayahKey);
              setRun(pick(run, value));
            }} />
        </View>
        : <View style={{ height: roomHeight }}>
          {checked
            ? <QuizFeedback onFit={onFit} question={question} typed={run.typed[0]} palette={palette} names={shortNames} header={prompt} hints={run.hints?.[0]} />
            : <QuizInputs onFit={onFit} question={question} typed={run.typed[0]} onType={(node, text) => setRun(now => now && typeAnswer(now, node, text))} palette={palette} names={shortNames} header={prompt} />}
        </View>}
    </Post>
  );
});

/** The surah openings quiz as a post: a surah's first ayah to write under its name, as the openings quiz asks it in the mushaf. */
function OpeningPost({ seed, palette }: { seed: number; palette: Palette }) {
  const memorized = useSyncExternalStore(subscribeMemorized, readMemorized);
  const questions = useSyncExternalStore(memorizedQuestions.subscribe, memorizedQuestions.read);
  const surah = useMemo(() => openingSurah(seed, memorized && questions && !('all' in memorized)
    ? Array.from({ length: 114 }, (_, i) => i + 1).filter(n => isMemorized(`${n}:1`, memorized)) : undefined), [seed, memorized, questions]);
  return surah ? <ForgottenPost ayah={`${surah}:1`} title={FEED_QUIZ_NAMES[OPENINGS]} palette={palette} /> : null;
}

/**
 * «من التراجم» (owner, 2026-11-18; sketch tarajim-app/sketch-dark.png, screen 4): a virtue from a converted entry, in the
 * book's words with who says it and its page; the head opens the person's page.
 */
function TarajimPost({ id, palette }: { id: string; palette: Palette }) {
  const pick = virtueOf(id);
  if (!pick) return null;
  const virtue = pick.person.virtues[pick.index];
  const open = () => router.push({ pathname: '/person', params: { slug: pick.person.slug } });
  return (
    <Post palette={palette} head={<PostHead Icon={Milestone} title="من التراجم" sub={personName(pick.person)} palette={palette} />}
      open={<Action Icon={Milestone} label={`افتح ترجمة ${personName(pick.person)}`} onPress={open} palette={palette} />}
      source={sourcesOf(pageSources(virtue.refs))}>
      <View style={{ padding: 14, gap: 6 }}>
        <Saying by={saidBy(virtue)} palette={palette}>
          <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{virtue.text}</Text>
        </Saying>
      </View>
    </Post>
  );
}

/**
 * «صلة» (owner, 2026-11-18; sketch tarajim-app/graph/sketch2-dark.png): two converted people and the nearest chain of ties
 * that joins them, in one sentence with the pages that state each tie; the head opens «بينه وبين…» with the two picked.
 */
function TiePost({ id, palette }: { id: string; palette: Palette }) {
  const { width } = useWindowDimensions();
  const [shown, setShown] = useState<DrawingOrText>('drawing');
  const pair = tiePairs().find(each => `${each.a},${each.b}` === id);
  if (!pair) return null;
  const nodes = [...new Set(pair.steps.flatMap(step => [step.from, step.to]))];
  const name = (slug: string) => personName(GRAPH.nodes.get(slug)!);
  const open = () => router.push({ pathname: '/between', params: { slugs: `${pair.a},${pair.b}` } });
  return (
    <Post palette={palette} head={<PostHead Icon={Link2} title="صلة" sub={`${name(pair.a)} و${name(pair.b)}`} palette={palette} />}
      open={<Action Icon={Link2} label={`ارسم الصلة بين ${name(pair.a)} و${name(pair.b)}`} onPress={open} palette={palette} />}
      source={sourcesOf(pageSources(pair.steps.flatMap(step => step.link.refs)))}>
      <View style={{ padding: 14, gap: 6 }}>
        {/* The same drawing as «بينه وبين…» (owner, 2026-11-19), or the sentence that says it: one at a time, the drawing first (owner, 2026-11-20). */}
        <Tabs palette={palette} label="كيف تُعرض الصلة" value={shown} onChange={setShown} options={DRAWING_OR_TEXT} />
        {shown === 'drawing'
          ? <TiesChain nodes={nodes} steps={pair.steps} first={pair.a} picked={[pair.a, pair.b]} width={Math.min(width - 60, 480)} palette={palette} inCard />
          : <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{chainSentence(GRAPH, pair.steps, personName)}.</Text>}
      </View>
    </Post>
  );
}

/**
 * «الألقاب» and «الكنى» (owner, 2026-11-19; sketch titles-quiz/sketch-dark.png, screen 3): one person's laqab or kunya large,
 * the person under it, the book's words when they say more than the name, and the person page's own folded reference.
 * The head opens the person's page.
 */
function NamePost({ kind, id, palette }: { kind: 'laqab' | 'kunya'; id: string; palette: Palette }) {
  const pick = nameList(kind).find(each => nameId(each) === id);
  if (!pick) return null;
  const { person, name, fact } = pick;
  const who = personName(person);
  const open = () => router.push({ pathname: '/person', params: { slug: person.slug } });
  const quote = unvowelled(fact.text).trim() !== name ? fact.text : '';
  return (
    <Post palette={palette} head={<PostHead Icon={Milestone} title={kind === 'laqab' ? 'لقب وصاحبه' : 'كنية وصاحبها'} sub={who} palette={palette} />}
      open={<Action Icon={Milestone} label={`افتح ترجمة ${who}`} onPress={open} palette={palette} />}
      source={sourcesOf(pageSources(fact.refs))}>
      <View style={{ padding: 14, gap: 4 }}>
        <Text style={{ color: palette.accent, fontSize: 30, lineHeight: 48, fontWeight: '700', textAlign: 'right' }}>{name}</Text>
        <Text style={{ color: palette.ink, fontSize: 19, lineHeight: 30, textAlign: 'right' }}>{who}</Text>
        {quote ? <Saying by={saidBy(fact)} palette={palette}><Text style={{ color: palette.muted, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>«{quote}»</Text></Saying> : null}
      </View>
    </Post>
  );
}

/**
 * «من حياته» (owner 2026-11-19: every feature gets a feed card, drawn with its own view): a person's «حياته» timeline as
 * his page draws it, the rail a year a line; the head opens his page.
 */
function LifePost({ slug, palette }: { slug: string; palette: Palette }) {
  const person = findPerson(slug);
  if (!person) return null;
  const items = personLife(person);
  const she = person.sex === 'FEMALE';
  const open = () => router.push({ pathname: '/person', params: { slug } });
  return (
    <Post palette={palette} head={<PostHead Icon={History} title={she ? 'من حياتها' : 'من حياته'} sub={personName(person)} palette={palette} />}
      open={<Action Icon={Milestone} label={`افتح ترجمة ${personName(person)}`} onPress={open} palette={palette} />}
      source={sourcesOf(uniqueSources(items.flatMap(item => [...item.refs, ...item.yearRefs]).map(citeSource)))}>
      <View style={{ paddingVertical: 14, paddingHorizontal: 10 }}>
        <LifeTimeline items={items} palette={palette} inCard compact linked={false} />
      </View>
    </Post>
  );
}

/** The drawings' cards share the person's head: «نسبه» or «صلاته», the person under it. */
const herOrHis = (slug: string, his: string, hers: string) => (findPerson(slug)?.sex === 'FEMALE' ? hers : his);

/**
 * «نسبه» (owner, 2026-11-20: the drawings home was missing; sketch layout-cleanup panel 6): a person's nasab tree as his
 * nasab page draws it, long runs of fathers folded; its open button opens that page.
 */
function NasabPost({ slug, palette }: { slug: string; palette: Palette }) {
  const person = findPerson(slug);
  if (!person) return null;
  const open = () => router.push({ pathname: '/nasab', params: { slug } });
  return (
    <Post palette={palette} head={<PostHead Icon={Network} title={herOrHis(slug, 'نسبه', 'نسبها')} sub={personName(person)} palette={palette} />}
      open={<Action Icon={Network} label={`افتح نسب ${personName(person)}`} onPress={open} palette={palette} />}
      source={sourcesOf(nasabSources(person, PEOPLE))}>
      <View style={{ padding: 14, gap: 10 }}><NasabTree slugs={[slug]} palette={palette} meetings={false} text={false} inCard /></View>
    </Post>
  );
}

/** «صلاته»: a person's ties ring as his ties page draws it; a person on it opens his page, and its open button the ties page. */
function TiesPost({ slug, palette }: { slug: string; palette: Palette }) {
  const { width } = useWindowDimensions();
  const [tie, setTie] = useState<Tie | undefined>();
  const person = findPerson(slug);
  if (!person) return null;
  const title = herOrHis(slug, 'صلاته', 'صلاتها');
  const open = () => router.push({ pathname: '/ties', params: { slug } });
  return (
    <Post palette={palette} head={<PostHead Icon={Link2} title={title} sub={personName(person)} palette={palette} />}
      open={<Action Icon={Link2} label={`افتح ${title}: ${personName(person)}`} onPress={open} palette={palette} />}
      source={sourcesOf(tiesSources(GRAPH, slug))}>
      <View style={{ padding: 14 }}>
        <TiesRing slug={slug} width={Math.min(width - 60, 480)} palette={palette} onPick={to => router.push({ pathname: '/person', params: { slug: to } })} onShow={setTie} />
      </View>
      <TieSheet tie={tie} onClose={() => setTie(undefined)} palette={palette} />
    </Post>
  );
}

/**
 * A battle (sketch panel 6): its place on the still map and the two sides' numbers, as its page draws them; a fitna battle
 * shows no numbers (shared/drawingCards.ts battleOnCard). Its open button opens the battle's page.
 */
function BattlePost({ slug, palette }: { slug: string; palette: Palette }) {
  const found = battleOf(slug);
  if (!found) return null;
  const battle = battleOnCard(found);
  const open = () => toTab({ pathname: '/battle', params: { slug } });
  return (
    <Post palette={palette} head={<PostHead Icon={Swords} title={battle.name} sub={battleLine(battle)} palette={palette} />}
      open={<Action Icon={Swords} label={`افتح ${battle.name}`} onPress={open} palette={palette} />}
      source={sourcesOf(battleHeadSources(battle))}>
      {battle.place ? <>
        <BattleMap places={[battle.place]} palette={palette} />
        <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right', paddingHorizontal: 12, paddingTop: 6 }}>موضع تقريبي على خريطة اليوم، من عندنا.</Text>
      </> : null}
      <View style={{ padding: 14 }}><Counts battle={battle} palette={palette} /></View>
    </Post>
  );
}

/**
 * A year of the battles timeline with the year before and after it (owner, 2026-11-21; feed-visuals sketch, panel 4), the
 * year lit, its battles' places on one map and its battles listed under them, each opening its page; a year's column, or the open button, opens the
 * battles screen at that year.
 */
function BattleYearPost({ id, palette }: { id: string; palette: Palette }) {
  const { width } = useWindowDimensions();
  const year = Number(id);
  const slice = battleYearSlice(BATTLES, year);
  if (!slice) return null;
  const toYear = (at: number) => toTab({ pathname: '/battles', params: { year: String(at) } });
  // The year's battles on one map (owner, 2026-11-22), each place once.
  const places = [...new Map(slice.battles.flatMap(battle => (battle.place ? [[battle.place.name, battle.place] as const] : []))).values()];
  return (
    <Post palette={palette} head={<PostHead Icon={CalendarRange} title="من الغزوات والمعارك" sub={yearTitle(year)} palette={palette} />}
      open={<Action Icon={CalendarRange} label={`افتح ${yearTitle(year)} في الغزوات والمعارك`} onPress={() => toYear(year)} palette={palette} />}
      source={sourcesOf(battleYearSources(BATTLES, year))}>
      <View style={{ padding: 14, gap: 6 }}>
        <BattleYears columns={slice.columns} lit={year} width={Math.min(width - 60, 480)} palette={palette} onYear={toYear} />
        {places.length ? <>
          <BattleMap places={places} palette={palette} />
          <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>مواضع تقريبية على خريطة اليوم، من عندنا.</Text>
        </> : null}
        {slice.battles.map(battle => (
          <TapRow key={battle.slug} role="link" label={`افتح ${battle.name}`} style={{ flexDirection: 'column', justifyContent: 'center' }}
            onPress={() => toTab({ pathname: '/battle', params: { slug: battle.slug } })}>
            <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>{battle.name}</Text>
            <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{battleLine(battle)}</Text>
            <Readings values={[battle.year]} palette={palette} />
          </TapRow>
        ))}
      </View>
    </Post>
  );
}

const ARMIES_TAB_NAMES: { key: ArmiesTab; label: string }[] = [{ key: 'field', label: 'في الميدان' }, { key: 'killed', label: 'القتلى' }];

/**
 * The two armies across the battles whose data cites both sides (owner, 2026-11-21; feed-visuals sketch, panel 5), a row of
 * the battle page's numbers each, «في الميدان» or «القتلى»; a dash where the source gives no number, and each number's other readings under it, attributed. A row opens its battle.
 */
function ArmiesPost({ id, palette }: { id: string; palette: Palette }) {
  const [tab, setTab] = useState<ArmiesTab>(id === 'killed' ? 'killed' : 'field');
  const battles = armiesBattles(BATTLES);
  if (!battles.length) return null;
  const sides = (battle: AppBattle) => (tab === 'field' ? [battle.counts.muslims, battle.counts.others] : [battle.counts.muslimsKilled, battle.counts.othersKilled]);
  return (
    <Post palette={palette} head={<PostHead Icon={ChartNoAxesColumn} title="الجيشان في الغزوات" sub={battles.map(battle => battle.name.replace(/^غزوة /, '')).join(' · ')} palette={palette} />}
      open={<Action Icon={Swords} label="افتح الغزوات والمعارك" onPress={() => toTab('/battles')} palette={palette} />}
      source={sourcesOf(armiesSources(BATTLES))}>
      <View style={{ padding: 14, gap: 10 }}>
        <Tabs palette={palette} label="ما يُعدّ" value={tab} onChange={setTab} options={ARMIES_TAB_NAMES} fill />
        <SidesHead battle={battles[0]} palette={palette} />
        {battles.map(battle => {
          const [ours, theirs] = sides(battle);
          return (
            <TapRow key={battle.slug} role="link" label={`افتح ${battle.name}`} style={{ flexDirection: 'column', justifyContent: 'center' }}
              onPress={() => toTab({ pathname: '/battle', params: { slug: battle.slug } })}>
              <CountRow label={[battle.name, battle.year && yearTitle(battle.year.value)].filter(Boolean).join(' · ')} ours={ours?.value} theirs={theirs?.value} palette={palette} />
              <Readings values={[ours, theirs]} palette={palette} />
            </TapRow>
          );
        })}
      </View>
    </Post>
  );
}

/** A hadith's scene drawn as a chat, as its page draws it (sketch panel 6); its open button opens the hadith's page. */
function HadithScenePost({ id, palette }: { id: string; palette: Palette }) {
  const found = sceneOf(HADITH.units, id);
  if (!found) return null;
  const { unit, report, scene, at } = found;
  const slots = sceneSlots(report.scenes, palette.slots.length)[at];
  const open = () => toTab({ pathname: '/hadith-unit', params: { unit: unit.id } });
  return (
    <Post palette={palette} head={<PostHead Icon={MessagesSquare} title={`من ${unit.book}`} sub={[unit.kitab, `المشهد ${num(scene.ordinal)}`].filter(Boolean).join(' · ')} palette={palette} />}
      open={<Action Icon={MessagesSquare} label={`افتح الحديث في ${unit.book}`} onPress={open} palette={palette} />}
      source={sourcesOf(sceneSources(unit))}>
      <View style={{ paddingHorizontal: 14, paddingVertical: 12 }}><HadithScene lines={scene.lines} slots={slots} palette={palette} /></View>
    </Post>
  );
}

let openings: OpeningCard[] | undefined;
const openingList = () => (openings ??= openingCards(ayahOf));

/** «فواتح السور»: a card of surahs whose openings go together, as the openings page draws it; its open button opens it there. */
function OpeningCardPost({ id, palette }: { id: string; palette: Palette }) {
  const card = openingList().find(each => each.id === id);
  if (!card) return null;
  const open = () => toTab({ pathname: '/openings', params: { at: id } });
  return (
    <Post palette={palette} head={<PostHead Icon={DoorOpen} title="من فواتح السور" sub={card.title} palette={palette} />}
      open={<Action Icon={DoorOpen} label={`افتح «${card.title}» في فواتح السور`} onPress={open} palette={palette} />}
      source={sourcesOf(openingSources(card))}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 9 }}><OpeningRows card={card} palette={palette} /></View>
    </Post>
  );
}

let oaths: OathView[] | undefined;
const oathList = () => (oaths ??= [...buildOaths('allah', ayahMushafWords), ...buildOaths('others', ayahMushafWords)]);

/** «الأقسام»: an oath's ayat, the words sworn by in colour, as the oaths page draws it; its open button opens it there. */
function OathPost({ id, palette }: { id: string; palette: Palette }) {
  const oath = oathList().find(each => each.id === id);
  if (!oath) return null;
  const place = oathPlace(oath, num);
  const open = () => toTab({ pathname: '/oaths', params: { at: id } });
  return (
    <Post palette={palette} head={<PostHead Icon={Feather} title="من الأقسام" sub={[place, oath.who].filter(Boolean).join(' · ')} palette={palette} />}
      open={<Action Icon={Feather} label={`افتح ${place} في الأقسام`} onPress={open} palette={palette} />}
      actions={<Action Icon={BookOpen} label={`افتح ${place} في المصحف`} onPress={() => readAyah(oath.id)} palette={palette} />}
      source={sourcesOf(oathSources(id))}>
      <View style={{ paddingHorizontal: 14, paddingVertical: 6 }}><OathWords oath={oath} palette={palette} /></View>
    </Post>
  );
}

/** The surah-order page's surah, by its number as the feed keeps it. */
const orderSurahOf = (item: string) => orderSurahList().find(each => each.surah === Number(item));
const openOrder = (s: OrderSurah) => router.push({ pathname: '/order', params: { juz: String(s.juz[0]) } });

/**
 * «مقصود السورة» (owner, 2026-11-21; sketch surah-order-feed/sketch-dark.png, screen 2): a surah's card as the surah-order
 * page draws it, its opening ayat and al-Biqa'i's aim; the open button opens the page at the surah's juz.
 */
function SurahAimPost({ id, palette }: { id: string; palette: Palette }) {
  const s = orderSurahOf(id);
  if (!s) return null;
  return (
    <Post palette={palette} head={<PostHead Icon={Target} title="مقصود السورة" palette={palette} />}
      open={<Action Icon={OrderIcon} label={`افتح سورة ${s.name} في ترتيب السور`} onPress={() => openOrder(s)} palette={palette} />}
      source={sourcesOf(aimSources(id))}>
      <View style={{ paddingHorizontal: 14, paddingVertical: 8 }}><SurahBody s={s} palette={palette} /></View>
    </Post>
  );
}

/**
 * «بين سورتين» (sketch screen 1): a surah and the one before it, al-Suyuti's words on what joins them (Ibn al-Zubayr's where
 * he is silent) and the ayat his words name, as the surah-order page shows them.
 */
function SurahLinkPost({ id, palette }: { id: string; palette: Palette }) {
  const s = orderSurahOf(id);
  const before = orderSurahOf(String(Number(id) - 1));
  if (!s?.link || !before) return null;
  return (
    <Post palette={palette} head={<PostHead Icon={Link2} title="بين سورتين" palette={palette} />}
      open={<Action Icon={OrderIcon} label={`افتح ${before.name} و${s.name} في ترتيب السور`} onPress={() => openOrder(s)} palette={palette} />}
      source={sourcesOf(linkSources(id))}>
      <View style={{ paddingHorizontal: 14, paddingVertical: 8, gap: 6 }}>
        <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 22, fontWeight: '700', textAlign: 'right' }}>{`${before.name} ← ${s.name}`}</Text>
        <LinkWords link={s.link} palette={palette} barred />
      </View>
    </Post>
  );
}

/**
 * A prophet's event read across the surahs that tell it (sketch panel 6): the story page's own places, shared words in
 * colour, its buttons left on the page; the open button opens the story at this event.
 */
function EventPost({ id, palette }: { id: string; palette: Palette }) {
  const found = eventOf(STORY_EVENTS, id);
  const prophet = found ? prophetStory(found.slug) : undefined;
  if (!found || !prophet) return null;
  const event = prophet.events[found.at];
  const phase = prophet.story.phases[event.phase];
  const open = () => router.push({ pathname: '/prophets/[slug]', params: { slug: found.slug, event: String(found.at) } });
  return (
    <Post palette={palette} head={<PostHead Icon={ScrollText} title={prophet.title} sub={phase} palette={palette} />}
      open={<Action Icon={BookOpen} label={`افتح ${event.title} في القصة`} onPress={open} palette={palette} />}
      source={sourcesOf(eventSources(found.event))}>
      <View style={{ paddingVertical: 12 }}>
        <EventPlaces event={event} places={eventPlaces(event)} phase={phase} readable={false} palette={palette}
          onStep={() => {}} hasPrev={false} hasNext={false} onLayoutPlace={() => {}} />
      </View>
    </Post>
  );
}

/** The people whose life the feed can draw. */
const lifePeople = () => PEOPLE.filter(person => drawsLine(personLife(person))).map(person => person.slug);

/** The book a quiz kind asks from: its card stays out while that book is off the phone, as the book's own ayah card does. */
const QUIZ_BOOKS: Partial<Record<FeedQuizKind, BookId>> = { TAFSIR: 'sadi', BALAGHA: 'itqan', TERM: 'itqan', IRAB: 'irab-words' };

/** A question card of kind `kind`: the openings quiz, or one of the solo quiz's. */
function FeedQuiz({ kind, seed, palette }: { kind: FeedQuizKind; seed: number; palette: Palette }) {
  useBooks();
  const book = QUIZ_BOOKS[kind];
  if (book && bookState(book) !== 'on') return null;
  return kind === OPENINGS ? <OpeningPost seed={seed} palette={palette} /> : <QuizPost kind={kind} seed={seed} palette={palette} />;
}

/**
 * The tree card's height: its frame, the buttons and the chips. A lit path's ayat add their room below (TreeCard `ayatRoom`),
 * so the tree keeps its size (owner, 2026-11-14).
 */
const TREE_HEIGHT = 470;
/** On a taller screen the cards grow with it (owner, 2026-11-15): this share of the screen's height, never less than the sizes above. */
const TREE_SHARE = 0.68;

/**
 * One tree as a post: the branches tab's own pager (TreePager) holding just this tree, so it zooms, pans, lights a path on
 * a tap and saves on a double tap, as there. The open button takes it to the branches tab.
 */
const TreePost = memo(function TreePost({ piece, palette }: { piece: BranchPiece; palette: Palette }) {
  // Opens on the settings' default view; a reader who picked the tree sees one tree in ten as the matrix, but the tree is
  // never shown to anyone who did not pick it (owner, 2026-11-17). The card's own switches change only this card.
  const [preferred] = branchView.use();
  const mode = preferred === 'tree' && showsOtherView(piece.id) ? 'matrix' : preferred;
  const [around] = aroundSetting.use();
  const pieces = useMemo(() => [piece], [piece]);
  const [room, setRoom] = useState(0);
  const { height: screen } = useWindowDimensions();
  // The matrix's card follows its rows, up to most of the screen (owner, 2026-11-18); the tree keeps its own height.
  const [height, onFit] = useFitHeight(Math.max(TREE_HEIGHT, Math.round(screen * TREE_SHARE)));
  const embedded = useMemo(() => {
    const open = (at: BranchPiece) => toTab({ pathname: '/branches', params: { tree: at.id } });
    const lead = <Action Icon={TreeIcon} label="افتح الشجرة في متشابهات القرآن" onPress={() => open(piece)} palette={palette} />;
    return { open, ayatRoom: { height: room, set: setRoom }, onFit, extra: { lead, aside: <NotMineMenu /> } };
  }, [room, onFit, piece, palette]);
  const sources = useMemo(() => sourcesOf(pieceSources(piece.keys, piece.group)), [piece]);
  // The pager draws the tree in its own card and its buttons under it, so the post is the head and the pager.
  return (
    <View style={{ gap: 4 }}>
      <PostHead Icon={TreeIcon} title="من متشابهات القرآن" sub={placesOf(piece.keys)} palette={palette} />
      <View style={{ height: height + room }}>
        <TreePager pieces={pieces} list={EMPTY_LIST} palette={palette} mode={mode} around={around} start={0} embedded={embedded} />
      </View>
      <SourceLine named={sources} sources={sources} palette={palette} />
    </View>
  );
});

/** A saved ayah as a post: the ayah in the mushaf's own lines, as the recall card shows it once revealed. */
function SavedAyahPost({ ayah, palette }: { ayah: string; palette: Palette }) {
  const [surah, number] = ayah.split(':').map(Number);
  return (
    <Post palette={palette} head={<PostHead Icon={Bookmark} title="من المحفوظات" sub={`${shortNames[surah] ?? ''} ${num(number)}`} palette={palette} />}
      open={<Action Icon={BookOpen} label="في المصحف" onPress={() => openIntent({ tab: 'read', at: ayah })} palette={palette} />} source={mushafOf(ayah)}>
      <View style={{ padding: 12 }}>
        <AyahLines ayah={ayah} palette={palette} shown whole write={null} checked={null} />
      </View>
    </Post>
  );
}

/**
 * A saved item as its own card (owner, 2026-11-14): a tree as the tree card, a compare card as the pair card, an ayah in the
 * mushaf's lines. One that the data no longer holds is skipped.
 */
function SavedPost({ item, palette }: { item: SavedItem; palette: Palette }) {
  const found = useMemo(() => {
    const kind = bookmarkKind(item);
    if (kind === 'card') return { card: item.id };
    if (kind === 'ayah') return { ayah: item.id.slice('ayah:'.length) };
    if (kind === 'tree') return { piece: treeList().find(piece => piece.id === item.id || aliasesOf(piece).includes(item.id)) };
    const surahs = [...new Set(compareBookmarkAyat(item).map(key => Number(key.split(':')[0])))].sort((a, b) => a - b);
    return { pair: surahs.length ? cardsFor(surahs[0], surahs[1] ?? surahs[0]).find(card => savedAs(card.id, [item]).length) : undefined };
  }, [item]);
  if ('card' in found) return found.card ? <SavedFeedCard id={found.card} palette={palette} /> : null;
  if ('ayah' in found) return found.ayah && /^\d+:\d+$/.test(found.ayah) && shortNames[Number(found.ayah.split(':')[0])] ? <SavedAyahPost ayah={found.ayah} palette={palette} /> : null;
  if ('piece' in found) return found.piece ? <TreePost piece={found.piece} palette={palette} /> : null;
  return found.pair ? <PairPost pair={found.pair} palette={palette} /> : null;
}

/**
 * A prophet's story map as a post (owner, 2026-11-14): the prophets page's own map (StoryMap), every event and surah, opened
 * sideways at the day's group; no scroll inside it (owner, 2026-11-20), a long map stops as every long card does (Post).
 * Any tap opens the story page at its top, not scrolled to an event, so a new reader sees where they landed (owner, 2026-11-14).
 */
const StoryPost = memo(function StoryPost({ slug, phase, palette }: { slug: string; phase: number; palette: Palette }) {
  const prophet = useMemo(() => prophetStory(slug), [slug]);
  const map = useMemo(() => (prophet ? storyMap(prophet.events) : null), [prophet]);
  if (!prophet || !map) return null;
  const open = () => { continueAfter('prophets', `${slug}-${phase}`); router.push({ pathname: '/prophets/[slug]', params: { slug } }); };
  return (
    <Post palette={palette} head={<PostHead Icon={ScrollText} title={prophet.title} sub={prophet.story.phases[phase]} palette={palette} />}
      open={<Action Icon={BookOpen} label="افتح القصة" onPress={() => open()} palette={palette} />}
      source={sourcesOf([storySource(prophet.events, phase)])}>
      <View style={{ paddingVertical: 8 }}>
        <StoryMap map={map} events={prophet.events} phases={prophet.story.phases} at={phase} palette={palette} onPick={open} onTitle={open} />
      </View>
    </Post>
  );
});

/**
 * Today's juz as a post (owner, 2026-11-18: no longer a circle at the top): the Hijri day's juz, the top of its first page,
 * and a button to read it. «الجزءان» on the last day of a 29-day month.
 */
function JuzPost({ palette }: { palette: Palette }) {
  const { date, juz } = useToday();
  if (!juz) return null;
  const start = JUZ_INDEX[juz[0] - 1];
  const page = pageOfAyah(`${start.surah}:${start.ayah}`) ?? 1;
  const read = () => openJuz(juz[0]);
  return (
    <Post palette={palette} head={<PostHead Icon={BookOpen} title="جزء اليوم" sub={[juzLabel(juz), date?.replace(/ هـ$/, '')].filter(Boolean).join(' · ')} palette={palette} />}
      open={<Action Icon={BookOpen} label={`اقرأ ${juzLabel(juz)}، جزء اليوم`} onPress={read} palette={palette} />} source={mushafOf(`${start.surah}:${start.ayah}`)}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 6 }}><PageTop page={page} palette={palette} /></View>
    </Post>
  );
}

/** Friday's card (owner, 2026-11-20): Surat al-Kahf's first page; its button opens the mushaf there. */
function KahfPost({ palette }: { palette: Palette }) {
  const page = pageOfAyah('18:1') ?? 293;
  const read = () => openIntent({ tab: 'read', at: '18:1' });
  return (
    <Post palette={palette} head={<PostHead Icon={BookOpen} title="سورة الكهف" sub="يوم الجمعة" palette={palette} />}
      open={<Action Icon={BookOpen} label="اقرأ سورة الكهف" onPress={read} palette={palette} />} source={mushafOf('18:1')}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 6 }}><PageTop page={page} palette={palette} /></View>
    </Post>
  );
}

/**
 * The prayer card (owner, 2026-11-18): when a prayer is near it comes into the feed where the reader is, with the time left,
 * the five times of the day and the Hijri date. Its buttons open the prayer times and the qibla.
 */
function PrayerPost({ prayer, times, palette }: { prayer: Exclude<PrayerKey, 'sunrise'>; times: PrayerDay; palette: Palette }) {
  const now = useMinute();
  const [place] = prayerPlace.use();
  const [settings] = prayerSettings.use();
  const method = METHODS.find(each => each.id === settings.method)?.label ?? '';
  const { date } = useToday();
  const left = Math.ceil((times[prayer].getTime() - now.getTime()) / 60_000);
  const title = left > 0 ? `${PRAYER_NAMES[prayer]} ${inMinutes(left)}` : `حان وقت ${PRAYER_NAMES[prayer]}`;
  return (
    <Post palette={palette} head={<PostHead Icon={Clock} title={title} sub={[date, place?.name].filter(Boolean).join(' · ')} palette={palette} />}
      actions={<>
        <Action Icon={Clock} label="مواقيت الصلاة" onPress={() => openUtility('times')} palette={palette} />
        <Action Icon={Compass} label="القبلة" onPress={() => openUtility('qibla')} palette={palette} />
      </>}
      source={[{ line: `طريقة الحساب · ${method}`, quotes: [{ text: `حُسبت المواقيت بطريقة ${method}${settings.hanafi ? '، والعصر على مذهب الحنفية' : ''}، وتُغيَّر من مواقيت الصلاة.` }] }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 }}>
        {FIVE.map(key => {
          const color = key === prayer ? palette.accent : palette.ink;
          return (
            <View key={key} accessible accessibilityLabel={`${PRAYER_NAMES[key]} ${clock(times[key], true)}`} style={{ alignItems: 'center', gap: 2 }}>
              <Text style={{ color: key === prayer ? palette.accent : palette.muted, fontSize: 13 }}>{PRAYER_NAMES[key]}</Text>
              <Text style={{ color, fontSize: 16 }}>{clock(times[key])}</Text>
            </View>
          );
        })}
      </View>
    </Post>
  );
}

type Soon = { key: string; prayer: Exclude<PrayerKey, 'sunrise'>; times: PrayerDay };

/** The prayer that is near now, with its day's times, or null; checked every half minute. */
function soonNow(): Soon | null {
  const place = prayerPlace.get();
  if (!place) return null;
  const now = new Date();
  const times = timesFor(place, now, prayerSettings.get());
  const soon = prayerSoon(times, now);
  return soon ? { key: `${now.toDateString()}-${soon.key}`, prayer: soon.key, times } : null;
}

/**
 * The prayer that is near, changing only when it becomes another one, so the feed draws again only then (not every minute).
 * The place or the method changed in the utilities is picked up within half a minute.
 */
function usePrayerSoon(): Soon | null {
  const [soon, setSoon] = useState(soonNow);
  useEffect(() => {
    const check = () => setSoon(now => { const next = soonNow(); return next?.key === now?.key ? now : next; });
    const timer = setInterval(check, 30_000);
    const listener = AppState.addEventListener('change', state => { if (state === 'active') check(); });
    return () => { clearInterval(timer); listener.remove(); };
  }, []);
  return soon;
}

/** How wide a book is on the books card: two and a bit show, so the row says it scrolls. */
const FEED_BOOK = 150;

/**
 * A few books from the library as a post (owner, 2026-11-18): the shelf's own cards, title and author, those with a فاصلة
 * first; a tap opens the book. The head opens the library.
 */
function BooksPost({ day, palette }: { day: number; palette: Palette }) {
  useBooks();
  const fasilas = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas);
  const shelf = [...BOOKS.filter(book => isReaderBook(book.id) && bookState(book.id) === 'on'), TUHFA];
  const picks = feedBooks(shelf, id => id in fasilas, day);
  return (
    <View style={{ gap: 4 }}>
      <PostHead Icon={LibraryBig} title="من المكتبة" palette={palette} open={{ onPress: () => toTab('/books'), label: 'افتح المكتبة' }} />
      <RowScroll gap={12}>
          {picks.map(book => {
            if (book.id === TUHFA.id) return <Shelf key={book.id} palette={palette} label={TUHFA.title} onPress={() => toTab('/tuhfa')} kind={TUHFA.kind} title={TUHFA.title} by={TUHFA.by} width={FEED_BOOK} />;
            const mark = 'kind' in book && isReaderBook(book.id) ? fasilas[book.id] : undefined;
            return 'builtIn' in book ? <BookCard key={book.id} book={book} palette={palette} editing={false} width={FEED_BOOK}
              fasila={mark && isReaderBook(book.id) ? pageName(book.id, mark.part, mark.page) : null} /> : null;
          })}
      </RowScroll>
    </View>
  );
}

/**
 * A scene from «مشاهد» as a post (owner, 2026-11-21): the scene's whole picture, still, with its ayah; the head opens the page
 * where the reader walks through it.
 */
const ScenePost = memo(function ScenePost({ id, palette }: { id: string; palette: Palette }) {
  if (id !== DARK_SEA_KEY) return null;
  return (
    <Post palette={palette} head={<PostHead Icon={Presentation} title="من المشاهد" sub={darkSeaName()} palette={palette} open={{ onPress: () => toTab('/lataif'), label: 'افتح المشاهد' }} />}
      open={<DarkSeaActions palette={palette} only="open" />} share={<DarkSeaActions palette={palette} only="share" />}
      source={darkSeaSourceList()}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}><DarkSea palette={palette} still /></View>
    </Post>
  );
});

/**
 * A sira story (owner, 2026-11-18): its first report whole, so a first reader has what led to the words and what came of
 * them; the ayat it turns on folded under it. Its open button opens the story's page.
 */
function SiraPost({ id, palette }: { id: string; palette: Palette }) {
  const story = STORIES.find(each => each.slug === id);
  if (!story?.reports[0]) return null;
  const report = story.reports[0];
  // Drawn by speaker where a book names them (owner, 2026-11-21), as on the story's page.
  const drawn = drawnReport(report);
  const open = () => { continueAfter('sira', id); toTab({ pathname: '/story', params: { slug: story.slug } }); };
  return (
    <Post palette={palette} head={<PostHead Icon={ScrollText} title="من قصص السيرة" sub={story.name} palette={palette} />}
      open={<Action Icon={ScrollText} label={`افتح ${story.name}`} onPress={open} palette={palette} />}
      share={drawn ? <StoryShare story={story} report={report} palette={palette} /> : undefined}
      source={reportSource(report, drawn)}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
        {drawn ? <ReportScene report={report} palette={palette} /> : <Report report={report} palette={palette} plain />}
        {story.ayat.map(ayat => <StoryAyat key={ayat.from} ayat={ayat} palette={palette} folded />)}
      </View>
    </Post>
  );
}

/** The Forty (and Ibn Rajab's eight) taken whole from the Sahihayn, the most authentic first (owner, 2026-11-18), for the hadith cards. */
const FEED_FORTY = FORTY.entries.filter(fromSahihayn);

/** Ibn Rajab's explanations of a phrase of those hadith, for his card. */
const RAJAB_PASSAGES = rajabFeedPassages(rajab as RajabChapter[], FORTY.entries);
/** A passage's lasting id: its hadith's number and its first paragraph's place in the chapter. */
const rajabId = ({ chapter, passage }: (typeof RAJAB_PASSAGES)[number]) => rajabItem(chapter.n, chapter.paragraphs.indexOf(passage[0]));

/**
 * A passage of Ibn Rajab's Jami' al-'Ulum wal-Hikam (owner, 2026-11-18: every feature gets a card), where he explains a phrase
 * of one of the Forty; its open button opens the hadith's page, his whole chapter at its foot.
 */
function RajabPost({ id, palette }: { id: string; palette: Palette }) {
  const picked = RAJAB_PASSAGES.find(each => rajabId(each) === id);
  if (!picked) return null;
  const entry = fortyEntry(picked.chapter.n);
  if (!entry) return null;
  const open = () => toTab({ pathname: '/hadith-forty', params: { n: String(entry.n) } });
  return (
    <Post palette={palette} head={<PostHead Icon={BookOpenText} title="من شرح ابن رجب" sub={`${entry.heading}، ${fromCompanion(entry.companion)}`} palette={palette} />}
      open={<Action Icon={MessagesSquare} label={`افتح ${entry.heading}`} onPress={open} palette={palette} />}
      source={sourcesOf([{ book: FORTY.books.ibnrajab.title, author: 'ابن رجب' }])}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <IbnRajab chapter={picked.chapter} only={picked.passage} palette={palette} />
      </View>
    </Post>
  );
}

/** One of the Forty in al-Nawawi's words (Ibn Rajab's for his eight); its open button opens the hadith's page with its records. */
function HadithPost({ id, palette }: { id: string; palette: Palette }) {
  const entry = FEED_FORTY.find(each => String(each.n) === id);
  if (!entry) return null;
  const { book } = compilerOf(entry);
  const open = () => toTab({ pathname: '/hadith-forty', params: { n: String(entry.n) } });
  return (
    <Post palette={palette} head={<PostHead Icon={MessagesSquare} title="من الحديث" sub={`${entry.heading}، ${fromCompanion(entry.companion)}`} palette={palette} />}
      open={<Action Icon={MessagesSquare} label={`افتح ${entry.heading}`} onPress={open} palette={palette} />}
      source={sourcesOf([compiledSource(entry)])}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ color: palette.ink, fontSize: 19, lineHeight: 36, textAlign: 'right' }}>{entry.text}</Text>
      </View>
    </Post>
  );
}

/** Every hadith number of a Sahih, from its kitabs, for its card; drawn only once its text is on the phone. */
const sahihNumbers = (slug: SahihSlug) => SAHIH[slug].kitabs.flatMap(kitab => (kitab.from ? Array.from({ length: kitab.to - kitab.from + 1 }, (_, i) => String(kitab.from + i)) : []));

/**
 * A hadith of Sahih al-Bukhari or Sahih Muslim whole (owner's sketch, 2026-11-19): the head names the book and its kitab › bab
 * (in Muslim the bab is al-Nawawi's, and says so), the hadith drawn as its page draws it; its open button opens its page.
 */
function SahihPost({ slug, id, palette }: { slug: SahihSlug; id: string; palette: Palette }) {
  const { text } = useSahihText(slug);
  const book = SAHIH[slug];
  const found = text ? findHadith(text, Number(id)) : undefined;
  const place = placeOf(book, Number(id));
  // A number Abd al-Baqi gives a record printed under another shows that record.
  if (!found || !place) return null;
  const open = () => toTab({ pathname: '/hadith-sahih', params: { book: slug, n: id } });
  const where = `${place.kitab.title}${place.bab?.title ? ` › ${place.bab.title}` : ''}${book.headingsBy === 'nawawi' && place.bab?.title ? ' (تبويب النووي)' : ''}`;
  return (
    <Post palette={palette} head={<PostHead Icon={MessagesSquare} title={`من ${book.title}`} sub={where} palette={palette} />}
      open={<Action Icon={MessagesSquare} label={`افتح ${book.title} ${num(Number(id))}`} onPress={open} palette={palette} />}
      source={sourcesOf([{ book: book.title, author: slug === 'bukhari' ? 'البخاري' : 'مسلم' }])}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <SahihHadithView book={book} hadith={found.hadith} palette={palette} />
      </View>
    </Post>
  );
}

/**
 * «من أخرجه» (owner, 2026-11-19; sketch /mnt/project-files/hadith-sciences, frame 3b): the start of one of the Forty al-Nawawi
 * takes whole from the Sahihayn and the drawing of the places that record it. Its open button opens its page.
 */
function RecordedPost({ id, palette }: { id: string; palette: Palette }) {
  const entry = FEED_FORTY.find(each => String(each.n) === id);
  if (!entry) return null;
  const open = () => toTab({ pathname: '/hadith-forty', params: { n: String(entry.n) } });
  return (
    <Post palette={palette} head={<PostHead Icon={Network} title="من أخرجه" sub={`${entry.heading}، ${fromCompanion(entry.companion)}`} palette={palette} />}
      open={<Action Icon={MessagesSquare} label={`افتح ${entry.heading}`} onPress={open} palette={palette} />}
      source={sourcesOf(uniqueSources([...entry.records.map(recordSource), compiledSource(entry)]))}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
        <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>{entry.text}</Text>
        <HadithBooks top={entry.heading} boxes={recordedIn(entry)} namer={compilerOf(entry).name} palette={palette} />
      </View>
    </Post>
  );
}

/** The hadith of the feed with a chain al-Bukhari's record draws, for «من الإسناد». */
const FEED_CHAINS = FEED_FORTY.filter(entry => drawnBukhari(entry));

/**
 * «من الإسناد» (owner, 2026-11-19; plan /mnt/project-files/hadith-sciences, feature 1): al-Bukhari's chain for one of the
 * Forty as the hadith's page draws it («الرسم»), the start of the saying under it; its open button opens the page.
 */
function IsnadPost({ id, palette }: { id: string; palette: Palette }) {
  const entry = FEED_CHAINS.find(each => String(each.n) === id);
  const record = entry && drawnBukhari(entry);
  if (!entry || !record) return null;
  const open = () => toTab({ pathname: '/hadith-forty', params: { n: String(entry.n) } });
  return (
    <Post palette={palette} head={<PostHead Icon={GitCommitVertical} title="من الإسناد" sub={`${entry.heading}، ${fromCompanion(entry.companion)}`} palette={palette} />}
      open={<Action Icon={MessagesSquare} label={`افتح ${entry.heading}`} onPress={open} palette={palette} />}
      source={sourcesOf([recordSource(record)])}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
        <Isnad isnad={record.isnad!} palette={palette} />
        <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>{record.text.slice(record.isnadEnd)}</Text>
      </View>
    </Post>
  );
}

/** The lines of a term's definition a card shows before its page. */
const TERM_LINES = 5;

/**
 * A balagha term (owner, 2026-11-18): its name, its definition in the scholar's words, and one of al-Suyuti's examples with
 * the words he quotes lit. The first button opens the term's page; the second, the list of terms.
 */
function TermPost({ id, day, palette }: { id: string; day: number; palette: Palette }) {
  const term = balaghaTerms.terms.find(each => each.name === id);
  const examples = useMemo(() => (term ? examplesOf(itqan, term) : []), [term]);
  if (!term) return null;
  const name = plainName(term.name);
  const quote = term.quotes[0];
  const example = examples[day % Math.max(examples.length, 1)];
  const open = () => toTab({ pathname: '/term', params: { name: term.name } });
  return (
    <Post palette={palette} head={<PostHead Icon={Gem} title="من مصطلحات البلاغة" sub={quote.book === 'itqan' ? 'الإتقان للسيوطي' : 'تلخيص المفتاح للقزويني'} palette={palette} />}
      open={<Action Icon={Gem} label={`${name}: تعريفه وأمثلته`} onPress={open} palette={palette} />}
      actions={<Action Icon={ListTree} label="مصطلحات البلاغة" onPress={() => toTab('/terms')} palette={palette} />}
      source={sourcesOf([termSource(quote)])}>
      <View style={{ paddingHorizontal: 14, paddingVertical: 12, gap: 6 }}>
        <Text style={{ color: palette.ink, fontSize: 24, textAlign: 'right' }}>{name}</Text>
        {!term.defines && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{quotesTitle(term)}</Text>}
        <BookWords text={quote.text} palette={palette} lines={TERM_LINES} size={18} />
        {example && <>
          <View style={{ height: 1, backgroundColor: palette.rule, opacity: 0.6, marginVertical: 4 }} />
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>من أمثلته</Text>
          <View pointerEvents="none"><ExampleAyat example={example} palette={palette} /></View>
          <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{ayatName(example.ayat)}</Text>
        </>}
      </View>
    </Post>
  );
}

/** Every battle's moments, in the battles' order, for the moment card. */
const MOMENTS = (momentBattles as AppMomentBattle[]).flatMap(battle => battle.moments.map((moment, i) => ({ battle, moment, n: i + 1 })));
const momentId = (item: (typeof MOMENTS)[number]) => momentItem(item.battle.slug, item.n);

/** A moment of a battle in the source's words (owner, 2026-11-18); its open button opens the battle's page. */
function MomentPost({ id, palette }: { id: string; palette: Palette }) {
  const item = MOMENTS.find(each => momentId(each) === id);
  if (!item) return null;
  const { battle, moment, n } = item;
  const open = () => { continueAfter('moment', id); toTab({ pathname: '/battle', params: { slug: battle.slug } }); };
  return (
    <Post palette={palette} head={<PostHead Icon={Swords} title={`من ${battle.name}`} sub={battleLine(battle)} palette={palette} />}
      open={<Action Icon={Swords} label={`افتح ${battle.name}`} onPress={open} palette={palette} />}
      source={sourcesOf([citeSource({ text: '', cite: moment.cite, url: moment.url })])}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}><Moment moment={moment} n={n} palette={palette} plain /></View>
    </Post>
  );
}

/** Each ayah card's list of ayat, read once when first asked for. */
const noteLists: Partial<Record<AyahNote, string[]>> = {};
const noteList = (kind: AyahNote) => (noteLists[kind] ??= kind === 'tafsir' ? singleAyahPassages() : kind === 'balagha' ? itqanSureAyat(itqan)
  : kind === 'qiraat' ? qiraatAyat() : allAyat(surahCounts.map(surah => surah.numberOfAyat)));
const NOTE_HEADS: Record<AyahNote, { Icon: IconType; title: string; open: string }> = {
  tafsir: { Icon: BookOpen, title: 'من التفسير', open: 'التفسير كاملًا' },
  balagha: { Icon: Sparkles, title: 'من البلاغة', open: 'البلاغة كاملة' },
  irab: { Icon: ListTree, title: 'من الإعراب', open: 'إعراب الآية' },
  qiraat: { Icon: Layers, title: 'من القراءات', open: 'القراءات كاملة' },
};
/** The lines of a book's words a card shows; the row's open button shows them all. */
const NOTE_LINES = 4;

/**
 * An ayah with a little of what a book says on it (owner, 2026-11-18: small cards, the whole text one tap away): al-Sa'di on
 * an ayah he explains alone, al-Suyuti's balagha paragraph on an ayah he surely names, a word's i'rab, or the readings. Its
 * open button, the one control (owner, 2026-11-20), opens the reader's own sheet for it: the whole tafsir, balagha or i'rab,
 * or every reading of the ayah. A card whose book is not on the phone is left out.
 */
/** The book a note card reads from is on (the readings are built in). */
const noteBookOn = (kind: AyahNote) => (kind === 'tafsir' ? bookState('sadi') === 'on' : kind === 'balagha' ? bookState('itqan') === 'on' : kind === 'irab' ? bookState('irab-words') === 'on' : true);

const AyahNotePost = memo(function AyahNotePost({ kind, id, day, palette }: { kind: AyahNote; id: string; day: number; palette: Palette }) {
  useBooks();
  const on = noteBookOn(kind);
  const note = useMemo(() => noteBody(kind, id, day, kind === 'irab' ? ayahMushafWords(id) : []), [kind, id, day]);
  const [open, setOpen] = useState(false);
  // The sheet stays while it is open, even when its book is taken off the phone from inside it.
  if (!note || (!on && !open)) return null;
  const [surah, number] = note.key.split(':').map(Number);
  const head = NOTE_HEADS[kind];
  const show = () => setOpen(true);
  const close = () => setOpen(false);
  return (
    <>
      {on && <Post palette={palette} head={<PostHead Icon={head.Icon} title={head.title} sub={`${shortNames[surah] ?? ''} ${num(number)}`} palette={palette} />}
        open={<Action Icon={head.Icon} label={head.open} onPress={show} palette={palette} />}
        source={sourcesOf(note.sources)}>
        {'readings' in note ? <View style={{ paddingVertical: 10 }}><QiraatPlace ayah={note.key} max={2} lines bare palette={palette} /></View> : <View style={{ paddingVertical: 10, gap: 6 }}>
          <View pointerEvents="none" style={{ paddingHorizontal: 12 }}>
            <AyahLines ayah={note.key} palette={palette} shown whole write={null} checked={null} />
          </View>
          <View style={{ height: 1, backgroundColor: palette.rule, marginHorizontal: 14, opacity: 0.6 }} />
          {'heading' in note && note.heading ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right', paddingHorizontal: 14 }}>{note.heading}</Text> : null}
          {'text' in note && <>
            <Text numberOfLines={NOTE_LINES} style={{ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'right', writingDirection: 'rtl', paddingHorizontal: 14 }}>
              {tafsirRuns(note.text).map((run, i) => (run.quran ? <QuranWords key={i} style={{ color: palette.accent }}>{run.text}</QuranWords> : run.text))}
            </Text>
          </>}
          {'word' in note && <View style={{ paddingHorizontal: 14, gap: 2 }}>
            <QuranWord look={{ color: palette.accent }} place={{ textAlign: 'right' }}>{note.shown}</QuranWord>
            <Text style={{ color: palette.ink, fontSize: 19, lineHeight: 31, textAlign: 'right' }}>{note.role}</Text>
            <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>{note.morph}</Text>
          </View>}
        </View>}
      </Post>}
      {(kind === 'tafsir' || kind === 'qiraat') && <AyahPreviewSheet preview={open ? { kind: kind === 'tafsir' ? 'tafsir' : 'readings', key: note.key } : null} onClose={close} palette={palette} />}
      {kind === 'balagha' && <BalaghaSheet ayah={open ? note.key : null} onClose={close} palette={palette} />}
      {kind === 'irab' && 'word' in note && <IrabSheet target={open ? { key: note.key, word: note.word } : null} onClose={close} palette={palette} />}
    </>
  );
});

/** Every virtue of the converted people, read once: the «من التراجم» card's list. */
let virtues: { person: (typeof PEOPLE)[number]; index: number }[] | undefined;
const virtueList = () => (virtues ??= allVirtues(PEOPLE));
const virtueOf = (id: string) => virtueList().find(each => virtueItem(each.person.slug, each.index) === id);
const nameLists: Partial<Record<'laqab' | 'kunya', NameFact[]>> = {};
const nameList = (kind: 'laqab' | 'kunya') => (nameLists[kind] ??= kind === 'laqab' ? laqabFacts(PEOPLE) : kunyaFacts(PEOPLE));
const nameId = (each: NameFact) => nameItem(each.person.slug, each.name);

/** The content cards drawn from a list (pairs and trees have their own picks): each kind's items, by a lasting id. */
const NOTE_OF: Record<string, AyahNote> = { 'note-tafsir': 'tafsir', 'note-qiraat': 'qiraat', 'note-irab': 'irab', 'note-balagha': 'balagha' };
const itemLists: Partial<Record<ListKind, readonly string[]>> = {};
const LIST_OF: Record<ListKind, () => readonly string[]> = {
  'note-tafsir': () => noteList('tafsir'), 'note-qiraat': () => noteList('qiraat'), 'note-irab': () => noteList('irab'), 'note-balagha': () => noteList('balagha'),
  term: () => balaghaTerms.terms.map(term => term.name),
  // The chosen iltifat examples left «مشاهد» on the phone (owner, 2026-11-21); the website keeps them for now.
  scene: () => [],
  mashahid: () => [DARK_SEA_KEY],
  hadith: () => FEED_FORTY.map(entry => String(entry.n)),
  bukhari: () => sahihNumbers('bukhari'),
  muslim: () => sahihNumbers('muslim'),
  rajab: () => RAJAB_PASSAGES.map(rajabId),
  recorded: () => FEED_FORTY.map(entry => String(entry.n)),
  isnad: () => FEED_CHAINS.map(entry => String(entry.n)),
  prophets: () => STORY_GROUPS.map(group => storyItem(group.slug, group.phase)),
  sira: () => STORIES.filter(story => story.reports[0]).map(story => story.slug),
  moment: () => MOMENTS.map(momentId),
  tarajim: () => virtueList().map(each => virtueItem(each.person.slug, each.index)),
  tie: () => tiePairs().map(pair => tieItem(pair.a, pair.b)),
  laqab: () => nameList('laqab').map(nameId),
  kunya: () => nameList('kunya').map(nameId),
  life: lifePeople,
  nasab: () => nasabPeople(PEOPLE),
  ties: () => tiesPeople(PEOPLE, GRAPH),
  battle: () => battleItems(BATTLES),
  'battle-year': () => battleYearItems(BATTLES),
  'battle-armies': () => armiesItems(BATTLES),
  'hadith-scene': () => sceneItems(HADITH.units),
  opening: () => openingItems(openingList()),
  oath: () => oathItems(oathList()),
  event: () => eventItems(STORY_EVENTS),
  'surah-aim': aimItems,
  'surah-link': linkItems,
};
const itemsOf = (kind: ListKind) => (itemLists[kind] ??= LIST_OF[kind]());

/**
 * A story opened from the feed continues (owner, 2026-11-19): that kind's next card is the one after it in the list (the
 * next phase of a prophet's story, the next moment of the battle, the next sira story), before the day's turn goes on.
 */
const continued = new Map<string, string>();
const continuedListeners = new Set<() => void>();
let continuedVersion = 0;
function continueAfter(kind: ListKind, item: string) {
  continued.set(kind, item);
  continuedVersion++;
  continuedListeners.forEach(listener => listener());
}
const subscribeContinued = (listener: () => void) => { continuedListeners.add(listener); return () => { continuedListeners.delete(listener); }; };
const readContinued = () => continuedVersion;

/** One content card by its kind and item: the card's own post, as it shows in the feed and when saved. */
function ContentPost({ kind, item, day, palette }: { kind: ListKind; item: string; day: number; palette: Palette }) {
  if (kind in NOTE_OF) return <AyahNotePost kind={NOTE_OF[kind]} id={item} day={day} palette={palette} />;
  switch (kind) {
    case 'term': return <TermPost id={item} day={day} palette={palette} />;
    case 'mashahid': return <ScenePost id={item} palette={palette} />;
    case 'hadith': return <HadithPost id={item} palette={palette} />;
    case 'rajab': return <RajabPost id={item} palette={palette} />;
    case 'bukhari': case 'muslim': return <SahihPost slug={kind} id={item} palette={palette} />;
    case 'recorded': return <RecordedPost id={item} palette={palette} />;
    case 'isnad': return <IsnadPost id={item} palette={palette} />;
    case 'prophets': { const at = item.lastIndexOf('-'); return <StoryPost slug={item.slice(0, at)} phase={Number(item.slice(at + 1))} palette={palette} />; }
    case 'sira': return <SiraPost id={item} palette={palette} />;
    case 'moment': return <MomentPost id={item} palette={palette} />;
    case 'tarajim': return <TarajimPost id={item} palette={palette} />;
    case 'tie': return <TiePost id={item} palette={palette} />;
    case 'laqab': case 'kunya': return <NamePost kind={kind} id={item} palette={palette} />;
    case 'life': return <LifePost slug={item} palette={palette} />;
    case 'nasab': return <NasabPost slug={item} palette={palette} />;
    case 'ties': return <TiesPost slug={item} palette={palette} />;
    case 'battle': return <BattlePost slug={item} palette={palette} />;
    case 'battle-year': return <BattleYearPost id={item} palette={palette} />;
    case 'battle-armies': return <ArmiesPost id={item} palette={palette} />;
    case 'hadith-scene': return <HadithScenePost id={item} palette={palette} />;
    case 'opening': return <OpeningCardPost id={item} palette={palette} />;
    case 'oath': return <OathPost id={item} palette={palette} />;
    case 'event': return <EventPost id={item} palette={palette} />;
    case 'surah-aim': return <SurahAimPost id={item} palette={palette} />;
    case 'surah-link': return <SurahLinkPost id={item} palette={palette} />;
    default: return null;
  }
}

/** A saved feed card (owner, 2026-11-19: every card can be saved), drawn as it was in the feed; null when the data no longer holds it. */
export function SavedFeedCard({ id, palette }: { id: string; palette: Palette }) {
  const card = cardOfBookmark(id);
  const { day } = useToday();
  if (!card || !(LIST_KINDS as readonly string[]).includes(card.kind) || !itemsOf(card.kind as ListKind).includes(card.item)) return null;
  const kind = card.kind as ListKind;
  const menu: CardMenu = { kind, item: card.item, interest: interestOf(kind)?.id ?? '', savedOnly: true };
  return <CardMenuContext.Provider value={menu}><ContentPost kind={kind} item={card.item} day={day} palette={palette} /></CardMenuContext.Provider>;
}

/** The interest's line over a card from outside the reader's interests, with a button to add it. */
function SurpriseLine({ interest, added, palette }: { interest: string; added: boolean; palette: Palette }) {
  const name = interestById(interest)?.name ?? '';
  // Once added the line stays, saying so, so the card under it does not move.
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 }}>
      <Text style={{ flex: 1, color: palette.muted, fontSize: 13, textAlign: 'right' }}>{added ? `أُضيف «${name}» إلى اهتماماتك` : `من غير اهتماماتك: ${name}`}</Text>
      <Button Icon={added ? Check : Plus} label={added ? 'تراجع' : 'أضفه'} accessibilityLabel={added ? `أزل «${name}» من اهتماماتي` : `أضف «${name}» إلى اهتماماتي`}
        onPress={() => pickedInterests.write(toggledInterest(pickedInterests.read(), interest))} />
    </View>
  );
}

/** In a card's place after «ليس من اهتماماتي»: what was taken out, and a button to put it back. */
function RemovedLine({ interest, onUndo, palette }: { interest: string; onUndo: () => void; palette: Palette }) {
  const name = interestById(interest)?.name ?? '';
  return (
    <Card palette={palette} dashed pad={[8, 12]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ flex: 1, color: palette.ink, fontSize: 15, textAlign: 'right' }}>{`أُزيل «${name}» من اهتماماتك`}</Text>
        <Button label="تراجع" variant="plain" onPress={() => { pickedInterests.write(restoredInterest(pickedInterests.read(), interest)); onUndo(); }} />
      </View>
    </Card>
  );
}

/** About how many cards come at a time, as the page opens and each time it nears the end: a round of every interest. */
const STEP_CARDS = INTERESTS.length;

/**
 * The home feed (owner, 2026-11-19): the reader's own cards at the top (a forgotten ayah that is due, today's juz, the prayer
 * when near), then rounds, each one card from every interest picked (shared/interests.ts, shared/homeFeed.ts feedRound),
 * content and questions taking turns, with a saved item and the books now and then; more rounds as the page nears its end.
 * `only` shows one interest's cards alone (the chip row over the feed). What was shown before is skipped (shared/feedSeen.ts);
 * once all was seen it starts again from the seen ones. A question answered wrong comes back after a rest.
 */
export function Feed({ palette, nearEnd, screenBottom, only = null }: { palette: Palette; nearEnd: number;
  /** Where the bottom of the screen is in the page, for a card that comes while the feed is open (the prayer card). */
  screenBottom: () => number;
  /** One interest's id: its cards alone. */
  only?: string | null }) {
  const { day, juz } = useToday();
  const now = useMinute();
  const visit = useSyncExternalStore(subscribeVisit, visitStart, serverVisit);
  // A new visit (pulled to refresh, or back after long away), or another chip, starts again from one round.
  const view = `${visit}|${only ?? ''}`;
  const [more, setMore] = useState({ view, batches: 0 });
  useEffect(() => {
    if (nearEnd) setMore(now => ({ view, batches: (now.view === view && now.batches ? now.batches : step) + step }));
  }, [nearEnd]); // eslint-disable-line react-hooks/exhaustive-deps -- only a new signal asks for more
  const seen = useSyncExternalStore(subscribeFeedSeen, readFeedSeen);
  const bookmarks = readBookmarks();
  // The saved items as they were when the visit began, so saving or unsaving a card does not move the cards on screen.
  const saved = useMemo(() => shownBookmarks(bookmarks).filter(item => !isCardBookmark(item.id)), [visit]); // eslint-disable-line react-hooks/exhaustive-deps -- read once a visit
  const savedCards = useMemo(() => shownBookmarks(bookmarks).filter(item => isCardBookmark(item.id)), [visit]); // eslint-disable-line react-hooks/exhaustive-deps -- read once a visit
  const due = useSyncExternalStore(subscribeDueMarks, readDueMarks);
  const forgotten = mostForgotten(due)[0];
  // The settings under «ما أحفظه»: questions come from the memorized range, pondering puts it first.
  const memorized = useSyncExternalStore(subscribeMemorized, readMemorized);
  const questions = useSyncExternalStore(memorizedQuestions.subscribe, memorizedQuestions.read);
  const prefer = useSyncExternalStore(memorizedPrefer.subscribe, memorizedPrefer.read);
  const recall = useMemo(() => (memorized ? recallOfDay(questions ? memorized : { all: true }, day) : undefined), [memorized, questions, day]);
  // The interests as they were when the visit began (a change in settings starts a new visit); one taken out from a card's
  // menu leaves the cards on screen in place, its own replaced by a line to put it back.
  const picked = useSyncExternalStore(pickedInterests.subscribe, pickedInterests.read, pickedInterests.server);
  const surprise = useSyncExternalStore(surpriseMe.subscribe, surpriseMe.read, surpriseMe.server);
  // A note card whose book is off (or still loading) is passed over, and not counted as seen.
  useBooks();
  const frozen = useMemo(() => ({ picked, surprise }), [visit]); // eslint-disable-line react-hooks/exhaustive-deps -- read once a visit
  const { active, others } = useMemo(() => {
    if (only) return { active: INTERESTS.filter(interest => interest.id === only), others: [] };
    const chosen = activeInterests(frozen.picked);
    return { active: chosen, others: frozen.surprise && frozen.picked.length ? INTERESTS.filter(interest => !chosen.includes(interest)) : [] };
  }, [frozen, only]);
  // Rounds of few interests are short: as many rounds at a time as make about a round of all, and the books and a saved
  // item come once in each such step, not in every short round.
  const step = Math.max(1, Math.ceil(STEP_CARDS / (active.length + (others.length ? 1 : 0))));
  const batches = more.view === view && more.batches ? more.batches : step;
  // Cards taken out from their menu this visit, by key; each leaves a line in its place, the others stay as they are.
  const [removed, setRemoved] = useState<{ visit: number; keys: ReadonlySet<string> }>({ visit, keys: new Set() });
  const removedKeys = removed.visit === visit ? removed.keys : new Set<string>();
  const showing = new Set(activeInterests(picked).map(interest => interest.id));
  const rounds = useMemo(() => Array.from({ length: batches }, (_, round) => feedRound(active, round, day, others)), [active, others, batches, day]);
  // The questions answered wrong that are due again, as they were when the visit began.
  const missed = useMemo(() => ({ list: readMissed(), at: Date.now() }), [visit]); // eslint-disable-line react-hooks/exhaustive-deps -- read once a visit
  // Back after a long time in the background: a new visit, so what was shown before counts as seen (shared/feedSeen.ts).
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => (state === 'active' ? backToVisit() : leftVisit()));
    return () => listener.remove();
  }, []);
  // How many of each kind the rounds hold, in order.
  const counts = useMemo(() => {
    const count: Record<string, number> = {};
    for (const slot of rounds.flat()) count[slot.kind] = (count[slot.kind] ?? 0) + 1;
    return count;
  }, [rounds]);
  // The cards already shown stay in place as more come; a new visit, day, chip or setting picks afresh.
  const shownPairs = useRef<{ reset?: unknown[]; list: NonNullable<ReturnType<typeof pairOfDayNumber>>[] }>({ list: [] }).current;
  const shownTrees = useRef<{ reset?: unknown[]; list: NonNullable<ReturnType<typeof treeOfDay>>[] }>({ list: [] }).current;
  const pairs = useMemo(() => growingPicks(shownPairs, [view, day, prefer, memorized], offset => pairOfDayNumber(day + offset), pair => pair.id, seen, counts.pair ?? 0,
    { since: visit, prefer: prefer ? pair => touchesMemorized(pair.sides.flatMap(sideKeys), memorized) : undefined }), [day, counts.pair, seen, prefer, memorized, visit, view, shownPairs]);
  const trees = useMemo(() => growingPicks(shownTrees, [view, day, prefer, memorized], offset => treeOfDay(day, offset), piece => piece.id, seen, counts.tree ?? 0,
    { since: visit, prefer: prefer ? piece => touchesMemorized(piece.keys, memorized) : undefined }), [day, counts.tree, seen, prefer, memorized, visit, view, shownTrees]);
  const holders = useRef<Partial<Record<ListKind, { reset?: unknown[]; list: string[] }>>>({}).current;
  const turn = useSyncExternalStore(subscribeContinued, readContinued);
  const items = useMemo(() => {
    const out: Partial<Record<ListKind, string[]>> = {};
    LIST_KINDS.forEach(kind => {
      const need = counts[kind] ?? 0;
      if (!need) return;
      const list = itemsOf(kind);
      const start = listStart(list, kind, day, continued.get(kind));
      out[kind] = growingPicks(holders[kind] ??= { list: [] }, [view, day], offset => list[(start + offset) % list.length], item => `${kind}:${item}`, seen, need,
        { since: visit, tries: list.length });
    });
    return out;
  }, [counts, day, seen, view, visit, holders, turn]); // eslint-disable-line react-hooks/exhaustive-deps -- `turn` tells a story was opened
  const posts: React.ReactNode[] = [];
  // Only what is drawn counts as seen (a note whose book is off draws nothing).
  const rendered: string[] = [];
  const used: Record<string, number> = {};
  const next = (kind: string) => { const at = used[kind] ?? 0; used[kind] = at + 1; return at; };
  for (let round = 0; round < batches; round++) {
    if (round === 0 && !only) {
      if (forgotten) posts.push(<ForgottenPost key={`ask${forgotten}`} ayah={forgotten} review={() => reviewForgotten(forgottenOrder(Object.keys(due)))} palette={palette} />);
      else if (recall) posts.push(<ForgottenPost key={`ask${recall}`} ayah={recall} palette={palette} />);
      if (hasJuzCard(round) && juz) posts.push(<JuzPost key={`j${day}`} palette={palette} />);
    }
    rounds[round].forEach((slot: FeedSlot) => {
      const at = next(slot.kind);
      let key: string;
      let post: React.ReactNode = null;
      let item: string | undefined;
      if (slot.quiz) {
        const kind = slot.kind as FeedQuizKind;
        const seed = dueSeeds(missed.list, kind, missed.at)[at] ?? feedQuizSeed(day, round);
        key = `q${kind}-${seed}-${round}`;
        post = <FeedQuiz kind={kind} seed={seed} palette={palette} />;
      } else if (slot.kind === 'pair') {
        const pair = pairs[at];
        key = `p${pair?.id ?? at}`;
        item = pair?.id;
        post = pair ? <PairPost pair={pair} palette={palette} /> : null;
      } else if (slot.kind === 'tree') {
        const piece = trees[at];
        key = `t${piece?.id ?? at}`;
        item = piece?.id;
        post = piece ? <TreePost piece={piece} palette={palette} /> : null;
      } else {
        item = items[slot.kind as ListKind]?.[at];
        key = `${slot.kind}:${item ?? at}`;
        const note = NOTE_OF[slot.kind];
        post = item !== undefined && (!note || noteBookOn(note)) && (!isSahihSlug(slot.kind) || bookState(slot.kind) === 'on') ? <ContentPost kind={slot.kind as ListKind} item={item} day={day} palette={palette} /> : null;
      }
      if (!post) return;
      if (removedKeys.has(key)) {
        posts.push(<RemovedLine key={key} interest={slot.interest} palette={palette}
          onUndo={() => setRemoved({ visit, keys: new Set([...removedKeys].filter(each => each !== key)) })} />);
        return;
      }
      rendered.push(...(item !== undefined && !slot.quiz ? [slot.kind === 'pair' || slot.kind === 'tree' ? item : `${slot.kind}:${item}`] : []));
      const menu: CardMenu = {
        kind: slot.kind, item, interest: slot.interest, surprise: slot.surprise,
        // Not on the only interest left (none picked means all), on one interest's own view, nor on one already taken out.
        notMine: only || !showing.has(slot.interest) || showing.size === 1 ? undefined : () => {
          setRemoved({ visit, keys: new Set([...removedKeys, key]) });
          pickedInterests.write(activeInterests(pickedInterests.read()).map(each => each.id).filter(id => id !== slot.interest));
        },
      };
      posts.push(
        <CardMenuContext.Provider key={key} value={menu}>
          {slot.surprise ? <View style={{ gap: 4 }}><SurpriseLine interest={slot.interest} added={picked.includes(slot.interest)} palette={palette} />{post}</View> : post}
        </CardMenuContext.Provider>,
      );
    });
    if (!only && round % step === step - 1) {
      const at = (round + 1) / step - 1;
      const savedItem = savedOfSlot([...saved, ...savedCards], day, at);
      if (savedItem) posts.push(<SavedPost key={`b${savedItem.id}-${at}`} item={savedItem} palette={palette} />);
      if (hasBooksCard(at)) posts.push(<BooksPost key={`k${day}-${at}`} day={day} palette={palette} />);
    }
  }
  if (!only && isKahfDay(now)) posts.splice(Math.min(KAHF_SLOT, posts.length), 0, <KahfPost key={`kahf${day}`} palette={palette} />);
  // Pair ids hold «|», so the list is kept on lines.
  const renderedKey = rendered.join('\n');
  useEffect(() => { if (renderedKey) markFeedSeen(renderedKey.split('\n')); }, [renderedKey]);
  // A prayer that is near comes in once, before the first post below the screen, so what the reader looks at stays put (owner,
  // 2026-11-18). One near when home opens leads the feed. A card the reader has passed or is looking at stays; one still
  // below the screen gives way to the next prayer's.
  const soon = usePrayerSoon();
  const [cards, setCards] = useState<(Soon & { after: string | null })[]>(() => (soon ? [{ ...soon, after: null }] : []));
  const top = useRef(0);
  const tops = useRef(new Map<string, number>());
  const keys = posts.map(post => String((post as React.ReactElement).key));
  useEffect(() => {
    if (!soon || cards.some(card => card.key === soon.key)) return;
    const bottom = screenBottom();
    const below = (key: string) => (tops.current.get(key) ?? Infinity) + top.current >= bottom;
    const at = insertAt(keys.map(key => (tops.current.get(key) ?? Infinity) + top.current), bottom);
    setCards(now => [...now.filter(card => !below(`pr${card.key}`)), { ...soon, after: at ? keys[at - 1] : null }]);
  }, [soon?.key]); // eslint-disable-line react-hooks/exhaustive-deps -- once for each prayer
  // A new visit starts the feed again from the top, with the prayer that is near now leading it.
  const [cardsVisit, setCardsVisit] = useState(visit);
  if (cardsVisit !== visit) { setCardsVisit(visit); setCards(soon ? [{ ...soon, after: null }] : []); }
  for (const card of only ? [] : cards) {
    const at = card.after === null ? 0 : keys.indexOf(card.after) + 1;
    posts.splice(at, 0, <PrayerPost key={`pr${card.key}`} prayer={card.prayer} times={card.times} palette={palette} />);
    keys.splice(at, 0, `pr${card.key}`);
  }
  return (
    <View style={{ gap: 14 }} onLayout={event => { top.current = event.nativeEvent.layout.y; }}>
      {posts.map((post, i) => (
        <View key={keys[i]} onLayout={event => { tops.current.set(keys[i], event.nativeEvent.layout.y); }}>{post}</View>
      ))}
    </View>
  );
}
