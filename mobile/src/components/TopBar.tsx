import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Logo from './Logo';
import { usePalette } from '@/lib/theme';

/** The website's phone top bar: the logo (home) on the right, the page's own buttons on the left. */
export default function TopBar({ children }: { children?: React.ReactNode }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: palette.paper, borderBottomWidth: 1, borderColor: palette.rule }}>
      <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
        <Pressable onPress={() => router.navigate('/')} accessibilityRole="button" accessibilityLabel="نمق" hitSlop={8}>
          <Logo size={34} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>{children}</View>
      </View>
    </View>
  );
}
