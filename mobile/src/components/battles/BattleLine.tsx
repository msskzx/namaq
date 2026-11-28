import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { router } from 'expo-router';
import { courseLine, type AppBattle } from '@shared/battles/battle';
import { dotKind, MADINAH_YEARS, type TimelineGroup } from '@shared/battles/timeline';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Chip from '@/ui/Chip';
import TapRow from '@/ui/TapRow';
import SplitBar from '@/ui/SplitBar';
import type { Palette } from '@/lib/theme';
import { DotShape } from './BattleTimeline';

const RAIL = 36;
const DOT = 12;
const BIG_DOT = 22;

const placeOf = (battle: AppBattle) => {
  const place = battle.place?.name;
  return place && !battle.name.includes(place) ? place : undefined;
};

const isBig = (battle: AppBattle) => !!(battle.moments.length || (battle.counts.muslims && battle.counts.others));

function Station({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  const big = isBig(battle);
  const size = big ? BIG_DOT : DOT;
  const { muslims, others } = battle.counts;
  return (
    <TapRow role="link" label={battle.name} onPress={() => router.push({ pathname: '/battle', params: { slug: battle.slug } })} style={{ gap: 10, paddingVertical: 5 }}>
      <View style={{ width: RAIL, alignItems: 'center', paddingTop: big ? 6 : 10 }}>
        <Svg width={size + 8} height={size + 8}>
          <Circle cx={size / 2 + 4} cy={size / 2 + 4} r={size / 2 + 4} fill={palette.paper} />
          <DotShape kind={dotKind(battle.kind?.value)} palette={palette} cx={size / 2 + 4} cy={size / 2 + 4} size={size} />
        </Svg>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: palette.ink, fontSize: big ? 22 : 19, textAlign: 'right' }}>{battle.name}</Text>
        <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{[battle.kind?.value, placeOf(battle)].filter(Boolean).join(' · ')}</Text>
        {muslims && others ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}
            accessibilityLabel={`المسلمون ${num(muslims.value)}، ${battle.kind?.value === 'معركة' ? 'العدو' : 'المشركون'} ${num(others.value)}`}>
            <Text style={{ color: palette.ink, fontSize: 15 }}>{num(muslims.value)}</Text>
            <SplitBar first={muslims.value} second={others.value} palette={palette} />
            <Text style={{ color: palette.muted, fontSize: 15 }}>{num(others.value)}</Text>
          </View>
        ) : null}
        {battle.moments.length ? <Text style={{ color: palette.amber, fontSize: 14, textAlign: 'right' }}>{courseLine(battle)}</Text> : null}
      </View>
    </TapRow>
  );
}

export default function BattleLine({ groups, palette, onGroup }: {
  groups: TimelineGroup<AppBattle>[]; palette: Palette; onGroup?: (year: number, y: number) => void;
}) {
  return (
    <View>
      {groups.map(group => {
        const rail = group.year !== undefined && group.year <= MADINAH_YEARS ? palette.accent : palette.rule;
        return (
          <View key={group.title} onLayout={group.year === undefined || !onGroup ? undefined : event => onGroup(group.year!, event.nativeEvent.layout.y)}>
            <View style={{ position: 'absolute', right: RAIL / 2 - 2, top: 0, bottom: 0, width: 4, backgroundColor: rail }} />
            <View style={{ alignItems: 'flex-start', paddingTop: 14, paddingBottom: 6 }}>
              <Chip label={group.title} on lit tint={rail} role="text" small palette={palette} />
            </View>
            {group.battles.map(battle => <Station key={battle.slug} battle={battle} palette={palette} />)}
          </View>
        );
      })}
    </View>
  );
}
