import { createContext, useContext, useState, type ReactNode } from 'react';
import { useWindowDimensions, View, type TextStyle, type ViewStyle } from 'react-native';
import { Text } from '@/ui/Text';
import { QURAN_FONT } from '@/lib/theme';
import { CARD_MARGINS, FLOW_LINE, flowFontSize, wordFontSize } from '@shared/quran/quranText/flow';
import { mushafText } from '@shared/quran/mushafText';

/** The font size the AyahFlow around takes from its width (0 outside one). */
const FlowSize = createContext({ size: 0, color: '' });

/** The Quran text size where it is drawn: write boxes and signs beside the words take it too. */
export const useAyahSize = () => useContext(FlowSize).size;

/**
 * Ayah text off the page (owner, 2026-11-19: every ayah view keeps the mushaf's line size and height): the room the words
 * flow in, sized from its own width as the reader's flowing text is (shared/quran/quranText/flow.ts). Its AyahWords (and
 * write boxes, by useAyahSize) take that size; the place sets only colour, never a size.
 */
export default function AyahFlow({ children, color, row = false, center = false, screen: fromScreen = false, lines, style }: { children: ReactNode; color: string;
  /** Pieces side by side, wrapping (words and boxes in a matrix row); otherwise one justified paragraph. */
  row?: boolean;
  /** Lines centred instead of justified: the matrix and compare cards, which centre each ayah under its heading. */
  center?: boolean;
  /** Sized from the screen as the reader is, not from its own width: a narrow lane (two sides of a compare card side by side) keeps the reader's size and wraps sooner. */
  screen?: boolean;
  /** At most this many lines, the rest cut (a note's ayah over its text, a shelf card); not with `row`. */
  lines?: number; style?: ViewStyle }) {
  // Until it has measured its own width, it guesses from the screen's (less a card's margins), so it is drawn at about its
  // height from the first pass: a list that scrolls to an item by its laid-out place finds it there.
  const screen = useWindowDimensions().width;
  const [measured, setMeasured] = useState(0);
  const size = fromScreen ? flowFontSize(screen - CARD_MARGINS) : measured || flowFontSize(screen - CARD_MARGINS);
  return (
    <View style={style} onLayout={event => setMeasured(flowFontSize(event.nativeEvent.layout.width))}>
      <FlowSize.Provider value={{ size, color }}>
        {row
          ? <View style={{ direction: 'rtl', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: center ? 'center' : 'flex-start', columnGap: size * 0.35 }}>{children}</View>
          : <Text numberOfLines={lines} style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * FLOW_LINE, color, textAlign: center ? 'center' : 'justify', writingDirection: 'rtl' }}>{children}</Text>}
      </FlowSize.Provider>
    </View>
  );
}

/** What a place may set on ayah words: colour and marks, never their size or font. */
export type WordLook = Pick<TextStyle, 'color' | 'fontWeight' | 'textDecorationLine' | 'textDecorationColor' | 'backgroundColor'>;

/** Page words in an AyahFlow, at its size (as a paragraph's run, or a piece of a row). */
export function AyahWords({ children, look }: { children: string; look?: WordLook }) {
  const { size, color } = useContext(FlowSize);
  return <Text style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * FLOW_LINE, color, writingDirection: 'rtl', ...look }}>{mushafText(children)}</Text>;
}

/** Where a place may put a word on its own: its room in a row, never its size or font. */
export type WordPlace = Pick<TextStyle, 'flex' | 'flexShrink' | 'minWidth' | 'maxWidth' | 'textAlign' | 'alignSelf'>;

/**
 * A Quran word (or a few) on its own, outside an ayah (owner, 2026-11-20: one word size): a word list's row, the picked
 * word of an i'rab or a word sheet, a reading, a chip. It takes the size an ayah has in a card on a phone
 * (shared/quran/quranText/flow.ts wordFontSize); the place sets colour and its room, never a size.
 */
export function QuranWord({ children, look, place, lines, header = false }: { children: string; look?: WordLook; place?: WordPlace;
  /** At most this many lines, the rest cut. */
  lines?: number;
  /** It names what the sheet is about (a word sheet's word). */
  header?: boolean }) {
  const size = wordFontSize(useWindowDimensions().width);
  return (
    <Text numberOfLines={lines} accessibilityRole={header ? 'header' : undefined}
      style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * FLOW_LINE, writingDirection: 'rtl', ...place, ...look }}>{mushafText(children)}</Text>
  );
}
