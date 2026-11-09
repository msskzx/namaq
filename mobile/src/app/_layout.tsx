import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { QURAN_FONT, usePalette, dark } from '@/lib/theme';
import '@/lib/storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const palette = usePalette();
  const [loaded] = useFonts({ [QURAN_FONT]: require('../../assets/fonts/UthmanicHafs1Ver18.ttf') });
  useEffect(() => { if (loaded) SplashScreen.hideAsync(); }, [loaded]);
  if (!loaded) return null;
  const base = palette === dark ? DarkTheme : DefaultTheme;
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
            </Stack>
          </View>
          <StatusBar style={palette === dark ? 'light' : 'dark'} />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
