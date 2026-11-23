import { View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import Chip from '@/ui/Chip';
import type { Palette } from '@/lib/theme';

export type TreeBranch<K extends string> = { id: string; name: string; Icon: (props: LucideProps) => React.ReactNode; leaves: { key: K; name: string }[] };

/**
 * A science's questions drawn as a tree (owner, 2026-11-23; sketch quizzes-hub/sketch2-dark.png): a trunk down the right,
 * each interest a branch off it, and its kinds of question the leaves under the branch. A tap on a leaf picks that kind;
 * the branch is framed in the accent, the picked leaf filled in it.
 */
export default function QuizKindTree<K extends string>({ branches, picked, onPick, palette }: {
  branches: TreeBranch<K>[]; picked?: K; onPick: (key: K) => void; palette: Palette }) {
  return (
    <View style={{ borderRightWidth: 1.5, borderColor: palette.rule, marginRight: 6, paddingRight: 14, gap: 16 }}>
      {branches.map(branch => (
        <View key={branch.id} style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* The branch's twig off the trunk. */}
            <View style={{ position: 'absolute', right: -14, width: 12, borderTopWidth: 1.5, borderColor: palette.rule }} />
            <Chip role="text" label={branch.name} Icon={branch.Icon} on lit palette={palette} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginRight: 10, paddingRight: 12, borderRightWidth: 1, borderStyle: 'dashed', borderColor: `${palette.rule}99` }}>
            {branch.leaves.map(leaf => (
              <Chip key={leaf.key} role="radio" label={leaf.name} on={leaf.key === picked} onPress={() => onPick(leaf.key)} palette={palette} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
