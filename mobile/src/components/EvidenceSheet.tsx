import { Linking, Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { ExternalLink, Tags } from 'lucide-react-native';
import { TAGS, type Group } from '@shared/quran/mutashabih/types';
import Sheet from './Sheet';
import type { Palette } from '@/lib/theme';

const arabicDigits = (text: string) => text.replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);

/**
 * The website's details under a tree (src/app/quran/branches/GroupDetails.tsx): the kinds of difference the books name,
 * each with its example words, then each book's citation with its quote and a link to the page.
 * `group` is already cut to the ayat shown (evidenceGroup).
 */
export default function EvidenceSheet({ group, onClose, palette }: { group: Group | null; onClose: () => void; palette: Palette }) {
  return (
    <Sheet open={!!group} onClose={onClose} palette={palette}>
      {group && <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 14 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>المصادر</Text>
        {group.tags.length > 0 && <View style={{ gap: 8 }}>
          {group.tags.map(tag => {
            const example = group.examples?.[tag];
            return (
              <View key={tag} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: palette.rule, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Tags size={14} color={palette.muted} />
                  <Text style={{ color: palette.ink, fontSize: 14 }}>{TAGS[tag].ar}</Text>
                </View>
                {example ? <Text style={{ color: palette.ink, fontSize: 15, flexShrink: 1, textAlign: 'right' }}>{example}</Text> : null}
              </View>
            );
          })}
        </View>}
        {group.citations.map(citation => (
          <View key={citation.id} style={{ gap: 4, borderTopWidth: 1, borderColor: palette.rule, paddingTop: 10 }}>
            <Text style={{ color: palette.ink, fontSize: 15, fontWeight: '600', textAlign: 'right' }}>{citation.book}</Text>
            <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>
              {`${citation.edition} · `}
              <Text style={{ writingDirection: 'ltr' }}>{arabicDigits(citation.places.join(' ↔ '))}</Text>
            </Text>
            <Text style={{ color: palette.ink, fontSize: 15, lineHeight: 24, textAlign: 'right', writingDirection: 'rtl' }}>{`«${citation.quote}»`}</Text>
            <Pressable onPress={() => void Linking.openURL(citation.url)} accessibilityRole="link" accessibilityLabel={`افتح ${citation.book} ${arabicDigits(citation.locator)}`} hitSlop={6}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', opacity: pressed ? 0.6 : 1 })}>
              <ExternalLink size={14} color={palette.accent} />
              <Text style={{ color: palette.accent, fontSize: 14 }}>{arabicDigits(citation.locator)}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>}
    </Sheet>
  );
}
