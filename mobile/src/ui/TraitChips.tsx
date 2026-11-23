import { View } from 'react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

export type Trait = { label: string; names: string[]; agreed: boolean };

/**
 * A person's looks as framed words in a wrapping row, each with who gives it under it (owner, 2026-11-23: the «صفته»
 * card, sketch tarajim-feed-card/sketch/traits-dark.png). A word two named sayers give is framed in the accent with both
 * names; a word from an unnamed view names no one. Not buttons: the full sayings are under them.
 */
export default function TraitChips({ traits, palette }: { traits: Trait[]; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {traits.map(trait => (
        <View key={trait.label} accessible accessibilityLabel={trait.names.length ? `${trait.label}، عند ${trait.names.join('، ')}` : trait.label} style={{ borderWidth: 1, borderColor: trait.agreed ? palette.accent : palette.rule, borderRadius: 12,
          paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', minHeight: 44, justifyContent: 'center' }}>
          <Text style={{ color: palette.ink, fontSize: 17 }}>{trait.label}</Text>
          {trait.names.length > 0 && <Text style={{ color: trait.agreed ? palette.accent : palette.muted, fontSize: 12 }}>{trait.names.join('، ')}</Text>}
        </View>
      ))}
    </View>
  );
}
