import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { CARD, type Palette } from '@/lib/theme';

/**
 * The one speech bubble of a conversation drawn as a chat (a hadith's scenes, a sira story): only the words said, on the
 * speaker's side, in his colour. No name is written by it, lest it be read as part of the text, and no name ring beside it
 * (owner, 2026-11-22): the narrator's words that lead into the saying («فَقَالَ رَسُولُ اللَّهِ ﷺ») sit above the bubble on
 * its side, outside it, in full ink, and the people's chips above the scene are the key to the colours. `framed` rings the
 * bubble in his colour.
 */
export default function Bubble({ colour, start, framed = true, lead, palette, children }: {
  colour: string;
  /** On the start side (the right in Arabic) or the end side. */
  start: boolean;
  framed?: boolean;
  /** The ring that names the speaker; a shared picture leaves it out (owner, 2026-11-21), its lead-ins say who speaks. */
  ring?: boolean;
  /** The narrator's words just before the saying, drawn above it. */
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
