import { router } from 'expo-router';
import { setIntent } from './intent';

/** Opens the reader tab on an ayah. */
export function readAyah(key: string) {
  setIntent({ tab: 'read', at: key });
  router.navigate('/read');
}
