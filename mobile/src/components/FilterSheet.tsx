import { useEffect, useState, useSyncExternalStore } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Check, RotateCcw } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { num } from '@shared/quran/arabicNumber';
import { JUZ_STARTS } from '@shared/quran/juz';
import { SORTS, toggleFilter, type GroupFilters } from '@shared/quran/mutashabih/browse';
import { SUPPORTED_TAGS } from '@shared/quran/mutashabih/evidence';
import Sheet from './Sheet';
import Toggle from './Toggle';
import { IconButton } from './Studio';
import { surahNames } from '@/lib/branches';
import { applyDraft, draftOf, draftRange, EMPTY_LIST, UNIT_MAX, type FilterDraft, type FilterUnit, type ListState } from '@/lib/branchList';
import type { Palette } from '@/lib/theme';

const UNITS: { value: FilterUnit; label: string }[] = [
  { value: 'juz', label: 'من الجزء' },
  { value: 'surah', label: 'من السورة' },
  { value: 'page', label: 'من الصفحة' },
  { value: 'surahs', label: 'سور محددة' },
  { value: 'juzs', label: 'أجزاء محددة' },
];
const CATEGORIES: Record<string, string> = { mutashabeh: 'متشابهات', pondering: 'تدبّر', words: 'أشجار الكلمات' };
const SORT_LABELS = ['ترتيب المصحف', 'الأقرب', 'الأكثر مواضع', 'الأقل اختلافًا'];

function Chip({ label, active, onPress, palette }: { label: string; active: boolean; onPress: () => void; palette: Palette }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, height: 36, borderRadius: 18, borderWidth: 1, borderColor: active ? palette.accent : palette.rule, backgroundColor: active ? palette.accent : 'transparent' }}>
      {active && <Check size={13} color={palette.onAccent} />}
      <Text style={{ color: active ? palette.onAccent : palette.ink, fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

function Group({ title, children, palette }: { title: string; children: React.ReactNode; palette: Palette }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: palette.muted, fontSize: 14 }}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{children}</View>
    </View>
  );
}

/** What the number means: the surah's name, or where the juz starts. */
function nameOf(unit: FilterUnit, value: string) {
  const n = Number(value.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660)));
  if (!Number.isInteger(n) || n < 1 || n > UNIT_MAX[unit]) return '';
  if (unit === 'surah') return surahNames[n] ?? '';
  if (unit === 'juz') { const [surah, ayah] = JUZ_STARTS[n - 1].split(':').map(Number); return `${surahNames[surah]} ${num(ayah)}`; }
  return '';
}

function NumberField({ value, onChange, label, unit, palette }: { value: string; onChange: (value: string) => void; label: string; unit: FilterUnit; palette: Palette }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <TextInput value={value} onChangeText={onChange} keyboardType="number-pad" accessibilityLabel={label} selectTextOnFocus
        style={{ height: 44, borderWidth: 1, borderColor: palette.rule, borderRadius: 8, paddingHorizontal: 10, fontSize: 16, color: palette.ink, textAlign: 'center' }} />
      <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 12, textAlign: 'center' }}>{nameOf(unit, value)}</Text>
    </View>
  );
}

/** The website's filter sheet: saved only, the part of the Quran, the comparison kinds and differences, then the sort. */
export default function FilterSheet({ open, onClose, state, onApply, palette }: { open: boolean; onClose: () => void; state: ListState; onApply: (state: ListState) => void; palette: Palette }) {
  const [draft, setDraft] = useState<FilterDraft>(() => draftOf(state));
  useEffect(() => { if (open) setDraft(draftOf(state)); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const saved = useSyncExternalStore(subscribeBookmarks, readBookmarks).length;
  const ranged = draft.unit === 'juz' || draft.unit === 'surah' || draft.unit === 'page';
  const valid = !ranged || !!draftRange(draft);
  const setFilter = (key: keyof GroupFilters, value: string) => setDraft({ ...draft, filters: { ...draft.filters, [key]: value || undefined } });
  const categories = draft.filters.categories ?? 'mutashabeh,pondering';
  const submit = () => {
    const next = applyDraft(draft);
    if (!next) return;
    onApply(next);
    onClose();
  };
  const pickList = draft.unit === 'surahs' ? Array.from({ length: 114 }, (_, i) => ({ n: i + 1, label: `${num(i + 1)} ${surahNames[i + 1]}` }))
    : draft.unit === 'juzs' ? Array.from({ length: 30 }, (_, i) => ({ n: i + 1, label: `الجزء ${num(i + 1)}` })) : [];
  return (
    <Sheet open={open} onClose={onClose} palette={palette}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 18 }} keyboardShouldPersistTaps="handled">
        <Toggle on={draft.saved} onChange={on => setDraft({ ...draft, saved: on })} label={!draft.saved && !saved ? 'احفظ شجرة بزر الحفظ تحتها أولًا' : 'المحفوظة فقط'} palette={palette} disabled={!draft.saved && !saved} />
        <Group title="النطاق" palette={palette}>
          {UNITS.map(unit => <Chip key={unit.value} label={unit.label} active={draft.unit === unit.value} palette={palette}
            onPress={() => setDraft({ ...draft, unit: unit.value, from: '1', to: String(UNIT_MAX[unit.value]), picked: [] })} />)}
        </Group>
        {ranged && <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <NumberField value={draft.from} onChange={from => setDraft({ ...draft, from })} label="من" unit={draft.unit} palette={palette} />
          <Text style={{ color: palette.muted, lineHeight: 44 }}>إلى</Text>
          <NumberField value={draft.to} onChange={to => setDraft({ ...draft, to })} label="إلى" unit={draft.unit} palette={palette} />
        </View>}
        {ranged && !valid && <Text style={{ color: palette.accent, fontSize: 13 }}>أدخل رقمين من ١ إلى {num(UNIT_MAX[draft.unit])}، على أن تكون البداية قبل النهاية أو مساوية لها.</Text>}
        {pickList.length > 0 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {pickList.map(item => <Chip key={item.n} label={item.label} active={draft.picked.includes(item.n)} palette={palette}
            onPress={() => setDraft({ ...draft, picked: draft.picked.includes(item.n) ? draft.picked.filter(n => n !== item.n) : [...draft.picked, item.n] })} />)}
        </View>}
        <Group title="نوع المقارنة" palette={palette}>
          {Object.entries(CATEGORIES).map(([id, label]) => <Chip key={id} label={label} active={categories.split(',').includes(id)} palette={palette}
            onPress={() => setFilter('categories', toggleFilter(categories, id) || 'none')} />)}
          <Chip label="في كتب المتشابه" active={draft.filters.cited === '1'} palette={palette} onPress={() => setFilter('cited', draft.filters.cited === '1' ? '' : '1')} />
        </Group>
        <Group title="نوع الاختلاف" palette={palette}>
          {Object.entries(SUPPORTED_TAGS).map(([id, label]) => <Chip key={id} label={label.ar} active={(draft.filters.differences ?? '').split(',').includes(id)} palette={palette}
            onPress={() => setFilter('differences', toggleFilter(draft.filters.differences, id))} />)}
        </Group>
        <Group title="الترتيب" palette={palette}>
          {SORTS.map((sort, i) => <Chip key={sort} label={SORT_LABELS[i]} active={(draft.filters.sort || 'mushaf') === sort} palette={palette} onPress={() => setFilter('sort', i ? sort : '')} />)}
        </Group>
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderTopWidth: 1, borderColor: palette.rule, paddingTop: 4 }}>
        <IconButton label="إعادة ضبط" onPress={() => setDraft(draftOf(EMPTY_LIST))} Icon={RotateCcw} color={palette.ink} />
        <Pressable onPress={submit} disabled={!valid} accessibilityRole="button" accessibilityLabel="تطبيق"
          style={{ width: 52, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: valid ? palette.accent : palette.rule }}>
          <Check size={24} color={palette.onAccent} />
        </Pressable>
      </View>
    </Sheet>
  );
}
