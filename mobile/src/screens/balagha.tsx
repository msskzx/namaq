import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import itqan from '@shared/data/quran/itqanBalagha';
import { DEVICES, deviceOf, exampleReference } from '@shared/quran/balaghaPage';
import { examples, type Voice } from '@shared/quran/iltifat';
import { Text } from '@/components/Text';
import { IltifatCard, VOICE_NAME, voiceColor } from '@/components/Iltifat';
import Reference from '@/components/Reference';
import TopBar from '@/components/TopBar';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette } from '@/lib/theme';

/**
 * The website's /quran/balagha (owner, 2026-11-16): a curated list of examples, each card with its own picture, grouped
 * by device with pills to pick one. Each device and each card carries its reference (shared/quran/balaghaPage.ts).
 */
export default function BalaghaScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [device, setDevice] = useState<string | null>(null);
  const views = useMemo(examples, []);
  const references = useMemo(() => Object.fromEntries(views.map(view => [view.key, exampleReference(view, itqan)])), [views]);
  useTabRetap('balagha', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const chip = (on: boolean) => ({ borderWidth: 1, borderColor: on ? palette.accent : palette.rule, backgroundColor: on ? palette.accent : 'transparent', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 });
  const pill = (name: string | null, label: string) => (
    <Pressable key={label} onPress={() => setDevice(name)} accessibilityRole="tab" aria-selected={device === name} style={chip(device === name)}>
      <Text style={{ color: device === name ? palette.onAccent : palette.ink, fontSize: 15 }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll />
      <ScrollView ref={scroll} onScroll={shrink} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>البلاغة</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }} accessibilityRole="tablist">
          {pill(null, 'الكل')}
          {DEVICES.map(item => pill(item.name, item.name))}
        </View>
        {DEVICES.filter(item => device === null || device === item.name).map(item => (
          <View key={item.name} style={{ gap: 12 }}>
            <View style={{ gap: 4 }}>
              <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 20, textAlign: 'right' }}>{item.name}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 16 }} accessibilityLabel="ألوان الضمائر">
                {(['he', 'we', 'you'] as Voice[]).map(voice => <Text key={voice} style={{ color: voiceColor(palette, voice), fontSize: 14 }}>{{ he: 'هو', we: 'نحن، أنا', you: 'أنت' }[voice]}: {VOICE_NAME[voice]}</Text>)}
              </View>
              <Reference title={item.reference.title} quotes={item.reference.quotes} palette={palette} />
            </View>
            {views.filter(view => deviceOf(view).name === item.name).map(view => (
              <View key={view.key} style={{ gap: 6 }}>
                <IltifatCard view={view} palette={palette} />
                <View style={{ paddingHorizontal: 4 }}><Reference title={references[view.key].title} quotes={references[view.key].quotes} palette={palette} /></View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
