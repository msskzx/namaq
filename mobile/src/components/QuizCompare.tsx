import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFitReport, type OnFit } from '@/lib/useFit';
import { BookSearch, SquareArrowOutUpLeft, type LucideProps } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import { addCompareHint, blankWords, compareCorrections, compareHintsOf, compareLabel, comparePieces, type CompareAsk, type CompareLine } from '@shared/quiz/compareAnswers';
import { neededCut, verdict, type Correction } from '@shared/quiz/feedback';
import type { Hints } from '@shared/quiz/hints';
import { useKeyboardShown } from '@/lib/keyboard';
import { openCompare } from '@/lib/ways';
import { type Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';
import IconButton from '@/ui/IconButton';
import Card, { UnderCard } from '@/ui/Card';
import { BlankBoxes } from './quran/text/WriteBoxes';
import { useWriteBlanks } from './recite/useRecite';
import { writeBlank } from '@shared/quiz/writeBlanks';
import QuizSources from './QuizSources';
import type { QuizSource } from '@shared/quiz/sources';

const ayahOf = (key: string) => Number(key.split(':')[1]);

type Asked = { compare: CompareAsk; sources?: QuizSource[] };

const Words = ({ line, at, palette }: { line: CompareLine; at: number[]; palette: Palette }) =>
  <>{at.map(i => <AyahWords key={i} mark={line.tones[i] && { kind: line.tones[i]! }} look={line.tones[i] ? undefined : { color: palette.ink }}>{line.words[i]}</AyahWords>)}</>;

function Line({ line, palette, children, after }: { line: CompareLine; palette: Palette; children: React.ReactNode; after?: React.ReactNode }) {
  return (
    <Card palette={palette} pad={10} gap={2}>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{compareLabel(line.key)}</Text>
      <AyahFlow row color={palette.ink} menu={false}>
        {children}
        <AyahWords look={{ color: palette.muted }}>{num(ayahOf(line.key))}</AyahWords>
      </AyahFlow>
      {after}
    </Card>
  );
}

function Bar({ label, onPress, Icon }: { label: string; onPress: () => void; Icon: (props: LucideProps) => React.ReactNode; palette: Palette }) {
  return (
    <IconButton Icon={Icon} label={label} onPress={onPress} tone="ink" />
  );
}

const Buttons = ({ children }: { children: React.ReactNode }) =>
  <UnderCard><View style={{ direction: 'rtl', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 8 }}>{children}</View></UnderCard>;

export function CompareInputs({ question, typed, onType, palette, header, hints: kept, onHints, onFit }: { question: Asked; typed: string[]; onType: (blank: number, text: string) => void; palette: Palette; header?: React.ReactNode;
  hints?: Hints; onHints?: (hints: Hints) => void;
  onFit?: OnFit;
}) {
  const fit = useFitReport(onFit);
  const ask = question.compare;
  const [own, setOwn] = useState<Hints>({});
  const hints = kept ?? own;
  const shown = useMemo(() => compareHintsOf(ask, hints), [ask, hints]);
  const pieces = useMemo(() => comparePieces(ask), [ask]);
  const blanks = useMemo(() => ask.blanks.map((_, blank) => writeBlank(blank, blankWords(ask, blank))), [ask]);
  const write = useWriteBlanks({ id: `${ask.card}:${ask.asked.key}`, blanks, texts: typed, onType });
  const typing = useKeyboardShown();
  return (
    <View style={{ flex: 1 }}>
      {write.field}
      <ScrollView {...fit} style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        {header}
        <View style={{ gap: 10, padding: 12 }}>
          <Line line={ask.shown} palette={palette}><Words line={ask.shown} at={ask.shown.words.map((_, i) => i)} palette={palette} /></Line>
          <Line line={ask.asked} palette={palette}>
            {pieces.map((piece, i) => 'given' in piece
              ? <Words key={i} line={ask.asked} at={piece.given} palette={palette} />
              : <BlankBoxes key={i} blank={blanks[piece.blank]} index={piece.blank} write={write} palette={palette} hint={shown[piece.blank]} name={`الفراغ ${num(piece.blank + 1)}`} />)}
          </Line>
        </View>
      </ScrollView>
      {!typing && <Buttons>
        <Bar label="تلميح: حرف آخر من كل فراغ" onPress={() => (onHints ?? setOwn)(addCompareHint(ask, typed, hints))} Icon={BookSearch} palette={palette} />
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

function Mark({ row, palette, hinted }: { row: Correction; palette: Palette; hinted: boolean }) {
  const typed = row.typed ? row.typed.split(/\s+/) : [];
  return (
    <View style={{ direction: 'rtl', gap: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Badge row={row} palette={palette} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: palette.ink }}>{verdict(row, true)}</Text>
        {hinted && <BookSearch size={15} color={palette.muted} accessibilityLabel="بتلميح" />}
      </View>
      {!row.correct && <Text style={{ fontSize: 15, color: palette.muted, textAlign: 'right' }}>
        {'كتبتَ: '}
        {typed.length === 0 ? 'لا شيء' : <Text style={{ fontSize: 17 }}>{typed.map((word, i) => (
          <Text key={i} style={row.marks[i] ? { color: palette.green } : { color: palette.accent, textDecorationLine: 'line-through' }}>{i > 0 ? ' ' : ''}{word}</Text>
        ))}</Text>}
      </Text>}
    </View>
  );
}

export function CompareFeedback({ question, typed, palette, header, hints, onFit }: { question: Asked; typed: string[]; palette: Palette; header?: React.ReactNode; hints?: Hints;
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
                <AyahWords key={`${i}:${at}`} look={at < cut ? { textDecorationLine: 'underline', textDecorationColor: palette.accent } : undefined}>{word}</AyahWords>
              ))];
            })}
          </Line>
          <QuizSources sources={question.sources} palette={palette} />
        </View>
      </ScrollView>
      <Buttons>
        <Bar label="افتح في مقارنة السور" onPress={open} Icon={SquareArrowOutUpLeft} palette={palette} />
      </Buttons>
    </View>
  );
}
