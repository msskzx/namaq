import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';

export const unstable_settings = { initialRouteName: 'books' };

export default function LibraryStack() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="book" dangerouslySingular={() => 'book'} />
    </Stack>
  );
}
