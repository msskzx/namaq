import type { ReactNode } from 'react';
import { Linking, View, type StyleProp, type TextStyle } from 'react-native';
import { SquareArrowOutUpLeft } from 'lucide-react-native';
import { Text, UI_SCALE } from '@/ui/Text';
import { Tap } from '@/ui/Tap';

/** Opens a page outside the app in the phone's browser. */
export const openExternal = (url: string) => { void Linking.openURL(url).catch(() => {}); };

/**
 * Every link that leaves the app: a text link ending with the out-of-site mark, small and in the link's own colour,
 * the website's ExternalLink. The label and the mark are laid side by side (the app's root lays rows right to left, so the mark comes at the label's left end, where
 * Arabic ends), never drawn inside a line of text: on iOS a box or a drawing inside a Text is placed by its own
 * measure, so in a right-to-left quote it landed on the line above and over the page's digits (owner's phone,
 * 2026-11-23). For the same reason a link is never put inside a Text: the quote above it is its own Text, and a
 * grading before it sits beside it in a row (shared/externalLinkNesting.test.ts).
 * The press area reaches past the text so a short line is still easy to tap.
 */
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

/**
 * A line of plain words followed by a link, as «صحيح · صحيح البخاري ٤٤١٨»: the words and the link side by side in a
 * row that wraps, never the link inside the words' Text (see ExternalLink above).
 */
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
