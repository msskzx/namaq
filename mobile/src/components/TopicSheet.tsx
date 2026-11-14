import { Pressable, ScrollView, View } from 'react-native';
import { List } from 'lucide-react-native';
import { Text } from '@/components/Text';
import ExternalLink from '@/components/ExternalLink';
import { num } from '@shared/quran/arabicNumber';
import { sectionStart, surahTopicsCredit, surahTopicsOf, type TopicSection } from '@shared/quran/surahTopics';
import { citeLabel, citeUrl } from '@shared/quran/surahOrder';
import { surahAim } from '@shared/quran/surahAims';
import { surahNames } from '@/lib/branches';
import type { Palette } from '@/lib/theme';
import Sheet from './Sheet';

export type TopicOpen = { surah: number; section: number };

const range = (s: TopicSection) => (s.from === undefined ? '' : s.from === s.to ? num(s.from) : `${num(s.from)}–${num(s.to!)}`);

/**
 * A surah's topics (docs/plans/surah-topics.md): al-Biqa'i's aim of the surah in his words, then the sections the Sharjah
 * topical tafsir divides it into, the one tapped in the accent colour. A row opens its first ayah.
 */
export default function TopicSheet({ open, onClose, onJump, palette }: { open: TopicOpen | null; onClose: () => void; onJump: (surah: number, ayah: number) => void; palette: Palette }) {
  const topics = open ? surahTopicsOf(open.surah) : null;
  const aim = open ? surahAim(open.surah) : undefined;
  const row = (section: TopicSection, id: string, label: string, on: boolean, depth: number) => (
    <Pressable key={id} disabled={sectionStart(section) === undefined} onPress={() => { onClose(); onJump(open!.surah, sectionStart(section)!); }} accessibilityRole="button"
      style={{ flexDirection: 'row', gap: 12, paddingVertical: depth ? 5 : 8, paddingRight: depth * 18 }}>
      <Text style={{ flex: 1, textAlign: 'right', fontSize: depth ? 15 : 17, lineHeight: depth ? 24 : 28, color: on ? palette.accent : depth ? palette.muted : palette.ink }}>{label}</Text>
      <Text style={{ fontSize: depth ? 14 : 16, lineHeight: depth ? 24 : 28, color: on ? palette.accent : palette.muted }}>{range(section)}</Text>
    </Pressable>
  );
  const rows = (list: TopicSection[], depth: number, prefix: string): React.ReactNode[] => list.flatMap((section, i) => [
    row(section, `${prefix}${i}`, depth ? section.title : `${num(i + 1)}. ${section.title}`, !depth && open?.section === i, depth),
    ...rows(section.parts ?? [], depth + 1, `${prefix}${i}.`),
  ]);
  return (
    <Sheet open={!!topics} onClose={onClose} palette={palette}>
      {open && topics && <View style={{ flexShrink: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 8 }}>
          <List size={20} color={palette.muted} />
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>{`موضوعات سورة ${surahNames[open.surah] ?? num(open.surah)}`}</Text>
        </View>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 4 }}>
          {aim && (
            <View style={{ paddingBottom: 10, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: palette.rule, gap: 2 }}>
              <Text selectable style={{ fontSize: 17, lineHeight: 30, textAlign: 'right', color: palette.ink }}>{aim.text}</Text>
              <ExternalLink url={citeUrl(aim.src)} color={palette.muted} style={{ textAlign: 'right', fontSize: 13 }}>{citeLabel(aim.src, num)}</ExternalLink>
            </View>
          )}
          {rows(topics.sections, 0, '')}
        </ScrollView>
        <Text style={{ marginHorizontal: 18, marginTop: 8, marginBottom: 10, textAlign: 'right', fontSize: 13, lineHeight: 22, color: palette.muted }}>{surahTopicsCredit(topics)}</Text>
      </View>}
    </Sheet>
  );
}
