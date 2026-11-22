import { useEffect } from 'react';
import { AppState, View } from 'react-native';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme, LocaleProvider } from 'expo-router';
import { usePalette } from '@/lib/theme';
import { startAlerts } from '@/lib/adhan';
import { syncPacks } from '@/lib/listenFiles';
import { warmScreens } from '@/lib/lazyScreen';
import ShareSheet from '@/components/ShareSheet';
import SaveNotice from '@/components/SaveNotice';
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
          <Stack screenOptions={stack} screenListeners={({ route }) => ({ focus: () => noteRootPage(route.name) })}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="library" />
            <Stack.Screen name="ayah" />
            <Stack.Screen name="about" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="attributions" />
            <Stack.Screen name="prophets/[slug]" />
          </Stack>
          <ShareSheet />
          <SaveNotice />
        </View>
      </LocaleProvider>
    </ThemeProvider>
  );
}
