import { useCallback, useEffect, useState, type ComponentType } from 'react';
import { View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { QURAN_FONT, UI_FONT, UI_FONT_BOLD, usePalette } from '@/lib/theme';
import '@/lib/storage';
import LoadingScreen from '@/ui/LoadingScreen';
import { loadAppData } from '@/lib/appData';

SplashScreen.preventAutoHideAsync();

type Shell = ComponentType<{ onReady: () => void }>;

/** Stands in for the app when its data could not be read, so the error screen below says why. */
function Unloaded({ error }: { error: Error }): null {
  throw error;
}

/** Requires the app while rendering, so an error in it (or in home's data) reaches the error screen below. */
function Loaded(props: { onReady: () => void }) {
  const App = require('@/components/AppShell').default as Shell;
  return <App {...props} />;
}

/**
 * Keep this file's imports light: they all load before the first frame. The app itself (AppShell, and through it home and
 * home's data) is required only after the loading screen has been drawn, so the phone shows the logo, not a blank screen.
 */
export default function RootLayout() {
  const palette = usePalette();
  const scheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    [QURAN_FONT]: require('../../assets/fonts/UthmanicHafs1Ver18.ttf'),
    [UI_FONT]: require('../../assets/fonts/Amiri-Regular.ttf'),
    [UI_FONT_BOLD]: require('../../assets/fonts/Amiri-Bold.ttf'),
  });
  // A font that fails to load falls back to the system font rather than holding the loading screen forever.
  const fonts = fontsLoaded || !!fontError;
  // The large data files ship beside the code (shared/appData.ts); the app is required only once they are read. If one
  // cannot be read, the error screen shows why, and its «أعد المحاولة» reads them again: the app was never required, so
  // nothing is left half-loaded.
  const [data, setData] = useState<true | Error>();
  useEffect(() => {
    loadAppData().then(() => setData(true), (error: unknown) => setData(error instanceof Error ? error : new Error(String(error))));
  }, []);
  const [App, setApp] = useState<Shell>();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  // Two frames after the fonts: the name and slogan have started to fade in before the heavy load holds the thread.
  useEffect(() => {
    if (!fonts || !data) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setApp(() => (data === true ? Loaded : () => <Unloaded error={data} />)));
    });
    return () => cancelAnimationFrame(frame);
  }, [fonts, data]);
  const onReady = useCallback(() => setReady(true), []);
  const onGone = useCallback(() => setLoading(false), []);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.paper }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: palette.paper }}>
          {App && <App onReady={onReady} />}
          {loading && <LoadingScreen words={fonts} done={ready} onLayout={() => SplashScreen.hideAsync()} onGone={onGone} />}
        </View>
        {/* While loading, the bar sits on the loading screen, which follows the phone's scheme like the splash. */}
        <StatusBar style={(loading ? scheme === 'dark' : palette.scheme === 'dark') ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
