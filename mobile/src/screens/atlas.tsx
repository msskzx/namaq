import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { atlasPins, battlesAt, layerBattles, layerOf, LAYERS, lifeYears, screenBox, type AtlasLayer } from '@shared/battles/atlas';
import { battleTimeline, UNDATED_TITLE } from '@shared/battles/timeline';
import { placeRefs, searchBattles, type AppBattle } from '@shared/battles/battle';
import { placeSayer } from '@shared/battles/places';
import { atlasSources } from '@shared/drawingCards';
import { num } from '@shared/quran/arabicNumber';
import { holdsTerms } from '@shared/quran/searchAll';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Empty from '@/ui/Empty';
import Tabs from '@/ui/Tabs';
import Sheet from '@/ui/Sheet';
import TapRow from '@/ui/TapRow';
import OpenButton from '@/ui/OpenButton';
import QuoteBar from '@/ui/QuoteBar';
import EdgeBar from '@/ui/EdgeBar';
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

const PIN_ROOM = 12;

const openBattle = (slug: string) => router.push({ pathname: '/battle', params: { slug } });

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

function AtlasBattle({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  const said = battle.place?.refs.find(ref => ref.text && placeSayer(ref.cite));
  return (
    <EdgeBar tone={battle.place ? palette.accent : palette.rule} width={2} gap={4}>
      {battle.kind ? <Text style={{ color: palette.accent, fontSize: 13, textAlign: 'right' }}>{battle.kind.value}</Text> : null}
      <Text style={{ color: palette.ink, fontSize: 21, textAlign: 'right' }}>{battle.name}</Text>
      {said ? <QuoteBar by={placeSayer(said.cite)} pieces={[{ text: said.text, name: false }]} tone={palette.rule} size={16} palette={palette} /> : null}
      {!battle.place && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>لم يعيّن كتاب موضعها، فلا دبوس لها</Text>}
      {placeRefs(battle).map(refs => <Refs key={refs[0]?.cite} refs={refs} palette={palette} />)}
      <View style={{ alignItems: 'flex-start' }}>
        <OpenButton label={`افتح ${battle.name}`} onPress={() => openBattle(battle.slug)} palette={palette} />
      </View>
    </EdgeBar>
  );
}

function PlaceSheet({ battles, onClose, palette }: { battles: AppBattle[]; onClose: () => void; palette: Palette }) {
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

export default function AtlasScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [barsEnd, setBarsEnd] = useState(0);
  const [lower, setLower] = useState(0);
  useTabRetap('atlas', () => setLower(n => n + 1));
  const params = useLocalSearchParams<{ layer?: string; year?: string; place?: string; at?: string }>();
  const years = useMemo(() => lifeYears(BATTLES), []);
  const [layer, setLayer] = useState<AtlasLayer>('life');
  const [year, setYear] = useState(years[0]);
  const [query, setQuery] = useState('');
  const [sheet, setSheet] = useState<AppBattle[]>([]);
  useEffect(() => {
    setQuery('');
    const at = params.place ? BATTLES.find(battle => battle.place?.name === params.place) : undefined;
    const toLayer = at ? layerOf(at) : params.layer === 'after' ? 'after' : params.year ? 'life' : undefined;
    if (toLayer) setLayer(toLayer);
    const toYear = at && toLayer === 'life' ? at.year!.value : params.year ? Number(params.year) : undefined;
    if (toYear && years.includes(toYear)) setYear(toYear);
    if (at) setSheet(battlesAt(BATTLES, layerOf(at), [at.place!.name], toYear));
  }, [params.layer, params.year, params.place, params.at, years]);
  const low = Math.round(size.height * 0.56);
  const box = useMemo(() => (size.width && barsEnd ? screenBox(BATTLES, layer, { width: size.width, height: size.height, top: barsEnd, bottom: low - PIN_ROOM }) : undefined),
    [layer, size.width, size.height, barsEnd, low]);
  const pins = useMemo(() => atlasPins(BATTLES, layer, year), [layer, year]);
  const madinah = useMemo(() => battleTimeline(layerBattles(BATTLES, 'life')).madinah, []);
  const found = useMemo(() => searchBattles(BATTLES, query), [query]);
  const foundPlaces = useMemo(() => {
    const typed = query.trim();
    if (!typed) return [];
    const last = new Map<string, AppBattle>();
    for (const battle of BATTLES) if (battle.place && holdsTerms(battle.place.name, typed)) last.set(battle.place.name, battle);
    return [...last.values()];
  }, [query]);
  const foundYear = useMemo(() => {
    const typed = Number(query.trim().replace(/^السنة\s*/, '').replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660)));
    return query.trim() && years.includes(typed) ? typed : undefined;
  }, [query, years]);
  const battles = layer === 'life' ? BATTLES.filter(battle => layerOf(battle) === 'life' && battle.year!.value === year) : layerBattles(BATTLES, 'after');
  const dated = battles.filter(battle => battle.year);
  const undated = battles.filter(battle => !battle.year);
  const sources = sourcesOf(atlasSources(BATTLES, layer, year));
  const showPlace = (names: string[]) => setSheet(battlesAt(BATTLES, layer, names, year));
  const pickFound = (battle: AppBattle) => {
    setQuery('');
    if (!battle.place) return openBattle(battle.slug);
    const to = layerOf(battle);
    setLayer(to);
    if (to === 'life') setYear(battle.year!.value);
    setSheet(battlesAt(BATTLES, to, [battle.place.name], battle.year?.value));
  };
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper, overflow: 'hidden' }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
      {box && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <BattleMap places={pins} box={box} palette={palette} onPin={showPlace} />
      </View>}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} onLayout={event => setBarsEnd(Math.round(event.nativeEvent.layout.height))}>
        <TopBar back={back} search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الأطلس', label: 'ابحث في الأطلس' }} />
        <View style={{ paddingHorizontal: 16, paddingTop: 4 }}>
          <Tabs label="الطبقة" options={LAYERS.map(each => ({ key: each.key, label: each.name }))} value={layer} onChange={setLayer} palette={palette} fill />
        </View>
      </View>
      {size.height > 0 && barsEnd > 0 && (
        <DrawerSheet low={low} high={barsEnd} bottom={bottom} lower={lower} raised={query.trim() !== ''} palette={palette}>
          {query.trim() ? (
            found.length || foundPlaces.length || foundYear
              ? <View style={{ gap: 6 }}>
                {foundYear ? <TapRow role="button" label={`السنة ${num(foundYear)} للهجرة`} onPress={() => { setQuery(''); setLayer('life'); setYear(foundYear); }}>
                  <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>{`السنة ${num(foundYear)}`}<Text style={{ color: palette.muted, fontSize: 14 }}> للهجرة</Text></Text>
                </TapRow> : null}
                {foundPlaces.length > 0 && <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>المواضع</Text>}
                {foundPlaces.map(battle => (
                  <TapRow key={battle.place!.name} role="button" label={battle.place!.name} onPress={() => pickFound(battle)}>
                    <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>{battle.place!.name}</Text>
                  </TapRow>
                ))}
                {found.length > 0 && <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>الغزوات والمعارك</Text>}
                {found.map(battle => <BattleRow key={battle.slug} battle={battle} onPress={() => pickFound(battle)} palette={palette} />)}
              </View>
              : <Empty text="لا سنة ولا موضع ولا غزوة بهذا الاسم" palette={palette} />
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
