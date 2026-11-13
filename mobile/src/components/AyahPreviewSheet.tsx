import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeftRight, ChevronLeft } from 'lucide-react-native';
import { Text } from '@/components/Text';
import { num } from '@shared/quran/arabicNumber';
import { compareOfAyah, treesOfAyah } from '@/lib/ayahPreview';
import { surahNames } from '@/lib/branches';
import { surahName } from '@/lib/compare';
import { openCompare, openIntent, openTreesOf } from '@/lib/ways';
import { CARD, QURAN_FONT, type Palette } from '@/lib/theme';
import BranchTree from './BranchTree';
import Sheet from './Sheet';
import TreeIcon from './TreeIcon';

export type Preview = { kind: 'trees' | 'compare'; key: string };

const noTap = () => {};

/**
 * What an ayah's tree or compare button shows in the reader (owner, 2026-11-13): a short preview in a sheet instead of
 * leaving the mushaf, each item opening its own page, and a last button that opens the whole page.
 */
export default function AyahPreviewSheet({ preview, onClose, palette }: { preview: Preview | null; onClose: () => void; palette: Palette }) {
  const trees = useMemo(() => (preview?.kind === 'trees' ? treesOfAyah(preview.key) : []), [preview]);
  const pairs = useMemo(() => (preview?.kind === 'compare' ? compareOfAyah(preview.key) : []), [preview]);
  const go = (open: () => void) => { onClose(); open(); };
  const [surah, number] = (preview?.key ?? '0:0').split(':').map(Number);
  const card = { ...CARD, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card };
  return (
    <Sheet open={!!preview} onClose={onClose} palette={palette}>
      {preview && <View style={{ flexShrink: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 8 }}>
          {preview.kind === 'trees' ? <TreeIcon size={20} color={palette.muted} /> : <ArrowLeftRight size={20} color={palette.muted} />}
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>{`${surahNames[surah] ?? num(surah)} ${num(number)}`}</Text>
        </View>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}>
          {preview.kind === 'trees' && trees.map(tree => (
            // A tap opens that tree; a wide tree scrolls sideways inside its card.
            <Pressable key={tree.piece.id} onPress={() => go(() => openIntent({ tab: 'branches', open: tree.piece.id }))} accessibilityRole="button" accessibilityLabel="افتح هذه الشجرة"
              style={{ ...card, overflow: 'hidden' }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                {/* Trees draw left to right inside, as on the branches page. */}
                <View style={{ direction: 'ltr' }} pointerEvents="none">
                  <BranchTree presentation={tree.presentation} matches={tree.matches} names={surahNames} palette={palette} onTap={noTap} direction="down" />
                </View>
              </ScrollView>
            </Pressable>
          ))}
          {preview.kind === 'compare' && pairs.map(({ target, partner, words }) => {
            const [other, at] = partner.split(':').map(Number);
            const label = target.lead === target.other ? `${surahName(target.lead)} مع نفسها` : `${surahName(target.lead)} مع ${surahName(target.other)}`;
            return (
              <Pressable key={`${target.lead}:${target.other}`} onPress={() => go(() => openCompare(target))} accessibilityRole="button" accessibilityLabel={`${label}، ${surahName(other)} ${num(at)}`}
                style={{ ...card, paddingHorizontal: 14, paddingVertical: 10, gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ flex: 1, color: palette.muted, fontSize: 14, textAlign: 'right' }}>{label}</Text>
                  <Text style={{ color: palette.muted, fontSize: 14 }}>{`${surahName(other)} ${num(at)}`}</Text>
                  <ChevronLeft size={16} color={palette.muted} />
                </View>
                <Text style={{ fontFamily: QURAN_FONT, fontSize: 20, lineHeight: 38, textAlign: 'right', writingDirection: 'rtl', color: palette.ink }}>
                  {words.map((word, i) => <Text key={i} style={{ fontFamily: QURAN_FONT, color: word.shared ? palette.accent : palette.ink }}>{`${i ? ' ' : ''}${word.text}`}</Text>)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable onPress={() => go(() => (preview.kind === 'trees' ? openTreesOf(preview.key) : openIntent({ tab: 'compare', lead: surah })))} accessibilityRole="button"
          style={{ marginHorizontal: 16, marginTop: 10, marginBottom: 8, minHeight: 48, borderRadius: 10, borderWidth: 1, borderColor: palette.rule, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {preview.kind === 'trees' ? <TreeIcon size={20} color={palette.ink} /> : <ArrowLeftRight size={20} color={palette.ink} />}
          <Text style={{ color: palette.ink, fontSize: 17 }}>{preview.kind === 'trees' ? 'افتح في المتشابهات' : `كل مقارنات ${surahName(surah)}`}</Text>
          <ChevronLeft size={18} color={palette.muted} />
        </Pressable>
      </View>}
    </Sheet>
  );
}
