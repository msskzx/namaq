import { useMemo, useRef } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import type { Branch, Variant } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { givenAnswer } from '@shared/quiz/branchAnswers';
import { gradedTree, neededCut, verdict, type Correction } from '@shared/quiz/feedback';
import { emptyBranchAnswers, isAsked, type ScoredQuestion } from '@shared/quiz/score';
import BranchTree, { type RenderNode } from './BranchTree';
import { QURAN_FONT, type Palette } from '@/lib/theme';

export type TreeQuestion = ScoredQuestion & { tree: Branch; prefixes?: Variant[] };

const NO_MATCHES = {};

/**
 * Scrolls a tree both ways; quiz trees are small, so they are drawn at full size with no zoom.
 * The root is on the right, so a tree wider than the phone opens scrolled to its right end.
 */
function Scroller({ children }: { children: React.ReactNode }) {
  const sideways = useRef<{ scrollToEnd: (options?: { animated?: boolean }) => void } | null>(null);
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
      <ScrollView ref={sideways as never} horizontal style={{ direction: 'ltr' }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => sideways.current?.scrollToEnd({ animated: false })}>
        {children}
      </ScrollView>
    </ScrollView>
  );
}

function Tree({ question, tree, palette, names, renderNode, onTap }: { question: TreeQuestion; tree: Branch; palette: Palette; names: Record<number, string>; renderNode: RenderNode; onTap?: (keys: string[]) => void }) {
  const presentation = useMemo(() => ({ tree, prefixes: question.prefixes ?? [], offsets: {}, ayat: [] }), [tree, question.prefixes]);
  return <BranchTree presentation={presentation} matches={NO_MATCHES} names={names} palette={palette} onTap={onTap ?? (() => {})} renderNode={renderNode} />;
}

/** The tree with an empty box in each asked node; the other nodes are given. */
export function QuizInputs({ question, typed, onType, palette, names }: { question: TreeQuestion; typed: string[]; onType: (node: number, text: string) => void; palette: Palette; names: Record<number, string> }) {
  const values = emptyBranchAnswers(question).map((given, index) => isAsked(question, index) ? typed[index] ?? '' : given);
  const asked = question.asked ?? [];
  const renderNode: RenderNode = (node, index) => !isAsked(question, index)
    ? <Text style={{ fontFamily: QURAN_FONT, fontSize: 19, lineHeight: 36, color: palette.muted, textAlign: 'center' }}>{mushafText(givenAnswer(node))}</Text>
    : <TextInput value={values[index]} onChangeText={text => onType(index, text)}
        accessibilityLabel={`الطرف ${num(asked.indexOf(index) + 1)}`}
        autoCorrect={false} autoCapitalize="none" spellCheck={false} autoComplete="off"
        style={{ width: 150, minHeight: 40, fontSize: 18, color: palette.ink, textAlign: 'right', writingDirection: 'rtl', paddingVertical: 6, borderBottomWidth: 1.5, borderColor: palette.accent }} />;
  return <Scroller><Tree question={question} tree={question.tree} palette={palette} names={names} renderNode={renderNode} /></Scroller>;
}

function Badge({ row, palette }: { row: Correction; palette: Palette }) {
  return (
    <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: row.correct ? 'transparent' : palette.accent, borderWidth: row.correct ? 1.5 : 0, borderColor: palette.green }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: row.correct ? palette.green : palette.onAccent }}>{num(row.number)}</Text>
    </View>
  );
}

/** One asked node after checking: verdict, the node's words with the ones enough to type underlined, and what was typed when wrong. */
function Graded({ row, palette }: { row: Correction; palette: Palette }) {
  const cut = neededCut(row.node.words, row.needed);
  const typed = row.typed ? row.typed.split(/\s+/) : [];
  return (
    <View style={{ maxWidth: 220, gap: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Badge row={row} palette={palette} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: palette.ink }}>{verdict(row, true)}</Text>
      </View>
      <Text style={{ fontFamily: QURAN_FONT, fontSize: 19, lineHeight: 36, color: palette.ink, textAlign: 'right', writingDirection: 'rtl' }}>
        <Text style={{ textDecorationLine: 'underline', textDecorationColor: palette.accent }}>{mushafText(row.node.words.slice(0, cut).join(' '))}</Text>
        {cut < row.node.words.length ? ` ${mushafText(row.node.words.slice(cut).join(' '))}` : ''}
      </Text>
      {!row.correct && (
        <Text style={{ fontSize: 15, color: palette.muted, textAlign: 'right' }}>
          {'كتبتَ: '}
          {typed.length === 0 ? 'لا شيء' : typed.map((word, i) => (
            <Text key={i} style={i < row.right ? { color: palette.green } : { color: palette.accent, textDecorationLine: 'line-through' }}>{i > 0 ? ' ' : ''}{word}</Text>
          ))}
        </Text>
      )}
    </View>
  );
}

/** The answer tree: each asked node shows how it was graded; tapping a node opens its ayat. */
export function QuizFeedback({ question, typed, palette, names, onTap }: { question: TreeQuestion; typed: string[]; palette: Palette; names: Record<number, string>; onTap?: (keys: string[]) => void }) {
  const graded = useMemo(() => gradedTree(question, typed), [question, typed]);
  const rows = useMemo(() => new Map(graded.rows.map(row => [row.index, row])), [graded]);
  const renderNode: RenderNode = (_, index) => {
    const row = rows.get(index);
    return row ? <Graded row={row} palette={palette} /> : undefined;
  };
  return <Scroller><Tree question={question} tree={graded.tree} palette={palette} names={names} renderNode={renderNode} onTap={onTap} /></Scroller>;
}
