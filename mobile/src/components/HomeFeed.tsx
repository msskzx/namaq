import { createContext, isValidElement, memo, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AppState, Dimensions, useWindowDimensions, View } from 'react-native';
import { COLUMN_GAP, PageWidthProvider, usePageWidth } from '@/ui/column';
import { router, useFocusEffect, type Href } from 'expo-router';
import { CalendarRange, ChartNoAxesColumn, Bookmark, Check, CircleCheck, CircleMinus, Clock, Compass, EyeOff, LibraryBig, Network, Plus, LightbulbOff, ListTree, Scale, TextAlignEnd, Swords, Users, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks, type Bookmark as SavedItem } from '@shared/bookmarks';
import { compareBookmarkAyat, savedAs } from '@shared/compareBookmarks';
import { ayahBookmarkId, ayahHref, markAyah, markWord, markForgotten, toggleForgotten, mostForgotten, readAyahMarks, readDueMarks, rememberAyah, restoreMark, subscribeDueMarks, type AyahMark } from '@shared/ayahMarks';
import { toggleBookmark } from '@shared/bookmarks';
import { readGestures, type GestureAction } from '@shared/readerGestures';
import { isMemorized, memorizedPrefer, memorizedQuestions, readMemorized, recallOfDay, subscribeMemorized, touchesMemorized, withMemorizedScope } from '@shared/memorized';
import { FEED_QUIZ_NAMES, feedQuizSeed, OPENINGS, openingSurah, seededRandom, type FeedKind, type FeedQuizKind } from '@shared/quiz/feedQuiz';
import { answeredQuestion, dueSeeds, readMissed } from '@shared/quiz/missedQuestions';
import { activeInterests, INTERESTS, interestById, interestOf, pickedInterests, restoredInterest, surpriseMe, toggledInterest, type FeedCardKind } from '@shared/interests';
import { bookmarkKind, cardMenuSaveId, cardOfBookmark, isCardBookmark } from '@shared/bookmarkKind';
import { FORGOT, questionAyat, recited, RECITE_SNIPPET } from '@shared/quiz/choiceKinds';
import { PROPHET_NAMES } from '@shared/quiz/tarajim';
import type { QuizTopic } from '@shared/quiz/settings';
import { backToVisit, growingPicks, savedOfSlot, leftVisit, markFeedSeen, readFeedSeen, subscribeFeedSeen, subscribeVisit, visitStart, serverVisit } from '@shared/feedSeen';
import { allVirtues, feedBooks, LIST_KINDS, listStart, type ListKind, feedRound, hasBooksCard, hasJuzCard, inMinutes, insertAt, isKahfDay, KAHF_SLOT, prayerSoon, type FeedSlot } from '@shared/homeFeed';
import { pageSources, saidBy } from '@shared/tarajim';
import { DRAWING_OR_TEXT, type DrawingOrText } from '@shared/drawingText';
import Saying from '@/ui/Saying';
import { findPerson, GRAPH, PEOPLE, personName, tiePairs, unvowelled } from '@/lib/tarajim';
import { kunyaFacts, laqabFacts, type NameFact } from '@shared/tarajimNames';
import { chainSentence, groupWord } from '@shared/tarajimGraph';
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
import { counted, num } from '@shared/quran/arabicNumber';
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
import { armiesBattles, armiesItems, armiesSources, battleCardSources, battleItems, battleOnCard, battleYearItems, battleYearSlice, battleYearSources, type ArmiesTab, eventItems, eventOf, eventSources, nasabPeople, nasabSources, oathItems, oathSources, openingItems, openingSources, sceneItems, sceneOf, sceneSources, tiesPeople, tiesSources } from '@shared/drawingCards';
import { NasabTree } from '@/screens/nasab';
import { OpeningRows } from '@/screens/openings';
import TiesRing, { foldedKinds, personNode, RoundRing, ringName, ringRoom, roundLayout, TieSheet, tiesOf, DoubtedSheet } from './TiesRing';
import { kindColor } from './TiesChain';
import LifeColumns from './LifeColumns';
import { LifeSheet } from './LifeTimeline';
import { CALIPHS_MEET, groupItems, groupOf, groupSources, kinOf, livesPairs, meetItems, meetSources, ringList, stepSources, type GroupSource, type Ring } from '@shared/peopleCards';
import { lifeSources, type LifeItem } from '@shared/events/lifeTimeline';
import { nasabQuestions } from '@shared/quiz/tarajim';
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
import { REVIEW_LABEL, reviewForgotten } from './HomeCards';
import { forgottenOrder, reviewPosition, type RecitePosition } from '@shared/quran/recite';
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
import { openIntent, openTreesOf, openUtility, toTab, openAyahPage } from '@/lib/ways';
import OpenButton from '@/ui/OpenButton';
import { FEATURE_ICON, QUIZ_ICON } from './featureIcons';
import { juzLabel, openJuz } from '@/lib/juz';
import { around as aroundSetting, penRule, prayerPlace, prayerSettings } from '@/lib/settings';
import { timesFor, useMinute } from '@/lib/prayer';
import { bookState, useBooks } from '@/lib/books';
import { SAHIH, isSahihSlug, useSahihText } from '@/lib/sahih';
import { SahihHadithView } from '@/components/Sahih';
import { findHadith, placeOf, type SahihSlug } from '@shared/sahih';
import type { BookId } from '@shared/books';
import { BookCard, Shelf, TUHFA } from '@/screens/books';
import { DarkSeaActions, DarkSeaCard, darkSeaName, darkSeaSourceList, openDarkSea } from './DarkSea';
import { DARK_SEA_KEY } from '@shared/quran/scenes/darkSea';
import { prophetStory } from '@/lib/prophets';
import gharib from '@shared/data/quran/gharib';
import { wordsOf as gharibWordsOf } from '@shared/quran/gharib';
import { lemmasAtMushafWord } from '@shared/quran/words';
import { words as wordCounts } from '@/lib/words';
import { gharibSource } from './GharibSheet';
import LitAyat from './quran/text/LitAyat';
import BookRuns from './quran/text/BookRuns';
import { TUHFA_PASSAGES, tuhfaPassage } from '@shared/tajwid/passages';
import { TuhfaVerse } from '@/screens/tuhfa';
import { PROPHET_STORY } from '@shared/quiz/prophetStory';
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
import type { WordDifference } from '@shared/quran/qiraat';
import QuranWords from './quran/text/QuranWords';
import { momentItem, nameItem, rajabItem, storyItem, tieItem, virtueItem } from '@shared/feedItems';
import { useFitHeight } from '@/lib/useFit';
import { storyMap } from '@shared/quran/prophets/story';
import { STORY_GROUPS } from '@shared/quran/prophets/storyGroup';
import { check, DEFAULT_LIST, DEFAULT_SOLO, isCompare, isTree, pick, questionState, reveal, startSolo, typeAnswer, type SoloQuestion, type SoloRun } from '@/lib/quiz';
import { readAyah } from '@/lib/openReader';
import QuizChoice, { QuizPrompt } from './QuizChoice';
import { orderJuz } from '@shared/quiz/orderAnswer';
import { aimItems, aimSources, linkItems, linkSources, type OrderSurah } from '@shared/quran/surahOrder';
import { LinkWords, orderSurahList, SurahBody } from '@/components/OrderSurah';
import { CompareFeedback, CompareInputs } from './QuizCompare';
import { QuizFeedback, QuizInputs } from './QuizTree';
import { type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import PostHead from '@/ui/PostHead';
import Card, { CardWithRow } from '@/ui/Card';
import MoreMenu, { type MoreItem } from '@/ui/MoreMenu';
import RowScroll from '@/ui/RowScroll';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import CardShare from '@/ui/CardShare';
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
import { ADHKAR, type Dhikr } from '@shared/adhkar';
import { ADHKAR_TABS, adhkarSource } from '@shared/adhkarCite';
import { adhkarTimes, askedDhikr } from '@shared/quiz/adhkar';
import { openAdhkar } from '@/lib/adhkar';
import { DhikrBody } from './Adhkar';
import { QuranWord } from '@/components/quran/text/AyahFlow';

type IconType = (props: LucideProps) => React.ReactNode;

/** A post's icon button, as the compare card's row has them: muted, or in the accent when on. */
function Action({ Icon, label, on, onPress, tone, disabled }: { Icon: IconType; label: string; on?: boolean; onPress: () => void; palette: Palette; tone?: 'green'; disabled?: boolean }) {
  return <IconButton Icon={Icon} label={label} onPress={onPress} on={on} disabled={disabled} tone={tone} />;
}

/**
 * One of a card's two views at a time, swapped from the row under the card (owner, 2026-11-22: no switch inside a card): the
 * button names the other view, with its icon, and a tap shows it.
 */
function SwapButton<K extends string>({ options, value, onChange, Icons }: { options: readonly { key: K; label: string }[]; value: K;
  onChange: (key: K) => void; Icons: Record<K, IconType> }) {
  const other = options.find(option => option.key !== value) ?? options[0];
  return <Button pill label={other.label} Icon={Icons[other.key]} onPress={() => onChange(other.key)} />;
}

const DRAWING_ICONS: Record<DrawingOrText, IconType> = { drawing: Network, text: TextAlignEnd };
const ARMIES_ICONS: Record<ArmiesTab, IconType> = { field: Users, killed: Swords };

/**
 * Every feed post's one shape (owner, 2026-11-14 and 2026-11-20, like an Instagram post): the head, the body in one card,
 * the row of icon buttons under it grouped on the right (the open button, the card's tools, save, share) with the «⋯» of
 * «ليس من اهتماماتي» alone on the left, then the source line. The head opens the general topic; the row's open button this
 * card's own place. A reading card's body opens it too (`press`), nothing else's: a tap on a question or recall card must
 * not cut its answer (owner, 2026-11-23). A long card stops at two thirds of the screen, the rest in a sheet (ui/Card `cap`).
 */
function Post({ head, open, press, actions, share, picture, source, bar, palette, whole = false, children }: { head: React.ReactNode;
  /** Opens the item in its own reader (the mushaf at the ayah, the hadith in its book): first in the row. */
  open?: React.ReactNode;
  /**
   * The card itself as a button to the same place as `open` (owner, 2026-11-23: the reading cards, «تابع القراءة» and
   * «جزء اليوم», open the mushaf from a tap anywhere on the page slice), dimming while pressed as the head does. `label`
   * names the page for a screen reader, apart from the open button's own name.
   */
  press?: { onPress: () => void; label: string };
  actions?: React.ReactNode;
  /**
   * The card's share button, last of the group, after save. Left out, the card shares as it is (ui/CardShare, owner
   * 2026-11-22: every card shares); a card with its own share (a video, pictures) gives it, and `false` shares nothing.
   */
  share?: React.ReactNode | false;
  /** What the picture shows instead of the card as it is: the recall card shares its ayah whole, never the hiding. */
  picture?: { head: React.ReactNode; body: React.ReactNode };
  /** The books the card stands on, named on its source line; a `Reference` inside the card joins its sheet. */
  source?: Source[];
  /**
   * Never capped (owner, 2026-11-20): a question shows all its choices so it can be answered on the card, and a recall card
   * its whole ayah with one write box.
   */
  whole?: boolean;
  /** A bar of the feature's own under the card, on its own line above the buttons (recite mode's bar, on the recall card; owner 2026-11-23). */
  bar?: React.ReactNode; palette: Palette; children: React.ReactNode }) {
  // The card's save is named on the saved shelf by its head's title and line.
  const named = isValidElement<{ title?: string; sub?: string }>(head) ? [head.props.title, head.props.sub].filter(Boolean).join(' · ') : '';
  const menu = useNotMine();
  return (
    <View style={{ gap: 4 }}>
      {head}
      {/* What the card's content hands up with UnderCard joins the row under the card, before the post's own buttons; share stays last. */}
      <CardWithRow palette={palette} pad={0} clip cap={!whole} bar={bar} onPress={press?.onPress} accessibilityLabel={press?.label}
        lead={open} row={<>{actions}<SaveAction text={named} />{share === undefined
          ? <CardShare head={picture?.head ?? head} sources={source} palette={palette}>{picture?.body ?? children}</CardShare>
          : share || null}</>} menu={menu} source={source} sourceLine={sourceLine(palette)}>{children}</CardWithRow>
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

/** A head's topic: a page of the tabs (owner, 2026-11-22: every card's head opens the general topic it names). */
const topic = (href: Href, label: string) => ({ onPress: () => toTab(href), label });
/** A head that names a person opens the person. */
const personTopic = (slug: string) => ({ onPress: () => router.push({ pathname: '/person', params: { slug } }), label: `افتح ترجمة ${personName(GRAPH.nodes.get(slug)!)}` });
/** One of the Forty's cards opens its book: al-Nawawi's forty-two, or Ibn Rajab's eight after them. */
const fortyTopic = (n: number) => n > 42 ? topic({ pathname: '/hadith-book', params: { book: 'added' } }, 'افتح زيادات ابن رجب')
  : topic({ pathname: '/hadith-book', params: { book: 'forty' } }, 'افتح الأربعين النووية');

/** Where a post's ayat are, for its head: «البقرة ٦١ · آل عمران ٢١، ١١٢» (shared/quran/ayahPlaces.ts). */
const placesOf = (keys: string[]) => ayahPlaces(keys, shortNames);

/** A mushaf page as a card's source, its juz and page on the line: «المصحف · البقرة، الجزء ٣، الصفحة ٤٥» (owner, 2026-11-22). */
const mushafPage = (surah: number, page: number): QuizSource =>
  ({ book: MUSHAF_BOOK, at: `${SURAH_NAMES[surah]}، ${juzLabel([pageData(page).juz])}، الصفحة ${num(page)}` });
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
  // The juz beside the surah and date in the head, as on today's juz card; the row holds only buttons (owner, 2026-11-22).
  const where = [shortNames[surah], juzLabel([juz]), date?.replace(/ هـ$/, '')].filter(Boolean).join(' · ');
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.mushaf} title={fasila || page > 1 ? 'تابع القراءة' : 'ابدأ القراءة'} sub={where} open={topic('/quran', 'افتح القرآن')} palette={palette} />}
      open={<OpenButton label={`افتح المصحف ${fasila ? 'عند فاصلتك' : 'حيث توقفت'}، سورة ${shortNames[surah] ?? ''}`} onPress={read} palette={palette} />} press={{ onPress: read, label: `الصفحة ${num(page)} من المصحف` }}
      source={sourcesOf([mushafPage(surah, page)])}
      // Shared, the page alone: not where you stopped (owner's plan, 2026-11-22).
      picture={{ head: <PostHead Icon={FEATURE_ICON.mushaf} title={shortNames[surah] ?? ''} sub={juzLabel([juz])} palette={palette} />,
        body: <View style={{ paddingHorizontal: 12, paddingVertical: 6 }}><PageTop page={page} palette={palette} /></View> }}>
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
      <PostHead Icon={FEATURE_ICON.compare} title="آيتان متشابهتان" sub={`${sideLabel(a)} · ${sideLabel(b)}`} open={topic('/compare', 'افتح الآيات المتشابهة')} palette={palette} />
      <CompareCard card={pair} palette={palette} onOpen={compare} aside={<NotMineMenu />} />
      <SourceLine named={sources} sources={sources} palette={palette} />
    </View>
  );
});

/**
 * What the reader marked on a recall card while the app runs (owner, 2026-11-22: a card does not vanish on a tick): the
 * card stays where it is, its tick lit and the ayah shown, and a second tap takes the tick back (`before`: each mark it
 * touched as it was). On the next visit a marked card gives way to the next one.
 */
type Recalled = { did: 'remembered' | 'forgot'; before: Record<string, AyahMark | undefined>; visit: number };
const recalled = new Map<string, Recalled>();
/** The tick on this ayah's card in this visit; one from an earlier visit is over (its mark has moved on since). */
const recalledNow = (ayah: string) => { const entry = recalled.get(markAyah(ayah)); return entry?.visit === visitStart() ? entry : undefined; };
/** Whether the recall card asks to write the whole ayah (on) or reveals it word by word (off). */
const RECALL_WRITE = 'recall-write';

/**
 * An ayah to recall in the mushaf's own lines (AyahLines), asked as recite mode asks it (owner, 2026-11-14): what comes
 * before it shows, its words are hidden in their places, and recite mode's buttons reveal the next word or the whole ayah.
 * The pen switches to writing the whole ayah in write boxes (lib/useWriteBoxes); the last box shows the ayah with the
 * written words green or amber, and a mistake puts it on the forgotten shelf, as in the reader. A forgotten ayah that is due
 * comes with the review button and «تذكّرتها» rests it; an ayah of the day from what is memorized (`review` absent) has «نسيتها» too.
 * A due ayah hides all its forgotten words in their places at once, as the reader's review does (reviewPosition), and its
 * tick rests every one of them. The forgotten list draws one of these for each forgotten ayah (owner, 2026-11-23), with
 * its own `head`.
 */
export function ForgottenPost({ ayah: asked, review, due: dueOne, title = 'هل تذكرها؟', Icon = LightbulbOff, head: ownHead, palette }: { ayah: string; review?: () => void;
  /** A forgotten ayah due for review, with no review button: the forgotten list, whose cards are the review (owner, 2026-11-23). */
  due?: boolean; title?: string; Icon?: IconType; head?: { onPress: () => void; label: string }; palette: Palette }) {
  const ayah = markAyah(asked);
  const forgotten = dueOne ?? !!review;
  // Fixed when the card is drawn, so a tick taken back puts back the same marks it rested.
  const [keys, gaps] = useMemo(() => {
    if (!forgotten) return [[asked], markWord(asked) === undefined ? undefined : [markWord(asked)!]] as const;
    const due = readDueMarks();
    const own = Object.keys(due).filter(key => markAyah(key) === ayah);
    return [own.length ? own : [asked], reviewPosition(asked, due).gaps] as const;
  }, [asked, ayah, forgotten]);
  const [done, setDone] = useState(() => recalledNow(ayah));
  const [writing, setWriting] = useState(() => readJson(RECALL_WRITE, isBoolean) === true);
  const toggleWriting = () => setWriting(on => { writeJson(RECALL_WRITE, !on); return !on; });
  // One tick at a time: tapping the lit one takes it back, tapping the other moves it.
  const mark = (did: Recalled['did']) => {
    if (done) Object.entries(done.before).forEach(([key, before]) => restoreMark(key, before));
    if (done?.did === did) { recalled.delete(ayah); setDone(undefined); return; }
    const stored = readAyahMarks();
    const now: Recalled = { did, before: Object.fromEntries(keys.map(key => [key, stored[key]])), visit: visitStart() };
    if (did === 'forgot') keys.forEach(key => markForgotten(key));
    else if (forgotten) keys.forEach(key => rememberAyah(key));
    recalled.set(ayah, now);
    setDone(now);
  };
  const marks = <>
    {/* Worded, now that the recite bar has its own line (owner, 2026-11-23). */}
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Button pill label="تذكّرتها" Icon={done?.did === 'remembered' ? CircleCheck : Check} tone="green" active={done?.did === 'remembered'} onPress={() => mark('remembered')} />
      {!forgotten && <Button pill label="نسيتها" Icon={LightbulbOff} active={done?.did === 'forgot'} onPress={() => mark('forgot')} />}
    </View>
    {review && <Action Icon={EyeOff} label={REVIEW_LABEL} onPress={review} palette={palette} />}
  </>;
  const open = <OpenButton label="افتح صفحة الآية" onPress={() => openAyahPage(ayah)} palette={palette} />;
  // A due forgotten ayah's head opens the forgotten list; any other recall question's, the quizzes, as every question's does.
  const head = ownHead ?? (forgotten ? { onPress: () => router.push({ pathname: '/library', params: { tab: 'forgotten' } }), label: 'افتح ما نسيته' } : topic('/quizzes', 'افتح الاختبارات'));
  return <Recall key={`${ayah}-${writing}`} ayah={ayah} gaps={gaps} title={title} Icon={Icon} head={head} writing={writing} onWriting={toggleWriting} open={open} marks={marks} revealed={!!done} palette={palette} />;
}

/**
 * The recall card itself: recite mode on one ayah (recite/useRecite.ts, the mushaf's own), with its bar under the card. A
 * tap, double tap or long press on the ayah does what it does in recite mode (the reader's gesture settings); the pen writes
 * what the pen setting asks, and it stops at the ayah's end. Drawn afresh for each way of asking (`writing`).
 */
function Recall({ ayah, gaps, title, Icon, head, writing, onWriting, open, marks, revealed, palette }: { ayah: string; gaps?: readonly number[]; title: string; Icon: IconType; head: { onPress: () => void; label: string }; writing: boolean; onWriting: () => void; open: React.ReactNode; marks: React.ReactNode;
  /** Marked from the card («تذكّرتها», «نسيتها»): the ayah shows whole, as recite mode shows it once done. */
  revealed?: boolean; palette: Palette }) {
  const model = useMemo(() => { const page = pageOfAyah(ayah); return page ? pageModel(pageData(page), surahBefore(page)) : null; }, [ayah]);
  const [position, setPosition] = useState<RecitePosition>({ start: ayah, ...(gaps?.length ? { gaps: [...gaps] } : {}), shown: null, words: 0 });
  const [pen] = penRule.use();
  const recite = useRecite({ model, position, setPosition, writing, pen, until: ayah });
  const shown = recite.done || !!revealed;
  const run = (action: GestureAction, key: string | null) => {
    if (action === 'next-ayah') recite.nextAyah();
    else if (action === 'next-word') recite.nextWord();
    else if (action === 'back') recite.back();
    else if (key !== ayah) return;
    else if (action === 'forgot') toggleForgotten(gaps?.length ? gaps.map(word => `${ayah}:${word}`) : ayah);
    else if (action === 'save') toggleBookmark({ id: ayahBookmarkId(ayah), text: pageWords(ayah).join(' '), href: ayahHref(ayah) });
  };
  const touches = usePageTouch((gesture, key) => run(readGestures().recite[gesture], key), () => readGestures().recite.double !== 'none');
  // While writing, a touch on the ayah only brings the keyboard back, as in the reader; the boxes pick a word themselves.
  const onTouch: typeof touches.touch = (...touch) => (recite.write ? recite.boxes.focus() : touches.touch(...touch));
  const [surah, number] = ayah.split(':').map(Number);
  return (
    <Post palette={palette} head={<PostHead Icon={Icon} title={title} sub={`${shortNames[surah] ?? ''} ${num(number)}`} open={head} palette={palette} />} whole
      bar={<RecitePill recite={recite} writing={writing} onWriting={onWriting} palette={palette} />}
      open={open} actions={marks} source={mushafOf(ayah)}
      // Shared, the ayah's lines as the mushaf sets them: never what is hidden, nor whether it was remembered (owner, 2026-11-22).
      picture={{ head: <PostHead Icon={FEATURE_ICON.mushaf} title={shortNames[surah] ?? ''} sub={num(number)} palette={palette} />,
        body: <View style={{ padding: 12 }}><AyahLines ayah={ayah} menu={false} palette={palette} write={null} checked={null} shown whole /></View> }}>
      <View style={{ padding: 12 }}>
        <AyahLines ayah={ayah} menu={false} gaps={gaps ? [...gaps] : undefined} palette={palette} shown={shown} words={position.words} checked={recite.checked} onTouch={onTouch} write={recite.write} />
        {recite.write && recite.boxes.field}
      </View>
    </Post>
  );
}

/** «تسميع» on a recite question card (owner, 2026-11-22: only where the question asks to recite the ayah). */
function ReciteAction({ palette }: { palette: Palette }) {
  return <Action Icon={EyeOff} label="تسميع" onPress={() => openIntent({ tab: 'read', recite: true })} palette={palette} />;
}

/**
 * Where an answered question's «افتح» goes (owner, 2026-11-22): the page that presents what it asked, to read more there, never
 * the quizzes page. Its look names the feature; else its ayah opens in the reader, its surahs on the order page, a name
 * question on the person's page.
 */
function openAnswer(question: SoloQuestion) {
  const person = (slug: string) => router.push({ pathname: '/person', params: { slug } });
  if (isTree(question)) return openTreesOf(questionAyat(question)[0]);
  if (isCompare(question)) {
    const [a, b] = [question.compare.shown.key, question.compare.asked.key];
    return openIntent({ tab: 'compare', lead: Number(a.split(':')[0]), other: Number(b.split(':')[0]), ayat: [a, b] });
  }
  // The prophet's story, not the ayah its look shows.
  if (question.family === PROPHET_STORY) return router.push({ pathname: '/prophets/[slug]', params: { slug: question.correctAnswer } });
  const look = question.look;
  switch (look?.view) {
    case 'ties': case 'life': return person(look.slug);
    case 'virtues': return person(look.mark?.slug ?? look.slugs[0]);
    case 'nasab': return router.push({ pathname: '/nasab', params: { slug: look.slugs.join(',') } });
    case 'terms': return toTab({ pathname: '/term', params: { name: look.mark ?? look.names[0] } });
    case 'hadith': return toTab(look.mark ? { pathname: '/hadith-forty', params: { n: String(look.mark) } } : { pathname: '/hadith-book', params: { book: 'forty' } });
    case 'sahih': return look.mark ? toTab({ pathname: '/hadith-kitab', params: { book: look.book, kitab: String(look.mark) } }) : toTab('/hadith');
    case 'story': return toTab({ pathname: '/story', params: { slug: look.slug } });
    case 'battle': return toTab({ pathname: '/battle', params: { slug: look.slug } });
    case 'tafsir': return readAyah(look.mark ?? look.keys[0]);
    case 'word': case 'balagha': case 'irab': case 'qiraat': return readAyah(look.key);
    case 'tuhfa': return toTab(look.mark ? { pathname: '/tuhfa', params: { verse: String(look.mark) } } : '/tuhfa');
    case 'ayat': return readAyah(look.mark ?? look.keys[0]);
  }
  const dhikr = askedDhikr(question.key);
  if (dhikr) return openDhikr(dhikr);
  if (question.ayahKey) return readAyah(question.ayahKey);
  if (question.order?.length) return router.push({ pathname: '/order', params: { juz: String(orderJuz(question.order)) } });
  const aimed = question.family === 'SURAH_AIM' && orderSurahOf(question.correctAnswer);
  if (aimed) return openOrder(aimed);
  const slug = question.key.split(':')[1];
  if (question.family === PROPHET_NAMES) return person('prophet-muhammad');

  if (slug && findPerson(slug)) return person(slug);
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
  // Answered: a picked choice, or a tree or compare question checked (owner, 2026-11-22: «افتح» only then).
  const answered = isTree(question) || isCompare(question) ? !!checked : run.typed[0][0] !== undefined;
  const prompt = question.promptArabic && question.promptArabic !== FEED_QUIZ_NAMES[kind] ? <QuizPrompt text={question.promptArabic} palette={palette} /> : undefined;
  return (
    <Post palette={palette} head={<PostHead Icon={QUIZ_ICON[kind as FeedKind]} title={FEED_QUIZ_NAMES[kind]} open={topic('/quizzes', 'افتح الاختبارات')} palette={palette} />} whole
      // Unanswered, a tree or compare question's «تحقق» leads the row, before «تلميح», as the choice questions' does.
      open={answered ? <OpenButton label="افتح ما يشرح الجواب" onPress={() => openAnswer(question)} palette={palette} />
        : (isTree(question) || isCompare(question)) && !checked ? <Action Icon={Check} label="تحقق" onPress={() => setRun(check(run))} palette={palette} /> : undefined}
      actions={kind === RECITE_SNIPPET && !answered && <ReciteAction palette={palette} />}>
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
  return surah ? <ForgottenPost ayah={`${surah}:1`} title={FEED_QUIZ_NAMES[OPENINGS]} Icon={QUIZ_ICON[OPENINGS]} palette={palette} /> : null;
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.person} title="من التراجم" sub={personName(pick.person)} open={topic('/tarajim', 'افتح التراجم')} palette={palette} />}
      open={<OpenButton label={`افتح ترجمة ${personName(pick.person)}`} onPress={open} palette={palette} />}
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
  const width = usePageWidth();
  const [shown, setShown] = useState<DrawingOrText>('drawing');
  const pair = tiePairs().find(each => `${each.a},${each.b}` === id);
  if (!pair) return null;
  const nodes = [...new Set(pair.steps.flatMap(step => [step.from, step.to]))];
  const name = (slug: string) => personName(GRAPH.nodes.get(slug)!);
  const open = () => router.push({ pathname: '/between', params: { slugs: `${pair.a},${pair.b}` } });
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.ties} title="صلة" sub={`${name(pair.a)} و${name(pair.b)}`} open={topic('/tarajim', 'افتح التراجم')} palette={palette} />}
      open={<OpenButton label={`ارسم الصلة بين ${name(pair.a)} و${name(pair.b)}`} onPress={open} palette={palette} />}
      actions={<SwapButton options={DRAWING_OR_TEXT} value={shown} onChange={setShown} Icons={DRAWING_ICONS} />}
      source={sourcesOf(pageSources(pair.steps.flatMap(step => step.link.refs)))}>
      <View style={{ padding: 14, gap: 6 }}>
        {/* The same drawing as «بينه وبين…» (owner, 2026-11-19), or the sentence that says it: one at a time, the drawing first (owner, 2026-11-20). */}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.person} title={kind === 'laqab' ? 'لقب وصاحبه' : 'كنية وصاحبها'} sub={who} open={topic('/tarajim', 'افتح التراجم')} palette={palette} />}
      open={<OpenButton label={`افتح ترجمة ${who}`} onPress={open} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.life} title={she ? 'من حياتها' : 'من حياته'} sub={personName(person)} open={personTopic(slug)} palette={palette} />}
      open={<OpenButton label={`افتح ترجمة ${personName(person)}`} onPress={open} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.nasab} title={herOrHis(slug, 'نسبه', 'نسبها')} sub={personName(person)} open={personTopic(slug)} palette={palette} />}
      open={<OpenButton label={`افتح نسب ${personName(person)}`} onPress={open} palette={palette} />}
      source={sourcesOf(nasabSources(person, PEOPLE))}>
      <View style={{ padding: 14, gap: 10 }}><NasabTree slugs={[slug]} palette={palette} meetings={false} text={false} inCard /></View>
    </Post>
  );
}

/** «صلاته»: a person's ties ring as his ties page draws it; a person on it opens his page, and its open button the ties page. */
function TiesPost({ slug, palette }: { slug: string; palette: Palette }) {
  const width = usePageWidth();
  const [tie, setTie] = useState<Tie | undefined>();
  const person = findPerson(slug);
  if (!person) return null;
  const title = herOrHis(slug, 'صلاته', 'صلاتها');
  const open = () => router.push({ pathname: '/ties', params: { slug } });
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.ties} title={title} sub={personName(person)} open={personTopic(slug)} palette={palette} />}
      open={<OpenButton label={`افتح ${title}: ${personName(person)}`} onPress={open} palette={palette} />}
      source={sourcesOf(tiesSources(GRAPH, slug))}>
      <View style={{ padding: 14 }}>
        <TiesRing slug={slug} width={Math.min(width - 60, 480)} palette={palette} onPick={to => router.push({ pathname: '/person', params: { slug: to } })} onShow={setTie} />
      </View>
      <TieSheet tie={tie} onClose={() => setTie(undefined)} palette={palette} />
    </Post>
  );
}

/** The groups the data holds (shared/peopleCards.ts), read once. */
let groups: GroupSource[] | undefined;
const groupList = () => (groups ??= groupSources(STORIES, BATTLES));

/**
 * «صلة بينهم» (owner, 2026-11-21; feed-visuals sketch panel 1): three to five people of one story or battle, or a man's
 * in-laws, joined by family as «بينه وبين…» draws them; its open button opens that page with them picked.
 */
function GroupPost({ id, palette }: { id: string; palette: Palette }) {
  const width = usePageWidth();
  const [shown, setShown] = useState<DrawingOrText>('drawing');
  const group = useMemo(() => groupOf(GRAPH, groupList(), id), [id]);
  if (!group) return null;
  const picked = group.id.startsWith('inlaws:') ? group.nodes : group.slugs.filter(slug => GRAPH.nodes.has(slug));
  const inLaws = group.id.startsWith('inlaws:');
  const title = inLaws ? herOrHis(group.slugs[0], 'أصهاره', 'أصهارها') : 'صلة بينهم';
  const sub = inLaws ? personName(GRAPH.nodes.get(group.slugs[0])!) : group.name;
  const open = () => router.push({ pathname: '/between', params: { slugs: picked.join(',') } });
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.ties} title={title} sub={sub} open={topic('/tarajim', 'افتح التراجم')} palette={palette} />}
      open={<OpenButton label="ارسم الصلة بينهم" onPress={open} palette={palette} />}
      actions={<SwapButton options={DRAWING_OR_TEXT} value={shown} onChange={setShown} Icons={DRAWING_ICONS} />}
      source={sourcesOf(stepSources(group.steps))}>
      <View style={{ padding: 14, gap: 6 }}>
        {shown === 'drawing'
          ? <TiesChain nodes={group.nodes} steps={group.steps} first={group.nodes[0]} picked={group.id.startsWith('inlaws:') ? [group.nodes[0]] : picked} width={Math.min(width - 60, 480)} palette={palette} inCard />
          : <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{chainSentence(GRAPH, group.steps, personName)}.</Text>}
      </View>
    </Post>
  );
}

/** «حياتهما» (feed-visuals sketch panel 2): two lives side by side, what they shared joined; it opens «حياتهما» with the two. */
function LivesPost({ id, palette }: { id: string; palette: Palette }) {
  const [shown, setShown] = useState<LifeItem | undefined>();
  const slugs = id.split(',');
  if (slugs.length !== 2 || !slugs.every(slug => findPerson(slug))) return null;
  const names = slugs.map(slug => personName(findPerson(slug)!));
  const open = () => router.push({ pathname: '/life', params: { slugs: id } });
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.life} title="حياتهما" sub={`${names[0]} و${names[1]}`} open={topic('/tarajim', 'افتح التراجم')} palette={palette} />}
      open={<OpenButton label={`قارن حياة ${names[0]} و${names[1]}`} onPress={open} palette={palette} />}
      source={sourcesOf(lifeSources(slugs.flatMap(slug => personLife(findPerson(slug)!))))}>
      <View style={{ paddingVertical: 14, paddingHorizontal: 8, gap: 6 }}>
        <LifeColumns slugs={slugs} palette={palette} show={setShown} />
      </View>
      <LifeSheet item={shown} onClose={() => setShown(undefined)} palette={palette} />
    </Post>
  );
}

/**
 * «أين يلتقي نسبهما؟» (feed-visuals sketch panels 3 and 8): the nasab tree of two people, or of the Prophet ﷺ and the four
 * caliphs, each line leaving the shared one where it parts; it opens the nasab page with them.
 */
function MeetPost({ id, palette }: { id: string; palette: Palette }) {
  const slugs = id.split(',');
  if (!slugs.every(slug => findPerson(slug))) return null;
  const caliphs = id === CALIPHS_MEET.join(',');
  const names = slugs.map(slug => personName(findPerson(slug)!));
  const open = () => router.push({ pathname: '/nasab', params: { slug: slugs.join(',') } });
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.nasab} title={caliphs ? 'أين يلتقي نسبه ﷺ بنسب الخلفاء الأربعة؟' : 'أين يلتقي نسبهما؟'}
      sub={caliphs ? names.slice(1).join('، ') : `${names[0]} و${names[1]}`} open={topic('/tarajim', 'افتح التراجم')} palette={palette} />}
      open={<OpenButton label="افتح النسب" onPress={open} palette={palette} />}
      source={sourcesOf(uniqueSources(meetSources(PEOPLE, slugs)))}>
      <View style={{ padding: 14, gap: 10 }}><NasabTree slugs={slugs} palette={palette} meetings={false} text={false} inCard /></View>
    </Post>
  );
}

/** Rings by id, read once: the one-kind rings fold as the card's ring would (its width on this phone). */
let rings: Ring[] | undefined;
const ringList_ = () => (rings ??= (() => {
  const width = Math.min(Dimensions.get('window').width - 60, 480);
  return ringList(GRAPH, PEOPLE, slug => foldedKinds(tiesOf(slug), ringRoom(width)), slugs => roundLayout(slugs.map(slug => ringName(slug)), width) !== null);
})());
const SAHIH_NAMES = { bukhari: { book: 'صحيح البخاري', author: 'البخاري' }, muslim: { book: 'صحيح مسلم', author: 'مسلم' } } as const;

/**
 * A ring (feed-visuals sketch panels 7 and 9): one kind of a person's ties (his ﷺ wives, his children…), a title and those
 * who hold it, or a hadith and the people it names, drawn round; a tie held in doubt is said under it with both views.
 */
function RingPost({ id, palette }: { id: string; palette: Palette }) {
  const width = usePageWidth();
  const [tie, setTie] = useState<Tie | undefined>();
  const [doubtedOpen, setDoubtedOpen] = useState(false);
  const ring = ringList_().find(each => each.id === id);
  if (!ring) return null;
  const go = (slug: string) => router.push({ pathname: '/person', params: { slug } });
  const drawW = Math.min(width - 60, 480);
  const kin = ring.by === 'kin' ? kinOf(GRAPH, ring.slug, ring.kind) : undefined;
  const nodes = ring.people.map(slug => {
    const own = kin?.sure.find(each => each.to === slug);
    return personNode(slug, ring.by === 'kin' ? kindColor(palette, ring.kind) : palette.rule, go, own ? () => setTie(own) : undefined, ring.by === 'kin' ? ring.slug : undefined);
  });
  // A tie the book gives «على خلاف» is drawn too, its line dashed (owner, 2026-11-22), when the ring still fits; a scholar's
  // note that settles them (`ring.note`) leaves them out.
  const doubted = ring.note ? [] : ring.doubted;
  const withDoubted = [...nodes, ...doubted.map(each => ({ ...personNode(each.to, ring.by === 'kin' ? kindColor(palette, ring.kind) : palette.rule, go, () => setTie(each), ring.by === 'kin' ? ring.slug : undefined), dashed: true }))];
  const drawn = doubted.length && roundLayout(withDoubted.map(node => node.label), drawW) ? withDoubted : nodes;
  const owner = ring.by === 'title' ? undefined : GRAPH.nodes.get(ring.by === 'kin' ? ring.slug : ring.middle)!;
  const middle = ring.by === 'title' ? ring.name : personName(owner!);
  const title = ring.by === 'kin' ? groupWord(ring.kind, owner!.sex, ring.people.length) : ring.by === 'title' ? ring.name : `من ${SAHIH_NAMES[ring.book].book}`;
  const head = ring.by === 'kin'
    ? <PostHead Icon={Users} title={`${title} ${ring.slug === 'prophet-muhammad' ? 'ﷺ' : ''}`.trim()} sub={middle} open={personTopic(ring.slug)} palette={palette} />
    : <PostHead Icon={Users} title={title} sub={ring.by === 'hadith' ? `الحديث ${num(ring.n)}` : 'كما جمعهم العلماء'} open={ring.by === 'hadith' ? topic({ pathname: '/hadith-book', params: { book: ring.book } }, `افتح ${SAHIH_NAMES[ring.book].book}`) : topic('/tarajim', 'افتح التراجم')} palette={palette} />;
  const open = ring.by === 'kin' ? () => router.push({ pathname: '/ties', params: { slug: ring.slug } })
    : ring.by === 'title' ? () => router.push({ pathname: '/people', params: { title: ring.title } })
    : () => toTab({ pathname: '/hadith-sahih', params: { book: ring.book, n: String(ring.n) } });
  const source = ring.by === 'hadith'
    ? [ring, ...(ring.also ? [ring.also] : [])].map(each => ({ ...SAHIH_NAMES[each.book], at: num(each.n) }))
    : ring.sources;
  return (
    <Post palette={palette} head={head}
      open={<OpenButton label={ring.by === 'kin' ? `افتح صلات ${middle}` : ring.by === 'title' ? `افتح «${ring.name}»` : 'افتح الحديث'} onPress={open} palette={palette} />}
      // The ties the book gives «على خلاف»: one button in the row, their words in one sheet (owner, 2026-11-22).
      actions={doubted.length > 0 && <Button pill label="على خلاف" Icon={Scale} onPress={() => setDoubtedOpen(true)} />}
      source={sourcesOf(source)}>
      <View style={{ padding: 14, gap: 10 }}>
        {ring.by === 'hadith' && <Saying by="قال رسول الله ﷺ" palette={palette}><Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>«{ring.quote}»</Text></Saying>}
        <RoundRing middle={middle} nodes={drawn} width={drawW} palette={palette} />
      </View>
      <TieSheet tie={tie} onClose={() => setTie(undefined)} palette={palette} />
      <DoubtedSheet ties={doubted} open={doubtedOpen} onClose={() => setDoubtedOpen(false)} palette={palette} />
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.battles} title={battle.name} sub={battleLine(battle)} open={topic('/battles', 'افتح الغزوات والمعارك')} palette={palette} />}
      open={<OpenButton label={`افتح ${battle.name}`} onPress={open} palette={palette} />}
      source={sourcesOf(battleCardSources(battle))}>
      {battle.place ? <>
        <BattleMap places={[battle.place]} palette={palette} />
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
  const width = usePageWidth();
  const year = Number(id);
  const slice = battleYearSlice(BATTLES, year);
  if (!slice) return null;
  const toYear = (at: number) => toTab({ pathname: '/battles', params: { year: String(at) } });
  // The year's battles on one map (owner, 2026-11-22), each place once.
  const places = [...new Map(slice.battles.flatMap(battle => (battle.place ? [[battle.place.name, battle.place] as const] : []))).values()];
  return (
    <Post palette={palette} head={<PostHead Icon={CalendarRange} title="من الغزوات والمعارك" sub={yearTitle(year)} open={topic('/battles', 'افتح الغزوات والمعارك')} palette={palette} />}
      open={<OpenButton label={`افتح ${yearTitle(year)} في الغزوات والمعارك`} onPress={() => toYear(year)} palette={palette} />}
      source={sourcesOf(battleYearSources(BATTLES, year))}>
      <View style={{ padding: 14, gap: 6 }}>
        <BattleYears columns={slice.columns} lit={year} width={Math.min(width - 60, 480)} palette={palette} onYear={toYear} />
        {places.length ? <>
          <BattleMap places={places} palette={palette} />
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
    <Post palette={palette} head={<PostHead Icon={ChartNoAxesColumn} title="الجيشان في الغزوات" sub={battles.map(battle => battle.name.replace(/^غزوة /, '')).join(' · ')} open={topic('/battles', 'افتح الغزوات والمعارك')} palette={palette} />}
      open={<OpenButton label="افتح الغزوات والمعارك" onPress={() => toTab('/battles')} palette={palette} />}
      actions={<SwapButton options={ARMIES_TAB_NAMES} value={tab} onChange={setTab} Icons={ARMIES_ICONS} />}
      source={sourcesOf(armiesSources(BATTLES))}>
      <View style={{ padding: 14, gap: 10 }}>
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.hadith} title={`من ${unit.book}`} sub={unit.kitab} open={topic('/hadith', 'افتح الحديث')} palette={palette} />}
      open={<OpenButton label={`افتح الحديث في ${unit.book}`} onPress={open} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.openings} title="من فواتح السور" sub={card.title} open={topic('/openings', 'افتح فواتح السور')} palette={palette} />}
      open={<OpenButton label={`افتح «${card.title}» في فواتح السور`} onPress={open} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.oaths} title="من الأقسام" sub={[place, oath.who].filter(Boolean).join(' · ')} open={topic('/oaths', 'افتح الأقسام')} palette={palette} />}
      open={<OpenButton label={`افتح ${place} في الأقسام`} onPress={open} palette={palette} />}
      actions={<Action Icon={FEATURE_ICON.mushaf} label={`افتح ${place} في المصحف`} onPress={() => readAyah(oath.id)} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.order} title="مقصود السورة" open={topic('/order', 'افتح ترتيب السور')} palette={palette} />}
      open={<OpenButton label={`افتح سورة ${s.name} في ترتيب السور`} onPress={() => openOrder(s)} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.order} title="بين سورتين" open={topic('/order', 'افتح ترتيب السور')} palette={palette} />}
      open={<OpenButton label={`افتح ${before.name} و${s.name} في ترتيب السور`} onPress={() => openOrder(s)} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.prophets} title={prophet.title} sub={phase} open={topic('/prophets', 'افتح قصص الأنبياء')} palette={palette} />}
      open={<OpenButton label={`افتح ${event.title} في القصة`} onPress={open} palette={palette} />}
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
  // Opens as the matrix (owner, 2026-11-17); the card's own switches change only this card.
  const [around] = aroundSetting.use();
  const pieces = useMemo(() => [piece], [piece]);
  const [room, setRoom] = useState(0);
  const { height: screen } = useWindowDimensions();
  // The matrix's card follows its rows, up to most of the screen (owner, 2026-11-18); the tree keeps its own height.
  const [height, onFit] = useFitHeight(Math.max(TREE_HEIGHT, Math.round(screen * TREE_SHARE)));
  const embedded = useMemo(() => {
    const open = (at: BranchPiece) => toTab({ pathname: '/branches', params: { tree: at.id } });
    const lead = <OpenButton label="افتح الشجرة في متشابهات القرآن" onPress={() => open(piece)} palette={palette} />;
    return { open, ayatRoom: { height: room, set: setRoom }, onFit, extra: { lead, aside: <NotMineMenu /> } };
  }, [room, onFit, piece, palette]);
  const sources = useMemo(() => sourcesOf(pieceSources(piece.keys, piece.group)), [piece]);
  // The pager draws the tree in its own card and its buttons under it, so the post is the head and the pager.
  return (
    <View style={{ gap: 4 }}>
      <PostHead Icon={FEATURE_ICON.trees} title="من متشابهات القرآن" sub={placesOf(piece.keys)} open={topic('/branches', 'افتح متشابهات القرآن')} palette={palette} />
      <View style={{ height: height + room }}>
        <TreePager pieces={pieces} list={EMPTY_LIST} palette={palette} around={around} start={0} embedded={embedded} />
      </View>
      <SourceLine named={sources} sources={sources} palette={palette} />
    </View>
  );
});

/** A saved ayah as a post: the ayah in the mushaf's own lines, as the recall card shows it once revealed. */
function SavedAyahPost({ ayah, palette }: { ayah: string; palette: Palette }) {
  const [surah, number] = ayah.split(':').map(Number);
  return (
    <Post palette={palette} head={<PostHead Icon={Bookmark} title="من المحفوظات" sub={`${shortNames[surah] ?? ''} ${num(number)}`} open={{ onPress: () => router.push('/library'), label: 'افتح المحفوظات' }} palette={palette} />}
      open={<OpenButton label="افتح صفحة الآية" onPress={() => openAyahPage(ayah)} palette={palette} />} source={mushafOf(ayah)}>
      <View style={{ padding: 12 }}>
        <AyahLines ayah={ayah} menu={ayah} palette={palette} shown whole write={null} checked={null} />
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.prophets} title={prophet.title} sub={prophet.story.phases[phase]} open={topic('/prophets', 'افتح قصص الأنبياء')} palette={palette} />}
      open={<OpenButton label="افتح القصة" onPress={() => open()} palette={palette} />}
      source={sourcesOf([storySource(prophet.events, phase)])}>
      <View style={{ paddingVertical: 8 }}>
        <StoryMap map={map} events={prophet.events} phases={prophet.story.phases} at={phase} palette={palette} onPick={open} onTitle={open} />
      </View>
    </Post>
  );
});

/** The day today's juz was marked read («قرأته»), kept on this device: one day, no history (no counts, owner's rule). */
const JUZ_READ = 'juz-read';
const juzRead = (day: number) => readJson(JUZ_READ, isNumberIn(0, Infinity)) === day;

/** Today's juz shows half the lines the reading card does. */
const JUZ_LINES = 4;

/**
 * Today's juz as a post (owner, 2026-11-18: no longer a circle at the top): the Hijri day's juz, the top of its first page,
 * and a button to read it. «الجزءان» on the last day of a 29-day month. «قرأته» marks it read for the day (owner, 2026-11-22):
 * the card stays with its tick lit, and the feed leaves it out from the next visit until the next day's juz.
 */
function JuzPost({ palette }: { palette: Palette }) {
  const { day, date, juz } = useToday();
  const [read, setRead] = useState(() => juzRead(day));
  if (!juz) return null;
  const start = JUZ_INDEX[juz[0] - 1];
  const page = pageOfAyah(`${start.surah}:${start.ayah}`) ?? 1;
  const open = () => openJuz(juz[0]);
  const toggle = () => setRead(on => { writeJson(JUZ_READ, on ? 0 : day); return !on; });
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.mushaf} title="جزء اليوم" sub={[juzLabel(juz), date?.replace(/ هـ$/, '')].filter(Boolean).join(' · ')} open={topic('/quran', 'افتح القرآن')} palette={palette} />}
      open={<OpenButton label={`اقرأ ${juzLabel(juz)}، جزء اليوم`} onPress={open} palette={palette} />} press={{ onPress: open, label: `أول ${juzLabel(juz)}، الصفحة ${num(page)} من المصحف` }}
      actions={<Action Icon={read ? CircleCheck : Check} label="قرأته" tone="green" on={read} onPress={toggle} palette={palette} />}
      source={sourcesOf([mushafPage(start.surah, page)])}>
      {/* Smaller than the reading card: the juz's first lines only (owner, 2026-11-22). */}
      <View style={{ paddingHorizontal: 12, paddingVertical: 6 }}><PageTop page={page} lines={JUZ_LINES} palette={palette} /></View>
    </Post>
  );
}

/** Friday's card (owner, 2026-11-20): Surat al-Kahf's first page; its button opens the mushaf there. */
function KahfPost({ palette }: { palette: Palette }) {
  const page = pageOfAyah('18:1') ?? 293;
  const read = () => openIntent({ tab: 'read', at: '18:1' });
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.mushaf} title="سورة الكهف" sub="يوم الجمعة" open={topic('/quran', 'افتح القرآن')} palette={palette} />}
      open={<OpenButton label="اقرأ سورة الكهف" onPress={read} palette={palette} />} source={sourcesOf([mushafPage(18, page)])}>
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
    <Post palette={palette} head={<PostHead Icon={Clock} title={title} sub={[date, place?.name].filter(Boolean).join(' · ')} open={topic('/utilities', 'افتح مواقيت الصلاة')} palette={palette} />}
      // Nothing to share: the times are your own day and place (owner's plan, 2026-11-22: own-state cards never share your state).
      share={false}
      actions={<>
        <Action Icon={Clock} label="مواقيت الصلاة" onPress={() => openUtility('tools')} palette={palette} />
        <Action Icon={Compass} label="القبلة" onPress={() => openUtility('tools', 'qibla')} palette={palette} />
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
 * A scene from «مشاهد» as a post (owner, 2026-11-22): its card as on the scenes page (picture, title, surah and ayah); the
 * head opens the scenes page, the picture and «افتح» the scene itself.
 */
const ScenePost = memo(function ScenePost({ id, palette }: { id: string; palette: Palette }) {
  if (id !== DARK_SEA_KEY) return null;
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.scenes} title="من المشاهد" sub={darkSeaName()} palette={palette} open={{ onPress: () => toTab('/lataif'), label: 'افتح المشاهد' }} />}
      open={<DarkSeaActions palette={palette} only="open" feed />} share={<DarkSeaActions palette={palette} only="share" />}
      source={darkSeaSourceList()}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}><DarkSeaCard palette={palette} onPress={openDarkSea} /></View>
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.stories} title="من قصص السيرة" sub={story.name} open={topic('/stories', 'افتح قصص السيرة')} palette={palette} />}
      open={<OpenButton label={`افتح ${story.name}`} onPress={open} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.tafsir} title="من شرح ابن رجب" sub={`${entry.heading}، ${fromCompanion(entry.companion)}`} open={fortyTopic(entry.n)} palette={palette} />}
      open={<OpenButton label={`افتح ${entry.heading}`} onPress={open} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.hadith} title="من الحديث" sub={`${entry.heading}، ${fromCompanion(entry.companion)}`} open={fortyTopic(entry.n)} palette={palette} />}
      open={<OpenButton label={`افتح ${entry.heading}`} onPress={open} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.hadith} title={`من ${book.title}`} sub={where} open={topic({ pathname: '/hadith-book', params: { book: slug } }, `افتح ${book.title}`)} palette={palette} />}
      open={<OpenButton label={`افتح ${book.title} ${num(Number(id))}`} onPress={open} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.chain} title="من أخرجه" sub={`${entry.heading}، ${fromCompanion(entry.companion)}`} open={fortyTopic(entry.n)} palette={palette} />}
      open={<OpenButton label={`افتح ${entry.heading}`} onPress={open} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.chain} title="من الإسناد" sub={`${entry.heading}، ${fromCompanion(entry.companion)}`} open={fortyTopic(entry.n)} palette={palette} />}
      open={<OpenButton label={`افتح ${entry.heading}`} onPress={open} palette={palette} />}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.balagha} title="من مصطلحات البلاغة" sub={quote.book === 'itqan' ? 'الإتقان للسيوطي' : 'تلخيص المفتاح للقزويني'} open={topic('/terms', 'افتح مصطلحات البلاغة')} palette={palette} />}
      open={<OpenButton label={`${name}: تعريفه وأمثلته`} onPress={open} palette={palette} />}
      actions={<Action Icon={ListTree} label="مصطلحات البلاغة" onPress={() => toTab('/terms')} palette={palette} />}
      source={sourcesOf([termSource(quote)])}>
      <View style={{ paddingHorizontal: 14, paddingVertical: 12, gap: 6 }}>
        <Text style={{ color: palette.ink, fontSize: 24, textAlign: 'right' }}>{name}</Text>
        {!term.defines && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{quotesTitle(term)}</Text>}
        <BookWords text={quote.text} palette={palette} lines={TERM_LINES} size={18} />
        {example && <>
          <View style={{ height: 1, backgroundColor: palette.rule, opacity: 0.6, marginVertical: 4 }} />
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>من أمثلته</Text>
          <ExampleAyat example={example} palette={palette} />
          <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{ayatName(example.ayat)}</Text>
        </>}
      </View>
    </Post>
  );
}

/** Ibn Qutaybah's entries a card can hold: one place, a word or a few, said in a few lines, on an ayah that fits a card. */
const GHARIB_WORDS = 3;
const GHARIB_CHARS = 240;
const GHARIB_AYAH = 30;
const gharibItems = () => gharib.entries.flatMap((entry, at) => {
  const [[ayah, from, to], ...more] = entry[4];
  return !more.length && to - from < GHARIB_WORDS && entry[3].length <= GHARIB_CHARS && ayahMushafWords(`${entry[0]}:${ayah}`).length <= GHARIB_AYAH ? [String(at)] : [];
});

/**
 * A word of the Quran and Ibn Qutaybah's meaning of it (release-1 plan 2026-11-23: «غريب القرآن» had questions and no
 * card): the ayah with the words he quotes lit, then his entry whole. «افتح» opens the word's page, the head the words page.
 */
function GharibPost({ id, palette }: { id: string; palette: Palette }) {
  const entry = gharib.entries[Number(id)];
  if (!entry) return null;
  const [surah, page, shamelaId, text, [[ayah, from, to]]] = entry;
  const key = `${surah}:${ayah}`;
  const words = ayahMushafWords(key);
  // A word's page is one word's: an entry on a phrase opens the ayah's page.
  const lemmas = from === to ? lemmasAtMushafWord(wordCounts, key, from) : [];
  const open = () => (lemmas.length ? toTab({ pathname: '/word', params: { ids: lemmas.join(',') } }) : openAyahPage(key));
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.words} title="من غريب القرآن" sub={`${shortNames[surah] ?? ''} ${num(ayah)}`} open={topic('/words', 'افتح ألفاظ القرآن')} palette={palette} />}
      open={<OpenButton label={lemmas.length ? 'افتح صفحة الكلمة' : 'افتح صفحة الآية'} onPress={open} palette={palette} />}
      source={gharibSource({ page, id: shamelaId })}>
      <View style={{ paddingHorizontal: 14, paddingVertical: 12, gap: 8 }}>
        <LitAyat ayat={[{ words, lit: gharibWordsOf(entry, ayah), number: ayah }]} menu={key} palette={palette} />
        <View style={{ height: 1, backgroundColor: palette.rule, opacity: 0.6 }} />
        <BookRuns text={text} quran={palette.accent} style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }} />
      </View>
    </Post>
  );
}

/**
 * One rule of Tuhfat al-Atfal (release-1 plan 2026-11-23: «التجويد» had questions and no card): its verses as on the poem's
 * page, and the letters the poem names for it. «افتح» opens the poem at its first verse, the head the poem's top.
 */
function TuhfaPost({ id, palette }: { id: string; palette: Palette }) {
  const passage = tuhfaPassage(id);
  if (!passage) return null;
  const first = passage.verses[0].number;
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.tuhfa} title="من تحفة الأطفال" sub={passage.chapter} open={topic('/tuhfa', 'افتح تحفة الأطفال')} palette={palette} />}
      open={<OpenButton label="افتح المنظومة" onPress={() => toTab({ pathname: '/tuhfa', params: { verse: String(first) } })} palette={palette} />}
      source={sourcesOf([{ book: TUHFA.title, author: TUHFA.by, at: passage.verses.length > 1 ? `الأبيات ${num(first)}–${num(passage.verses.at(-1)!.number)}` : `البيت ${num(first)}` }])}>
      <View style={{ paddingHorizontal: 14, paddingVertical: 8 }}>
        {passage.verses.map(verse => <TuhfaVerse key={verse.number} verse={verse} marked={false} palette={palette} />)}
        {passage.letters && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', paddingTop: 10 }}>
          {'حروفه: '}<Text style={{ color: palette.accent, fontSize: 20, letterSpacing: 6 }}>{[...passage.letters].join(' ')}</Text>
        </Text>}
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
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.battles} title={`من ${battle.name}`} sub={battleLine(battle)} open={topic({ pathname: '/battle', params: { slug: battle.slug } }, `افتح ${battle.name}`)} palette={palette} />}
      open={<OpenButton label={`افتح ${battle.name}`} onPress={open} palette={palette} />}
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
  tafsir: { Icon: FEATURE_ICON.tafsir, title: 'من التفسير', open: 'التفسير كاملًا' },
  balagha: { Icon: FEATURE_ICON.balagha, title: 'من البلاغة', open: 'البلاغة كاملة' },
  irab: { Icon: FEATURE_ICON.irab, title: 'من الإعراب', open: 'إعراب الآية' },
  qiraat: { Icon: FEATURE_ICON.qiraat, title: 'من القراءات', open: 'القراءات كاملة' },
};
/** Each note card's head opens its topic: al-Sa'di's tafsir, the balagha terms, the library, the readings. */
const NOTE_TOPICS: Record<AyahNote, { onPress: () => void; label: string }> = {
  tafsir: topic({ pathname: '/book', params: { id: 'sadi' } }, 'افتح تفسير السعدي'),
  balagha: topic('/terms', 'افتح مصطلحات البلاغة'),
  irab: topic('/books', 'افتح المكتبة'),
  qiraat: topic('/qiraat', 'افتح القراءات'),
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
  if (!note || !on) return null;
  const [surah, number] = note.key.split(':').map(Number);
  const head = NOTE_HEADS[kind];
  // «افتح» opens the ayah's page at this card's section (owner, 2026-11-22: the ayah is the subject).
  const show = () => openAyahPage(note.key, kind, 'word' in note ? note.word : undefined);
  return (
    <Post palette={palette} head={<PostHead Icon={head.Icon} title={head.title} sub={`${shortNames[surah] ?? ''} ${num(number)}`} open={NOTE_TOPICS[kind]} palette={palette} />}
        open={<OpenButton label={`افتح صفحة الآية، ${head.open}`} onPress={show} palette={palette} />}
        source={sourcesOf(note.sources)}>
        {'readings' in note ? <View style={{ paddingVertical: 10 }}><QiraatPlace ayah={note.key} max={2} lines bare palette={palette} /></View> : <View style={{ paddingVertical: 10, gap: 6 }}>
          <View style={{ paddingHorizontal: 12 }}>
            <AyahLines ayah={note.key} menu={note.key} palette={palette} shown whole write={null} checked={null} />
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
    </Post>
  );
});

/** Every virtue of the converted people, read once: the «من التراجم» card's list. */
let virtues: { person: (typeof PEOPLE)[number]; index: number }[] | undefined;
const virtueList = () => (virtues ??= allVirtues(PEOPLE));
const virtueOf = (id: string) => virtueList().find(each => virtueItem(each.person.slug, each.index) === id);
const nameLists: Partial<Record<'laqab' | 'kunya', NameFact[]>> = {};
const nameList = (kind: 'laqab' | 'kunya') => (nameLists[kind] ??= kind === 'laqab' ? laqabFacts(PEOPLE) : kunyaFacts(PEOPLE));
const nameId = (each: NameFact) => nameItem(each.person.slug, each.name);

/** A dhikr's card on the adhkar page: its first tab (a morning and evening dhikr opens on the morning), scrolled to it. */
const openDhikr = (item: Dhikr) => openAdhkar(ADHKAR_TABS.find(tab => item.occasions.includes(tab))!, item.id);

/**
 * A dhikr of the adhkar page (owner, 2026-11-23: every feature a feed card): the page's own card body, its times and how
 * often on the head, the same reference as on the page; «افتح» opens the page at its card, the head the adhkar page.
 */
function DhikrPost({ id, palette }: { id: string; palette: Palette }) {
  const item = ADHKAR.find(each => each.id === id);
  if (!item) return null;
  const often = item.repeat ? ` · ${counted(item.repeat.count, ['مرة', 'مرتين', 'مرات'])}` : '';
  return (
    <Post palette={palette} head={<PostHead Icon={FEATURE_ICON.adhkar} title="من الأذكار" sub={`${adhkarTimes(item)}${often}`} open={{ onPress: () => openUtility('adhkar'), label: 'افتح الأذكار' }} palette={palette} />}
      open={<OpenButton label="افتح الذكر في الأذكار" onPress={() => openDhikr(item)} palette={palette} />}
      source={[adhkarSource(item)]}>
      <View style={{ paddingHorizontal: 18, paddingVertical: 14, gap: 14 }}>
        <DhikrBody item={item} palette={palette} />
      </View>
    </Post>
  );
}

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
  group: () => groupItems(GRAPH, groupList(), PEOPLE),
  lives: () => livesPairs(new Map(PEOPLE.map(person => [person.slug, personLife(person)]))),
  meet: () => meetItems(PEOPLE, nasabQuestions(PEOPLE).flatMap(question => (question.look?.view === 'nasab' ? [question.look.slugs as [string, string]] : []))),
  ring: () => ringList_().map(ring => ring.id),
  gharib: gharibItems,
  tuhfa: () => TUHFA_PASSAGES.map(passage => passage.id),
  adhkar: () => ADHKAR.map(item => item.id),
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
    case 'group': return <GroupPost id={item} palette={palette} />;
    case 'lives': return <LivesPost id={item} palette={palette} />;
    case 'meet': return <MeetPost id={item} palette={palette} />;
    case 'ring': return <RingPost id={item} palette={palette} />;
    case 'gharib': return <GharibPost id={item} palette={palette} />;
    case 'tuhfa': return <TuhfaPost id={item} palette={palette} />;
    case 'adhkar': return <DhikrPost id={item} palette={palette} />;
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
export function Feed({ palette, nearEnd, screenBottom, only = null, column = null, lead }: { palette: Palette; nearEnd: number;
  /** Where the bottom of the screen is in the page, for a card that comes while the feed is open (the prayer card). */
  screenBottom: () => number;
  /** One interest's id: its cards alone. */
  only?: string | null;
  /** A tablet lying down (owner, 2026-11-23): the width of each of two columns of cards, which take turns; otherwise one column. */
  column?: number | null;
  /** What heads the first column in two columns (the mushaf's page), so the second starts with a card beside it. */
  lead?: React.ReactNode }) {
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
  // The recall card asked this visit stays once the reader ticks it (owner, 2026-11-22), though a rested ayah is no longer
  // due; the next visit asks the next one, and the ayah of the day ticked as remembered is not asked again.
  const fresh = forgotten ? { ayah: forgotten, review: true } : recall && recalled.get(markAyah(recall))?.did !== 'remembered' ? { ayah: recall, review: false } : undefined;
  const [held, setHeld] = useState({ visit, asked: fresh });
  const keep = held.visit === visit && held.asked && !!recalledNow(held.asked.ayah);
  const asked = keep ? held.asked : fresh;
  if (!keep && (held.visit !== visit || held.asked?.ayah !== fresh?.ayah || held.asked?.review !== fresh?.review)) setHeld({ visit, asked: fresh });
  // Today's juz, once marked read, stays for the visit it was marked in and is left out after (owner, 2026-11-22).
  const showJuz = useMemo(() => !juzRead(day), [visit, day]); // eslint-disable-line react-hooks/exhaustive-deps -- read once a visit
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
      if (asked?.review) posts.push(<ForgottenPost key={`ask${asked.ayah}`} ayah={asked.ayah} review={() => reviewForgotten(forgottenOrder(Object.keys(due)))} palette={palette} />);
      else if (asked) posts.push(<ForgottenPost key={`ask${asked.ayah}`} ayah={asked.ayah} palette={palette} />);
      if (hasJuzCard(round) && juz && showJuz) posts.push(<JuzPost key={`j${day}`} palette={palette} />);
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
  const placed = (i: number) => <View key={keys[i]} onLayout={event => { tops.current.set(keys[i], event.nativeEvent.layout.y); }}>{posts[i]}</View>;
  if (column) {
    // Each column is a phone's page to the cards in it, so their drawings and ayat size from its width (ui/column.ts).
    // A card's place is told within its column, which starts where the feed does, so the prayer card still comes below the screen.
    // The cards take turns by their order without the prayer cards, which join the column of the card before them: a prayer
    // card coming or going never moves a card to the other column.
    let turn = -1;
    const prayers = new Set(cards.map(card => `pr${card.key}`));
    const sides = keys.map(key => (prayers.has(key) ? Math.max(turn, 0) % 2 : ++turn % 2));
    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: COLUMN_GAP }} onLayout={event => { top.current = event.nativeEvent.layout.y; }}>
        {[0, 1].map(side => (
          <PageWidthProvider key={side} value={column + 32}>
            <View style={{ width: column, gap: 14 }}>
              {side === 0 && lead}
              {posts.map((_post, i) => (sides[i] === side ? placed(i) : null))}
            </View>
          </PageWidthProvider>
        ))}
      </View>
    );
  }
  return (
    <View style={{ gap: 14 }} onLayout={event => { top.current = event.nativeEvent.layout.y; }}>
      {lead}
      {posts.map((_post, i) => placed(i))}
    </View>
  );
}
