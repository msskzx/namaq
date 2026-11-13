import { Platform } from 'react-native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { haptics } from './settings';

/** A light tap, when the haptics setting is on. Browsers have none. */
export function buzz() {
  if (Platform.OS !== 'web' && haptics.get()) impactAsync(ImpactFeedbackStyle.Light).catch(() => {});
}
