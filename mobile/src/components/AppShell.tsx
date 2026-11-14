import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { usePalette, dark } from '@/lib/theme';
import { startAlerts } from '@/lib/adhan';
import { warmScreens } from '@/lib/lazyScreen';
import ShareSheet from '@/components/ShareSheet';

/**
 * Everything the app shows, loaded by the root layout only after the loading screen is up (app/_layout.tsx),
 * because mounting it reads home and all the data home needs. `onReady` fires once home is drawn.
 */
export default function AppShell({ onReady }: { onReady: () => void }) {
  const palette = usePalette();
  // Adhan notifications follow the switches, the place and the method, and roll forward each day the app is opened.
  useEffect(startAlerts, []);
  // Children mount first, so home is on screen by now; the other screens load behind it, a little later.
  useEffect(() => {
    onReady();
    let stop = () => {};
    const start = setTimeout(() => { stop = warmScreens(); }, 1500);
    return () => { clearTimeout(start); stop(); };
  }, [onReady]);
  const base = palette.paper === dark.paper ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, background: palette.paper, card: palette.paper, text: palette.ink, border: palette.rule, primary: palette.accent } };
  return (
    <ThemeProvider value={theme}>
      {/* Arabic first: every row starts on the right. */}
      <View style={{ flex: 1, direction: 'rtl', backgroundColor: palette.paper }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.paper } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="ayah" />
          <Stack.Screen name="library" />
          <Stack.Screen name="prophets/[slug]" />
        </Stack>
        <ShareSheet />
      </View>
    </ThemeProvider>
  );
}
