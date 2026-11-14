import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';
import { QURAN_TOOLS } from '@/lib/tabGroups';

// The Quran button's pages: the hub first, its tools pushed over it, so a swipe from the right edge goes back (lib/stackOptions.ts).
// A tool opened from elsewhere still has the hub under it.
export const unstable_settings = { initialRouteName: 'quran' };

// Each tool is one page: opened again, the open copy comes to the front (and takes the intent it was opened with)
// instead of a second copy being stacked over the first.
const one = (name: string) => () => name;

export default function QuranStack() {
  return (
    <Stack screenOptions={useStackOptions()}>
      {QURAN_TOOLS.map(name => <Stack.Screen key={name} name={name} dangerouslySingular={one(name)} />)}
    </Stack>
  );
}
