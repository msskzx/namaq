import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import type { Palette } from '@/lib/theme';

const ROW = 44;
const SHOWN = 5;

type ListProps = { value: number; onPick: (value: number) => void; max: number; min?: number; nameOf?: (n: number) => string; palette: Palette; shown?: number };

/** The scrolling list a picker drops down, opened on the current number. */
export function NumberList({ value, onPick, max, min = 1, nameOf, palette, shown = SHOWN }: ListProps) {
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const index = Math.max(0, Math.min(items.length - 1, value - min));
  return (
    <View style={{ height: ROW * Math.min(shown, items.length), borderWidth: 1, borderColor: palette.rule, borderRadius: 8, overflow: 'hidden', backgroundColor: palette.card }}>
      <FlatList data={items} keyExtractor={n => String(n)} nestedScrollEnabled keyboardShouldPersistTaps="handled"
        initialScrollIndex={Math.max(0, Math.min(index - Math.floor(shown / 2), items.length - shown))}
        getItemLayout={(_, i) => ({ length: ROW, offset: ROW * i, index: i })}
        renderItem={({ item }) => {
          const active = item === value;
          return (
            <Pressable onPress={() => onPick(item)} accessibilityRole="button" accessibilityLabel={`${num(item)} ${nameOf?.(item) ?? ''}`.trim()} accessibilityState={{ selected: active }}
              style={{ height: ROW, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, backgroundColor: active ? palette.accent : 'transparent' }}>
              <Text style={{ color: active ? palette.onAccent : palette.ink, fontSize: 16, minWidth: 28 }}>{num(item)}</Text>
              <Text numberOfLines={1} style={{ flex: 1, color: active ? palette.onAccent : palette.muted, fontSize: 15, textAlign: 'right' }}>{nameOf?.(item) ?? ''}</Text>
            </Pressable>
          );
        }} />
    </View>
  );
}

/**
 * A number chosen from a list that drops down under the field, so the keyboard never opens.
 * Each row can carry what the number means (a surah's name, where a juz starts).
 * With `open` and `onOpen` the parent holds the open state and draws the list itself (full width, under a pair of pickers).
 */
export default function NumberPicker({ value, onChange, max, min = 1, label, nameOf, palette, open: shownOpen, onOpen }: {
  value: number; onChange: (value: number) => void; max: number; min?: number; label: string;
  nameOf?: (n: number) => string; palette: Palette; open?: boolean; onOpen?: (open: boolean) => void;
}) {
  const [ownOpen, setOwnOpen] = useState(false);
  const controlled = onOpen !== undefined;
  const open = controlled ? !!shownOpen : ownOpen;
  const setOpen = controlled ? onOpen : setOwnOpen;
  const Chevron = open ? ChevronUp : ChevronDown;
  const name = nameOf?.(value);
  return (
    <View style={{ flex: 1, gap: 4 }}>
      <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityLabel={`${label} ${num(value)}${name ? ` ${name}` : ''}`} accessibilityState={{ expanded: open }}
        style={{ height: 44, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: open ? palette.accent : palette.rule, borderRadius: 8, paddingHorizontal: 10 }}>
        <Text style={{ color: palette.ink, fontSize: 16, fontWeight: '600' }}>{num(value)}</Text>
        <Text numberOfLines={1} style={{ flex: 1, color: palette.muted, fontSize: 13, textAlign: 'right' }}>{name ?? ''}</Text>
        <Chevron size={18} color={palette.muted} />
      </Pressable>
      {open && !controlled && <NumberList value={value} onPick={item => { onChange(item); setOpen(false); }} max={max} min={min} nameOf={nameOf} palette={palette} />}
    </View>
  );
}
