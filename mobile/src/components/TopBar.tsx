import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ScrollText } from 'lucide-react-native';
import Logo from './Logo';
import { usePalette } from '@/lib/theme';

/**
 * The website's phone top bar: the logo (home) on the right, the page's own buttons on the left.
 * The prophets' stories have no tab, so their icon sits beside the logo until the app has a place for such pages.
 */
export default function TopBar({ children }: { children?: React.ReactNode }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: palette.paper, borderBottomWidth: 1, borderColor: palette.rule }}>
      <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
        <Pressable onPress={() => router.navigate('/')} accessibilityRole="button" accessibilityLabel="نمق" hitSlop={8}>
          <Logo size={34} />
        </Pressable>
        <Pressable onPress={() => router.push('/prophets/musa')} accessibilityRole="link" accessibilityLabel="قصص الأنبياء" hitSlop={8} style={{ padding: 6 }}>
          <ScrollText size={24} color={palette.muted} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>{children}</View>
      </View>
    </View>
  );
}
