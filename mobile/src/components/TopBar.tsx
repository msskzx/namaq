import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import Logo from './Logo';
import SettingsSheet from './SettingsSheet';
import { usePalette } from '@/lib/theme';

/**
 * The website's phone top bar: the logo (home) on the right, the page's own buttons, then the settings gear on the left.
 * The gear shows only on the homepage (owner, 2026-11-10); the logo shows everywhere and opens home.
 */
export default function TopBar({ children, settings: withSettings = false }: { children?: React.ReactNode; settings?: boolean }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(false);
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: palette.paper, borderBottomWidth: 1, borderColor: palette.rule }}>
      <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
        <Pressable onPress={() => router.navigate('/')} accessibilityRole="button" accessibilityLabel="الصفحة الرئيسية" hitSlop={8}>
          <Logo size={34} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>{children}</View>
        {withSettings && <Pressable onPress={() => setSettings(true)} accessibilityRole="button" accessibilityLabel="الإعدادات" hitSlop={4}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={22} color={palette.muted} />
        </Pressable>}
      </View>
      {withSettings && <SettingsSheet open={settings} onClose={() => setSettings(false)} palette={palette} />}
    </View>
  );
}
