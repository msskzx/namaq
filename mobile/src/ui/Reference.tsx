import { useState } from 'react';
import { useLiftSource, type Quote } from '@/ui/sourceSlot';
import { View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
import type { Palette } from '@/lib/theme';
import { Tap } from '@/ui/Tap';

export type { Quote, Source } from '@/ui/sourceSlot';

export default function Reference({ title, quotes, links = [], places, editions, palette }: { title: string; quotes: Quote[];
  links?: { label: string; url: string }[];
  places?: string[]; editions?: string[]; palette: Palette }) {
  const [open, setOpen] = useState(false);
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
