import { useState, useSyncExternalStore } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import { Check, RotateCcw } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { isCompareBookmark } from '@shared/compareBookmarks';
import { num } from '@shared/quran/arabicNumber';
import { JUZ_STARTS } from '@shared/quran/juz';
import { SORTS, toggleFilter, type GroupFilters } from '@shared/quran/mutashabih/browse';
import { SUPPORTED_TAGS } from '@shared/quran/mutashabih/evidence';
import Toggle from './Toggle';
import NumberPicker, { NumberList } from './NumberPicker';
import { IconButton } from './Studio';
import surahRows from '@shared/data/quran/surahs.json';
import { surahNames } from '@/lib/branches';
import { draftRange, UNIT_MAX, type FilterDraft, type FilterUnit } from '@/lib/branchList';
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

/** What the number means: the surah's name, where the juz starts, or the surah the page is in. */
function nameOf(unit: FilterUnit, n: number) {
  if (unit === 'surah') return surahNames[n] ?? '';
  if (unit === 'juz') { const [surah, ayah] = JUZ_STARTS[n - 1].split(':').map(Number); return `${surahNames[surah]} ${num(ayah)}`; }
  if (unit === 'page') { const surah = surahRows.findLast(row => row.page != null && row.page <= n)?.number; return surah ? surahNames[surah] ?? '' : ''; }
  return '';
}

/** A range end as a number; a missing or broken one falls back to the unit's end. */
const toNumber = (value: string, fallback: number) => { const n = Number(value); return Number.isInteger(n) && n > 0 ? n : fallback; };

/** The sheet's fields: saved only and the part of the Quran; the branches tab adds the comparison kinds, differences and sort (the quiz all but sort).
 *  The compare tab shows the first two inside its pair list, since it has no other filters (owner, 2026-11-10). */
export function FilterFields({ draft, setDraft, palette, compare = false, sort = true, savedOnly = true }: { draft: FilterDraft; setDraft: (draft: FilterDraft) => void; palette: Palette; compare?: boolean; sort?: boolean; savedOnly?: boolean }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const [openEnd, setOpenEnd] = useState<'from' | 'to' | null>(null);
  const saved = bookmarks.filter(item => isCompareBookmark(item) === compare).length;
  const ranged = draft.unit === 'juz' || draft.unit === 'surah' || draft.unit === 'page';
  const setFilter = (key: keyof GroupFilters, value: string) => setDraft({ ...draft, filters: { ...draft.filters, [key]: value || undefined } });
  const categories = draft.filters.categories ?? 'mutashabeh,pondering';
  const pickList = draft.unit === 'surahs' ? Array.from({ length: 114 }, (_, i) => ({ n: i + 1, label: `${num(i + 1)} ${surahNames[i + 1]}` }))
    : draft.unit === 'juzs' ? Array.from({ length: 30 }, (_, i) => ({ n: i + 1, label: `الجزء ${num(i + 1)}` })) : [];
  return (
    <>
      {savedOnly && <Toggle on={draft.saved} onChange={on => setDraft({ ...draft, saved: on })} label={!draft.saved && !saved ? `احفظ ${compare ? 'بطاقة' : 'شجرة'} بزر الحفظ تحتها أولًا` : 'المحفوظة فقط'} palette={palette} disabled={!draft.saved && !saved} />}
      <Group title="النطاق" palette={palette}>
        {UNITS.map(unit => <Chip key={unit.value} label={unit.label} active={draft.unit === unit.value} palette={palette}
          onPress={() => setDraft({ ...draft, unit: unit.value, from: '1', to: String(UNIT_MAX[unit.value]), picked: [] })} />)}
      </Group>
      {ranged && (() => {
        const max = UNIT_MAX[draft.unit];
        const from = toNumber(draft.from, 1), to = toNumber(draft.to, max);
        const name = (n: number) => nameOf(draft.unit, n);
        // Moving one end past the other moves both, as in the quiz settings.
        const pickFrom = (n: number) => setDraft({ ...draft, from: String(n), to: String(Math.max(n, to)) });
        const pickTo = (n: number) => setDraft({ ...draft, to: String(n), from: String(Math.min(n, from)) });
        // Only one end is open at a time, so its list takes the full width under both fields and shows more rows.
        return <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <NumberPicker key={`from-${draft.unit}`} value={from} max={max} label="من" nameOf={name} palette={palette} onChange={pickFrom}
              open={openEnd === 'from'} onOpen={shown => setOpenEnd(shown ? 'from' : null)} />
            <Text style={{ color: palette.muted, lineHeight: 44 }}>إلى</Text>
            <NumberPicker key={`to-${draft.unit}`} value={to} max={max} label="إلى" nameOf={name} palette={palette} onChange={pickTo}
              open={openEnd === 'to'} onOpen={shown => setOpenEnd(shown ? 'to' : null)} />
          </View>
          {openEnd && <NumberList key={openEnd} value={openEnd === 'from' ? from : to} max={max} nameOf={name} palette={palette} shown={8}
            onPick={n => { (openEnd === 'from' ? pickFrom : pickTo)(n); setOpenEnd(null); }} />}
        </View>;
      })()}
      {pickList.length > 0 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {pickList.map(item => <Chip key={item.n} label={item.label} active={draft.picked.includes(item.n)} palette={palette}
          onPress={() => setDraft({ ...draft, picked: draft.picked.includes(item.n) ? draft.picked.filter(n => n !== item.n) : [...draft.picked, item.n] })} />)}
      </View>}
      {!compare && <>
      <Group title="نوع المقارنة" palette={palette}>
        {Object.entries(CATEGORIES).map(([id, label]) => <Chip key={id} label={label} active={categories.split(',').includes(id)} palette={palette}
          onPress={() => setFilter('categories', toggleFilter(categories, id) || 'none')} />)}
        <Chip label="في كتب المتشابه" active={draft.filters.cited === '1'} palette={palette} onPress={() => setFilter('cited', draft.filters.cited === '1' ? '' : '1')} />
      </Group>
      <Group title="نوع الاختلاف" palette={palette}>
        {Object.entries(SUPPORTED_TAGS).map(([id, label]) => <Chip key={id} label={label.ar} active={(draft.filters.differences ?? '').split(',').includes(id)} palette={palette}
          onPress={() => setFilter('differences', toggleFilter(draft.filters.differences, id))} />)}
      </Group>
      {sort && <Group title="الترتيب" palette={palette}>
        {SORTS.map((order, i) => <Chip key={order} label={SORT_LABELS[i]} active={(draft.filters.sort || 'mushaf') === order} palette={palette} onPress={() => setFilter('sort', i ? order : '')} />)}
      </Group>}
      </>}
    </>
  );
}

/** Whether the draft's range can be applied (a range needs both ends in order). */
export const draftValid = (draft: FilterDraft) => !['juz', 'surah', 'page'].includes(draft.unit) || !!draftRange(draft);

/** Reset on one side, apply on the other: under the filters in the branches search screen. */
export function FilterActions({ onReset, onApply, valid, palette }: { onReset: () => void; onApply: () => void; valid: boolean; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderTopWidth: 1, borderColor: palette.rule, paddingTop: 4 }}>
      <IconButton label="إعادة ضبط" onPress={onReset} Icon={RotateCcw} color={palette.ink} />
      <Pressable onPress={onApply} disabled={!valid} accessibilityRole="button" accessibilityLabel="تطبيق"
        style={{ width: 52, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: valid ? palette.accent : palette.rule }}>
        <Check size={24} color={palette.onAccent} />
      </Pressable>
    </View>
  );
}
