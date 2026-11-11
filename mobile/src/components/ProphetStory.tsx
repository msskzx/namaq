import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeftRight, BookOpen, Columns3 } from 'lucide-react-native';
import { counted } from '@shared/quran/arabicNumber';
import { placeIn, rangeText, storyMap } from '@shared/quran/prophets/story';
import EventPlaces from '@/components/EventPlaces';
import HelpSheet from '@/components/HelpSheet';
import Sheet from '@/components/Sheet';
import StoryMap from '@/components/StoryMap';
import { setIntent } from '@/lib/intent';
import { readAyah } from '@/lib/openReader';
import { prophetStory } from '@/lib/prophets';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';

// The page scrolls only once the dot's sheet has slid away (Sheet.tsx CLOSE_MS).
const SHEET_CLOSED = 300;

function Action({ icon, label, onPress, primary, palette }: { icon: React.ReactNode; label: string; onPress: () => void; primary?: boolean; palette: Palette }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1,
        borderColor: primary ? palette.ink : palette.rule, backgroundColor: primary ? palette.ink : 'transparent' }}>
      {icon}
      <Text style={{ color: primary ? palette.paper : palette.ink, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}

/**
 * The website's /quran/prophets/[slug] page: the story map (events by group, surahs by row), a sheet for a tapped dot,
 * and the event's places one under another. The prophets tab (with its prophet picker) and /prophets/[slug] for links.
 */
export default function ProphetStory({ slug, header, inTab = false }: { slug: string; header: (help: () => void) => React.ReactNode; inTab?: boolean }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const prophet = useMemo(() => prophetStory(slug), [slug]);
  const map = useMemo(() => (prophet ? storyMap(prophet.events) : undefined), [prophet]);
  const [picked, setPicked] = useState<{ event: number; surah: number }>();
  const [open, setOpen] = useState<{ event: number; surah?: number }>();
  const [help, setHelp] = useState(false);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const detailY = useRef(0);
  const placeY = useRef<Record<number, number>>({});
  const pending = useRef<number | undefined>(undefined);
  const onScroll = useShrinkOnScroll();

  if (!prophet || !map) return <View style={{ flex: 1, backgroundColor: palette.paper }}>{header(() => setHelp(true))}</View>;

  const { title, story, events } = prophet;
  const scrollTo = (y: number) => setTimeout(() => scroll.current?.scrollTo({ y, animated: true }), SHEET_CLOSED);
  const read = (event: number, surah?: number) => {
    setPicked(undefined);
    pending.current = undefined;
    if (surah === undefined) scrollTo(detailY.current);
    else if (open?.event === event && placeY.current[surah] !== undefined) scrollTo(detailY.current + placeY.current[surah] - 12);
    else { placeY.current = {}; pending.current = surah; }
    setOpen({ event, surah });
  };
  const place = picked && placeIn(map, picked.event, picked.surah);
  const partner = picked && map.places[picked.event].filter(p => p.surah !== picked.surah).sort((a, b) => b.count - a.count)[0];
  const others = picked ? map.places[picked.event].length : 0;

  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {header(() => setHelp(true))}
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingVertical: 20, paddingBottom: (inTab ? 0 : insets.bottom) + 32, gap: 20 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 24, fontWeight: '700', lineHeight: 36, paddingHorizontal: 16 }}>{title}</Text>
        <StoryMap map={map} events={events} phases={story.phases} picked={picked} palette={palette}
          onPick={(event, surah) => setPicked(old => (old?.event === event && old.surah === surah ? undefined : { event, surah }))} onTitle={event => read(event)} />
        <View onLayout={e => { detailY.current = e.nativeEvent.layout.y; }}>
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
      <Sheet open={!!place} onClose={() => setPicked(undefined)} palette={palette}>
        {picked && place && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}>
            <View>
              <Text style={{ color: palette.ink, fontSize: 18, fontWeight: '700' }}>{`${events[picked.event].title} · ${place.name}`}</Text>
              <Text style={{ color: palette.muted, fontSize: 14 }}>{`${place.segments.map(g => `${place.name} ${rangeText(g.range)}`).join('، ')} · ${counted(place.count, ['آية', 'آيتان', 'آيات'])}`}</Text>
            </View>
            <Action primary palette={palette} icon={<Columns3 size={18} color={palette.paper} />}
              label={others > 1 ? `اقرأ مواضعه في ${counted(others, ['سورة', 'سورتين', 'سور'])}` : 'اقرأ آياته'} onPress={() => read(picked.event, picked.surah)} />
            <Action palette={palette} icon={<BookOpen size={18} color={palette.ink} />} label="افتح الآيات في المصحف"
              onPress={() => { setPicked(undefined); readAyah(`${place.surah}:${place.segments[0].range[0]}`); }} />
            {partner && (
              <Action palette={palette} icon={<ArrowLeftRight size={18} color={palette.ink} />} label={`قارن ${place.name} بـ${partner.name}`}
                onPress={() => { setPicked(undefined); setIntent({ tab: 'compare', lead: place.surah, other: partner.surah }); router.navigate('/compare'); }} />
            )}
          </View>
        )}
      </Sheet>
      <HelpSheet topic={help ? 'prophets' : null} note={story.intro} onClose={() => setHelp(false)} palette={palette} />
    </View>
  );
}
