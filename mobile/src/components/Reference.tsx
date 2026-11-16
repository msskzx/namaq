import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Text } from '@/components/Text';
import ExternalLink from './ExternalLink';
import type { Palette } from '@/lib/theme';

/** A quote from a book: its words, with the page it cites as a link. A quote with no page is our own note on the ones above. */
export type Quote = { text: string; cite?: string; url?: string };

/**
 * A section's reference, collapsed to the book and page it cites (a muted line with a chevron); a tap opens the quotes,
 * the first in ink, the rest smaller. The website has the same in src/components/common/Reference.tsx.
 */
export default function Reference({ title, quotes, palette }: { title: string; quotes: Quote[]; palette: Palette }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 4 }}>
      <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityState={{ expanded: open }} hitSlop={6} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}>
        <Text style={{ color: palette.muted, fontSize: 13 }}>{title}</Text>
        <ChevronDown size={14} color={palette.muted} style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }} />
      </Pressable>
      {open && quotes.map((quote, i) => {
        const style = { color: i ? palette.muted : palette.ink, fontSize: i ? 13 : 15, lineHeight: i ? 21 : 25, textAlign: 'right' as const };
        return quote.url
          ? <Text key={quote.text} style={style}>«{quote.text}» <ExternalLink url={quote.url} color={palette.muted} size={13}>{quote.cite}</ExternalLink></Text>
          : <Text key={quote.text} style={style}>{quote.text}</Text>;
      })}
    </View>
  );
}
