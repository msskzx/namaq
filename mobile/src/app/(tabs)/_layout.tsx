import { Tabs } from 'expo-router/js-tabs';
import TabBar from '@/ui/TabBar';
import { useColumnSide } from '@/ui/column';
import { usePalette } from '@/lib/theme';

export default function TabsLayout() {
  const palette = usePalette();
  const side = useColumnSide();
  return (
    <Tabs tabBar={props => <TabBar {...props} />} backBehavior="history" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="read" />
      <Tabs.Screen name="quizzes" options={{ sceneStyle: { backgroundColor: palette.paper, paddingHorizontal: side } }} />
      <Tabs.Screen name="(hadith)" />
      <Tabs.Screen name="(tarajim)" />
      <Tabs.Screen name="(library)" />
      <Tabs.Screen name="(quran)" />
    </Tabs>
  );
}
