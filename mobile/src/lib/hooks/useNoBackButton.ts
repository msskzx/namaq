import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from 'expo-router';

export function useNoBackButton() {
  useFocusEffect(useCallback(() => {
    const held = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => held.remove();
  }, []));
}
