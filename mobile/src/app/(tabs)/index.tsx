import { useMemo, useState, useSyncExternalStore } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { ArrowLeftRight, Bookmark, BookOpen, EyeOff, Feather, Layers, Library, LightbulbOff, List, Search, Users, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { readAyahMarks, subscribeAyahMarks } from '@shared/ayahMarks';
import { BOOKMARK_KIND_LABEL, type BookmarkKind } from '@shared/bookmarkKind';
import { forgottenOrder } from '@shared/quran/recite';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { searchSurahs } from '@shared/quran/surahSearch';
import { num } from '@shared/quran/arabicNumber';
import TopBar from '@/components/TopBar';
import TreeIcon from '@/components/TreeIcon';
import Button, { Row } from '@/components/Button';
import HomeIntro from '@/components/HomeIntro';
import { surahs, surahNames } from '@/lib/mushaf';
import { listedPairs } from '@/lib/compare';
import { savedCard, type SavedCard } from '@/lib/home';
import { setIntent, type Intent } from '@/lib/intent';
import { QURAN_FONT, usePalette, type Palette } from '@/lib/theme';

const KIND_ICONS: Record<BookmarkKind, (props: LucideProps) => React.ReactNode> = { tree: TreeIcon, compare: ArrowLeftRight, ayah: BookOpen };
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

function ShelfCard({ card, palette }: { card: SavedCard; palette: Palette }) {
  const Icon = KIND_ICONS[card.kind];
  const label = BOOKMARK_KIND_LABEL[card.kind].ar;
  return (
    <Pressable onPress={() => card.open && go(card.open)} disabled={!card.open} accessibilityRole="link" accessibilityLabel={`${label}: ${card.text}`}
      style={({ pressed }) => ({ width: 250, minHeight: 200, padding: 14, gap: 10, borderWidth: 1, borderStartWidth: 5, borderColor: palette.rule, borderRadius: 6, backgroundColor: palette.paperDeep, opacity: pressed ? 0.75 : card.open ? 1 : 0.6 })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon size={14} color={palette.accent} />
        <Text style={{ color: palette.muted, fontSize: 12 }}>{label}</Text>
      </View>
      {card.references.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 2, paddingBottom: 8, borderBottomWidth: 1, borderColor: palette.rule }}>
          {card.references.map(reference => (
            <Text key={reference.surah} style={{ color: palette.muted, fontSize: 13 }}>
              {surahNames[reference.surah]} {reference.ayat.map(num).join(reference.range ? '–' : '، ')}
            </Text>
          ))}
        </View>
      )}
      <Text numberOfLines={5} style={{ marginVertical: 'auto', color: palette.ink, fontFamily: QURAN_FONT, fontSize: 21, lineHeight: 40, textAlign: 'right' }}>{card.text}</Text>
    </Pressable>
  );
}

/** The website's homepage on the phone: the Quran box, the saved shelf, and the quizzes. The logo in the top bar opens it. */
export default function HomeScreen() {
  const palette = usePalette();
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const cards = useMemo(() => bookmarks.map(savedCard), [bookmarks]);
  const hasTrees = cards.some(card => card.kind === 'tree' && card.open);
  const marks = useSyncExternalStore(subscribeAyahMarks, readAyahMarks);
  const forgotten = useMemo(() => forgottenOrder(Object.keys(marks)), [marks]);
  const push = (href: Href) => router.push(href);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 28 }}>
        <QuranPicker palette={palette} />

        <View style={{ gap: 10 }}>
          <Heading Icon={Bookmark} title="المحفوظات" palette={palette}>
            {hasTrees && <Button Icon={Library} accessibilityLabel="افتح المحفوظات" onPress={() => go({ tab: 'branches', saved: true })} />}
          </Heading>
          {cards.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }} style={{ marginHorizontal: -16 }}>
              <View style={{ width: 4 }} />
              {cards.map(card => <ShelfCard key={card.id} card={card} palette={palette} />)}
              <View style={{ width: 4 }} />
            </ScrollView>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: palette.muted, fontSize: 15 }}>احفظ شجرة أو عائلة أو بطاقة مقارنة أو آية بزر</Text>
              <Bookmark size={18} color={palette.muted} accessibilityLabel="الحفظ" />
              <Text style={{ color: palette.muted, fontSize: 15 }}>لتجدها هنا.</Text>
            </View>
          )}
        </View>

        <View style={{ gap: 12, padding: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.rule, backgroundColor: palette.paperDeep, marginHorizontal: -16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <Feather size={26} color={palette.accent} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>اختبارات القرآن</Text>
              <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 23, textAlign: 'right' }}>تأمّل الآيات، ثم اختبر مواضع التشابه، أو سمّع حفظك آيةً آية.</Text>
            </View>
          </View>
          <Row>
            <Button Icon={Feather} label="بمفردك" onPress={() => push('/quiz/solo')} />
            <Button Icon={Users} label="مع غيرك" onPress={() => push('/quiz/party')} />
            <Button Icon={EyeOff} label="تسميع" onPress={() => go({ tab: 'read', recite: true })} />
            {forgotten.length > 0 && <Button Icon={LightbulbOff} label={num(forgotten.length)} accessibilityLabel={`راجع ما نسيت (${num(forgotten.length)})`}
              onPress={() => go({ tab: 'read', at: forgotten[0], recite: true, review: true })} />}
          </Row>
        </View>
      </ScrollView>
      <HomeIntro palette={palette} />
    </View>
  );
}
