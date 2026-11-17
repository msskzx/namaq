import { View } from 'react-native';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { dark, QURAN_FONT, UI_FONT, UI_FONT_BOLD } from '@/lib/theme';

export default function SketchLayout() {
  const [ready] = useFonts({
    [QURAN_FONT]: require('../../assets/fonts/UthmanicHafs1Ver18.ttf'),
    [UI_FONT]: require('../../assets/fonts/Amiri-Regular.ttf'),
    [UI_FONT_BOLD]: require('../../assets/fonts/Amiri-Bold.ttf'),
  });
  return <GestureHandlerRootView style={{ flex: 1, backgroundColor: dark.paper }}>
    <SafeAreaProvider><View style={{ flex: 1 }}>{ready && <Slot />}</View></SafeAreaProvider>
  </GestureHandlerRootView>;
}
