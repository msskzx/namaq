import { View } from 'react-native';
import { GitFork, type LucideProps } from 'lucide-react-native';

export default function TreeIcon(props: LucideProps) {
  return <View style={{ transform: [{ rotate: '-90deg' }] }}><GitFork {...props} /></View>;
}
