import { Fragment, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useFitReport, type OnFit } from '@/lib/useFit';
import { Text } from '@/ui/Text';
import { Bookmark, Lightbulb, Send, SquareArrowOutUpLeft, UnfoldHorizontal, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { ayatLabel, branchesHref, keys, shownAyat, type Branch, type Variant } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import { branchNodes, givenAnswer, leadingSigns } from '@shared/quiz/branchAnswers';
import { correctionOf, gradedTree, verdict, type Correction } from '@shared/quiz/feedback';
import { emptyBranchAnswers, isAsked, type ScoredQuestion } from '@shared/quiz/score';
import { addHint, hintsOf, type Hints } from '@shared/quiz/hints';
import MatrixCard, { MatrixShare } from './MatrixCard';
import { shareCard } from '@/lib/shareImage';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { ayahOf, isSaved, toggleSaved, type Presentation } from '@/lib/branches';
import { WEBSITE } from '@/lib/website';
import { EMPTY_LIST, listShowing } from '@/lib/branchList';
import type { Size } from '@/lib/camera';
import { around as aroundSetting } from '@/lib/settings';
import { useKeyboardShown } from '@/lib/keyboard';
import { type Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';
import { toTab } from '@/lib/ways';
import Card, { UnderCard } from '@/ui/Card';
import { BlankBoxes } from './MushafPageView';
import { useWriteBlanks, type WriteBlanks } from './recite/useRecite';
import { writeBlank, type WriteBlank } from '@shared/quiz/writeBlanks';
import QuizSources from './QuizSources';
import type { QuizSource } from '@shared/quiz/sources';

export type TreeQuestion = ScoredQuestion & { tree: Branch; prefixes?: Variant[]; sources?: QuizSource[] };


/** The ayah signs an asked node opens with (﴿١٧﴾ where its ayah reads on into the next): given before its boxes, never typed. */
function LeadingSigns({ node, palette }: { node: Branch; palette: Palette }) {
  const signs = leadingSigns(node.words);
  return signs.length ? <AyahWords look={{ color: palette.muted }}>{signs.join(' ')}</AyahWords> : null;
}

/** The asked nodes as blanks to write: a leaf's first two words, or all the words of a node above leaves. */
export function treeBlanks(question: TreeQuestion): WriteBlank[] {
  const nodes = branchNodes(question.tree);
  return nodes.flatMap((node, index) => isAsked(question, index) ? [writeBlank(index, node.words, node.children.length > 0)] : []);
}

type MatrixRow = { leaf: Branch; path: number[]; words: string[]; before: string[]; ayahKeys: string[] };

/**
 * The question's leaves in branchNodes order (each child, then its own children), each with the nodes above it: one row per
 * ayah ending, split where its ayat open with different words before the tree (يطوف / ويطوف), so every row reads its whole
 * ayah as the tree does.
 */
function rowsOf(tree: Branch, prefixes: Variant[]): MatrixRow[] {
  const rows: MatrixRow[] = [];
  let next = 0;
  const walk = (node: Branch, path: number[], words: string[]) => node.children.forEach(child => {
    const index = next++;
    const here = [...path, index];
    if (!child.children.length) {
      const byBefore = new Map<string, { before: string[]; ayahKeys: string[] }>();
      for (const key of child.ayat.length ? child.ayat : keys(child)) {
        const prefix = prefixes.find(item => item.keys.includes(key));
        const before = prefix?.words ?? (prefix?.word ? prefix.word.split(' ') : []);
        const id = before.join(' ');
        byBefore.set(id, { before, ayahKeys: [...byBefore.get(id)?.ayahKeys ?? [], key] });
      }
      for (const { before, ayahKeys } of byBefore.values()) rows.push({ leaf: child, path: here, words, before, ayahKeys });
    }
    walk(child, here, [...words, ...child.words]);
  });
  walk(tree, [], tree.words);
  return rows;
}

/**
 * The matrix view of a question: one row per ayah, the shared start in colour, and each asked node's words as recite mode's
 * boxes (BlankBoxes). Without `write` (the settings' example) the boxes show where you write, without taking typing.
 */
export function MatrixInputs({ question, values, hints, write, palette, names }: { question: TreeQuestion; values: string[]; hints: string[]; write?: WriteBlanks; palette: Palette; names: Record<number, string> }) {
  const rows = useMemo(() => rowsOf(question.tree, question.prefixes ?? []), [question.tree, question.prefixes]);
  const nodes = useMemo(() => branchNodes(question.tree), [question.tree]);
  const blanks = useMemo(() => treeBlanks(question), [question]);
  return (
    <View style={{ gap: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
      {rows.map(({ leaf, path, words, before, ayahKeys }) => {
        // Named as on the tree: a row that runs on into the next ayah or surah names that one too.
        const spans = shownAyat(leaf, words);
        const label = ayahKeys.map(key => ayatLabel(spans[key], names)).join(' · ');
        return (
          <Card key={`${path.join('-')}:${ayahKeys[0]}`} palette={palette} pad={10} gap={2}>
            {label ? <Text style={{ color: palette.muted, fontSize: 13 }}>{label}</Text> : null}
            <AyahFlow row color={palette.ink}>
              {before.length > 0 && <AyahWords>{before.join(' ')}</AyahWords>}
              <AyahWords look={{ color: palette.accent, fontWeight: '700' }}>{givenAnswer(question.tree)}</AyahWords>
              {path.map(index => {
                const at = blanks.findIndex(blank => blank.id === index);
                return at < 0
                  ? <AyahWords key={index}>{values[index]}</AyahWords>
                  : <Fragment key={index}>
                    <LeadingSigns node={nodes[index]} palette={palette} />
                    <BlankBoxes blank={blanks[at]} index={at} write={write} palette={palette} hint={hints[index]} name={`الطرف ${num(at + 1)}`} />
                  </Fragment>;
              })}
            </AyahFlow>
          </Card>
        );
      })}
    </View>
  );
}

/**
 * The question with an empty box in each asked node; the other nodes are given. Drawn as the matrix only: quizzes leave the
 * tree to the rest of the app, where it helps to see (owner, 2026-11-17).
 */
export function QuizInputs({ question, typed, onType, palette, names, header, hints: kept, onHints, onFit }: { question: TreeQuestion; typed: string[]; onType: (node: number, text: string) => void; palette: Palette; names: Record<number, string>; header?: React.ReactNode;
  /** The hints shown so far, when the quiz keeps them (solo, so the review can mark them); otherwise they live here. */
  hints?: Hints; onHints?: (hints: Hints) => void;
  /** In a feed card that follows its content: how much taller it is than its room (lib/useFit.ts). */
  onFit?: OnFit;
}) {
  const fit = useFitReport(onFit);
  const values = emptyBranchAnswers(question).map((given, index) => isAsked(question, index) ? typed[index] ?? '' : given);
  const [own, setOwn] = useState<Hints>({});
  const hints = kept ?? own;
  const shown = useMemo(() => hintsOf(question, hints), [question, hints]);
  const hint = () => (onHints ?? setOwn)(addHint(question, values, hints));
  const blanks = useMemo(() => treeBlanks(question), [question]);
  const write = useWriteBlanks({ id: JSON.stringify(question.asked) + givenAnswer(question.tree), blanks, texts: values, onType });
  const typing = useKeyboardShown();
  return (
    <View style={{ flex: 1 }}>
      {write.field}
      <ScrollView {...fit} style={{ flex: 1 }} keyboardShouldPersistTaps="handled">{header}<MatrixInputs question={question} values={values} hints={shown} write={write} palette={palette} names={names} /></ScrollView>
      {/* The buttons sit on the right, as action buttons do across the app (owner, 2026-11-17). */}
      {!typing && <UnderCard><View style={{ direction: 'rtl', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 8 }}>
        <Bar label="تلميح: حرف آخر من كل طرف فارغ" onPress={hint} Icon={Lightbulb} palette={palette} />
      </View></UnderCard>}
    </View>
  );
}

function Badge({ row, palette }: { row: Correction; palette: Palette }) {
  return (
    <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: row.correct ? 'transparent' : palette.accent, borderWidth: row.correct ? 1.5 : 0, borderColor: palette.green }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: row.correct ? palette.green : palette.onAccent }}>{num(row.number)}</Text>
    </View>
  );
}

/** What was typed for a wrong answer: each right word green, each wrong one struck through. */
function Typed({ row, palette }: { row: Correction; palette: Palette }) {
  const typed = row.typed ? row.typed.split(/\s+/) : [];
  return (
    <Text style={{ fontSize: 15, color: palette.muted, textAlign: 'right' }}>
      {'كتبتَ: '}
      {typed.length === 0 ? 'لا شيء' : <Text style={{ fontSize: 17 }}>{typed.map((word, i) => (
        <Text key={i} style={row.marks[i] ? { color: palette.green } : { color: palette.accent, textDecorationLine: 'line-through' }}>{i > 0 ? ' ' : ''}{word}</Text>
      ))}</Text>}
    </Text>
  );
}

/** A checked answer under its ayah in the matrix: the same mark and verdict as in the tree, and what was typed when wrong. */
function MatrixMark({ row, palette, hinted }: { row: Correction; palette: Palette; hinted?: boolean }) {
  return (
    <View style={{ direction: 'rtl', gap: 2, marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderColor: palette.rule }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Badge row={row} palette={palette} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: palette.ink }}>{verdict(row, true)}</Text>
        {hinted && <Lightbulb size={15} color={palette.muted} accessibilityLabel="بتلميح" />}
      </View>
      {!row.correct && <Typed row={row} palette={palette} />}
    </View>
  );
}

function Bar({ label, onPress, Icon, palette, on, fill }: { label: string; onPress: () => void; Icon: (props: LucideProps) => React.ReactNode; palette: Palette; on?: boolean; fill?: boolean }) {
  return (
    <Pressable onPress={onPress} hitSlop={4} accessibilityRole="button" accessibilityLabel={label} accessibilityState={on === undefined ? undefined : { selected: on }}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: on ? 1 : 0, borderColor: palette.accent }}>
      <Icon size={22} color={on || fill ? palette.accent : palette.ink} {...(fill ? { fill: palette.accent } : {})} />
    </Pressable>
  );
}

/** Save, share and open the tree, as under a branches card; by its phrase, or the branches tree that carries it. */
function TreeActions({ phrase, text, palette, onShare }: { phrase: string; text: string; palette: Palette; onShare: (link: string) => void }) {
  // Finding the branches tree can take a moment, so the answer shows first.
  const [piece, setPiece] = useState<BranchPiece | undefined>(undefined);
  useEffect(() => {
    setPiece(undefined);
    const timer = setTimeout(() => setPiece(listShowing(EMPTY_LIST, phrase)?.piece), 0);
    return () => clearTimeout(timer);
  }, [phrase]);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const saved = piece ? isSaved(piece, bookmarks) : bookmarks.some(bookmark => bookmark.id === phrase);
  const save = () => piece ? toggleSaved(piece) : toggleBookmark({ id: phrase, text, href: branchesHref(phrase) });
  const share = () => onShare(`${text}\n${WEBSITE}${branchesHref(piece?.id ?? phrase)}`);
  return <>
    <Bar label={saved ? 'إزالة من المحفوظات' : 'حفظ الشجرة'} onPress={save} Icon={Bookmark} palette={palette} fill={saved} />
    <Bar label="مشاركة" onPress={share} Icon={Send} palette={palette} />
    {piece && <Bar label="افتح في متشابهات القرآن" onPress={() => toTab({ pathname: '/branches', params: { tree: piece.id } })} Icon={SquareArrowOutUpLeft} palette={palette} />}
  </>;
}

/**
 * The graded answer as the matrix: each ayah's row with how its asked node was graded. A tap on a word lights its matches and
 * nothing else (owner, 2026-11-19: no sheet over the light); each row's book button opens it in the reader. It can show the
 * surrounding ayat, and be saved, shared or opened on the branches tab.
 */
const NO_SHEET = () => {};

export function QuizFeedback({ question, typed, palette, names: _names, header, hints, onFit }: { question: TreeQuestion; typed: string[]; palette: Palette; names: Record<number, string>; header?: React.ReactNode;
  /** The hints used on this question, marked with a small bulb. */
  hints?: Hints;
  /** In a feed card that follows its content: how much taller it is than its room (lib/useFit.ts). */
  onFit?: OnFit;
}) {
  // Graded once per question and answer: a party sends a new copy of the same question with every update, and an
  // unanswered question comes with a new empty answer each render, which must not rebuild the matrix.
  const snapshot = JSON.stringify({ question, typed });
  const { graded, presentation } = useMemo(() => {
    const given = JSON.parse(snapshot) as { question: TreeQuestion; typed: string[] };
    const graded = gradedTree(given.question, given.typed);
    const presentation: Presentation = { tree: graded.tree, prefixes: given.question.prefixes ?? [], offsets: {}, ayat: keys(graded.tree).flatMap(key => ayahOf(key) ?? []) };
    return { graded, presentation };
  }, [snapshot]);
  // This card's own switch, opening on the settings' default.
  const [around, setAround] = useState(aroundSetting.get);
  const [size, setSize] = useState<Size | null>(null);
  const share = (link: string) => shareCard({ content: width => <MatrixShare presentation={presentation} palette={palette} width={width} />, link });
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {header}
        <View style={{ flex: 1 }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
          {size && <MatrixCard presentation={presentation} palette={palette} view={size} around={around} onTap={NO_SHEET} onMove={() => {}} onFit={onFit}
            note={key => { const row = correctionOf(graded.rows, key); return row ? <MatrixMark row={row} palette={palette} hinted={!!hints?.[row.index]} /> : null; }} />}
        </View>
        {/* Where the leaves come from: the mushaf, and the book that sets the ayat side by side (owner, 2026-11-19). */}
        {!!question.sources?.length && <View style={{ paddingHorizontal: 12, paddingTop: 8 }}><QuizSources sources={question.sources} palette={palette} /></View>}
      </View>
      <UnderCard><View style={{ direction: 'rtl', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 2 }}>
        {question.phrase && <TreeActions phrase={question.phrase} text={question.tree.words.join(' ')} palette={palette} onShare={share} />}
        <Bar label="الآيات المحيطة" onPress={() => setAround(!around)} Icon={UnfoldHorizontal} palette={palette} on={around} />
      </View></UnderCard>
    </View>
  );
}
