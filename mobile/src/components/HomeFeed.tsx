import { memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AppState, ScrollView, useWindowDimensions, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeftRight, BookA, Bookmark, BookOpen, Check, Clock, Compass, Eye, EyeOff, Feather, Layers, LibraryBig, LightbulbOff, ListTree, Presentation, Sparkles, Users, ScrollText, Swords, ExternalLink as ExternalLinkIcon, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks, type Bookmark as SavedItem } from '@shared/bookmarks';
import { bookmarkKind } from '@shared/bookmarkKind';
import { compareBookmarkAyat, savedAs } from '@shared/compareBookmarks';
import { ayahBookmarkId, ayahHref, markAyah, markWord, markForgotten, mostForgotten, readDueMarks, rememberAyah, subscribeDueMarks } from '@shared/ayahMarks';
import { toggleBookmark } from '@shared/bookmarks';
import { readGestures, type GestureAction } from '@shared/readerGestures';
import { isMemorized, memorizedPrefer, memorizedQuestions, readMemorized, recallOfDay, subscribeMemorized, touchesMemorized, withMemorizedScope } from '@shared/memorized';
import { FEED_QUIZ_NAMES, feedQuizKind, feedQuizSeed, OPENINGS, openingSurah, seededRandom, type FeedQuizKind } from '@shared/quiz/feedQuiz';
import { FORGOT, recited } from '@shared/quiz/choiceKinds';
import type { QuizTopic } from '@shared/quiz/settings';
import { backToVisit, growingPicks, savedOfSlot, leftVisit, markFeedSeen, readFeedSeen, subscribeFeedSeen, subscribeVisit, visitStart, serverVisit } from '@shared/feedSeen';
import { feedBooks, hasBooksCard, hasJuzCard, hasMomentCard, hasSceneCard, hasSiraCard, hasTarajimCard, hasTermCard, inMinutes, insertAt, momentOfSlot, prayerSoon, sceneOfSlot, siraOfSlot, tarajimOfSlot, termOfSlot } from '@shared/homeFeed';
import { pageLabel, sayer } from '@shared/tarajim';
import { PEOPLE, personName } from '@/lib/tarajim';
import balaghaTerms from '@shared/data/quran/balaghaTerms';
import { plainName, examplesOf } from '@shared/quran/balaghaTerms';
import { BookWords, ExampleAyat, ayatName, quotesTitle } from './BalaghaTerm';
import { clock, FIVE, PRAYER_NAMES, type PrayerDay, type PrayerKey } from '@shared/prayer';
import { BOOKS } from '@shared/books';
import { isReaderBook, pageName } from '@shared/readerBooks';
import { examples } from '@shared/quran/iltifat';
import { topicOf } from '@shared/quran/lataif';
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
import type { AppMomentBattle } from '@shared/battles/battle';
import { battleLine, Moment } from './battles/BattleParts';
import { STORIES } from '@/lib/stories';
import { Report, StoryAyat } from './stories/StoryParts';
import CompareCard from './CompareCard';
import TreePager from './TreePager';
import { aliasesOf, EMPTY_LIST } from '@/lib/branchList';
import { treeList } from '@/lib/branches';
import { shownBookmarks } from '@/lib/home';
import TreeIcon from './TreeIcon';
import { REVIEW_LABEL, reviewForgotten } from './HomeCards';
import { forgottenOrder, type RecitePosition } from '@shared/quran/recite';
import { pageModel } from '@shared/quran/recitePage';
import RecitePill from './recite/RecitePill';
import { useRecite } from './recite/useRecite';
import { usePageTouch } from '@/lib/usePageTouch';
import AyahLines, { pageWords, PageTop } from './AyahLines';
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
import type { BookId } from '@shared/books';
import { BookCard, Shelf, TUHFA } from '@/screens/books';
import { IltifatActions, IltifatScene } from './Iltifat';
import { prophetStory } from '@/lib/prophets';
import StoryMap from './StoryMap';
import { ayahPlaces } from '@shared/quran/ayahPlaces';
import itqan from '@shared/data/quran/itqanBalagha';
import surahCounts from '@shared/data/quran/surahs.json';
import { allAyat, ayahNoteAt, balaghaNote, ayahNoteKind, itqanSureAyat, withoutOpeningQuote, type AyahNote } from '@shared/quran/ayahNotes';
import { itqanAt } from '@shared/quran/itqanBalagha';
import { irabWordsAt } from '@shared/quran/irabData';
import { qiraatAyat, qiraatOf } from '@shared/quran/qiraatData';
import { singleAyahPassages, tafsirSadiOf } from '@shared/quran/tafsirSadiData';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import { corpusWords } from '@shared/quran/words';
import AyahPreviewSheet, { QiraatWord } from './AyahPreviewSheet';
import type { WordDifference } from '@shared/quran/qiraat';
import BalaghaSheet from './BalaghaSheet';
import IrabSheet from './IrabSheet';
import QuranWords from './quran/text/QuranWords';
import { FIT_SHARE, useFitHeight } from '@/lib/useFit';
import { storyMap } from '@shared/quran/prophets/story';
import { hasStoryCard, storyGroupOfDay } from '@shared/quran/prophets/storyGroup';
import { check, DEFAULT_LIST, DEFAULT_SOLO, hasTyped, isCompare, isTree, pick, reveal, showAnswer, startSolo, typeAnswer, type SoloRun } from '@/lib/quiz';
import { readAyah } from '@/lib/openReader';
import QuizChoice, { QuizPrompt } from './QuizChoice';
import { CompareFeedback, CompareInputs } from './QuizCompare';
import { QuizFeedback, QuizInputs } from './QuizTree';
import { type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import { Tap } from '@/ui/Tap';
import Card from '@/ui/Card';
import { openExternal } from '@/ui/ExternalLink';

type IconType = (props: LucideProps) => React.ReactNode;

/** A post's icon button, as the compare card's row has them: muted, or in the accent when on. */
function Action({ Icon, label, on, onPress, tone, disabled }: { Icon: IconType; label: string; on?: boolean; onPress: () => void; palette: Palette; tone?: 'green'; disabled?: boolean }) {
  return <IconButton Icon={Icon} label={label} onPress={onPress} on={on} disabled={disabled} tone={tone} />;
}

/**
 * Every feed post's one shape (owner, 2026-11-14), the compare card's: the head, the body in one card, and a row of icon
 * buttons under the card, starting on the right.
 */
function Post({ head, actions, bar, palette, press, children }: { head: React.ReactNode; actions?: React.ReactNode;
  /** The whole card as one button (an ayah card opening its sheet); `label` names it for a screen reader. */
  press?: { onPress: () => void; label: string };
  /** A bar of the feature's own under the card, leading the buttons' row (recite mode's small bar, on the recall card; owner 2026-11-17). */
  bar?: React.ReactNode; palette: Palette; children: React.ReactNode }) {
  return (
    <View style={{ gap: 4 }}>
      {head}
      <Card palette={palette} pad={0} clip onPress={press?.onPress} accessibilityLabel={press?.label}>{children}</Card>
      {(bar || actions) && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: bar ? 4 : 0, marginTop: bar ? 4 : 0 }}>{bar}{actions}</View>}
    </View>
  );
}

/** A feed card's head: a round icon, a title and a line under it, like a post's author. */
function PostHead({ Icon, title, sub, palette, open }: { Icon: IconType; title: string; sub?: string; palette: Palette;
  /** A tap on the head opens the post's own page; `label` names it for a screen reader. */
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
      actions={<>
        <Action Icon={BookOpen} label="اقرأ" onPress={read} palette={palette} />
        <Text style={{ color: palette.muted, fontSize: 14, padding: 8 }}>{juzLabel([juz])}</Text>
      </>}>
      <Tap onPress={read} accessibilityRole="button" accessibilityLabel={`افتح المصحف ${fasila ? 'عند فاصلتك' : 'حيث توقفت'}، سورة ${shortNames[surah] ?? ''}`} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
        {/* The page's first half as the reader draws it (owner, 2026-11-14). */}
        <PageTop page={page} palette={palette} />
      </Tap>
    </Post>
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
    <Action Icon={BookOpen} label="في المصحف" onPress={() => openIntent({ tab: 'read', at: markAyah(ayah), word: markWord(ayah) })} palette={palette} />
  </>;
  return <Recall key={`${ayah}-${writing}`} ayah={markAyah(ayah)} targetWord={markWord(ayah)} title={title} writing={writing} onWriting={toggleWriting} marks={marks} palette={palette} />;
}

/**
 * The recall card itself: recite mode on one ayah (recite/useRecite.ts, the mushaf's own), with its bar under the card. A
 * tap, double tap or long press on the ayah does what it does in recite mode (the reader's gesture settings); the pen writes
 * what the pen setting asks, and it stops at the ayah's end. Drawn afresh for each way of asking (`writing`).
 */
function Recall({ ayah, targetWord, title, writing, onWriting, marks, palette }: { ayah: string; targetWord?: number; title: string; writing: boolean; onWriting: () => void; marks: React.ReactNode; palette: Palette }) {
  const model = useMemo(() => { const page = pageOfAyah(ayah); return page ? pageModel(pageData(page), surahBefore(page)) : null; }, [ayah]);
  const [position, setPosition] = useState<RecitePosition>({ start: ayah, word: targetWord, shown: null, words: 0 });
  const [pen] = penRule.use();
  const recite = useRecite({ model, position, setPosition, writing, pen, until: ayah });
  const shown = recite.done;
  const run = (action: GestureAction, key: string | null) => {
    if (action === 'next-ayah') recite.nextAyah();
    else if (action === 'next-word') recite.nextWord();
    else if (action === 'back') recite.back();
    else if (key !== ayah) return;
    else if (action === 'forgot') markForgotten(targetWord === undefined ? ayah : `${ayah}:${targetWord}`);
    else if (action === 'save') toggleBookmark({ id: ayahBookmarkId(ayah), text: pageWords(ayah).join(' '), href: ayahHref(ayah) });
  };
  const touches = usePageTouch((gesture, key) => run(readGestures().recite[gesture], key), () => readGestures().recite.double !== 'none');
  // While writing, a touch on the ayah only brings the keyboard back, as in the reader; the boxes pick a word themselves.
  const onTouch: typeof touches.touch = (...touch) => (recite.write ? recite.boxes.focus() : touches.touch(...touch));
  const [surah, number] = ayah.split(':').map(Number);
  return (
    <Post palette={palette} head={<PostHead Icon={LightbulbOff} title={title} sub={`${shortNames[surah] ?? ''} ${num(number)}`} palette={palette} />}
      bar={<RecitePill recite={recite} writing={writing} onWriting={onWriting} palette={palette} small />}
      actions={marks}>
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
      <Action Icon={Users} label="اختبار جماعي" onPress={() => router.push('/quiz/party')} palette={palette} />
      <Action Icon={EyeOff} label="تسميع" onPress={() => openIntent({ tab: 'read', recite: true })} palette={palette} />
    </>
  );
}

/** The tree or compare question's room in a card before it has measured what it holds: the quiz's own tree and its buttons. */
const QUIZ_TREE_HEIGHT = 380;
const openAyat = (keys: string[]) => router.push({ pathname: '/ayah', params: { keys: keys.join(',') } });

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
    const list = memorized && questions ? { ...DEFAULT_LIST, filters: withMemorizedScope(DEFAULT_LIST.filters, memorized) } : DEFAULT_LIST;
    const started = startSolo({ ...DEFAULT_SOLO, kinds: [kind], length: 1, list }, seededRandom(seed));
    setRun(started.questions.length ? started : null);
  }, [kind, seed, memorized, questions]);
  if (!run) return null;
  const question = run.questions[0];
  const checked = run.checked[0];
  const prompt = question.promptArabic && question.promptArabic !== FEED_QUIZ_NAMES[kind] ? <QuizPrompt text={question.promptArabic} palette={palette} /> : undefined;
  return (
    <Post palette={palette} head={<PostHead Icon={kind === 'BRANCHES' ? TreeIcon : Feather} title={FEED_QUIZ_NAMES[kind]} palette={palette} />}
      actions={<>
        {(isTree(question) || isCompare(question)) && !checked && <>
          <Action Icon={Check} label="تحقق" disabled={!hasTyped(run)} onPress={() => setRun(check(run))} palette={palette} />
          <Action Icon={Eye} label="إظهار الإجابة" onPress={() => setRun(showAnswer(run))} palette={palette} />
        </>}
        {/* After the answer, the ayah's mushaf button joins the card's row, not the card (owner, 2026-11-15). */}
        {!isTree(question) && !isCompare(question) && question.ayahKey && run.typed[0][0] !== undefined &&
          <Action Icon={BookOpen} label="في المصحف" onPress={() => readAyah(question.ayahKey!)} palette={palette} />}
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
            ? <QuizFeedback onFit={onFit} question={question} typed={run.typed[0]} palette={palette} names={shortNames} onTap={openAyat} header={prompt} hints={run.hints?.[0]} />
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
function TarajimPost({ day, slot, palette }: { day: number; slot: number; palette: Palette }) {
  const pick = tarajimOfSlot(PEOPLE, day, slot);
  if (!pick) return null;
  const virtue = pick.person.virtues[pick.index];
  const open = () => router.push({ pathname: '/person', params: { slug: pick.person.slug } });
  return (
    <Post palette={palette} head={<PostHead Icon={Users} title="من التراجم" sub={personName(pick.person)} palette={palette} open={{ onPress: open, label: `افتح ترجمة ${personName(pick.person)}` }} />}>
      <View style={{ padding: 14, gap: 6 }}>
        <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{virtue.text}</Text>
        <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{virtue.by.length ? `${sayer(virtue)} · ` : ''}{pageLabel(virtue.refs)}</Text>
      </View>
    </Post>
  );
}

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
  const embedded = useMemo(() => ({ open: (at: BranchPiece) => toTab({ pathname: '/branches', params: { tree: at.id } }), ayatRoom: { height: room, set: setRoom }, onFit }), [room, onFit]);
  // The pager draws the tree in its own card and its buttons under it, so the post is the head and the pager.
  return (
    <View style={{ gap: 4 }}>
      <PostHead Icon={TreeIcon} title="من متشابهات القرآن" sub={placesOf(piece.keys)} palette={palette} open={{ onPress: () => embedded.open(piece), label: 'افتح الشجرة في متشابهات القرآن' }} />
      <View style={{ height: height + room }}>
        <TreePager pieces={pieces} list={EMPTY_LIST} palette={palette} mode={mode} around={around} start={0} embedded={embedded} />
      </View>
    </View>
  );
});

/** A saved ayah as a post: the ayah in the mushaf's own lines, as the recall card shows it once revealed. */
function SavedAyahPost({ ayah, palette }: { ayah: string; palette: Palette }) {
  const [surah, number] = ayah.split(':').map(Number);
  return (
    <Post palette={palette} head={<PostHead Icon={Bookmark} title="من المحفوظات" sub={`${shortNames[surah] ?? ''} ${num(number)}`} palette={palette} />}
      actions={<Action Icon={BookOpen} label="في المصحف" onPress={() => openIntent({ tab: 'read', at: ayah })} palette={palette} />}>
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
    if (kind === 'ayah') return { ayah: item.id.slice('ayah:'.length) };
    if (kind === 'tree') return { piece: treeList().find(piece => piece.id === item.id || aliasesOf(piece).includes(item.id)) };
    const surahs = [...new Set(compareBookmarkAyat(item).map(key => Number(key.split(':')[0])))].sort((a, b) => a - b);
    return { pair: surahs.length ? cardsFor(surahs[0], surahs[1] ?? surahs[0]).find(card => savedAs(card.id, [item]).length) : undefined };
  }, [item]);
  if ('ayah' in found) return found.ayah && /^\d+:\d+$/.test(found.ayah) && shortNames[Number(found.ayah.split(':')[0])] ? <SavedAyahPost ayah={found.ayah} palette={palette} /> : null;
  if ('piece' in found) return found.piece ? <TreePost piece={found.piece} palette={palette} /> : null;
  return found.pair ? <PairPost pair={found.pair} palette={palette} /> : null;
}

/**
 * A prophet's story map as a post (owner, 2026-11-14): the prophets page's own map (StoryMap), every event and surah, opened
 * sideways at the day's group; the card is as tall as its surahs, and only past most of the screen do they scroll inside it. Any tap opens the story page at its top, not scrolled
 * to an event, so a new reader sees where they landed (owner, 2026-11-14).
 */
const StoryPost = memo(function StoryPost({ slug, phase, palette }: { slug: string; phase: number; palette: Palette }) {
  const prophet = useMemo(() => prophetStory(slug), [slug]);
  const map = useMemo(() => (prophet ? storyMap(prophet.events) : null), [prophet]);
  const { height: screen } = useWindowDimensions();
  if (!prophet || !map) return null;
  const open = () => router.push({ pathname: '/prophets/[slug]', params: { slug } });
  return (
    <Post palette={palette} head={<PostHead Icon={ScrollText} title={prophet.title} sub={prophet.story.phases[phase]} palette={palette} open={{ onPress: () => open(), label: 'افتح القصة' }} />}
      actions={<Action Icon={BookOpen} label="افتح القصة" onPress={() => open()} palette={palette} />}>
      <ScrollView nestedScrollEnabled style={{ maxHeight: Math.round(screen * FIT_SHARE) }} contentContainerStyle={{ paddingVertical: 8 }}>
        <StoryMap map={map} events={prophet.events} phases={prophet.story.phases} at={phase} palette={palette} onPick={open} onTitle={open} />
      </ScrollView>
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
      actions={<Action Icon={BookOpen} label={`اقرأ ${juzLabel(juz)}`} onPress={read} palette={palette} />}>
      <Tap onPress={read} accessibilityRole="button" accessibilityLabel={`اقرأ ${juzLabel(juz)}، جزء اليوم`} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
        <PageTop page={page} palette={palette} />
      </Tap>
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
  const { date } = useToday();
  const left = Math.ceil((times[prayer].getTime() - now.getTime()) / 60_000);
  const title = left > 0 ? `${PRAYER_NAMES[prayer]} ${inMinutes(left)}` : `حان وقت ${PRAYER_NAMES[prayer]}`;
  return (
    <Post palette={palette} head={<PostHead Icon={Clock} title={title} sub={[date, place?.name].filter(Boolean).join(' · ')} palette={palette} />}
      actions={<>
        <Action Icon={Clock} label="مواقيت الصلاة" onPress={() => openUtility('times')} palette={palette} />
        <Action Icon={Compass} label="القبلة" onPress={() => openUtility('qibla')} palette={palette} />
      </>}>
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
      {/* Inverted in a left-to-right box, as the shelves are, so the first book sits on the right on every platform. */}
      <View style={{ direction: 'ltr', marginHorizontal: -16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row-reverse', flexGrow: 1, justifyContent: 'flex-start', gap: 12, paddingHorizontal: 16 }}>
          {picks.map(book => {
            if (book.id === TUHFA.id) return <Shelf key={book.id} palette={palette} label={TUHFA.title} onPress={() => toTab('/tuhfa')} kind={TUHFA.kind} title={TUHFA.title} by={TUHFA.by} width={FEED_BOOK} />;
            const mark = 'kind' in book && isReaderBook(book.id) ? fasilas[book.id] : undefined;
            return 'builtIn' in book ? <BookCard key={book.id} book={book} palette={palette} editing={false} width={FEED_BOOK}
              fasila={mark && isReaderBook(book.id) ? pageName(book.id, mark.part, mark.page) : null} /> : null;
          })}
        </ScrollView>
      </View>
    </View>
  );
}

let scenes: ReturnType<typeof examples> | undefined;
const sceneList = () => (scenes ??= examples(ayahMushafWords));

/**
 * A scene from «مشاهد» as a post (owner, 2026-11-18): the page's own card, whole, so the picture reads as it does there.
 * The head opens the page.
 */
const ScenePost = memo(function ScenePost({ day, slot, palette }: { day: number; slot: number; palette: Palette }) {
  const view = sceneList()[sceneOfSlot(sceneList().length, day, slot)];
  if (!view) return null;
  return (
    <Post palette={palette} head={<PostHead Icon={Presentation} title="من المشاهد" sub={topicOf(view).name} palette={palette} open={{ onPress: () => toTab('/lataif'), label: 'افتح المشاهد' }} />}
      actions={<IltifatActions view={view} palette={palette} />}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}><IltifatScene view={view} palette={palette} /></View>
    </Post>
  );
});

/**
 * A sira story (owner, 2026-11-18): its first report whole, so a first reader has what led to the words and what came of
 * them; the ayat it turns on folded under it. The head opens the story's page.
 */
function SiraPost({ day, slot, palette }: { day: number; slot: number; palette: Palette }) {
  const story = STORIES[siraOfSlot(STORIES.length, day, slot)];
  if (!story?.reports[0]) return null;
  const report = story.reports[0];
  const open = () => toTab({ pathname: '/story', params: { slug: story.slug } });
  return (
    <Post palette={palette} head={<PostHead Icon={ScrollText} title="من قصص السيرة" sub={story.name} palette={palette} open={{ onPress: open, label: `افتح ${story.name}` }} />}
      actions={<>
        <Action Icon={ScrollText} label={`افتح ${story.name}`} onPress={open} palette={palette} />
        <Action Icon={ExternalLinkIcon} label={`المصدر: ${report.cite}`} onPress={() => openExternal(report.url)} palette={palette} />
      </>}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
        <Report report={report} palette={palette} plain />
        {story.ayat.map(ayat => <StoryAyat key={ayat.from} ayat={ayat} palette={palette} folded />)}
      </View>
    </Post>
  );
}

/** The lines of a term's definition a card shows before its page. */
const TERM_LINES = 5;

/**
 * A balagha term (owner, 2026-11-18): its name, its definition in the scholar's words, and one of al-Suyuti's examples with
 * the words he quotes lit. The head and the first button open the term's page; the second, the list of terms.
 */
function TermPost({ day, slot, palette }: { day: number; slot: number; palette: Palette }) {
  const term = balaghaTerms.terms[termOfSlot(balaghaTerms.terms.length, day, slot)];
  const examples = useMemo(() => (term ? examplesOf(itqan, term) : []), [term]);
  if (!term) return null;
  const name = plainName(term.name);
  const quote = term.quotes[0];
  const example = examples[(day + slot) % Math.max(examples.length, 1)];
  const open = () => toTab({ pathname: '/term', params: { name: term.name } });
  return (
    <Post palette={palette} head={<PostHead Icon={BookA} title="من مصطلحات البلاغة" sub={quote.book === 'itqan' ? 'الإتقان للسيوطي' : 'تلخيص المفتاح للقزويني'} palette={palette} open={{ onPress: open, label: `افتح ${name}` }} />}
      actions={<>
        <Action Icon={BookA} label={`${name}: تعريفه وأمثلته`} onPress={open} palette={palette} />
        <Action Icon={ListTree} label="مصطلحات البلاغة" onPress={() => toTab('/terms')} palette={palette} />
      </>}
      press={{ onPress: open, label: `${name}: تعريفه وأمثلته` }}>
      <View style={{ paddingHorizontal: 14, paddingVertical: 12, gap: 6 }}>
        <Text style={{ color: palette.ink, fontSize: 24, textAlign: 'right' }}>{name}</Text>
        {!term.defines && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{quotesTitle(term)}</Text>}
        <BookWords text={quote.text} palette={palette} lines={TERM_LINES} size={18} />
        {example && <>
          <View style={{ height: 1, backgroundColor: palette.rule, opacity: 0.6, marginVertical: 4 }} />
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>من أمثلته</Text>
          <View pointerEvents="none"><ExampleAyat example={example} palette={palette} size={22} /></View>
          <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{ayatName(example.ayat)}</Text>
        </>}
      </View>
    </Post>
  );
}

/** Every battle's moments, in the battles' order, for the moment card. */
const MOMENTS = (momentBattles as AppMomentBattle[]).flatMap(battle => battle.moments.map((moment, i) => ({ battle, moment, n: i + 1 })));

/** A moment of a battle in the source's words (owner, 2026-11-18); the head opens the battle's page. */
function MomentPost({ day, slot, palette }: { day: number; slot: number; palette: Palette }) {
  const item = MOMENTS[momentOfSlot(MOMENTS.length, day, slot)];
  if (!item) return null;
  const { battle, moment, n } = item;
  return (
    <Post palette={palette} head={<PostHead Icon={Swords} title={`من ${battle.name}`} sub={battleLine(battle)} palette={palette}
      open={{ onPress: () => toTab({ pathname: '/battle', params: { slug: battle.slug } }), label: `افتح ${battle.name}` }} />}
      actions={<>
        <Action Icon={Swords} label={`افتح ${battle.name}`} onPress={() => toTab({ pathname: '/battle', params: { slug: battle.slug } })} palette={palette} />
        <Action Icon={ExternalLinkIcon} label={`المصدر: ${moment.cite}`} onPress={() => openExternal(moment.url)} palette={palette} />
      </>}>
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
type NoteBody = { key: string } & ({ text: string; source: string; heading?: string } | { word: number; shown: string; role: string; morph: string } | { readings: WordDifference[] });
/** The lines of a book's words a card shows before «المزيد». */
const NOTE_LINES = 4;

/**
 * An ayah with a little of what a book says on it (owner, 2026-11-18: small cards, the whole text one tap away): al-Sa'di on
 * an ayah he explains alone, al-Suyuti's balagha paragraph on an ayah he surely names, a word's i'rab, or the readings. A
 * tap opens the reader's own sheet for it. A card whose book is not on the phone is left out.
 */
const AyahNotePost = memo(function AyahNotePost({ kind, day, slot, palette }: { kind: AyahNote; day: number; slot: number; palette: Palette }) {
  useBooks();
  const on = kind === 'tafsir' ? bookState('sadi') === 'on' : kind === 'balagha' ? bookState('itqan') === 'on' : kind === 'irab' ? bookState('irab-words') === 'on' : true;
  const note = useMemo((): NoteBody | null => {
    const list = noteList(kind);
    const at = ayahNoteAt(list.length, day, slot);
    if (at < 0) return null;
    const key = list[at];
    if (kind === 'tafsir') { const passage = tafsirSadiOf(key); return passage ? { key, text: withoutOpeningQuote(passage.text), source: 'تفسير السعدي' } : null; }
    if (kind === 'balagha') {
      const found = balaghaNote(itqanAt(itqan, key));
      return found ? { key, ...found, source: 'الإتقان للسيوطي' } : null;
    }
    if (kind === 'irab') {
      const words = ayahMushafWords(key);
      const lines = irabWordsAt(key);
      const order = words.map((_, i) => (i + day + slot) % words.length);
      // A word with a role; a noun or verb before a lone particle («حرف جر»), which says little on its own.
      const hasRole = (i: number) => corpusWords(key, i).some(c => lines[c]?.role);
      const particle = (i: number) => corpusWords(key, i).every(c => lines[c]?.morph.startsWith('حرف'));
      const word = order.find(i => hasRole(i) && !particle(i)) ?? order.find(hasRole);
      if (word === undefined) return null;
      return { key, word, shown: words[word], role: corpusWords(key, word).map(c => lines[c]?.role).filter(Boolean).join('، '), morph: corpusWords(key, word).map(c => lines[c]?.morph).filter(Boolean).join(' · ') };
    }
    return { key, readings: qiraatOf(key) };
  }, [kind, day, slot]);
  const [open, setOpen] = useState(false);
  // The sheet stays while it is open, even when its book is taken off the phone from inside it.
  if (!note || (!on && !open)) return null;
  const [surah, number] = note.key.split(':').map(Number);
  const head = NOTE_HEADS[kind];
  const show = () => setOpen(true);
  const close = () => setOpen(false);
  const more = <Text style={{ color: palette.accent, fontSize: 14, textAlign: 'right', paddingHorizontal: 14 }}>المزيد</Text>;
  return (
    <>
      {on && <Post palette={palette} head={<PostHead Icon={head.Icon} title={head.title} sub={[`${shortNames[surah] ?? ''} ${num(number)}`, 'source' in note ? note.source : ''].filter(Boolean).join(' · ')} palette={palette} />}
        actions={<Action Icon={head.Icon} label={head.open} onPress={show} palette={palette} />}
        press={{ onPress: show, label: `${head.open}، ${shortNames[surah] ?? ''} ${num(number)}` }}>
        <View style={{ paddingVertical: 10, gap: 6 }}>
          <View pointerEvents="none" style={{ paddingHorizontal: 12 }}>
            <AyahLines ayah={note.key} palette={palette} shown whole write={null} checked={null} />
          </View>
          <View style={{ height: 1, backgroundColor: palette.rule, marginHorizontal: 14, opacity: 0.6 }} />
          {'heading' in note && note.heading ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right', paddingHorizontal: 14 }}>{note.heading}</Text> : null}
          {'source' in note && <>
            <Text numberOfLines={NOTE_LINES} style={{ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'right', writingDirection: 'rtl', paddingHorizontal: 14 }}>
              {tafsirRuns(note.text).map((run, i) => (run.quran ? <QuranWords key={i} style={{ color: palette.accent }}>{run.text}</QuranWords> : run.text))}
            </Text>
            {more}
          </>}
          {'word' in note && <View style={{ paddingHorizontal: 14, gap: 2 }}>
            <Text style={{ textAlign: 'right', writingDirection: 'rtl' }}><QuranWords style={{ fontSize: 26, lineHeight: 48, color: palette.accent }}>{note.shown}</QuranWords></Text>
            <Text style={{ color: palette.ink, fontSize: 19, lineHeight: 31, textAlign: 'right' }}>{note.role}</Text>
            <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>{note.morph}</Text>
          </View>}
          {'readings' in note && <>
            {note.readings.slice(0, 2).map(word => <QiraatWord key={word.at.join('-')} word={word} palette={palette} bare />)}
            {note.readings.length > 2 && more}
          </>}
        </View>
      </Post>}
      {(kind === 'tafsir' || kind === 'qiraat') && <AyahPreviewSheet preview={open ? { kind: kind === 'tafsir' ? 'tafsir' : 'readings', key: note.key } : null} onClose={close} palette={palette} />}
      {kind === 'balagha' && <BalaghaSheet ayah={open ? note.key : null} onClose={close} palette={palette} />}
      {kind === 'irab' && 'word' in note && <IrabSheet target={open ? { key: note.key, word: note.word } : null} onClose={close} palette={palette} />}
    </>
  );
});

/** Batches added each time the page nears the feed's end. */
const MORE = 3;

/**
 * The home feed: today's pair, a forgotten ayah that is due, today's tree and today's juz, then more each time the page nears its end
 * (`nearEnd` changes), with a scene from «مشاهد» and a few books among them, and the prayer card when a prayer is near.
 * What was shown before is skipped for good (shared/feedSeen.ts); once all was seen it starts again from the seen ones.
 */
export function Feed({ palette, nearEnd, screenBottom }: { palette: Palette; nearEnd: number;
  /** Where the bottom of the screen is in the page, for a card that comes while the feed is open (the prayer card). */
  screenBottom: () => number }) {
  const { day, juz } = useToday();
  const visit = useSyncExternalStore(subscribeVisit, visitStart, serverVisit);
  // A new visit (pulled to refresh, or back after long away) starts again from one batch, in the same render that picks it.
  const [more, setMore] = useState({ visit, batches: 1 });
  const batches = more.visit === visit ? more.batches : 1;
  useEffect(() => {
    if (nearEnd) setMore(now => ({ visit, batches: (now.visit === visit ? now.batches : 1) + MORE }));
  }, [nearEnd]); // eslint-disable-line react-hooks/exhaustive-deps -- only a new signal asks for more
  const seen = useSyncExternalStore(subscribeFeedSeen, readFeedSeen);
  const bookmarks = readBookmarks();
  // The saved items as they were when the visit began, so saving or unsaving a card does not move the cards on screen.
  const saved = useMemo(() => shownBookmarks(bookmarks), [visit]); // eslint-disable-line react-hooks/exhaustive-deps -- read once a visit
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
  // The cards already shown stay in place as more come; a new visit, day or setting picks afresh.
  const shownPairs = useRef<{ reset?: unknown[]; list: NonNullable<ReturnType<typeof pairOfDayNumber>>[] }>({ list: [] }).current;
  const shownTrees = useRef<{ reset?: unknown[]; list: NonNullable<ReturnType<typeof treeOfDay>>[] }>({ list: [] }).current;
  const pairs = useMemo(() => growingPicks(shownPairs, [visit, day, prefer, memorized], offset => pairOfDayNumber(day + offset), pair => pair.id, seen, batches,
    { since: visit, prefer: prefer ? pair => touchesMemorized(pair.sides.flatMap(sideKeys), memorized) : undefined }), [day, batches, seen, prefer, memorized, visit, shownPairs]);
  const trees = useMemo(() => growingPicks(shownTrees, [visit, day, prefer, memorized], offset => treeOfDay(day, offset), piece => piece.id, seen, batches,
    { since: visit, prefer: prefer ? piece => touchesMemorized(piece.keys, memorized) : undefined }), [day, batches, seen, prefer, memorized, visit, shownTrees]);
  useEffect(() => { markFeedSeen([...pairs.map(pair => pair.id), ...trees.map(piece => piece.id)]); }, [pairs, trees]);
  const posts: React.ReactNode[] = [];
  for (let i = 0; i < batches; i++) {
    if (pairs[i]) posts.push(<PairPost key={`p${pairs[i].id}`} pair={pairs[i]} palette={palette} />);
    if (i === 0 && forgotten) posts.push(<ForgottenPost key={`ask${forgotten}`} ayah={forgotten} review={() => reviewForgotten(forgottenOrder(Object.keys(due)))} palette={palette} />);
    else if (i === 0 && recall) posts.push(<ForgottenPost key={`ask${recall}`} ayah={recall} palette={palette} />);
    // A question card in every batch after the first (whose question is the recall card), each kind in turn.
    if (i > 0) posts.push(<FeedQuiz key={`q${day}-${i}`} kind={feedQuizKind(day, i)} seed={feedQuizSeed(day, i)} palette={palette} />);
    if (trees[i]) posts.push(<TreePost key={`t${trees[i].id}`} piece={trees[i]} palette={palette} />);
    posts.push(<AyahNotePost key={`n${day}-${i}`} kind={ayahNoteKind(day, i)} day={day} slot={i} palette={palette} />);
    const savedItem = savedOfSlot(saved, day, i);
    if (savedItem) posts.push(<SavedPost key={`b${savedItem.id}-${i}`} item={savedItem} palette={palette} />);
    if (hasStoryCard(i)) { const group = storyGroupOfDay(day, i); posts.push(<StoryPost key={`s${day}-${i}`} slug={group.slug} phase={group.phase} palette={palette} />); }
    if (hasJuzCard(i) && juz) posts.push(<JuzPost key={`j${day}`} palette={palette} />);
    if (hasSceneCard(i) && sceneList().length) posts.push(<ScenePost key={`m${day}-${i}`} day={day} slot={i} palette={palette} />);
    if (hasTermCard(i)) posts.push(<TermPost key={`d${day}-${i}`} day={day} slot={i} palette={palette} />);
    if (hasBooksCard(i)) posts.push(<BooksPost key={`k${day}-${i}`} day={day} palette={palette} />);
    if (hasSiraCard(i) && STORIES.length) posts.push(<SiraPost key={`r${day}-${i}`} day={day} slot={i} palette={palette} />);
    if (hasMomentCard(i) && MOMENTS.length) posts.push(<MomentPost key={`w${day}-${i}`} day={day} slot={i} palette={palette} />);
    if (hasTarajimCard(i)) posts.push(<TarajimPost key={`tj${day}-${i}`} day={day} slot={i} palette={palette} />);
  }
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
  for (const card of cards) {
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
