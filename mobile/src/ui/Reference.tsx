import { useState } from 'react';
import { useLiftSource, type Source } from '@/ui/sourceSlot';
import { View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
import type { Palette } from '@/lib/theme';
import { Tap } from '@/ui/Tap';

/** A quote from a book: its words, with the page it cites as a link (the page alone when it has no words). A quote with no page is our own note on the ones above. */
export type { Quote, Source } from '@/ui/sourceSlot';
import type { Quote } from '@/ui/sourceSlot';

/**
 * A section's reference, collapsed to the book and page it cites (a muted line with a chevron); a tap opens the quotes,
 * the first in ink, the rest smaller. The website has the same in src/components/common/Reference.tsx.
 */
export default function Reference({ title, quotes, links = [], places, editions, palette }: { title: string; quotes: Quote[];
  /** Links under the quotes when open (the source's own page, our sources and licences page). */
  links?: { label: string; url: string }[];
  /** Where in the book and its printing, written out in a share picture of the card (ui/CardShare PictureRefs). */
  places?: string[]; editions?: string[]; palette: Palette }) {
  const [open, setOpen] = useState(false);
  // On a home card the reference joins the card's source line under its buttons (owner 2026-11-20), and draws nothing here.
  const lifted = useLiftSource({ line: title, quotes, links, ...(places && { places }), ...(editions && { editions }) });
  if (lifted) return null;
  return (
    <View style={{ gap: 4 }}>
      <Tap onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityState={{ expanded: open }} hitSlop={6} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}>
        <Text style={{ color: palette.muted, fontSize: 13 }}>{title}</Text>
        <ChevronDown size={14} color={palette.muted} style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }} />
      </Tap>
      {open && quotes.map((quote, i) => {
        const style = { color: i ? palette.muted : palette.ink, fontSize: i ? 13 : 15, lineHeight: i ? 21 : 25, textAlign: 'right' as const };
        const key = `${i}:${quote.text}`;
        return quote.url
          ? <View key={key} style={{ gap: 2 }}>
              {quote.text ? <Text style={style}>{`«${quote.text}»`}</Text> : null}
              <ExternalLink url={quote.url} color={palette.muted} size={13}>{quote.cite}</ExternalLink>
            </View>
          : <Text key={key} style={style}>{quote.text}</Text>;
      })}
      {open && links.map(link => <ExternalLink key={link.url} url={link.url} color={palette.accent} size={14} style={{ textAlign: 'right' }}>{link.label}</ExternalLink>)}
    </View>
  );
}
