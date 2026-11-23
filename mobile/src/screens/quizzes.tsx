import { useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Shuffle, SlidersHorizontal, Users } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Button, { Row } from '@/ui/Button';
import Card from '@/ui/Card';
import Tabs from '@/ui/Tabs';
import RowScroll from '@/ui/RowScroll';
import Empty from '@/ui/Empty';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { useBooks } from '@/lib/books';
import { DEFAULT_LIST, DEFAULT_SOLO, startSolo } from '@/lib/quiz';
import { setRun } from '@/lib/soloStore';
import { FeedQuiz, feedRun, quizBookOn } from '@/components/HomeFeed';
import QuizKindTree, { type TreeBranch } from '@/components/QuizKindTree';
import { QUIZ_ICON } from '@/components/featureIcons';
import { INTERESTS, SECTIONS, interestOf, type SectionId } from '@shared/interests';
import { FEED_QUIZ_NAMES, seededRandom, type FeedKind, type FeedQuizKind } from '@shared/quiz/feedQuiz';
import { readMissed, subscribeMissed } from '@shared/quiz/missedQuestions';
import { memorizedQuestions, readMemorized, subscribeMemorized, withMemorizedScope } from '@shared/memorized';
import { bareName } from '@shared/tarajimLine';
import { PAGE_TOPICS, type QuizTopic } from '@shared/quiz/settings';

/** A question on the page: its kind and the seed that draws it, so a missed one comes back as it was asked. */
type Asked = { kind: FeedQuizKind; seed: number };

/**
 * Kinds that fill the screen when asked (a mushaf page to write on, a tree, two ayat to compare, a whole juz to order):
 * a tap on their leaf asks them, but a science never opens on one.
 */
const TALL: readonly FeedQuizKind[] = [...PAGE_TOPICS, 'BRANCHES', 'COMPARE', 'ORDER_JUZ'];

/** The sciences' tabs, short enough for one line on a phone; the heading under them names each in full. */
const TAB_NAMES: Record<SectionId, string> = { quran: 'القرآن', lisan: 'اللسان', hadith: 'الحديث', history: 'السيرة' };

const freshSeed = () => Math.floor(Math.random() * 2 ** 31);
const sectionOf = (kind: FeedQuizKind): SectionId => interestOf(kind)?.section ?? 'quran';

/** Each science's interests as branches, their kinds of question as leaves (shared/interests.ts, one home for both). */
const branchesOf = (section: SectionId): TreeBranch<FeedQuizKind>[] => INTERESTS.filter(interest => interest.section === section)
  .map(interest => ({ id: interest.id, name: interest.name, Icon: QUIZ_ICON[interest.quizzes[0] as FeedKind],
    leaves: interest.quizzes.map(kind => ({ key: kind, name: FEED_QUIZ_NAMES[kind] })) }));

/** The scope a page question asks from: everything, or only what is memorized when «الأسئلة مما أحفظ فقط» is on. */
function useList() {
  const memorized = useSyncExternalStore(subscribeMemorized, readMemorized);
  const only = useSyncExternalStore(memorizedQuestions.subscribe, memorizedQuestions.read);
  return useMemo(() => (memorized && only ? { ...DEFAULT_LIST, filters: withMemorizedScope(DEFAULT_LIST.filters, memorized) } : DEFAULT_LIST), [memorized, only]);
}

/**
 * The quizzes tab (owner, 2026-11-23; sketch quizzes-hub/sketch2-dark.png, the three designs joined): the questions answered
 * wrong and due again («عادت إليك»), then the four sciences, a live question of the one open answered on the page, and under
 * it the science's tree of kinds, a leaf putting its question in the card. The setup («اختبار مخصص») and the party stay.
 */
export default function QuizzesScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const cardAt = useRef(0);
  useTabRetap('quizzes', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  useBooks();
  const [query, setQuery] = useState('');
  const [section, setSection] = useState<SectionId>('quran');
  // The question open in each science, kept while another is looked at.
  const [asked, setAsked] = useState<Partial<Record<SectionId, Asked>>>({});
  // A science opens on a question of one of its short kinds, a different one each visit.
  const [firstSeed] = useState(freshSeed);
  const firstOf = (id: SectionId) => {
    const kinds = branchesOf(id).flatMap(branch => branch.leaves).map(leaf => leaf.key).filter(kind => quizBookOn(kind) && !TALL.includes(kind));
    return kinds.length ? kinds[firstSeed % kinds.length] : undefined;
  };
  const first = firstOf(section);
  const open: Asked | undefined = asked[section] ?? (first ? { kind: first, seed: firstSeed } : undefined);
  const show = (next: Asked) => {
    const id = sectionOf(next.kind);
    setSection(id);
    setAsked(now => ({ ...now, [id]: next }));
    setQuery('');
    scroll.current?.scrollTo({ y: Math.max(0, cardAt.current - 8), animated: true });
  };
  const list = useList();
  const five = (kind: FeedQuizKind) => {
    setRun(startSolo({ ...DEFAULT_SOLO, kinds: [kind as QuizTopic], length: 5, list }));
    router.push('/quiz/play');
  };

  // Searched: every science's kinds whose name or interest's name has the words.
  const typed = bareName(query.trim());
  const found = useMemo(() => !typed ? null : SECTIONS.map(each => ({ ...each, branches: branchesOf(each.id)
    .map(branch => bareName(branch.name).includes(typed) ? branch : { ...branch, leaves: branch.leaves.filter(leaf => bareName(leaf.name).includes(typed)) })
    .filter(branch => branch.leaves.length) })).map(each => ({ ...each, branches: shown(each.branches) })).filter(each => each.branches.length), [typed]);
  function shown(branches: TreeBranch<FeedQuizKind>[]) { return branches.map(branch => ({ ...branch, leaves: branch.leaves.filter(leaf => quizBookOn(leaf.key)) }))
    .filter(branch => branch.leaves.length); }

  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الاختبارات', label: 'ابحث في أنواع الأسئلة' }} />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <Row>
          <Button pill Icon={SlidersHorizontal} label="اختبار مخصص" onPress={() => router.push('/quiz/solo')} />
          <Button pill Icon={Users} label="اختبار جماعي" onPress={() => router.push('/quiz/party')} />
        </Row>
        {found ? (
          found.length ? found.map(each => (
            <View key={each.id} style={{ gap: 10 }}>
              <Heading title={each.name} palette={palette} />
              <QuizKindTree branches={each.branches} onPick={kind => show({ kind, seed: freshSeed() })} palette={palette} />
            </View>
          )) : <Empty text="لا نوع من الأسئلة بهذا الاسم." palette={palette} />
        ) : <>
          <CameBack onOpen={show} palette={palette} />
          <Tabs fill options={SECTIONS.map(each => ({ key: each.id, label: TAB_NAMES[each.id] }))} value={section} onChange={setSection} label="العلوم" palette={palette} />
          <View onLayout={event => { cardAt.current = event.nativeEvent.layout.y; }} style={{ gap: 8 }}>
            {open && <FeedQuiz key={`${open.kind}:${open.seed}`} kind={open.kind} seed={open.seed} sub={interestOf(open.kind)?.name} home={false} palette={palette} />}
            {open && (
              <Row>
                <Button pill Icon={Shuffle} label="سؤال آخر" onPress={() => show({ kind: open.kind, seed: freshSeed() })} />
                <Button pill Icon={ArrowLeft} label="خمسة أسئلة منه" onPress={() => five(open.kind)} />
              </Row>
            )}
          </View>
          <Heading title={`أبواب ${SECTIONS.find(each => each.id === section)!.name}`} line="المس نوعًا يأتِك سؤاله فوق" palette={palette} />
          {first || asked[section]
            ? <QuizKindTree branches={shown(branchesOf(section))} picked={open?.kind} onPick={kind => show({ kind, seed: freshSeed() })} palette={palette} />
            : <Empty text="أسئلة هذا العلم من كتب ليست في مكتبتك. أضفها من «المكتبة» في الرئيسية." palette={palette} />}
        </>}
      </ScrollView>
    </View>
  );
}

function Heading({ title, line, palette }: { title: string; line?: string; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
      <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 19, textAlign: 'right' }}>{title}</Text>
      {line ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{line}</Text> : null}
    </View>
  );
}

/**
 * «عادت إليك» (owner, 2026-11-23): the questions answered wrong whose rest is over (shared/quiz/missedQuestions.ts), each
 * by its own question (an ayah stays hidden until it is asked: its long press would name the answer), a tap putting it in
 * the card. Nothing is counted; with none due the row is not drawn.
 */
function CameBack({ onOpen, palette }: { onOpen: (asked: Asked) => void; palette: Palette }) {
  const missed = useSyncExternalStore(subscribeMissed, readMissed);
  const memorized = useSyncExternalStore(subscribeMemorized, readMemorized);
  const only = useSyncExternalStore(memorizedQuestions.subscribe, memorizedQuestions.read);
  const [now] = useState(Date.now);
  const due = useMemo(() => Object.values(missed).filter(item => item.due <= now && FEED_QUIZ_NAMES[item.kind as FeedQuizKind])
    .sort((a, b) => a.due - b.due).flatMap(item => {
      const kind = item.kind as FeedQuizKind;
      if (!quizBookOn(kind)) return [];
      // The card's own run (HomeFeed feedRun): the same question the tap asks, worked out once.
      const question = feedRun(kind as QuizTopic, item.seed, memorized && only ? memorized : null)?.questions[0];
      return question ? [{ kind, seed: item.seed, prompt: question.promptArabic ?? '' }] : [];
    }), [missed, now, memorized, only]);
  if (!due.length) return null;
  return (
    <View style={{ gap: 8 }}>
      <Heading title="عادت إليك" line="أسئلة أخطأتها، حان وقت مراجعتها" palette={palette} />
      <RowScroll gap={10}>
        {due.map(item => (
          <Card key={`${item.kind}:${item.seed}`} palette={palette} gap={6} style={{ width: 200 }} onPress={() => onOpen(item)}
            accessibilityRole="button" accessibilityLabel={`أجب: ${FEED_QUIZ_NAMES[item.kind]}`}>
            <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{`${FEED_QUIZ_NAMES[item.kind]} · ${interestOf(item.kind)?.name ?? ''}`}</Text>
            <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 16, lineHeight: 26, textAlign: 'right' }}>{item.prompt}</Text>
          </Card>
        ))}
      </RowScroll>
    </View>
  );
}
