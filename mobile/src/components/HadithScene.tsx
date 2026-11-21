import { View } from 'react-native';
import { bubbleSides, sceneSpeakers, splitLead, PROPHET_AGENT, type SceneLine } from '@shared/hadith';
import { Text } from '@/ui/Text';
import Bubble from '@/ui/Bubble';
import Chip from '@/ui/Chip';
import type { Palette } from '@/lib/theme';

const body = (palette: Palette) => ({ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' as const });

/** The Prophet's name as the scene gives it, with ﷺ after it. */
const named = (speaker: string, agent?: string) => (agent === PROPHET_AGENT && !speaker.includes('ﷺ') ? `${speaker} ﷺ` : speaker);

/**
 * A hadith's scene as a conversation, its page's and its feed card's (owner's agreed story layout, 2026-11-21): the people
 * who speak as chips in their colours at the top, the Prophet ﷺ first, the key to the bubbles; the narration in full ink
 * at reading size; each saying in a bubble on its speaker's side, a new speaker on the other side, the narrator's lead-in
 * («فَقَالَ») above it outside the bubble. Who narrates is named once, when he changes, on its own line in ink.
 */
export default function HadithScene({ lines, slots, palette, keyed = true }: { lines: SceneLine[]; slots: Map<string, number>; palette: Palette;
  /** Draw the speakers' chips; a page whose people row above is already the key (a sira story) passes false. */
  keyed?: boolean }) {
  const sides = bubbleSides(lines);
  const agents = new Map(lines.filter(line => line.kind === 'turn' && line.speaker).map(line => [line.speaker!, line.agent]));
  const colourOf = (speaker?: string) => palette.slots[slots.get(speaker ?? '') ?? 0];
  const people = sceneSpeakers(lines);
  let narrator: string | undefined;
  return (
    <View style={{ gap: 10 }}>
      {keyed && people.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {people.map(({ speaker }) => (
            <Chip key={speaker} label={named(speaker, agents.get(speaker))} on lit tint={colourOf(speaker)} role="text" small palette={palette} />
          ))}
        </View>
      )}
      {lines.map((line, i) => {
        if (line.kind === 'narration') {
          const next = lines[i + 1];
          const split = next?.kind === 'turn' && next.lead === undefined ? splitLead(line.text) : { before: line.text };
          const changed = line.speaker && line.speaker !== narrator;
          if (line.speaker) narrator = line.speaker;
          if (!changed && !split.before) return null;
          return (
            <View key={i} style={{ paddingHorizontal: 4 }}>
              {changed ? <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{line.speaker}</Text> : null}
              {split.before ? <Text style={body(palette)}>{split.before}</Text> : null}
            </View>
          );
        }
        const previous = lines[i - 1];
        const lead = line.lead ?? (previous?.kind === 'narration' ? splitLead(previous.text).lead : undefined);
        return (
          <Bubble key={i} who={line.speaker && named(line.speaker, line.agent)} colour={colourOf(line.speaker)} start={!sides[i]} lead={lead} palette={palette}>
            <Text style={body(palette)}>{line.text}</Text>
          </Bubble>
        );
      })}
    </View>
  );
}
