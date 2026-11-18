import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';

// The tarajim button's pages (owner, 2026-11-18): an empty page until the people come to the app.
export const unstable_settings = { initialRouteName: 'tarajim' };

export default function TarajimStack() {
  return <Stack screenOptions={useStackOptions()} />;
}
