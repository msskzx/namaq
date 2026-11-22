import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { DARK_SEA_KEY, DARK_SEA_STEPS, darkSeaWords } from '@shared/quran/scenes/darkSea';
import { Text } from '@/ui/Text';
import { ayahMushafWords } from '@/lib/mushaf';
import { SEA_ART } from '@/lib/theme';
import AyahFlow, { AyahWords } from '../quran/text/AyahFlow';

/** The page whose words a picture or a title shows. */
const pageOf = (layer: string) => DARK_SEA_STEPS.findIndex(step => step.layer === layer && step.phrase);

/** The words of one of the scene's pages, off the mushaf page. */
export function useSceneWords(layer: string) {
  return useMemo(() => {
    const page = pageOf(layer);
    return darkSeaWords(ayahMushafWords).filter(word => word.step === page).map(word => word.text);
  }, [layer]);
}

/**
 * The scene's picture on its card (owner, 2026-11-22, sketch /mnt/project-files/mashahid/list-sketch-2, picture A with no
 * hand): a stormy night sea, a wave over a wave under heavy clouds, «ظلمات بعضها فوق بعض» large on it and «النور ٤٠» in the
 * corner, as a video's still invites a tap.
 */
export default function SeaThumb({ place }: { place: string }) {
  const words = useSceneWords('night');
  const { sky, haze, cloud, mist, wave, edge, badge, badgeInk } = SEA_ART.thumb;
  return (
    <View style={{ aspectRatio: 440 / 248, width: '100%', overflow: 'hidden', backgroundColor: SEA_ART.black }}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 440 248" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="tsky" x1="0" y1="0" x2="0" y2="1">
            {[0, 0.45, 0.62, 1].map((at, i) => <Stop key={at} offset={at} stopColor={sky[i]} />)}
          </LinearGradient>
          <RadialGradient id="trim" cx="0.5" cy="0.58" r="0.55"><Stop offset="0" stopColor={haze} stopOpacity={0.35} /><Stop offset="1" stopColor={haze} stopOpacity={0} /></RadialGradient>
          <LinearGradient id="tcl" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={cloud[0]} /><Stop offset="1" stopColor={cloud[1]} /></LinearGradient>
          <LinearGradient id="tvig" x1="0" y1="0" x2="0" y2="1"><Stop offset="0.55" stopColor={SEA_ART.black} stopOpacity={0} /><Stop offset="1" stopColor={SEA_ART.black} stopOpacity={0.85} /></LinearGradient>
        </Defs>
        <Rect width="440" height="248" fill="url(#tsky)" />
        <G fill="url(#tcl)"><Ellipse cx="70" cy="40" rx="120" ry="44" /><Ellipse cx="230" cy="22" rx="150" ry="40" /><Ellipse cx="390" cy="44" rx="120" ry="46" /></G>
        <G fill={mist} opacity={0.5}><Ellipse cx="120" cy="76" rx="90" ry="8" /><Ellipse cx="330" cy="80" rx="100" ry="7" /></G>
        <Rect width="440" height="248" fill="url(#trim)" />
        <Path d="M0 150 C60 132 90 96 150 92 C190 90 205 118 240 128 C270 136 300 108 340 104 C390 100 410 128 440 132 V248 H0Z" fill={wave[0]} />
        <Path d="M0 150 C60 132 90 96 150 92 C190 90 205 118 240 128 C270 136 300 108 340 104 C390 100 410 128 440 132" fill="none" stroke={edge[0]} strokeOpacity={0.55} strokeWidth={2} />
        <Path d="M0 178 C50 166 80 150 130 156 C180 162 210 178 260 172 C310 166 340 150 390 156 C415 159 430 166 440 168 V248 H0Z" fill={wave[1]} />
        <Path d="M0 178 C50 166 80 150 130 156 C180 162 210 178 260 172 C310 166 340 150 390 156 C415 159 430 166 440 168" fill="none" stroke={edge[1]} strokeOpacity={0.5} strokeWidth={1.6} />
        <Rect width="440" height="248" fill="url(#tvig)" />
      </Svg>
      <AyahFlow menu={DARK_SEA_KEY} color={SEA_ART.gold} style={{ position: 'absolute', right: 14, left: 96, bottom: 6 }}>
        {words.map((word, i) => <AyahWords key={i}>{`${i ? ' ' : ''}${word}`}</AyahWords>)}
      </AyahFlow>
      <View style={{ position: 'absolute', left: 10, bottom: 10, backgroundColor: badge, paddingHorizontal: 8, paddingVertical: 2 }}>
        <Text style={{ color: badgeInk, fontSize: 14 }}>{place}</Text>
      </View>
    </View>
  );
}

