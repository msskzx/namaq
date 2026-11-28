import { Platform } from 'react-native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { haptics } from './settings';
import { reportError } from '@shared/errors';

export function buzz() {
  if (Platform.OS !== 'web' && haptics.get()) impactAsync(ImpactFeedbackStyle.Light).catch(error => reportError('haptics', error));
}
