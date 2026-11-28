import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react-native';
import { ADHKAR_OCCASIONS, adhkarFor, type AdhkarOccasion, type Dhikr } from '@shared/adhkar';
import { ADHKAR_TITLES, adhkarSource } from '@shared/adhkarCite';
import { saidCount, saidDone, saidKey } from '@shared/adhkarCount';
import { counted, num } from '@shared/quran/arabicNumber';
import TopBar from '@/ui/TopBar';
import Pager from '@/ui/Pager';
import CountRing from '@/ui/CountRing';
import StepDots from '@/ui/StepDots';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import Chip from '@/ui/Chip';
import Folded from '@/ui/Folded';
import { SharedCard, ShareHead } from '@/ui/CardShare';
import { Text } from '@/ui/Text';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { DhikrBody, GradeLine } from '@/components/Adhkar';
import { useSaidToday } from '@/lib/adhkar';
import { buzz } from '@/lib/haptics';
import { toTab } from '@/lib/ways';
import { usePalette, type Palette } from '@/lib/theme';
import { useLater } from '@/lib/hooks/useLater';

function DhikrPage({ item, occasion, count, onTap, onReset, height, palette }: { item: Dhikr; occasion: AdhkarOccasion; count: number; onTap: () => void; onReset: () => void; height: number; palette: Palette }
) {
  const target = item.repeat?.count ?? 1;
  const done = count >= target;
  return (
    <ScrollView style={{ height }} contentContainerStyle={{ padding: 16, gap: 18, alignItems: 'stretch' }}>
      <SharedCard palette={palette} pad={18} gap={12} outline={done ? palette.green : undefined} source={[adhkarSource(item)]} shareLabel="شارك الذكر"
        shareHead={<ShareHead title={`من أذكار ${ADHKAR_TITLES[occasion]}`} palette={palette} />}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <Text style={{ flex: 1, color: palette.muted, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>«{item.occasionQuote}»</Text>
          {item.repeat && <Chip small on={false} role="text" label={counted(item.repeat.count, ['مرة', 'مرتين', 'مرات'])} palette={palette} />}
        </View>
        <DhikrBody item={item} palette={palette} />
        {item.fullReport && (
          <Folded credit="الحديث كاملًا كما رواه النووي" palette={palette}>
            <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 32, textAlign: 'justify' }}>{item.fullReport}</Text>
          </Folded>
        )}
        <GradeLine item={item} palette={palette} />
      </SharedCard>
      <View style={{ alignItems: 'center', gap: 6 }}>
        <CountRing count={count} target={target} shown={num(count)} done={done} palette={palette} onPress={onTap}
          label={item.repeat ? `عُدَّ مرة، ${num(count)} من ${num(target)}` : done ? 'قلته اليوم' : 'قلته'}
          hint={done ? 'قلته اليوم' : item.repeat ? `من ${num(target)} · اضغط` : 'اضغط إذا قلته'} />
        {count > 0 && <IconButton Icon={RotateCcw} label="من جديد" onPress={onReset} />}
      </View>
    </ScrollView>
  );
}

export default function DhikrScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const params = useLocalSearchParams<{ occasion?: string; id?: string }>();
  const occasion: AdhkarOccasion = (ADHKAR_OCCASIONS as readonly string[]).includes(params.occasion ?? '') ? params.occasion as AdhkarOccasion : 'morning';
  const items = adhkarFor(occasion);
  const [index, setIndex] = useState(() => Math.max(0, items.findIndex(item => item.id === params.id)));
  const [count, say] = useSaidToday();
  const next = useLater();
  const go = useCallback((to: number) => { next.cancel(); setIndex(Math.min(items.length - 1, Math.max(0, to))); }, [items.length, next]);
  const tap = (item: Dhikr, at: number) => {
    const id = saidKey(occasion, item.id);
    if (saidDone(count, id)) return;
    buzz();
    const target = item.repeat?.count ?? 1;
    say(id, target);
    if (saidCount(count, id) + 1 >= target && at + 1 < items.length) next.after(600, () => setIndex(at + 1));
  };
  const back = () => (router.canGoBack() ? router.back() : toTab('/utilities'));
  const said = items.filter(item => saidDone(count, saidKey(occasion, item.id))).length;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title={`أذكار ${ADHKAR_TITLES[occasion]}`} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 6 }}>
        <StepDots names={items.map(item => item.id)} at={index} done={items.map(item => saidDone(count, saidKey(occasion, item.id)))} palette={palette}
          label={`الذكر ${num(index + 1)} من ${num(items.length)}، قلت ${num(said)}`} />
        <Text style={{ color: palette.muted, fontSize: 13 }}>{num(index + 1)} من {num(items.length)}</Text>
      </View>
      <Pager data={items} index={index} onIndex={go} keyOf={item => item.id}
        renderPage={(item, size) => {
          const at = items.indexOf(item);
          const id = saidKey(occasion, item.id);
          return <DhikrPage item={item} occasion={occasion} count={saidCount(count, id)} height={size.height} palette={palette}
            onTap={() => tap(item, at)} onReset={() => say(id, null)} />;
        }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 6, paddingBottom: bottom }}>
        <Button variant="plain" Icon={ChevronRight} label="السابق" disabled={index === 0} onPress={() => go(index - 1)} />
        <Text style={{ color: palette.muted, fontSize: 13 }}>اسحب للتالي</Text>
        <Button variant="plain" Icon={ChevronLeft} label="التالي" disabled={index === items.length - 1} onPress={() => go(index + 1)} />
      </View>
    </View>
  );
}
