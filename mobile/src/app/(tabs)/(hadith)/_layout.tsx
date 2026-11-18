import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';

// The hadith button's pages: the list first, a hadith pushed over it, so a swipe from the right edge goes back (lib/stackOptions.ts).
export const unstable_settings = { initialRouteName: 'hadith' };

export default function HadithStack() {
  return <Stack screenOptions={useStackOptions()} />;
}
