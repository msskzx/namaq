import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export function useNoBackButton() {
  useEffect(() => {
    const held = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => held.remove();
  }, []);
}
