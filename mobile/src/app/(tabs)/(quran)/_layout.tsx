import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';

// The Quran button's pages: the hub first, its tools pushed over it, so a swipe from the right edge goes back (lib/stackOptions.ts).
// A tool opened from elsewhere still has the hub under it.
export const unstable_settings = { initialRouteName: 'quran' };

export default function QuranStack() {
  return <Stack screenOptions={useStackOptions()} />;
}
