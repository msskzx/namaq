import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeftRight, BookOpen, ChevronLeft, Layers } from 'lucide-react-native';
import { Text } from '@/components/Text';
import ExternalLink from '@/components/ExternalLink';
import { num } from '@shared/quran/arabicNumber';
import { QIRAAT_SOURCE, whoReads } from '@shared/quran/qiraat';
import { qiraatOf } from '@shared/quran/qiraatData';
import { tafsirRuns, tafsirSadiCredit, tafsirSadiPage } from '@shared/quran/tafsirSadi';
import { tafsirSadiOf } from '@shared/quran/tafsirSadiData';
import { compareOfAyah, treePiecesOfAyah } from '@/lib/ayahPreview';
import { EMPTY_LIST } from '@/lib/branchList';
import { around as aroundSetting, branchView } from '@/lib/settings';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { surahNames } from '@/lib/branches';
import { surahName } from '@/lib/compare';
import { openCompare, openIntent, openTreesOf } from '@/lib/ways';
import { CARD, QURAN_FONT, type Palette } from '@/lib/theme';
import Sheet from './Sheet';
import TreeIcon from './TreeIcon';
import TreePager from './TreePager';

export type Preview = { kind: 'trees' | 'compare' | 'readings' | 'tafsir'; key: string };

/**
 * What an ayah's tree, compare or readings button shows in the reader (owner, 2026-11-13): a short preview in a sheet instead of
 * leaving the mushaf, each item opening its own page, and a last button that opens the whole page.
 */
export default function AyahPreviewSheet({ preview, onClose, palette }: { preview: Preview | null; onClose: () => void; palette: Palette }) {
  const trees = useMemo(() => (preview?.kind === 'trees' ? treePiecesOfAyah(preview.key) : []), [preview]);
  // The trees are the branches tab's own cards (owner, 2026-11-14): zoom, pan, a path lit on a tap, each card's tree/matrix
  // and surrounding switches, opening on the settings' defaults. The reader's ayah opens lit on each tree.
  const [mode] = branchView.use();
  const [around] = aroundSetting.use();
  const [treeAt, setTreeAt] = useState(0);
  const embedded = useMemo(() => ({
    open: (piece: BranchPiece) => { onClose(); openIntent({ tab: 'branches', open: piece.id }); },
    inScroll: false,
    lit: preview?.key,
  }), [preview, onClose]);
  const pairs = useMemo(() => (preview?.kind === 'compare' ? compareOfAyah(preview.key) : []), [preview]);
  const qiraat = useMemo(() => (preview?.kind === 'readings' ? qiraatOf(preview.key) : []), [preview]);
  const tafsir = useMemo(() => (preview?.kind === 'tafsir' ? tafsirSadiOf(preview.key) : null), [preview]);
  const go = (open: () => void) => { onClose(); open(); };
  const [surah, number] = (preview?.key ?? '0:0').split(':').map(Number);
  const card = { ...CARD, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card };
  return (
    <Sheet open={!!preview} onClose={onClose} palette={palette} tall={preview?.kind === 'trees'}>
      {preview && <View style={preview.kind === 'trees' ? { flex: 1 } : { flexShrink: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 8 }}>
          {preview.kind === 'trees' ? <TreeIcon size={20} color={palette.muted} /> : preview.kind === 'readings' ? <Layers size={20} color={palette.muted} />
            : preview.kind === 'tafsir' ? <BookOpen size={20} color={palette.muted} /> : <ArrowLeftRight size={20} color={palette.muted} />}
          {/* Al-Sa'di explains a run of ayat at once, so the tafsir names the whole run. */}
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>
            {`${surahNames[surah] ?? num(surah)} ${tafsir && tafsir.from !== tafsir.to ? `${num(tafsir.from)}–${num(tafsir.to)}` : num(number)}`}
          </Text>
          {trees.length > 1 && <Text style={{ marginStart: 'auto', color: palette.muted, fontSize: 14 }}>{`${num(treeAt + 1)} / ${num(trees.length)}`}</Text>}
        </View>
        {preview.kind === 'trees' && trees.length > 0 && (
          <View style={{ flex: 1 }}>
            <TreePager key={preview.key} pieces={trees} list={EMPTY_LIST} palette={palette} mode={mode} around={around} start={0} onIndex={setTreeAt} embedded={embedded} />
          </View>
        )}
        {preview.kind !== 'trees' && <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}>
          {tafsir && (
            <Text selectable style={{ color: palette.ink, fontSize: 19, lineHeight: 36, textAlign: 'right', writingDirection: 'rtl', paddingHorizontal: 2 }}>
              {tafsirRuns(tafsir.text).map((run, i) => (run.quran ? <Text key={i} style={{ fontFamily: QURAN_FONT, color: palette.accent }}>{run.text}</Text> : run.text))}
            </Text>
          )}
          {/* Each differing word: Hafs's reading first, then the others in the accent colour, each with who reads it. */}
          {qiraat.map(word => (
            <View key={word.at.join('-')} style={{ ...card, paddingHorizontal: 14 }}>
              {word.readings.map((reading, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6, borderTopWidth: i ? 1 : 0, borderTopColor: palette.rule }}>
                  <Text style={{ minWidth: 104, maxWidth: '62%', flexShrink: 1, fontFamily: QURAN_FONT, fontSize: 24, lineHeight: 44, textAlign: 'right', writingDirection: 'rtl', color: i ? palette.accent : palette.ink }}>{reading.text}</Text>
                  <Text style={{ flex: 1, fontSize: 14, lineHeight: 22, textAlign: 'right', color: palette.muted }}>{whoReads(reading, word.readings)}</Text>
                </View>
              ))}
            </View>
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
        </ScrollView>}
        {tafsir ? (
          <View style={{ marginHorizontal: 16, marginTop: 10, marginBottom: 8, minHeight: 32, justifyContent: 'center' }}>
            <ExternalLink url={tafsirSadiPage(tafsir)} color={palette.muted} style={{ textAlign: 'right', paddingVertical: 6 }}>
              {tafsirSadiCredit(tafsir)}
            </ExternalLink>
          </View>
        ) : preview.kind === 'readings' ? (
          <View style={{ marginHorizontal: 16, marginTop: 10, marginBottom: 8, minHeight: 32, justifyContent: 'center' }}>
            <ExternalLink url={QIRAAT_SOURCE.url} color={palette.muted} style={{ textAlign: 'right', paddingVertical: 6 }}>{`المصدر: ${QIRAAT_SOURCE.name}`}</ExternalLink>
          </View>
        ) : <Pressable onPress={() => go(() => (preview.kind === 'trees' ? openTreesOf(preview.key) : openIntent({ tab: 'compare', lead: surah })))} accessibilityRole="button"
          style={{ marginHorizontal: 16, marginTop: 10, marginBottom: 8, minHeight: 48, borderRadius: 10, borderWidth: 1, borderColor: palette.rule, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {preview.kind === 'trees' ? <TreeIcon size={20} color={palette.ink} /> : <ArrowLeftRight size={20} color={palette.ink} />}
          <Text style={{ color: palette.ink, fontSize: 17 }}>{preview.kind === 'trees' ? 'افتح في المتشابهات' : `كل مقارنات ${surahName(surah)}`}</Text>
          <ChevronLeft size={18} color={palette.muted} />
        </Pressable>}
      </View>}
    </Sheet>
  );
}
