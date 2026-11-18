import { Tabs } from 'expo-router/js-tabs';
import TabBar from '@/ui/TabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />} backBehavior="history" screenOptions={{ headerShown: false }}>
      {/* Android's back follows the tabs opened; inside the home and Quran buttons it first goes back down their page stacks. */}
      {/* The bar shows five buttons (ui/TabBar.tsx). The home, hadith and Quran buttons each hold a page stack, and so does the library, so a swipe from the right edge goes back (lib/stackOptions.ts). */}
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="read" />
      <Tabs.Screen name="quizzes" />
      <Tabs.Screen name="(hadith)" />
      <Tabs.Screen name="(tarajim)" />
      {/* The library has no button of its own: it opens from home (المكتبة), and its shelf has a back arrow. */}
      <Tabs.Screen name="(library)" />
      <Tabs.Screen name="(quran)" />
    </Tabs>
  );
}
