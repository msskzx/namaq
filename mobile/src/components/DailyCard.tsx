import { useMemo, useSyncExternalStore } from 'react';
import { Pressable, View } from 'react-native';
import { ArrowLeftRight, Bookmark, Moon, Send, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { hijriDate } from '@shared/hijri';
import { dayNumber } from '@shared/dailyPick';
import { Text } from './Text';
import { AyahText } from './CompareCard';
import { dailyPair } from '@/lib/daily';
import { savedIdsOf, sideKeys, sideLabel, toggleCardSaved } from '@/lib/compare';
import type { PairCard } from '@shared/quran/compareCards';
import { shareCard } from '@/lib/shareImage';
import { WEBSITE } from '@/lib/branches';
import { compareHref } from '@shared/quran/compare';
import { openIntent } from '@/lib/ways';
import { type Palette, CARD } from '@/lib/theme';

function Icon({ Icon, label, on, onPress, palette }: { Icon: (props: LucideProps) => React.ReactNode; label: string; on?: boolean; onPress: () => void; palette: Palette }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} accessibilityRole="button" accessibilityLabel={label} accessibilityState={on === undefined ? undefined : { selected: on }} style={{ padding: 7 }}>
      <Icon size={20} color={on ? palette.accent : palette.muted} fill={on ? palette.accent : 'none'} />
    </Pressable>
  );
}

/** The pair's two ayat, one under the other. */
function Sides({ pair, palette }: { pair: PairCard; palette: Palette }) {
  return <>{pair.sides.map((side, i) => (
    <View key={side.surah} style={{ gap: 2, paddingTop: i ? 8 : 0, borderTopWidth: i ? 1 : 0, borderStyle: 'dashed', borderColor: palette.rule }}>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{sideLabel(side)}</Text>
      <AyahText ayah={side.ayat[0]} palette={palette} />
    </View>
  ))}</>;
}

/** The homepage's top card: today's Hijri date and one look-alike pair to reflect on today. No streaks, nothing counted. */
export default function DailyCard({ palette }: { palette: Palette }) {
  const day = dayNumber(new Date());
  const pair = useMemo(() => dailyPair(), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  const date = useMemo(() => hijriDate(new Date()), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  if (!pair && !date) return null;
  const saved = !!pair && savedIdsOf(pair, bookmarks).length > 0;
  const compare = () => {
    if (!pair) return;
    const [a, b] = pair.sides;
    openIntent({ tab: 'compare', lead: a.surah, other: b.surah, ayat: [...sideKeys(a), ...sideKeys(b)] });
  };
  // Share as image: the pair alone in a card, without the date and the buttons.
  const share = () => {
    if (!pair) return;
    const [a, b] = pair.sides;
    const at = (n: number) => ({ from: n, to: n });
    shareCard({
      content: width => <View style={{ width, gap: 6, borderWidth: 1, borderColor: palette.rule, ...CARD, padding: 12, backgroundColor: palette.card }}><Sides pair={pair} palette={palette} /></View>,
      link: `${WEBSITE}${compareHref(a.surah, at(a.ayat[0].number), b.surah, at(b.ayat[0].number))}`,
    });
  };
  return (
    <View style={{ gap: 6, borderWidth: 1, borderColor: palette.rule, ...CARD, padding: 12, backgroundColor: palette.card }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 34 }}>
        {pair && <>
          <Icon Icon={ArrowLeftRight} label="افتحها في المقارنة" onPress={compare} palette={palette} />
          <Icon Icon={Bookmark} label={saved ? 'أزلها من المحفوظات' : 'احفظ'} on={saved} onPress={() => toggleCardSaved(pair)} palette={palette} />
          <Icon Icon={Send} label="مشاركة" onPress={share} palette={palette} />
        </>}
        <View style={{ flex: 1 }} />
        {date && <Moon size={18} color={palette.accent} />}
        {date && <Text accessibilityLabel={`اليوم ${date}`} style={{ color: palette.ink, fontSize: 15 }}>{date}</Text>}
      </View>
      {pair && <View style={{ gap: 6, paddingTop: 8, borderTopWidth: 1, borderColor: palette.rule }}><Sides pair={pair} palette={palette} /></View>}
    </View>
  );
}
