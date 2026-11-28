import { View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { num, ayatCount } from '@shared/quran/arabicNumber';
import { surahName } from '@shared/quran/surahNames';
import type { SurahRow as Surah } from '@shared/quran/ayatList';
import { Text } from '@/ui/Text';
import TapRow from '@/ui/TapRow';
import type { Palette } from '@/lib/theme';
import { openAyahPage } from '@/lib/ways';
import { ayahMushafTokens } from '@/lib/mushaf';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';

const LINE = (palette: Palette) => ({ borderBottomWidth: 1, borderColor: `${palette.rule}66` });

export function SurahListRow({ surah, onOpen, palette }: { surah: Surah; onOpen: () => void; palette: Palette }) {
  return (
    <TapRow role="link" onPress={onOpen} label={`سورة ${surahName(surah.number)}، ${ayatCount(surah.numberOfAyat)}`}
      style={{ alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: 16, ...LINE(palette) }}>
      <Text style={{ width: 34, color: palette.muted, fontSize: 15, textAlign: 'center' }}>{num(surah.number)}</Text>
      <Text style={{ flex: 1, color: palette.ink, fontSize: 19, textAlign: 'right' }}>{surahName(surah.number)}</Text>
      <Text style={{ color: palette.muted, fontSize: 14 }}>{ayatCount(surah.numberOfAyat)}</Text>
      <ChevronLeft size={18} color={palette.muted} />
    </TapRow>
  );
}

export function AyahListRow({ ayahKey, named = false, palette }: { ayahKey: string; named?: boolean; palette: Palette }) {
  const [surah, ayah] = ayahKey.split(':').map(Number);
  const text = ayahMushafTokens(ayahKey).join(' ');
  const place = `${surahName(surah)} ${num(ayah)}`;
  return (
    <TapRow role="link" onPress={() => openAyahPage(ayahKey)} label={`${place}: ${text}`}
      style={{ gap: 12, paddingVertical: 10, paddingHorizontal: 16, ...LINE(palette) }}>
      {!named && <Text style={{ width: 34, color: palette.muted, fontSize: 15, paddingTop: 8, textAlign: 'center' }}>{num(ayah)}</Text>}
      <View style={{ flex: 1, gap: 2 }}>
        {named && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{place}</Text>}
        <AyahFlow color={palette.ink} menu={ayahKey} lines={2}><AyahWords>{text}</AyahWords></AyahFlow>
      </View>
    </TapRow>
  );
}
