'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { AyahCard } from '@/components/quran/AyahCard';
import { KEEP_RUN, MAX_STEP_GAP, MIN_RUN, TAIL_COUNT, type Pair, type Range, type Row } from '@/lib/quran/compare';
import type { Ayah } from '@/types/quran';

type Side = { number: number; name: string; plain: string; words: string[] };

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';
const num = (n: number) => n.toLocaleString('ar-EG');
const span = (r: NonNullable<Range>) => (r.from === r.to ? num(r.from) : `${num(r.from)}–${num(r.to)}`);
const ayat = (n: number) => (n === 0 ? 'لا آيات' : n === 1 ? 'آية واحدة' : n === 2 ? 'آيتان' : n >= 3 && n <= 10 ? `${num(n)} آيات` : `${num(n)} آية`);
const label = (s: Side, r: Range) => (r ? `${s.plain} ${span(r)}` : '—');

function pairLabel(p: Pair) {
  if (p.run >= MIN_RUN) return `نص مشترك: ${num(p.run)} كلمات متتالية`;
  if (p.shared.length > 0) return `كلمات مشتركة غير متتالية: ${p.shared.join('، ')}`;
  return 'لا كلمات مشتركة';
}

function Card({ side, ayah, marks }: { side: Side; ayah: number; marks?: number[] }) {
  const surah = { id: `s${side.number}`, number: side.number, name: side.name, nameTransliterated: null };
  return <AyahCard ayah={{ id: `${side.number}:${ayah}`, number: ayah, text: side.words[ayah - 1], surah } as unknown as Ayah} marks={marks} />;
}

function Gap({ a, b, ra, rb }: { a: Side; b: Side; ra: Range; rb: Range }) {
  const [open, setOpen] = useState(false);
  const count = (r: Range) => (r ? r.to - r.from + 1 : 0);
  const cards = (s: Side, r: Range) => (r ? Array.from({ length: count(r) }, (_, k) => r.from + k) : []).map(n => <Card key={n} side={s} ayah={n} />);
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
      {open && (
        <div className="grid md:grid-cols-2 gap-x-4 mt-3">
          <div>{cards(a, ra)}</div>
          <div>{cards(b, rb)}</div>
        </div>
      )}
    </div>
  );
}

export default function CompareView({ a, b, rows }: { a: Side; b: Side; rows: Row[] }) {
  const words = rows.filter(r => r.type === 'block' && r.block.kind === 'words').length;
  return (
    <div className="flex flex-col gap-4">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl">{`${a.plain} و${b.plain}`}</h1>
          <Badge text="تجريبي" color="amber" size="sm" />
        </div>
        <p className={NOTE}>
          عرض تجريبي لم يراجعه أحد من أهل العلم. النص برواية حفص. تُذكر آيتان معًا حين تشتركان في تتابع من {num(MIN_RUN)} كلمات فأكثر
          بعد حذف التشكيل وتوحيد صور بعض الحروف. تُضم الأزواج في كتلة إن كانت الفجوة بينها واحدة في السورتين ولا تزيد على {num(MAX_STEP_GAP)} آيات،
          وتبقى الكتلة إن كان فيها زوجان فيهما نص مشترك أو زوج فيه تتابع {num(KEEP_RUN)} كلمات فأكثر. الصيغ المتكررة تُقرن بإحدى مواضعها اعتباطًا.
          الكلمات المسطَّرة هي ما اختلف بين الآيتين. يدل الاشتراك على اشتراك اللفظ وحده.
        </p>
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
                آخر {num(TAIL_COUNT)} آيات من كل سورة بالترتيب، من غير حساب على النص. ما تحت كل زوج يبيّن ما تشتركان فيه فعلًا.
              </p>
            )}
            {block.pairs.map(p => (
              <div key={p.a} className="grid md:grid-cols-2 gap-x-4 border-t border-gray-200 dark:border-white/10 pt-3">
                <Card side={a} ayah={p.a} marks={p.marksA} />
                <Card side={b} ayah={p.b} marks={p.marksB} />
                <div className="md:col-span-2 -mt-2 mb-3">
                  <Badge size="sm" color={p.run >= MIN_RUN ? 'amber' : 'gray'} text={pairLabel(p)} />
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
