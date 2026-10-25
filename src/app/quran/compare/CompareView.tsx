'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/language/LanguageContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import PageSpread, { MatchLegend, type SpreadAyah, type SpreadMark } from '@/components/quran/PageSpread';
import { groupPairs, KEEP_RUN, MAX_STEP_GAP, MIN_RUN, TAIL_COUNT, wordSlots, type Group, type Pair, type Range, type Row } from '@/lib/quran/compare';
import { num } from '@/lib/quran/arabicNumber';
import { NOTE, PANEL } from '../panel';

type Side = { number: number; name: string; plain: string; words: string[]; range?: Range };

const span = (r: NonNullable<Range>) => (r.from === r.to ? num(r.from) : `${num(r.from)}–${num(r.to)}`);
const ayat = (n: number, ar = true) => !ar ? `${n} ${n === 1 ? 'ayah' : 'ayat'}` : (n === 0 ? 'لا آيات' : n === 1 ? 'آية واحدة' : n === 2 ? 'آيتان' : n >= 3 && n <= 10 ? `${num(n)} آيات` : `${num(n)} آية`);
const label = (s: Side, r: Range) => (r ? `${s.plain} ${span(r)}` : '—');

const title = (s: Side) => (s.range ? label(s, s.range) : s.plain);
const ROOT_TITLE = 'من جذر مشترك بلفظ مختلف';

function marksOf(group: Group, side: 'a' | 'b', ayah: number, slots: Record<number, number>, ar: boolean): Record<number, SpreadMark> {
  const roots = new Set(group.pairs.flatMap((p, k) => (p[side] === ayah ? (side === 'a' ? p.rootsA : p.rootsB).filter(i => slots[i] === k) : [])));
  return Object.fromEntries(Object.entries(slots).map(([i, slot]) => [i, roots.has(Number(i)) ? { kind: 'root', slot, title: ar ? ROOT_TITLE : 'Same root, different wording' } : { kind: 'exact', slot }]));
}

function pairLabel(p: Pair, ar: boolean) {
  if (!ar) return p.run >= MIN_RUN ? `Shared text: ${p.run} consecutive words` : p.shared.length > 0 ? `Shared words in a different order: ${p.shared.join(', ')}` : 'No shared words';
  if (p.run >= MIN_RUN) return `نص مشترك: ${num(p.run)} كلمات متتالية`;
  if (p.shared.length > 0) return `كلمات مشتركة غير متتالية: ${p.shared.join('، ')}`;
  return 'لا كلمات مشتركة';
}

const plainAyah = (side: Side, n: number): SpreadAyah => ({ number: n, words: side.words[n - 1].split(' ') });
const page = (side: Side, r: NonNullable<Range>, rows: SpreadAyah[][], ar: boolean) => ({ title: side.name, subtitle: `${ar ? (r.from === r.to ? 'الآية' : 'الآيات') : (r.from === r.to ? 'Ayah' : 'Ayat')} ${span(r)}`, label: label(side, r), rows });

function Gap({ a, b, ra, rb }: { a: Side; b: Side; ra: Range; rb: Range }) {
  const ar = useLanguage().language === 'ar';
  const [open, setOpen] = useState(false);
  const count = (r: Range) => (r ? r.to - r.from + 1 : 0);
  const pages = ([[a, ra], [b, rb]] as const).map(([s, r]) => (r ? page(s, r, [Array.from({ length: count(r) }, (_, k) => plainAyah(s, r.from + k))], ar) : null));
  return (
    <div className={PANEL}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={NOTE}>
          {label(a, ra)} ({ayat(count(ra), ar)}) {ar ? 'و' : 'and '}{label(b, rb)} ({ayat(count(rb), ar)})
        </p>
        <Button size="sm" aria-expanded={open} aria-label={`${ar ? (open ? 'أخفِ' : 'اعرض') : (open ? 'Hide' : 'Show')} ${label(a, ra)} ${ar ? 'و' : 'and '}${label(b, rb)}`} onClick={() => setOpen(o => !o)}>
          {open ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
          {ar ? (open ? 'أخفِ' : 'اعرض') : (open ? 'Hide' : 'Show')}
        </Button>
      </div>
      {open && <div className="mt-3"><PageSpread pages={pages} /></div>}
    </div>
  );
}

function BlockSpread({ a, b, pairs }: { a: Side; b: Side; pairs: Pair[] }) {
  const ar = useLanguage().language === 'ar';
  const groups = groupPairs(pairs);
  const rows = (side: Side, key: 'a' | 'b') => groups.map(g => (key === 'a' ? g.as : g.bs).map(n => {
    const slots = wordSlots(g, key, n, side.words[n - 1].split(' ').length);
    return { ...plainAyah(side, n), marks: marksOf(g, key, n, slots, ar) };
  }));
  const range = (key: 'a' | 'b') => ({ from: Math.min(...pairs.map(p => p[key])), to: Math.max(...pairs.map(p => p[key])) });
  return (
    <>
      <PageSpread ruled pages={[page(a, range('a'), rows(a, 'a'), ar), page(b, range('b'), rows(b, 'b'), ar)]} />
      <ul className="mt-3 flex flex-wrap gap-2">
        {pairs.map((p, k) => (
          <li key={k}><Badge size="sm" color={p.run >= MIN_RUN ? 'amber' : 'gray'} text={pairs.length > 1 ? `${num(p.a)} ${ar ? 'و' : 'and '}${num(p.b)}: ${pairLabel(p, ar)}` : pairLabel(p, ar)} /></li>
        ))}
      </ul>
    </>
  );
}

export default function CompareView({ a, b, rows }: { a: Side; b: Side; rows: Row[] }) {
  const ar = useLanguage().language === 'ar';
  const words = rows.filter(r => r.type === 'block' && r.block.kind === 'words').length;
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className="flex flex-col gap-4">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl">{`${title(a)} ${ar ? 'و' : 'and '}${title(b)}`}</h1>
        </div>
        <p className={`${NOTE} mb-3`}>{ar ? 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص.' : 'This display has not been reviewed by a scholar. The text follows Hafs.'}</p>
        <details className="mb-3">
          <summary className="cursor-pointer text-sm text-[var(--home-muted)]">{ar ? 'كيف تُقارن الآيات؟ وحدود العرض' : 'How ayat are compared and the limits of this display'}</summary>
        <p className={`${NOTE} mt-2`}>{ar ? <>
          تُذكر آيتان معًا حين تشتركان في تتابع من {num(MIN_RUN)} كلمات فأكثر
          بعد حذف التشكيل وتوحيد صور بعض الحروف، وتُقابل الكلمة بجذرها والأداة بأصلها، فتلتقي «ولأصلبنكم» و«لأصلبنكم» و«سحّار» و«ساحر»، وتُعدّ الكلمة مشتركة ولو تغيّر موضعها في الآية. تُضم الأزواج في كتلة إن كانت الفجوة بينها واحدة في السورتين ولا تزيد على {num(MAX_STEP_GAP)} آيات،
          وتبقى الكتلة إن كان فيها زوجان فيهما نص مشترك أو زوج فيه تتابع {num(KEEP_RUN)} كلمات فأكثر، أو أي زوج إن اخترت آيات بعينها، وإن تساوى عدد الآيات المختارة في الجانبين قوبلت كل آية بنظيرتها. الصيغ المتكررة تُقرن بإحدى مواضعها اعتباطًا. إن وافقت آية أكثر من آية في السورة الأخرى عُرضت مرة واحدة وإلى جانبها مقابلاتها، ولكل مقابلة لون لكلماتها المشتركة.
          والملوّنة بلون آخر مسطَّرة بنقاط كلمة من جذر مشترك بلفظ مختلف.
          </> : <>Ayat are paired when they share at least {MIN_RUN} consecutive words after spelling normalization and matching roots or particle lemmas. Shared words can appear in a different order. Pairs form a block when both sides advance by the same gap of at most {MAX_STEP_GAP} ayat. A block needs two matching pairs or one run of at least {KEEP_RUN} words. Selected passages can retain shorter matches; equal-length selected ranges align ayah by ayah. Repeated formulas can be paired arbitrarily. Each ayah appears once beside all its counterparts, with separate colors for each link. Dotted underlines identify a shared root with different wording.</>}</p>
        </details>
        <MatchLegend exact={ar ? 'كلمة مشتركة بلفظها' : 'Same word'} root={ar ? ROOT_TITLE : 'Same root, different wording'} />
        <p className={NOTE}>{ar ? `وُجدت ${num(words)} كتلة مبنية على النص.` : `${words} blocks based on shared text.`}</p>
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
              <h2 className="text-xl text-[var(--home-accent)]">
                {`${a.plain} ${span({ from: first.a, to: end.a })} ${ar ? 'و' : 'and '}${b.plain} ${span({ from: first.b, to: end.b })}`}
              </h2>
              <Badge size="sm" color="gray" text={count ? (ar ? 'محاذاة بالعدّ من نهاية السورتين' : 'Aligned by position from the end') : (ar ? `${ayat(block.anchors)} فيها نص مشترك` : `${ayat(block.anchors, false)} share text`)} />
            </div>
            {count && (
              <p className={`${NOTE} mb-3`}>
                {ar ? `آخر ${num(TAIL_COUNT)} آيات من كل سورة بالترتيب، من غير حساب على النص. ما تحت الصفحتين يبيّن ما يشترك فيه كل زوج فعلًا.` : `The final ${TAIL_COUNT} ayat are aligned by position. The labels below show what each pair actually shares.`}
              </p>
            )}
            <BlockSpread a={a} b={b} pairs={block.pairs} />
          </section>
        );
      })}
    </div>
  );
}
