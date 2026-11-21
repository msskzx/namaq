import { View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { orderSource, orderSurahs, type Cite, type OrderAyah, type OrderLinkView, type OrderSurah } from '@shared/quran/surahOrder';
import { Text } from '@/ui/Text';
import SourceLine from '@/ui/SourceLine';
import Sheet from '@/ui/Sheet';
import Button from '@/ui/Button';
import { readAyah } from '@/lib/openReader';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from '@/components/quran/text/AyahFlow';
import { ayahMushafWords } from '@/lib/mushaf';
import IconButton from '@/ui/IconButton';
import { CardWithRow } from '@/ui/Card';

/**
 * The surah-order page's pieces (owner, 2026-11-13), shared with the quizzes that order surahs: a surah's card (its opening
 * ayat and al-Biqa'i's aim) and the link between two surahs (al-Suyuti's words), all quoted from the books with their pages.
 */
let surahs: OrderSurah[] | null = null;
/** Every surah's card, built once when first asked for (the openings take the Quran's pages). */
export const orderSurahList = () => (surahs ??= orderSurahs(ayahMushafWords, num));

/** A quote's book as the line under it (owner 2026-11-20): its page and full title in the line's sheet. */
function Source({ cite, palette }: { cite: Cite; palette: Palette }) {
  const source = [orderSource(cite, num)];
  return <SourceLine named={source} sources={source} palette={palette} />;
}

const quote = (palette: Palette) => ({ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'justify' as const, writingDirection: 'rtl' as const });

function PairAyah({ ayah, palette }: { ayah: OrderAyah; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
      <Text style={{ color: palette.muted, fontSize: 13, minWidth: 64 }}>{ayah.place}</Text>
      <AyahFlow color={palette.ink} screen style={{ flex: 1 }}>
        {ayah.words.map((w, i) => <AyahWords key={i} look={w.shared ? { color: palette.accent } : undefined}>{`${w.text} `}</AyahWords>)}
      </AyahFlow>
    </View>
  );
}

export function LinkBlock({ link, palette }: { link: OrderLinkView; palette: Palette }) {
  return (
    <View accessibilityLabel="الصلة بما قبلها" style={{ marginStart: 22, borderStartWidth: 2, borderColor: palette.rule, paddingStart: 14, paddingVertical: 4, gap: 2 }}>
      <Text style={quote(palette)}>«{link.text}»</Text>
      {link.pairs.map(([a, b]) => (
        <View key={a.key + b.key}>
          <PairAyah ayah={a} palette={palette} />
          <PairAyah ayah={b} palette={palette} />
        </View>
      ))}
      <Source cite={link.src} palette={palette} />
    </View>
  );
}

export function SurahCard({ s, palette }: { s: OrderSurah; palette: Palette }) {
  return (
    <CardWithRow palette={palette} pad={[6, 14]} source={[orderSource(s.aim.src, num)]}
      lead={<IconButton Icon={BookOpen} label={`افتح سورة ${s.name} في المصحف`} onPress={() => readAyah(`${s.surah}:1`)} />}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 22, fontWeight: '700' }}>{s.name}</Text>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{num(s.surah)}</Text>
      </View>
      <AyahFlow color={palette.ink} screen>
        {s.opening.map(a => [
          <AyahWords key={a.ayah}>{`${a.text} `}</AyahWords>,
          <AyahWords key={`${a.ayah}-n`} look={{ color: palette.amber }}>{`${num(a.ayah)} `}</AyahWords>,
        ])}
      </AyahFlow>
      <Text style={[quote(palette), { marginTop: 4, marginBottom: 6 }]}>«{s.aim.text}»</Text>
    </CardWithRow>
  );
}


/**
 * A surah's card in a sheet (owner, 2026-11-21; sketch surah-order-tray/sketch-home-dark.png): what «ابحث عن الجواب» opens
 * for a box of «رتّب سور الجزء», and what a box opens once checked, so the reader learns the surah with its sources.
 */
export function SurahSheet({ surah, onClose, palette, top }: { surah: number | null; onClose: () => void; palette: Palette; top?: React.ReactNode }) {
  const s = surah === null ? undefined : orderSurahList().find(each => each.surah === surah);
  return (
    <Sheet open={!!s} onClose={onClose} palette={palette}>
      {top && <View style={{ paddingTop: 8 }}>{top}</View>}
      <View style={{ padding: 16, gap: 12 }}>
        {s && <SurahCard s={s} palette={palette} />}
        <View style={{ alignItems: 'flex-start' }}><Button label="رجوع" onPress={onClose} /></View>
      </View>
    </Sheet>
  );
}
