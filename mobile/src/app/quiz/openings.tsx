import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { router } from 'expo-router';
import { Play } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { JUZ_STARTS, type JuzRange } from '@shared/quran/juz';
import { openingKeys } from '@shared/quran/openings';
import BackBar from '@/components/BackBar';
import Button from '@/components/Button';
import NumberPicker, { NumberList } from '@/components/NumberPicker';
import { Section } from '@/components/QuizForm';
import { surahNames } from '@/lib/branches';
import { setIntent } from '@/lib/intent';
import { readJson, writeJson } from '@/lib/storage';
import { usePalette } from '@/lib/theme';

/** The last juz range chosen, kept for next time. */
const RANGE = 'openings-range';
const juzName = (n: number) => { const [surah, ayah] = JUZ_STARTS[n - 1].split(':').map(Number); return `${surahNames[surah]} ${num(ayah)}`; };

/** The surah openings quiz setup: which juz; the quiz itself runs in the mushaf, in write mode. */
export default function OpeningsSetup() {
  const palette = usePalette();
  const [range, setRange] = useState<JuzRange>(() => {
    const kept = readJson<JuzRange>(RANGE);
    return kept && kept.from >= 1 && kept.to <= 30 && kept.from <= kept.to ? kept : { from: 1, to: 30 };
  });
  const [open, setOpen] = useState<'from' | 'to' | null>(null);
  const change = (next: JuzRange) => { setRange(next); writeJson(RANGE, next); };
  const pickFrom = (n: number) => change({ from: n, to: Math.max(n, range.to) });
  const pickTo = (n: number) => change({ from: Math.min(n, range.from), to: n });
  const whole = range.from === 1 && range.to === 30;
  const count = openingKeys(whole ? null : range).length;
  const start = () => {
    setIntent({ tab: 'read', openings: { range: whole ? null : range } });
    router.navigate('/read');
  };
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <BackBar title="أوائل السور" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Section title="الأجزاء" palette={palette}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <NumberPicker value={range.from} max={30} label="من" nameOf={juzName} palette={palette} onChange={pickFrom} open={open === 'from'} onOpen={shown => setOpen(shown ? 'from' : null)} />
            <Text style={{ color: palette.muted, lineHeight: 44 }}>إلى</Text>
            <NumberPicker value={range.to} max={30} label="إلى" nameOf={juzName} palette={palette} onChange={pickTo} open={open === 'to'} onOpen={shown => setOpen(shown ? 'to' : null)} />
          </View>
          {open && <NumberList key={open} value={open === 'from' ? range.from : range.to} max={30} nameOf={juzName} palette={palette} shown={8}
            onPick={n => { (open === 'from' ? pickFrom : pickTo)(n); setOpen(null); }} />}
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>
            {count ? `${num(count)} ${count > 10 ? 'سورة' : count > 2 ? 'سور' : count === 2 ? 'سورتان' : 'سورة واحدة'} تبدأ فيها` : 'لا تبدأ سورة في هذه الأجزاء.'}
          </Text>
        </Section>
        <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>يفتح المصحف عند أول سورة منها، ترى اسمها وتكتب أول آية فيها، ثم التالية.</Text>
        {count > 0 && <View style={{ alignItems: 'flex-start' }}><Button big variant="primary" Icon={Play} label="ابدأ" onPress={start} /></View>}
      </ScrollView>
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
