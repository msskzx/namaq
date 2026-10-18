'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import PageSpread, { MatchLegend, type SpreadAyah, type SpreadMark } from '@/components/quran/PageSpread';
import { groupPairs, KEEP_RUN, MAX_STEP_GAP, MIN_RUN, TAIL_COUNT, wordSlots, type Group, type Pair, type Range, type Row } from '@/lib/quran/compare';
import { num } from '@/lib/quran/arabicNumber';

type Side = { number: number; name: string; plain: string; words: string[]; range?: Range };

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';
const span = (r: NonNullable<Range>) => (r.from === r.to ? num(r.from) : `${num(r.from)}–${num(r.to)}`);
const ayat = (n: number) => (n === 0 ? 'لا آيات' : n === 1 ? 'آية واحدة' : n === 2 ? 'آيتان' : n >= 3 && n <= 10 ? `${num(n)} آيات` : `${num(n)} آية`);
const label = (s: Side, r: Range) => (r ? `${s.plain} ${span(r)}` : '—');

const title = (s: Side) => (s.range ? label(s, s.range) : s.plain);
const ROOT_TITLE = 'من جذر مشترك بلفظ مختلف';

function marksOf(group: Group, side: 'a' | 'b', ayah: number, slots: Record<number, number>): Record<number, SpreadMark> {
  const roots = new Set(group.pairs.flatMap((p, k) => (p[side] === ayah ? (side === 'a' ? p.rootsA : p.rootsB).filter(i => slots[i] === k) : [])));
  return Object.fromEntries(Object.entries(slots).map(([i, slot]) => [i, roots.has(Number(i)) ? { kind: 'root', slot, title: ROOT_TITLE } : { kind: 'exact', slot }]));
}

function pairLabel(p: Pair) {
  if (p.run >= MIN_RUN) return `نص مشترك: ${num(p.run)} كلمات متتالية`;
  if (p.shared.length > 0) return `كلمات مشتركة غير متتالية: ${p.shared.join('، ')}`;
  return 'لا كلمات مشتركة';
}

const plainAyah = (side: Side, n: number): SpreadAyah => ({ number: n, words: side.words[n - 1].split(' ') });
const page = (side: Side, r: NonNullable<Range>, rows: SpreadAyah[][]) => ({ title: side.name, subtitle: `${r.from === r.to ? 'الآية' : 'الآيات'} ${span(r)}`, label: label(side, r), rows });

function Gap({ a, b, ra, rb }: { a: Side; b: Side; ra: Range; rb: Range }) {
  const [open, setOpen] = useState(false);
  const count = (r: Range) => (r ? r.to - r.from + 1 : 0);
  const pages = ([[a, ra], [b, rb]] as const).map(([s, r]) => (r ? page(s, r, [Array.from({ length: count(r) }, (_, k) => plainAyah(s, r.from + k))]) : null));
  return (
    <div className={PANEL}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={NOTE}>
          {label(a, ra)} ({ayat(count(ra))}) و{label(b, rb)} ({ayat(count(rb))})
        </p>
        <Button size="sm" aria-expanded={open} aria-label={`${open ? 'أخفِ' : 'اعرض'} ${label(a, ra)} و${label(b, rb)}`} onClick={() => setOpen(o => !o)}>
          <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
          {open ? 'أخفِ' : 'اعرض'}
        </Button>
      </div>
      {open && <div className="mt-3"><PageSpread pages={pages} /></div>}
    </div>
  );
}

function BlockSpread({ a, b, pairs }: { a: Side; b: Side; pairs: Pair[] }) {
  const groups = groupPairs(pairs);
  const rows = (side: Side, key: 'a' | 'b') => groups.map(g => (key === 'a' ? g.as : g.bs).map(n => {
    const slots = wordSlots(g, key, n, side.words[n - 1].split(' ').length);
    return { ...plainAyah(side, n), marks: marksOf(g, key, n, slots) };
  }));
  const range = (key: 'a' | 'b') => ({ from: Math.min(...pairs.map(p => p[key])), to: Math.max(...pairs.map(p => p[key])) });
  return (
    <>
      <PageSpread ruled pages={[page(a, range('a'), rows(a, 'a')), page(b, range('b'), rows(b, 'b'))]} />
      <ul className="mt-3 flex flex-wrap gap-2">
        {pairs.map((p, k) => (
          <li key={k}><Badge size="sm" color={p.run >= MIN_RUN ? 'amber' : 'gray'} text={pairs.length > 1 ? `${num(p.a)} و${num(p.b)}: ${pairLabel(p)}` : pairLabel(p)} /></li>
        ))}
      </ul>
    </>
  );
}

export default function CompareView({ a, b, rows }: { a: Side; b: Side; rows: Row[] }) {
  const words = rows.filter(r => r.type === 'block' && r.block.kind === 'words').length;
  return (
    <div className="flex flex-col gap-4">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl">{`${title(a)} و${title(b)}`}</h1>
        </div>
        <p className={NOTE}>
          لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. تُذكر آيتان معًا حين تشتركان في تتابع من {num(MIN_RUN)} كلمات فأكثر
          بعد حذف التشكيل وتوحيد صور بعض الحروف، وتُقابل الكلمة بجذرها والأداة بأصلها، فتلتقي «ولأصلبنكم» و«لأصلبنكم» و«سحّار» و«ساحر»، وتُعدّ الكلمة مشتركة ولو تغيّر موضعها في الآية. تُضم الأزواج في كتلة إن كانت الفجوة بينها واحدة في السورتين ولا تزيد على {num(MAX_STEP_GAP)} آيات،
          وتبقى الكتلة إن كان فيها زوجان فيهما نص مشترك أو زوج فيه تتابع {num(KEEP_RUN)} كلمات فأكثر، أو أي زوج إن اخترت آيات بعينها، وإن تساوى عدد الآيات المختارة في الجانبين قوبلت كل آية بنظيرتها. الصيغ المتكررة تُقرن بإحدى مواضعها اعتباطًا. إن وافقت آية أكثر من آية في السورة الأخرى عُرضت مرة واحدة وإلى جانبها مقابلاتها، ولكل مقابلة لون لكلماتها المشتركة.
          والملوّنة بلون آخر مسطَّرة بنقاط كلمة من جذر مشترك بلفظ مختلف.
        </p>
        <MatchLegend exact="كلمة مشتركة بلفظها" root={ROOT_TITLE} />
        <p className={NOTE}>{`وُجدت ${num(words)} كتلة مبنية على النص.`}</p>
      </header>
      {rows.map((row, i) => {
        if (row.type === 'gap') return <Gap key={i} a={a} b={b} ra={row.a} rb={row.b} />;
        const { block } = row;
        const first = block.pairs[0];
        const end = block.pairs[block.pairs.length - 1];
        const count = block.kind === 'count';
        return (
          <section key={i} className={`${PANEL} ${count ? 'border-dashed' : ''}`}>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl text-amber-600 dark:text-amber-400">
                {`${a.plain} ${span({ from: first.a, to: end.a })} و${b.plain} ${span({ from: first.b, to: end.b })}`}
              </h2>
              <Badge size="sm" color="gray" text={count ? 'محاذاة بالعدّ من نهاية السورتين' : `${ayat(block.anchors)} فيها نص مشترك`} />
            </div>
            {count && (
              <p className={`${NOTE} mb-3`}>
                آخر {num(TAIL_COUNT)} آيات من كل سورة بالترتيب، من غير حساب على النص. ما تحت الصفحتين يبيّن ما يشترك فيه كل زوج فعلًا.
              </p>
            )}
            <BlockSpread a={a} b={b} pairs={block.pairs} />
          </section>
        );
      })}
    </div>
  );
}
