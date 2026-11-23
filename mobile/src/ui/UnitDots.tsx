import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const DOT = 9;
const GAP = 4;

/**
 * A count drawn as dots, `count` of them in rows from the right, wrapping to the width it is given (owner, 2026-11-23:
 * a battle's numbers as dots, sketch tools-design/battles). What a dot stands for is said beside it by the caller.
 */
export default function UnitDots({ count, color }: { count: number; color: string }) {
  const [width, setWidth] = useState(0);
  const across = Math.max(1, Math.floor((width + GAP) / (DOT + GAP)));
  const rows = Math.ceil(count / across);
  return (
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{ width: '100%' }} accessible={false}>
      {width > 0 && count > 0 && (
        <Svg width={width} height={rows * (DOT + GAP) - GAP}>
          {Array.from({ length: count }, (_, i) => (
            <Circle key={i} cx={width - DOT / 2 - (i % across) * (DOT + GAP)} cy={DOT / 2 + Math.floor(i / across) * (DOT + GAP)} r={DOT / 2} fill={color} />
          ))}
        </Svg>
      )}
    </View>
  );
}
