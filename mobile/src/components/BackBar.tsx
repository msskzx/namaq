import { Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { usePalette } from '@/lib/theme';

/** A pushed screen's top bar: back on the right, a short title, the screen's own buttons on the left. */
export default function BackBar({ title, children, onBack }: { title?: string; children?: React.ReactNode; onBack?: () => void }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: palette.paper, borderBottomWidth: 1, borderColor: palette.rule }}>
      <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 4 }}>
        <Pressable onPress={onBack ?? (() => router.back())} accessibilityRole="button" accessibilityLabel="رجوع" hitSlop={10} style={{ padding: 6 }}>
          <ChevronRight size={28} color={palette.ink} />
        </Pressable>
        {title ? <Text numberOfLines={1} style={{ flexShrink: 1, color: palette.ink, fontSize: 17, fontWeight: '600' }}>{title}</Text> : null}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>{children}</View>
      </View>
    </View>
  );
}
