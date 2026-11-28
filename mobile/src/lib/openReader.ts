import { router } from 'expo-router';
import { setIntent } from './intent';

export function readAyah(key: string) {
  setIntent({ tab: 'read', at: key });
  router.navigate('/read');
}
