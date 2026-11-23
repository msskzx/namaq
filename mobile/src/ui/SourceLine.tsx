import { useState } from 'react';
import { View } from 'react-native';
import { BookMarked } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
import Sheet from '@/ui/Sheet';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';
import type { Source } from '@/ui/sourceSlot';
import { fitted, REST } from '@/ui/sourceFit';
import { mergeSources, sourceEntries, type QuizSource } from '@shared/quiz/sources';

/** A card's books as source-line entries, one for each book (shared/quiz/sources.ts referenceGroups). */
export const sourcesOf = (sources: QuizSource[]): Source[] => sourceEntries(sources);

const LINE = { fontSize: 13, textAlign: 'right' as const };
/**
 * A home card's source line (owner 2026-11-20, like an Instagram post's line under its buttons): a book icon and the
 * books (`named`), muted, no arrow; a tap anywhere on it opens a sheet with each book's places, words and links (`sources`).
 */
export default function SourceLine({ named, sources, palette, label, small = false }: {
  /** The books named on the line; all of `sources` when left out (a page heading's line). */
  named?: Source[]; sources: Source[]; palette: Palette;
  /** The words on the line, when not the books' names: one saying's book and page («سير أعلام النبلاء ٣/١٠»). */
  label?: string;
  /** Under one saying inside a card: no side room. */
  small?: boolean }) {
  const [open, setOpen] = useState(false);
  // The line's room and each book's width as drawn, so the line names as many books as fit and says «وغيرها» for the rest.
  const [room, setRoom] = useState(0);
  const [widths, setWidths] = useState<Record<string, number>>({});
  if (!sources.length) return null;
  const names = label ? [label] : [...new Set((named ?? sources).map(source => source.line))];
  const line = names.join('، ');
  const fit = fitted(names, room, widths);
  // A book named on the line with nothing more to say is left out of the sheet when what the card holds says where in it.
  const books = mergeSources(sources);
  const told = books.filter(source => source.quotes.length || source.links?.length);
  const shown = told.length ? told : books;
  return (
    <>
      <Tap onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel={`المصدر: ${line}`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: small ? 0 : 12, minHeight: small ? 44 : 32 }}>
        <BookMarked size={15} color={palette.muted} />
        <View style={{ flex: 1 }} onLayout={e => setRoom(e.nativeEvent.layout.width)}>
          <Text numberOfLines={1} style={{ ...LINE, color: palette.muted }}>{fit}</Text>
          {/* Each book and the closing word, measured unwrapped and unseen. */}
          <View pointerEvents="none" aria-hidden style={{ position: 'absolute', top: 0, height: 0, width: 10000, overflow: 'hidden', opacity: 0, flexDirection: 'row', alignItems: 'flex-start' }}>
            {[...names.map(name => `${name}، `), REST].map(piece => (
              <Text key={piece} style={LINE} onLayout={e => { const w = e.nativeEvent.layout.width; setWidths(was => (was[piece] === w ? was : { ...was, [piece]: w })); }}>{piece}</Text>
            ))}
          </View>
        </View>
      </Tap>
      <Sheet open={open} onClose={() => setOpen(false)} palette={palette}>
        <View style={{ gap: 14, paddingHorizontal: 16, paddingBottom: 24 }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 16, fontWeight: '700', textAlign: 'right' }}>المصدر</Text>
          {shown.map((source, at) => (
            <View key={`${at}:${source.line}`} style={{ gap: 4 }}>
              <Text style={{ color: palette.ink, fontSize: 15, fontWeight: '600', textAlign: 'right' }}>{source.line}</Text>
              {source.quotes.map((quote, i) => {
                const style = { color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' as const };
                return quote.url
                  ? <View key={i} style={{ gap: 2 }}>
                      {quote.text ? <Text style={style}>{`«${quote.text}»`}</Text> : null}
                      <ExternalLink url={quote.url} color={palette.muted} size={13}>{quote.cite}</ExternalLink>
                    </View>
                  : <Text key={i} style={style}>{quote.text}{quote.cite ? ` ${quote.cite}` : ''}</Text>;
              })}
              {(source.links ?? []).map(link => <ExternalLink key={link.url} url={link.url} color={palette.accent} size={14} style={{ textAlign: 'right' }}>{link.label}</ExternalLink>)}
            </View>
          ))}
        </View>
      </Sheet>
    </>
  );
}
