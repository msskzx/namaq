import { ScrollView, View } from 'react-native';
import type { Tie } from '@shared/tarajimGraph';
import { pageLabel, saidBy } from '@shared/tarajim';
import { Text } from '@/ui/Text';
import Sheet from '@/ui/Sheet';
import Saying from '@/ui/Saying';
import type { Palette } from '@/lib/theme';
import { GRAPH, personName } from '@/lib/tarajim';

type ShownTie = Pick<Tie, 'to' | 'link' | 'reversed'>;

/** The sentence that names a tie, with its pages: in the sheet below, or where the page is already a sheet (the quiz's look-up). */
export function TieSaying({ tie, palette }: { tie: ShownTie; palette: Palette }) {
  return (
    <View style={{ gap: 8 }}>
      <Saying by={tie.link.text ? saidBy(tie.link) : undefined} palette={palette}>
        <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{tie.link.text || personName(GRAPH.nodes.get(tie.to) ?? tie.link)}</Text>
      </Saying>
      <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>
        {tie.link.refs.length ? pageLabel(tie.link.refs) : ''}{tie.reversed ? ' · من ترجمة الآخر' : ''}
      </Text>
    </View>
  );
}

/** The sentence that states a tie, with its pages: a tap on a name with no page, a long press on the ring. `to` may be a battle. */
export default function TieSheet({ tie, onClose, palette }: { tie?: ShownTie; onClose: () => void; palette: Palette }) {
  return (
    <Sheet open={!!tie} onClose={onClose} palette={palette}>
      {tie && <View style={{ padding: 16 }}><TieSaying tie={tie} palette={palette} /></View>}
    </Sheet>
  );
}

/**
 * A ring's ties the book gives «على خلاف», all in one sheet (owner, 2026-11-22): only the book's words and their pages,
 * no words of ours; two ties the book says in the same words show them once.
 */
export function DoubtedSheet({ ties, open, onClose, palette }: { ties: readonly ShownTie[]; open: boolean; onClose: () => void; palette: Palette }) {
  const once = ties.filter((tie, i) => !tie.link.text || ties.findIndex(other => other.link.text === tie.link.text) === i);
  return (
    <Sheet open={open} onClose={onClose} palette={palette}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 18 }}>
        {once.map(tie => <TieSaying key={tie.to} tie={tie} palette={palette} />)}
      </ScrollView>
    </Sheet>
  );
}
