import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { HOURGLASS_FRAME, hourglassSand } from '@shared/quran/hourglass';
import { num } from '@shared/quran/arabicNumber';

/** The ask mode's timer, as on the website: sand running down and the seconds left. */
export default function Hourglass({ left, seconds, color }: { left: number; seconds: number; color: string }) {
  const sand = hourglassSand(left);
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Svg width={26} height={26} viewBox="0 0 24 24">
        <Path d={HOURGLASS_FRAME} stroke={color} strokeWidth={1.5} fill="none" />
        <Path d={sand.top} fill={color} />
        <Path d={sand.bottom} fill={color} />
        {sand.stream ? <Path d={sand.stream} stroke={color} strokeWidth={1} fill="none" /> : null}
      </Svg>
      <Text style={{ color, fontSize: 13, fontWeight: '700' }}>{num(Math.max(1, Math.ceil(left * seconds)))}</Text>
    </View>
  );
}
