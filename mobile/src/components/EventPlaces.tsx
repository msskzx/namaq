import { Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { rangeText, sharedWords, type EventView, type Place } from '@shared/quran/prophets/story';
import { readAyah } from '@/lib/openReader';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import { groupColor } from './StoryMap';

function Step({ dir, enabled, onPress, palette }: { dir: 1 | -1; enabled: boolean; onPress: () => void; palette: Palette }) {
  const Icon = dir === 1 ? ArrowLeft : ArrowRight;
  return (
    <Pressable onPress={onPress} disabled={!enabled} accessibilityRole="button" accessibilityLabel={dir === 1 ? 'الحدث التالي' : 'الحدث السابق'} hitSlop={6}
      style={{ width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: palette.rule, alignItems: 'center', justifyContent: 'center', opacity: enabled ? 1 : 0.4 }}>
      <Icon size={18} color={palette.ink} />
    </Pressable>
  );
}

/** The website's EventPlaces: one event, a card for each surah that tells it, one under another, shared runs of words in colour. */
export default function EventPlaces({ event, places, phase, focus, onStep, hasPrev, hasNext, onLayoutPlace, palette }: {
  event: EventView;
  places: Place[];
  phase: string;
  focus?: number;
  onStep: (dir: 1 | -1) => void;
  hasPrev: boolean;
  hasNext: boolean;
  onLayoutPlace: (surah: number, y: number) => void;
  palette: Palette;
}) {
  const shared = sharedWords(places);
  return (
    <View style={{ gap: 12, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: groupColor(palette, event.phase), fontSize: 14, fontWeight: '600' }}>{phase}</Text>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22, fontWeight: '700', lineHeight: 32 }}>{event.title}</Text>
        </View>
        <Step dir={-1} enabled={hasPrev} onPress={() => onStep(-1)} palette={palette} />
        <Step dir={1} enabled={hasNext} onPress={() => onStep(1)} palette={palette} />
      </View>
      {places.map((place, k) => (
        <View key={place.surah} onLayout={e => onLayoutPlace(place.surah, e.nativeEvent.layout.y)}
          style={{ gap: 4, padding: 14, borderRadius: 12, backgroundColor: palette.card, borderWidth: focus === place.surah ? 2 : 1, borderColor: focus === place.surah ? palette.ink : palette.rule }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: palette.ink, fontSize: 15, fontWeight: '600' }}>{place.name}</Text>
            <Text style={{ flex: 1, color: palette.muted, fontSize: 13 }}>{place.segments.map(g => rangeText(g.range)).join('، ')}</Text>
            <Pressable onPress={() => readAyah(`${place.surah}:${place.segments[0].range[0]}`)} accessibilityRole="button" accessibilityLabel={`افتح ${place.name} في المصحف`} hitSlop={8} style={{ padding: 4 }}>
              <BookOpen size={18} color={palette.muted} />
            </Pressable>
          </View>
          {place.segments.map((g, gi) => (
            <Text key={g.range[0]} style={{ fontFamily: QURAN_FONT, fontSize: 23, lineHeight: 46, color: palette.ink, writingDirection: 'rtl', textAlign: 'right' }}>
              {g.lines.map((line, li) => (
                <Text key={line.ayah}>
                  {line.words.map((word, w) => (
                    <Text key={w} style={shared[k][gi][li][w] ? { color: palette.accent } : undefined}>{`${mushafText(word)} `}</Text>
                  ))}
                  <Text style={{ color: palette.muted, fontSize: 17 }}>{`${num(line.ayah)} `}</Text>
                </Text>
              ))}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
