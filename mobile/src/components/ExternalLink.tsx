import type { ReactNode } from 'react';
import { Linking, Pressable, type StyleProp, type TextStyle } from 'react-native';
import { SquareArrowOutUpLeft } from 'lucide-react-native';
import { Text, UI_SCALE } from '@/components/Text';

/** Opens a page outside the app in the phone's browser. */
export const openExternal = (url: string) => { void Linking.openURL(url).catch(() => {}); };

/**
 * Every link that leaves the app: a text link ending with the out-of-site mark, small and in the link's own colour,
 * the website's ExternalLink. The mark sits inline after the last word (a no-break space keeps them together),
 * and the press area reaches past the text so a short line is still easy to tap.
 */
export default function ExternalLink({ url, color, size = 14, style, accessibilityLabel, children }: {
  url: string; color: string; size?: number; style?: StyleProp<TextStyle>; accessibilityLabel?: string; children: ReactNode;
}) {
  return (
    <Pressable onPress={() => openExternal(url)} accessibilityRole="link" accessibilityLabel={accessibilityLabel} hitSlop={10}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      <Text style={[{ color, fontSize: size }, style]}>
        {children}<Text style={{ textDecorationLine: 'none' }}>{'\u00A0'}</Text><SquareArrowOutUpLeft size={Math.round(size * UI_SCALE * 0.8)} color={color} />
      </Text>
    </Pressable>
  );
}
