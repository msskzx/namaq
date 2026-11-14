import { Tabs } from 'expo-router/js-tabs';
import TabBar from '@/components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />} backBehavior="history" screenOptions={{ headerShown: false }}>
      {/* Android's back follows the tabs opened; inside the home and Quran buttons it first goes back down their page stacks. */}
      {/* The bar shows five buttons (components/TabBar.tsx). The home and Quran buttons each hold a page stack, so a swipe from the right edge goes back (lib/stackOptions.ts). */}
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="read" />
      <Tabs.Screen name="quizzes" />
      <Tabs.Screen name="utilities" />
      <Tabs.Screen name="(quran)" />
    </Tabs>
  );
}
