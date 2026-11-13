import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { FlatList, Pressable, Share, View } from 'react-native';
import { BookOpen, Send } from 'lucide-react-native';
import data from '@shared/data/quran/oaths.json';
import { ayahHref } from '@shared/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { buildOaths, oathPlace, oathShareText, oathsWith, type OathKind, type OathView } from '@shared/quran/oaths';
import { Text } from '@/components/Text';
import HelpSheet from '@/components/HelpSheet';
import TopBar from '@/components/TopBar';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { WEBSITE } from '@/lib/branches';
import { useShrinkOnScroll } from '@/lib/chrome';
import { readAyah } from '@/lib/openReader';
import { useTabRetap } from '@/lib/tabRetap';
import { toQuranHub } from '@/lib/ways';
import { CARD, QURAN_FONT, usePalette, type Palette } from '@/lib/theme';

const KINDS: { kind: OathKind; label: string }[] = [{ kind: 'allah', label: 'أقسم الله' }, { kind: 'others', label: 'أقسم غيره' }];
const BUILT = { allah: buildOaths('allah', data), others: buildOaths('others', data) };

function shareOath(oath: OathView) {
  void Share.share({ message: `${mushafText(oathShareText(oath, num))}\n${WEBSITE}${ayahHref(oath.id)}` });
}

function OathCard({ oath, palette }: { oath: OathView; palette: Palette }) {
  const place = oathPlace(oath, num);
  return (
    <View style={{ ...CARD, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 4 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 10 }}>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{place}</Text>
        {oath.who && <Text style={{ color: palette.green, fontSize: 13 }}>{oath.who}</Text>}
      </View>
      <Text style={{ fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 42, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
        {oath.lines.map(line => [
          ...line.words.map((word, i) => <Text key={`${line.ayah}-${i}`} style={{ fontFamily: QURAN_FONT, color: word.sworn ? palette.accent : palette.ink }}>{`${mushafText(word.text)} `}</Text>),
          <Text key={`${line.ayah}-n`} style={{ fontFamily: QURAN_FONT, color: palette.amber }}>{`${num(line.ayah)} `}</Text>,
        ])}
      </Text>
      {/* Card actions on the right (owner): the mushaf, then share last. */}
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <Pressable onPress={() => readAyah(oath.id)} accessibilityRole="button" accessibilityLabel={`افتح ${place} في المصحف`} hitSlop={6} style={{ padding: 8 }}>
          <BookOpen size={19} color={palette.muted} />
        </Pressable>
        <Pressable onPress={() => shareOath(oath)} accessibilityRole="button" accessibilityLabel={`شارك ${place}`} hitSlop={6} style={{ padding: 8 }}>
          <Send size={19} color={palette.muted} />
        </Pressable>
      </View>
    </View>
  );
}

/**
 * The website's /quran/oaths on the phone (owner, 2026-11-13): every oath in the Quran, Allah's or those it quotes from others,
 * in mushaf order with the words sworn by in colour. A chip keeps only the oaths sworn by its word. docs/plans/quran-oaths-full.md
 */
export default function OathsScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const list = useRef<ComponentRef<typeof FlatList<OathView>>>(null);
  const top = useRef(0);
  const [kind, setKind] = useState<OathKind>('allah');
  const [word, setWord] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { oaths, chips } = BUILT[kind];
  const shown = useMemo(() => oathsWith(oaths, word), [oaths, word]);
  useTabRetap('oaths', () => { if (top.current > 4) list.current?.scrollToOffset({ offset: 0, animated: true }); else setWord(null); });
  const pick = (next: OathKind) => { setKind(next); setWord(null); list.current?.scrollToOffset({ offset: 0, animated: false }); };
  const chip = (label: string, value: string | null) => {
    const on = word === value;
    return (
      <Pressable key={label} onPress={() => setWord(value)} accessibilityRole="button" accessibilityState={{ selected: on }}
        style={{ paddingHorizontal: 14, height: 34, justifyContent: 'center', borderRadius: 999, borderWidth: 1, borderColor: on ? palette.accent : palette.rule, backgroundColor: on ? palette.accent : 'transparent' }}>
        <Text style={{ fontSize: 16, color: on ? palette.onAccent : palette.ink }}>{label}</Text>
      </Pressable>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={toQuranHub} hideOnScroll help={() => setHelp(true)} />
      <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 10 }}>
        <View accessibilityRole="tablist" style={{ flexDirection: 'row', padding: 3, borderRadius: 12, backgroundColor: palette.paperDeep }}>
          {KINDS.map(option => {
            const on = option.kind === kind;
            return (
              <Pressable key={option.kind} onPress={() => pick(option.kind)} accessibilityRole="tab" accessibilityState={{ selected: on }}
                style={{ flex: 1, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: on ? palette.accent : 'transparent' }}>
                <Text style={{ fontSize: 16, color: on ? palette.onAccent : palette.muted }}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      {/* Inverted in a left-to-right box, as the home shelves, so «الكل» sits on the right on every platform. */}
      <View style={{ direction: 'ltr' }}>
        <FlatList data={[null, ...chips.map(c => c.word)]} horizontal inverted showsHorizontalScrollIndicator={false} keyExtractor={value => value ?? ''}
          style={{ flexGrow: 0, flexShrink: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 6 }}
          renderItem={({ item }) => chip(item ?? 'الكل', item)} />
      </View>
      <FlatList ref={list} data={shown} keyExtractor={oath => oath.id} onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottom, gap: 10 }}
        renderItem={({ item }) => <OathCard oath={item} palette={palette} />} />
      <HelpSheet topic={help ? 'oaths' : null} onClose={() => setHelp(false)} palette={palette} />
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
