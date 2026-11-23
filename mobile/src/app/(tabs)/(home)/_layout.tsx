import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';
import { useWide, WIDE_COLUMN } from '@/ui/column';

// The home button's pages: home, with the search and the utilities (prayer times, qibla, calendar, adhkar) pushed over it,
// so a swipe from the right edge goes back (lib/stackOptions.ts). Utilities left the tab bar for the library (owner, 2026-11-17).
export const unstable_settings = { initialRouteName: 'index' };

export default function HomeStack() {
  // Home lying down on a tablet spreads to two columns of cards (owner, 2026-11-23).
  const wide = useStackOptions(WIDE_COLUMN);
  const options = useStackOptions();
  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="index" options={useWide() ? wide : options} />
      <Stack.Screen name="utilities" dangerouslySingular={() => 'utilities'} />
    </Stack>
  );
}
