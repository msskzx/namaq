import { useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { Text, TextInput } from '@/components/Text';
import { router, type Href } from 'expo-router';
import { ArrowLeftRight, Bookmark, BookOpen, Check, EyeOff, Feather, GalleryHorizontal, Layers, Library, LightbulbOff, List, Search, Users, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks, toggleBookmark, type Bookmark as Saved } from '@shared/bookmarks';
import { clearForgotten, readAyahMarks, recentlyForgotten, subscribeAyahMarks } from '@shared/ayahMarks';
import { BOOKMARK_KIND_LABEL, type BookmarkKind } from '@shared/bookmarkKind';
import { forgottenOrder } from '@shared/quran/recite';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { searchSurahs } from '@shared/quran/surahSearch';
import { num } from '@shared/quran/arabicNumber';
import TopBar from '@/components/TopBar';
import { useTabBarSpace } from '@/components/tabBarSpace';
import TreeIcon from '@/components/TreeIcon';
import Button, { Row } from '@/components/Button';
import Tour from '@/components/Tour';
import { ayahText, surahs, surahNames } from '@/lib/mushaf';
import { listedPairs, type CompareTarget } from '@/lib/compare';
import { cardWays, forgottenCard, forgottenWays, savedCard, shelfText, shownBookmarks, type CardWay, type SavedCard } from '@/lib/home';
import CardMenu, { type MenuAt, type MenuItem } from '@/components/CardMenu';
import CompareTargetsSheet from '@/components/CompareTargetsSheet';
import { followWay } from '@/lib/ways';
import { setIntent, type Intent } from '@/lib/intent';
import { useShrinkOnScroll } from '@/lib/chrome';
import { tourSeen } from '@/lib/settings';
import { QURAN_FONT, usePalette, type Palette } from '@/lib/theme';

const KIND_ICONS: Record<BookmarkKind, (props: LucideProps) => React.ReactNode> = { tree: TreeIcon, compare: ArrowLeftRight, ayah: BookOpen };
const WAYS: Record<CardWay['to'], { label: string; Icon: (props: LucideProps) => React.ReactNode }> = {
  mushaf: { label: 'في المصحف', Icon: BookOpen },
  tree: { label: 'الشجرة', Icon: TreeIcon },
  matrix: { label: 'المصفوفة', Icon: GalleryHorizontal },
  trees: { label: 'الأشجار التي فيها الآية', Icon: TreeIcon },
  compare: { label: 'في المقارنة', Icon: ArrowLeftRight },
};
const TAB_OF: Record<Intent['tab'], Href> = { branches: '/branches', compare: '/compare', read: '/read' };

const go = (intent: Intent) => { setIntent(intent); router.navigate(TAB_OF[intent.tab]); };

type Section = { number: number; name: string; nameTransliterated?: string | null };
const comparable = new Set(listedPairs.flatMap(pair => [pair.a, pair.b]));
const JUZ: Section[] = JUZ_INDEX.map(juz => ({ number: juz.juz, name: `الجزء ${num(juz.juz)}` }));

function Heading({ Icon, title, palette, children }: { Icon: (props: LucideProps) => React.ReactNode; title: string; palette: Palette; children?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 42 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon size={20} color={palette.accent} />
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, fontWeight: '700' }}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

/** The website's homepage Quran box: pick a surah or juz, then read it, explore its shared wording or compare it. */
function QuranPicker({ palette }: { palette: Palette }) {
  const [unit, setUnit] = useState<'surah' | 'juz'>('surah');
  const [query, setQuery] = useState('');
  const [number, setNumber] = useState<number | null>(null);
  const sections: Section[] = unit === 'surah' ? surahs : JUZ;
  const shown = useMemo(() => {
    const needle = unit === 'juz' ? query.match(/[0-9٠-٩۰-۹]+/)?.[0] ?? query : query;
    return searchSurahs(sections, needle);
  }, [sections, unit, query]);
  const selected = sections.find(section => section.number === number);
  const pickUnit = (next: 'surah' | 'juz') => { setUnit(next); setQuery(''); setNumber(null); };
  const read = () => {
    if (!number) return;
    if (unit === 'surah') go({ tab: 'read', at: `${number}:1` });
    else { const juz = JUZ_INDEX[number - 1]; go({ tab: 'read', at: `${juz.surah}:${juz.ayah}` }); }
  };
  const explore = () => { if (number) go(unit === 'surah' ? { tab: 'branches', surah: number } : { tab: 'branches', juz: number }); };
  const compare = () => { if (number) go({ tab: 'compare', lead: number }); };
  const placeholder = unit === 'surah' ? 'ابحث عن سورة' : 'ابحث عن جزء';
  return (
    <View style={{ gap: 10, borderWidth: 1, borderColor: palette.rule, borderRadius: 12, padding: 12, backgroundColor: palette.card }}>
      <Heading Icon={BookOpen} title="القرآن الكريم" palette={palette}>
        <View accessibilityRole="radiogroup" accessibilityLabel="عرض حسب" style={{ flexDirection: 'row', borderWidth: 1, borderColor: palette.rule, borderRadius: 10, padding: 2, gap: 2 }}>
          {(['surah', 'juz'] as const).map(value => {
            const on = unit === value;
            const Icon = value === 'surah' ? List : Layers;
            return (
              <Pressable key={value} onPress={() => pickUnit(value)} accessibilityRole="radio" accessibilityState={{ checked: on }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: on ? palette.accent : 'transparent' }}>
                <Icon size={16} color={on ? palette.onAccent : palette.ink} />
                <Text style={{ color: on ? palette.onAccent : palette.ink, fontSize: 14 }}>{value === 'surah' ? 'السور' : 'الأجزاء'}</Text>
              </Pressable>
            );
          })}
        </View>
      </Heading>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 10, backgroundColor: palette.paper }}>
        <Search size={18} color={palette.muted} />
        <TextInput value={query} onChangeText={text => { setQuery(text); setNumber(null); }} placeholder={placeholder} placeholderTextColor={palette.muted} accessibilityLabel={placeholder}
          style={{ flex: 1, height: 42, color: palette.ink, fontSize: 16, textAlign: 'right' }} />
      </View>
      <ScrollView nestedScrollEnabled style={{ height: 240, borderWidth: 1, borderColor: palette.rule, borderRadius: 10, backgroundColor: palette.paper }}>
        {shown.map(section => {
          const on = section.number === number;
          return (
            <Pressable key={section.number} onPress={() => setNumber(section.number)} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={section.name}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: palette.paperDeep, backgroundColor: on ? palette.paperDeep : 'transparent' }}>
              <Text style={{ width: 32, color: palette.muted, fontSize: 13, textAlign: 'center' }}>{num(section.number)}</Text>
              <Text style={{ flex: 1, color: palette.ink, fontSize: 16, textAlign: 'right' }}>{section.name}</Text>
              <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: on ? 5 : 1.5, borderColor: on ? palette.accent : palette.rule }} />
            </Pressable>
          );
        })}
        {!shown.length && <Text style={{ padding: 16, color: palette.muted, fontSize: 15, textAlign: 'center' }}>لا توجد نتيجة مطابقة.</Text>}
      </ScrollView>
      <Text style={{ color: selected ? palette.ink : palette.muted, fontSize: 15 }}>{selected ? selected.name : unit === 'surah' ? 'اختر سورة' : 'اختر جزءًا'}</Text>
      <Row>
        <Button variant="primary" Icon={BookOpen} label="اقرأ" onPress={read} disabled={!selected} />
        <Button Icon={TreeIcon} label="استكشف المتشابهات" onPress={explore} disabled={!selected} />
        {unit === 'surah' && <Button Icon={ArrowLeftRight} label="قارن" onPress={compare} disabled={!selected || !comparable.has(selected.number)} />}
      </Row>
    </View>
  );
}

function ShelfCard({ card, palette, onPress, Icon = KIND_ICONS[card.kind], label = BOOKMARK_KIND_LABEL[card.kind].ar }: {
  card: SavedCard; palette: Palette; onPress: (at: MenuAt) => void; Icon?: (props: LucideProps) => React.ReactNode; label?: string;
}) {
  const box = useRef<ComponentRef<typeof View>>(null);
  // A screen reader's tap often carries no point: the menu then opens over the card's top.
  const open = ({ pageX, pageY }: { pageX: number; pageY: number }) => {
    if (pageX || pageY) onPress({ x: pageX, y: pageY });
    else box.current?.measureInWindow((x: number, y: number, width: number) => onPress({ x: x + width / 2, y: y + 24 }));
  };
  return (
    <Pressable ref={box} onPress={event => open(event.nativeEvent)} accessibilityRole="button" accessibilityLabel={`${label}: ${card.text}`}
      style={({ pressed }) => ({ width: 250, minHeight: 200, padding: 14, gap: 10, borderWidth: 1, borderStartWidth: 5, borderColor: palette.rule, borderRadius: 6, backgroundColor: palette.paperDeep, opacity: pressed ? 0.75 : card.open ? 1 : 0.6 })}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingBottom: card.references.length ? 8 : 0, borderBottomWidth: card.references.length ? 1 : 0, borderColor: palette.rule }}>
        <View style={{ height: 20, justifyContent: 'center' }}><Icon size={16} color={palette.accent} /></View>
        {card.references.length > 0 && (
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 2 }}>
            {card.references.map(reference => (
              <Text key={reference.surah} style={{ color: palette.muted, fontSize: 13, lineHeight: 20 }}>
                {surahNames[reference.surah]} {reference.ayat.map(num).join(reference.range ? '–' : '، ')}
              </Text>
            ))}
          </View>
        )}
      </View>
      <Text numberOfLines={5} style={{ marginVertical: 'auto', color: palette.ink, fontFamily: QURAN_FONT, fontSize: 21, lineHeight: 40, textAlign: 'right' }}>{shelfText(card)}</Text>
    </Pressable>
  );
}

/** A row of cards, the first on the right. Inverted in a left-to-right box, as the compare pager does, so it starts on the right on every platform. */
function Shelf({ cards, render }: { cards: SavedCard[]; render: (card: SavedCard, index: number) => React.ReactNode }) {
  return (
    <View style={{ direction: 'ltr', marginHorizontal: -16 }}>
      <FlatList data={cards} horizontal inverted showsHorizontalScrollIndicator={false} keyExtractor={card => card.id}
        contentContainerStyle={{ gap: 12, paddingVertical: 4, paddingHorizontal: 16 }}
        renderItem={({ item, index }) => <View style={{ direction: 'rtl' }}>{render(item, index)}</View>} />
    </View>
  );
}

/** The website's homepage on the phone: the Quran box, the saved shelf, and the quizzes. The logo in the top bar opens it. */
export default function HomeScreen() {
  const palette = usePalette();
  const allBookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const bookmarks = useMemo(() => shownBookmarks(allBookmarks), [allBookmarks]);
  const cards = useMemo(() => bookmarks.map(savedCard), [bookmarks]);
  const [menu, setMenu] = useState<{ at: MenuAt; label: string; items: MenuItem[] } | null>(null);
  const [choosing, setChoosing] = useState<{ way: CardWay; targets: CompareTarget[] } | null>(null);
  const hasTrees = cards.some(card => card.kind === 'tree' && card.open);
  const marks = useSyncExternalStore(subscribeAyahMarks, readAyahMarks);
  const forgotten = useMemo(() => forgottenOrder(Object.keys(marks)), [marks]);
  const forgottenCards = useMemo(() => recentlyForgotten(marks).map(key => forgottenCard(key, ayahText(key))), [marks]);
  /** Every other view of a card's ayat; compare across several surahs is picked next. */
  const wayItems = (ways: CardWay[]): MenuItem[] => ways.map(way => ({
    id: way.to, ...WAYS[way.to],
    onPress: () => (way.to === 'compare' && way.targets.length > 1 ? setChoosing({ way, targets: way.targets }) : followWay(way)),
  }));
  const savedMenu = (item: Saved, at: MenuAt) => setMenu({ at, label: BOOKMARK_KIND_LABEL[savedCard(item).kind].ar, items: [
    ...wayItems(cardWays(item)),
    { id: 'saved', Icon: Bookmark, label: 'أزلها من المحفوظات', on: true, onPress: () => toggleBookmark(item) },
  ] });
  const forgottenMenu = (card: SavedCard, at: MenuAt) => setMenu({ at, label: 'آية نسيتها', items: [
    { id: 'recite', Icon: EyeOff, label: 'سمّع من هذه الآية', onPress: () => card.open && go(card.open) },
    ...wayItems(forgottenWays(card.id)),
    { id: 'clear', Icon: Check, label: 'تذكّرتها، أزلها من المراجعة', onPress: () => clearForgotten(card.id) },
  ] });
  const push = (href: Href) => router.push(href);
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const [seen, setSeen] = tourSeen.use();
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar settings hideOnScroll />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 28 }}>
        <QuranPicker palette={palette} />

        {forgottenCards.length > 0 && (
          <View style={{ gap: 10 }}>
            <Heading Icon={LightbulbOff} title="ما نسيته" palette={palette}>
              <Button Icon={EyeOff} label={num(forgotten.length)} accessibilityLabel={`راجع ما نسيت (${num(forgotten.length)})`}
                onPress={() => go({ tab: 'read', at: forgotten[0], recite: true, review: true })} />
            </Heading>
            <Shelf cards={forgottenCards} render={card => <ShelfCard card={card} palette={palette} Icon={LightbulbOff} label="آية نسيتها" onPress={at => forgottenMenu(card, at)} />} />
          </View>
        )}

        <View style={{ gap: 10 }}>
          <Heading Icon={Bookmark} title="المحفوظات" palette={palette}>
            {hasTrees && <Button Icon={Library} accessibilityLabel="افتح المحفوظات" onPress={() => go({ tab: 'branches', saved: true })} />}
          </Heading>
          {cards.length ? (
            <Shelf cards={cards} render={(card, index) => <ShelfCard card={card} palette={palette} onPress={at => savedMenu(bookmarks[index], at)} />} />
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: palette.muted, fontSize: 15 }}>احفظ شجرة أو بطاقة مقارنة أو آية بزر</Text>
              <Bookmark size={18} color={palette.muted} accessibilityLabel="الحفظ" />
              <Text style={{ color: palette.muted, fontSize: 15 }}>لتجدها هنا.</Text>
            </View>
          )}
        </View>

        <View style={{ gap: 12, padding: 12, borderWidth: 1, borderColor: palette.rule, borderRadius: 12, backgroundColor: palette.paperDeep }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <Feather size={26} color={palette.accent} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>اختبارات القرآن</Text>
              <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 23, textAlign: 'right' }}>تأمّل الآيات، ثم اختبر مواضع التشابه، أو سمّع حفظك آيةً آية.</Text>
            </View>
          </View>
          <Row>
            <Button grow Icon={Feather} label="بمفردك" onPress={() => push('/quiz/solo')} />
            <Button grow Icon={Users} label="مع غيرك" onPress={() => push('/quiz/party')} />
            <Button grow Icon={EyeOff} label="تسميع" onPress={() => go({ tab: 'read', recite: true })} />
          </Row>
        </View>
      </ScrollView>
      <CardMenu at={menu?.at ?? null} items={menu?.items ?? []} label={menu?.label ?? ''} onClose={() => setMenu(null)} palette={palette} />
      <CompareTargetsSheet targets={choosing?.targets ?? null} palette={palette}
        onPick={target => { const way = choosing!.way; setChoosing(null); followWay(way, target); }} onClose={() => setChoosing(null)} />
      {!seen && <Tour palette={palette} onDone={() => setSeen(true)} />}
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
