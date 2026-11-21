import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, LightbulbOff, NotebookPen } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import BarPicker from '@/ui/BarPicker';
import TopBar from '@/ui/TopBar';
import Sheet from '@/ui/Sheet';
import { toTab } from '@/lib/ways';
import { FORGOTTEN_LABEL, NOTE_LABEL, ShelfCard, useHomeCards } from '@/components/HomeCards';
import { SavedFeedCard } from '@/components/HomeFeed';
import { usePalette, type Palette } from '@/lib/theme';
import Empty from '@/ui/Empty';

type Tab = 'saved' | 'forgotten' | 'notes';
const TABS: { tab: Tab; label: string }[] = [{ tab: 'saved', label: 'المحفوظات' }, { tab: 'forgotten', label: 'ما نسيته' }, { tab: 'notes', label: 'تأملاتي' }];

/** The open list's name with a chevron, as the prophets tab's picker; it opens a sheet with both lists. */
function Picker({ tab, onTab, palette }: { tab: Tab; onTab: (tab: Tab) => void; palette: Palette }) {
  const [open, setOpen] = useState(false);
  const name = TABS.find(item => item.tab === tab)!.label;
  return (
    <>
      <BarPicker text={name} label={`اختر القائمة: ${name}`} onPress={() => setOpen(true)} />
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
  const [tab, setTab] = useState<Tab>(params.tab === 'forgotten' || params.tab === 'notes' ? params.tab : 'saved');
  const { cards, forgottenCards, noteCards, savedItems, forgottenItems, noteItems, menus } = useHomeCards(palette);
  const shown = tab === 'saved' ? cards : tab === 'notes' ? noteCards : forgottenCards;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {/* A back button, as on the quiz pages: this page is opened from the homepage and has no tab bar. */}
      <TopBar back={() => (router.canGoBack() ? router.back() : toTab('/'))}>
        <View style={{ flex: 1, alignItems: 'center' }}><Picker tab={tab} onTab={setTab} palette={palette} /></View>
        <View style={{ width: 34 }} />
      </TopBar>
      <FlatList key={tab} data={shown} keyExtractor={card => card.id} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 16 }}
        renderItem={({ item }) => tab === 'saved' && item.kind === 'card'
          ? <SavedFeedCard id={item.id} palette={palette} />
          : tab === 'saved'
          ? <ShelfCard card={item} palette={palette} items={savedItems(item)} />
          : tab === 'notes' ? <ShelfCard note card={item} palette={palette} Icon={NotebookPen} label={NOTE_LABEL} items={noteItems(item)} />
          : <ShelfCard card={item} palette={palette} Icon={LightbulbOff} label={FORGOTTEN_LABEL} items={forgottenItems(item)} />}
        ListEmptyComponent={<Empty palette={palette} text={tab === 'saved' ? 'لا شيء محفوظ بعد. احفظ شجرة أو بطاقة مقارنة أو آية، أو أي بطاقة في الرئيسية من زر «…» فوقها، لتجدها هنا.' : tab === 'notes' ? 'لا تأملات بعد. اضغط مطولًا على آية في المصحف لتكتب تأملك.' : 'لا آيات منسية.'} />} />
      {menus}
    </View>
  );
}

