import { useRef, useState, type ComponentRef } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { newVisit } from '@shared/feedSeen';
import { Text } from '@/components/Text';
import { router, type Href } from 'expo-router';
import { Bookmark, ChevronLeft, EyeOff, Feather, Library, Users, type LucideProps } from 'lucide-react-native';
import TopBar from '@/components/TopBar';
import { useTabBarSpace } from '@/components/tabBarSpace';
import Button, { Row } from '@/components/Button';
import Tour from '@/components/Tour';
import { ContinueReading, Divider, Feed, PrayerRow, Stories } from '@/components/HomeFeed';
import { MemorizedPrompt } from '@/components/Memorized';
import { Shelf, ShelfCard, useHomeCards } from '@/components/HomeCards';
import { openIntent as go, toTab } from '@/lib/ways';
import { useShrinkOnScroll } from '@/lib/chrome';
import { tourSeen } from '@/lib/settings';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette, type Palette, CARD } from '@/lib/theme';

/** A home shelf shows the latest few cards; «عرض الكل» opens the full list. */
const SHELF = 5;

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

function SeeAll({ tab }: { tab: 'saved' | 'forgotten' | 'notes' }) {
  return <Button Icon={ChevronLeft} accessibilityLabel="عرض الكل" onPress={() => router.push({ pathname: '/library', params: { tab } })} />;
}

/**
 * Home (owner, 2026-11-13): reading and learning first, like a social app's home. Story circles, the page the mushaf was left on,
 * then a feed of things to reflect on that loads more on request; the tools (prayer times, saved cards, quizzes) come below.
 * Nothing about the reader is counted or shown.
 */
export default function HomeScreen() {
  const palette = usePalette();
  const { cards, savedMenu, menus } = useHomeCards(palette);
  const hasTrees = cards.some(card => card.kind === 'tree' && card.open);
  const push = (href: Href) => router.push(href);
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const [seen, setSeen] = tourSeen.use();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  // Pulled down at the top, as in a social app: a new visit, so the feed shows what was not seen yet.
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { setRefreshing(true); newVisit(); setTimeout(() => setRefreshing(false), 400); };
  // The home button tapped again: back to the top.
  useTabRetap('index', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar settings search={() => toTab('/search')} hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={palette.accent} colors={[palette.accent]} progressBackgroundColor={palette.card} />}
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 20 }}>
        <Stories palette={palette} />
        <ContinueReading palette={palette} />
        <MemorizedPrompt palette={palette} />
        <Feed palette={palette} />

        <Divider label="أدوات" palette={palette} />
        <PrayerRow palette={palette} />

        <View style={{ gap: 10 }}>
          <Heading Icon={Bookmark} title="المحفوظات" palette={palette}>
            <Row>
              {hasTrees && <Button Icon={Library} accessibilityLabel="افتح المحفوظات" onPress={() => go({ tab: 'branches', saved: true })} />}
              {cards.length > SHELF && <SeeAll tab="saved" />}
            </Row>
          </Heading>
          {cards.length ? (
            <Shelf cards={cards.slice(0, SHELF)} render={card => <ShelfCard card={card} palette={palette} onPress={at => savedMenu(card, at)} />} />
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: palette.muted, fontSize: 15 }}>احفظ شجرة أو بطاقة مقارنة أو آية بزر</Text>
              <Bookmark size={18} color={palette.muted} accessibilityLabel="الحفظ" />
              <Text style={{ color: palette.muted, fontSize: 15 }}>لتجدها هنا.</Text>
            </View>
          )}
        </View>

        <View style={{ gap: 12, padding: 12, borderWidth: 1, borderColor: palette.rule, ...CARD, backgroundColor: palette.card }}>
          <Heading Icon={Feather} title="اختبارات القرآن" palette={palette} />
          <Row>
            <Button grow Icon={Feather} label="بمفردك" onPress={() => push('/quiz/solo')} />
            <Button grow Icon={Users} label="مع غيرك" onPress={() => push('/quiz/party')} />
            <Button grow Icon={EyeOff} label="تسميع" onPress={() => go({ tab: 'read', recite: true })} />
          </Row>
        </View>
      </ScrollView>
      {menus}
      {!seen && <Tour palette={palette} onDone={() => setSeen(true)} />}
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
