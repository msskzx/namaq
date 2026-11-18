import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { BATTLES } from '@/lib/battles';
import { battleLine } from '@/components/battles/BattleParts';

/** Every battle in the app, earliest first; each opens its page. */
export default function BattlesScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>الغزوات والمعارك</Text>
        {BATTLES.map(battle => (
          <Card key={battle.slug} palette={palette} pad={[10, 14]} gap={2} accessibilityRole="link" accessibilityLabel={battle.name}
            onPress={() => router.push({ pathname: '/battle', params: { slug: battle.slug } })}>
            <Text style={{ color: palette.ink, fontSize: 19, textAlign: 'right' }}>{battle.name}</Text>
            <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{battleLine(battle)}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
