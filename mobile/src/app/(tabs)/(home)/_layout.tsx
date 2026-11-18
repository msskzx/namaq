import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';

// The home button's pages: home, with the search and the utilities (prayer times, qibla, calendar, adhkar) pushed over it,
// so a swipe from the right edge goes back (lib/stackOptions.ts). Utilities left the tab bar for the library (owner, 2026-11-17).
export const unstable_settings = { initialRouteName: 'index' };

export default function HomeStack() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="utilities" dangerouslySingular={() => 'utilities'} />
    </Stack>
  );
}
