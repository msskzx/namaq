import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';
import { QURAN_TOOLS } from '@/lib/tabGroups';

export const unstable_settings = { initialRouteName: 'quran' };

const one = (name: string) => () => name;

export default function QuranStack() {
  return (
    <Stack screenOptions={useStackOptions()}>
      {QURAN_TOOLS.map(name => <Stack.Screen key={name} name={name} dangerouslySingular={one(name)} />)}
    </Stack>
  );
}
