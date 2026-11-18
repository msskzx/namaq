import { View } from 'react-native';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { usePalette } from '@/lib/theme';

/** The tarajim tab (owner, 2026-11-18): its own button now, an empty page until the people come to the app. */
export default function TarajimScreen() {
  const palette = usePalette();
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar />
      <View style={{ padding: 16 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>التراجم</Text>
      </View>
    </View>
  );
}
