import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { SEA_ART } from '@/lib/theme';

/** Words over a picture: a soft dark shade behind them, round at the corners, so they read on a bright sky (a «مشاهد» scene). */
export default function Shade({ style, children }: { style?: StyleProp<AnimatedStyle<ViewStyle>>; children: React.ReactNode }) {
  return <Animated.View style={[{ backgroundColor: SEA_ART.backing, borderRadius: 24, paddingVertical: 14, paddingHorizontal: 12, gap: 14 }, style]}>{children}</Animated.View>;
}
