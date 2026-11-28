import { createContext, useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { BookMarked, Send } from 'lucide-react-native';
import Card, { CARD_PAD, CardWithRow } from '@/ui/Card';
import { useInsideCard } from '@/ui/cardContext';
import IconButton from '@/ui/IconButton';
import { Text } from '@/ui/Text';
import { RowSlot, type Slot } from '@/ui/cardContext';
import { SourceSlotContext } from '@/ui/sourceSlot';
import type { Source } from '@/ui/sourceSlot';
import type { Palette } from '@/lib/theme';
import { shareCard } from '@/lib/shareImage';
import { mergeSources } from '@shared/quiz/sources';

const NO_ROW: Slot = { set: () => {} };

export function CardPicture({ head, sources, width, palette, pad = 0, gap, children }: { head?: React.ReactNode; sources?: Source[]; width: number;
  palette: Palette;
  pad?: React.ComponentProps<typeof Card>['pad']; gap?: number; children: React.ReactNode }) {
  const [inner, setInner] = useState<Record<string, Source>>({});
  const slot = useMemo(() => ({ set: (id: string, source: Source | null) => setInner(now => {
    if (source ? now[id]?.line === source.line : !(id in now)) return now;
    const next = { ...now };
    if (source) next[id] = source; else delete next[id];
    return next;
  }) }), []);
  return (
    <View style={{ width, gap: 6 }}>
      {head}
      <RowSlot.Provider value={NO_ROW}>
        <SourceSlotContext.Provider value={slot}>
          <Card palette={palette} pad={pad} gap={gap} clip>{children}</Card>
        </SourceSlotContext.Provider>
      </RowSlot.Provider>
      <PictureRefs sources={[...(sources ?? []), ...Object.values(inner)]} palette={palette} />
    </View>
  );
}

export function PictureRefs({ sources, palette }: { sources: Source[]; palette: Palette }) {
  const merged = mergeSources(sources);
  const bookOf = (line: string) => line.split(' · ')[0];
  const unnamed = (place: string, book: string) => (place.startsWith(`${book}، `) ? place.slice(book.length + 2)
    : /^ [٠-٩]/.test(place.slice(book.length)) && place.startsWith(book) ? `رقم${place.slice(book.length)}`
    : /^[٠-٩، ]+$/.test(place) ? `ص ${place}` : place);
  const printing = (edition: string, book: string) => unnamed(edition, book).split(/\. (?=النص|الفقرة|المادة)/)[0];
  const placed = new Set(merged.filter(book => book.places?.length).map(book => bookOf(book.line)));
  const dropped = merged.filter(book => !book.places?.length && placed.has(bookOf(book.line)));
  const books = merged.filter(book => !dropped.includes(book)).map(book => {
    const more = dropped.filter(other => bookOf(other.line) === bookOf(book.line)).flatMap(other => other.editions ?? []);
    return more.length ? { ...book, editions: [...new Set([...(book.editions ?? []), ...more])] } : book;
  });
  if (!books.length) return null;
  return (
    <View style={{ gap: 6, paddingHorizontal: 8 }}>
      {books.map(book => (
        <View key={book.line} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
          <BookMarked size={14} color={palette.muted} style={{ marginTop: 3 }} />
          <View style={{ flex: 1, gap: 1 }}>
            <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 21, textAlign: 'right' }}>
              {[book.line, ...(book.places ?? []).map(place => unnamed(place, bookOf(book.line)))].join('، ')}
            </Text>
            {[...new Set((book.editions ?? []).map(edition => printing(edition, bookOf(book.line))))].map(edition => (
              <Text key={edition} style={{ color: palette.muted, fontSize: 11, lineHeight: 18, textAlign: 'right' }}>{edition}</Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

export default function CardShare({ label = 'شارك البطاقة', head, sources, palette, pad, gap, children }: { label?: string; head?: React.ReactNode;
  sources?: Source[]; palette: Palette; pad?: React.ComponentProps<typeof Card>['pad']; gap?: number; children: React.ReactNode }) {
  return <IconButton Icon={Send} label={label} onPress={() => shareCard({ content: width => (
    <CardPicture head={head} sources={sources} width={width} palette={palette} pad={pad} gap={gap}>{children}</CardPicture>
  ) })} />;
}

export function SharedCard({ shareHead, shareLabel, row, children, ...card }: React.ComponentProps<typeof CardWithRow> & {
  shareHead?: React.ReactNode; shareLabel?: string }) {
  const inside = useInsideCard();
  const quiet = useContext(NoShare);
  const share = !inside && !quiet && <CardShare label={shareLabel} head={shareHead} sources={card.source} palette={card.palette}
    pad={card.pad ?? CARD_PAD} gap={card.gap}>{children}</CardShare>;
  return <CardWithRow {...card} row={row || share ? <>{row}{share}</> : undefined}>{children}</CardWithRow>;
}

export function PassageShare(props: React.ComponentProps<typeof CardShare>) {
  const inside = useInsideCard();
  const quiet = useContext(NoShare);
  return inside || quiet ? null : <CardShare pad={CARD_PAD} {...props} />;
}

export const NoShare = createContext(false);

export function ShareHead({ title, sub, palette }: { title: string; sub?: string; palette: Palette }) {
  return (
    <View style={{ gap: 2, paddingHorizontal: 8 }}>
      <Text style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>{title}</Text>
      {sub ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{sub}</Text> : null}
    </View>
  );
}
