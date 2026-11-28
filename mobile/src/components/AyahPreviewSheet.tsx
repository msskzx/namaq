import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeftRight, ChevronLeft, Layers } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { qiraatSources, sadiSource } from '@shared/quiz/bookSources';
import { num } from '@shared/quran/arabicNumber';
import { whoReads } from '@shared/quran/qiraat';
import { qiraatOf } from '@shared/quran/qiraatData';
import type { WordDifference } from '@shared/quran/qiraat';
import { tafsirRuns, tafsirSadiCredit } from '@shared/quran/tafsirSadi';
import { tafsirSadiOf } from '@shared/quran/tafsirSadiData';
import { bookState, useBooks } from '@/lib/books';
import { BookList } from './Books';
import { compareOfAyah, treePiecesOfAyah } from '@/lib/ayahPreview';
import { EMPTY_LIST } from '@/lib/branchList';
import { around as aroundSetting } from '@/lib/settings';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { surahNames } from '@/lib/branches';
import { surahName } from '@/lib/compare';
import { openCompare, openIntent, openTreesOf } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords, QuranWord } from './quran/text/AyahFlow';
import QuranWords from './quran/text/QuranWords';
import Sheet from '@/ui/Sheet';
import TreeIcon from './TreeIcon';
import TreePager from './TreePager';
import OpenInBook from './OpenInBook';
import Card from '@/ui/Card';
import { FEATURE_ICON } from '@/components/featureIcons';

export type Preview = { kind: 'trees' | 'compare' | 'readings' | 'tafsir'; key: string };

export default function AyahPreviewSheet({ preview, onClose, palette }: { preview: Preview | null; onClose: () => void; palette: Palette }) {
  const trees = useMemo(() => (preview?.kind === 'trees' ? treePiecesOfAyah(preview.key) : []), [preview]);
  const [around] = aroundSetting.use();
  const [treeAt, setTreeAt] = useState(0);
  const [counted, setCounted] = useState(preview);
  if (preview !== counted) { setCounted(preview); setTreeAt(0); }
  const embedded = useMemo(() => ({
    open: (piece: BranchPiece) => { onClose(); openIntent({ tab: 'branches', open: piece.id }); },
    inScroll: false,
    lit: preview?.key,
    onLeave: onClose,
  }), [preview, onClose]);
  const pairs = useMemo(() => (preview?.kind === 'compare' ? compareOfAyah(preview.key) : []), [preview]);
  const qiraat = useMemo(() => (preview?.kind === 'readings' ? qiraatOf(preview.key) : []), [preview]);
  useBooks();
  const sadi = bookState('sadi') === 'on';
  const tafsir = useMemo(() => (preview?.kind === 'tafsir' && sadi ? tafsirSadiOf(preview.key) : null), [preview, sadi]);
  const go = (open: () => void) => { onClose(); open(); };
  const [surah, number] = (preview?.key ?? '0:0').split(':').map(Number);
  return (
    <Sheet open={!!preview} onClose={onClose} palette={palette} tall={preview?.kind === 'trees'}>
      {preview && <View style={preview.kind === 'trees' ? { flex: 1 } : { flexShrink: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 8 }}>
          {preview.kind === 'trees' ? <TreeIcon size={20} color={palette.muted} /> : preview.kind === 'readings' ? <Layers size={20} color={palette.muted} />
            : preview.kind === 'tafsir' ? <FEATURE_ICON.tafsir size={20} color={palette.muted} /> : <ArrowLeftRight size={20} color={palette.muted} />}
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>
            {`${surahNames[surah] ?? num(surah)} ${tafsir && tafsir.from !== tafsir.to ? `${num(tafsir.from)}–${num(tafsir.to)}` : num(number)}`}
          </Text>
          {trees.length > 1 && <Text style={{ marginStart: 'auto', color: palette.muted, fontSize: 14 }}>{`${num(treeAt + 1)} / ${num(trees.length)}`}</Text>}
        </View>
        {preview.kind === 'trees' && trees.length > 0 && (
          <View style={{ flex: 1 }}>
            <TreePager key={preview.key} pieces={trees} list={EMPTY_LIST} palette={palette} around={around} start={0} onIndex={setTreeAt} embedded={embedded} />
          </View>
        )}
        {preview.kind !== 'trees' && <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}>
          {preview.kind === 'tafsir' && !tafsir && <>
            <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>لم تبقِ تفسيرًا على هاتفك. اختر ما تريد، ويعمل بلا اتصال.</Text>
            <BookList kind="tafsir" palette={palette} />
          </>}
          {tafsir && <SadiText text={tafsir.text} palette={palette} />}
          {qiraat.map(word => <QiraatWord key={word.at.join('-')} word={word} palette={palette} />)}
          {preview.kind === 'compare' && pairs.map(({ target, partner, words }) => {
            const [other, at] = partner.split(':').map(Number);
            const label = target.lead === target.other ? `${surahName(target.lead)} مع نفسها` : `${surahName(target.lead)} مع ${surahName(target.other)}`;
            return (
              <Card key={`${target.lead}:${target.other}`} palette={palette} pad={[10, 14]} gap={4} onPress={() => go(() => openCompare(target))} accessibilityLabel={`${label}، ${surahName(other)} ${num(at)}`}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ flex: 1, color: palette.muted, fontSize: 14, textAlign: 'right' }}>{label}</Text>
                  <Text style={{ color: palette.muted, fontSize: 14 }}>{`${surahName(other)} ${num(at)}`}</Text>
                  <ChevronLeft size={16} color={palette.muted} />
                </View>
                <AyahFlow color={palette.ink} menu={false}>
                  {words.map((word, i) => <AyahWords key={i} look={word.shared ? { color: palette.accent } : undefined}>{`${i ? ' ' : ''}${word.text}`}</AyahWords>)}
                </AyahFlow>
              </Card>
            );
          })}
        </ScrollView>}
        {tafsir ? (
          <View style={{ marginHorizontal: 4, marginTop: 6, marginBottom: 8, gap: 2 }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 12 }}><OpenInBook book="sadi" ayah={preview.key} onClose={onClose} palette={palette} /></View>
            <SourceLine sources={sourcesOf([{ ...sadiSource(tafsir), edition: tafsirSadiCredit(tafsir) }])} palette={palette} />
          </View>
        ) : preview.kind === 'tafsir' ? null : preview.kind === 'readings' ? (
          <View style={{ marginHorizontal: 4, marginTop: 6, marginBottom: 8 }}>
            <SourceLine sources={sourcesOf(qiraatSources(preview.key))} palette={palette} />
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

export function SadiText({ text, palette }: { text: string; palette: Palette }) {
  return (
    <Text selectable style={{ color: palette.ink, fontSize: 19, lineHeight: 36, textAlign: 'right', writingDirection: 'rtl', paddingHorizontal: 2 }}>
      {tafsirRuns(text).map((run, i) => (run.quran ? <QuranWords key={i} style={{ color: palette.accent }}>{run.text}</QuranWords> : run.text))}
    </Text>
  );
}

export function QiraatWord({ word, palette, bare = false, inset = 14, mark }: { word: WordDifference; palette: Palette;
  bare?: boolean; inset?: number;
  mark?: readonly number[] }) {
  const rows = word.readings.map((reading, i) => {
    const marked = !!mark?.length && reading.rawis.some(n => mark.includes(n));
    return (
      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6, borderTopWidth: i ? 1 : 0, borderTopColor: palette.rule,
        ...(marked ? { backgroundColor: `${palette.accent}1f`, paddingHorizontal: 8, marginHorizontal: -8 } : null) }}>
        <QuranWord look={{ color: i ? palette.accent : palette.ink }} place={{ minWidth: 104, maxWidth: '62%', flexShrink: 1, textAlign: 'right' }}>{reading.text}</QuranWord>
        <Text style={{ flex: 1, fontSize: 14, lineHeight: 22, textAlign: 'right', color: marked ? palette.ink : palette.muted }}>{whoReads(reading, word.readings)}</Text>
      </View>
    );
  });
  return bare ? <View style={{ paddingHorizontal: inset }}>{rows}</View> : <Card palette={palette} pad={[0, 14]}>{rows}</Card>;
}
