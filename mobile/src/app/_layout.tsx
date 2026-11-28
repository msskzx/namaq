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

function Unloaded({ error }: { error: Error }): null {
  throw error;
}

function Loaded(props: { onReady: () => void }) {
  const App = require('@/components/AppShell').default as Shell;
  return <App {...props} />;
}

export default function RootLayout() {
  const palette = usePalette();
  const scheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    [QURAN_FONT]: require('../../assets/fonts/UthmanicHafs1Ver18.ttf'),
    [UI_FONT]: require('../../assets/fonts/Amiri-Regular.ttf'),
    [UI_FONT_BOLD]: require('../../assets/fonts/Amiri-Bold.ttf'),
  });
  const fonts = fontsLoaded || !!fontError;
  const [data, setData] = useState<true | Error>();
  useEffect(() => {
    loadAppData().then(() => setData(true), (error: unknown) => setData(error instanceof Error ? error : new Error(String(error))));
  }, []);
  const [App, setApp] = useState<Shell>();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
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
        <StatusBar style={(loading ? scheme === 'dark' : palette.scheme === 'dark') ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
