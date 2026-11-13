import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { QURAN_FONT, UI_FONT, UI_FONT_BOLD, usePalette, dark } from '@/lib/theme';
import '@/lib/storage';
import { startAlerts } from '@/lib/adhan';
import ShareSheet from '@/components/ShareSheet';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const palette = usePalette();
  const [loaded] = useFonts({
    [QURAN_FONT]: require('../../assets/fonts/UthmanicHafs1Ver18.ttf'),
    [UI_FONT]: require('../../assets/fonts/Amiri-Regular.ttf'),
    [UI_FONT_BOLD]: require('../../assets/fonts/Amiri-Bold.ttf'),
  });
  useEffect(() => { if (loaded) SplashScreen.hideAsync(); }, [loaded]);
  // Adhan notifications follow the switches, the place and the method, and roll forward each day the app is opened.
  useEffect(startAlerts, []);
  if (!loaded) return null;
  const base = palette.paper === dark.paper ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, background: palette.paper, card: palette.paper, text: palette.ink, border: palette.rule, primary: palette.accent } };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
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
          <StatusBar style={palette.paper === dark.paper ? 'light' : 'dark'} />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
