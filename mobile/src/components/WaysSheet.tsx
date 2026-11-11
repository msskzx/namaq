import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ArrowLeftRight, BookOpen, ChevronLeft, GalleryHorizontal, type LucideProps } from 'lucide-react-native';
import { Text } from '@/components/Text';
import type { CompareTarget } from '@/lib/compare';
import type { CardWay } from '@/lib/home';
import type { Palette } from '@/lib/theme';
import { followWay } from '@/lib/ways';
import CompareTargetsSheet from './CompareTargetsSheet';
import Sheet from './Sheet';
import TreeIcon from './TreeIcon';

const WAYS: Record<CardWay['to'], { label: string; Icon: (props: LucideProps) => React.ReactNode }> = {
  mushaf: { label: 'في المصحف', Icon: BookOpen },
  tree: { label: 'الشجرة', Icon: TreeIcon },
  matrix: { label: 'المصفوفة', Icon: GalleryHorizontal },
  trees: { label: 'الأشجار التي فيها الآية', Icon: TreeIcon },
  compare: { label: 'في المقارنة', Icon: ArrowLeftRight },
};

/** A saved card's long press: every other view of its ayat, one row each; compare across several surahs is picked next. */
export default function WaysSheet({ ways, onClose, palette }: { ways: CardWay[] | null; onClose: () => void; palette: Palette }) {
  const [choosing, setChoosing] = useState<{ way: CardWay; targets: CompareTarget[] } | null>(null);
  useEffect(() => { if (!ways) setChoosing(null); }, [ways]);
  const follow = (way: CardWay) => {
    if (way.to === 'compare' && way.targets.length > 1) { setChoosing({ way, targets: way.targets }); return; }
    onClose();
    followWay(way);
  };
  return (
    <>
      <Sheet open={!!ways && !choosing} onClose={onClose} palette={palette}>
        {ways && <View style={{ paddingHorizontal: 16, paddingBottom: 20, gap: 8 }}>
          {ways.map(way => {
            const { label, Icon } = WAYS[way.to];
            return (
              <Pressable key={way.to} onPress={() => follow(way)} accessibilityRole="button" accessibilityLabel={label}
                style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: palette.rule }}>
                <Icon size={22} color={palette.ink} />
                <Text style={{ flex: 1, color: palette.ink, fontSize: 16, textAlign: 'right' }}>{label}</Text>
                <ChevronLeft size={18} color={palette.muted} />
              </Pressable>
            );
          })}
        </View>}
      </Sheet>
      <CompareTargetsSheet targets={choosing?.targets ?? null} palette={palette}
        onPick={target => { const way = choosing!.way; setChoosing(null); onClose(); followWay(way, target); }}
        onClose={() => { setChoosing(null); onClose(); }} />
    </>
  );
}
