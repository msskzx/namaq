import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { Check, ChevronDown } from 'lucide-react-native';
import { findProphet, PROPHETS, prophetName } from '@shared/quran/prophets';
import ProphetStory from '@/components/ProphetStory';
import Sheet from '@/components/Sheet';
import TabHint from '@/components/TabHint';
import TopBar from '@/components/TopBar';
import { back } from '@/lib/ways';
import { readJson, writeJson } from '@/lib/storage';
import { usePalette } from '@/lib/theme';

const PICKED = 'prophets-picked';

/** The prophets tab: one prophet's story at a time (Musa until one is picked), picked from a dropdown in the middle of the top bar (like the compare tab's). */
export default function ProphetsTab() {
  const palette = usePalette();
  const [slug, setSlug] = useState(() => findProphet(readJson<string>(PICKED) ?? '')?.slug ?? 'musa');
  const [picking, setPicking] = useState(false);
  const prophet = findProphet(slug);
  const name = prophet ? prophetName(prophet) : '';
  const pick = (next: string) => {
    setPicking(false);
    setSlug(next);
    writeJson(PICKED, next);
  };
  return (
    <View style={{ flex: 1 }}>
      <ProphetStory key={slug} slug={slug} inTab header={help => (
        <TopBar back={back} hideOnScroll center help={help}>
          <Pressable onPress={() => setPicking(true)} accessibilityRole="button" accessibilityLabel={`اختر نبيًّا: ${name}`}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 }}>
            <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 15 }}>{name}</Text>
            <ChevronDown size={14} color={palette.ink} />
          </Pressable>
        </TopBar>
      )} />
      <Sheet open={picking} onClose={() => setPicking(false)} palette={palette}>
        {/* All the prophets are taller than the sheet on a phone, so the list scrolls. */}
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          {PROPHETS.map(p => (
            <Pressable key={p.slug} onPress={() => pick(p.slug)} accessibilityRole="button" accessibilityState={{ selected: p.slug === slug }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, height: 48, borderRadius: 10, backgroundColor: p.slug === slug ? palette.paperDeep : 'transparent' }}>
              <Text style={{ flex: 1, color: palette.ink, fontSize: 17 }}>{prophetName(p)}</Text>
              {p.slug === slug && <Check size={18} color={palette.accent} />}
            </Pressable>
          ))}
        </ScrollView>
      </Sheet>
      <TabHint id="prophets" palette={palette} />
    </View>
  );
}

