import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, type AnimatedStyle } from 'react-native-reanimated';
import { SEA_ART } from '@/lib/theme';

/**
 * Words over a picture: a soft dark shade behind them, round at the corners, so they read on a bright sky (a «مشاهد» scene).
 * New words fade in rather than jump in.
 */
export default function Shade({ style, children }: { style?: StyleProp<AnimatedStyle<ViewStyle>>; children: React.ReactNode }) {
  return <Animated.View entering={FadeIn.duration(450)} style={[{ backgroundColor: SEA_ART.backing, borderRadius: 24, paddingVertical: 14, paddingHorizontal: 12, gap: 14 }, style]}>{children}</Animated.View>;
}
