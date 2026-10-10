'use client';

import React, { useState } from 'react';
import Badge from '@/components/common/Badge';
import { AyahCard } from '@/components/quran/AyahCard';
import { ARC_MIN, REFRAIN_MANY, REFRAIN_MIN, type Arc, type Form, type Occ, type Opener, type Refrain } from '@/lib/quran/shifts';
import type { Range } from '@/lib/quran/curatedShifts';
import type { Ayah } from '@/types/quran';

type Surah = { number: number; name: string; plain: string };
type Part = { from: number; to: number; ayat: string[] };
export type CuratedView = { surah: Surah; note: string; parts: Part[]; arcs: Arc[] };
type Selection = { kind: 'arc'; i: number } | { kind: 'tick'; lane: number; k: number } | { kind: 'opener'; i: number } | null;

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';
const LANES = 10;
const num = (n: number) => n.toLocaleString('ar-EG');
const words = (n: number) => `${num(n)} ${n >= 11 ? 'كلمة' : 'كلمات'}`;
const span = ([from, to]: Range) => (from === to ? num(from) : `${num(from)}–${num(to)}`);
const run = (at: Occ, len: number, slot = 0) => Object.fromEntries(Array.from({ length: len }, (_, k) => [at.word + k, slot]));

const FORMS: Record<Form, { label: string; slot: number; block: string }> = {
  command: { label: 'قل: أمر', slot: 0, block: 'bg-amber-500 dark:bg-amber-400' },
  male: { label: 'قال: مفرد مذكر', slot: 1, block: 'bg-sky-500 dark:bg-sky-400' },
  group: { label: 'قالوا: جماعة', slot: 2, block: 'bg-emerald-500 dark:bg-emerald-400' },
  woman: { label: 'قالت: امرأة', slot: 3, block: 'bg-rose-500 dark:bg-rose-400' },
};

function Card({ surah, ayah, text, slots }: { surah: Surah; ayah: number; text: string; slots?: Record<number, number> }) {
  const s = { id: `s${surah.number}`, number: surah.number, name: surah.name, nameTransliterated: null };
  return <AyahCard ayah={{ id: `${surah.number}:${ayah}`, number: ayah, text, surah: s } as unknown as Ayah} slots={slots} />;
}

function onKey(act: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      act();
    }
  };
}

function Arcs({ arcs, count, step, selected, onSelect }: { arcs: Arc[]; count: number; step: number; selected: number; onSelect: (i: number) => void }) {
  const xOf = (ayah: number) => (count - ayah + 0.5) * step;
  const rise = (arc: Arc) => Math.min(110, Math.max(14, Math.abs(xOf(arc.a.ayah) - xOf(arc.b.ayah)) * 0.45));
  const base = Math.max(...arcs.map(rise)) + 8;
  return (
    <svg viewBox={`0 0 ${count * step} ${base + 14}`} className="w-full" style={{ minWidth: count * step }} role="group" aria-label="أقواس تصل بين آيتين تتكرر فيهما عبارة مرتين">
      {arcs.map((arc, i) => {
        const [x1, x2] = [xOf(arc.a.ayah), xOf(arc.b.ayah)].sort((p, q) => p - q);
        const d = `M ${x1} ${base} A ${(x2 - x1) / 2} ${rise(arc)} 0 0 1 ${x2} ${base}`;
        const label = `عبارة من ${words(arc.len)} في الآيتين ${num(arc.a.ayah)} و${num(arc.b.ayah)}`;
        return (
          <g key={i} role="button" tabIndex={0} aria-label={label} aria-pressed={i === selected} className="cursor-pointer outline-none focus-visible:[&>path:first-of-type]:stroke-[4px]" onClick={() => onSelect(i)} onKeyDown={onKey(() => onSelect(i))}>
            <path d={d} fill="none" strokeWidth={i === selected ? 3 : 1.2 + Math.min(arc.len, 12) / 6} className={i === selected ? 'stroke-amber-600 dark:stroke-amber-300' : 'stroke-gray-500 dark:stroke-gray-400 opacity-60'} />
            <path d={d} fill="none" stroke="transparent" strokeWidth={10}><title>{label}</title></path>
          </g>
        );
      })}
      <line x1={0} x2={count * step} y1={base + 1} y2={base + 1} className="stroke-gray-400" />
      {[1, ...Array.from({ length: Math.floor(count / 10) }, (_, k) => (k + 1) * 10)].map(n => (
        <text key={n} x={xOf(n)} y={base + 12} textAnchor="middle" fontSize={8} className="fill-gray-600 dark:fill-gray-400">{num(n)}</text>
      ))}
    </svg>
  );
}

function Lane({ refrain, count, step, selected, onSelect }: { refrain: Refrain; count: number; step: number; selected: number; onSelect: (k: number) => void }) {
  const xOf = (ayah: number) => (count - ayah) * step;
  return (
    <svg viewBox={`0 0 ${count * step} 22`} className="w-full" style={{ minWidth: count * step }} role="group" aria-label={`مواضع «${refrain.text}»`}>
      <line x1={0} x2={count * step} y1={21} y2={21} className="stroke-gray-300 dark:stroke-gray-700" />
      {refrain.at.map((at, k) => (
        <rect key={k} x={xOf(at.ayah) + step * 0.2} y={2} width={step * 0.6} height={18} role="button" tabIndex={0} aria-label={`الآية ${num(at.ayah)}`} aria-pressed={k === selected}
          className={`cursor-pointer outline-none focus-visible:stroke-2 focus-visible:stroke-gray-900 dark:focus-visible:stroke-white ${k === selected ? 'fill-amber-600 dark:fill-amber-300' : 'fill-amber-400 dark:fill-amber-600'}`}
          onClick={() => onSelect(k)} onKeyDown={onKey(() => onSelect(k))}><title>{`الآية ${num(at.ayah)}`}</title></rect>
      ))}
    </svg>
  );
}

function Speech({ openers, selected, onSelect }: { openers: Opener[]; selected: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="مطالع الأقوال بترتيب ورودها">
      {openers.map((o, i) => (
        <button key={i} type="button" onClick={() => onSelect(i)} aria-pressed={i === selected} title={`الآية ${num(o.ayah)}`} aria-label={`${FORMS[o.form].label}، الآية ${num(o.ayah)}`}
          className={`h-8 w-5 rounded-sm ${FORMS[o.form].block} ${i === selected ? 'ring-2 ring-gray-900 dark:ring-white' : 'opacity-70'}`} />
      ))}
    </div>
  );
}

function CuratedCard({ item }: { item: CuratedView }) {
  const { surah, parts, arcs, note } = item;
  const slotsOf = (ayah: number) => {
    const hit = arcs.find(a => a.a.ayah === ayah || a.b.ayah === ayah);
    return hit ? run(hit.a.ayah === ayah ? hit.a : hit.b, hit.len) : undefined;
  };
  return (
    <section className={PANEL}>
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h3 className="text-xl text-amber-600 dark:text-amber-400">{`${surah.plain} ${span([parts[0].from, parts[parts.length - 1].to])}`}</h3>
        <Badge size="sm" color="amber" text="مختارة يدويًا" />
        <Badge size="sm" color="gray" text="اقتراح تجريبي بلا إحالات" />
      </div>
      <p className={`${NOTE} mb-3`}>{note}</p>
      <div className={parts.length > 1 ? 'grid md:grid-cols-2 gap-x-4' : ''}>
        {parts.map(p => (
          <div key={p.from}>
            {p.ayat.map((text, k) => <Card key={k} surah={surah} ayah={p.from + k} text={text} slots={slotsOf(p.from + k)} />)}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ShiftsView({ surah, ayat, arcs, refrains, openers, curated }: { surah: Surah; ayat: string[]; arcs: Arc[]; refrains: Refrain[]; openers: Opener[]; curated: CuratedView[] }) {
  const [sel, setSel] = useState<Selection>(arcs.length ? { kind: 'arc', i: 0 } : null);
  const count = ayat.length;
  const step = Math.min(40, Math.max(6, 720 / count));
  const lanes = refrains.slice(0, LANES);
  const arc = sel?.kind === 'arc' ? arcs[sel.i] : null;
  const refrain = sel?.kind === 'tick' ? lanes[sel.lane] : null;
  const opener = sel?.kind === 'opener' ? openers[sel.i] : null;
  const phrase = (r: { len: number }, at: Occ) => ayat[at.ayah - 1].split(' ').slice(at.word, at.word + r.len).join(' ');

  return (
    <div className="flex flex-col gap-6">
      <section className={PANEL}>
        <h2 className="text-2xl mb-1">عبارات تتكرر مرتين في {surah.plain}</h2>
        <p className={`${NOTE} mb-2`}>كل قوس يصل آيتين تتكرر فيهما عبارة من {num(ARC_MIN)} كلمات فأكثر، ولا تتكرر في موضع ثالث. اضغط على قوس لقراءة الآيتين متجاورتين.</p>
        {arcs.length === 0 ? <p className={NOTE}>لا عبارات من هذا النوع في السورة.</p> : (
          <div className="overflow-x-auto">
            <Arcs arcs={arcs} count={count} step={step} selected={sel?.kind === 'arc' ? sel.i : -1} onSelect={i => setSel({ kind: 'arc', i })} />
          </div>
        )}
      </section>

      <section className={PANEL}>
        <h2 className="text-2xl mb-1">عبارات تتكرر ثلاث مرات فأكثر</h2>
        <p className={`${NOTE} mb-2`}>
          حين تتكرر العبارة {num(REFRAIN_MIN)} مرات فأكثر تُجمع في صف واحد من العلامات بدل الأقواس: عبارة من أربع كلمات فأكثر، أو من ثلاث كلمات إن وردت {num(REFRAIN_MANY)} مرات فأكثر.
        </p>
        {lanes.length === 0 ? <p className={NOTE}>لا عبارات من هذا النوع في السورة.</p> : (
          <div className="overflow-x-auto flex flex-col gap-3">
            {lanes.map((r, l) => (
              <div key={l}>
                <p className="text-lg font-arabic flex flex-wrap items-center gap-2" dir="rtl">
                  {phrase(r, r.at[0])}
                  <Badge size="sm" color="gray" text={`${num(r.at.length)} مرات`} />
                </p>
                <Lane refrain={r} count={count} step={step} selected={sel?.kind === 'tick' && sel.lane === l ? sel.k : -1} onSelect={k => setSel({ kind: 'tick', lane: l, k })} />
              </div>
            ))}
          </div>
        )}
        {refrains.length > LANES && <p className={`${NOTE} mt-2`}>{`عُرضت أكثرها تكرارًا، وبقي ${num(refrains.length - LANES)} غيرها.`}</p>}
      </section>

      <section className={PANEL} aria-live="polite">
        <h2 className="text-2xl mb-2">الموضع المحدد</h2>
        {!sel && <p className={NOTE}>اضغط على قوس أو علامة أو مربع أعلاه.</p>}
        {arc && (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge size="sm" color="gray" text={`${words(arc.len)} متطابقة`} />
            </div>
            <div className="grid md:grid-cols-2 gap-x-4">
              {[arc.a, arc.b].map(at => <Card key={at.ayah} surah={surah} ayah={at.ayah} text={ayat[at.ayah - 1]} slots={run(at, arc.len)} />)}
            </div>
          </>
        )}
        {refrain && sel?.kind === 'tick' && (
          <Card surah={surah} ayah={refrain.at[sel.k].ayah} text={ayat[refrain.at[sel.k].ayah - 1]} slots={run(refrain.at[sel.k], refrain.len)} />
        )}
        {opener && <Card surah={surah} ayah={opener.ayah} text={ayat[opener.ayah - 1]} slots={{ [opener.word]: FORMS[opener.form].slot }} />}
      </section>

      <section className={PANEL}>
        <h2 className="text-2xl mb-1">مطالع الأقوال في {surah.plain}</h2>
        <p className={`${NOTE} mb-2`}>
          مربع لكل «قال» أو ما يصرَّف منه، بترتيب ورودها، ملوّن بصيغة الفعل وحدها. لا يُذكر القائل لأنه لا يُعرف من الكلمة، وقد يتأخر ذكره أو لا يُذكر.
        </p>
        {openers.length === 0 ? <p className={NOTE}>لا مطالع أقوال في السورة.</p> : (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge size="sm" color="gray" text={`${num(openers.length)} مطلعًا`} />
              {Object.values(FORMS).map(f => (
                <span key={f.label} className="flex items-center gap-1 text-sm"><span className={`inline-block h-3 w-3 rounded-sm ${f.block}`} />{f.label}</span>
              ))}
            </div>
            <Speech openers={openers} selected={sel?.kind === 'opener' ? sel.i : -1} onSelect={i => setSel({ kind: 'opener', i })} />
          </>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl">تحولات مختارة</h2>
        <p className={NOTE}>
          أمثلة اختيرت باليد، بلا إحالات إلى كتب. لا يوجد شريط للشخص والعدد لأن صيغ الكلمات وحدها لا تدل عليهما إلا في نحو ستين في المئة من المواضع، ولأن «نا» العظمة تلتبس بـ«نا» الجماعة.
        </p>
        {curated.map(c => <CuratedCard key={`${c.surah.number}:${c.parts[0].from}`} item={c} />)}
      </section>
    </div>
  );
}
