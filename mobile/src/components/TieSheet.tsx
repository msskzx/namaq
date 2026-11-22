import { View } from 'react-native';
import type { Tie } from '@shared/tarajimGraph';
import { pageLabel, saidBy } from '@shared/tarajim';
import { Text } from '@/ui/Text';
import Sheet from '@/ui/Sheet';
import Saying from '@/ui/Saying';
import type { Palette } from '@/lib/theme';
import { GRAPH, personName } from '@/lib/tarajim';

/** The sentence that states a tie, with its pages: a long press on the ring, on the «صلاته» screen and the person page. */
/** `to` may be a battle, or a relative with no page: the sentence that names them is all there is. */
export default function TieSheet({ tie, onClose, palette }: { tie?: Pick<Tie, 'to' | 'link' | 'reversed'>; onClose: () => void; palette: Palette }) {
  return (
    <Sheet open={!!tie} onClose={onClose} palette={palette}>
      {tie && (
        <View style={{ padding: 16, gap: 8 }}>
          <Saying by={tie.link.text ? saidBy(tie.link) : undefined} palette={palette}>
            <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{tie.link.text || personName(GRAPH.nodes.get(tie.to) ?? tie.link)}</Text>
          </Saying>
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>
            {tie.link.refs.length ? pageLabel(tie.link.refs) : ''}{tie.reversed ? ' · من ترجمة الآخر' : ''}
          </Text>
        </View>
      )}
    </Sheet>
  );
}
