import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { CirclePlay } from 'lucide-react-native';
import { DARK_SEA_KEY } from '@shared/quran/scenes/darkSea';
import { Text } from '@/ui/Text';
import { SEA_ART } from '@/lib/theme';
import AyahFlow, { AyahWords } from '../quran/text/AyahFlow';
import SeaArt from './SeaArt';
import { useSceneWords } from './SeaThumb';

/** The scene's look the cover stops at: the clouds come over the two waves, just before the darknesses. */
const COVER_LOOK = 4;

/**
 * The scene's cover in the «مشاهد» list (owner, 2026-11-24): a real frame of the scene itself, held still at its best
 * moment, four wide to five tall, about half the screen so the reader still wants to tap; «ظلمات بعضها فوق بعض» in gold on
 * it, the place in the corner and a play mark.
 */
export default function SeaCover({ place }: { place: string }) {
  const words = useSceneWords('night');
  const look = useSharedValue(COVER_LOOK);
  const [size, setSize] = useState({ width: 0, height: 0 });
  return (
    <View onLayout={event => { const { width, height } = event.nativeEvent.layout; setSize(was => (Math.round(was.width) === Math.round(width) && Math.round(was.height) === Math.round(height) ? was : { width, height })); }}
      style={{ aspectRatio: 4 / 5, width: '100%', overflow: 'hidden', backgroundColor: SEA_ART.black }}>
      {/* Drawn again from scratch at a new size: the drawing's paths are made for the size it first had. */}
      {size.width > 0 && <SeaArt key={`${size.width}x${size.height}`} look={look} width={size.width} height={size.height} still />}
      <Svg width={size.width} height={size.height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="cover-vig" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0.6" stopColor={SEA_ART.black} stopOpacity={0} /><Stop offset="1" stopColor={SEA_ART.black} stopOpacity={0.8} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#cover-vig)" />
      </Svg>
      <AyahFlow menu={DARK_SEA_KEY} color={SEA_ART.gold} style={{ position: 'absolute', right: 16, left: 16, bottom: 44 }}>
        {words.map((word, i) => <AyahWords key={i}>{`${i ? ' ' : ''}${word}`}</AyahWords>)}
      </AyahFlow>
      <View style={{ position: 'absolute', right: 14, left: 14, bottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <CirclePlay size={24} color={SEA_ART.gold} />
          <Text style={{ color: SEA_ART.ink, fontSize: 15 }}>شاهد</Text>
        </View>
        <Text style={{ color: SEA_ART.ink, fontSize: 14 }}>{place}</Text>
      </View>
    </View>
  );
}
