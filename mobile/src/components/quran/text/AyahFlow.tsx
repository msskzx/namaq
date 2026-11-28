import { createContext, Fragment, isValidElement, useContext, useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import { View, type TextStyle, type ViewStyle } from 'react-native';
import { usePageWidth } from '@/ui/column';
import { Text } from '@/ui/Text';
import { QURAN_FONT, usePalette, type Palette } from '@/lib/theme';
import { markTone, type WordMark } from '@/lib/marks';
import { CARD_MARGINS, FLOW_LINE, flowFontSize, WORD_GAP, wordFontSize } from '@shared/quran/quranText/flow';
import { mushafText } from '@shared/quran/mushafText';
import { AyahMenuPress, type AyahMenuKeys } from '@/ui/AyahMenuPress';
import QuranLines, { type Piece } from './QuranLines';
import { flowPieces } from '@shared/quran/quranText/flowPieces';

const FlowSize = createContext({ size: 0, color: '' });

export const useAyahSize = () => useContext(FlowSize).size;

export default function AyahFlow({ children, color, menu, row = false, center = false, screen: fromScreen = false, lines, zoom = 1, style }: { children: ReactNode; color: string;
  menu: AyahMenuKeys;
  row?: boolean;
  center?: boolean;
  screen?: boolean;
  lines?: number;
  zoom?: number; style?: ViewStyle }) {
  const screen = usePageWidth();
  const [measured, setMeasured] = useState(0);
  const width = measured || screen - CARD_MARGINS;
  const size = flowFontSize(fromScreen ? screen - CARD_MARGINS : width) * zoom;
  return (
    <AyahMenuPress menu={menu}>
    <View style={style} onLayout={event => setMeasured(event.nativeEvent.layout.width)}>
      <FlowSize.Provider value={{ size, color }}>
        {row
          ? <View style={{ direction: 'rtl', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: center ? 'center' : 'flex-start', columnGap: size * WORD_GAP }}>{children}</View>
          : <FlowText size={size} color={color} center={center} lines={lines} guess={width}>{children}</FlowText>}
      </FlowSize.Provider>
    </View>
    </AyahMenuPress>
  );
}

type Run = { text: string; look?: WordLook; mark?: WordMark; lit: boolean; onPress?: () => void };

function runsOf(node: ReactNode): Run[] {
  if (typeof node === 'string' || typeof node === 'number') return [{ text: String(node), lit: false }];
  if (Array.isArray(node)) return node.flatMap(runsOf);
  if (!isValidElement(node)) return [];
  if (node.type === Fragment) return runsOf((node.props as { children?: ReactNode }).children);
  if (node.type !== AyahWords) throw new Error('AyahFlow draws only AyahWords, text and fragments');
  const { children, look, mark, lit = false, onPress } = node.props as Parameters<typeof AyahWords>[0];
  return [{ text: children, look, mark, lit, onPress }];
}

const BOLD = new Set<TextStyle['fontWeight']>(['700', 'bold']);

const piecesOf = (runs: Run[]): Piece<Run>[] => flowPieces<Run>(runs, text => ({ text, lit: false }))
  .map(piece => ({ text: piece.text, bold: piece.runs.some(run => BOLD.has(run.look?.fontWeight)), words: piece.runs, newLine: piece.newLine }));

function FlowText({ children, size, color, center, lines, guess }: { children: ReactNode; size: number; color: string; center: boolean; lines?: number; guess: number }) {
  const pieces = piecesOf(runsOf(children));
  const palette = usePalette();
  const pressed = pieces.some(piece => piece.words.some(run => run.onPress));
  const style = { fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * FLOW_LINE, color, writingDirection: 'rtl' as const };
  return (
    <QuranLines pieces={pieces} size={size} color={color} guess={guess} center={center} lines={lines} label={pressed ? undefined : mushafText(pieces.map(piece => piece.text).join(' '))}
      between={(before, after) => bandOf(before.words[before.words.length - 1], palette) === bandOf(after.words[0], palette) ? bandOf(after.words[0], palette) : undefined}
      draw={(piece, at) => (
        <Text key={at} style={style}>
          {piece.words.map((run, k) => <AyahWords key={k} look={run.look} mark={run.mark} lit={run.lit} onPress={run.onPress}>{run.text}</AyahWords>)}
        </Text>
      )} />
  );
}

const bandOf = (run: Run, palette: Palette) => run.look?.backgroundColor as string | undefined ?? (run.lit ? palette.highlight : undefined);

export type WordLook = Pick<TextStyle, 'color' | 'fontWeight' | 'textDecorationLine' | 'textDecorationColor' | 'backgroundColor'>;

export function AyahWords({ children, look, mark, lit = false, onPress }: { children: string; look?: WordLook;
  mark?: WordMark;
  lit?: boolean;
  onPress?: () => void }) {
  const { size, color } = useContext(FlowSize);
  const style = { fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * FLOW_LINE, color, writingDirection: 'rtl' as const };
  const word = lit || mark ? <ToneWord style={style} look={look} mark={mark} lit={lit}>{children}</ToneWord> : <Text style={{ ...style, ...look }}>{mushafText(children)}</Text>;
  return onPress ? <Text onPress={onPress} accessibilityRole="link">{word}</Text> : word;
}

function ToneWord({ children, style, look, mark, lit }: { children: string; style: TextStyle; look?: WordLook; mark?: WordMark; lit: boolean }) {
  const palette = usePalette();
  const tone = lit ? { color: palette.onHighlight, backgroundColor: palette.highlight } : { color: (mark && markTone(palette, mark)) || style.color };
  return <Text style={{ ...style, ...tone, ...look }}>{mushafText(children)}</Text>;
}

export const useWordSize = () => wordFontSize(usePageWidth());

export type WordPlace = Pick<TextStyle, 'flex' | 'flexShrink' | 'minWidth' | 'maxWidth' | 'textAlign' | 'alignSelf'>;

export function QuranWord({ children, look, place, lines, header = false }: { children: string; look?: WordLook; place?: WordPlace;
  lines?: number;
  header?: boolean }) {
  const size = useWordSize();
  return (
    <Text numberOfLines={lines} accessibilityRole={header ? 'header' : undefined}
      style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * FLOW_LINE, writingDirection: 'rtl', ...place, ...look }}>{mushafText(children)}</Text>
  );
}

export function TreeText({ ref, children, look, center = false }: { ref?: Ref<ComponentRef<typeof Text>>; children: ReactNode; look?: WordLook; center?: boolean }) {
  const size = useWordSize();
  return <Text ref={ref} style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * FLOW_LINE, writingDirection: 'rtl', textAlign: center ? 'center' : undefined, ...look }}>{children}</Text>;
}

export function MiniQuran({ share, children, look, lines, center = true }: { share: number; children: ReactNode; look?: WordLook; lines?: number; center?: boolean }) {
  const size = useWordSize() * share;
  return <Text numberOfLines={lines} style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * FLOW_LINE, textAlign: center ? 'center' : undefined, ...look }}>{children}</Text>;
}
