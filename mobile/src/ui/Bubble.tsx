import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { CARD, type Palette } from '@/lib/theme';

export default function Bubble({ colour, start, framed = true, lead, palette, children }: {
  colour: string;
  start: boolean;
  framed?: boolean;
  lead?: string;
  palette: Palette; children: React.ReactNode;
}) {
  const corner = 4;
  return (
    <View style={{ maxWidth: '92%', alignSelf: start ? 'flex-start' : 'flex-end', gap: 2 }}>
      {lead ? (
        <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, paddingHorizontal: 4, textAlign: start ? 'right' : 'left' }}>{lead}</Text>
      ) : null}
      <View style={{ flexShrink: 1, alignSelf: start ? 'flex-start' : 'flex-end', backgroundColor: palette.paper, ...CARD,
        borderBottomStartRadius: start ? corner : CARD.borderRadius, borderBottomEndRadius: start ? CARD.borderRadius : corner,
        borderWidth: framed ? 1.5 : 0, borderColor: colour, paddingHorizontal: 12, paddingTop: 6, paddingBottom: 2 }}>
        {children}
      </View>
    </View>
  );
}
