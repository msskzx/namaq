import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { BranchPiece } from '@shared/quran/branchInventory';
import TopBar from '@/components/TopBar';
import TreePager from '@/components/TreePager';
import LoadingDots from '@/components/LoadingDots';
import { treeList } from '@/lib/branches';
import { usePalette } from '@/lib/theme';

export default function BranchesScreen() {
  const palette = usePalette();
  const [pieces, setPieces] = useState<BranchPiece[] | null>(null);
  // The tree list is built from the bundled data after the first frame, so the app opens at once.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setTimeout(() => setPieces(treeList()), 0));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar />
      {pieces ? <TreePager pieces={pieces} palette={palette} />
        : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><LoadingDots /></View>}
    </View>
  );
}
