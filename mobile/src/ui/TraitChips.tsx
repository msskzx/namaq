import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';
import { QuranWord } from '@/components/quran/text/AyahFlow';

/**
 * `meaning`: the book's own words for it, under the word (an ayah's word and Ibn Qutaybah's meaning). `place`: where it is
 * said, under it (a word's meaning at its ayah).
 */
export type Trait = { label: string; names: string[]; agreed: boolean; meaning?: string; place?: string };

/**
 * Framed words in a wrapping row, each with who gives it under it (owner, 2026-11-23: a person's «صفته» card, sketch
 * tarajim-feed-card/sketch/traits-dark.png; an ayah's «كلماتها», sketch quran-design/ayah-page). A word two named sayers
 * give is framed in the accent with both names; a word from an unnamed view names no one. `quran` sets the words in the
 * mushaf's letters. With `onPick` each is a tab that shows its saying under the row, the picked one framed in the accent;
 * without it they are not buttons, the full sayings being under them. `root` (a Quran word) hangs them from it, framed in
 * the accent, as a tree's branches in rows under it with a curved line to each (owner, 2026-11-24: a word's meanings, sketch quran-design/word-page design ب).
 */
export default function TraitChips({ traits, palette, quran = false, picked, onPick, root }: { traits: Trait[]; palette: Palette; quran?: boolean;
  picked?: number; onPick?: (at: number) => void; root?: string }) {
  const chips = traits.map((trait, at) => {
    const lit = trait.agreed || picked === at;
    const said = `${trait.label}${trait.meaning ? `: ${trait.meaning}` : ''}${trait.names.length ? `، عند ${trait.names.join('، ')}` : ''}${trait.place ? `، ${trait.place}` : ''}`;
    const look = { borderWidth: 1, borderColor: lit ? palette.accent : palette.rule, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6,
      alignItems: 'center' as const, minHeight: 44, justifyContent: 'center' as const, backgroundColor: picked === at ? `${palette.accent}18` : undefined };
    const inner = <>
      {quran ? <QuranWord look={{ color: palette.ink }} place={{ textAlign: 'center' }}>{trait.label}</QuranWord>
        : <Text style={{ color: palette.ink, fontSize: 17 }}>{trait.label}</Text>}
      {trait.meaning ? <Text style={{ color: palette.ink, fontSize: 14, lineHeight: 22, textAlign: 'center' }}>{trait.meaning}</Text> : null}
      {trait.names.length > 0 && <Text style={{ color: lit ? palette.accent : palette.muted, fontSize: 12 }}>{trait.names.join('، ')}</Text>}
      {trait.place ? <Text style={{ color: lit ? palette.accent : palette.muted, fontSize: 12 }}>{trait.place}</Text> : null}
    </>;
    return onPick
      ? <Tap key={`${trait.label}-${at}`} onPress={() => onPick(at)} accessibilityRole="tab" accessibilityLabel={said} accessibilityState={{ selected: picked === at }} aria-selected={picked === at}
          style={({ pressed }) => ({ ...look, opacity: pressed ? 0.6 : 1 })}>{inner}</Tap>
      : <View key={`${trait.label}-${at}`} accessible accessibilityLabel={said} style={look}>{inner}</View>;
  });
  if (!root) return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{chips}</View>;
  return <Branches root={root} chips={chips} palette={palette} />;
}

type Box = { x: number; y: number; width: number; height: number };
/** Room between the root and the first row, and between rows, for the lines to bend in. */
const BEND = 26;

/** The chips in rows under the root, each joined to it: a trunk down from the root, bending to the top of each chip. */
function Branches({ root, chips, palette }: { root: string; chips: ReactNode[]; palette: Palette }) {
  const [top, setTop] = useState<Box | null>(null);
  const [row, setRow] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [boxes, setBoxes] = useState<(Box | undefined)[]>([]);
  const place = (at: number, box: Box) => setBoxes(was => {
    const old = was[at];
    if (old && old.x === box.x && old.y === box.y && old.width === box.width && old.height === box.height) return was;
    const next = [...was];
    next[at] = box;
    return next;
  });
  const x = top ? top.x + top.width / 2 : 0;
  const from = top ? top.y + top.height : 0;
  const lines = top ? boxes.flatMap((box, at) => {
    if (!box) return [];
    const end = { x: box.x + box.width / 2, y: row + box.y };
    const bend = end.y - BEND / 2;
    return [<Path key={at} d={`M ${x} ${from} L ${x} ${bend - BEND / 2} C ${x} ${bend} ${end.x} ${bend} ${end.x} ${end.y}`} />];
  }) : [];
  return (
    <View onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
      <Svg pointerEvents="none" width={size.width} height={size.height} style={{ position: 'absolute', left: 0, top: 0 }}>
        <G fill="none" stroke={`${palette.rule}cc`} strokeWidth={1.4}>{lines}</G>
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <View onLayout={event => setTop(event.nativeEvent.layout)}
          style={{ borderWidth: 1, borderColor: palette.accent, borderRadius: 12, paddingHorizontal: 22, paddingVertical: 4, backgroundColor: palette.card }}>
          <QuranWord look={{ color: palette.accent }} place={{ textAlign: 'center' }}>{root}</QuranWord>
        </View>
      </View>
      <View onLayout={event => setRow(event.nativeEvent.layout.y)}
        style={{ marginTop: BEND, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 8, rowGap: BEND }}>
        {chips.map((chip, at) => (
          <View key={at} onLayout={event => place(at, event.nativeEvent.layout)} style={{ backgroundColor: palette.card, borderRadius: 12 }}>{chip}</View>
        ))}
      </View>
    </View>
  );
}
