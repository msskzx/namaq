import { View } from 'react-native';

export default function ShareBar({ share, colour }: { share: number; colour: string }) {
  return <View style={{ height: 5, borderRadius: 3, width: `${Math.max(0, Math.min(1, share)) * 100}%`, backgroundColor: colour }} />;
}
