import { View } from 'react-native';
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
