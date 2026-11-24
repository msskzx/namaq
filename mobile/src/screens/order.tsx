import { useDeferredValue, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, ScrollView, View } from 'react-native';
import { ArrowDownWideNarrow, X } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { holdsTerms } from '@shared/quran/searchAll';
import Empty from '@/ui/Empty';
import { linkShows, ORDER_JUZ, orderInJuz, toggledJuz } from '@shared/quran/surahOrder';
import HelpSheet from '@/components/HelpSheet';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette } from '@/lib/theme';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import OrderTray from '@/ui/OrderTray';
import { LinkBlock, orderSurahList, SurahCard, SurahSheet } from '@/components/OrderSurah';
import { shuffle } from '@shared/quiz/random';

/** The page's own practice (owner, 2026-11-21): the shown surahs to put back in order, `start` keeping the boxes a retry keeps. */
type Practice = { key: string; choices: { value: string; labelArabic: string }[]; order: string[]; start?: string; sent?: string };


/**
 * The website's /quran/order on the phone (owner, 2026-11-13): from al-Fatiha to al-Nas, each surah's opening ayat and aim,
 * and between two surahs what joins them, all quoted from the books with their pages. Juz chips narrow the list, several at once.
 * docs/plans/quran-order-sources.md
 */
export default function OrderScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const top = useRef(0);
  // `juz` opens the list at a juz, as «رتّب السور» links it after an answer.
  const asked = Number(useLocalSearchParams<{ juz?: string }>().juz);
  const opened = ORDER_JUZ.includes(asked) ? asked : null;
  // Several juz at once (owner, 2026-11-20); none picked shows them all.
  const [juz, setJuz] = useState<readonly number[]>(opened ? [opened] : []);
  useEffect(() => { if (opened) setJuz([opened]); }, [opened]);
  const [help, setHelp] = useState(false);
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query.trim());
  // The search in the top bar keeps the surahs named, by name or number («١٨» or «18»), within the juz picked.
  const shown = useMemo(() => {
    const inJuz = orderInJuz(orderSurahList(), juz);
    if (!typed) return inJuz;
    const number = Number(typed.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660)));
    return inJuz.filter(s => (Number.isInteger(number) ? s.surah === number : holdsTerms(s.name, typed)));
  }, [juz, typed]);
  // «رتّبها بنفسك» (owner, 2026-11-21; sketch surah-order-tray/sketch-dark.png, screen 4): the surahs of the picked juz, their
  // names shuffled into a tray, to fill back into their boxes; each box once checked opens the surah's card.
  const [practice, setPractice] = useState<Practice | null>(null);
  const [card, setCard] = useState<number | null>(null);
  const begin = () => {
    const choices = shuffle(shown, Math.random).map(s => ({ value: String(s.surah), labelArabic: s.name }));
    setPractice({ key: `${juz.join(',')}:${Date.now()}`, choices, order: shown.map(s => String(s.surah)) });
  };
  useTabRetap('order', () => { if (top.current > 4) scroll.current?.scrollTo({ y: 0, animated: true }); else setJuz([]); });
  const pick = (value: number | null) => { setJuz(value === null ? [] : toggledJuz(juz, value)); scroll.current?.scrollTo({ y: 0, animated: false }); };
  const chip = (label: string, value: number | null) => <Chip key={label} label={label} on={value === null ? !juz.length : juz.includes(value)} onPress={() => pick(value)} palette={palette} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll={!practice} help={() => setHelp(true)}
        search={practice ? undefined : { value: query, onChangeText: setQuery, placeholder: 'ابحث في ترتيب السور', label: 'ابحث في ترتيب السور' }}>
        {practice
          ? <Button variant="plain" Icon={X} accessibilityLabel="أوقف الترتيب" onPress={() => setPractice(null)} />
          : !typed && shown.length > 1 && <Button Icon={ArrowDownWideNarrow} label="رتّبها بنفسك" onPress={begin} />}
      </TopBar>
      {/* Inverted in a left-to-right box, as the home shelves, so «الكل» sits on the right on every platform. */}
      <View style={{ direction: 'ltr' }}>
        <FlatList data={[null, ...ORDER_JUZ]} horizontal inverted showsHorizontalScrollIndicator={false} keyExtractor={value => String(value)}
          extraData={juz} style={{ flexGrow: 0, flexShrink: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 6 }}
          renderItem={({ item }) => chip(item === null ? 'الكل' : num(item), item)} />
      </View>
      {practice ? (
        <View style={{ flex: 1, paddingBottom: bottom }}>
          <OrderTray key={practice.key} question={practice} picked={practice.sent} start={practice.start} palette={palette} pinned
            onPick={sent => setPractice({ ...practice, sent })} onLook={setCard} onBox={setCard}
            onRetry={start => setPractice({ ...practice, key: `${practice.key}+`, start, sent: undefined })} />
          <SurahSheet surah={card} onClose={() => setCard(null)} palette={palette} />
        </View>
      ) : <>
      {/* A plain scroll, not a virtualized list (owner, 2026-11-20: the list flickered while scrolling): every card is laid out
          once, at its final size, so nothing above the reader is measured again and moves the page. */}
      <ScrollView ref={scroll} onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottom, gap: 10 }}>
        {!shown.length && <Empty text="لا سورة بهذا الاسم في ما اخترت" palette={palette} />}
        {shown.flatMap((s, i) => [
          ...(linkShows(shown, i) ? [<LinkBlock key={`link-${s.surah}`} link={s.link!} palette={palette} />] : []),
          <SurahCard key={s.surah} s={s} palette={palette} />,
        ])}
      </ScrollView>
      </>}
      <HelpSheet topic={help ? 'order' : null} onClose={() => setHelp(false)} palette={palette} />
    </View>
  );
}
