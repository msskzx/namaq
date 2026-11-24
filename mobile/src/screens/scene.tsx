import { useLocalSearchParams } from 'expo-router';
import { RAHMAN_KEY } from '@shared/quran/scenes/rahman';
import DarkSea from '@/components/DarkSea';
import RahmanScene from '@/components/RahmanScene';

/** A scene full screen, over the tabs (owner, 2026-11-22: the size of a short, everything in it), by its id: an-Nur 40's sea, or «الرحمن». */
export default function SceneScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return id === RAHMAN_KEY ? <RahmanScene /> : <DarkSea />;
}
