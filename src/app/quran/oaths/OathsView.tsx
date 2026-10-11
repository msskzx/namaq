'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { RAIL_COLORS, RailCell } from '@/components/quran/Rail';
import { num } from '@/lib/quran/arabicNumber';
import type { OathView, WordLine } from '@/lib/quran/oaths';

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';

export default function OathsView({ oaths, lines }: { oaths: OathView[]; lines: WordLine[] }) {
  const colorOf = (id: string) => RAIL_COLORS[lines.findIndex(l => l.id === id) % RAIL_COLORS.length];
  const [on, setOn] = useState<Set<string>>(() => new Set(lines.map(l => l.id)));
  const toggle = (id: string) => setOn(prev => {
    const next = new Set(prev);
    if (!next.delete(id)) next.add(id);
    return next;
  });
  const active = lines.filter(l => on.has(l.id));
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-2" aria-label="الألفاظ">
        {lines.map(l => (
          <li key={l.id}>
            <Button size="sm" active={on.has(l.id)} aria-pressed={on.has(l.id)} onClick={() => toggle(l.id)}>
              <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${colorOf(l.id).bg}`} />
              <FontAwesomeIcon icon={faRoute} aria-hidden />
              {`${l.id} (${num(l.has.size)})`}
            </Button>
          </li>
        ))}
      </ul>
      <ol className="flex flex-col" aria-label="الأقسام">
        {oaths.map(o => (
          <li key={o.n} className="flex gap-1">
            <div className="min-w-0 flex-1 pb-2">
              <div className={`${PANEL} flex flex-col gap-2`}>
                <h2 className="text-xl">{`${num(o.surah)} ${o.name} ${num(o.range[0])}${o.range[1] > o.range[0] ? `-${num(o.range[1])}` : ''}`}</h2>
                {o.lines.map(l => (
                  <p key={l.ayah} className="text-2xl leading-[2.2] font-arabic">
                    <span className="text-sm text-amber-600 dark:text-amber-400 me-2">{num(l.ayah)}</span>
                    {l.text}
                  </p>
                ))}
                <ul className="flex flex-wrap gap-1" aria-label="المقسم به">
                  {o.by.map(w => (
                    <li key={w}>
                      <Badge text={w} size="sm" color="" className={lines.some(l => l.id === w) ? colorOf(w).badge : ''} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="order-first flex shrink-0 gap-0.5 sm:gap-1">
              {active.map(l => <RailCell key={l.id} span={l} n={o.n} color={colorOf(l.id)} label={`اللفظ: ${l.id}`} />)}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
