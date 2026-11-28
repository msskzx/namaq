import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';

export const unstable_settings = { initialRouteName: 'hadith' };

export default function HadithStack() {
  return <Stack screenOptions={useStackOptions()} />;
}
