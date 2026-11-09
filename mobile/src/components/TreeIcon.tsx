import { View } from 'react-native';
import { GitFork, type LucideProps } from 'lucide-react-native';

/** GitFork turned a quarter counterclockwise grows like the Arabic trees: one root on the right, two branches to the left. */
export default function TreeIcon(props: LucideProps) {
  return <View style={{ transform: [{ rotate: '-90deg' }] }}><GitFork {...props} /></View>;
}
