import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { BookMarked, Send } from 'lucide-react-native';
import Card from '@/ui/Card';
import IconButton from '@/ui/IconButton';
import { Text } from '@/ui/Text';
import { RowSlot, type Slot } from '@/ui/cardContext';
import { SourceSlotContext } from '@/ui/sourceSlot';
import type { Source } from '@/ui/sourceSlot';
import type { Palette } from '@/lib/theme';
import { shareCard } from '@/lib/shareImage';

/** In the picture the card's own buttons (what it hands up with UnderCard) go nowhere. */
const NO_ROW: Slot = { set: () => {} };

/**
 * A home card as the share picture draws it (owner, 2026-11-22: every card shares): its head, the card as it is now (an
 * answered question with its marks, an unanswered one without), and its books on a plain line under it. No buttons.
 */
export function CardPicture({ head, sources, width, palette, children }: { head?: React.ReactNode; sources?: Source[]; width: number;
  palette: Palette; children: React.ReactNode }) {
  // A source drawn inside the card (a question's, once answered) joins the line, as on the card's own source line.
  const [inner, setInner] = useState<Record<string, Source>>({});
  const slot = useMemo(() => ({ set: (id: string, source: Source | null) => setInner(now => {
    if (source ? now[id]?.line === source.line : !(id in now)) return now;
    const next = { ...now };
    if (source) next[id] = source; else delete next[id];
    return next;
  }) }), []);
  const line = [...new Set([...(sources ?? []), ...Object.values(inner)].map(source => source.line))].join('، ');
  return (
    <View style={{ width, gap: 6 }}>
      {head}
      <RowSlot.Provider value={NO_ROW}>
        <SourceSlotContext.Provider value={slot}>
          <Card palette={palette} pad={0} clip>{children}</Card>
        </SourceSlotContext.Provider>
      </RowSlot.Provider>
      {line ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 }}>
          <BookMarked size={14} color={palette.muted} />
          <Text style={{ flex: 1, color: palette.muted, fontSize: 13, textAlign: 'right' }}>{line}</Text>
        </View>
      ) : null}
    </View>
  );
}

/** A home card's share button (the paper airplane, last of its group): the card as one picture. */
export default function CardShare({ label = 'شارك البطاقة', head, sources, palette, children }: { label?: string; head?: React.ReactNode;
  sources?: Source[]; palette: Palette; children: React.ReactNode }) {
  return <IconButton Icon={Send} label={label} onPress={() => shareCard({ content: width => (
    <CardPicture head={head} sources={sources} width={width} palette={palette}>{children}</CardPicture>
  ) })} />;
}
