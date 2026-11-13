import { View } from 'react-native';
import TopBar from '@/components/TopBar';
import { usePalette } from '@/lib/theme';

/**
 * The utilities tab: prayer times, the qibla and the Hijri calendar (owner, 2026-11-13). The thread building them owns this page;
 * the tab bar hides its button (SHOW_UTILITIES in components/TabBar.tsx) until the first of them lands.
 */
export default function UtilitiesTab() {
  const palette = usePalette();
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar />
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
