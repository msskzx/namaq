import { useState } from 'react';
import { View } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import { CARD, type Palette } from '@/lib/theme';
import { MIN_TAP } from '@/ui/tapSize';

const RING = 28;
/** The ring's press is the whole tap floor itself, since hit slop cannot reach past its row on Android. */
const PRESS = MIN_TAP;

/**
 * The one speech bubble of a conversation drawn as a chat (a hadith's scenes, a sira story): only the words said, on the
 * speaker's side, in his colour. No name of ours is written over it, lest it be read as part of the text (owner,
 * 2026-11-21): beside it, on its outer side, a ring with a speech icon in his colour shows his name when tapped; the
 * people's chips above the scene are the key to the colours. The narrator's words that lead into the saying («فَقَالَ»)
 * sit above the bubble on its side, outside it, in full ink. `framed` rings the bubble in his colour.
 */
export default function Bubble({ who, colour, start, framed = true, lead, palette, children }: {
  who?: string; colour: string;
  /** On the start side (the right in Arabic) or the end side. */
  start: boolean;
  framed?: boolean;
  /** The narrator's words just before the saying, drawn above it. */
  lead?: string;
  palette: Palette; children: React.ReactNode;
}) {
  const [named, setNamed] = useState(false);
  const corner = 4;
  const ring = (
    <View style={{ width: PRESS, height: PRESS }}>
      <Tap onPress={() => who && setNamed(!named)} disabled={!who} accessibilityRole="button" accessibilityLabel={who ?? undefined}
        style={{ width: PRESS, height: PRESS, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: RING, height: RING, borderRadius: RING / 2, borderWidth: 1.5, borderColor: colour, backgroundColor: palette.paper,
          alignItems: 'center', justifyContent: 'center' }}>
          <MessageSquare size={16} color={colour} />
        </View>
      </Tap>
      {named && who ? (
        <View pointerEvents="none" style={{ position: 'absolute', bottom: PRESS, [start ? 'right' : 'left']: 4, backgroundColor: palette.paper,
          borderWidth: 1, borderColor: colour, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 1, zIndex: 2 }}>
          <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 14, minWidth: 0 }}>{who}</Text>
        </View>
      ) : null}
    </View>
  );
  return (
    <View style={{ maxWidth: '92%', alignSelf: start ? 'flex-start' : 'flex-end', gap: 2 }}>
      {lead ? (
        <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, paddingHorizontal: PRESS, textAlign: start ? 'right' : 'left' }}>{lead}</Text>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', alignSelf: start ? 'flex-start' : 'flex-end' }}>
        {start && ring}
        <View style={{ flexShrink: 1, backgroundColor: palette.paper, ...CARD,
          borderBottomStartRadius: start ? corner : CARD.borderRadius, borderBottomEndRadius: start ? CARD.borderRadius : corner,
          borderWidth: framed ? 1.5 : 0, borderColor: colour, paddingHorizontal: 12, paddingTop: 6, paddingBottom: 2 }}>
          {children}
        </View>
        {!start && ring}
      </View>
    </View>
  );
}
