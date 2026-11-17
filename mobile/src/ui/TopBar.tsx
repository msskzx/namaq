import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tap } from '@/ui/Tap';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';
import { hiddenProps, useSlideAway } from '@/ui/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Compass, LayoutGrid, LibraryBig, Settings, CircleHelp, Search } from 'lucide-react-native';
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
 * The phone top bar: the page's own buttons and the bar's (help, search, gear) on the right under the thumb, the logo (home) on the left
 * (owner, 2026-11-17: the logo is always on the left, so the buttons have the right side).
 * The gear shows only on the homepage (owner, 2026-11-10); the logo shows everywhere and opens home.
 * With hideOnScroll (pages that scroll up and down) it slides away while the page scrolls down and comes back on the way up,
 * together with the bottom bar shrinking (owner, 2026-11-10).
 * See-through with no line under it, like the see-through tab bar (owner, 2026-11-13): on the mushaf, where it floats over the page, the page shows blurred through it.
 * With hub (the Quran button's tools) a grid takes the logo's place and opens the Quran hub, the page of all the Quran's tools
 * (owner, 2026-11-15: a chevron reads as "back" in a right-to-left app). With back (pushed screens) a back arrow leads on the right and there is no logo.
 * With bare (the mushaf reader, owner 2026-11-17) there is no logo: the page's buttons start at the right edge, under the thumb;
 * the home tab is in the bottom bar.
 * With center the page's buttons sit in the middle of the bar, clear of the logo (the compare dropdown, owner 2026-11-10).
 * A pushed screen (a quiz, the library, an ayah, a prophet's story) passes back and a title, or middle for something that
 * takes the title's room (the quiz's question circles): one bar for every screen (owner, 2026-11-17: shared first).
 */
export default function TopBar({ children, title, middle, away: putAway = false, bare = false, settings: withSettings = false, hideOnScroll = false, center = false, help, back, hub = false, shelf = false, search, utilities }: { children?: React.ReactNode;
  /** The whole bar slides up off the screen (the mushaf while reading); it stays drawn, so it comes back the same way. */
  away?: boolean;
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
  /** A back arrow, first on the right; the bar then has no logo. */
  back?: () => void;
  /** The page's help (rules and colour legend), among the buttons on the right. */
  help?: () => void;
}) {
  const palette = usePalette();
  // Centred buttons keep clear of both sides: the logo on the left and the buttons on the right, whichever is wider.
  const side = Math.max(SIDE, 12 + ((back || hub || shelf) ? 42 : 0) + [help, utilities, search, withSettings].filter(Boolean).length * 44);
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(false);
  // Scrolling down, the row folds away under the status bar; put away, the whole bar leaves. Both move as every bar does (ui/motion).
  const folded = useCompact() && hideOnScroll;
  const row = useSlideAway(folded, 'top', HEIGHT);
  const bar = useSlideAway(putAway, 'top', insets.top + HEIGHT);
  return (
    <Animated.View {...hiddenProps(putAway)} style={[{ paddingTop: insets.top, overflow: 'hidden' }, bar.content]}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: `${palette.paper}b8` }]} />
      <Animated.View {...hiddenProps(folded)} style={[{ overflow: 'hidden' }, row.frame]}>
      <Animated.View style={[{ height: HEIGHT, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }, row.content]}>
        {/* Everything the thumb presses sits on the right; the logo (home) stays on the left
            (owner, 2026-11-17). A back arrow is the one exception: it leads on the right, the way back in Arabic. */}
        {back && <Tap onPress={back} accessibilityRole="button" accessibilityLabel="رجوع" hitSlop={10} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={28} color={palette.ink} />
        </Tap>}
        {/* The section's own main button leads on the right as well: the grid to the Quran tools, the shelf to the books (owner, 2026-11-17). */}
        {!back && hub && <Tap onPress={toHub} accessibilityRole="button" accessibilityLabel="أدوات القرآن" hitSlop={8} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
          <LayoutGrid size={24} color={palette.ink} />
        </Tap>}
        {!back && shelf && <Tap onPress={toShelf} accessibilityRole="button" accessibilityLabel="المكتبة" hitSlop={8} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
          <LibraryBig size={24} color={palette.ink} />
        </Tap>}
        {middle ? <View style={{ flex: 1, minWidth: 0 }}>{middle}</View>
          : title ? <Text accessibilityRole="header" numberOfLines={1} style={{ flexShrink: 1, color: palette.ink, fontSize: 17, fontWeight: '600' }}>{title}</Text> : null}
        {center && <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, bottom: 0, left: side, right: side, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>{children}</View>}
        {/* The bar's buttons, then the page's, from the right edge; a search field or chips among them take the free room. */}
        <View pointerEvents="box-none" style={{ flexGrow: middle ? 0 : 1, flexShrink: 0, minWidth: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 4 }}>
          {help && <IconButton Icon={CircleHelp} label="مساعدة" onPress={help} />}
          {utilities && <IconButton Icon={Compass} label="الأدوات" onPress={utilities} />}
          {search && <IconButton Icon={Search} label="البحث" onPress={search} />}
          {withSettings && <IconButton Icon={Settings} label="الإعدادات" onPress={() => setSettings(true)} />}
          {center ? null : children}
        </View>
        {bare || back ? null : <Tap onPress={() => toTab('/')} accessibilityRole="button" accessibilityLabel="الصفحة الرئيسية" hitSlop={8}>
          <Logo size={34} />
        </Tap>}
      </Animated.View>
      </Animated.View>
      {withSettings && <SettingsSheet open={settings} onClose={() => setSettings(false)} palette={palette} />}
    </Animated.View>
  );
}
