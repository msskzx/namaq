import { useEffect } from 'react';
import { AppState, Dimensions, Platform, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { isTablet } from '@/ui/column';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme, LocaleProvider } from 'expo-router';
import { usePalette } from '@/lib/theme';
import { startAlerts } from '@/lib/adhan';
import { syncPacks } from '@/lib/listenFiles';
import { warmScreens } from '@/lib/lazyScreen';
import ShareSheet from '@/components/ShareSheet';
import SaveNotice from '@/components/SaveNotice';
import AyahMenuHost from '@/components/AyahMenuHost';
import { useStackOptions } from '@/lib/stackOptions';
import { noteRootPage } from '@/lib/ways';
import { leave } from '@/lib/storage';
import { reportError } from '@shared/errors';

export default function AppShell({ onReady }: { onReady: () => void }) {
  const palette = usePalette();
  const stack = useStackOptions();
  useEffect(startAlerts, []);
  useEffect(() => {
    const { width, height } = Dimensions.get('screen');
    if (Platform.OS !== 'web' && !isTablet(width, height)) void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(error => reportError('app: lock portrait', error));
  }, []);
  useEffect(() => { syncPacks(); }, []);
  useEffect(() => { const sub = AppState.addEventListener('change', state => { if (state !== 'active') leave(); }); return () => sub.remove(); }, []);
  useEffect(() => {
    onReady();
    let stop = () => {};
    const start = setTimeout(() => { stop = warmScreens(); }, 1500);
    return () => { clearTimeout(start); stop(); };
  }, [onReady]);
  const base = palette.scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, background: palette.paper, card: palette.paper, text: palette.ink, border: palette.rule, primary: palette.accent } };
  return (
    <ThemeProvider value={theme}>
      <LocaleProvider direction="rtl">
        <View style={{ flex: 1, direction: 'rtl', backgroundColor: palette.paper }}>
          <AyahMenuHost>
          <Stack screenOptions={stack} screenListeners={({ route }) => ({ focus: () => noteRootPage(route.name) })}>
            <Stack.Screen name="(tabs)" options={{ contentStyle: { backgroundColor: palette.paper } }} />
            <Stack.Screen name="scene" options={{ contentStyle: { backgroundColor: palette.paper } }} />
            <Stack.Screen name="library" />
            <Stack.Screen name="ayah" />
            <Stack.Screen name="about" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="attributions" />
            <Stack.Screen name="prophets/[slug]" />
          </Stack>
          </AyahMenuHost>
          <ShareSheet />
          <SaveNotice />
        </View>
      </LocaleProvider>
    </ThemeProvider>
  );
}
