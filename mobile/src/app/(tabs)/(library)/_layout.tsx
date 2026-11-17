import { Stack } from 'expo-router';
import { useStackOptions } from '@/lib/stackOptions';

// The library button's pages: the shelf first, a book pushed over it, so a swipe from the right edge goes back (lib/stackOptions.ts).
// A book opened from elsewhere (a reader sheet's book button) still has the shelf under it.
export const unstable_settings = { initialRouteName: 'books' };

export default function LibraryStack() {
  return (
    <Stack screenOptions={useStackOptions()}>
      {/* One reader: opened again from a sheet, the open copy comes to the front with the new page instead of stacking a second. */}
      <Stack.Screen name="book" dangerouslySingular={() => 'book'} />
    </Stack>
  );
}
