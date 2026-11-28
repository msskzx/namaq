import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { hiddenProps, useSlideAway } from '@/ui/motion';
import { Text } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import { useCompact } from '@/lib/chrome';
import type { Palette } from '@/lib/theme';

const HEIGHT = 18;

export default function PageProgress({ at, count, label, palette }: { at: number; count: number; label: string; palette: Palette }) {
  const hidden = useCompact();
  const { frame, content } = useSlideAway(hidden, 'top', HEIGHT);
  if (count < 2) return null;
  return (
    <Animated.View {...hiddenProps(hidden)} style={[{ overflow: 'hidden' }, frame]} accessibilityLabel={`${label} ${num(at)} من ${num(count)}`}>
      <Animated.View style={[{ height: HEIGHT }, content]}>
      <View style={{ height: 2, backgroundColor: palette.rule }}>
        <View style={{ height: 2, width: `${(at / count) * 100}%`, alignSelf: 'flex-start', backgroundColor: palette.muted }} />
      </View>
      <Text style={{ alignSelf: 'flex-end', paddingHorizontal: 12, paddingTop: 2, color: palette.muted, fontSize: 11, lineHeight: 14 }}>{num(at)} / {num(count)}</Text>
      </Animated.View>
    </Animated.View>
  );
}
