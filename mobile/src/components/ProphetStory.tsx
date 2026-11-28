import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { storyMap } from '@shared/quran/prophets/story';
import EventPlaces from '@/components/EventPlaces';
import HelpSheet from '@/components/HelpSheet';
import StoryMap from '@/components/StoryMap';
import { prophetStory } from '@/lib/prophets';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useLater } from '@/lib/hooks/useLater';

export default function ProphetStory({ slug, header, inTab = false, startEvent, startSurah }: { slug: string; header: (help: () => void) => React.ReactNode; inTab?: boolean;
  startEvent?: number; startSurah?: number }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const tabBarSpace = useTabBarSpace();
  const prophet = useMemo(() => prophetStory(slug), [slug]);
  const map = useMemo(() => (prophet ? storyMap(prophet.events) : undefined), [prophet]);
  const [open, setOpen] = useState<{ event: number; surah?: number } | undefined>(() => (startEvent !== undefined && prophet?.events[startEvent] ? { event: startEvent, surah: startSurah } : undefined));
  const toDetail = useRef(open !== undefined);
  const [help, setHelp] = useState(false);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const detailY = useRef(0);
  const placeY = useRef<Record<number, number>>({});
  const pending = useRef<number | undefined>(open?.surah);
  const onScroll = useShrinkOnScroll();
  const later = useLater();
  useTabRetap('prophets', () => { if (inTab) later.nextFrame(() => scroll.current?.scrollTo({ y: 0, animated: true })); });

  if (!prophet || !map) return <View style={{ flex: 1, backgroundColor: palette.paper }}>{header(() => setHelp(true))}</View>;

  const { title, story, events } = prophet;
  const scrollTo = (y: number) => later.nextFrame(() => scroll.current?.scrollTo({ y, animated: true }));
  const read = (event: number, surah?: number) => {
    pending.current = undefined;
    if (surah === undefined) scrollTo(detailY.current);
    else if (open?.event === event && placeY.current[surah] !== undefined) scrollTo(detailY.current + placeY.current[surah] - 12);
    else { placeY.current = {}; pending.current = surah; }
    setOpen({ event, surah });
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {header(() => setHelp(true))}
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingVertical: 20, paddingBottom: inTab ? tabBarSpace : insets.bottom + 32, gap: 20 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 24, fontWeight: '700', lineHeight: 36, paddingHorizontal: 16 }}>{title}</Text>
        <StoryMap map={map} events={events} phases={story.phases} picked={open} palette={palette}
          onPick={(event, surah) => read(event, surah)} onTitle={event => read(event)} />
        <View onLayout={e => { detailY.current = e.nativeEvent.layout.y; if (toDetail.current) { toDetail.current = false; scrollTo(detailY.current); } }}>
          {open && (
            <EventPlaces event={events[open.event]} places={map.places[open.event]} phase={story.phases[events[open.event].phase]} focus={open.surah} palette={palette}
              hasPrev={open.event > 0} hasNext={open.event < events.length - 1}
              onStep={dir => read(open.event + dir)}
              onLayoutPlace={(surah, y) => {
                placeY.current[surah] = y;
                if (surah !== pending.current) return;
                pending.current = undefined;
                scrollTo(detailY.current + y - 12);
              }} />
          )}
        </View>
      </ScrollView>
      <HelpSheet topic={help ? 'prophets' : null} note={story.intro} onClose={() => setHelp(false)} palette={palette} />
    </View>
  );
}
