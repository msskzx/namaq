import { View } from 'react-native';
import { bubbleSides, type SceneLine } from '@shared/hadith';
import { Text } from '@/ui/Text';
import Bubble from '@/ui/Bubble';
import type { Palette } from '@/lib/theme';

const body = (palette: Palette) => ({ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' as const });

/** A hadith's scene as a conversation, its page's and its feed card's (the website's bubbles): each speaker his colour, a new speaker on the other side. */
export default function HadithScene({ lines, slots, palette }: { lines: SceneLine[]; slots: Map<string, number>; palette: Palette }) {
  const sides = bubbleSides(lines);
  return (
    <View style={{ gap: 10 }}>
      {lines.map((line, i) => {
        const colour = palette.slots[slots.get(line.speaker ?? '') ?? 0];
        if (line.kind === 'narration') {
          return (
            <View key={i} style={{ paddingHorizontal: 4 }}>
              {line.speaker ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{line.speaker}</Text> : null}
              <Text style={[body(palette), { color: palette.muted, fontSize: 17, lineHeight: 32 }]}>{line.text}</Text>
            </View>
          );
        }
        return (
          <Bubble key={i} who={line.speaker} colour={colour} start={!sides[i]} palette={palette}>
            <Text style={body(palette)}>{line.text}</Text>
          </Bubble>
        );
      })}
    </View>
  );
}
