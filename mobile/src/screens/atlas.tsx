import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { atlasPins, battlesAt, layerBattles, layerBox, layerOf, LAYERS, lifeYears, searchAtlas, type AtlasLayer } from '@shared/battles/atlas';
import { battleTimeline, UNDATED_TITLE } from '@shared/battles/timeline';
import { placeRefs, type AppBattle } from '@shared/battles/battle';
import { atlasSources } from '@shared/drawingCards';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Sheet from '@/ui/Sheet';
import TapRow from '@/ui/TapRow';
import OpenButton from '@/ui/OpenButton';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { back } from '@/lib/ways';
import { BATTLES } from '@/lib/battles';
import BattleMap from '@/components/battles/BattleMap';
import { BattleYears } from '@/components/battles/BattleTimeline';
import { battleLine, Refs } from '@/components/battles/BattleParts';

const openBattle = (slug: string) => router.push({ pathname: '/battle', params: { slug } });

/** A battle in the atlas's lists: its name and «غزوة · السنة ٥ للهجرة», opening its page; «لا موضع» where no book pins it. */
function BattleRow({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  return (
    <TapRow role="link" label={`افتح ${battle.name}`} onPress={() => openBattle(battle.slug)}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <View style={{ flexShrink: 1 }}>
        <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>{battle.name}</Text>
        {battleLine(battle) ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{battleLine(battle)}</Text> : null}
      </View>
      {!battle.place && <Text style={{ color: palette.muted, fontSize: 13 }}>لا موضع</Text>}
    </TapRow>
  );
}

/**
 * A pin's sheet: the place, in its books' words with their pages and the GeoNames record of its coordinates, then each
 * battle there with its open button (owner, 2026-11-23: every pin carries its reference).
 */
function PlaceSheet({ battles, onClose, palette }: { battles: AppBattle[]; onClose: () => void; palette: Palette }) {
  const place = battles[0]?.place;
  return (
    <Sheet open={!!place} onClose={onClose} palette={palette}>
      {place ? (
        <View style={{ gap: 12, paddingHorizontal: 16, paddingBottom: 24 }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22, textAlign: 'right' }}>{place.name}</Text>
          {placeRefs(battles[0]).map(refs => <Refs key={refs[0]?.cite} refs={refs} palette={palette} />)}
          {battles.map(battle => (
            <View key={battle.slug} style={{ gap: 6 }}>
              <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>{battle.name}</Text>
              {battleLine(battle) ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{battleLine(battle)}</Text> : null}
              <View style={{ alignItems: 'flex-start' }}>
                <OpenButton label={`افتح ${battle.name}`} onPress={() => { onClose(); openBattle(battle.slug); }} palette={palette} />
              </View>
            </View>
          ))}
        </View>
      ) : <View />}
    </Sheet>
  );
}

/**
 * «الأطلس» (owner, 2026-11-23; sketch /mnt/project-files/atlas/sketch2-dark.png): the battles we have on one still map,
 * in two layers. «في حياته ﷺ»: a year at a time on the battles' own year axis, the year's places lit and the earlier
 * ones quiet, its battles listed under the map. «بعده ﷺ»: every later battle with a sourced place, no year axis since
 * most have no cited year; the dated ones listed first, the rest under «لم يذكر المصدر سنتها». A pin opens its sheet. The
 * search in the top bar finds a battle by its name or place on either layer. Opened with `layer`, `year` or `place`
 * (a quiz's answer, the feed's year card), it shows that.
 */
export default function AtlasScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('atlas', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const params = useLocalSearchParams<{ layer?: string; year?: string; place?: string }>();
  const years = useMemo(() => lifeYears(BATTLES), []);
  const [layer, setLayer] = useState<AtlasLayer>('life');
  const [year, setYear] = useState(years[0]);
  const [query, setQuery] = useState('');
  const [sheet, setSheet] = useState<AppBattle[]>([]);
  // The feed's year card or a quiz's answer opens the atlas on its year or place; a later one comes as new params.
  useEffect(() => {
    const at = params.place ? BATTLES.find(battle => battle.place?.name === params.place) : undefined;
    const toLayer = at ? layerOf(at) : params.layer === 'after' ? 'after' : params.year ? 'life' : undefined;
    if (toLayer) setLayer(toLayer);
    const toYear = at && toLayer === 'life' ? at.year!.value : params.year ? Number(params.year) : undefined;
    if (toYear && years.includes(toYear)) setYear(toYear);
    if (at) setSheet(battlesAt(BATTLES, layerOf(at), [at.place!.name], toYear));
  }, [params.layer, params.year, params.place]);
  const box = useMemo(() => layerBox(BATTLES, layer), [layer]);
  const pins = useMemo(() => atlasPins(BATTLES, layer, year), [layer, year]);
  const madinah = useMemo(() => battleTimeline(layerBattles(BATTLES, 'life')).madinah, []);
  const found = useMemo(() => searchAtlas(BATTLES, query), [query]);
  const battles = layer === 'life' ? BATTLES.filter(battle => layerOf(battle) === 'life' && battle.year!.value === year) : layerBattles(BATTLES, 'after');
  const dated = battles.filter(battle => battle.year);
  const undated = battles.filter(battle => !battle.year);
  const sources = sourcesOf(atlasSources(BATTLES, layer, year));
  const showPlace = (names: string[]) => setSheet(battlesAt(BATTLES, layer, names, year));
  // A battle found by the search: its layer and year on the map, and its place's sheet, or its page where no book pins it.
  const pickFound = (battle: AppBattle) => {
    setQuery('');
    if (!battle.place) return openBattle(battle.slug);
    const to = layerOf(battle);
    setLayer(to);
    if (to === 'life') setYear(battle.year!.value);
    setSheet(battlesAt(BATTLES, to, [battle.place.name], battle.year?.value));
  };
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title="الأطلس" hideOnScroll
        search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث باسم غزوة أو موضع', label: 'ابحث في الأطلس' }} />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        {query.trim() ? (
          found.length
            ? found.map(battle => (
              <Card key={battle.slug} palette={palette} pad={[10, 14]} gap={2} accessibilityRole="button" accessibilityLabel={battle.name} onPress={() => pickFound(battle)}>
                <Text style={{ color: palette.ink, fontSize: 19, textAlign: 'right' }}>{battle.name}</Text>
                <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>
                  {[battleLine(battle), battle.place ? battle.place.name : 'لا موضع'].filter(Boolean).join(' · ')}
                </Text>
              </Card>
            ))
            : <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right' }}>لا غزوة ولا موضع بهذا الاسم.</Text>
        ) : <>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {LAYERS.map(each => <Chip key={each.key} label={each.name} on={layer === each.key} onPress={() => setLayer(each.key)} palette={palette} />)}
          </View>
          <Card palette={palette} pad={0} clip gap={0}>
            <BattleMap places={pins} box={box} palette={palette} onPin={showPlace} />
          </Card>
          {layer === 'life' && <BattleYears columns={madinah} lit={year} width={madinah.length * 44} palette={palette} onYear={setYear} />}
          <View style={{ gap: 2 }}>
            {layer === 'life' && <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{`السنة ${num(year)} للهجرة`}</Text>}
            {dated.map(battle => <BattleRow key={battle.slug} battle={battle} palette={palette} />)}
            {undated.length > 0 && <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 14, textAlign: 'right', paddingTop: 10 }}>{UNDATED_TITLE}</Text>}
            {undated.map(battle => <BattleRow key={battle.slug} battle={battle} palette={palette} />)}
          </View>
          <SourceLine sources={sources} palette={palette} />
        </>}
      </ScrollView>
      <PlaceSheet battles={sheet} onClose={() => setSheet([])} palette={palette} />
    </View>
  );
}
