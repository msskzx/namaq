import { useState, type ReactNode } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
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

const widthKey = (piece: { text: string; bold: boolean }) => `${piece.bold ? 'b' : 'r'}${piece.text}`;

export default function QuranLines<W>({ pieces, size, draw, center = false, lines, label }: { pieces: Piece<W>[]; size: number;
  draw: (piece: Piece<W>, at: number) => ReactNode;
  center?: boolean;
  lines?: number;
  label?: string }) {
  const [width, setWidth] = useState(0);
  const [, setKnown] = useState(0);
  const unknown = [...new Map([...pieces, { text: ELLIPSIS, bold: false }].filter(piece => !widths.has(widthKey(piece))).map(piece => [widthKey(piece), piece])).values()];
  const learn = (piece: { text: string; bold: boolean }) => (event: LayoutChangeEvent) => {
    widths.set(widthKey(piece), event.nativeEvent.layout.width);
    setKnown(widths.size);
  };
  const gap = WORD_GAP * size;
  const sized = (piece: { text: string; bold: boolean }) => ((widths.get(widthKey(piece)) ?? 0) * size) / BASE;
  const ready = !unknown.length && width > 0;
  const starts = ready ? paragraphs(pieces).flatMap(([from, to]) => breakLines(pieces.slice(from, to).map(sized), width, gap).map(at => at + from)) : [];
  const rows = starts.map((from, n) => ({ from, to: starts[n + 1] ?? pieces.length }));
  const cut = !!lines && rows.length > lines;
  const shown = cut ? rows.slice(0, lines) : rows;
  return (
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{ direction: 'rtl', minHeight: size * FLOW_LINE }}
      accessible={!!label} accessibilityLabel={label}>
      {unknown.length > 0 && (
        <View style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, overflow: 'hidden', opacity: 0 }} pointerEvents="none"
          accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={{ position: 'absolute', top: 0, right: 0, width: MEASURE_ROOM, alignItems: 'flex-end' }}>
            {unknown.map(piece => (
              <View key={widthKey(piece)} onLayout={learn(piece)}>
                <Text style={{ fontFamily: QURAN_FONT, fontSize: BASE, fontWeight: piece.bold ? '700' : 'normal' }}>{mushafText(piece.text)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {shown.map(({ from, to }, n) => {
        const last = n === shown.length - 1 || !!pieces[to]?.newLine;
        const more = cut && last;
        const drawn = pieces.slice(from, to).reduce((sum, piece) => sum + sized(piece), 0) + (to - from - 1) * gap + (more ? gap + sized({ text: ELLIPSIS, bold: false }) : 0);
        const spread = drawn > width || (!center && (!last || more));
        return (
          <View key={n} style={{ height: size * FLOW_LINE, flexDirection: 'row', alignItems: 'center', justifyContent: center ? 'center' : 'flex-start' }}>
            <QuranLine spread={spread} width={width} scale={Math.min(1, width / drawn)} gap={gap}>
              {pieces.slice(from, to).map((piece, at) => draw(piece, from + at))}
              {more && <Text style={{ fontFamily: QURAN_FONT, fontSize: size }}>{ELLIPSIS}</Text>}
            </QuranLine>
          </View>
        );
      })}
    </View>
  );
}
