import { Pressable, Text, View } from 'react-native';
import { BookOpenText, ChevronDown } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import type { EventView, SegmentView } from '@shared/quran/prophets/story';
import { QURAN_FONT, type Palette } from '@/lib/theme';

export const phaseColor = (palette: Palette, phase: number) => palette.phases[phase % palette.phases.length];

const ref = ({ surah, name, range: [lo, hi] }: SegmentView) => `${num(surah)} ${name} ${num(lo)}${hi > lo ? `-${num(hi)}` : ''}`;

/** One segment of a station: its reference, folded until tapped, then its ayat in the mushaf font. */
function Segment({ segment, open, onToggle, palette }: { segment: SegmentView; open: boolean; onToggle: () => void; palette: Palette }) {
  return (
    <View style={{ borderWidth: 1, borderColor: palette.rule, borderRadius: 10, backgroundColor: palette.paper }}>
      <Pressable onPress={onToggle} accessibilityRole="button" accessibilityState={{ expanded: open }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10 }}>
        <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}><ChevronDown size={16} color={palette.muted} /></View>
        <Text style={{ flex: 1, color: palette.ink, fontSize: 15 }}>{ref(segment)}</Text>
        <Text style={{ color: palette.muted, fontSize: 13 }}>{`${num(segment.lines.length)} آية`}</Text>
      </Pressable>
      {open && (
        <View style={{ paddingHorizontal: 12, paddingBottom: 10 }}>
          {segment.lines.map(line => (
            <Text key={line.ayah} style={{ fontFamily: QURAN_FONT, fontSize: 23, lineHeight: 46, color: palette.ink, writingDirection: 'rtl', textAlign: 'right' }}>
              {mushafText(line.text)} <Text style={{ color: palette.accent }}>{num(line.ayah)}</Text>
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

/** A station on the timeline: its number on the phase line, the title, the surahs, and its ayat by segment. */
export default function StationCard({ event, phase, open, onToggle, marked, palette }: {
  event: EventView;
  phase: string;
  open: (segment: number) => boolean;
  onToggle: (segment: number) => void;
  marked: boolean;
  palette: Palette;
}) {
  const color = phaseColor(palette, event.phase);
  const surahs = [...new Set(event.segments.map(g => g.name))];
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <View style={{ minWidth: 30, height: 30, borderRadius: 15, paddingHorizontal: 6, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: palette.paper, fontSize: 14, fontWeight: '600' }}>{num(event.n)}</Text>
        </View>
        <Text style={{ color, fontSize: 15, fontWeight: '600' }}>{phase}</Text>
        <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: color, opacity: 0.7 }} />
      </View>
      <View style={{
        gap: 12, padding: 16, borderRadius: 16, backgroundColor: palette.card,
        borderWidth: marked ? 2 : 1, borderColor: marked ? palette.accent : palette.rule, borderTopWidth: 4, borderTopColor: color,
      }}>
        <Text style={{ color: palette.ink, fontSize: 20, fontWeight: '600', lineHeight: 30 }}>{event.title}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }} accessibilityLabel="السور">
          {surahs.map(name => (
            <Text key={name} style={{ color: palette.muted, fontSize: 13, borderWidth: 1, borderColor: palette.rule, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2 }}>{name}</Text>
          ))}
        </View>
        <View style={{ gap: 8 }}>
          {event.segments.map((segment, i) => (
            <Segment key={`${segment.surah}:${segment.range[0]}`} segment={segment} open={open(i)} onToggle={() => onToggle(i)} palette={palette} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <BookOpenText size={14} color={palette.muted} />
          <Text style={{ color: palette.muted, fontSize: 13 }}>{`${num(event.count)} آية في ${num(event.segments.length)} موضع`}</Text>
        </View>
      </View>
    </View>
  );
}
