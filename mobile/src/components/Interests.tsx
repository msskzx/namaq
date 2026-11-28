import RowScroll from '@/ui/RowScroll';
import { useRef, useState, useSyncExternalStore } from 'react';
import { ScrollView, View } from 'react-native';
import { Check, Pencil, Sparkles } from 'lucide-react-native';
import { newVisit } from '@shared/feedSeen';
import { INTERESTS, interestsAsked, pickedInterests, SECTIONS, surpriseMe, toggledInterest } from '@shared/interests';
import { Text } from '@/ui/Text';
import Chip from '@/ui/Chip';
import Toggle from '@/ui/Toggle';
import Sheet from '@/ui/Sheet';
import Button from '@/ui/Button';
import SettingRow from '@/ui/SettingRow';
import type { Palette } from '@/lib/theme';
import { useOnLeave } from '@/lib/hooks/useOnLeave';

export const usePicked = () => useSyncExternalStore(pickedInterests.subscribe, pickedInterests.read, pickedInterests.server);

export const interestsLabel = (picked: readonly string[]) =>
  picked.length ? INTERESTS.filter(interest => picked.includes(interest.id)).map(interest => interest.name).join('، ') : 'الكل';

export function InterestPicker({ palette }: { palette: Palette }) {
  const picked = usePicked();
  return (
    <View style={{ gap: 14 }}>
      {SECTIONS.map(section => (
        <View key={section.id} style={{ gap: 8 }}>
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{section.name}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {INTERESTS.filter(interest => interest.section === section.id).map(interest => (
              <Chip key={interest.id} label={interest.name} on={picked.includes(interest.id)} check palette={palette}
                onPress={() => pickedInterests.write(toggledInterest(picked, interest.id))} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function SurpriseToggle({ palette }: { palette: Palette }) {
  const on = useSyncExternalStore(surpriseMe.subscribe, surpriseMe.read, surpriseMe.server);
  return <Toggle on={on} onChange={value => { surpriseMe.write(value); newVisit(); }} label="فاجئني من غير اهتماماتي" palette={palette} />;
}

export function InterestsSheet({ open, onClose, palette }: { open: boolean; onClose: () => void; palette: Palette }) {
  const before = useRef('');
  if (open && !before.current) before.current = JSON.stringify(pickedInterests.read());
  const close = () => { onClose(); if (JSON.stringify(pickedInterests.read()) !== before.current) newVisit(); before.current = ''; };
  return (
    <Sheet open={open} onClose={close} palette={palette}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text accessibilityRole="header" style={{ flex: 1, color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>اهتماماتي</Text>
          <Button variant="primary" Icon={Check} label="تم" onPress={close} />
        </View>
        <InterestPicker palette={palette} />
        <SurpriseToggle palette={palette} />
      </ScrollView>
    </Sheet>
  );
}

export function InterestsSetting({ palette }: { palette: Palette }) {
  const picked = usePicked();
  const read = () => JSON.stringify(pickedInterests.read());
  const shown = useRef(read());
  const refresh = () => { if (shown.current !== read()) { shown.current = read(); newVisit(); } };
  useOnLeave(refresh);
  return (
    <View style={{ gap: 6 }}>
      <SettingRow Icon={Sparkles} title="اهتماماتي" value={interestsLabel(picked)} onFold={open => { if (open) shown.current = read(); else refresh(); }} palette={palette}>
        <InterestPicker palette={palette} />
      </SettingRow>
      <SurpriseToggle palette={palette} />
    </View>
  );
}

export function InterestsWelcome({ palette }: { palette: Palette }) {
  const asked = useSyncExternalStore(interestsAsked.subscribe, interestsAsked.read, interestsAsked.server);
  const picked = usePicked();
  const [open, setOpen] = useState(!asked);
  if (asked && !open) return null;
  const done = () => { interestsAsked.write(); setOpen(false); newVisit(); };
  return (
    <Sheet full open={open} onClose={done} title="ماذا تحب أن تتعلّم؟" palette={palette}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Text style={{ color: palette.muted, fontSize: 16, lineHeight: 26, textAlign: 'right' }}>اختر ما شئت، وتأتيك بطاقاته في الصفحة الرئيسية. تغيّرها متى شئت من الإعدادات.</Text>
        <InterestPicker palette={palette} />
        <Button big variant="primary" Icon={Check} label={picked.length ? 'ابدأ' : 'ابدأ بالكل'} onPress={done} />
      </ScrollView>
    </Sheet>
  );
}

export const onlyOf = (only: string | null, picked: readonly string[]) => (only && (!picked.length || picked.includes(only)) ? only : null);

export function InterestChips({ only, onOnly, palette }: { only: string | null; onOnly: (id: string | null) => void; palette: Palette }) {
  const picked = usePicked();
  const [editing, setEditing] = useState(false);
  const shown = INTERESTS.filter(interest => !picked.length || picked.includes(interest.id));
  return (
    <>
      <RowScroll>
        <Chip label="لك" role="radio" on={!only} onPress={() => onOnly(null)} palette={palette} />
        {shown.map(interest => <Chip key={interest.id} role="radio" label={interest.name} on={only === interest.id} onPress={() => onOnly(only === interest.id ? null : interest.id)} palette={palette} />)}
        <Chip label="" Icon={Pencil} on={false} onPress={() => setEditing(true)} accessibilityLabel="عدّل اهتماماتي" palette={palette} />
      </RowScroll>
      <InterestsSheet open={editing} onClose={() => setEditing(false)} palette={palette} />
    </>
  );
}
