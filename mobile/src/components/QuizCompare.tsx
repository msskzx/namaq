// The compare quiz (shared/quiz/compareQuiz.ts) as the matrix only (owner, 2026-11-17: no trees): the given ayah whole, the
// asked ayah with a box wherever it parts from it. Grading, hints and the checked marks follow the tree quiz's.
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFitReport, type OnFit } from '@/lib/useFit';
import { Lightbulb, SquareArrowOutUpLeft, type LucideProps } from 'lucide-react-native';
import { Text, TextInput } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import { markColour } from '@shared/quran/compareCardLook';
import { addCompareHint, blankWords, compareCorrections, compareHintsOf, compareLabel, comparePieces, type CompareAsk, type CompareLine, type Tone } from '@shared/quiz/compareAnswers';
import { neededCut, verdict, type Correction } from '@shared/quiz/feedback';
import type { Hints } from '@shared/quiz/hints';
import { quranText } from '@/lib/quranText';
import { useKeyboardShown } from '@/lib/keyboard';
import { openCompare } from '@/lib/ways';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import Card from '@/ui/Card';

const SIZE = 20;
const quran = (palette: Palette, color?: string) => ({ fontFamily: QURAN_FONT, fontSize: SIZE, lineHeight: SIZE * 1.9, color: color ?? palette.ink });
const toneColour = (tone: Tone, palette: Palette) => markColour(tone === 'written' ? 'exact' : tone, palette, tone === 'written');
const ayahOf = (key: string) => Number(key.split(':')[1]);

type Asked = { compare: CompareAsk };

/** Given words in the app-wide word-match colours: same words terracotta, written differently amber, same root purple. */
const Words = ({ line, at, palette }: { line: CompareLine; at: number[]; palette: Palette }) =>
  <>{at.map(i => <Text key={i} style={quran(palette, toneColour(line.tones[i], palette))}>{quranText(line.words[i])}</Text>)}</>;

/** One ayah of the matrix in its card: its reference above, its words flowing right to left, then its number. */
function Line({ line, palette, children, after }: { line: CompareLine; palette: Palette; children: React.ReactNode; after?: React.ReactNode }) {
  return (
    <Card palette={palette} pad={10} gap={2}>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{compareLabel(line.key)}</Text>
      <View style={{ direction: 'rtl', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 7 }}>
        {children}
        <Text style={quran(palette, palette.muted)}>{num(ayahOf(line.key))}</Text>
      </View>
      {after}
    </Card>
  );
}

function Bar({ label, onPress, Icon, palette }: { label: string; onPress: () => void; Icon: (props: LucideProps) => React.ReactNode; palette: Palette }) {
  return (
    <IconButton Icon={Icon} label={label} onPress={onPress} tone="ink" />
  );
}

/** The buttons under a question, on the right as across the app. */
const Buttons = ({ children }: { children: React.ReactNode }) =>
  <View style={{ direction: 'rtl', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 8 }}>{children}</View>;

/** The question: the given ayah, then the asked one with a box in each part, and the hint bulb. */
export function CompareInputs({ question, typed, onType, palette, header, hints: kept, onHints, onFit }: { question: Asked; typed: string[]; onType: (blank: number, text: string) => void; palette: Palette; header?: React.ReactNode;
  /** The hints shown so far, when the quiz keeps them (solo, so the review can mark them); otherwise they live here. */
  hints?: Hints; onHints?: (hints: Hints) => void;
  /** In a feed card that follows its content: how much taller it is than its room (lib/useFit.ts). */
  onFit?: OnFit;
}) {
  const fit = useFitReport(onFit);
  const ask = question.compare;
  const [own, setOwn] = useState<Hints>({});
  const hints = kept ?? own;
  const shown = useMemo(() => compareHintsOf(ask, hints), [ask, hints]);
  const pieces = useMemo(() => comparePieces(ask), [ask]);
  const typing = useKeyboardShown();
  return (
    <View style={{ flex: 1 }}>
      <ScrollView {...fit} style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        {header}
        <View style={{ gap: 10, padding: 12 }}>
          <Line line={ask.shown} palette={palette}><Words line={ask.shown} at={ask.shown.words.map((_, i) => i)} palette={palette} /></Line>
          <Line line={ask.asked} palette={palette}>
            {pieces.map((piece, i) => 'given' in piece
              ? <Words key={i} line={ask.asked} at={piece.given} palette={palette} />
              : <TextInput key={i} value={typed[piece.blank] ?? ''} onChangeText={text => onType(piece.blank, text)} placeholder={shown[piece.blank]} placeholderTextColor={palette.muted}
                accessibilityLabel={`الفراغ ${num(piece.blank + 1)}`} autoCorrect={false} autoCapitalize="none" spellCheck={false} autoComplete="off"
                style={{ width: 130, minHeight: 40, fontFamily: QURAN_FONT, fontSize: SIZE, color: palette.ink, textAlign: 'right', writingDirection: 'rtl', paddingVertical: 6, borderBottomWidth: 1.5, borderColor: palette.accent }} />)}
          </Line>
        </View>
      </ScrollView>
      {!typing && <Buttons>
        <Bar label="تلميح: حرف آخر من كل فراغ" onPress={() => (onHints ?? setOwn)(addCompareHint(ask, typed, hints))} Icon={Lightbulb} palette={palette} />
      </Buttons>}
    </View>
  );
}

function Badge({ row, palette }: { row: Correction; palette: Palette }) {
  return (
    <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: row.correct ? 'transparent' : palette.accent, borderWidth: row.correct ? 1.5 : 0, borderColor: palette.green }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: row.correct ? palette.green : palette.onAccent }}>{num(row.number)}</Text>
    </View>
  );
}

/** A checked blank under the asked ayah: its number and verdict, a bulb when hinted, and what was typed when wrong. */
function Mark({ row, palette, hinted }: { row: Correction; palette: Palette; hinted: boolean }) {
  const typed = row.typed ? row.typed.split(/\s+/) : [];
  return (
    <View style={{ direction: 'rtl', gap: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Badge row={row} palette={palette} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: palette.ink }}>{verdict(row, true)}</Text>
        {hinted && <Lightbulb size={15} color={palette.muted} accessibilityLabel="بتلميح" />}
      </View>
      {!row.correct && <Text style={{ fontSize: 15, color: palette.muted, textAlign: 'right' }}>
        {'كتبتَ: '}
        {typed.length === 0 ? 'لا شيء' : <Text style={{ fontFamily: QURAN_FONT, fontSize: 17 }}>{typed.map((word, i) => (
          <Text key={i} style={row.marks[i] ? { color: palette.green } : { color: palette.accent, textDecorationLine: 'line-through' }}>{i > 0 ? ' ' : ''}{word}</Text>
        ))}</Text>}
      </Text>}
    </View>
  );
}

/**
 * The checked question: each blank shows its words, the ones enough to type underlined, after its numbered badge, and under the
 * ayah each blank's verdict and what was typed when wrong. The card opens on the compare page.
 */
export function CompareFeedback({ question, typed, palette, header, hints, onFit }: { question: Asked; typed: string[]; palette: Palette; header?: React.ReactNode; hints?: Hints;
  /** In a feed card that follows its content: how much taller it is than its room (lib/useFit.ts). */
  onFit?: OnFit;
}) {
  const fit = useFitReport(onFit);
  const ask = question.compare;
  const rows = useMemo(() => compareCorrections(ask, typed), [ask, typed]);
  const pieces = useMemo(() => comparePieces(ask), [ask]);
  const [shown, asked] = [ask.shown.key, ask.asked.key].map(key => key.split(':').map(Number));
  const open = () => openCompare({ lead: asked[0], other: shown[0], ayat: [asked[1], shown[1]] });
  return (
    <View style={{ flex: 1 }}>
      <ScrollView {...fit} style={{ flex: 1 }}>
        {header}
        <View style={{ gap: 10, padding: 12 }}>
          <Line line={ask.shown} palette={palette}><Words line={ask.shown} at={ask.shown.words.map((_, i) => i)} palette={palette} /></Line>
          <Line line={ask.asked} palette={palette}
            after={<View style={{ gap: 6, marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderColor: palette.rule }}>
              {rows.map(row => <Mark key={row.index} row={row} palette={palette} hinted={!!hints?.[row.index]} />)}
            </View>}>
            {pieces.map((piece, i) => {
              if ('given' in piece) return <Words key={i} line={ask.asked} at={piece.given} palette={palette} />;
              const row = rows[piece.blank];
              const words = blankWords(ask, piece.blank);
              const cut = neededCut(words, row.needed);
              return [<Badge key={`b${i}`} row={row} palette={palette} />, ...words.map((word, at) => (
                <Text key={`${i}:${at}`} style={[quran(palette), at < cut ? { textDecorationLine: 'underline', textDecorationColor: palette.accent } : null]}>{quranText(word)}</Text>
              ))];
            })}
          </Line>
        </View>
      </ScrollView>
      <Buttons>
        <Bar label="افتح في مقارنة السور" onPress={open} Icon={SquareArrowOutUpLeft} palette={palette} />
      </Buttons>
    </View>
  );
}
