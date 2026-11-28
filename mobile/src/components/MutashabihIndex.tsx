import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text } from '@/ui/Text';
import BarStrip from '@/ui/BarStrip';
import Chip from '@/ui/Chip';
import TapRow from '@/ui/TapRow';
import corpus from '@shared/quran/quranText/corpus';
import { surahName } from '@shared/quran/surahNames';
import { num } from '@shared/quran/arabicNumber';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { indexRows, placesCount, surahCounts, type IndexRow } from '@shared/quran/mutashabih/surahIndex';
import { TAGS } from '@shared/quran/mutashabih/types';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';

const words = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));
const placeName = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${surahName(surah)} ${num(ayah)}`; };
const booksLine = (names: string[]) => (names.length > 2 ? `${num(names.length)} كتب` : names.join(' و'));

function Row({ row, palette, onOpen }: { row: IndexRow; palette: Palette; onOpen: () => void }) {
  const { place, piece, lit } = row;
  const ayah = words.get(place.key) ?? [];
  const shown = ayah.slice(place.start, place.end);
  const others = row.others.slice(0, 2).map(placeName).join('، ') + (row.others.length > 2 ? ` و${num(row.others.length - 2)} غيرها` : '');
  const tag = piece.group?.tags[0];
  return (
    <TapRow role="link" onPress={onOpen} label={`${placeName(place.key)}: ${shown.join(' ')}${others ? `، ونظيرها ${others}` : ''}`}
      style={{ gap: 12, paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: `${palette.rule}66` }}>
      <Text style={{ width: 34, color: palette.muted, fontSize: 14, paddingTop: 8, textAlign: 'right' }}>{num(Number(place.key.split(':')[1]))}</Text>
      <View style={{ flex: 1, gap: 4 }}>
        <AyahFlow color={palette.ink} menu={place.key} lines={2}>
          {shown.map((word, at) => <AyahWords key={at} look={lit.includes(place.start + at) ? { color: palette.accent } : undefined}>{`${word} `}</AyahWords>)}
        </AyahFlow>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          {others ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{`ونظيرها ${others}`}</Text> : null}
          {tag && <Chip small role="text" label={TAGS[tag].ar} on={false} palette={palette} />}
          {row.books.length > 0 && <Text style={{ color: palette.muted, fontSize: 14 }}>{booksLine(row.books)}</Text>}
        </View>
      </View>
    </TapRow>
  );
}

export default function MutashabihIndex({ pieces, start, onOpen, palette, bottom }: {
  pieces: BranchPiece[]; start?: number; onOpen: (piece: BranchPiece, surah: number) => void; palette: Palette; bottom: number;
}) {
  const counts = useMemo(() => surahCounts(pieces), [pieces]);
  const first = counts.findIndex(Boolean) + 1;
  const [picked, setPicked] = useState(start && counts[start - 1] ? start : first);
  const rows = useMemo(() => indexRows(pieces, picked), [pieces, picked]);
  return (
    <FlatList data={rows} keyExtractor={row => `${row.piece.id}:${row.place.key}:${row.place.start}`} initialNumToRender={12} windowSize={7}
      contentContainerStyle={{ paddingBottom: bottom }}
      ListHeaderComponent={<View style={{ paddingHorizontal: 16, paddingBottom: 6, gap: 8 }}>
        <BarStrip counts={counts} picked={picked - 1} onPick={at => setPicked(at + 1)} name={at => surahName(at + 1)} height={64} label="مواضع المتشابه في كل سورة" palette={palette} />
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 20 }}>{surahName(picked)}</Text>
          <Text style={{ color: palette.muted, fontSize: 14 }}>{placesCount(rows.length)}</Text>
        </View>
      </View>}
      renderItem={({ item }) => <Row row={item} palette={palette} onOpen={() => onOpen(item.piece, picked)} />} />
  );
}
