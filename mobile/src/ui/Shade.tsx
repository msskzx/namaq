import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, type AnimatedStyle } from 'react-native-reanimated';
import { SEA_ART } from '@/lib/theme';

export default function Shade({ style, children }: { style?: StyleProp<AnimatedStyle<ViewStyle>>; children: React.ReactNode }) {
  return <Animated.View entering={FadeIn.duration(450)} style={[{ backgroundColor: SEA_ART.backing, borderRadius: 24, paddingVertical: 14, paddingHorizontal: 12, gap: 14 }, style]}>{children}</Animated.View>;
}
