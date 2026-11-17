import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Compass, LayoutGrid, Library, LibraryBig, Settings, CircleHelp, Search } from 'lucide-react-native';
import IconButton from '@/ui/IconButton';
import { Text } from '@/ui/Text';
import Logo from '@/components/Logo';
import SettingsSheet from '@/components/SettingsSheet';
import { usePalette } from '@/lib/theme';
import { useCompact } from '@/lib/chrome';
import { toHub, toShelf, toTab } from '@/lib/ways';

const HEIGHT = 52;
const SIDE = 54; // the logo and its padding, kept clear on both sides so centred buttons stay centred

/**
 * The website's phone top bar: the logo (home) on the right, the page's own buttons, then the settings gear on the left.
 * The gear shows only on the homepage (owner, 2026-11-10); the logo shows everywhere and opens home.
 * With hideOnScroll (pages that scroll up and down) it slides away while the page scrolls down and comes back on the way up,
 * together with the bottom bar shrinking (owner, 2026-11-10).
 * See-through with no line under it, like the see-through tab bar (owner, 2026-11-13): on the mushaf, where it floats over the page, the page shows blurred through it.
 * With hub (the Quran button's tools) a grid takes the logo's place and opens the Quran hub, the page of all the Quran's tools
 * (owner, 2026-11-15: a chevron reads as "back" in a right-to-left app). With back (the search) a back arrow takes it instead.
 * With bare (the mushaf reader, owner 2026-11-17) there is no logo: the page's buttons start at the right edge, under the thumb;
 * the home tab is in the bottom bar.
 * With center the page's buttons sit in the middle of the bar, clear of the logo (the compare dropdown, owner 2026-11-10).
 * A pushed screen (a quiz, the library, an ayah, a prophet's story) passes back and a title, or middle for something that
 * takes the title's room (the quiz's question circles): one bar for every screen (owner, 2026-11-17: shared first).
 */
export default function TopBar({ children, title, middle, bare = false, settings: withSettings = false, hideOnScroll = false, center = false, help, refs, back, hub = false, shelf = false, search, utilities }: { children?: React.ReactNode;
  /** A pushed screen's short title, beside the back arrow. */
  title?: string;
  /** Drawn in the title's place, taking the bar's room (the quiz's question circles). */
  middle?: React.ReactNode;
  /** No logo: the page's buttons start at the right edge (the reader). */
  bare?: boolean; settings?: boolean; hideOnScroll?: boolean; center?: boolean;
  /** A grid in the logo's place that opens the Quran hub (the Quran's tools). */
  hub?: boolean;
  /** The library's books in the logo's place, back to the shelf (a book in the reader, owner 2026-11-17). */
  shelf?: boolean;
  /** The one search across the app, beside the gear (home, owner 2026-11-13). */
  search?: () => void;
  /** The utilities (prayer times, qibla, calendar), as a compass beside the search (home, owner 2026-11-17: a compass says qibla, a clock says nothing). */
  utilities?: () => void;
  /** A back arrow in the logo's place. */
  back?: () => void;
  /** The page's help (rules and colour legend), in the gear's place at the bar's far end. */
  help?: () => void;
  /** The page's sources (with how it counts), as books in the help's place (the words page, owner 2026-11-16). */
  refs?: () => void }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(false);
  const hidden = useCompact() && hideOnScroll;
  const away = useSharedValue(0);
  useEffect(() => { away.value = withTiming(hidden ? 1 : 0, { duration: 180 }); }, [hidden, away]);
  const row = useAnimatedStyle(() => ({ height: interpolate(away.value, [0, 1], [HEIGHT, 0]), opacity: interpolate(away.value, [0, 0.6], [1, 0], 'clamp') }));
  return (
    <View style={{ paddingTop: insets.top, overflow: 'hidden' }}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: `${palette.paper}b8` }]} />
      <Animated.View style={[{ overflow: 'hidden', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }, row]}>
        {bare ? null : hub
          ? <Pressable onPress={toHub} accessibilityRole="button" accessibilityLabel="أدوات القرآن" hitSlop={8} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
            <LayoutGrid size={24} color={palette.ink} />
          </Pressable>
          : shelf
          ? <Pressable onPress={toShelf} accessibilityRole="button" accessibilityLabel="المكتبة" hitSlop={8} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
            <LibraryBig size={24} color={palette.ink} />
          </Pressable>
          : back
          ? <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="رجوع" hitSlop={10} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={28} color={palette.ink} />
          </Pressable>
          : <Pressable onPress={() => toTab('/')} accessibilityRole="button" accessibilityLabel="الصفحة الرئيسية" hitSlop={8}>
            <Logo size={34} />
          </Pressable>}
        {middle ? <View style={{ flex: 1, minWidth: 0 }}>{middle}</View>
          : title ? <Text accessibilityRole="header" numberOfLines={1} style={{ flexShrink: 1, color: palette.ink, fontSize: 17, fontWeight: '600' }}>{title}</Text> : null}
        {center
          ? <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, bottom: 0, left: SIDE, right: SIDE, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>{children}</View>
          : <View style={{ flex: middle ? 0 : 1, flexDirection: 'row', justifyContent: bare ? 'flex-start' : 'flex-end', alignItems: 'center', gap: 4 }}>{children}</View>}
        {(help || refs) && center && <View style={{ flex: 1 }} />}
        {refs && <IconButton Icon={Library} label="المصادر" onPress={refs} />}
        {help && <IconButton Icon={CircleHelp} label="مساعدة" onPress={help} />}
        {utilities && <IconButton Icon={Compass} label="الأدوات" onPress={utilities} />}
        {search && <IconButton Icon={Search} label="البحث" onPress={search} />}
        {withSettings && <IconButton Icon={Settings} label="الإعدادات" onPress={() => setSettings(true)} />}
      </Animated.View>
      {withSettings && <SettingsSheet open={settings} onClose={() => setSettings(false)} palette={palette} />}
    </View>
  );
}
