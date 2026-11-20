import { useEffect, useRef, type ComponentRef } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import type { WriteBlank } from '@shared/quiz/writeBlanks';
import type { WriteBlanks } from '../../recite/useRecite';
import { useAyahSize } from './AyahFlow';
import { QURAN_FONT, type Palette } from '@/lib/theme';

/** The Quran module's write pieces (recite mode on the page, quiz blanks, the matrix and tree quizzes): one look everywhere. */

/** A colour with this opacity. */
export const tint = (hex: string, alpha: number) => `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;

/**
 * A hidden word: a box the word's width and about one line of letters tall, the word itself invisible inside it.
 * A background on the text would cover the font's whole line (the Quran font's is very tall), so boxes overlapped the
 * lines above and below and the surah titles; this box is clipped to the letters.
 */
export function Veil({ text, size, palette, next, faint = false }: { text: string; size: number; palette: Palette; next: boolean; faint?: boolean }) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden
      style={{ height: size * 1.25, overflow: 'hidden', justifyContent: 'center', borderRadius: 5, opacity: faint ? 0.55 : 1, borderStyle: faint ? 'dashed' : 'solid',
      // The next ayah's boxes are the write boxes' own (paper, owner 2026-11-17), so reciting and writing look the same.
      backgroundColor: faint ? 'transparent' : next ? palette.paper : tint(palette.muted, 0.1), borderWidth: 1, borderColor: palette.rule }}>
      <Text selectable={false} style={{ fontFamily: QURAN_FONT, fontSize: size, color: 'transparent', marginVertical: -size }}>{text}</Text>
    </View>
  );
}

/**
 * A word to write, in write mode: the hidden word's own box in its place on the line, holding what was typed.
 * The box being written has the accent border.
 */
export function WriteBox({ text, size, palette, typed, active, onPress, onActive, hint, label }: { text: string; size: number; palette: Palette; typed: string; active: boolean; onPress: () => void; onActive?: (y: number, height: number) => void;
  /** A quiz's hint (its bulb): the word's first letters, faint, while the box is empty. */
  hint?: string;
  /** A quiz blank's own name for the box («الطرف ١، الكلمة ٢»), what was typed after it. */
  label?: string }) {
  const box = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => {
    // Again on each change of the page around it (the keyboard rising, a scroll), so the box stays in sight.
    if (active) box.current?.measureInWindow((_x: number, y: number, _w: number, h: number) => onActive?.(y, h));
  }, [active, onActive]);
  return (
    <Pressable ref={box} onPress={onPress} accessibilityRole="button" accessibilityLabel={label ? `${label}${typed ? `: ${typed}` : ''}` : typed ? `كلمة مكتوبة: ${typed}` : 'اكتب هذه الكلمة'} accessibilityState={{ selected: active }}
      style={{ height: size * 1.25, overflow: 'hidden', justifyContent: 'center', borderRadius: 5, backgroundColor: palette.paper, borderWidth: active ? 2 : 1, borderColor: active ? palette.accent : palette.rule }}>
      <Text selectable={false} style={{ fontFamily: QURAN_FONT, fontSize: size, color: 'transparent', marginVertical: -size }}>{text}</Text>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
        <Text numberOfLines={1} style={{ fontSize: size * 0.72, lineHeight: size * 1.1, color: typed ? palette.ink : palette.muted }}>{typed || hint}</Text>
      </View>
    </Pressable>
  );
}

/**
 * A quiz blank in recite mode's boxes (owner, 2026-11-19; useWriteBlanks): the words it asks are WriteBoxes, the rest of its
 * words the faint boxes the pen leaves, as on the mushaf page. Without `write` (an example) the boxes take no typing.
 */
export function BlankBoxes({ blank, index, write, size: given, palette, hint, name }: { blank: WriteBlank; index: number; write?: WriteBlanks;
  /** The words' size; in an AyahFlow, its own. */
  size?: number; palette: Palette; hint?: string;
  /** The blank's name («الطرف ١»); each box adds its word's place. */
  name: string }) {
  const flow = useAyahSize();
  const size = given ?? flow;
  return <>{blank.words.map((word, at) => {
    if (at >= blank.write) return <Veil key={at} text={word} size={size} palette={palette} next={false} faint />;
    // An example's box only shows where you write: the write box's look, no button.
    if (!write) return <Veil key={at} text={word} size={size} palette={palette} next />;
    const box = write.box(index, at);
    return <WriteBox key={at} text={word} size={size} palette={palette} typed={box.typed} active={box.active} onPress={box.pick} hint={at === 0 ? hint : undefined} label={`${name}، الكلمة ${num(at + 1)}`} />;
  })}</>;
}

/** What was typed for a wrong word, struck through above it (place it in a box around the word). */
export function Mistyped({ text, size, palette }: { text: string; size: number; palette: Palette }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', bottom: '100%', left: -size, right: -size, alignItems: 'center' }}>
      <Text numberOfLines={1} accessibilityLabel={`كتبت: ${text}`} style={{ fontSize: size * 0.6, lineHeight: size * 0.85, color: palette.amber, textDecorationLine: 'line-through' }}>{text}</Text>
    </View>
  );
}
