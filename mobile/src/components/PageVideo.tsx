import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import { Check, CheckCheck, Send } from 'lucide-react-native';
import type { PairCard } from '@shared/quran/compareCards';
import { num } from '@shared/quran/arabicNumber';
import { readPlan, stepTime } from '@shared/quran/readPlan';
import { clock, partLengths, stepEnds } from '@shared/video/pageVideo';
import { sideLabel } from '@/lib/compare';
import { pageVideoPages } from '@/lib/compareVideo';
import type { Palette } from '@/lib/theme';
import Sheet from './Sheet';
import { IconButton } from './Studio';
import VideoSheet from './VideoSheet';
import { nextSpeed, useReadSpeed } from './useReadAlong';

/**
 * Share a pair page as video: every card is ticked at first; untick the ones to leave out.
 * A video over about 3 minutes is split into parts (shared/video/pageVideo.ts), recorded one after another.
 */
export default function PageVideo({ lead, other, cards, open, onClose, palette }: { lead: number; other: number; cards: PairCard[]; open: boolean; onClose: () => void; palette: Palette }) {
  const speed = useReadSpeed();
  const [off, setOff] = useState<string[]>([]);
  // Planned only while the list is open: every pair page has this sheet.
  const plans = useMemo(() => (open ? cards.map(card => ({ card, plan: readPlan(card) })) : []), [open, cards]);
  const picked = plans.filter(({ card }) => !off.includes(card.id));
  const lengths = partLengths(picked.map(({ plan }) => stepEnds(plan.map(step => stepTime(step, speed)))));
  const [pages, setPages] = useState<((font: string) => string)[] | null>(null);
  const [part, setPart] = useState(0);
  const all = off.length === 0;
  const toggle = (id: string) => setOff(list => (list.includes(id) ? list.filter(other => other !== id) : [...list, id]));
  // The list's sheet slides away first: a second modal can't open while the first is still closing on iOS.
  const record = () => { const next = pageVideoPages(lead, other, picked, speed, palette); onClose(); setTimeout(() => { setPart(0); setPages(next); }, 500); };
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const summary = !lengths.length ? '' : lengths.length > 1 ? `الأجزاء ${num(lengths.length)} · ${clock(total)}` : clock(total);
  return (
    <>
      <Sheet open={open} onClose={onClose} palette={palette}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 4 }}>
          <Text style={{ flex: 1, color: palette.ink, fontSize: 16, fontWeight: '600' }}>مشاركة الصفحة كفيديو</Text>
          <Pressable onPress={nextSpeed} accessibilityRole="button" accessibilityLabel={`السرعة ${speed}×`} style={{ minWidth: 44, padding: 8, alignItems: 'center' }}>
            <Text style={{ color: palette.muted, fontSize: 15 }}>{speed}×</Text>
          </Pressable>
          <IconButton label={all ? 'إلغاء تحديد الكل' : 'تحديد الكل'} onPress={() => setOff(all ? cards.map(card => card.id) : [])} Icon={CheckCheck} color={all ? palette.accent : palette.ink} pressed={all} />
        </View>
        <FlatList data={plans} keyExtractor={({ card }) => card.id} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 4 }}
          renderItem={({ item: { card }, index }) => {
            const on = !off.includes(card.id);
            const label = `${sideLabel(card.sides[0])} · ${sideLabel(card.sides[1])}`;
            return (
              <Pressable onPress={() => toggle(card.id)} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={label}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, borderBottomWidth: 1, borderColor: palette.rule }}>
                <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: on ? palette.accent : palette.rule, backgroundColor: on ? palette.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <Check size={16} color={palette.onAccent} />}
                </View>
                <Text style={{ color: palette.muted, fontSize: 13, minWidth: 22 }}>{num(index + 1)}</Text>
                <Text numberOfLines={1} style={{ flex: 1, color: on ? palette.ink : palette.muted, fontSize: 15 }}>{label}</Text>
              </Pressable>
            );
          }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingTop: 8 }}>
          <Text style={{ flex: 1, color: palette.muted, fontSize: 14 }}>{summary}</Text>
          <Pressable onPress={record} disabled={!picked.length} accessibilityRole="button" accessibilityLabel="مشاركة كفيديو"
            style={{ width: 56, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: picked.length ? palette.accent : palette.rule }}>
            <Send size={24} color={palette.onAccent} />
          </Pressable>
        </View>
      </Sheet>
      <VideoSheet page={pages?.[part] ?? null} onClose={() => setPages(null)} palette={palette}
        part={pages && pages.length > 1 ? `الجزء ${num(part + 1)} من ${num(pages.length)}` : undefined}
        onNext={pages && part < pages.length - 1 ? () => setPart(part + 1) : undefined} />
    </>
  );
}
