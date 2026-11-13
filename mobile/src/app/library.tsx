import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LightbulbOff } from 'lucide-react-native';
import { Text } from '@/components/Text';
import TopBar from '@/components/TopBar';
import { FORGOTTEN_LABEL, ShelfCard, useHomeCards } from '@/components/HomeCards';
import { usePalette, type Palette } from '@/lib/theme';

type Tab = 'saved' | 'forgotten';
const TABS: { tab: Tab; label: string }[] = [{ tab: 'saved', label: 'المحفوظات' }, { tab: 'forgotten', label: 'ما نسيته' }];

/** Two words in the top bar, the open one bold and underlined, as Instagram's Following and For you. */
function Switch({ tab, onTab, palette }: { tab: Tab; onTab: (tab: Tab) => void; palette: Palette }) {
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: 24 }}>
      {TABS.map(item => {
        const on = item.tab === tab;
        return (
          <Pressable key={item.tab} onPress={() => onTab(item.tab)} accessibilityRole="tab" accessibilityState={{ selected: on }} hitSlop={8}
            style={{ paddingVertical: 6, borderBottomWidth: 2, borderColor: on ? palette.ink : 'transparent' }}>
            <Text style={{ color: on ? palette.ink : palette.muted, fontSize: 17, fontWeight: on ? '700' : '400' }}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
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
      <TopBar center>
        <Switch tab={tab} onTab={setTab} palette={palette} />
      </TopBar>
      <FlatList key={tab} data={shown} keyExtractor={card => card.id} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 12 }}
        renderItem={({ item }) => tab === 'saved'
          ? <ShelfCard wide card={item} palette={palette} onPress={at => savedMenu(item, at)} />
          : <ShelfCard wide card={item} palette={palette} Icon={LightbulbOff} label={FORGOTTEN_LABEL} onPress={at => forgottenMenu(item, at)} />}
        ListEmptyComponent={<Text style={{ paddingVertical: 24, color: palette.muted, fontSize: 15, textAlign: 'center' }}>{tab === 'saved' ? 'لا شيء محفوظ بعد.' : 'لا آيات منسية.'}</Text>} />
      {menus}
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
