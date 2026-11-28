import { Fragment, useState, type ReactNode } from 'react';
import { useWindowDimensions, View, type LayoutChangeEvent } from 'react-native';
import { Text } from '@/ui/Text';
import { QURAN_FONT } from '@/lib/theme';
import { breakLines } from '@/lib/pageZoom';
import { FLOW_LINE, WORD_GAP } from '@shared/quran/quranText/flow';
import { mushafText } from '@shared/quran/mushafText';

export function QuranLine({ spread, width, scale = 1, gap, origin = 'right', children }: { spread: boolean; width: number; scale?: number; gap: number;
  origin?: 'right' | 'center'; children: ReactNode }) {
  return (
    <View style={spread
      ? { width: width / scale, flexShrink: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', transform: [{ scaleX: scale }], transformOrigin: origin }
      : { flexDirection: 'row', alignItems: 'center', gap }}>
      {children}
    </View>
  );
}

const BASE = 40;
const MEASURE_ROOM = 100 * BASE;
const widths = new Map<string, number>();
const ELLIPSIS = '…';

export type Piece<W> = { text: string; bold: boolean; words: W[]; newLine?: boolean };

const paragraphs = (pieces: { newLine?: boolean }[]) => pieces.reduce<[number, number][]>((list, piece, at) =>
  piece.newLine || !list.length ? [...list, [at, at + 1]] : [...list.slice(0, -1), [list[list.length - 1][0], at + 1]], []);

const widthKey = (piece: { text: string; bold: boolean }, scale: number) => `${scale}${piece.bold ? 'b' : 'r'}${piece.text}`;

export default function QuranLines<W>({ pieces, size, color, draw, between, center = false, lines, label, guess = 0 }: { pieces: Piece<W>[]; size: number; color: string;
  draw: (piece: Piece<W>, at: number) => ReactNode;
  between?: (before: Piece<W>, after: Piece<W>) => string | undefined;
  center?: boolean;
  lines?: number;
  label?: string;
  guess?: number }) {
  const { fontScale } = useWindowDimensions();
  const [width, setWidth] = useState(guess);
  const [, setKnown] = useState(0);
  const key = (piece: { text: string; bold: boolean }) => widthKey(piece, fontScale);
  const unknown = [...new Map([...pieces, { text: ELLIPSIS, bold: false }].filter(piece => !widths.has(key(piece))).map(piece => [key(piece), piece])).values()];
  const learn = (piece: { text: string; bold: boolean }) => (event: LayoutChangeEvent) => {
    widths.set(key(piece), event.nativeEvent.layout.width);
    setKnown(widths.size);
  };
  const gap = WORD_GAP * size;
  const line = size * FLOW_LINE * fontScale;
  const sized = (piece: { text: string; bold: boolean }) => ((widths.get(key(piece)) ?? 0) * size) / BASE;
  const span = (from: number, to: number) => pieces.slice(from, to).reduce((sum, piece) => sum + sized(piece), 0) + (to - from - 1) * gap;
  const ready = !unknown.length && width > 0;
  const starts = ready ? paragraphs(pieces).flatMap(([from, to]) => breakLines(pieces.slice(from, to).map(sized), width, gap).map(at => at + from)) : [];
  const rows = starts.map((from, n) => ({ from, to: starts[n + 1] ?? pieces.length }));
  const cut = !!lines && rows.length > lines;
  const room = width - gap - sized({ text: ELLIPSIS, bold: false });
  const fit = (from: number, to: number): number => to - from > 1 && span(from, to) > room ? fit(from, to - 1) : to;
  const shown = cut ? rows.slice(0, lines).map((row, n) => n === lines - 1 ? { ...row, to: fit(row.from, row.to) } : row) : rows;
  return (
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{ direction: 'rtl', minHeight: line }}
      accessible={!!label} accessibilityLabel={label}>
      {unknown.length > 0 && (
        <View style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, overflow: 'hidden', opacity: 0 }} pointerEvents="none"
          accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={{ position: 'absolute', top: 0, right: 0, width: MEASURE_ROOM, alignItems: 'flex-end' }}>
            {unknown.map(piece => (
              <View key={key(piece)} onLayout={learn(piece)}>
                <Text style={{ fontFamily: QURAN_FONT, fontSize: BASE, fontWeight: piece.bold ? '700' : 'normal' }}>{mushafText(piece.text)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {shown.map(({ from, to }, n) => {
        const more = cut && n === shown.length - 1;
        const last = n === shown.length - 1 || !!pieces[to]?.newLine;
        const drawn = span(from, to);
        const spread = drawn > width || (!center && !last);
        return (
          <View key={n} style={{ height: line, flexDirection: 'row', alignItems: 'center', justifyContent: center ? 'center' : 'flex-start' }}>
            <QuranLine spread={spread} width={width} scale={Math.min(1, width / drawn)} gap={0} origin={center ? 'center' : 'right'}>
              {pieces.slice(from, to).map((piece, at) => [
                at > 0 && <View key={`${from + at}-`} style={{ alignSelf: 'stretch', ...(spread ? { flexGrow: 1 } : { width: gap }), backgroundColor: between?.(pieces[from + at - 1], piece) }} />,
                <Fragment key={from + at}>{draw(piece, from + at)}</Fragment>,
              ])}
              {more && <View style={{ width: gap }} />}
              {more && <Text style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: line, color }}>{ELLIPSIS}</Text>}
            </QuranLine>
          </View>
        );
      })}
    </View>
  );
}
