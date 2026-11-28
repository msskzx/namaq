import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';

export const unstable_settings = { initialRouteName: 'tarajim' };

export default function TarajimStack() {
  return <Stack screenOptions={useStackOptions()} />;
}
