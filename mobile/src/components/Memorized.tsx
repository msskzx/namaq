import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ScrollView, View } from 'react-native';
import { BookOpenCheck, Check, X } from 'lucide-react-native';
import { memorizedPrefer, memorizedQuestions, readMemorized, readMemorizedAsked, setMemorizedAsked, subscribeMemorized, subscribeMemorizedAsked, writeMemorized, type Memorized } from '@shared/memorized';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Toggle from '@/ui/Toggle';
import Sheet from '@/ui/Sheet';
import { surahNames } from '@/lib/branches';
import { type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import { Tap } from '@/ui/Tap';
import Card from '@/ui/Card';
import SettingRow from '@/ui/SettingRow';

const useMemorized = () => useSyncExternalStore(subscribeMemorized, readMemorized);

let picking = 0;
const pickingListeners = new Set<() => void>();
const subscribePicking = (listener: () => void) => { pickingListeners.add(listener); return () => { pickingListeners.delete(listener); }; };
const isPicking = () => picking > 0;
const setPicking = (change: number) => { picking += change; pickingListeners.forEach(listener => listener()); };

export function useSettledMemorized() {
  const memorized = useMemorized();
  const open = useSyncExternalStore(subscribePicking, isPicking);
  const [settled, setSettled] = useState(memorized);
  if (!open && settled !== memorized) setSettled(memorized);
  return open ? settled : memorized;
}

export function memorizedLabel(memorized: Memorized | null) {
  if (!memorized) return 'لم تختر بعد';
  if ('all' in memorized) return 'القرآن كله';
  const names = memorized.unit === 'juz' ? memorized.picked.map(num) : memorized.picked.map(n => surahNames[n] ?? num(n));
  return `${memorized.unit === 'juz' ? 'الأجزاء' : 'السور'} ${names.join('، ')}`;
}

export function MemorizedPicker({ palette }: { palette: Palette }) {
  const memorized = useMemorized();
  useEffect(() => { setPicking(1); return () => setPicking(-1); }, []);
  const [unit, setUnit] = useState<'juz' | 'surah'>(() => (memorized && 'unit' in memorized ? memorized.unit : 'juz'));
  const last = useRef(memorized && 'unit' in memorized ? memorized : null);
  useEffect(() => { if (memorized && 'unit' in memorized) { last.current = memorized; setUnit(memorized.unit); } }, [memorized]);
  const all = !!memorized && 'all' in memorized;
  const picked = memorized && 'unit' in memorized && memorized.unit === unit ? memorized.picked : [];
  const toggle = (n: number) => {
    const next = picked.includes(n) ? picked.filter(p => p !== n) : [...picked, n];
    writeMemorized(next.length ? { unit, picked: next } : null);
    setMemorizedAsked();
  };
  const cell = (on: boolean) => ({ borderWidth: 1, borderColor: on ? palette.accent : palette.rule, backgroundColor: on ? palette.accent : 'transparent' });
  return (
    <View style={{ gap: 10 }}>
      <Toggle on={all} onChange={on => { writeMemorized(on ? { all: true } : last.current); setMemorizedAsked(); }} label="القرآن كله" palette={palette} />
      {!all && <>
        <View accessibilityRole="radiogroup" accessibilityLabel="أختار" style={{ flexDirection: 'row', borderWidth: 1, borderColor: palette.rule, borderRadius: 10, padding: 2, gap: 2 }}>
          {(['juz', 'surah'] as const).map(value => {
            const on = unit === value;
            return (
              <Tap key={value} onPress={() => setUnit(value)} accessibilityRole="radio" accessibilityState={{ checked: on }}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 8, backgroundColor: on ? palette.accent : 'transparent' }}>
                <Text style={{ color: on ? palette.onAccent : palette.ink, fontSize: 15 }}>{value === 'juz' ? 'الأجزاء' : 'السور'}</Text>
              </Tap>
            );
          })}
        </View>
        {unit === 'juz' ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map(n => {
              const on = picked.includes(n);
              return (
                <Tap key={n} onPress={() => toggle(n)} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={`الجزء ${num(n)}`}
                  style={{ width: '14.5%', height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', ...cell(on) }}>
                  <Text style={{ color: on ? palette.onAccent : palette.ink, fontSize: 17 }}>{num(n)}</Text>
                </Tap>
              );
            })}
          </View>
        ) : (
          <ScrollView nestedScrollEnabled style={{ height: 280, borderWidth: 1, borderColor: palette.rule, borderRadius: 10 }}>
            {Array.from({ length: 114 }, (_, i) => i + 1).map(n => {
              const on = picked.includes(n);
              return (
                <Tap key={n} onPress={() => toggle(n)} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={surahNames[n]}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: palette.paperDeep }}>
                  <Text style={{ width: 30, color: palette.muted, fontSize: 13, textAlign: 'center' }}>{num(n)}</Text>
                  <Text style={{ flex: 1, color: palette.ink, fontSize: 16, textAlign: 'right' }}>{surahNames[n]}</Text>
                  <View style={{ width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center', ...cell(on) }}>
                    {on && <Check size={16} color={palette.onAccent} />}
                  </View>
                </Tap>
              );
            })}
          </ScrollView>
        )}
      </>}
      <Text style={{ color: palette.muted, fontSize: 13 }}>لا يُعرض هذا لأحد، ولا يُحسب منه شيء.</Text>
    </View>
  );
}

export function MemorizedSetting({ palette }: { palette: Palette }) {
  const memorized = useMemorized();
  const questions = useSyncExternalStore(memorizedQuestions.subscribe, memorizedQuestions.read);
  const prefer = useSyncExternalStore(memorizedPrefer.subscribe, memorizedPrefer.read);
  return (
    <View style={{ gap: 6 }}>
      <SettingRow Icon={BookOpenCheck} title="ما أحفظه" value={memorizedLabel(memorized)} palette={palette}>
        <MemorizedPicker palette={palette} />
      </SettingRow>
      <Toggle on={questions} onChange={memorizedQuestions.write} label="الأسئلة مما أحفظ فقط" palette={palette} />
      <Toggle on={prefer} onChange={memorizedPrefer.write} label="قدّم ما أحفظه في التأمل" palette={palette} />
    </View>
  );
}

export function MemorizedPrompt({ palette }: { palette: Palette }) {
  const memorized = useMemorized();
  const asked = useSyncExternalStore(subscribeMemorizedAsked, readMemorizedAsked);
  const [picking, setPicking] = useState(false);
  if ((asked || memorized) && !picking) return null;
  return (
    <>
      <Card palette={palette} dashed pad={12} gap={8}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <BookOpenCheck size={20} color={palette.accent} />
          <Text accessibilityRole="header" style={{ flex: 1, color: palette.ink, fontSize: 17, fontWeight: '700', textAlign: 'right' }}>ما الذي تحفظه؟</Text>
          <IconButton Icon={X} label="إغلاق" onPress={setMemorizedAsked} size="small" />
        </View>
        <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 23, textAlign: 'right' }}>اختر ما تحفظه، لتأتيك الأسئلة منه، ويتقدّم في التأمل. تجده في الإعدادات أيضًا.</Text>
        <Tap onPress={() => setPicking(true)} accessibilityRole="button" accessibilityLabel="اختر ما تحفظه"
          style={({ pressed }) => ({ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, minHeight: 40, borderRadius: 10, backgroundColor: palette.accent, opacity: pressed ? 0.8 : 1 })}>
          <Check size={18} color={palette.onAccent} />
          <Text style={{ color: palette.onAccent, fontSize: 16 }}>اختر</Text>
        </Tap>
      </Card>
      <Sheet open={picking} onClose={() => { setPicking(false); setMemorizedAsked(); }} palette={palette}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text accessibilityRole="header" style={{ flex: 1, color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>ما أحفظه</Text>
            <Tap onPress={() => { setPicking(false); setMemorizedAsked(); }} accessibilityRole="button" accessibilityLabel="تم"
              style={{ paddingHorizontal: 16, minHeight: 38, justifyContent: 'center', borderRadius: 10, backgroundColor: palette.accent }}>
              <Text style={{ color: palette.onAccent, fontSize: 16 }}>تم</Text>
            </Tap>
          </View>
          <MemorizedPicker palette={palette} />
        </ScrollView>
      </Sheet>
    </>
  );
}
