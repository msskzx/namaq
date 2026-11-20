import { createContext, useContext, useState, type ReactNode } from 'react';
import { useWindowDimensions, View, type TextStyle, type ViewStyle } from 'react-native';
import { Text } from '@/ui/Text';
import { QURAN_FONT } from '@/lib/theme';
import { FLOW_LINE, flowFontSize } from '@shared/quran/quranText/flow';
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
export default function AyahFlow({ children, color, row = false, center = false, screen: fromScreen = false, style }: { children: ReactNode; color: string;
  /** Pieces side by side, wrapping (words and boxes in a matrix row); otherwise one justified paragraph. */
  row?: boolean;
  /** Lines centred instead of justified: the matrix and compare cards, which centre each ayah under its heading. */
  center?: boolean;
  /** Sized from the screen as the reader is, not from its own width: a narrow lane (two sides of a compare card side by side) keeps the reader's size and wraps sooner. */
  screen?: boolean; style?: ViewStyle }) {
  // Until it has measured its own width, it guesses from the screen's (less a card's margins), so it is drawn at about its
  // height from the first pass: a list that scrolls to an item by its laid-out place finds it there.
  const screen = useWindowDimensions().width;
  const [measured, setMeasured] = useState(0);
  const size = fromScreen ? flowFontSize(screen - 64) : measured || flowFontSize(screen - 64);
  return (
    <View style={style} onLayout={event => setMeasured(flowFontSize(event.nativeEvent.layout.width))}>
      <FlowSize.Provider value={{ size, color }}>
        {row
          ? <View style={{ direction: 'rtl', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: center ? 'center' : 'flex-start', columnGap: size * 0.35 }}>{children}</View>
          : <Text style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * FLOW_LINE, color, textAlign: center ? 'center' : 'justify', writingDirection: 'rtl' }}>{children}</Text>}
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
