import { View } from 'react-native';
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
 * without it they are not buttons, the full sayings being under them. `lines` gives each a line of its own across the card,
 * its words (and meaning under them) on the right and its place on the left (owner, 2026-11-24: a word's meanings on its page).
 */
export default function TraitChips({ traits, palette, quran = false, picked, onPick, lines = false }: { traits: Trait[]; palette: Palette; quran?: boolean;
  picked?: number; onPick?: (at: number) => void; lines?: boolean }) {
  const chips = traits.map((trait, at) => {
    const lit = trait.agreed || picked === at;
    const said = `${trait.label}${trait.meaning ? `: ${trait.meaning}` : ''}${trait.names.length ? `، عند ${trait.names.join('، ')}` : ''}${trait.place ? `، ${trait.place}` : ''}`;
    const look = { borderWidth: 1, borderColor: lit ? palette.accent : palette.rule, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6,
      alignItems: 'center' as const, minHeight: 44, justifyContent: lines ? 'space-between' as const : 'center' as const,
      ...(lines ? { flexDirection: 'row' as const, gap: 12 } : null), backgroundColor: picked === at ? `${palette.accent}18` : undefined };
    const inner = lines ? <>
      <View style={{ flexShrink: 1, alignItems: 'flex-start' }}>
        {quran ? <QuranWord look={{ color: lit ? palette.accent : palette.ink }} place={{ textAlign: 'right' }}>{trait.label}</QuranWord>
          : <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 28, textAlign: 'right' }}>{trait.label}</Text>}
        {trait.meaning ? <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 26, textAlign: 'right' }}>{trait.meaning}</Text> : null}
      </View>
      {trait.place ? <Text style={{ color: lit ? palette.accent : palette.muted, fontSize: 13 }}>{trait.place}</Text> : null}
    </> : <>
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
  return <View style={lines ? { gap: 6 } : { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{chips}</View>;
}
