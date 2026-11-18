import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { router } from 'expo-router';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import { BATTLES } from '@/lib/battles';
import { usePalette } from '@/lib/theme';

/** The tarajim tab (owner, 2026-11-18): its own button now, the battles for now, the people when they come to the app. */
export default function TarajimScreen() {
  const palette = usePalette();
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar />
      <View style={{ padding: 16, gap: 14 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>التراجم</Text>
        <Card palette={palette} pad={16} gap={4} accessibilityRole="link" accessibilityLabel="الغزوات والمعارك" onPress={() => router.push('/battles')}>
          <Text style={{ color: palette.ink, fontSize: 20, textAlign: 'right' }}>الغزوات والمعارك</Text>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`${BATTLES[0].name} … ${BATTLES[BATTLES.length - 1].name}`}</Text>
        </Card>
      </View>
    </View>
  );
}
