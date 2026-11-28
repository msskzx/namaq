import { useMemo, useState, useSyncExternalStore } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Check, ChevronDown, ChevronLeft, CircleCheck, CirclePause, Download, Mic, Play, RotateCw, Trash2 } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Sheet from '@/ui/Sheet';
import SourceLine from '@/ui/SourceLine';
import { Group } from './FilterFields';
import { num } from '@shared/quran/arabicNumber';
import { ayatOf, EACH_AYAH, LISTEN_REFERENCE, PAUSES, RANGE_TIMES, RECITERS, RIWAYA, SPEEDS, pauseLabel, reciterName, sizeLabel, speedLabel, surahEnd, timesLabel, type Range, type RepeatPlan } from '@shared/quran/recitation';
import { packBytes } from '@shared/quran/recitationSizes';
import { isMemorized, readMemorized, serverMemorized, subscribeMemorized } from '@shared/memorized';
import { applyReciter, applySpeed, listen, useListening } from '@/lib/listen';
import { bytesOf, downloadPack, packsOf, progressOf, removePack, removeReciter, stopDownload, useListenFiles, type PackKind } from '@/lib/listenFiles';
import { readListenPlan, readReciter, serverListenPlan, serverReciter, subscribeListenPlan, subscribeReciter, writeListenPlan, writeReciter } from '@shared/listenSettings';
import { ayahCounts } from '@/lib/mushaf';
import type { Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import { surahName } from '@shared/quran/surahNames';
import Chip from '@/ui/Chip';


const ALL: Range = { from: '1:1', to: '114:6' };

function RangeEnd({ value, onPick, palette, label }: { value: string; onPick: (key: string) => void; palette: Palette; label: string }) {
  const [open, setOpen] = useState(false);
  const [surah, ayah] = value.split(':').map(Number);
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityLabel={`${label}: ${surahName(surah)} ${num(ayah)}`} accessibilityState={{ expanded: open }}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 40, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card }}>
        <Text style={{ color: palette.ink, fontSize: 15 }}>{`${surahName(surah)} ${num(ayah)}`}</Text>
        <ChevronDown size={16} color={palette.muted} style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }} />
      </Pressable>
      {open && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, flexDirection: 'row-reverse' }}>
          {Array.from({ length: ayahCounts.get(surah) ?? 0 }, (_, i) => i + 1).map(n => (
            <Pressable key={n} onPress={() => { onPick(`${surah}:${n}`); setOpen(false); }} accessibilityRole="button" accessibilityState={{ selected: n === ayah }}
              style={{ minWidth: 36, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, backgroundColor: n === ayah ? palette.accent : 'transparent', borderWidth: 1, borderColor: n === ayah ? palette.accent : palette.rule }}>
              <Text style={{ color: n === ayah ? palette.onAccent : palette.ink, fontSize: 14 }}>{num(n)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function PackRow({ reciter, kind, title, detail, keys, bytes, palette }: { reciter: number; kind: PackKind; title: string; detail: string; keys: string[]; bytes: number; palette: Palette }) {
  const progress = progressOf(reciter, kind);
  const have = packsOf(reciter).some(pack => pack.kind === kind);
  const going = !!progress && !progress.failed;
  const Icon = going ? CirclePause : progress?.failed ? RotateCw : have ? CircleCheck : Download;
  const label = going ? `أوقف تنزيل ${title}` : progress?.failed ? `أعد تنزيل ${title}` : have ? `${title}: على الهاتف، احذفه` : `نزّل ${title}`;
  const press = () => (going ? stopDownload(reciter, kind) : have && !progress ? removePack(reciter, kind) : downloadPack(reciter, kind, title, keys));
  return (
    <Pressable onPress={press} accessibilityRole="button" accessibilityLabel={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 12 }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: palette.ink, fontSize: 15, textAlign: 'right' }}>{title}</Text>
        <Text style={{ color: palette.muted, fontSize: 12, textAlign: 'right' }}>{`${detail} · ${progress?.failed ? 'تعذّر التنزيل' : (have ? '' : 'نحو ') + sizeLabel(bytes)}`}</Text>
        {going && (
          <View style={{ height: 3, borderRadius: 2, backgroundColor: palette.rule, overflow: 'hidden', marginTop: 4 }}>
            <View style={{ width: `${Math.round((progress.done / Math.max(1, progress.total)) * 100)}%`, height: 3, backgroundColor: palette.accent }} />
          </View>
        )}
      </View>
      <Icon size={22} color={have && !progress ? palette.accent : palette.muted} />
    </Pressable>
  );
}

export default function ListenSheet({ open, start, onClose, palette }: { open: boolean; start: string | null; onClose: () => void; palette: Palette }) {
  const listening = useListening();
  const plan = useSyncExternalStore(subscribeListenPlan, readListenPlan, serverListenPlan);
  const reciter = useSyncExternalStore(subscribeReciter, readReciter, serverReciter);
  const [view, setView] = useState<'repeat' | 'reciters'>('repeat');
  const [picked, setPicked] = useState<Range | null>(null);
  useListenFiles();
  const memorized = useSyncExternalStore(subscribeMemorized, readMemorized, serverMemorized);
  const base = listening?.range ?? (start ? { from: start, to: surahEnd(start, ayahCounts) } : null);
  const range = picked ?? base;
  const close = () => { setView('repeat'); setPicked(null); onClose(); };
  const change = (next: Partial<RepeatPlan>) => { writeListenPlan({ ...plan, ...next }); if (next.speed) applySpeed(); };
  const surah = Number((range?.from ?? start ?? '1:1').split(':')[0]);
  const memorizedKeys = useMemo(() => (memorized && !('all' in memorized) ? ayatOf(ALL, ayahCounts).filter(key => isMemorized(key, memorized)) : []), [memorized]);
  const allKeys = useMemo(() => (view === 'reciters' ? ayatOf(ALL, ayahCounts) : []), [view]);

  return (
    <Sheet open={open} onClose={close} palette={palette}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, gap: 14 }}>
        {view === 'repeat' ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, color: palette.ink, fontSize: 18, textAlign: 'right' }}>الاستماع</Text>
              {range && (
                <IconButton Icon={Play} label="استمع إلى المقطع" onPress={() => { listen(range.from, range.to); close(); }} round />
              )}
            </View>
            {range && (
              <View style={{ gap: 8 }}>
                <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>المقطع</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <RangeEnd label="من" value={range.from} palette={palette} onPick={from => setPicked({ from, to: Number(range.to.split(':')[0]) === Number(from.split(':')[0]) ? range.to : surahEnd(from, ayahCounts) })} />
                  <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 40 }}>إلى</Text>
                  <RangeEnd label="إلى" value={range.to} palette={palette} onPick={to => setPicked({ ...range, to })} />
                </View>
              </View>
            )}
            <Group title="كرّر كل آية" palette={palette}>
              {EACH_AYAH.map(n => <Chip check key={n} label={timesLabel(n)} on={plan.eachAyah === n} onPress={() => change({ eachAyah: n })} palette={palette} />)}
            </Group>
            <Group title="ثم كرّر المقطع كله" palette={palette}>
              {RANGE_TIMES.map(n => <Chip check key={n} label={timesLabel(n)} on={plan.rangeTimes === n} onPress={() => change({ rangeTimes: n })} palette={palette} />)}
            </Group>
            <Group title="مهلة بعد كل آية لتردّدها" palette={palette}>
              {PAUSES.map(pause => <Chip check key={String(pause)} label={pauseLabel(pause)} on={plan.pause === pause} onPress={() => change({ pause })} palette={palette} />)}
            </Group>
            <Group title="السرعة" palette={palette}>
              {SPEEDS.map(speed => <Chip check key={speed} label={speedLabel(speed)} on={plan.speed === speed} onPress={() => change({ speed })} palette={palette} />)}
            </Group>
            <View style={{ height: 1, backgroundColor: palette.glassEdge }} />
            <Pressable onPress={() => setView('reciters')} accessibilityRole="button" accessibilityLabel="القارئ والتنزيل" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 }}>
              <Mic size={20} color={palette.muted} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{reciterName(RECITERS.find(r => r.id === reciter) ?? RECITERS[0])}</Text>
                <Text style={{ color: palette.muted, fontSize: 12, textAlign: 'right' }}>{RIWAYA}</Text>
              </View>
              <ChevronLeft size={20} color={palette.muted} />
            </Pressable>
          </>
        ) : (
          <>
            <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>القارئ</Text>
            {RECITERS.map(item => {
              const chosen = item.id === reciter;
              const held = bytesOf(item.id);
              return (
                <View key={item.id}>
                  <Pressable onPress={() => { writeReciter(item.id); applyReciter(item.id); }} accessibilityRole="radio" accessibilityState={{ checked: chosen }}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
                    <View style={{ width: 20 }}>{chosen && <Check size={20} color={palette.accent} />}</View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{reciterName(item)}</Text>
                      <Text style={{ color: palette.muted, fontSize: 12, textAlign: 'right' }}>{held ? `${RIWAYA} · على الهاتف ${sizeLabel(held)}` : RIWAYA}</Text>
                    </View>
                  </Pressable>
                  {chosen && (
                    <View style={{ marginTop: 4, marginBottom: 6, borderRadius: 14, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card, paddingVertical: 4 }}>
                      {memorizedKeys.length > 0 && (
                        <PackRow reciter={item.id} kind="memorized" title="ما أحفظه" detail="من إعداد «ما أحفظه»" keys={memorizedKeys} bytes={packBytes(item.id, { memorized })} palette={palette} />
                      )}
                      <PackRow reciter={item.id} kind={`surah:${surah}`} title={`سورة ${surahName(surah)}`} detail={`${num(ayahCounts.get(surah) ?? 0)} آية`} keys={ayatOf({ from: `${surah}:1`, to: surahEnd(`${surah}:1`, ayahCounts) }, ayahCounts)} bytes={packBytes(item.id, { surah })} palette={palette} />
                      <PackRow reciter={item.id} kind="all" title="المصحف كله" detail="من الفاتحة إلى الناس" keys={allKeys} bytes={packBytes(item.id, {})} palette={palette} />
                      {held > 0 && (
                        <Pressable onPress={() => removeReciter(item.id)} accessibilityRole="button" accessibilityLabel="احذف تنزيلات القارئ"
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 12 }}>
                          <Text style={{ flex: 1, color: palette.muted, fontSize: 15, textAlign: 'right' }}>احذف التنزيلات</Text>
                          <Trash2 size={20} color={palette.muted} />
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
            <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 21, textAlign: 'right' }}>
              دون تنزيل تُسمع التلاوة من الشبكة. ويبقى المنزَّل على الهاتف، ويُحدَّث من مؤسسة القرآن مرة في اليوم إذا اتصل الهاتف بالشبكة، كما تشترط.
            </Text>
            <SourceLine sources={[{ line: LISTEN_REFERENCE.title, quotes: LISTEN_REFERENCE.quotes }]} palette={palette} />
          </>
        )}
      </ScrollView>
    </Sheet>
  );
}
