import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Text } from '@/ui/Text';
import { ArrowLeftRight, Send } from 'lucide-react-native';
import { rangeText, sharedWords, type EventView, type Place } from '@shared/quran/prophets/story';
import { compareTargetsFor, type CompareTarget } from '@/lib/compare';
import { setIntent } from '@/lib/intent';
import { readAyah } from '@/lib/openReader';
import { shareCard } from '@/lib/shareImage';
import { type Palette } from '@/lib/theme';
import CompareTargetsSheet from './CompareTargetsSheet';
import PlaceText from './PlaceText';
import { groupColor } from './StoryMap';
import { BACK_EDGE_SLOP } from '@/lib/stackOptions';
import { toTab } from '@/lib/ways';
import IconButton from '@/ui/IconButton';
import Card, { CardWithRow } from '@/ui/Card';
import { sourcesOf } from '@/ui/SourceLine';
import { storySource } from '@shared/quran/pieceSources';
import { FEATURE_ICON } from '@/components/featureIcons';

const SWIPE = 60;
const FLICK = 600;

const openCompare = (target: CompareTarget) => {
  setIntent({ tab: 'compare', lead: target.lead, other: target.other, ayat: [`${target.lead}:${target.ayat[0]}`, `${target.other}:${target.ayat[1]}`] });
  toTab('/compare');
};

export default function EventPlaces({ event, places, phase, focus, onStep, hasPrev, hasNext, onLayoutPlace, palette, readable = true }: {
  event: EventView;
  places: Place[];
  phase: string;
  focus?: number;
  onStep: (dir: 1 | -1) => void;
  hasPrev: boolean;
  hasNext: boolean;
  onLayoutPlace: (surah: number, y: number) => void;
  readable?: boolean;
  palette: Palette;
}) {
  const shared = sharedWords(places);
  const targets = useMemo(() => compareTargetsFor(places.flatMap(p => p.segments.flatMap(g => g.lines.map(line => `${p.surah}:${line.ayah}`)))), [places]);
  const [choosing, setChoosing] = useState<CompareTarget[] | null>(null);
  const x = useSharedValue(0);
  const step = (forward: boolean) => onStep(forward ? 1 : -1);
  const pan = Gesture.Pan()
    .hitSlop(BACK_EDGE_SLOP)
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
    <Card palette={palette} gap={4} style={{ width }}>
      <Text style={{ color: groupColor(palette, event.phase), fontSize: 13, fontWeight: '600' }}>{phase}</Text>
      <Text style={{ color: palette.ink, fontSize: 19, fontWeight: '700', lineHeight: 30 }}>{event.title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ color: palette.ink, fontSize: 15, fontWeight: '600' }}>{place.name}</Text>
        <Text style={{ flex: 1, color: palette.muted, fontSize: 13 }}>{place.segments.map(g => rangeText(g.range)).join('، ')}</Text>
      </View>
      <PlaceText place={place} shared={shared[k]} palette={palette} />
    </Card>
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
        <View key={place.surah} style={{ gap: 4 }} onLayout={e => onLayoutPlace(place.surah, e.nativeEvent.layout.y)}>
          <CardWithRow palette={palette} gap={4} picked={focus === place.surah}
            source={sourcesOf([storySource([{ phase: 0, segments: place.segments.map(g => ({ surah: place.surah, range: g.range })) }], 0)])}
            lead={readable && <IconButton Icon={FEATURE_ICON.mushaf} label={`افتح ${place.name} في المصحف`} onPress={() => readAyah(`${place.surah}:${place.segments[0].range[0]}`)} />}
            row={readable && <>
              <CompareButton place={place} targets={targets.filter(t => t.lead !== t.other && (t.lead === place.surah || t.other === place.surah))} onChoose={setChoosing} palette={palette} />
              <IconButton Icon={Send} label={`شارك ${place.name}`} onPress={() => share(place, k)} />
            </>}>
            {focus === place.surah && <Text style={{ color: groupColor(palette, event.phase), fontSize: 13, fontWeight: '600' }}>{event.title}</Text>}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: palette.ink, fontSize: 15, fontWeight: '600' }}>{place.name}</Text>
              <Text style={{ flex: 1, color: palette.muted, fontSize: 13 }}>{place.segments.map(g => rangeText(g.range)).join('، ')}</Text>
            </View>
            <PlaceText place={place} shared={shared[k]} palette={palette} />
          </CardWithRow>
        </View>
      ))}
      <CompareTargetsSheet targets={choosing} onPick={target => { setChoosing(null); openCompare(target); }} onClose={() => setChoosing(null)} palette={palette} />
    </Animated.View>
    </GestureDetector>
  );
}

function CompareButton({ place, targets, onChoose }: { place: Place; targets: CompareTarget[]; onChoose: (targets: CompareTarget[]) => void; palette: Palette }) {
  if (!targets.length) return null;
  const own = targets.map(t => (t.lead === place.surah ? t : { lead: t.other, other: t.lead, ayat: [t.ayat[1], t.ayat[0]] as [number, number] }));
  return (
    <IconButton Icon={ArrowLeftRight} label={`قارن ${place.name}`} onPress={() => (own.length === 1 ? openCompare(own[0]) : onChoose(own))} />
  );
}
