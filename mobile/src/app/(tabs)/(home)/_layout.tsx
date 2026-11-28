import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';
import { useWide, WIDE_COLUMN } from '@/ui/column';

export const unstable_settings = { initialRouteName: 'index' };

export default function HomeStack() {
  const wide = useStackOptions(WIDE_COLUMN);
  const options = useStackOptions();
  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="index" options={useWide() ? wide : options} />
      <Stack.Screen name="utilities" dangerouslySingular={() => 'utilities'} />
    </Stack>
  );
}
