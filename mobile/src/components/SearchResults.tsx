import { useMemo, useState, useSyncExternalStore } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeftRight, ChevronDown, ChevronLeft, HandHeart, History, List, NotebookPen, ScrollText, TextSearch, type LucideProps } from 'lucide-react-native';
import { readAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import TapRow from '@/ui/TapRow';
import TreeIcon from '@/components/TreeIcon';
import WordSheet from '@/components/WordSheet';
import { QuranWord } from '@/components/quran/text/AyahFlow';
import LitAyat from '@/components/quran/text/LitAyat';
import { FEATURE_ICON } from '@/components/featureIcons';
import { surahName } from '@/lib/compare';
import { GROUP_MAX, searchApp, warmSearch, type AppGroup as SearchGroup, type AppHit as SearchHit, type AppKind as SearchKind } from '@/lib/searchAll';
import { openDhikr } from '@/lib/adhkar';
import { openIntent as go, toTab } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import { useAfter } from '@/lib/hooks/useAfter';
import { useDebounced } from '@/lib/hooks/useDebounced';

export const GROUP_SHOWN = 3;

export const GROUPS: Record<SearchKind, { title: string; Icon: (props: LucideProps) => React.ReactNode }> = {
  surah: { title: 'السور', Icon: List },
  ayah: { title: 'الآيات', Icon: FEATURE_ICON.mushaf },
  word: { title: 'الألفاظ', Icon: TextSearch },
  tree: { title: 'المتشابهات', Icon: TreeIcon },
  compare: { title: 'المقارنة', Icon: ArrowLeftRight },
  event: { title: 'قصص الأنبياء', Icon: History },
  sira: { title: 'قصص السيرة', Icon: ScrollText },
  person: { title: 'التراجم', Icon: FEATURE_ICON.person },
  battle: { title: 'الغزوات والمعارك', Icon: FEATURE_ICON.battles },
  hadith: { title: 'الحديث', Icon: FEATURE_ICON.hadith },
  tuhfa: { title: 'تحفة الأطفال', Icon: ScrollText },
  adhkar: { title: 'الأذكار', Icon: HandHeart },
  note: { title: 'تأملاتي', Icon: NotebookPen },
};

const ayahLabel = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${surahName(surah)} ${num(ayah)}`; };

function HitRow({ hit, palette, onWord }: { hit: SearchHit; palette: Palette; onWord: (id: number) => void }) {
  const row = { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, paddingHorizontal: 6, paddingVertical: 6, borderBottomWidth: 1, borderColor: `${palette.rule}60` } as const;
  const pressed = (on: boolean) => (on ? { backgroundColor: palette.paperDeep } : null);
  switch (hit.kind) {
    case 'surah':
      return (
        <Pressable onPress={() => go({ tab: 'read', at: `${hit.number}:1` })} accessibilityRole="link" style={({ pressed: on }) => [row, pressed(on)]}>
          <Text style={{ width: 30, color: palette.muted, fontSize: 13, textAlign: 'center' }}>{num(hit.number)}</Text>
          <Text style={{ flex: 1, color: palette.ink, fontSize: 17, textAlign: 'right' }}>{hit.name}</Text>
        </Pressable>
      );
    case 'ayah':
      return (
        <Card palette={palette} pad={[8, 12]} onPress={() => go({ tab: 'read', at: hit.key })} accessibilityRole="link" accessibilityLabel={ayahLabel(hit.key)} style={{ marginBottom: 8 }}>
          <LitAyat ayat={[{ words: hit.words, lit: [[hit.from, hit.to]], number: Number(hit.key.split(':')[1]) }]} menu={hit.key} palette={palette} />
          <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{ayahLabel(hit.key)}</Text>
        </Card>
      );
    case 'word':
      return (
        <Pressable onPress={() => onWord(hit.id)} accessibilityRole="button" accessibilityLabel={`${hit.name}، ${num(hit.count)} مرة`} style={({ pressed: on }) => [row, pressed(on)]}>
          <QuranWord look={{ color: palette.ink }} place={{ flex: 1, textAlign: 'right' }}>{hit.name}</QuranWord>
          <Text style={{ color: palette.accent, fontSize: 16 }}>{num(hit.count)}</Text>
        </Pressable>
      );
    case 'tree':
      return (
        <Pressable onPress={() => go({ tab: 'branches', query: hit.text, open: hit.id })} accessibilityRole="link" style={({ pressed: on }) => [row, pressed(on)]}>
          <QuranWord look={{ color: palette.ink }} place={{ flex: 1, textAlign: 'right' }}>{hit.text}</QuranWord>
        </Pressable>
      );
    case 'compare':
      return (
        <Pressable onPress={() => go({ tab: 'compare', lead: hit.a, other: hit.b })} accessibilityRole="link" style={({ pressed: on }) => [row, pressed(on)]}>
          <Text style={{ flex: 1, color: palette.ink, fontSize: 16, textAlign: 'right' }}>{hit.title}</Text>
        </Pressable>
      );
    case 'event': case 'sira':
      return (
        <Pressable accessibilityRole="link" style={({ pressed: on }) => [row, pressed(on)]} onPress={() => (hit.kind === 'event'
          ? router.push({ pathname: '/prophets/[slug]', params: { slug: hit.slug, event: String(hit.event) } })
          : toTab(hit.slug ? { pathname: '/story', params: { slug: hit.slug } } : { pathname: '/stories', params: { chapter: hit.chapter! } }))}>
          <Text style={{ flex: 1, color: palette.ink, fontSize: 16, textAlign: 'right' }}>{hit.title}</Text>
          <Text style={{ color: palette.muted, fontSize: 13 }}>{hit.kind === 'event' ? hit.prophet : hit.chapter ? 'باب' : ''}</Text>
        </Pressable>
      );
    case 'person': case 'battle':
      return (
        <TapRow role="link" label={hit.name} style={row} onPress={() => toTab({ pathname: hit.kind === 'person' ? '/person' : '/battle', params: { slug: hit.slug } })}>
          <Text style={{ flex: 1, color: palette.ink, fontSize: 17, textAlign: 'right' }}>{hit.name}</Text>
          {hit.line ? <Text numberOfLines={1} style={{ flexShrink: 1, maxWidth: '50%', color: palette.muted, fontSize: 13, textAlign: 'left' }}>{hit.line}</Text> : null}
        </TapRow>
      );
    case 'hadith':
      return (
        <TapRow role="link" label={hit.title} style={row} onPress={() => toTab(hit.book === 'forty'
          ? { pathname: '/hadith-forty', params: { n: String(hit.n) } }
          : hit.n ? { pathname: '/hadith-sahih', params: { book: hit.book, n: String(hit.n) } } : { pathname: '/hadith-kitab', params: { book: hit.book, kitab: String(hit.kitab) } })}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text numberOfLines={2} style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>{hit.title}</Text>
            <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{hit.place}</Text>
          </View>
        </TapRow>
      );
    case 'tuhfa':
      return (
        <Pressable onPress={() => toTab({ pathname: '/tuhfa', params: { verse: String(hit.verse) } })} accessibilityRole="link" style={({ pressed: on }) => [row, pressed(on)]}>
          <Text style={{ width: 22, color: palette.muted, fontSize: 13, textAlign: 'right' }}>{num(hit.verse)}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>{hit.first}</Text>
            <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'left' }}>{hit.second}</Text>
          </View>
        </Pressable>
      );
    case 'adhkar':
      return (
        <Card palette={palette} pad={[8, 12]} onPress={() => openDhikr(hit.occasion, hit.id)} accessibilityRole="link" accessibilityLabel={hit.text} style={{ marginBottom: 8 }}>
          <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{hit.text}</Text>
        </Card>
      );
    case 'note':
      return (
        <Pressable onPress={() => go({ tab: 'read', at: hit.key })} accessibilityRole="link" style={({ pressed: on }) => [row, pressed(on)]}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text numberOfLines={2} style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{hit.text}</Text>
            <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{ayahLabel(hit.key)}</Text>
          </View>
        </Pressable>
      );
  }
}

const hitKey = (hit: SearchHit) => {
  switch (hit.kind) {
    case 'surah': return `s${hit.number}`;
    case 'ayah': case 'note': return `${hit.kind}${hit.key}`;
    case 'word': return `w${hit.id}`;
    case 'tree': return `t${hit.id}`;
    case 'compare': return `c${hit.a}:${hit.b}`;
    case 'event': return `e${hit.slug}${hit.event}`;
    case 'sira': return `q${hit.slug ?? hit.chapter}`;
    case 'tuhfa': return `v${hit.verse}`;
    case 'adhkar': return `d${hit.id}`;
    case 'person': return `p${hit.slug}`;
    case 'battle': return `b${hit.slug}`;
    case 'hadith': return `h${hit.book}${hit.n}:${hit.kitab ?? ''}:${hit.title}`;
  }
};

export function useAppSearch(query: string, keep?: (kind: SearchKind) => boolean) {
  useAfter(400, warmSearch);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes);
  const typed = query.trim();
  const settled = useDebounced(typed, 150);
  const found = useMemo<{ query: string; groups: SearchGroup[]; notes: typeof notes }>(() => {
    if (!settled) return { query: '', groups: [], notes };
    const groups = searchApp(settled);
    return { query: settled, groups: keep ? groups.filter(group => keep(group.kind)) : groups, notes };
  }, [settled, keep, notes]);
  return { found, waiting: typed !== found.query };
}

export function SearchResults({ groups, open, onOpen, palette }: {
  groups: SearchGroup[]; open: SearchKind | null; onOpen: (kind: SearchKind | null) => void; palette: Palette;
}) {
  const [word, setWord] = useState<number[] | null>(null);
  return (
    <>
      {(open ? groups.filter(group => group.kind === open) : groups).map(group => {
        const { title, Icon } = GROUPS[group.kind];
        const more = group.hits.length > GROUP_SHOWN;
        const shown = group.hits.slice(0, open ? GROUP_MAX : GROUP_SHOWN);
        return (
          <View key={group.kind}>
            <Pressable disabled={!more && !open} onPress={() => onOpen(open ? null : group.kind)} accessibilityRole="button"
              accessibilityLabel={open ? `${title}: أغلق` : more ? `${title}: عرض الكل` : title}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon size={20} color={palette.accent} />
                <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 17, fontWeight: '700' }}>{title}</Text>
              </View>
              {open ? <ChevronDown size={22} color={palette.accent} /> : more ? <ChevronLeft size={22} color={palette.accent} /> : null}
            </Pressable>
            {shown.map(hit => <HitRow key={hitKey(hit)} hit={hit} palette={palette} onWord={id => setWord([id])} />)}
            {open && group.hits.length > GROUP_MAX && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'center', marginTop: 6 }}>{`أول ${num(GROUP_MAX)} نتيجة، زد كلمة لتضييق البحث.`}</Text>}
          </View>
        );
      })}
      <WordSheet lemmas={word} onClose={() => setWord(null)} palette={palette} />
    </>
  );
}
