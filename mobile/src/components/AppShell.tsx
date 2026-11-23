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

/**
 * Everything the app shows, loaded by the root layout only after the loading screen is up (app/_layout.tsx),
 * because mounting it reads home and all the data home needs. `onReady` fires once home is drawn.
 */
export default function AppShell({ onReady }: { onReady: () => void }) {
  const palette = usePalette();
  const stack = useStackOptions();
  // Adhan notifications follow the switches, the place and the method, and roll forward each day the app is opened.
  useEffect(startAlerts, []);
  // A tablet turns both ways; a phone stays standing (owner, 2026-11-23), so app.json allows every way and phones lock here.
  useEffect(() => {
    const { width, height } = Dimensions.get('screen');
    if (Platform.OS !== 'web' && !isTablet(width, height)) void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
  }, []);
  // Downloaded recitations stay current through Quran Foundation's Content Sync (lib/listenFiles.ts).
  useEffect(() => { syncPacks(); }, []);
  // The phone may close a backgrounded app without another timer tick: what waits to be saved is saved now.
  useEffect(() => { const sub = AppState.addEventListener('change', state => { if (state !== 'active') leave(); }); return () => sub.remove(); }, []);
  // Children mount first, so home is on screen by now; the other screens load behind it, a little later.
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
      {/* Arabic first: every row starts on the right, and every page stack goes back with a swipe from the right edge (lib/stackOptions.ts). */}
      <LocaleProvider direction="rtl">
        <View style={{ flex: 1, direction: 'rtl', backgroundColor: palette.paper }}>
          {/* A long press on an ayah anywhere off the mushaf opens the reader's menu (owner, 2026-11-22). */}
          <AyahMenuHost>
          <Stack screenOptions={stack} screenListeners={({ route }) => ({ focus: () => noteRootPage(route.name) })}>
            {/* The tabs' own stacks set each page's column; a scene fills the whole screen. */}
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
