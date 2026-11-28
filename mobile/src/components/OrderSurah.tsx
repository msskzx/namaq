import { Fragment } from 'react';
import { View, type TextStyle } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { orderSource, orderSurahs, type Cite, type OrderAyah, type OrderLinkView, type OrderSurah, type QuoteRun } from '@shared/quran/surahOrder';
import { Text } from '@/ui/Text';
import SourceLine from '@/ui/SourceLine';
import Sheet from '@/ui/Sheet';
import Button from '@/ui/Button';
import { readAyah } from '@/lib/openReader';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from '@/components/quran/text/AyahFlow';
import QuranWords from '@/components/quran/text/QuranWords';
import { ayahMushafWords } from '@/lib/mushaf';
import IconButton from '@/ui/IconButton';
import { CardWithRow } from '@/ui/Card';
import { FEATURE_ICON } from '@/components/featureIcons';

let surahs: OrderSurah[] | null = null;
export const orderSurahList = () => (surahs ??= orderSurahs(ayahMushafWords, num));

function Source({ cite, palette }: { cite: Cite; palette: Palette }) {
  const source = [orderSource(cite, num)];
  return <SourceLine named={source} sources={source} palette={palette} />;
}

const quote = (palette: Palette) => ({ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'justify' as const, writingDirection: 'rtl' as const });

function BookWords({ runs, palette, style }: { runs: QuoteRun[]; palette: Palette; style?: TextStyle }) {
  return (
    <Text style={[quote(palette), style]}>
      «{runs.map((run, i) => ('quran' in run
        ? <QuranWords key={i}>{'﴿'}{run.quran.map(a => (
          <Fragment key={a.key}>{a.words.join(' ')}{a.end && <Text style={{ color: palette.amber }}>{` ${num(Number(a.key.split(':')[1]))} `}</Text>}</Fragment>))}{'﴾'}</QuranWords>
        : run.text))}»
    </Text>
  );
}

function PairAyah({ ayah, palette }: { ayah: OrderAyah; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
      <Text style={{ color: palette.muted, fontSize: 13, minWidth: 64 }}>{ayah.place}</Text>
      <AyahFlow color={palette.ink} screen menu={ayah.key} style={{ flex: 1 }}>
        {ayah.words.map((w, i) => <AyahWords key={i} look={w.shared ? { color: palette.accent } : undefined}>{`${w.text} `}</AyahWords>)}
      </AyahFlow>
    </View>
  );
}

export function LinkWords({ link, palette, barred = false }: { link: OrderLinkView; palette: Palette;
  barred?: boolean }) {
  return (
    <View style={{ gap: 2 }}>
      <BookWords runs={link.runs} palette={palette} />
      {link.pairs.map(([a, b]) => (
        <View key={a.key + b.key} style={barred ? { borderStartWidth: 2, borderColor: palette.rule, paddingStart: 10, marginTop: 6 } : undefined}>
          <PairAyah ayah={a} palette={palette} />
          <PairAyah ayah={b} palette={palette} />
        </View>
      ))}
    </View>
  );
}

export function LinkBlock({ link, palette }: { link: OrderLinkView; palette: Palette }) {
  return (
    <View accessibilityLabel="الصلة بما قبلها" style={{ marginStart: 22, borderStartWidth: 2, borderColor: palette.rule, paddingStart: 14, paddingVertical: 4, gap: 2 }}>
      <LinkWords link={link} palette={palette} />
      <Source cite={link.src} palette={palette} />
    </View>
  );
}

export function SurahBody({ s, palette }: { s: OrderSurah; palette: Palette }) {
  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 22, fontWeight: '700' }}>{s.name}</Text>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{num(s.surah)}</Text>
      </View>
      <AyahFlow color={palette.ink} screen menu={s.opening.map(a => `${s.surah}:${a.ayah}`)}>
        {s.opening.map(a => [
          <AyahWords key={a.ayah}>{`${a.text} `}</AyahWords>,
          <AyahWords key={`${a.ayah}-n`} look={{ color: palette.amber }}>{`${num(a.ayah)} `}</AyahWords>,
        ])}
      </AyahFlow>
      <BookWords runs={s.aim.runs} palette={palette} style={{ marginTop: 4, marginBottom: 6 }} />
    </>
  );
}

export function SurahCard({ s, palette }: { s: OrderSurah; palette: Palette }) {
  return (
    <CardWithRow palette={palette} pad={[6, 14]} source={[orderSource(s.aim.src, num)]}
      lead={<IconButton Icon={FEATURE_ICON.mushaf} label={`افتح سورة ${s.name} في المصحف`} onPress={() => readAyah(`${s.surah}:1`)} />}>
      <SurahBody s={s} palette={palette} />
    </CardWithRow>
  );
}

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
