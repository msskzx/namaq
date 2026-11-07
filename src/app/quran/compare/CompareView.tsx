'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import Button from '@/components/common/Button';
import { NavButtons } from '@/components/common/NavBar';
import PageSpread, { MatchLegend, type SpreadAyah, type SpreadMark } from '@/components/quran/PageSpread';
import { groupPairs, KEEP_RUN, MAX_STEP_GAP, MIN_RUN, TAIL_COUNT, wordSlots, type Group, type Pair, type Range, type Row } from '@/lib/quran/compare';
import { num } from '@/lib/quran/arabicNumber';
import { NOTE, PANEL } from '../panel';
import ViewHeader from './ViewHeader';

type Side = { number: number; name: string; plain: string; words: string[]; range?: Range };

const span = (r: NonNullable<Range>) => (r.from === r.to ? num(r.from) : `${num(r.from)}–${num(r.to)}`);
const ayat = (n: number) => (n === 0 ? 'لا آيات' : n === 1 ? 'آية واحدة' : n === 2 ? 'آيتان' : n >= 3 && n <= 10 ? `${num(n)} آيات` : `${num(n)} آية`);
const label = (s: Side, r: Range) => (r ? `${s.plain} ${span(r)}` : '—');

const title = (s: Side) => (s.range ? label(s, s.range) : s.plain);
const ROOT_TITLE = 'من جذر مشترك بلفظ مختلف';

function marksOf(group: Group, side: 'a' | 'b', ayah: number, slots: Record<number, number>, ar = true): Record<number, SpreadMark> {
  const roots = new Set(group.pairs.flatMap((p, k) => (p[side] === ayah ? (side === 'a' ? p.rootsA : p.rootsB).filter(i => slots[i] === k) : [])));
  return Object.fromEntries(Object.entries(slots).map(([i, slot]) => [i, roots.has(Number(i)) ? { kind: 'root', slot, title: ar ? ROOT_TITLE : 'Shared root with a different form' } : { kind: 'exact', slot }]));
}

function pairLabel(p: Pair) {
  if (p.run >= MIN_RUN) return `نص مشترك: ${num(p.run)} كلمات متتالية`;
  if (p.shared.length > 0) return `كلمات مشتركة غير متتالية: ${p.shared.join('، ')}`;
  return 'لا كلمات مشتركة';
}

const plainAyah = (side: Side, n: number): SpreadAyah => ({ number: n, words: side.words[n - 1].split(' ') });
const page = (side: Side, r: NonNullable<Range>, rows: SpreadAyah[][], ar = true) => ({ title: side.name, subtitle: `${ar ? (r.from === r.to ? 'الآية' : 'الآيات') : (r.from === r.to ? 'Ayah' : 'Ayat')} ${span(r)}`, label: label(side, r), rows });

function Gap({ a, b, ra, rb, curated = false, ar = true, shown = true }: { a: Side; b: Side; ra: Range; rb: Range; curated?: boolean; ar?: boolean; shown?: boolean }) {
  const [open, setOpen] = useState(curated);
  const action = ar ? (open ? 'أخفِ' : 'اعرض') : (open ? 'Hide' : 'Show');
  const count = (r: Range) => (r ? r.to - r.from + 1 : 0);
  const pages = ([[a, ra], [b, rb]] as const).map(([s, r]) => (r ? page(s, r, [Array.from({ length: count(r) }, (_, k) => plainAyah(s, r.from + k))], ar) : null));
  if (curated) return shown ? <div className={PANEL}><PageSpread pages={pages} stackOnMobile /></div> : null;
  return (
    <div className={PANEL}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {!curated && <p className={NOTE}>
          {label(a, ra)} ({ar ? ayat(count(ra)) : `${count(ra)} ayat`}) {ar ? 'و' : 'and'} {label(b, rb)} ({ar ? ayat(count(rb)) : `${count(rb)} ayat`})
        </p>}
        <Button size="sm" aria-expanded={open} aria-label={`${action} ${label(a, ra)} ${ar ? 'و' : 'and'} ${label(b, rb)}`} onClick={() => setOpen(o => !o)}>
          {curated ? (open ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />) : <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />}
          {action}
        </Button>
      </div>
      {open && <div className="mt-3"><PageSpread pages={pages} stackOnMobile={curated} /></div>}
    </div>
  );
}

function BlockSpread({ a, b, pairs, ar = true, curated = false }: { a: Side; b: Side; pairs: Pair[]; ar?: boolean; curated?: boolean }) {
  const groups = groupPairs(pairs);
  const rows = (side: Side, key: 'a' | 'b') => groups.map(g => (key === 'a' ? g.as : g.bs).map(n => {
    const slots = wordSlots(g, key, n, side.words[n - 1].split(' ').length);
    return { ...plainAyah(side, n), marks: marksOf(g, key, n, slots, ar) };
  }));
  const range = (key: 'a' | 'b') => ({ from: Math.min(...pairs.map(p => p[key])), to: Math.max(...pairs.map(p => p[key])) });
  return (
    <>
      <PageSpread ruled stackOnMobile={curated} pages={[page(a, range('a'), rows(a, 'a'), ar), page(b, range('b'), rows(b, 'b'), ar)]} />
      {!curated && <ul className="mt-3 flex flex-wrap gap-2">
        {pairs.map((p, k) => (
          <li key={k}><Badge size="sm" color={p.run >= MIN_RUN ? 'rose' : 'gray'} text={ar ? (pairs.length > 1 ? `${num(p.a)} و${num(p.b)}: ${pairLabel(p)}` : pairLabel(p)) : `${p.a} / ${p.b}: ${p.run >= MIN_RUN ? `${p.run} consecutive matching words` : p.shared.length > 0 ? 'Shared words' : 'No shared words'}`} /></li>
        ))}
      </ul>}
    </>
  );
}

export default function CompareView({ a, b, rows, controls, curated = false }: { a: Side; b: Side; rows: Row[]; controls?: React.ReactNode; curated?: boolean }) {
  const ar = useLanguage().language === 'ar' || !curated;
  const words = rows.filter(r => r.type === 'block' && r.block.kind === 'words').length;
  const [gaps, setGaps] = useState(false);
  const gapsLabel = ar ? (gaps ? 'أخفِ الآيات التي لا تطابق فيها' : 'اعرض الآيات التي لا تطابق فيها') : (gaps ? 'Hide ayat without matches' : 'Show ayat without matches');
  return (
    <div className="flex flex-col gap-4">
      {curated && rows.some(row => row.type === 'gap') && <NavButtons>
        <Button size="lg" variant="muted" onClick={() => setGaps(value => !value)} aria-label={gapsLabel} title={gapsLabel}>
          {gaps ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
        </Button>
      </NavButtons>}
      {!curated && <ViewHeader title={`${title(a)} ${ar ? 'و' : 'and'} ${title(b)}`} methodLabel={ar ? 'كيف نقارن؟' : 'How are matches found?'} sub={curated ? (ar ? 'مطابقات لفظية' : 'Lexical matches') : words === 0 ? 'لا كتل مبنية على النص' : words === 1 ? 'كتلة واحدة مبنية على النص' : words === 2 ? 'كتلتان مبنيتان على النص' : `${num(words)} ${words <= 10 ? 'كتل مبنية' : 'كتلة مبنية'} على النص`} method={curated ? (ar ? 'المقاطع مختارة للقراءة معًا. تحدد الخوارزمية الكلمات المشتركة والجذور المشتركة، وقد تصل كلمات من أحداث مختلفة. تظهر جميع الآيات المختارة، بما فيها السياق الذي لا يحمل مطابقة لفظية.' : 'The passages are selected for reading together. The algorithm marks shared words and roots, which may link different narrative events. All selected ayat are shown, including context without a lexical match.') : <>
        النص برواية حفص. تُذكر آيتان معًا حين تشتركان في تتابع من {num(MIN_RUN)} كلمات فأكثر
        بعد حذف التشكيل وتوحيد صور بعض الحروف، وتُقابل الكلمة بجذرها والأداة بأصلها، فتلتقي «ولأصلبنكم» و«لأصلبنكم» و«سحّار» و«ساحر»، وتُعدّ الكلمة مشتركة ولو تغيّر موضعها في الآية. تُضم الأزواج في كتلة إن كانت الفجوة بينها واحدة في السورتين ولا تزيد على {num(MAX_STEP_GAP)} آيات،
        وتبقى الكتلة إن كان فيها زوجان فيهما نص مشترك أو زوج فيه تتابع {num(KEEP_RUN)} كلمات فأكثر، أو أي زوج إن اخترت آيات بعينها، وإن تساوى عدد الآيات المختارة في الجانبين قوبلت كل آية بنظيرتها. الصيغ المتكررة تُقرن بإحدى مواضعها اعتباطًا. إن وافقت آية أكثر من آية في السورة الأخرى عُرضت مرة واحدة وإلى جانبها مقابلاتها، ولكل مقابلة لون لكلماتها المشتركة.
        والملوّنة بلون آخر كلمة من جذر مشترك بلفظ مختلف.
      </>}>
        {controls}
      </ViewHeader>}
      {!curated && <MatchLegend exact={ar ? 'كلمة مشتركة بلفظها' : 'Exact word match'} root={ar ? ROOT_TITLE : 'Shared root with a different form'} />}
      {rows.map((row, i) => {
        if (row.type === 'gap') return <Gap key={i} a={a} b={b} ra={row.a} rb={row.b} curated={curated} ar={ar} shown={gaps} />;
        const { block } = row;
        const count = block.kind === 'count';
        return (
          <section key={i} className={`${PANEL} ${count ? 'border-dashed' : ''}`}>
            {!curated && <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge size="sm" color="gray" text={count ? 'محاذاة بالعدّ من نهاية السورتين' : `${ayat(block.anchors)} فيها نص مشترك`} />
            </div>}
            {count && (
              <p className={`${NOTE} mb-3`}>
                آخر {num(TAIL_COUNT)} آيات من كل سورة بالترتيب، من غير حساب على النص. ما تحت الصفحتين يبيّن ما يشترك فيه كل زوج فعلًا.
              </p>
            )}
            <BlockSpread a={a} b={b} pairs={block.pairs} ar={ar} curated={curated} />
          </section>
        );
      })}
    </div>
  );
}
