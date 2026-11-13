import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronDown, LightbulbOff } from 'lucide-react-native';
import { Text } from '@/components/Text';
import BackBar from '@/components/BackBar';
import Sheet from '@/components/Sheet';
import { toTab } from '@/lib/ways';
import { FORGOTTEN_LABEL, ShelfCard, useHomeCards } from '@/components/HomeCards';
import { usePalette, type Palette } from '@/lib/theme';

type Tab = 'saved' | 'forgotten';
const TABS: { tab: Tab; label: string }[] = [{ tab: 'saved', label: 'المحفوظات' }, { tab: 'forgotten', label: 'ما نسيته' }];

/** The open list's name with a chevron, as the prophets tab's picker; it opens a sheet with both lists. */
function Picker({ tab, onTab, palette }: { tab: Tab; onTab: (tab: Tab) => void; palette: Palette }) {
  const [open, setOpen] = useState(false);
  const name = TABS.find(item => item.tab === tab)!.label;
  return (
    <>
      <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel={`اختر القائمة: ${name}`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 }}>
        <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 15 }}>{name}</Text>
        <ChevronDown size={14} color={palette.ink} />
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} palette={palette}>
        <View style={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          {TABS.map(item => (
            <Pressable key={item.tab} onPress={() => { onTab(item.tab); setOpen(false); }} accessibilityRole="button" accessibilityState={{ selected: item.tab === tab }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, height: 48, borderRadius: 10, backgroundColor: item.tab === tab ? palette.paperDeep : 'transparent' }}>
              <Text style={{ flex: 1, color: palette.ink, fontSize: 17 }}>{item.label}</Text>
              {item.tab === tab && <Check size={18} color={palette.accent} />}
            </Pressable>
          ))}
        </View>
      </Sheet>
    </>
  );
}

/** Every saved card and every forgotten ayah, one list at a time; the homepage shelves show the latest few and open this page. */
export default function LibraryScreen() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>(params.tab === 'forgotten' ? 'forgotten' : 'saved');
  const { cards, forgottenCards, savedMenu, forgottenMenu, menus } = useHomeCards(palette);
  const shown = tab === 'saved' ? cards : forgottenCards;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {/* A back button, as on the quiz pages: this page is opened from the homepage and has no tab bar. */}
      <BackBar onBack={() => (router.canGoBack() ? router.back() : toTab('/'))}>
        <View style={{ flex: 1, alignItems: 'center' }}><Picker tab={tab} onTab={setTab} palette={palette} /></View>
        <View style={{ width: 40 }} />
      </BackBar>
      <FlatList key={tab} data={shown} keyExtractor={card => card.id} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 12 }}
        renderItem={({ item }) => tab === 'saved'
          ? <ShelfCard wide card={item} palette={palette} onPress={at => savedMenu(item, at)} />
          : <ShelfCard wide card={item} palette={palette} Icon={LightbulbOff} label={FORGOTTEN_LABEL} onPress={at => forgottenMenu(item, at)} />}
        ListEmptyComponent={<Text style={{ paddingVertical: 24, color: palette.muted, fontSize: 15, textAlign: 'center' }}>{tab === 'saved' ? 'لا شيء محفوظ بعد. احفظ شجرة أو بطاقة مقارنة أو آية بزر الحفظ لتجدها هنا.' : 'لا آيات منسية.'}</Text>} />
      {menus}
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
