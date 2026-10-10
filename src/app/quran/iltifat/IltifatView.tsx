import React from 'react';
import { SLOT_COLORS } from '@/components/quran/slotColors';
import { MODES, type CuratedView, type Mode } from '@/lib/quran/curatedShifts';
import { Card } from '../shifts/ShiftsView';
import { num } from '@/lib/quran/arabicNumber';

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';

function CuratedCard({ item: { surah, parts, note } }: { item: CuratedView }) {
  const [from, to] = [parts[0].from, parts[parts.length - 1].to];
  return (
    <section className={PANEL}>
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h2 className="text-xl text-amber-600 dark:text-amber-400">{`${surah.plain} ${from === to ? num(from) : `${num(from)}–${num(to)}`}`}</h2>
      </div>
      <p className={`${NOTE} mb-3`}>{note}</p>
      <div className={parts.length > 1 ? 'grid md:grid-cols-2 gap-x-4' : ''}>
        {parts.map(p => (
          <div key={p.from}>
            {p.ayat.map((a, k) => <Card key={k} surah={surah} ayah={p.from + k} text={a.text} slots={a.slots} />)}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function IltifatView({ curated, modes }: { curated: CuratedView[]; modes: Mode[] }) {
  return (
    <div className="flex flex-col gap-3">
      <ul className={`${PANEL} flex flex-wrap gap-x-6 gap-y-2`} aria-label="ألوان الضمائر">
        {modes.map(m => (
          <li key={m} className="flex items-center gap-2 text-sm">
            <span className={`font-arabic text-xl ${SLOT_COLORS[MODES[m].slot]}`}>{MODES[m].sample}</span>
            {MODES[m].label}
          </li>
        ))}
      </ul>
      <p className={NOTE}>
        يُلوَّن الفعل بحسب فاعله، والاسم والحرف بحسب الضمير المتصل بهما، ولو عاد الضمير على شيء لا على شخص. ويُترك الاسم الظاهر بلا ضمير، مثل «الرياح». ويدل اللون الكهرماني على عبارة تتكرر في آيتين.
      </p>
      <p className={NOTE}>
        أمثلة اختيرت باليد، بلا إحالات إلى كتب. لا يوجد شريط للشخص والعدد في السورة كلها لأن صيغ الكلمات وحدها لا تدل عليهما إلا في نحو ستين في المئة من المواضع، ولأن «نا» العظمة تلتبس بـ«نا» الجماعة.
      </p>
      {curated.map(c => <CuratedCard key={`${c.surah.number}:${c.parts[0].from}`} item={c} />)}
    </div>
  );
}
