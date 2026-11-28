import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';
import { QuranWord } from '@/components/quran/text/AyahFlow';

export type Trait = { label: string; names: string[]; agreed: boolean; meaning?: string; place?: string };

export default function TraitChips({ traits, palette, quran = false, picked, onPick, lines = false }: { traits: Trait[]; palette: Palette; quran?: boolean;
  picked?: number; onPick?: (at: number) => void; lines?: boolean }) {
  const chips = traits.map((trait, at) => {
    const lit = trait.agreed || picked === at;
    const said = `${trait.label}${trait.meaning ? `: ${trait.meaning}` : ''}${trait.names.length ? `، عند ${trait.names.join('، ')}` : ''}${trait.place ? `، ${trait.place}` : ''}`;
    const look = { borderWidth: 1, borderColor: lit ? palette.accent : palette.rule, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6,
      alignItems: 'center' as const, minHeight: 44, justifyContent: lines ? 'space-between' as const : 'center' as const,
      ...(lines ? { flexDirection: 'row' as const, gap: 14, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14 } : null), backgroundColor: picked === at ? `${palette.accent}18` : undefined };
    const inner = lines ? <>
      <View style={{ flexShrink: 1, flexGrow: 1, alignItems: 'flex-start' }}>
        {quran ? <QuranWord look={{ color: palette.accent }} place={{ textAlign: 'right' }}>{trait.label}</QuranWord>
          : <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 28, textAlign: 'right' }}>{trait.label}</Text>}
        {trait.meaning ? <>
          <View style={{ alignSelf: 'stretch', height: 1, backgroundColor: `${palette.rule}66`, marginVertical: 8 }} />
          <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 26, textAlign: 'right' }}>
            <Text style={{ color: palette.muted, fontSize: 14 }}>معناها: </Text>{trait.meaning}
          </Text>
        </> : null}
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
  return <View style={lines ? { gap: 12 } : { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{chips}</View>;
}
