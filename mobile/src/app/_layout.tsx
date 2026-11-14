import { useCallback, useEffect, useState, type ComponentType } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { QURAN_FONT, UI_FONT, UI_FONT_BOLD, usePalette, dark } from '@/lib/theme';
import '@/lib/storage';
import LoadingScreen from '@/components/LoadingScreen';

SplashScreen.preventAutoHideAsync();

type Shell = ComponentType<{ onReady: () => void }>;

/**
 * Keep this file's imports light: they all load before the first frame. The app itself (AppShell, and through it home and
 * home's data) is required only after the loading screen has been drawn, so the phone shows the logo, not a blank screen.
 */
export default function RootLayout() {
  const palette = usePalette();
  const [fonts] = useFonts({
    [QURAN_FONT]: require('../../assets/fonts/UthmanicHafs1Ver18.ttf'),
    [UI_FONT]: require('../../assets/fonts/Amiri-Regular.ttf'),
    [UI_FONT_BOLD]: require('../../assets/fonts/Amiri-Bold.ttf'),
  });
  const [App, setApp] = useState<Shell>();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  // Two frames after the fonts: the name and slogan have started to fade in before the heavy load holds the thread.
  useEffect(() => {
    if (!fonts) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setApp(() => require('@/components/AppShell').default as Shell));
    });
    return () => cancelAnimationFrame(frame);
  }, [fonts]);
  const onReady = useCallback(() => setReady(true), []);
  const onGone = useCallback(() => setLoading(false), []);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.paper }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: palette.paper }}>
          {App && <App onReady={onReady} />}
          {loading && <LoadingScreen words={fonts} done={ready} onLayout={() => SplashScreen.hideAsync()} onGone={onGone} />}
        </View>
        <StatusBar style={palette.paper === dark.paper ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
