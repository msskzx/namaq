import { useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { numberVerses, type Poem } from '@shared/tajwid/poem';
import poemData from '@shared/tajwid/tuhfat-al-atfal.json';
import { Text } from '@/components/Text';
import Sheet from '@/components/Sheet';
import TopBar from '@/components/TopBar';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { toQuranHub } from '@/lib/ways';
import { usePalette } from '@/lib/theme';

const poem = poemData as Poem;
const chapters = numberVerses(poem);
const count = chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0);

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
      <TopBar back={toQuranHub} hideOnScroll center>
        <Pressable onPress={() => setPicking(true)} accessibilityRole="button" accessibilityLabel={`اختر بابًا: ${chapters[chapter].title}`}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, maxWidth: '100%', borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 }}>
          <Text numberOfLines={1} style={{ flexShrink: 1, color: palette.ink, fontSize: 15 }}>{chapters[chapter].title}</Text>
          <ChevronDown size={14} color={palette.ink} />
        </Pressable>
      </TopBar>
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: bottom }}>
        <Text style={{ color: palette.ink, fontSize: 22, fontWeight: '700', textAlign: 'center' }}>{poem.title}</Text>
        <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'center', marginTop: 4 }}>{`${poem.author}، ${num(poem.composed)}هـ، ${num(count)} بيتًا`}</Text>
        <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'center', marginTop: 2 }}>{poem.edition.name}</Text>
        {chapters.map((part, i) => (
          <View key={part.title} onLayout={event => { tops.current[i] = event.nativeEvent.layout.y; }} style={{ marginTop: 18 }}>
            <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 6 }}>{part.title}</Text>
            {part.verses.map(verse => (
              <View key={verse.number} accessible accessibilityLabel={`${num(verse.number)}: ${verse.first}، ${verse.second}`}
                style={{ flexDirection: 'row', gap: 10, paddingVertical: 6, borderBottomWidth: 1, borderColor: `${palette.rule}40` }}>
                <Text style={{ width: 22, color: palette.muted, fontSize: 13, paddingTop: 6, textAlign: 'right' }}>{num(verse.number)}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{verse.first}</Text>
                  <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'left' }}>{verse.second}</Text>
                </View>
              </View>
            ))}
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

export { ErrorBoundary } from '@/components/CrashScreen';
