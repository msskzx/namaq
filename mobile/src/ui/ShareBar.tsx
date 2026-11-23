import { View } from 'react-native';

/** A thin bar, from the start, as long as `share` (0 to 1) of its row: how big one thing is beside the biggest. */
export default function ShareBar({ share, colour }: { share: number; colour: string }) {
  return <View style={{ height: 5, borderRadius: 3, width: `${Math.max(0, Math.min(1, share)) * 100}%`, backgroundColor: colour }} />;
}
