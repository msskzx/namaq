import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Text } from '@/components/Text';
import type { Palette } from '@/lib/theme';

const WAVE = 'M6 0 C 0 6, 0 14, 6 20 C 12 26, 12 34, 6 40';

/** One wavy strand, after the theme's rope: the story runs on through a part this surah does not tell. */
function Rope({ color }: { color: string }) {
  return (
    <Svg width={12} height={40} viewBox="0 0 12 40" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Path d={WAVE} stroke={color} strokeWidth={1.25} fill="none" />
    </Svg>
  );
}

/** A side's place in a part it does not tell: a rope with the note «لا تذكر سورة X هذا الجزء» in its middle. */
export function Silent({ note, palette }: { note: string; palette: Palette }) {
  return (
    <View style={{ alignItems: 'center', gap: 4, paddingVertical: 4 }}>
      <Rope color={palette.rule} />
      <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 22, textAlign: 'center' }}>{note}</Text>
      <Rope color={palette.rule} />
    </View>
  );
}

/** A dotted line; iOS draws no dotted border on one edge only, so a dotted box is clipped to its top edge. */
function Dotted({ color }: { color: string }) {
  return (
    <View style={{ flex: 1, height: 1, overflow: 'hidden' }}>
      <View style={{ height: 3, borderWidth: 1, borderColor: color, borderStyle: 'dotted' }} />
    </View>
  );
}

/** A dotted rule with the ayat it opens on in its middle, where a stretch of ayat begins. */
export function Gap({ label, palette }: { label?: string; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 2 }}>
      <Dotted color={palette.rule} />
      {label ? <Text style={{ color: palette.muted, fontSize: 12 }}>{label}</Text> : null}
      {label ? <Dotted color={palette.rule} /> : null}
    </View>
  );
}

/** A part's top rule: the fold chevron at its right end, and the part's ayat in the middle when there are any to name. */
export function PartRule({ label, folded, onToggle, name, palette }: { label?: string; folded: boolean; onToggle: () => void; name: string; palette: Palette }) {
  const action = folded ? `افتح ${name}` : `اطوِ ${name}`;
  return (
    <View style={{ justifyContent: 'center', minHeight: 26 }}>
      <Gap label={label} palette={palette} />
      <Pressable onPress={onToggle} hitSlop={8} accessibilityRole="button" accessibilityState={{ expanded: !folded }} accessibilityLabel={action}
        style={{ position: 'absolute', right: 0, padding: 4, backgroundColor: palette.card }}>
        {folded ? <ChevronDown size={16} color={palette.muted} /> : <ChevronUp size={16} color={palette.muted} />}
      </Pressable>
    </View>
  );
}
