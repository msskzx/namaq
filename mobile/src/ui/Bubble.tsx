import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { CARD, type Palette } from '@/lib/theme';

/**
 * The one speech bubble of a conversation drawn as a chat (a scene of «مشاهد», a hadith's scenes): the speaker's name in
 * his colour over what he said, on his side, the corner by him sharp. `framed` rings it in his colour.
 */
export default function Bubble({ who, colour, start, framed = true, palette, children }: {
  who?: string; colour: string;
  /** On the start side (the right in Arabic) or the end side. */
  start: boolean;
  framed?: boolean; palette: Palette; children: React.ReactNode;
}) {
  return (
    <View style={{ maxWidth: '88%', alignSelf: start ? 'flex-start' : 'flex-end', backgroundColor: palette.paper, ...CARD,
      borderTopStartRadius: start ? 4 : CARD.borderRadius, borderTopEndRadius: start ? CARD.borderRadius : 4,
      borderWidth: framed ? 1.5 : 0, borderColor: colour, paddingHorizontal: 12, paddingTop: 6, paddingBottom: 2 }}>
      {who ? <Text style={{ color: colour, fontSize: 13, textAlign: 'right' }}>{who}</Text> : null}
      {children}
    </View>
  );
}
