import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { Check } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { numberVerses, type NumberedVerse, type Poem } from '@shared/tajwid/poem';
import poemData from '@shared/tajwid/tuhfat-al-atfal.json';
import { Text } from '@/ui/Text';
import Sheet from '@/ui/Sheet';
import SourceLine from '@/ui/SourceLine';
import BarPicker from '@/ui/BarPicker';
import TopBar from '@/ui/TopBar';
import CardShare, { ShareHead } from '@/ui/CardShare';
import { ICON_BUTTON } from '@/ui/IconButton';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette, type Palette } from '@/lib/theme';

const poem = poemData as Poem;
const chapters = numberVerses(poem);
const count = chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0);

/** One verse, its first half on the right and its second on the left, its number on the right (a quiz that looks the poem up draws it too). */
export function TuhfaVerse({ verse, marked, palette, onLayout }: { verse: NumberedVerse; marked: boolean; palette: Palette; onLayout?: (event: LayoutChangeEvent) => void }) {
  return (
    <View accessible accessibilityLabel={`${num(verse.number)}: ${verse.first}، ${verse.second}`} onLayout={onLayout}
      style={{ flexDirection: 'row', gap: 10, paddingVertical: 6, borderBottomWidth: 1, borderColor: `${palette.rule}40`, borderRadius: 8, backgroundColor: marked ? palette.paperDeep : 'transparent' }}>
      <Text style={{ width: 22, color: palette.muted, fontSize: 13, paddingTop: 6, textAlign: 'right' }}>{num(verse.number)}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{verse.first}</Text>
        <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'left' }}>{verse.second}</Text>
      </View>
    </View>
  );
}

/**
 * The website's /quran/tajwid/tuhfat-al-atfal on the phone: the whole poem in al-Warraqi's vowelling, one verse under the other,
 * its first half on the right and its second on the left, the verse number on the right. The chapter's name in the top bar opens the chapters.
 */
export default function TuhfaScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const tops = useRef<number[]>([]);
  const [chapter, setChapter] = useState(0);
  const [picking, setPicking] = useState(false);
  // The search opens a verse with ?verse=<number>: scrolled to it once laid out, and marked until the next search.
  const verseY = useRef<Record<number, number>>({});
  const { verse } = useLocalSearchParams<{ verse?: string }>();
  const [marked, setMarked] = useState<number>();
  const pending = useRef<number>(undefined);
  const toVerse = () => {
    const number = pending.current;
    const part = chapters.findIndex(chapter => chapter.verses.some(item => item.number === number));
    const top = tops.current[part];
    const y = number === undefined ? undefined : verseY.current[number];
    if (top === undefined || y === undefined) return;
    pending.current = undefined;
    scroll.current?.scrollTo({ y: Math.max(0, top + y - 60), animated: false });
  };
  useEffect(() => {
    const number = Number(verse);
    if (!verse || !Number.isInteger(number)) return;
    setMarked(number);
    pending.current = number;
    router.setParams({ verse: undefined });
    toVerse();
  }, [verse]); // eslint-disable-line react-hooks/exhaustive-deps
  useTabRetap('tuhfa', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    shrink(event);
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const y = contentOffset.y + 40;
    let at = 0;
    tops.current.forEach((top, i) => { if (top <= y) at = i; });
    // The last chapter is too short to reach the top: at the end of the page it is the one being read.
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 2) at = chapters.length - 1;
    if (at !== chapter) setChapter(at);
  };
  const jump = (i: number) => {
    setPicking(false);
    setChapter(i);
    scroll.current?.scrollTo({ y: i === 0 ? 0 : tops.current[i] ?? 0, animated: false });
  };
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll center>
        <BarPicker text={chapters[chapter].title} label={`اختر بابًا: ${chapters[chapter].title}`} onPress={() => setPicking(true)} />
      </TopBar>
      <ScrollView ref={scroll} onScroll={onScroll} onContentSizeChange={toVerse} scrollEventThrottle={16} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: bottom }}>
        <Text style={{ color: palette.ink, fontSize: 22, fontWeight: '700', textAlign: 'center' }}>{poem.title}</Text>
        <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'center', marginTop: 4 }}>{`${poem.author}، ${num(poem.composed)}هـ، ${num(count)} بيتًا`}</Text>
        {/* The edition and the transcription it was checked against, on the book line (owner 2026-11-20). */}
        <SourceLine palette={palette} sources={[{ line: poem.title, quotes: [{ text: '', cite: `الضبط: ${poem.edition.name}`, url: poem.edition.url }, { text: '', cite: 'قوبل به كل بيت من نسخة رقمية', url: poem.transcription }] }]} />
        {chapters.map((part, i) => (
          <View key={part.title} onLayout={event => { tops.current[i] = event.nativeEvent.layout.y; toVerse(); }} style={{ marginTop: 18 }}>
            {/* Each chapter shares as one picture, its verses' numbers and the poem's edition written out (release 1: every page shares). */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <View style={{ width: ICON_BUTTON.bar.box }} />
              <Text accessibilityRole="header" style={{ flex: 1, color: palette.accent, fontSize: 18, fontWeight: '700', textAlign: 'center' }}>{part.title}</Text>
              <CardShare label={`شارك ${part.title}`} palette={palette} pad={[8, 14]}
                head={<ShareHead title={poem.title} sub={part.title} palette={palette} />}
                sources={[{ line: `${poem.title} · ${poem.author}`, quotes: [],
                  places: [part.verses.length === 1 ? `البيت ${num(part.verses[0].number)}` : `الأبيات ${num(part.verses[0].number)}–${num(part.verses[part.verses.length - 1].number)}`], editions: [`الضبط: ${poem.edition.name}`] }]}>
                {part.verses.map(verse => <TuhfaVerse key={verse.number} verse={verse} marked={false} palette={palette} />)}
              </CardShare>
            </View>
            {part.verses.map(verse => <TuhfaVerse key={verse.number} verse={verse} marked={marked === verse.number} palette={palette}
              onLayout={event => { verseY.current[verse.number] = event.nativeEvent.layout.y; }} />)}
          </View>
        ))}
      </ScrollView>
      <Sheet open={picking} onClose={() => setPicking(false)} palette={palette}>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          {chapters.map((part, i) => (
            <Pressable key={part.title} onPress={() => jump(i)} accessibilityRole="button" accessibilityState={{ selected: i === chapter }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, height: 48, borderRadius: 10, backgroundColor: i === chapter ? palette.paperDeep : 'transparent' }}>
              <Text numberOfLines={1} style={{ flex: 1, color: palette.ink, fontSize: 17 }}>{part.title}</Text>
              {i === chapter ? <Check size={18} color={palette.accent} /> : <Text style={{ color: palette.muted, fontSize: 14 }}>{num(part.verses[0].number)}</Text>}
            </Pressable>
          ))}
        </ScrollView>
      </Sheet>
    </View>
  );
}

