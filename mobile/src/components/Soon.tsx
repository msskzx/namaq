import { Linking, Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import TopBar from './TopBar';
import { WEBSITE } from '@/lib/branches';
import { usePalette } from '@/lib/theme';

/** A tab whose screen comes later in the app; until then it opens the website's page. */
export default function Soon({ path }: { path: string }) {
  const palette = usePalette();
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <Text style={{ color: palette.muted, fontSize: 17 }}>قريبًا في التطبيق</Text>
        <Pressable onPress={() => void Linking.openURL(`${WEBSITE}${path}`)} accessibilityRole="link"
          style={{ borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 }}>
          <Text style={{ color: palette.accent, fontSize: 16 }}>افتحها في الموقع</Text>
        </Pressable>
      </View>
    </View>
  );
}
