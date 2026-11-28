import { useLocalSearchParams } from 'expo-router';
import { RAHMAN_KEY } from '@shared/quran/scenes/rahman';
import DarkSea from '@/components/DarkSea';
import RahmanScene from '@/components/RahmanScene';

export default function SceneScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return id === RAHMAN_KEY ? <RahmanScene /> : <DarkSea />;
}
