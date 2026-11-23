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

/** In the picture the card's own buttons (what it hands up with UnderCard) go nowhere. */
const NO_ROW: Slot = { set: () => {} };

/**
 * A home card as the share picture draws it (owner, 2026-11-22: every card shares): its head, the card as it is now (an
 * answered question with its marks, an unanswered one without), and its books written out in full under it. No buttons.
 */
export function CardPicture({ head, sources, width, palette, pad = 0, gap, children }: { head?: React.ReactNode; sources?: Source[]; width: number;
  palette: Palette;
  /** The card's own room, for a page's section, whose content has none of its own (a home card's post body has). */
  pad?: React.ComponentProps<typeof Card>['pad']; gap?: number; children: React.ReactNode }) {
  // A source drawn inside the card (a question's, once answered) joins the line, as on the card's own source line.
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

/**
 * A share picture's references written out in full (owner, release 1: a picture cannot be tapped open): each book once,
 * with where in it (volume and page, hadith number) and the printing cited, small and muted under the card.
 */
export function PictureRefs({ sources, palette }: { sources: Source[]; palette: Palette }) {
  // A book named with nothing more («صحيح البخاري · البخاري» on a card's line) gives way to the same book where the card
  // says where in it, as the card's source sheet does.
  const merged = mergeSources(sources);
  const bookOf = (line: string) => line.split(' · ')[0];
  // A place that names its book again («الأربعون النووية، ص ٤٦») is written after the book's name without it,
  // and «صحيح البخاري ٥٤» as its number.
  const unnamed = (place: string, book: string) => (place.startsWith(`${book}، `) ? place.slice(book.length + 2)
    : /^ [٠-٩]/.test(place.slice(book.length)) && place.startsWith(book) ? `رقم${place.slice(book.length)}`
    // and a bare page («٧») as a page.
    : /^[٠-٩، ]+$/.test(place) ? `ص ${place}` : place);
  const placed = new Set(merged.filter(book => book.places?.length).map(book => bookOf(book.line)));
  const dropped = merged.filter(book => !book.places?.length && placed.has(bookOf(book.line)));
  // Its printing still goes under the same book where the card says where in it.
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
            {(book.editions ?? []).map(edition => (
              <Text key={edition} style={{ color: palette.muted, fontSize: 11, lineHeight: 18, textAlign: 'right' }}>{edition}</Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

/** A home card's share button (the paper airplane, last of its group): the card as one picture. */
export default function CardShare({ label = 'شارك البطاقة', head, sources, palette, pad, gap, children }: { label?: string; head?: React.ReactNode;
  sources?: Source[]; palette: Palette; pad?: React.ComponentProps<typeof Card>['pad']; gap?: number; children: React.ReactNode }) {
  return <IconButton Icon={Send} label={label} onPress={() => shareCard({ content: width => (
    <CardPicture head={head} sources={sources} width={width} palette={palette} pad={pad} gap={gap}>{children}</CardPicture>
  ) })} />;
}

/**
 * A page's section with the share button last in its row (release 1: every page shares, as every home card does): the
 * section as one picture under `head` (what page it is from), its books written out in full. The picture draws the
 * section afresh, so what the reader opened in it (a fold, «الشرح كاملًا») shows closed. Inside another card (a
 * quiz's look-up) it is that card's to share, so it draws no button of its own.
 */
export function SharedCard({ shareHead, shareLabel, row, children, ...card }: React.ComponentProps<typeof CardWithRow> & {
  shareHead?: React.ReactNode; shareLabel?: string }) {
  const inside = useInsideCard();
  const quiet = useContext(NoShare);
  const share = !inside && !quiet && <CardShare label={shareLabel} head={shareHead} sources={card.source} palette={card.palette}
    pad={card.pad ?? CARD_PAD} gap={card.gap}>{children}</CardShare>;
  return <CardWithRow {...card} row={row || share ? <>{row}{share}</> : undefined}>{children}</CardWithRow>;
}

/** Set around a page's view drawn as a quiz's look-up (a hint sheet, a party's review): no share buttons there. */
export const NoShare = createContext(false);

/** A page's name over a share picture of one of its sections. */
export function ShareHead({ title, sub, palette }: { title: string; sub?: string; palette: Palette }) {
  return (
    <View style={{ gap: 2, paddingHorizontal: 8 }}>
      <Text style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>{title}</Text>
      {sub ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{sub}</Text> : null}
    </View>
  );
}
