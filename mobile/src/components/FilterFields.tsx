import { useState, useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { Check, RotateCcw } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { shownBookmarks } from '@/lib/home';
import { isCompareBookmark } from '@shared/compareBookmarks';
import { num } from '@shared/quran/arabicNumber';
import { JUZ_STARTS } from '@shared/quran/juz';
import { SORTS, toggleFilter, type GroupFilters } from '@shared/quran/mutashabih/browse';
import { PAGE_DEFAULT_KIND } from '@shared/quran/branchSearch';
import { SUPPORTED_TAGS } from '@shared/quran/mutashabih/evidence';
import Toggle from '@/ui/Toggle';
import NumberPicker, { NumberList } from '@/ui/NumberPicker';
import surahRows from '@shared/data/quran/surahs.json';
import { surahNames } from '@/lib/branches';
import { draftRange, UNIT_MAX, type FilterDraft, type FilterUnit } from '@/lib/branchList';
import type { Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import Chip from '@/ui/Chip';

const UNITS: { value: FilterUnit; label: string }[] = [
  { value: 'juz', label: 'من الجزء' },
  { value: 'surah', label: 'من السورة' },
  { value: 'page', label: 'من الصفحة' },
  { value: 'surahs', label: 'سور محددة' },
  { value: 'juzs', label: 'أجزاء محددة' },
];
const CATEGORIES: Record<string, string> = { mutashabeh: 'في كتب المتشابهات', pondering: 'تدبّر', words: 'أشجار الكلمات' };
const SORT_LABELS = ['ترتيب المصحف', 'الأقرب', 'الأكثر مواضع', 'الأقل اختلافًا'];

export function Group({ title, children, palette }: { title: string; children: React.ReactNode; palette: Palette }) {
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

/** The sheet's fields: saved only and the part of the Quran; the branches tab adds the comparison kinds, differences and sort (the quiz
 *  only differences: it asks just the books' mutashabihat, owner 2026-11-19).
 *  The compare tab shows the first two inside its pair list, since it has no other filters (owner, 2026-11-10). */
/** Without `trees` (a quiz with no tree questions) only the part of the Quran is asked. */
export function FilterFields({ draft, setDraft, palette, compare = false, sort = true, kinds = true, savedOnly = true, trees = true }: { draft: FilterDraft; setDraft: (draft: FilterDraft) => void; palette: Palette; compare?: boolean; sort?: boolean; kinds?: boolean; savedOnly?: boolean; trees?: boolean }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const [openEnd, setOpenEnd] = useState<'from' | 'to' | null>(null);
  const saved = shownBookmarks(bookmarks).filter(item => isCompareBookmark(item) === compare).length;
  const ranged = draft.unit === 'juz' || draft.unit === 'surah' || draft.unit === 'page';
  const setFilter = (key: keyof GroupFilters, value: string) => setDraft({ ...draft, filters: { ...draft.filters, [key]: value || undefined } });
  const categories = draft.filters.categories ?? PAGE_DEFAULT_KIND;
  const pickList = draft.unit === 'surahs' ? Array.from({ length: 114 }, (_, i) => ({ n: i + 1, label: `${num(i + 1)} ${surahNames[i + 1]}` }))
    : draft.unit === 'juzs' ? Array.from({ length: 30 }, (_, i) => ({ n: i + 1, label: `الجزء ${num(i + 1)}` })) : [];
  return (
    <>
      {savedOnly && trees && <Toggle on={draft.saved} onChange={on => setDraft({ ...draft, saved: on })} label="المحفوظة فقط" palette={palette} disabled={!draft.saved && !saved} />}
      {savedOnly && trees && !draft.saved && !saved && <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right', marginTop: -6 }}>لا محفوظات بعد: احفظ {compare ? 'بطاقة' : 'شجرة'} بزر الحفظ تحتها.</Text>}
      <Group title="النطاق" palette={palette}>
        {UNITS.map(unit => <Chip check key={unit.value} label={unit.label} on={draft.unit === unit.value} palette={palette}
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
        {pickList.map(item => <Chip check key={item.n} label={item.label} on={draft.picked.includes(item.n)} palette={palette}
          onPress={() => setDraft({ ...draft, picked: draft.picked.includes(item.n) ? draft.picked.filter(n => n !== item.n) : [...draft.picked, item.n] })} />)}
      </View>}
      {!compare && trees && <>
      {kinds && <Group title="نوع المقارنة" palette={palette}>
        {Object.entries(CATEGORIES).map(([id, label]) => <Chip check key={id} label={label} on={categories.split(',').includes(id)} palette={palette}
          onPress={() => setFilter('categories', toggleFilter(categories, id) || 'none')} />)}
      </Group>}
      <Group title="نوع الاختلاف" palette={palette}>
        {Object.entries(SUPPORTED_TAGS).map(([id, label]) => <Chip check key={id} label={label.ar} on={(draft.filters.differences ?? '').split(',').includes(id)} palette={palette}
          onPress={() => setFilter('differences', toggleFilter(draft.filters.differences, id))} />)}
      </Group>
      {sort && <Group title="الترتيب" palette={palette}>
        {SORTS.map((order, i) => <Chip check key={order} label={SORT_LABELS[i]} on={(draft.filters.sort || 'mushaf') === order} palette={palette} onPress={() => setFilter('sort', i ? order : '')} />)}
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
      <IconButton label="إعادة ضبط" onPress={onReset} Icon={RotateCcw} tone="ink" />
      <IconButton Icon={Check} label="تطبيق" onPress={onApply} round big disabled={!valid} />
    </View>
  );
}
