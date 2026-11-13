import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Text } from '@/components/Text';
import { router } from 'expo-router';
import { ArrowLeftRight, BookOpen, Send } from 'lucide-react-native';
import { rangeText, sharedWords, type EventView, type Place } from '@shared/quran/prophets/story';
import { compareTargetsFor, type CompareTarget } from '@/lib/compare';
import { setIntent } from '@/lib/intent';
import { readAyah } from '@/lib/openReader';
import { shareCard } from '@/lib/shareImage';
import { CARD, type Palette } from '@/lib/theme';
import CompareTargetsSheet from './CompareTargetsSheet';
import PlaceText from './PlaceText';
import { groupColor } from './StoryMap';

// How far (px) a finger must move sideways to change the event, or how fast a flick.
const SWIPE = 60;
const FLICK = 600;

const openCompare = (target: CompareTarget) => {
  setIntent({ tab: 'compare', lead: target.lead, other: target.other, ayat: [`${target.lead}:${target.ayat[0]}`, `${target.other}:${target.ayat[1]}`] });
  router.navigate('/compare');
};

/**
 * The website's EventPlaces: one event, a card for each surah that tells it, one under another, shared runs of words in colour.
 * A sideways swipe changes the event: a finger moving right goes on to the next one, as an Arabic page turns.
 */
export default function EventPlaces({ event, places, phase, focus, onStep, hasPrev, hasNext, onLayoutPlace, palette, readable = true }: {
  event: EventView;
  places: Place[];
  phase: string;
  focus?: number;
  onStep: (dir: 1 | -1) => void;
  hasPrev: boolean;
  hasNext: boolean;
  onLayoutPlace: (surah: number, y: number) => void;
  /** Shows the mushaf and compare buttons on each place (off in the first-launch tour, which can't leave its screen). */
  readable?: boolean;
  palette: Palette;
}) {
  const shared = sharedWords(places);
  // The compare pages holding a kept card of two of the event's ayat, each place getting those with another surah.
  const targets = useMemo(() => compareTargetsFor(places.flatMap(p => p.segments.flatMap(g => g.lines.map(line => `${p.surah}:${line.ayah}`)))), [places]);
  const [choosing, setChoosing] = useState<CompareTarget[] | null>(null);
  const x = useSharedValue(0);
  const step = (forward: boolean) => onStep(forward ? 1 : -1);
  // In the tour a sideways swipe turns the tour's own step instead.
  const pan = Gesture.Pan()
    .enabled(readable)
    .activeOffsetX([-16, 16])
    .failOffsetY([-12, 12])
    .onUpdate(event => {
      const open = event.translationX > 0 ? hasNext : hasPrev;
      x.value = open ? event.translationX : event.translationX / 4;
    })
    .onEnd(event => {
      const forward = event.translationX > 0;
      const far = Math.abs(event.translationX) > SWIPE || Math.abs(event.velocityX) > FLICK;
      x.value = withTiming(0, { duration: 200 });
      if (far && (forward ? hasNext : hasPrev)) scheduleOnRN(step, forward);
    });
  const share = (place: Place, k: number) => shareCard({ content: width => (
    <View style={{ width, gap: 4, padding: 14, ...CARD, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule }}>
      <Text style={{ color: groupColor(palette, event.phase), fontSize: 13, fontWeight: '600' }}>{phase}</Text>
      <Text style={{ color: palette.ink, fontSize: 19, fontWeight: '700', lineHeight: 30 }}>{event.title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ color: palette.ink, fontSize: 15, fontWeight: '600' }}>{place.name}</Text>
        <Text style={{ flex: 1, color: palette.muted, fontSize: 13 }}>{place.segments.map(g => rangeText(g.range)).join('، ')}</Text>
      </View>
      <PlaceText place={place} shared={shared[k]} palette={palette} />
    </View>
  ) });
  const moved = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <GestureDetector gesture={pan}>
    <Animated.View style={[{ gap: 12, paddingHorizontal: 16 }, moved]}
      accessibilityActions={[...(hasNext ? [{ name: 'increment', label: 'الحدث التالي' }] : []), ...(hasPrev ? [{ name: 'decrement', label: 'الحدث السابق' }] : [])]}
      onAccessibilityAction={e => { if (e.nativeEvent.actionName === 'increment') onStep(1); else if (e.nativeEvent.actionName === 'decrement') onStep(-1); }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: groupColor(palette, event.phase), fontSize: 14, fontWeight: '600' }}>{phase}</Text>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22, fontWeight: '700', lineHeight: 32 }}>{event.title}</Text>
        </View>
      </View>
      {places.map((place, k) => (
        <View key={place.surah} onLayout={e => onLayoutPlace(place.surah, e.nativeEvent.layout.y)}
          style={{ gap: 4, padding: 14, ...CARD, backgroundColor: palette.card, borderWidth: focus === place.surah ? 2 : 1, borderColor: focus === place.surah ? palette.ink : palette.rule }}>
          {/* The tapped dot scrolls straight to its card, past the event's title, so the card names the event itself. */}
          {focus === place.surah && <Text style={{ color: groupColor(palette, event.phase), fontSize: 13, fontWeight: '600' }}>{event.title}</Text>}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: palette.ink, fontSize: 15, fontWeight: '600' }}>{place.name}</Text>
            <Text style={{ flex: 1, color: palette.muted, fontSize: 13 }}>{place.segments.map(g => rangeText(g.range)).join('، ')}</Text>
            {readable && <><Pressable onPress={() => readAyah(`${place.surah}:${place.segments[0].range[0]}`)} accessibilityRole="button" accessibilityLabel={`افتح ${place.name} في المصحف`} hitSlop={8} style={{ padding: 4 }}>
              <BookOpen size={18} color={palette.muted} />
            </Pressable>
            <CompareButton place={place} targets={targets.filter(t => t.lead !== t.other && (t.lead === place.surah || t.other === place.surah))} onChoose={setChoosing} palette={palette} />
            {/* Share is always the last button: this place as an image, under the event's title. */}
            <Pressable onPress={() => share(place, k)} accessibilityRole="button" accessibilityLabel={`شارك ${place.name}`} hitSlop={8} style={{ padding: 4 }}>
              <Send size={18} color={palette.muted} />
            </Pressable></>}
          </View>
          <PlaceText place={place} shared={shared[k]} palette={palette} />
        </View>
      ))}
      <CompareTargetsSheet targets={choosing} onPick={target => { setChoosing(null); openCompare(target); }} onClose={() => setChoosing(null)} palette={palette} />
    </Animated.View>
    </GestureDetector>
  );
}

/** The compare pages of a place's ayat: one opens at once, several open a list to choose from. */
function CompareButton({ place, targets, onChoose, palette }: { place: Place; targets: CompareTarget[]; onChoose: (targets: CompareTarget[]) => void; palette: Palette }) {
  if (!targets.length) return null;
  // Seen from this place's surah.
  const own = targets.map(t => (t.lead === place.surah ? t : { lead: t.other, other: t.lead, ayat: [t.ayat[1], t.ayat[0]] as [number, number] }));
  return (
    <Pressable onPress={() => (own.length === 1 ? openCompare(own[0]) : onChoose(own))}
      accessibilityRole="button" accessibilityLabel={`قارن ${place.name}`} hitSlop={8} style={{ padding: 4 }}>
      <ArrowLeftRight size={18} color={palette.muted} />
    </Pressable>
  );
}
