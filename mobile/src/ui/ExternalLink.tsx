import type { ReactNode } from 'react';
import { Linking, View, type StyleProp, type TextStyle } from 'react-native';
import { SquareArrowOutUpLeft } from 'lucide-react-native';
import { Text, UI_SCALE } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import { reportError } from '@shared/errors';

export const openExternal = (url: string) => { void Linking.openURL(url).catch(error => reportError('open external link', error)); };

export default function ExternalLink({ url, color, size = 14, style, accessibilityLabel, children }: {
  url: string; color: string; size?: number; style?: StyleProp<TextStyle>; accessibilityLabel?: string; children: ReactNode;
}) {
  return (
    <Tap onPress={() => openExternal(url)} accessibilityRole="link" accessibilityLabel={accessibilityLabel} hitSlop={10}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, flexDirection: 'row', alignItems: 'center', maxWidth: '100%', gap: Math.round(size * 0.3) })}>
      <Text style={[{ color, fontSize: size, textAlign: 'right', flexShrink: 1 }, style]}>{children}</Text>
      <SquareArrowOutUpLeft size={Math.round(size * UI_SCALE * 0.8)} color={color} />
    </Tap>
  );
}

export function LeadLink({ lead, url, color, size = 13, lineHeight, children }: {
  lead?: string; url: string; color: string; size?: number; lineHeight?: number; children: ReactNode;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 4 }}>
      {lead ? <Text style={{ color, fontSize: size, lineHeight, textAlign: 'right' }}>{lead}</Text> : null}
      <ExternalLink url={url} color={color} size={size} style={{ lineHeight }}>{children}</ExternalLink>
    </View>
  );
}
