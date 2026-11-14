import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';

// The home button's pages: home, with the search pushed over it, so a swipe from the right edge goes back (lib/stackOptions.ts).
export const unstable_settings = { initialRouteName: 'index' };

export default function HomeStack() {
  return <Stack screenOptions={useStackOptions()} />;
}
