import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tap } from '@/ui/Tap';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';
import { hiddenProps, useSlideAway } from '@/ui/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, LayoutGrid, LibraryBig, Settings, CircleHelp } from 'lucide-react-native';
import { SearchField, SearchOpener } from '@/ui/Field';
import IconButton from '@/ui/IconButton';
import { Text } from '@/ui/Text';
import Logo from '@/components/Logo';
import SettingsSheet from '@/components/SettingsSheet';
import { usePalette } from '@/lib/theme';
import { useCompact } from '@/lib/chrome';
import { toHub, toShelf, toTab } from '@/lib/ways';

const HEIGHT = 52;
export const TOP_BAR = HEIGHT;
export const TOP_BAR_SEARCH_MAX = 480;
const SIDE = 54;

export default function TopBar({ children, title, middle, away: putAway = false, settings: withSettings = false, hideOnScroll = false, center = false, help, back, hub = false, shelf = false, search }: { children?: React.ReactNode;
  away?: boolean;
  title?: string;
  middle?: React.ReactNode;
  settings?: boolean; hideOnScroll?: boolean; center?: boolean;
  hub?: boolean;
  shelf?: boolean;
  search?: (() => void) | Omit<React.ComponentProps<typeof SearchField>, 'palette' | 'style'>;
  back?: () => void;
  help?: () => void;
}) {
  const palette = usePalette();
  const side = Math.max(SIDE, 12 + ((back || hub || shelf) ? 42 : 0) + [withSettings].filter(Boolean).length * 44);
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(false);
  const folded = useCompact() && hideOnScroll;
  const row = useSlideAway(folded, 'top', HEIGHT);
  const bar = useSlideAway(putAway, 'top', insets.top + HEIGHT);
  return (
    <Animated.View {...hiddenProps(putAway)} style={[{ paddingTop: insets.top, overflow: 'hidden' }, bar.content]}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: `${palette.paper}b8` }]} />
      <Animated.View {...hiddenProps(folded)} style={[{ overflow: 'hidden' }, row.frame]}>
      <Animated.View style={[{ height: HEIGHT, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }, row.content]}>
        {back && <Tap onPress={back} accessibilityRole="button" accessibilityLabel="رجوع" hitSlop={10} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={28} color={palette.ink} />
        </Tap>}
        {!back && hub && <Tap onPress={toHub} accessibilityRole="button" accessibilityLabel="أدوات القرآن" hitSlop={8} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
          <LayoutGrid size={24} color={palette.ink} />
        </Tap>}
        {!back && shelf && <Tap onPress={toShelf} accessibilityRole="button" accessibilityLabel="المكتبة" hitSlop={8} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
          <LibraryBig size={24} color={palette.ink} />
        </Tap>}
        {middle ? <View style={{ flex: 1, minWidth: 0 }}>{middle}</View>
          : title ? <Text accessibilityRole="header" numberOfLines={1} style={{ flexShrink: 1, color: palette.ink, fontSize: 17, fontWeight: '600' }}>{title}</Text> : null}
        {center && <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, bottom: 0, left: side, right: side, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>{children}</View>}
        <View pointerEvents="box-none" style={[{ flexGrow: middle ? 0 : 1, flexShrink: 0, minWidth: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 4 },
          search ? { flexGrow: 1, flexShrink: 1, flexBasis: 0 } : null]}>
          {withSettings && <IconButton Icon={Settings} label="الإعدادات" onPress={() => setSettings(true)} />}
          {search && <View style={{ flex: 1, minWidth: 0, maxWidth: TOP_BAR_SEARCH_MAX }}>
            {typeof search === 'function'
              ? <SearchOpener palette={palette} label="البحث" onPress={search} />
              : <SearchField {...search} palette={palette} style={{ height: 40 }} />}
          </View>}
          {center ? null : children}
        </View>
        {help && <IconButton Icon={CircleHelp} label="مساعدة" onPress={help} />}
        {withSettings && <Tap onPress={() => toTab('/')} accessibilityRole="button" accessibilityLabel="الصفحة الرئيسية" hitSlop={8} style={{ flexShrink: 0 }}>
          <Logo size={34} />
        </Tap>}
      </Animated.View>
      </Animated.View>
      {withSettings && <SettingsSheet open={settings} onClose={() => setSettings(false)} palette={palette} />}
    </Animated.View>
  );
}
