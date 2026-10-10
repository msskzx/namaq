'use client';

import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faArrowLeft, faArrowRight, faExpand } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { AyahCard } from '@/components/quran/AyahCard';
import { sideCards } from '@/lib/quran/cards';
import { ayahWords } from '@/lib/quran/normalize';
import { sharedSlots } from '@/lib/quran/wordDiff';
import type { Ayah } from '@/types/quran';
import type { Passage } from '@/lib/quran/passages';

type Surah = { n: number; name: string; count: number };
type Runs = { minWords: number; surahs: Surah[]; passages: Passage[] };

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const STEP = 10;
const num = (n: number) => n.toLocaleString('ar-EG');
const plainName = (name: string) => name.replace(/[\u064B-\u065F\u0640\u0670\u06D6-\u06ED]/g, '').replace(/\u0671/g, '\u0627');
const xOf = (n: number) => (115 - n) * STEP - STEP / 2;

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className={PANEL}>
      <div className="text-3xl text-amber-600 dark:text-amber-400">{num(value)}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

function SurahBars({ surahs, onPick }: { surahs: Surah[]; onPick: (n: number) => void }) {
  const max = Math.max(...surahs.map(s => s.count));
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${114 * STEP} 120`} className="min-w-[720px] w-full" role="group" aria-label="عدد الآيات في كل سورة بترتيب المصحف">
        {surahs.map(s => {
          const h = Math.max(1, (s.count / max) * 100);
          return (
            <rect key={s.n} x={xOf(s.n) - 3.5} y={110 - h} width={7} height={h} role="button" tabIndex={0} aria-label={`${plainName(s.name)}: ${num(s.count)} آية`} className="fill-amber-400 dark:fill-amber-500 hover:fill-amber-600 focus-visible:stroke-gray-900 dark:focus-visible:stroke-white focus-visible:stroke-2 outline-none cursor-pointer" onClick={() => onPick(s.n)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(s.n); } }}>
              <title>{`${plainName(s.name)}: ${num(s.count)} آية`}</title>
            </rect>
          );
        })}
        {[1, 20, 40, 60, 80, 100, 114].map(n => (
          <text key={n} x={xOf(n)} y={120} textAnchor="middle" fontSize={8} className="fill-gray-600 dark:fill-gray-400">{num(n)}</text>
        ))}
      </svg>
    </div>
  );
}

function Arcs({ passages, selected, onSelect, surahs }: { passages: Passage[]; selected: number; onSelect: (i: number) => void; surahs: Surah[] }) {
  const base = 150;
  const nameOf = (n: number) => plainName(surahs[n - 1].name);
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${114 * STEP} ${base + 14}`} className="min-w-[720px] w-full" role="group" aria-label="أقواس تصل بين السور التي يتشارك فيها نص">
        {passages.map((p, i) => {
          const [x1, x2] = [xOf(p.a.from.surah), xOf(p.b.from.surah)].sort((a, b) => a - b);
          const rx = (x2 - x1) / 2;
          const d = `M ${x1} ${base} A ${rx} ${(base - 5) * Math.sqrt(rx / (57 * STEP))} 0 0 1 ${x2} ${base}`;
          const label = `نص مشترك بين ${nameOf(p.a.from.surah)} و${nameOf(p.b.from.surah)}`;
          return (
            <g key={i} role="button" tabIndex={0} aria-label={label} aria-pressed={i === selected} className="cursor-pointer outline-none focus-visible:[&>path:first-of-type]:stroke-[4px]"
              onClick={() => onSelect(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(i); } }}>
              <path d={d} fill="none" strokeWidth={i === selected ? 3 : 1.2} className={i === selected ? 'stroke-amber-600 dark:stroke-amber-300' : 'stroke-gray-500 dark:stroke-gray-400 opacity-60'} />
              <path d={d} fill="none" stroke="transparent" strokeWidth={8}><title>{label}</title></path>
            </g>
          );
        })}
        <line x1={0} x2={114 * STEP} y1={base + 1} y2={base + 1} className="stroke-gray-400" />
        {[1, 20, 40, 60, 80, 100, 114].map(n => (
          <text key={n} x={xOf(n)} y={base + 12} textAnchor="middle" fontSize={8} className="fill-gray-600 dark:fill-gray-400">{num(n)}</text>
        ))}
      </svg>
    </div>
  );
}

function Strip({ surah, passages, selected, onSelect }: { surah: Surah; passages: Passage[]; selected: number; onSelect: (i: number) => void }) {
  const hits = useMemo(() => {
    const map = new Map<number, number[]>();
    passages.forEach((p, i) => {
      for (const side of [p.a, p.b]) {
        if (side.from.surah !== surah.n) continue;
        for (let a = side.from.ayah; a <= side.to.ayah; a++) map.set(a, [...(map.get(a) ?? []), i]);
      }
    });
    return map;
  }, [passages, surah.n]);
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label={`آيات ${plainName(surah.name)}`}>
      {Array.from({ length: surah.count }, (_, k) => k + 1).map(a => {
        const at = hits.get(a);
        const on = at?.includes(selected);
        const look = on ? 'bg-amber-600 dark:bg-amber-300' : at ? 'bg-amber-300 dark:bg-amber-700' : 'bg-gray-200 dark:bg-gray-800';
        return at ? (
          <button key={a} type="button" onClick={() => onSelect(at[(at.indexOf(selected) + 1) % at.length])} title={`الآية ${num(a)}`} aria-label={`الآية ${num(a)}: نص مشترك`} className={`h-6 w-6 rounded-sm ${look}`} />
        ) : (
          <span key={a} title={`الآية ${num(a)}`} className={`h-6 w-6 rounded-sm ${look}`} />
        );
      })}
    </div>
  );
}

function Side({ title, side, marks, ayat, count, surah }: { title: string; side: Passage['a']; marks: number[]; ayat: Record<string, string>; count: number; surah: Ayah['surah'] }) {
  const [full, setFull] = useState(false);
  const [after, setAfter] = useState(0);
  const [fetched, setFetched] = useState<Record<string, string>>({});
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const n = side.from.surah;
  const known = { ...fetched, ...ayat };
  const cards = sideCards(side, marks, known, { full, after });
  const partial = !full && sideCards(side, marks, known, { full: true }).some((c, i) => c.text !== cards[i].text);

  const more = async () => {
    setFailed(false);
    setLoading(true);
    if (!known[`${n}:${side.to.ayah + after + 1}`]) {
      try {
        const res = await fetch(`/api/quran/surahs/${n}`);
        if (!res.ok) throw new Error(String(res.status));
        const body: { ayat: { number: number; text: string }[] } = await res.json();
        setFetched(Object.fromEntries(body.ayat.map(a => [`${n}:${a.number}`, ayahWords(a.text, a.number === 1 && n !== 1 && n !== 9).display.join(' ')])));
      } catch {
        setFailed(true);
        setLoading(false);
        return;
      }
    }
    setAfter(a => a + 1);
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-xl mb-2 text-amber-600 dark:text-amber-400">{title}</h3>
      {cards.map(c => (
        <AyahCard key={c.ayah} ayah={{ id: `${c.surah}:${c.ayah}`, number: c.ayah, text: c.text, surah } as unknown as Ayah} slots={sharedSlots(c.text.split(' ').length, c.marks)} />
      ))}
      <div className="flex flex-wrap gap-2">
        {partial && (
          <Button size="sm" onClick={() => setFull(true)}>
            <FontAwesomeIcon icon={faExpand} />
            عرض الآية كاملة
          </Button>
        )}
        {side.to.ayah + after < count && (
          <Button size="sm" disabled={loading} onClick={more}>
            <FontAwesomeIcon icon={faAnglesDown} />
            عرض الآية التالية
          </Button>
        )}
      </div>
      {failed && <p role="alert" className="text-sm text-red-600 dark:text-red-400 mt-2">تعذر تحميل الآية.</p>}
    </div>
  );
}

export default function QuranDemo({ runs, ayat }: { runs: Runs; ayat: Record<string, string> }) {
  const { surahs, passages } = runs;
  const [selected, setSelected] = useState(0);
  const [stripSurah, setStripSurah] = useState<number | null>(null);
  const p = passages[selected];
  const shown = surahs[(stripSurah ?? p.a.from.surah) - 1];
  const involved = new Set(passages.flatMap(x => [x.a.from.surah, x.b.from.surah]));
  const pick = (i: number) => { setSelected(i); setStripSurah(null); };
  const surahOf = (n: number) => ({ id: `s${n}`, number: n, name: surahs[n - 1].name, nameTransliterated: null }) as unknown as Ayah['surah'];
  const totalAyat = surahs.reduce((sum, s) => sum + s.count, 0);

  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl">القرآن: نصوص مشتركة بين السور</h1>
          <Badge text="تجريبي" color="amber" size="sm" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          عرض تجريبي لم يراجعه أحد من أهل العلم. النص برواية حفص. النص المشترك هو تتابع من {num(runs.minWords)} كلمات فأكثر
          يتطابق في سورتين بعد حذف التشكيل وتوحيد صور بعض الحروف، وقد يتخلله اختلاف في بعض الكلمات. يدل التطابق على اشتراك اللفظ وحده.
        </p>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Tile value={surahs.length} label="سورة" />
        <Tile value={totalAyat} label="آية" />
        <Tile value={passages.length} label="نص مشترك" />
        <Tile value={involved.size} label="سورة فيها نص مشترك" />
      </section>

      <section className={PANEL}>
        <h2 className="text-2xl mb-1">عدد الآيات في كل سورة</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">السور بترتيب المصحف من اليمين إلى اليسار. اضغط على عمود لعرض آيات السورة أدناه.</p>
        <SurahBars surahs={surahs} onPick={n => { setStripSurah(n); document.getElementById('surah-strip')?.scrollIntoView({ behavior: 'smooth' }); }} />
      </section>

      <section className={PANEL}>
        <h2 className="text-2xl mb-1">النصوص المشتركة بين السور</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">كل قوس يصل سورتين يتشاركان نصًا. اضغط على قوس لقراءة النصين متجاورين.</p>
        <Arcs passages={passages} selected={selected} onSelect={pick} surahs={surahs} />
      </section>

      <section className={PANEL}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Button size="sm" disabled={selected === 0} onClick={() => pick(selected - 1)}>
            <FontAwesomeIcon icon={faArrowRight} />
            السابق
          </Button>
          <select
            aria-label="اختر نصًا مشتركًا"
            value={selected}
            onChange={e => pick(Number(e.target.value))}
            className="min-w-0 flex-1 rounded border border-amber-400 bg-white dark:bg-gray-900 px-2 py-1 text-sm"
          >
            {passages.map((x, i) => (
              <option key={i} value={i}>{`${plainName(surahs[x.a.from.surah - 1].name)} ${num(x.a.from.ayah)} ← ${plainName(surahs[x.b.from.surah - 1].name)} ${num(x.b.from.ayah)}`}</option>
            ))}
          </select>
          <Button size="sm" disabled={selected === passages.length - 1} onClick={() => pick(selected + 1)}>
            التالي
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3 text-sm">
          <Badge size="sm" color="gray" text={`${num(p.matched)} كلمة متطابقة`} />
          <Badge size="sm" color="gray" text={`يرد في ${num(p.places)} مواضع`} />
          <Badge size="sm" color="gray" text={p.marksA.length + p.marksB.length === 0 ? 'لا اختلاف في الكلمات' : `${num(p.marksA.length)} كلمة مختلفة في الأول و${num(p.marksB.length)} في الثاني`} />
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-3">
          <Side key={`a${selected}`} title={plainName(surahs[p.a.from.surah - 1].name)} side={p.a} marks={p.marksA} ayat={ayat} count={surahs[p.a.from.surah - 1].count} surah={surahOf(p.a.from.surah)} />
          <Side key={`b${selected}`} title={plainName(surahs[p.b.from.surah - 1].name)} side={p.b} marks={p.marksB} ayat={ayat} count={surahs[p.b.from.surah - 1].count} surah={surahOf(p.b.from.surah)} />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">الكلمات المسطَّرة هي ما اختلف بين النصين.</p>
      </section>

      <section id="surah-strip" className={PANEL}>
        <h2 className="text-2xl mb-1">مواضع النص المشترك في {plainName(shown.name)}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">كل مربع آية. الملوّن منها داخل نص مشترك، والغامق هو النص المعروض أعلاه.</p>
        <Strip surah={shown} passages={passages} selected={selected} onSelect={i => { setSelected(i); setStripSurah(shown.n); }} />
      </section>
    </div>
  );
}
