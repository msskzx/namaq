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

/**
 * One place the readers differ (owner, 2026-11-19): the ayah as the mushaf writes it with the words on the band, then each
 * of those words as every reader reads it. Built once and drawn by the «القراءات» page, the feed's readings card and the
 * quiz's «ابحث عن الجواب».
 */
function QiraatPlace({ ayah, words, mark, max, bare = false, lines = false, palette }: { ayah: string;
  /** The word differences shown (their places in qiraatOf); all of them when left out. */
  words?: readonly number[];
  /** The riwayat whose readings are shaded. */
  mark?: readonly number[];
  /** At most this many, then «المزيد» (the feed's card). */
  max?: number;
  /** Inside another frame (the feed's post), without a card of its own. */
  bare?: boolean;
  /** The ayah in the mushaf's own lines, where there is room for them (the feed's card), instead of its words on the band. */
  lines?: boolean; palette: Palette }) {
  const all = qiraatOf(ayah);
  const shown = (words ?? all.map((_, i) => i)).map(i => all[i]).filter(Boolean);
  const tokens = useMemo(() => ayahMushafTokens(ayah), [ayah]);
  // qiraat.json counts the ۞ mark as a word; the page words drawn here leave it out.
  const before = (at: number) => tokens.slice(0, at).filter(word => word === '۞').length;
  // A phrase the source quotes across the end of the ayah before (89:20 «لمّا وتحبون», listed in the build's review) is not
  // banded, rather than banding a word of this ayah alone.
  const fits = (word: (typeof shown)[number]) => word.readings[0].text.split(/\s+/).filter(w => w && w !== '۞').length === word.at[1] - word.at[0] + 1 - (before(word.at[1] + 1) - before(word.at[0]));
  const lit = shown.filter(fits).map(word => [word.at[0] - before(word.at[0]), word.at[1] - before(word.at[1])] as [number, number]);
  const [surah, number] = ayah.split(':').map(Number);
  const listed = max ? shown.slice(0, max) : shown;
  const body = (
    <View style={{ gap: 4 }}>
      {lines ? <View pointerEvents="none"><AyahLines ayah={ayah} palette={palette} shown whole write={null} checked={null} /></View> : <>
        <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{`${surahName(surah)} ${num(number)}`}</Text>
        <LitAyat ayat={[{ words: tokens.filter(word => word !== '۞'), lit, number }]} palette={palette} />
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
  // On its own, a place is a card in the home card's shape with the readings' book on the line under it (owner 2026-11-20).
  return bare ? <View style={{ paddingHorizontal: 14 }}>{body}</View> : <CardWithRow palette={palette} pad={[10, 14]} source={sourcesOf(qiraatSources(ayah))}>{body}</CardWithRow>;
}

export default memo(QiraatPlace);
