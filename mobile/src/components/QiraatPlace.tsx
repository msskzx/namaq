import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { CardWithRow } from '@/ui/Card';
import { sourcesOf } from '@/ui/SourceLine';
import { qiraatSources } from '@shared/quiz/bookSources';
import { num } from '@shared/quran/arabicNumber';
import { qiraatOf } from '@shared/quran/qiraatData';
import { surahName } from '@shared/quran/surahNames';
import { ayahMushafTokens } from '@/lib/mushaf';
import type { Palette } from '@/lib/theme';
import LitAyat from './quran/text/LitAyat';
import AyahLines from './AyahLines';
import { QiraatWord } from './AyahPreviewSheet';

function QiraatPlace({ ayah, words, mark, max, bare = false, lines = false, palette }: { ayah: string;
  words?: readonly number[];
  mark?: readonly number[];
  max?: number;
  bare?: boolean;
  lines?: boolean; palette: Palette }) {
  const all = qiraatOf(ayah);
  const shown = (words ?? all.map((_, i) => i)).map(i => all[i]).filter(Boolean);
  const tokens = useMemo(() => ayahMushafTokens(ayah), [ayah]);
  const before = (at: number) => tokens.slice(0, at).filter(word => word === '۞').length;
  const fits = (word: (typeof shown)[number]) => word.readings[0].text.split(/\s+/).filter(w => w && w !== '۞').length === word.at[1] - word.at[0] + 1 - (before(word.at[1] + 1) - before(word.at[0]));
  const lit = shown.filter(fits).map(word => [word.at[0] - before(word.at[0]), word.at[1] - before(word.at[1])] as [number, number]);
  const [surah, number] = ayah.split(':').map(Number);
  const listed = max ? shown.slice(0, max) : shown;
  const body = (
    <View style={{ gap: 4 }}>
      {lines ? <View pointerEvents="none"><AyahLines ayah={ayah} menu={false} palette={palette} shown whole write={null} checked={null} /></View> : <>
        <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{`${surahName(surah)} ${num(number)}`}</Text>
        <LitAyat ayat={[{ words: tokens.filter(word => word !== '۞'), lit, number }]} menu={ayah} palette={palette} />
      </>}
      <View style={{ height: 1, backgroundColor: palette.rule, opacity: 0.6, marginVertical: 2 }} />
      {listed.map((word, i) => (
        <View key={`${i}@${word.at.join("-")}`} style={i ? { borderTopWidth: 1, borderTopColor: palette.rule, borderStyle: 'dashed' } : undefined}>
          <QiraatWord word={word} palette={palette} mark={mark} bare inset={0} />
        </View>
      ))}
      {listed.length < shown.length && <Text style={{ color: palette.accent, fontSize: 14, textAlign: 'right' }}>المزيد</Text>}
    </View>
  );
  return bare ? <View style={{ paddingHorizontal: 14 }}>{body}</View> : <CardWithRow palette={palette} pad={[10, 14]} source={sourcesOf(qiraatSources(ayah))}>{body}</CardWithRow>;
}

export default memo(QiraatPlace);
