import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { atlasPins, battlesAt, layerBattles, layerOf, LAYERS, lifeYears, screenBox, type AtlasLayer } from '@shared/battles/atlas';
import { battleTimeline, UNDATED_TITLE } from '@shared/battles/timeline';
import { placeRefs, searchBattles, type AppBattle } from '@shared/battles/battle';
import { placeSayer } from '@shared/battles/places';
import { atlasSources } from '@shared/drawingCards';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar, { TOP_BAR } from '@/ui/TopBar';
import Empty from '@/ui/Empty';
import Tabs from '@/ui/Tabs';
import Sheet from '@/ui/Sheet';
import TapRow from '@/ui/TapRow';
import OpenButton from '@/ui/OpenButton';
import QuoteBar from '@/ui/QuoteBar';
import DrawerSheet from '@/ui/DrawerSheet';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { usePalette, type Palette } from '@/lib/theme';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { back } from '@/lib/ways';
import { BATTLES } from '@/lib/battles';
import BattleMap from '@/components/battles/BattleMap';
import { BattleYears } from '@/components/battles/BattleTimeline';
import { battleLine, Refs } from '@/components/battles/BattleParts';

const openBattle = (slug: string) => router.push({ pathname: '/battle', params: { slug } });

/** A battle in the atlas's lists: its name and «غزوة · السنة ٥ للهجرة», opening its page (or `onPress`: a search result shows it on the map); «لا موضع» where no book pins it. */
function BattleRow({ battle, onPress, palette }: { battle: AppBattle; onPress?: () => void; palette: Palette }) {
  return (
    <TapRow role={onPress ? 'button' : 'link'} label={onPress ? battle.name : `افتح ${battle.name}`} onPress={onPress ?? (() => openBattle(battle.slug))}
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
 * A battle in the atlas's sheet as a passage (owner, 2026-11-23; sketch tools-design/atlas sketch-v2, list ب): a bar down
 * its right, its kind, its name, its place in its book's words with who says them and the page, and the way to its page.
 */
function AtlasBattle({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  const said = battle.place?.refs.find(ref => ref.text && placeSayer(ref.cite));
  return (
    <View style={{ borderRightWidth: 2, borderColor: battle.place ? palette.accent : palette.rule, paddingRight: 12, gap: 4 }}>
      {battle.kind ? <Text style={{ color: palette.accent, fontSize: 13, textAlign: 'right' }}>{battle.kind.value}</Text> : null}
      <Text style={{ color: palette.ink, fontSize: 21, textAlign: 'right' }}>{battle.name}</Text>
      {said ? <QuoteBar by={placeSayer(said.cite)} pieces={[{ text: said.text, name: false }]} tone={palette.rule} size={16} palette={palette} /> : null}
      {!battle.place && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>لم يعيّن كتاب موضعها، فلا دبوس لها</Text>}
      {placeRefs(battle).map(refs => <Refs key={refs[0]?.cite} refs={refs} palette={palette} />)}
      <View style={{ alignItems: 'flex-start' }}>
        <OpenButton label={`افتح ${battle.name}`} onPress={() => openBattle(battle.slug)} palette={palette} />
      </View>
    </View>
  );
}

/**
 * A pin's sheet: the place, in its books' words with their pages and the GeoNames record of its coordinates, then each
 * battle there with its open button (owner, 2026-11-23: every pin carries its reference).
 */
function PlaceSheet({ battles, onClose, palette }: { battles: AppBattle[]; onClose: () => void; palette: Palette }) {
  // A pin may hold several places (Makkah and al-Hudaybiyah): each with its own books.
  const places = [...new Map(battles.map(battle => [battle.place!.name, battle] as const)).values()];
  return (
    <Sheet open={battles.length > 0} onClose={onClose} palette={palette}>
      {battles.length ? (
        <View style={{ gap: 12, paddingHorizontal: 16, paddingBottom: 24 }}>
          {places.map(first => (
            <View key={first.place!.name} style={{ gap: 6 }}>
              <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22, textAlign: 'right' }}>{first.place!.name}</Text>
              {placeRefs(first).map(refs => <Refs key={refs[0]?.cite} refs={refs} palette={palette} />)}
            </View>
          ))}
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
 * «الأطلس» (owner, 2026-11-23; sketch /mnt/project-files/atlas/sketch2-dark.png, laid out anew from sketch
 * tools-design/atlas sketch-v2: the map fills the screen, the year and its battles in a sheet over its foot): the battles we have on one still map,
 * in two layers. «في حياته ﷺ»: a year at a time on the battles' own year axis, the year's places lit and the earlier
 * ones quiet, its battles listed in the sheet. «بعده ﷺ»: every later battle with a sourced place, no year axis since
 * most have no cited year; the dated ones listed first, the rest under «لم يذكر المصدر سنتها». A pin opens its sheet. The
 * search in the top bar finds a battle by its name or place on either layer. Opened with `layer`, `year` or `place`
 * (a quiz's answer, the feed's year card), it shows that.
 */
export default function AtlasScreen() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const bottom = useTabBarSpace();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [lower, setLower] = useState(0);
  useTabRetap('atlas', () => setLower(n => n + 1));
  const params = useLocalSearchParams<{ layer?: string; year?: string; place?: string; at?: string }>();
  const years = useMemo(() => lifeYears(BATTLES), []);
  const [layer, setLayer] = useState<AtlasLayer>('life');
  const [year, setYear] = useState(years[0]);
  const [query, setQuery] = useState('');
  const [sheet, setSheet] = useState<AppBattle[]>([]);
  // The feed's year card or a quiz's answer opens the atlas on its year or place; each opening carries its own `at`, so the
  // same year opened again still comes back to it after the reader moved on.
  useEffect(() => {
    setQuery('');
    const at = params.place ? BATTLES.find(battle => battle.place?.name === params.place) : undefined;
    const toLayer = at ? layerOf(at) : params.layer === 'after' ? 'after' : params.year ? 'life' : undefined;
    if (toLayer) setLayer(toLayer);
    const toYear = at && toLayer === 'life' ? at.year!.value : params.year ? Number(params.year) : undefined;
    if (toYear && years.includes(toYear)) setYear(toYear);
    if (at) setSheet(battlesAt(BATTLES, layerOf(at), [at.place!.name], toYear));
  }, [params.layer, params.year, params.place, params.at]);
  // The bars over the map's top (the search, then the layers), and where the sheet rests: the map is open between them.
  const barsEnd = insets.top + TOP_BAR + 56;
  const low = Math.round(size.height * 0.56);
  const box = useMemo(() => (size.width ? screenBox(BATTLES, layer, { width: size.width, height: size.height, top: barsEnd, bottom: low - 12 }) : undefined),
    [layer, size.width, size.height, barsEnd, low]);
  const pins = useMemo(() => atlasPins(BATTLES, layer, year), [layer, year]);
  const madinah = useMemo(() => battleTimeline(layerBattles(BATTLES, 'life')).madinah, []);
  const found = useMemo(() => searchBattles(BATTLES, query), [query]);
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
    <View style={{ flex: 1, backgroundColor: palette.paper }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
      {/* The map fills the screen (owner, 2026-11-23: as a maps app), the year's places in the open band above the sheet. */}
      {box && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <BattleMap places={pins} box={box} palette={palette} onPin={showPlace} />
      </View>}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <TopBar back={back} search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الأطلس', label: 'ابحث في الأطلس' }} />
        <View style={{ paddingHorizontal: 16, paddingTop: 4 }}>
          <Tabs label="الطبقة" options={LAYERS.map(each => ({ key: each.key, label: each.name }))} value={layer} onChange={setLayer} palette={palette} fill />
        </View>
      </View>
      {size.height > 0 && (
        <DrawerSheet low={low} high={barsEnd} bottom={bottom} lower={lower} palette={palette}>
          {query.trim() ? (
            found.length
              ? <View>{found.map(battle => <BattleRow key={battle.slug} battle={battle} onPress={() => pickFound(battle)} palette={palette} />)}</View>
              : <Empty text="لا غزوة ولا موضع بهذا الاسم" palette={palette} />
          ) : <>
            {layer === 'life' && <>
              <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>{`السنة ${num(year)}`}<Text style={{ color: palette.muted, fontSize: 15 }}> للهجرة</Text></Text>
              <BattleYears columns={madinah} lit={year} width={Math.max(madinah.length * 44, size.width - 32)} palette={palette} onYear={setYear} />
            </>}
            {dated.map(battle => <AtlasBattle key={battle.slug} battle={battle} palette={palette} />)}
            {undated.length > 0 && <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 14, textAlign: 'right', paddingTop: 10 }}>{UNDATED_TITLE}</Text>}
            {undated.map(battle => <AtlasBattle key={battle.slug} battle={battle} palette={palette} />)}
            <SourceLine sources={sources} palette={palette} />
          </>}
        </DrawerSheet>
      )}
      <PlaceSheet battles={sheet} onClose={() => setSheet([])} palette={palette} />
    </View>
  );
}
