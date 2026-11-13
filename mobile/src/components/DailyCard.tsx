import { useMemo, useSyncExternalStore } from 'react';
import { Pressable, View } from 'react-native';
import { ArrowLeftRight, Bookmark, BookOpen, Moon, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { hijriDate, todaysJuz } from '@shared/hijri';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import { dayNumber } from '@shared/dailyPick';
import { Text } from './Text';
import { AyahText } from './CompareCard';
import { dailyPair } from '@/lib/daily';
import { savedIdsOf, sideKeys, sideLabel, toggleCardSaved } from '@/lib/compare';
import { openIntent } from '@/lib/ways';
import { type Palette, CARD } from '@/lib/theme';

function Icon({ Icon, label, on, onPress, palette }: { Icon: (props: LucideProps) => React.ReactNode; label: string; on?: boolean; onPress: () => void; palette: Palette }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} accessibilityRole="button" accessibilityLabel={label} accessibilityState={on === undefined ? undefined : { selected: on }} style={{ padding: 7 }}>
      <Icon size={20} color={on ? palette.accent : palette.muted} fill={on ? palette.accent : 'none'} />
    </Pressable>
  );
}

/** «الجزء ٣», or «الجزءان ٢٩ و٣٠» on the last day of a 29-day month. */
const juzLabel = (juz: number[]) => juz.length > 1 ? `الجزءان ${num(juz[0])} و${num(juz[1])}` : `الجزء ${num(juz[0])}`;

/** The homepage's top card: today's Hijri date, today's juz (one juz a Hijri day) and one look-alike pair to reflect on today. No streaks, nothing counted. */
export default function DailyCard({ palette }: { palette: Palette }) {
  const day = dayNumber(new Date());
  const pair = useMemo(() => dailyPair(), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  const date = useMemo(() => hijriDate(new Date()), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  const juz = useMemo(() => todaysJuz(new Date()), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  if (!pair && !date) return null;
  const saved = !!pair && savedIdsOf(pair, bookmarks).length > 0;
  const compare = () => {
    if (!pair) return;
    const [a, b] = pair.sides;
    openIntent({ tab: 'compare', lead: a.surah, other: b.surah, ayat: [...sideKeys(a), ...sideKeys(b)] });
  };
  return (
    <View style={{ gap: 6, borderWidth: 1, borderColor: palette.rule, ...CARD, padding: 12, backgroundColor: palette.card }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 34 }}>
        {pair && <>
          <Icon Icon={ArrowLeftRight} label="افتحها في المقارنة" onPress={compare} palette={palette} />
          <Icon Icon={Bookmark} label={saved ? 'أزلها من المحفوظات' : 'احفظ'} on={saved} onPress={() => toggleCardSaved(pair)} palette={palette} />
        </>}
        <View style={{ flex: 1 }} />
        {date && <View style={{ alignItems: 'flex-start', gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Moon size={18} color={palette.accent} />
            <Text accessibilityLabel={`اليوم ${date}`} style={{ color: palette.ink, fontSize: 15 }}>{date}</Text>
          </View>
          {juz && <Pressable onPress={() => { const start = JUZ_INDEX[juz[0] - 1]; openIntent({ tab: 'read', at: `${start.surah}:${start.ayah}` }); }} hitSlop={6}
            accessibilityRole="button" accessibilityLabel={`اقرأ ${juzLabel(juz)}، جزء اليوم`} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 }}>
            <BookOpen size={18} color={palette.accent} />
            <Text style={{ color: palette.accent, fontSize: 15 }}>{juzLabel(juz)}</Text>
          </Pressable>}
        </View>}
      </View>
      {pair?.sides.map((side, i) => (
        <View key={side.surah} style={{ gap: 2, paddingTop: 8, borderTopWidth: 1, borderStyle: i ? 'dashed' : 'solid', borderColor: palette.rule }}>
          <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{sideLabel(side)}</Text>
          <AyahText ayah={side.ayat[0]} palette={palette} />
        </View>
      ))}
    </View>
  );
}
