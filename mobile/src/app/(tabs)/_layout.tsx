import { Tabs } from 'expo-router/js-tabs';
import TabBar from '@/components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      {/* The bar shows five buttons (components/TabBar.tsx); the Quran button holds its hub and the tools after it (lib/tabGroups.ts). */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="read" />
      <Tabs.Screen name="quizzes" />
      <Tabs.Screen name="utilities" />
      <Tabs.Screen name="quran" />
      <Tabs.Screen name="branches" />
      <Tabs.Screen name="compare" />
      <Tabs.Screen name="prophets" />
      <Tabs.Screen name="tuhfa" />
    </Tabs>
  );
}
