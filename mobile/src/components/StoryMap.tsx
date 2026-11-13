import { Fragment, useRef, useState } from 'react';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { counted } from '@shared/quran/arabicNumber';
import { dotSize, type EventView, type StoryMap as StoryMapData } from '@shared/quran/prophets/story';
import type { Palette } from '@/lib/theme';

export const groupColor = (palette: Palette, phase: number) => palette.phases[phase % palette.phases.length];

const CELL = 34;
const ROW = 38;
const GAP = 10;
const TITLES = 200;
const BAND = 30;
const SMALLEST = 7;
const LARGEST = 26;
const LETTER = 7.5;

/**
 * The website's story map (src/app/quran/prophets/[slug]/StoryMap.tsx): a column for each event under its group's colour,
 * a row for each surah, the surah names kept on the right while the events scroll sideways, opening at the first group (QuizTree's pattern).
 */
export default function StoryMap({ map, events, phases, picked, onPick, onTitle, palette }: {
  map: StoryMapData;
  events: EventView[];
  phases: readonly string[];
  picked?: { event: number; surah?: number };
  onPick: (event: number, surah: number) => void;
  onTitle: (event: number) => void;
  palette: Palette;
}) {
  const groups = phases.map((name, phase) => ({ name, phase, events: events.map((e, i) => ({ e, i })).filter(({ e }) => e.phase === phase) })).filter(g => g.events.length > 0)
    .map(g => ({ ...g, cell: Math.max(CELL, Math.ceil((g.name.length * LETTER + 8) / g.events.length)) }));
  const rule = { borderBottomWidth: 1, borderColor: palette.rule };
  const sideways = useRef<{ scrollToEnd: (options?: { animated?: boolean }) => void } | null>(null);
  // More events wait on the left until the user has scrolled there: the left edge fades out to say so.
  const [more, setMore] = useState(false);
  const box = useRef(0);
  return (
    <View style={{ flexDirection: 'row' }}>
      <View>
        <View style={{ height: BAND + TITLES }} />
        {map.surahs.map(({ surah, name }) => (
          <View key={surah} style={[{ height: ROW, justifyContent: 'center', paddingHorizontal: 12 }, rule]}>
            <Text style={{ color: palette.ink, fontSize: 14 }}>{name}</Text>
          </View>
        ))}
      </View>
      <View style={{ flex: 1 }}>
      <ScrollView ref={sideways as never} horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1, direction: 'ltr' }} scrollEventThrottle={32}
        onLayout={e => { box.current = e.nativeEvent.layout.width; }}
        onScroll={e => setMore(e.nativeEvent.contentOffset.x > 4)}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} onContentSizeChange={width => { setMore(width > box.current + 4); sideways.current?.scrollToEnd({ animated: false }); }}>
        <View style={{ direction: 'rtl' }}>
          <View style={{ flexDirection: 'row', height: BAND, gap: GAP }}>
            {groups.map(g => (
              <View key={g.name} style={{ width: g.events.length * g.cell, borderBottomWidth: 3, borderColor: groupColor(palette, g.phase), justifyContent: 'flex-end', paddingBottom: 3 }}>
                <Text numberOfLines={1} style={{ color: groupColor(palette, g.phase), fontSize: 13, fontWeight: '700', textAlign: 'center' }}>{g.name}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', height: TITLES, gap: GAP }}>
            {groups.map(g => (
              <View key={g.name} style={{ flexDirection: 'row' }}>
                {g.events.map(({ e, i }) => (
                  <Pressable key={e.n} onPress={() => onTitle(i)} accessibilityRole="button" accessibilityLabel={e.title} style={{ width: g.cell, height: TITLES, overflow: 'hidden' }}>
                    <View style={{ position: 'absolute', width: TITLES - 8, height: CELL, left: (g.cell - TITLES + 8) / 2, top: (TITLES - 8 - CELL) / 2 + 4, transform: [{ rotate: '90deg' }], justifyContent: 'center' }}>
                      <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 15, textAlign: 'right' }}>{e.title}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
          {map.surahs.map(({ surah, name }) => (
            <View key={surah} style={[{ flexDirection: 'row', height: ROW, gap: GAP }, rule]}>
              {groups.map(g => (
                <View key={g.name} style={{ flexDirection: 'row' }}>
                  {g.events.map(({ e, i }) => {
                    const here = map.places[i].find(p => p.surah === surah);
                    const size = here ? dotSize(here.count, map.most, SMALLEST, LARGEST) : 0;
                    const on = picked?.event === i && picked.surah === surah;
                    return (
                      <Fragment key={e.n}>
                        {here ? (
                          <Pressable onPress={() => onPick(i, surah)} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={`${e.title}، ${name}، ${counted(here.count, ['آية', 'آيتان', 'آيات'])}`}
                            style={{ width: g.cell, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: size + (on ? 8 : 0), height: size + (on ? 8 : 0), borderRadius: 99, borderWidth: on ? 2.5 : 0, borderColor: palette.ink, alignItems: 'center', justifyContent: 'center' }}>
                              <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: groupColor(palette, g.phase) }} />
                            </View>
                          </Pressable>
                        ) : <View style={{ width: g.cell }} />}
                      </Fragment>
                    );
                  })}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      {more && <Svg pointerEvents="none" width={36} height="100%" style={{ position: 'absolute', left: 0, top: 0, bottom: 0 }}>
        <Defs><LinearGradient id="more" x1="0" y1="0" x2="1" y2="0"><Stop offset="0" stopColor={palette.paper} stopOpacity={1} /><Stop offset="1" stopColor={palette.paper} stopOpacity={0} /></LinearGradient></Defs>
        <Rect x="0" y="0" width="36" height="100%" fill="url(#more)" />
      </Svg>}
      </View>
    </View>
  );
}
