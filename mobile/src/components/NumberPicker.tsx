import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import type { Palette } from '@/lib/theme';

const ROW = 44;
const SHOWN = 5;

/**
 * A number chosen from a list that drops down under the field, so the keyboard never opens.
 * Each row can carry what the number means (a surah's name, where a juz starts).
 */
export default function NumberPicker({ value, onChange, max, min = 1, label, nameOf, palette }: {
  value: number; onChange: (value: number) => void; max: number; min?: number; label: string;
  nameOf?: (n: number) => string; palette: Palette;
}) {
  const [open, setOpen] = useState(false);
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const index = Math.max(0, Math.min(items.length - 1, value - min));
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
      {open && (
        <View style={{ height: ROW * Math.min(SHOWN, items.length), borderWidth: 1, borderColor: palette.rule, borderRadius: 8, overflow: 'hidden', backgroundColor: palette.card }}>
          <FlatList data={items} keyExtractor={n => String(n)} nestedScrollEnabled keyboardShouldPersistTaps="handled"
            initialScrollIndex={Math.max(0, Math.min(index - 2, items.length - SHOWN))}
            getItemLayout={(_, i) => ({ length: ROW, offset: ROW * i, index: i })}
            renderItem={({ item }) => {
              const active = item === value;
              return (
                <Pressable onPress={() => { onChange(item); setOpen(false); }} accessibilityRole="button" accessibilityLabel={`${num(item)} ${nameOf?.(item) ?? ''}`.trim()} accessibilityState={{ selected: active }}
                  style={{ height: ROW, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, backgroundColor: active ? palette.accent : 'transparent' }}>
                  <Text style={{ color: active ? palette.onAccent : palette.ink, fontSize: 16, minWidth: 28 }}>{num(item)}</Text>
                  <Text numberOfLines={1} style={{ flex: 1, color: active ? palette.onAccent : palette.muted, fontSize: 13, textAlign: 'right' }}>{nameOf?.(item) ?? ''}</Text>
                </Pressable>
              );
            }} />
        </View>
      )}
    </View>
  );
}
